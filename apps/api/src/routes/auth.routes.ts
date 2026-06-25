import express, { Response } from 'express'
import * as middleware from '../middleware/auth.middleware'
import { AuthenticatedRequest } from '../types/index'
import * as authService from '../services/auth.service'

const router = express.Router()

router.post('/signup', middleware.userAlreadyExists, async (req: AuthenticatedRequest, res: Response) => {
  const { username, email, password, keepLogin } = req.body

  const user = await authService.signup(username, email, password)

  if (!user) return res.status(500).json({ error: 'Internal server error' })

  const result = await authService.login(email, keepLogin)
  const maxAge = keepLogin ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000

  res.cookie('session', result?.refreshToken, { httpOnly: true, sameSite: 'lax', path: '/', maxAge })
  res.status(201).json({ ok: true, message: 'Account created successfully' })
})

router.post('/signin', middleware.userExists, middleware.validatePassword, async (req: AuthenticatedRequest, res: Response) => {
  const { email, keepLogin } = req.body
  const { username } = req.user as any

  const result = await authService.login(email, keepLogin)
  const maxAge = result?.refreshToken ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000

  res.cookie('session', result?.refreshToken, { httpOnly: true, sameSite: 'lax', path: '/', maxAge })
  res.json({ ok: true, message: 'Welcome back', username, email, preferences: result?.preferences })
})

router.delete('/logout', middleware.isLogged, (req: AuthenticatedRequest, res: Response) => {
  res.clearCookie('session')
  res.json({ ok: true, message: 'Logged out' })
})

router.get('/session', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.uuid!
  const user = await authService.getUserByUUID(uuid)

  if (!user) return res.status(500).json({ message: 'User not found' })
    
  res.json({ ok: true, username: user.username, email: user.email, preferences: user.preferences, avatarUrl: user.avatarUrl })
})

export default router
