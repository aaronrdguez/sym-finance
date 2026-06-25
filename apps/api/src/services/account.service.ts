import db from '../utils/db'
import crypto from 'node:crypto'
import type { Prisma as PrismaTypes } from '../generated/prisma/client.js'

export async function listAccounts(userId: number) {
  const accounts = await db.account.findMany({ where: { userId } })
  return accounts.map((a: PrismaTypes.AccountGetPayload<{}>) => ({ ...a, balance: Number(a.balance) }))
}

export async function createAccount(
  userId: number,
  data: { name: string; icon: string; color: string; type: string; currency: string; balance: number }
) {
  return db.account.create({
    data: {
      uuid: crypto.randomUUID(),
      userId,
      name: data.name,
      icon: data.icon,
      color: data.color,
      type: data.type,
      currency: data.currency,
      balance: data.balance
    }
  })
}

export async function updateAccount(
  userId: number,
  accountUuid: string,
  data: Partial<{ name: string; icon: string; color: string; type: string; currency: string; balance: number }>
) {
  const account = await db.account.findFirst({ where: { uuid: accountUuid, userId } })

  if (!account) return false

  if (account.connectionUuid) {
    throw new Error('No se puede editar una cuenta sincronizada automáticamente')
  }

  await db.account.update({ where: { id: account.id }, data })

  return true
}

export async function deleteAccount(userId: number, accountUuid: string) {
  const account = await db.account.findFirst({ where: { uuid: accountUuid, userId } })

  if (!account) return false

  if (account.connectionUuid) {
    throw new Error('No se puede eliminar una cuenta sincronizada automáticamente')
  }

  await db.operation.deleteMany({ where: { accountId: account.id } })
  await db.account.delete({ where: { id: account.id } })

  return true
}
