import db from '../utils/db.js'
import { encrypt, decrypt } from '../utils/encryption.js'
import crypto from 'node:crypto'

export async function listConnections(userId: number) {
  const connections = await db.connection.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })

  return connections.map(c => ({
    uuid: c.uuid, service: c.service, label: c.label || '', enabled: c.enabled, hasCredentials: c.credentials.length > 0, createdAt: c.createdAt.toISOString()
  }))
}

export async function getConnection(uuid: string, userId: number) {
  const c = await db.connection.findFirst({ where: { uuid, userId } })

  if (!c) return null

  let credentials: Record<string, string> = {}

  try {
    const decrypted = decrypt(c.credentials)
    credentials = JSON.parse(decrypted)
  } catch {}

  return {
    uuid: c.uuid,
    service: c.service,
    label: c.label || '',
    enabled: c.enabled,
    credentials,
    createdAt: c.createdAt.toISOString()
  }
}

export async function createConnection(
  userId: number,
  data: {
    service: string
    label?: string
    credentials: Record<string, string>
    enabled?: boolean
  }
) {
  const encrypted = encrypt(JSON.stringify(data.credentials))

  return db.connection.create({
    data: { uuid: crypto.randomUUID(), userId, service: data.service, label: data.label || null, credentials: encrypted, enabled: data.enabled ?? true }
  })
}

export async function updateConnection(
  uuid: string,
  userId: number,
  data: {
    label?: string
    credentials?: Record<string, string>
    enabled?: boolean
  }
) {
  const existing = await db.connection.findFirst({ where: { uuid, userId } })

  if (!existing) return false

  const updateData: Record<string, unknown> = {}

  if (data.label !== undefined) updateData.label = data.label
  if (data.enabled !== undefined) updateData.enabled = data.enabled
  if (data.credentials) updateData.credentials = encrypt(JSON.stringify(data.credentials))

  await db.connection.update({ where: { id: existing.id }, data: updateData as any })
  return true
}

export async function deleteConnection(uuid: string, userId: number) {
  const existing = await db.connection.findFirst({ where: { uuid, userId } })

  if (!existing) return false

  const accounts = await db.account.findMany({ where: { connectionUuid: uuid, userId } })
  const accountIds = accounts.map(a => a.id)

  if (accountIds.length > 0) {
    await db.operation.deleteMany({ where: { accountId: { in: accountIds }, userId } })
    await db.account.deleteMany({ where: { id: { in: accountIds }, userId } })
  }

  await db.connection.delete({ where: { id: existing.id } })
  return true
}
