import db from '../utils/db.js'
import crypto from 'node:crypto'
import * as preferenceService from './preference.service.js'
import * as connectionService from './connection.service.js'
import { runSync } from './sync/registry.js'
import type { SyncLogEntry } from './sync/registry.js'

interface OrchestrateResult {
  serviceId: string
  success: boolean
  accountsCreated: number
  accountsUpdated: number
  holdingsCreated: number
  holdingsUpdated: number
  favoritesAdded: number
  transactionsCreated: number
  error?: string
}

export async function orchestrateSync(userUuid: string, userId: number, connectionUuid: string): Promise<OrchestrateResult> {
  const conn = await connectionService.getConnection(connectionUuid, userId)
  
  if (!conn || !conn.enabled) throw new Error('Connection not found or disabled')

  const log: SyncLogEntry = await runSync(conn.service, userId, conn.credentials as Record<string, string>)
  
  const result: OrchestrateResult = {
    serviceId: conn.service,
    success: log.success,
    accountsCreated: 0,
    accountsUpdated: 0,
    holdingsCreated: 0,
    holdingsUpdated: 0,
    favoritesAdded: 0,
    transactionsCreated: 0,
    error: log.error,
  }

  if (!log.success) return result

  const existingAccounts = await db.account.findMany({ where: { userId } })
  const existingHoldings = await db.portfolioItem.findMany({ where: { userId } })

  for (const acct of log.accounts) {
    const existing = existingAccounts.find(a => a.name === acct.name && a.currency === acct.currency)

    if (existing) {
      await db.account.update({
        where: { id: existing.id },
        data: { balance: acct.balance, connectionUuid },
      })
      result.accountsUpdated++
    } else {
      await db.account.create({
        data: {
          uuid: crypto.randomUUID(),
          userId,
          name: acct.name,
          icon: acct.icon || 'Wallet',
          color: acct.color || '#6366f1',
          type: acct.type || 'investment',
          currency: acct.currency,
          balance: acct.balance,
          connectionUuid,
        },
      })
      result.accountsCreated++
    }
  }

  for (const h of log.holdings) {
    const existing = existingHoldings.find(p => p.symbol === h.symbol)

    if (existing) {
      await db.portfolioItem.update({
        where: { id: existing.id },
        data: {
          quantity: h.quantity,
          currentPrice: h.price,
          purchasePrice: h.price,
          name: h.name,
          type: h.type,
        },
      })
      result.holdingsUpdated++
    } else {
      await db.portfolioItem.create({
        data: {
          uuid: crypto.randomUUID(),
          userId,
          type: h.type,
          symbol: h.symbol,
          name: h.name,
          quantity: h.quantity,
          purchasePrice: h.price,
          currentPrice: h.price,
        },
      })
      result.holdingsCreated++
    }
  }

  if (log.holdings.length > 0) {
    const stockSymbols = log.holdings
      .filter(h => h.type !== 'CRYPTO')
      .map(h => h.symbol)

    const cryptoSymbols = log.holdings
      .filter(h => h.type === 'CRYPTO')
      .map(h => h.symbol)

    const currentPrefs = (await preferenceService.getPreferences(userUuid)) as Record<string, unknown>

    if (stockSymbols.length > 0) {
      const existingStocks: string[] = (currentPrefs.favoriteStocks as string[]) ?? []
      const merged = [...new Set([...existingStocks, ...stockSymbols])]
      await preferenceService.setFavorites(userUuid, 'favoriteStocks', merged)
      result.favoritesAdded += stockSymbols.length
    }

    if (cryptoSymbols.length > 0) {
      const existingCryptos: string[] = (currentPrefs.favoriteCryptos as string[]) ?? []
      const merged = [...new Set([...existingCryptos, ...cryptoSymbols])]
      await preferenceService.setFavorites(userUuid, 'favoriteCryptos', merged)
      result.favoritesAdded += cryptoSymbols.length
    }
  }

  if (log.transactions.length > 0) {
    const existingIds = new Set(
      (await db.operation.findMany({
        where: { userId, externalId: { not: null } },
        select: { externalId: true },
      })).map(op => op.externalId)
    )

    const syncedAccount = await db.account.findFirst({
      where: { userId, connectionUuid },
      orderBy: { createdAt: 'asc' },
    })

    if (syncedAccount) {
      for (const txn of log.transactions) {
        if (existingIds.has(txn.externalId)) continue

        await db.operation.create({
          data: {
            uuid: crypto.randomUUID(),
            userId,
            accountId: syncedAccount.id,
            category: txn.category,
            amount: txn.type === 'expense' ? -Math.abs(txn.amount) : txn.amount,
            description: txn.description,
            currency: txn.currency,
            type: txn.type,
            date: new Date(txn.date),
            externalId: txn.externalId,
          },
        })
        result.transactionsCreated++
      }
    }
  }

  return result
}
