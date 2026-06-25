import { Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import * as jwt from '../utils/jwt'
import db from '../utils/db'
import { AuthenticatedRequest, IUser } from '../types/index'

export const userAlreadyExists = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { email } = req.body

  const user = await db.user.findUnique({ where: { email } })

  if (user) return res.status(409).json({ error: 'Email already exists' })
  next()
}

export const userExists = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { email } = req.body

  const user = await db.user.findUnique({ where: { email } })

  if (!user) return res.status(401).json({ message: 'Invalid email or password' })

  req.user = user
  next()
}

export const validatePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { password } = req.body
  const { passwordHash } = req.user as IUser

  const valid = await bcrypt.compare(password, passwordHash)

  if (!valid) return res.status(401).json({ message: 'Invalid email or password' })

  next()
}

export const isLogged = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.session

  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  next()
}

export const processToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.session

  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  const data = jwt.deserialize(token)

  if (typeof data === 'string' || data.message !== 'ok') return res.status(401).json({ message: 'Unauthorized' })

  req.uuid = data.decoded.uuid

  const user = await db.user.findUnique({ where: { uuid: req.uuid }, select: { id: true } })

  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  req.userId = user.id
  next()
}
