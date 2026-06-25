import express, { Response } from 'express'
import * as middleware from '../middleware/auth.middleware'
import { AuthenticatedRequest } from '../types/index'
import * as accountService from '../services/account.service'

const router = express.Router()

router.get('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const accounts = await accountService.listAccounts(req.userId!)

  res.json({ ok: true, accounts })
})

router.post('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const { name, icon, color, type, currency, balance } = req.body

  await accountService.createAccount(req.userId!, { name, icon, color, type, currency, balance: balance || 0 })

  res.status(201).json({ ok: true, message: 'Account created' })
})

router.put('/:uuid', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const { name, icon, color, type, currency, balance } = req.body
  const uuid = req.params.uuid as string

  try {
    const result = await accountService.updateAccount(req.userId!, uuid, { name, icon, color, type, currency, balance })

    if (!result) return res.status(404).json({ ok: false, message: 'Cuenta no encontrada' })

    res.json({ ok: true, message: 'Account updated' })
  } catch (err: any) {
    res.status(400).json({ ok: false, message: err.message })
  }
})

router.delete('/:uuid', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.params.uuid as string

  try {
    const result = await accountService.deleteAccount(req.userId!, uuid)

    if (!result) return res.status(404).json({ ok: false, message: 'Cuenta no encontrada' })

    res.json({ ok: true, message: 'Account deleted' })
  } catch (err: any) {
    res.status(400).json({ ok: false, message: err.message })
  }
})

export default router
