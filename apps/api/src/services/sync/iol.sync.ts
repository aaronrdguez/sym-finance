import type { SyncHandler, SyncResult } from './types.js'

const IOL_API_BASE = 'https://api.invertironline.com/api/v2'
const IOL_TOKEN_URL = 'https://api.invertironline.com/token'

const JSON_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept': 'application/json',
}

interface IOLTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

interface IOLAccountInfo {
  numero: string
  titular: string
  saldo: number
  saldoValorizado: number
  moneda: string
}

interface IOLEstadoCuentaResponse {
  cuentas: IOLAccountInfo[]
}

interface IOLPortfolioTitle {
  simbolo: string
  nombre: string
  tipo: string
  cantidad: number
  precioCompra: number
  precioActual: number
  moneda: string
  valorizado: number
}

interface IOLPortfolioResponse {
  titulos: IOLPortfolioTitle[]
  resumen: {
    totalValorizado: number
    variacionDiaria: number
    ganancia: number
  }
}

const ASSET_TYPE_MAP: Record<string, 'STOCK' | 'BOND' | 'TREASURY_BILL' | 'CRYPTO'> = {
  acciones: 'STOCK',
  cedears: 'STOCK',
  bonos: 'BOND',
  letras: 'TREASURY_BILL',
  obligacionesnegociables: 'BOND',
  obligaciones_negociables: 'BOND',
  on: 'BOND',
  fci: 'STOCK',
  cauciones: 'BOND',
  opciones: 'STOCK',
  futuros: 'STOCK',
  etf: 'STOCK',
}

function detectAssetType(tipo: string, simbolo: string): 'STOCK' | 'BOND' | 'TREASURY_BILL' | 'CRYPTO' {
  const key = (tipo ?? '').toLowerCase().replace(/\s+/g, '')
  const sym = (simbolo ?? '').toUpperCase()

  if (ASSET_TYPE_MAP[key]) return ASSET_TYPE_MAP[key]
  if (sym.startsWith('US')) return 'STOCK'
  if (sym.startsWith('AL') || sym.startsWith('GD') || sym.startsWith('AE')) return 'BOND'
  if (key.includes('bono') || key.includes('bonder')) return 'BOND'

  return 'STOCK'
}

async function login(username: string, password: string): Promise<string> {
  const body = new URLSearchParams({ username, password, grant_type: 'password' })

  const res = await fetch(IOL_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    body: body.toString(),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    
    if (res.status === 401) throw new Error('Usuario o contraseña incorrectos. Si es la primera vez, necesitás activar las APIs desde Mi Cuenta → Mensajes en invertironline.com.')
    
    throw new Error(`Error de conexión con IOL (${res.status}): ${text}`)
  }

  const data = await res.json() as IOLTokenResponse
  
  return data.access_token
}

async function apiGet<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`${IOL_API_BASE}${path}`, {
    headers: { ...JSON_HEADERS, 'Authorization': `Bearer ${token}` },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`IOL API error (${res.status}) ${path}: ${text}`)
  }

  return res.json() as Promise<T>
}

export const iolSync: SyncHandler = {
  serviceId: 'iol',
  displayName: 'IOL (InvertirOnline)',

  async sync(userId, credentials) {
    const { username, password } = credentials
    if (!username || !password) throw new Error('Usuario y contraseña requeridos')

    const token = await login(username, password)

    const estadoCuenta = await apiGet<IOLEstadoCuentaResponse>(token, '/estadocuenta')
    const monedaToCurrency: Record<string, string> = { pesos: 'ARS', ARS: 'ARS', dolar: 'USD', USD: 'USD' }

    const accounts: SyncResult['accounts'] = (estadoCuenta.cuentas ?? []).map(c => ({
      name: `IOL ${monedaToCurrency[c.moneda] === 'ARS' ? 'Pesos' : 'Dólares'}`,
      balance: c.saldo ?? 0,
      currency: monedaToCurrency[c.moneda] || c.moneda,
      icon: 'TrendingUp',
      color: '#6439FF',
      type: 'investment',
    }))

    const paises = ['argentina', 'usa']
    const allHoldings: SyncResult['holdings'] = []

    for (const pais of paises) {
      try {
        const portfolio = await apiGet<IOLPortfolioResponse>(token, `/portafolio/${pais}`)
        if (portfolio.titulos?.length) {
          for (const t of portfolio.titulos) {
            allHoldings.push({
              symbol: t.simbolo.toUpperCase(),
              name: t.nombre,
              quantity: t.cantidad,
              price: t.precioActual,
              type: detectAssetType(t.tipo, t.simbolo),
            })
          }
        }
      } catch {
        // skip country if it fails
      }
    }

    return { accounts, holdings: allHoldings }
  },
}
