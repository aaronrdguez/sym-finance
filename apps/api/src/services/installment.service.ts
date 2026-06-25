import db from '../utils/db'
import type { Prisma as PrismaTypes } from '../generated/prisma/client.js'

export async function listInstallments(userId: number) {
  const installments = await db.installment.findMany({
    where: { userId },
    orderBy: { startDate: 'desc' }
  })

  return installments.map((i: PrismaTypes.InstallmentGetPayload<{}>) => ({
    uuid: i.uuid,
    description: i.description,
    totalAmount: Number(i.totalAmount),
    totalPaid: Number(i.totalPaid),
    installmentCount: i.installmentCount,
    paidInstallments: i.paidInstallments,
    startDate: i.startDate.toISOString().split('T')[0],
    frequency: i.frequency,
    category: i.category,
    currency: i.currency,
    completed: i.completed,
    notes: i.notes || '',
    createdAt: i.createdAt.toISOString()
  }))
}

export async function createInstallment(
  userId: number,
  data: {
    description: string
    totalAmount: number
    installmentCount: number
    startDate: string
    frequency: string
    category: string
    currency: string
    notes?: string
  }
) {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) return false

  const installmentAmount = data.totalAmount / data.installmentCount

  return db.installment.create({
    data: {
      uuid: crypto.randomUUID(),
      userId,
      description: data.description,
      totalAmount: data.totalAmount,
      totalPaid: 0,
      installmentCount: data.installmentCount,
      paidInstallments: 0,
      startDate: new Date(data.startDate),
      frequency: data.frequency as any,
      category: data.category,
      currency: data.currency,
      notes: data.notes || ''
    }
  })
}

export async function payInstallment(userId: number, uuid: string) {
  const inst = await db.installment.findFirst({ where: { uuid, userId } })

  if (!inst) return false

  const installmentAmount = Number(inst.totalAmount) / inst.installmentCount
  const newPaidInstallments = inst.paidInstallments + 1
  const newTotalPaid = Number(inst.totalPaid) + installmentAmount
  const completed = newPaidInstallments >= inst.installmentCount

  await db.installment.update({
    where: { id: inst.id },
    data: {
      paidInstallments: newPaidInstallments,
      totalPaid: newTotalPaid,
      completed
    }
  })

  return true
}

export async function updateInstallment(
  userId: number,
  uuid: string,
  data: Partial<{
    description: string
    totalAmount: number
    installmentCount: number
    startDate: string
    frequency: string
    category: string
    currency: string
    notes: string
    completed: boolean
  }>
) {
  const inst = await db.installment.findFirst({ where: { uuid, userId } })

  if (!inst) return false

  const updateData: any = {}
  if (data.description !== undefined) updateData.description = data.description
  if (data.totalAmount !== undefined) updateData.totalAmount = data.totalAmount
  if (data.installmentCount !== undefined) updateData.installmentCount = data.installmentCount
  if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate)
  if (data.frequency !== undefined) updateData.frequency = data.frequency
  if (data.category !== undefined) updateData.category = data.category
  if (data.currency !== undefined) updateData.currency = data.currency
  if (data.notes !== undefined) updateData.notes = data.notes
  if (data.completed !== undefined) updateData.completed = data.completed

  await db.installment.update({ where: { id: inst.id }, data: updateData })

  return true
}

export async function deleteInstallment(userId: number, uuid: string) {
  const inst = await db.installment.findFirst({ where: { uuid, userId } })

  if (!inst) return false

  await db.installment.delete({ where: { id: inst.id } })
  
  return true
}
