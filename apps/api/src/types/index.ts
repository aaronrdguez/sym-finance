import type { Prisma } from '../generated/prisma/client.js'
import { Request } from 'express'

export interface IUser {
  username: string
  email: string
  refreshToken?: string | null
  uuid: string
  passwordHash: string
  id?: number
  createdAt?: Date
  updatedAt?: Date
  preferences?: Prisma.JsonValue | null
}

export interface IAccount {
  uuid: string
  id?: number
  userId: number
  createdAt?: Date
  updatedAt?: Date
  name: string
  icon: string
  balance: number
  color: string
  currency: string
  type: string
  operations?: ITransaction[]
}

export interface ITransaction {
  uuid: string
  type: 'income' | 'expense'
  accountName: string
  amount: number
  category: string
  description: string
  date: string
  currency: string
  account?: IAccount
  accountId?: number
  userId: number
}

export interface AuthenticatedRequest extends Request {
  user?: any
  uuid?: string
  userId?: number
}

export interface UserPreferences {
  theme: 'dark' | 'light'
}
