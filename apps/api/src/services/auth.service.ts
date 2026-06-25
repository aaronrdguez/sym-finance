import bcrypt from 'bcrypt'
import * as jwt from '../utils/jwt'
import db from '../utils/db'

export async function signup(username: string, email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10)
  const uuid = crypto.randomUUID()

  return db.user.create({
    data: { uuid, username, email, passwordHash }
  })
}

export async function login(email: string, keepLogin: boolean) {
  const user = await db.user.findUnique({ where: { email } })
  
  if (!user) return null

  const token = jwt.serialize(
    { uuid: user.uuid },
    { expiresIn: keepLogin ? '30D' : '1D' }
  ).result

  await db.user.update({
    where: { email },
    data: { refreshToken: token }
  })

  return { refreshToken: token, preferences: user.preferences }
}

export async function getUserByUUID(uuid: string) {
  return db.user.findUnique({
    where: { uuid },
    select: { username: true, email: true, preferences: true, uuid: true, avatarUrl: true }
  })
}
