import type { SyncHandler, SyncResult } from './types.js'

const API_BASE = 'https://api-m.sandbox.paypal.com'

async function getToken(clientId: string, clientSecret: string): Promise<string> {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch(`${API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'https://uri.paypal.com/services/reporting/balances/read openid',
    }).toString(),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`PayPal auth error (${res.status}): ${text}`)
  }

  const data = await res.json() as { access_token: string }
  return data.access_token
}

interface PayPalBalance {
  currency_code: string
  value: string
}

interface PayPalBalanceEntry {
  balance: {
    currency: string
    total_balance: PayPalBalance
    available_balance: PayPalBalance
    withheld_balance: PayPalBalance
  }
  as_of_time: string
}

interface PayPalUserInfo {
  user_id: string
  name?: string
  email?: string
  account_type?: string
}

async function apiGet<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'SyM Finance/1.0',
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`PayPal API error (${res.status}) ${path}: ${text}`)
  }

  return res.json() as Promise<T>
}

export const paypalSync: SyncHandler = {
  serviceId: 'paypal',
  displayName: 'PayPal',

  async sync(_userId, credentials) {
    const { clientId, clientSecret } = credentials
    if (!clientId || !clientSecret) throw new Error('Client ID y Client Secret requeridos')

    const token = await getToken(clientId, clientSecret)

    let accountName = 'PayPal'

    try {
      const userInfo = await apiGet<PayPalUserInfo>(token, '/v1/identity/openidconnect/userinfo')
      accountName = userInfo.name || userInfo.email || 'PayPal'
    } catch {
      // userinfo is optional
    }

    let accounts: SyncResult['accounts'] = []

    try {
      const balances = await apiGet<PayPalBalanceEntry[]>(token, '/v1/reporting/balances')

      if (Array.isArray(balances)) {
        accounts = balances.map(b => ({
          name: `${accountName} (${b.balance.currency})`,
          balance: parseFloat(b.balance.available_balance?.value || b.balance.total_balance?.value || '0'),
          currency: b.balance.currency,
          icon: 'Wallet',
          color: '#002991',
          type: 'wallet',
        }))
      }
    } catch {
      // balances endpoint may not be available for all account types
    }

    if (accounts.length === 0) {
      accounts.push({
        name: accountName,
        balance: 0,
        currency: 'USD',
        icon: 'Wallet',
        color: '#002991',
        type: 'wallet',
      })
    }

    return { accounts, holdings: [] }
  },
}
