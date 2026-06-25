import db from '../utils/db'
import type { Prisma as PrismaTypes } from '../generated/prisma/client.js'

export async function listReserves(userId: number) {
  const reserves = await db.reserve.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
  
  return reserves.map((r: PrismaTypes.ReserveGetPayload<{}>) => ({
    uuid: r.uuid,
    name: r.name,
    targetAmount: Number(r.targetAmount),
    currentAmount: Number(r.currentAmount),
    category: r.category,
    currency: r.currency,
    deadline: r.deadline ? r.deadline.toISOString().split('T')[0] : null,
    completed: r.completed,
    completedAt: r.completedAt ? r.completedAt.toISOString() : null,
    createdAt: r.createdAt.toISOString()
  }))
}

export async function createReserve(
  userId: number,
  data: { name: string; targetAmount: number; currentAmount?: number; category: string; currency: string; deadline?: string }
) {
  const user = await db.user.findUnique({ where: { id: userId } })

  if (!user) return false

  return db.reserve.create({
    data: {
      uuid: crypto.randomUUID(),
      userId,
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount ?? 0,
      category: data.category,
      currency: data.currency,
      deadline: data.deadline ? new Date(data.deadline) : null
    }
  })
}

export async function updateReserve(
  userId: number,
  uuid: string,
  data: Partial<{ name: string; targetAmount: number; currentAmount: number; category: string; currency: string; deadline: string; completed: boolean }>
) {
  const reserve = await db.reserve.findFirst({ where: { uuid, userId } })
  
  if (!reserve) return false

  const updateData: any = {}

  if (data.name !== undefined) updateData.name = data.name
  if (data.targetAmount !== undefined) updateData.targetAmount = data.targetAmount
  if (data.currentAmount !== undefined) updateData.currentAmount = data.currentAmount
  if (data.category !== undefined) updateData.category = data.category
  if (data.currency !== undefined) updateData.currency = data.currency
  if (data.deadline !== undefined) updateData.deadline = data.deadline ? new Date(data.deadline) : null
  if (data.completed !== undefined) {
    updateData.completed = data.completed
    updateData.completedAt = data.completed ? new Date() : null
  }

  await db.reserve.update({ where: { id: reserve.id }, data: updateData })
  return true
}

export async function depositToReserve(userId: number, uuid: string, amount: number) {
  const reserve = await db.reserve.findFirst({ where: { uuid, userId } })

  if (!reserve) return false

  await db.reserve.update({
    where: { id: reserve.id },
    data: { currentAmount: { increment: amount } }
  })
  return true
}

export async function deleteReserve(userId: number, uuid: string) {
  const reserve = await db.reserve.findFirst({ where: { uuid, userId } })

  if (!reserve) return false

  await db.reserve.delete({ where: { id: reserve.id } })
  return true
}
