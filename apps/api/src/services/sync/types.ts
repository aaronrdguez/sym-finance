export interface SyncAccount {
  name: string
  balance: number
  currency: string
  icon?: string
  color?: string
  type?: string
}

export interface SyncHolding {
  symbol: string
  name: string
  quantity: number
  price: number
  type: 'STOCK' | 'BOND' | 'TREASURY_BILL' | 'CRYPTO'
}

export interface SyncTransaction {
  externalId: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string
  currency: string
  date: string
}

export interface SyncResult {
  accounts: SyncAccount[]
  holdings: SyncHolding[]
  transactions?: SyncTransaction[]
}

export interface SyncHandler {
  serviceId: string
  displayName: string
  sync(userId: number, credentials: Record<string, string>): Promise<SyncResult>
}
