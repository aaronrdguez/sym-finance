import * as connectionService from './connection.service.js'

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

export interface IOLCredentials {
  username: string
  password: string
}

export interface IOLSyncData {
  accounts: { numero: string; titular: string; saldo: number; moneda: string }[]
  holdings: IOLPortfolioTitle[]
}

async function login(username: string, password: string): Promise<string> {
  const body = new URLSearchParams({
    username,
    password,
    grant_type: 'password',
  })

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
    if (res.status === 401) {
      throw new Error('Usuario o contraseña incorrectos. Si es la primera vez, necesitás activar las APIs desde Mi Cuenta → Mensajes en invertironline.com.')
    }
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

export async function getEstadoCuenta(token: string): Promise<IOLEstadoCuentaResponse> {
  return apiGet<IOLEstadoCuentaResponse>(token, '/estadocuenta')
}

export async function getPortfolio(token: string, pais: string): Promise<IOLPortfolioResponse> {
  return apiGet<IOLPortfolioResponse>(token, `/portafolio/${pais}`)
}

export async function fetchIOLData(connectionUuid: string, userId: number): Promise<IOLSyncData> {
  const conn = await connectionService.getConnection(connectionUuid, userId)

  if (!conn || !conn.enabled) throw new Error('Connection not found or disabled')
  if (conn.service !== 'iol') throw new Error('Not an IOL connection')

  const { username, password } = conn.credentials as unknown as IOLCredentials
  if (!username || !password) throw new Error('IOL credentials missing')

  const token = await login(username, password)

  const estadoCuenta = await getEstadoCuenta(token)

  const accounts = estadoCuenta.cuentas?.map(c => ({
    numero: c.numero,
    titular: c.titular,
    saldo: c.saldo ?? 0,
    moneda: c.moneda === 'pesos' ? 'ARS' : 'USD',
  })) ?? []

  const paises = ['argentina', 'usa']
  const allHoldings: IOLPortfolioTitle[] = []

  for (const pais of paises) {
    try {
      const portfolio = await getPortfolio(token, pais)
      if (portfolio.titulos?.length) {
        allHoldings.push(...portfolio.titulos)
      }
    } catch {
      // skip country if it fails
    }
  }

  return { accounts, holdings: allHoldings }
}
