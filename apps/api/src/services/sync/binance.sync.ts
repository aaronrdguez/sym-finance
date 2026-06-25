import crypto from 'node:crypto'
import type { SyncHandler, SyncResult } from './types.js'

const BINANCE_API = 'https://api.binance.com'

interface BinanceBalance {
  asset: string
  free: string
  locked: string
}

interface BinanceAccountInfo {
  balances: BinanceBalance[]
  canTrade: boolean
}

async function signRequest(apiSecret: string, query: string): Promise<string> {
  return crypto.createHmac('sha256', apiSecret).update(query).digest('hex')
}

async function binanceGet<T>(apiKey: string, apiSecret: string, path: string): Promise<T> {
  const timestamp = Date.now()
  const query = `timestamp=${timestamp}`
  const signature = await signRequest(apiSecret, query)

  const res = await fetch(`${BINANCE_API}${path}?${query}&signature=${signature}`, {
    headers: { 'X-MBX-APIKEY': apiKey },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Binance API error (${res.status}): ${text}`)
  }

  return res.json() as Promise<T>
}

const STABLE_COINS = new Set([
  'USDT', 'USDC', 'BUSD', 'DAI', 'FDUSD', 'TUSD', 'USDP', 'PAX', 'GUSD', 'HUSD', 'SUSD', 'LUSD', 'FRAX', 'PYUSD',
  'EUR', 'GBP', 'BRL', 'ARS', 'COP', 'CLP', 'PEN', 'UYU',
])

async function getPrices(symbols: string[]): Promise<Record<string, { price: number; change24h: number | null }>> {
  const ids = symbols.map(s => s.toLowerCase()).join(',')
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  })

  if (!res.ok) return {}

  const data = await res.json() as Record<string, { usd: number; usd_24h_change?: number }>
  const result: Record<string, { price: number; change24h: number | null }> = {}

  for (const [id, val] of Object.entries(data)) {
    result[id.toLowerCase()] = { price: val.usd, change24h: val.usd_24h_change ?? null }
  }

  return result
}

const COINGECKO_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  SOL: 'solana',
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  DOT: 'polkadot',
  MATIC: 'matic-network',
  SHIB: 'shiba-inu',
  AVAX: 'avalanche-2',
  LINK: 'chainlink',
  UNI: 'uniswap',
  ATOM: 'cosmos',
  LTC: 'litecoin',
  BCH: 'bitcoin-cash',
  TRX: 'tron',
  XLM: 'stellar',
  FIL: 'filecoin',
  APT: 'aptos',
  SUI: 'sui',
  ARB: 'arbitrum',
  OP: 'optimism',
}

export const binanceSync: SyncHandler = {
  serviceId: 'binance',
  displayName: 'Binance',

  async sync(userId, credentials) {
    const { apiKey, secretKey } = credentials
    if (!apiKey || !secretKey) throw new Error('API Key y Secret Key son requeridas')

    const account = await binanceGet<BinanceAccountInfo>(apiKey, secretKey, '/api/v3/account')

    const nonZero = account.balances
      .filter(b => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0)
      .map(b => ({ asset: b.asset, total: parseFloat(b.free) + parseFloat(b.locked) }))

    const cryptoBalances = nonZero.filter(b => !STABLE_COINS.has(b.asset))
    const stableBalances = nonZero.filter(b => STABLE_COINS.has(b.asset))

    const coinSymbols = cryptoBalances.map(b => COINGECKO_MAP[b.asset]).filter(Boolean)
    const prices = coinSymbols.length > 0 ? await getPrices(coinSymbols) : {}

    let usdValue = 0
    const holdings: SyncResult['holdings'] = []

    for (const b of cryptoBalances) {
      const coinId = COINGECKO_MAP[b.asset]
      const priceData = coinId ? prices[coinId.toLowerCase()] : null
      const price = priceData?.price ?? 0

      if (price > 0) usdValue += price * b.total

      holdings.push({
        symbol: `${b.asset}USDT`,
        name: b.asset,
        quantity: b.total,
        price,
        type: 'CRYPTO',
      })
    }

    const usdTotal = stableBalances.find(b => b.asset === 'USDT')?.total ?? 0
    usdValue += usdTotal

    const accounts: SyncResult['accounts'] = [{
      name: 'Binance Wallet',
      balance: usdValue,
      currency: 'USD',
      icon: 'Wallet',
      color: '#F3BA2F',
      type: 'investment',
    }]

    return { accounts, holdings }
  },
}
