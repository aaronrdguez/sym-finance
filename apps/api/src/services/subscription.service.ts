import db from '../utils/db'
import type { Prisma as PrismaTypes } from '../generated/prisma/client.js'

export async function listSubscriptions(userId: number) {
  const subscriptions = await db.subscription.findMany({
    where: { userId, active: true },
    orderBy: { nextPaymentDate: 'asc' }
  })
  
  return subscriptions.map((s: PrismaTypes.SubscriptionGetPayload<{}>) => ({
    uuid: s.uuid,
    amount: Number(s.amount),
    currency: s.currency,
    description: s.description || '',
    reason: s.reason,
    frequency: s.frequency,
    nextPaymentDate: s.nextPaymentDate.toISOString().split('T')[0],
    active: s.active,
    createdAt: s.createdAt.toISOString()
  }))
}

export async function createSubscription(
  userId: number,
  data: { amount: number; currency: string; description?: string; reason: string; frequency: string; nextPaymentDate: string }
) {
  const user = await db.user.findUnique({ where: { id: userId } })

  if (!user) return false

  return db.subscription.create({
    data: {
      uuid: crypto.randomUUID(),
      userId,
      amount: data.amount,
      currency: data.currency,
      description: data.description || '',
      reason: data.reason,
      frequency: data.frequency as any,
      nextPaymentDate: new Date(data.nextPaymentDate)
    }
  })
}

export async function updateSubscription(
  userId: number,
  uuid: string,
  data: Partial<{ amount: number; currency: string; description: string; reason: string; frequency: string; nextPaymentDate: string; active: boolean }>
) {
  const sub = await db.subscription.findFirst({ where: { uuid, userId } })

  if (!sub) return false

  const updateData: any = {}
  if (data.amount !== undefined) updateData.amount = data.amount
  if (data.currency !== undefined) updateData.currency = data.currency
  if (data.description !== undefined) updateData.description = data.description
  if (data.reason !== undefined) updateData.reason = data.reason
  if (data.frequency !== undefined) updateData.frequency = data.frequency
  if (data.nextPaymentDate !== undefined) updateData.nextPaymentDate = new Date(data.nextPaymentDate)
  if (data.active !== undefined) updateData.active = data.active

  await db.subscription.update({ where: { id: sub.id }, data: updateData })
  return true
}

export async function deleteSubscription(userId: number, uuid: string) {
  const sub = await db.subscription.findFirst({ where: { uuid, userId } })

  if (!sub) return false

  await db.subscription.delete({ where: { id: sub.id } })
  return true
}
