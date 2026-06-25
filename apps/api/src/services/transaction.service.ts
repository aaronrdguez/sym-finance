import db from '../utils/db'
import type { Prisma as PrismaTypes } from '../generated/prisma/client.js'

export async function listTransactions(userId: number) {
  const operations = await db.operation.findMany({
    where: { userId },
    include: { account: true },
    orderBy: { createdAt: 'desc' }
  })

  return operations.map((op: PrismaTypes.OperationGetPayload<{ include: { account: true } }>) => ({
    uuid: op.uuid,
    amount: Number(op.amount),
    type: op.type,
    name: op.description || op.category,
    category: op.category,
    description: op.description || '',
    currency: op.currency,
    date: op.date.toISOString(),
    account: op.account.name,
    externalId: op.externalId,
  }))
}

export async function createTransaction(
  userId: number,
  data: { accountName: string; amount: number; type: string; category: string; currency: string; description?: string; date?: string }
) {
  const account = await db.account.findFirst({
    where: { name: { equals: data.accountName, mode: 'insensitive' }, userId }
  })

  if (!account) return null

  const signedAmount = data.type === 'income' ? data.amount : -Math.abs(data.amount)

  const transaction = await db.operation.create({
    data: {
      uuid: crypto.randomUUID(),
      userId,
      accountId: account.id,
      category: data.category,
      amount: signedAmount,
      description: data.description || '',
      currency: data.currency,
      type: data.type,
      date: data.date ? new Date(data.date) : new Date()
    }
  })

  await db.account.update({
    where: { id: account.id },
    data: { balance: { increment: signedAmount } }
  })

  return transaction
}

export async function updateTransaction(
  userId: number,
  opUuid: string,
  data: Partial<{ amount: number; category: string; description: string; currency: string; date: string; type: string }>
) {
  const operation = await db.operation.findFirst({ where: { uuid: opUuid, userId } })

  if (!operation) return false

  const updateData: any = {}
  if (data.amount !== undefined) updateData.amount = data.amount
  if (data.category !== undefined) updateData.category = data.category
  if (data.description !== undefined) updateData.description = data.description
  if (data.currency !== undefined) updateData.currency = data.currency
  if (data.date !== undefined) updateData.date = new Date(data.date)
  if (data.type !== undefined) updateData.type = data.type

  await db.operation.update({ where: { id: operation.id }, data: updateData })
  return true
}

export async function deleteTransaction(userId: number, opUuid: string) {
  const operation = await db.operation.findFirst({ where: { uuid: opUuid, userId } })
 
  if (!operation) return false

  const account = await db.account.findFirst({ where: { id: operation.accountId } })
 
  if (account) {
    await db.account.update({
      where: { id: account.id },
      data: { balance: { decrement: Number(operation.amount) } }
    })
  }

  await db.operation.delete({ where: { id: operation.id } })
  return true
}
