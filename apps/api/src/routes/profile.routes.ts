import express, { Response } from 'express'
import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import * as middleware from '../middleware/auth.middleware'
import { AuthenticatedRequest } from '../types/index'
import db from '../utils/db'
import type { Prisma } from '../generated/prisma/client.js'

const router = express.Router()

const storage = multer.diskStorage({
  destination: path.resolve('public/avatars'),
  
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${crypto.randomUUID()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only images allowed'))
  },
})

const PROFILE_SELECT = { username: true, email: true, avatarUrl: true, preferences: true }

router.get('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = await db.user.findUnique({
    where: { uuid: req.uuid! },
    select: PROFILE_SELECT,
  })
  
  if (!user) return res.status(404).json({ message: 'User not found' })
  
  res.json({ ok: true, ...user })
})

router.patch('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const { username: newUsername, avatarUrl: newAvatarUrl } = req.body

  const data: Prisma.UserUpdateInput = {}
  
  if (typeof newUsername === 'string' && newUsername.trim().length > 0) data.username = newUsername.trim()
  if (typeof newAvatarUrl === 'string') data.avatarUrl = newAvatarUrl || null

  if (Object.keys(data).length === 0) return res.status(400).json({ message: 'Nothing to update' })

  const user = await db.user.update({
    where: { uuid: req.uuid! },
    data,
    select: PROFILE_SELECT,
  })

  res.json({ ok: true, ...user })
})

router.post('/avatar', middleware.processToken, upload.single('avatar'), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  
  const avatarUrl = `/uploads/avatars/${req.file.filename}`
  const user = await db.user.update({
    where: { uuid: req.uuid! },
    data: { avatarUrl },
    select: PROFILE_SELECT,
  })
  
  res.json({ ok: true, ...user })
}, (err: unknown, _req: AuthenticatedRequest, res: Response, _next: any) => {
  if (err instanceof Error) res.status(400).json({ message: err.message })
  else res.status(500).json({ message: 'Upload failed' })
})

export default router
