import type { SyncHandler, SyncResult, SyncTransaction } from './types.js'

const API_BASE = 'https://api.mercadopago.com'

async function apiGet<T>(token: string, path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`)
  if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const res = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'User-Agent': 'SyM Finance/1.0',
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Mercado Pago API error (${res.status}) ${path}: ${text}`)
  }

  return res.json() as Promise<T>
}

async function apiPost<T>(token: string, path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'SyM Finance/1.0',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Mercado Pago API error (${res.status}) ${path}: ${text}`)
  }

  return res.json() as Promise<T>
}

async function apiGetText(token: string, path: string): Promise<string> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'SyM Finance/1.0',
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Mercado Pago API error (${res.status}) ${path}: ${text}`)
  }

  return res.text()
}

interface MPUserResponse {
  id: number
  nickname: string
  email: string
  first_name?: string
  last_name?: string
}

interface MPBalance {
  available_balance: number
  total_amount?: number
}

interface MPPayer {
  id: number
  email?: string
  type?: string
}

interface MPPayment {
  id: number
  date_created: string
  date_approved: string
  status: string
  transaction_amount: string
  description?: string
  currency_id: string
  operation_type?: string
  payment_type_id: string
  payment_method_id: string
  collector_id?: number
  payer_id?: number
  payer?: MPPayer
}

interface MPPaymentSearchResponse {
  paging: { total: number; limit: number; offset: number }
  results: MPPayment[]
}

interface MPSettlementTask {
  id: number
  status: string
  report_type: string
  file_name?: string
}

interface MPSettlementReport {
  id: number
  file_name: string
  status: string
  begin_date: string
  end_date: string
}

interface MPSettlementSearchResponse {
  results: MPSettlementReport[]
}

async function fetchRendimientosFromReport(token: string, beginDate: Date, endDate: Date): Promise<SyncTransaction[]> {
  const result: SyncTransaction[] = []

  try {
    const searchRes = await apiGet<MPSettlementSearchResponse>(token, '/v1/account/settlement_report/search', {
      begin_date: beginDate.toISOString(),
      end_date: endDate.toISOString(),
      limit: '5',
    })

    let report = searchRes.results.find(r => r.status === 'processed')

    if (!report) {
      const task = await apiPost<MPSettlementTask>(token, '/v1/account/settlement_report', {
        begin_date: beginDate.toISOString(),
        end_date: endDate.toISOString(),
      })

      for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 2000))
        const check = await apiGet<MPSettlementTask>(token, `/v1/account/settlement_report/task/${task.id}`)
        if (check.status === 'processed') {
          const refreshed = await apiGet<MPSettlementSearchResponse>(token, '/v1/account/settlement_report/search', {
            begin_date: beginDate.toISOString(),
            end_date: endDate.toISOString(),
            limit: '5',
          })
          report = refreshed.results.find(r => r.status === 'processed')
          break
        }
        if (check.status === 'failed') break
      }
    }

    if (!report) return result

    const csv = await apiGetText(token, `/v1/account/settlement_report/${report.file_name}`)
    const lines = csv.trim().split('\n')
    if (lines.length < 2) return result

    const headers = lines[0].split(';')
    const typeIdx = headers.indexOf('TRANSACTION_TYPE')
    const netAmountIdx = headers.indexOf('SETTLEMENT_NET_AMOUNT')
    const dateIdx = headers.indexOf('TRANSACTION_DATE')
    const currencyIdx = headers.indexOf('TRANSACTION_CURRENCY')
    if (typeIdx === -1 || netAmountIdx === -1) return result

    const seen = new Set<string>()
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(';')
      const type = cols[typeIdx]?.trim()
      if (type !== 'asset_management_gain' && type !== 'asset_management_loss') continue

      const amount = parseFloat((cols[netAmountIdx] || '0').replace(',', '.'))
      if (!amount) continue

      const rawDate = cols[dateIdx] || ''
      const date = rawDate ? new Date(rawDate).toISOString() : new Date().toISOString()
      const currency = cols[currencyIdx]?.trim() || 'ARS'
      const isGain = type === 'asset_management_gain'
      const externalId = `mp_rend_${report.id}_${i}`

      if (seen.has(externalId)) continue
      seen.add(externalId)

      result.push({
        externalId,
        amount: Math.abs(amount),
        type: isGain ? 'income' : 'expense',
        category: 'investments',
        description: isGain ? 'Rendimiento' : 'Rendimiento negativo',
        currency,
        date,
      })
    }
  } catch {
    // rendimientos are optional
  }

  return result
}

const CATEGORY_MAP: Record<string, string> = {
  credit_card: 'credit_card',
  debit_card: 'debit_card',
  account_money: 'transfer',
  ticket: 'cash',
  bank_transfer: 'transfer',
  atm: 'withdrawal',
  rapipago: 'cash',
  pagofacil: 'cash',
}

function detectCategory(payment: MPPayment): string {
  if (payment.operation_type === 'asset_management_gain' || payment.operation_type === 'asset_management_loss') {
    return 'investments'
  }
  return CATEGORY_MAP[payment.payment_type_id] || payment.operation_type || payment.payment_type_id || 'payment'
}

export const mercadopagoSync: SyncHandler = {
  serviceId: 'mercadopago',
  displayName: 'Mercado Pago',

  async sync(_userId, credentials) {
    const { accessToken } = credentials
    if (!accessToken) throw new Error('Access Token requerido')

    const user = await apiGet<MPUserResponse>(accessToken, '/users/me')

    let balance = 0
    try {
      const bal = await apiGet<MPBalance>(accessToken, `/users/${user.id}/mercadopago_account/balance`, { access_token: accessToken })
      balance = bal.available_balance ?? bal.total_amount ?? 0
    } catch {
      // balance endpoint may not be available for all account types
    }

    const accounts: SyncResult['accounts'] = [
      {
        name: 'Mercado Pago',
        balance,
        currency: 'ARS',
        icon: 'Wallet',
        color: '#00BCFF',
        type: 'wallet',
      },
    ]

    const transactions: SyncResult['transactions'] = []
    const now = new Date()
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    try {
      const payments = await apiGet<MPPaymentSearchResponse>(accessToken, '/v1/payments/search', {
        sort: 'date_created',
        criteria: 'desc',
        range: 'date_created',
        begin_date: threeMonthsAgo.toISOString(),
        end_date: now.toISOString(),
        limit: '50',
      })

      for (const p of payments.results) {
        if (p.status !== 'approved') continue

        let txType: 'income' | 'expense'
        if (p.operation_type === 'asset_management_gain') {
          txType = 'income'
        } else if (p.operation_type === 'asset_management_loss') {
          txType = 'expense'
        } else if (p.collector_id === user.id && p.payer_id !== user.id) {
          txType = 'income'
        } else if (p.payer_id === user.id && p.collector_id !== user.id) {
          txType = 'expense'
        } else {
          continue
        }

        let txName = p.description || ''
        if (!txName) {
          if (p.operation_type === 'asset_management_gain') {
            txName = 'Rendimiento'
          } else if (txType === 'income' && p.payer?.email) {
            txName = p.payer.email
          } else {
            txName = `${p.payment_method_id} - ${p.payment_type_id}`
          }
        }

        transactions.push({
          externalId: `mp_${p.id}`,
          amount: Math.abs(parseFloat(p.transaction_amount)),
          type: txType,
          category: detectCategory(p),
          description: txName,
          currency: p.currency_id || 'ARS',
          date: p.date_approved || p.date_created,
        })
      }
    } catch (err) {
      // transactions are optional — sync still succeeds without them
    }

    const rendimientos = await fetchRendimientosFromReport(accessToken, threeMonthsAgo, now)
    transactions.push(...rendimientos)

    return { accounts, holdings: [], transactions }
  },
}
