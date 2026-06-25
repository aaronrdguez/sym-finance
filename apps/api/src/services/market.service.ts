const YAHOO_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart'
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'
const EXCHANGE_BASE = 'https://open.er-api.com/v6/latest'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept': 'application/json',
}

interface ChartMeta {
  regularMarketPrice: number
  chartPreviousClose?: number
  currency: string
  shortName?: string
}

interface ChartResult {
  meta: ChartMeta
  timestamp: number[]
  indicators: { quote: { close: (number | null)[] }[] }
}

interface ExchangeData {
  base_code: string
  rates: Record<string, number>
  time_last_update_unix: number
}

export async function getExchangeRates(base = 'USD') {
  const res = await fetch(`${EXCHANGE_BASE}/${base}`, { headers: HEADERS })
  if (!res.ok) throw new Error('Failed to fetch exchange rates')
  const data = await res.json() as ExchangeData
  return { base: data.base_code, rates: data.rates, updated: data.time_last_update_unix }
}

export async function getStockQuote(symbol: string) {
  const res = await fetch(`${YAHOO_BASE}/${symbol}?interval=1d&range=1mo`, { headers: HEADERS })
  
  if (!res.ok) throw new Error(`Failed to fetch stock quote for ${symbol}`)
  
  const data = await res.json() as { chart: { result: ChartResult[] } }
  const result = data?.chart?.result?.[0]
  
  if (!result) throw new Error(`No data for symbol ${symbol}`)

  const meta = result.meta
  const closes = result.indicators?.quote?.[0]?.close
  const price = meta.regularMarketPrice
  const prevClose = meta.chartPreviousClose ?? (closes?.filter(Boolean).at(-2) as number | undefined) ?? price
  const change = price - prevClose
  const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0

  return { symbol: symbol.toUpperCase(), name: meta.shortName || symbol.toUpperCase(), price, currency: meta.currency, change, changePercent }
}

export async function getStockQuotes(symbols: string[]) {
  const results = await Promise.allSettled(symbols.map(s => getStockQuote(s)))
  
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<{ symbol: string; name: string; price: number; currency: string; change: number; changePercent: number }>).value)
}

export async function getCryptoPrice(coinId: string) {
  const res = await fetch(`${COINGECKO_BASE}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`, { headers: HEADERS })
  
  if (!res.ok) throw new Error(`Failed to fetch crypto price for ${coinId}`)
  
  const data = await res.json() as Record<string, { usd: number; usd_24h_change?: number }>
  const coin = data[coinId.toLowerCase()]
  
  if (!coin) throw new Error(`No data for coin ${coinId}`)
  
  return { id: coinId.toLowerCase(), price: coin.usd, change24h: coin.usd_24h_change ?? null }
}

export async function getCryptoPrices(coinIds: string[]) {
  const joined = coinIds.map(c => c.toLowerCase()).join(',')
  const res = await fetch(`${COINGECKO_BASE}/simple/price?ids=${joined}&vs_currencies=usd&include_24hr_change=true`, { headers: HEADERS })
  
  if (!res.ok) throw new Error('Failed to fetch crypto prices')
  
  const data = await res.json() as Record<string, { usd: number; usd_24h_change?: number }>
  
  return coinIds.map(id => ({
    id: id.toLowerCase(),
    price: data[id.toLowerCase()]?.usd ?? null,
    change24h: data[id.toLowerCase()]?.usd_24h_change ?? null,
  }))
}
