import type { SyncHandler, SyncAccount, SyncHolding, SyncTransaction } from './types.js'
import { binanceSync } from './binance.sync.js'
import { iolSync } from './iol.sync.js'
import { mercadopagoSync } from './mercadopago.sync.js'
import { paypalSync } from './paypal.sync.js'

const handlers: Map<string, SyncHandler> = new Map()

function register(handler: SyncHandler) {
  handlers.set(handler.serviceId, handler)
}

register(binanceSync)
register(iolSync)
register(mercadopagoSync)
register(paypalSync)

export function getHandler(serviceId: string): SyncHandler | undefined {
  return handlers.get(serviceId)
}

export function getRegisteredServices(): string[] {
  return [...handlers.keys()]
}

export interface SyncLogEntry {
  serviceId: string
  success: boolean
  accounts: SyncAccount[]
  holdings: SyncHolding[]
  transactions: SyncTransaction[]
  error?: string
}

export async function runSync(serviceId: string, userId: number, credentials: Record<string, string>): Promise<SyncLogEntry> {
  const handler = getHandler(serviceId)

  if (!handler) {
    return {
      serviceId,
      success: false,
      accounts: [],
      holdings: [],
      transactions: [],
      error: `No hay sincronización automática disponible para este servicio. Seguí los pasos manuales desde la app.`,
    }
  }

  try {
    const result = await handler.sync(userId, credentials)
    return {
      serviceId,
      success: true,
      accounts: result.accounts,
      holdings: result.holdings,
      transactions: result.transactions ?? [],
    }
  } catch (err: any) {
    return {
      serviceId,
      success: false,
      accounts: [],
      holdings: [],
      transactions: [],
      error: err.message || 'Error de sincronización',
    }
  }
}
