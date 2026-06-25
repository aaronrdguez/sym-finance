import express, { Response } from 'express'
import * as middleware from '../middleware/auth.middleware'
import { AuthenticatedRequest } from '../types/index'
import * as reserveService from '../services/reserve.service'

const router = express.Router()

router.get('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const reserves = await reserveService.listReserves(req.userId!)
  
  res.json({ ok: true, reserves })
})

router.post('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const { name, targetAmount, currentAmount, category, currency, deadline } = req.body

  if (!name || !targetAmount || !category || !currency) return res.status(400).json({ message: 'Missing required fields' })
  
  const result = await reserveService.createReserve(req.userId!, {
    name, targetAmount, currentAmount, category, currency, deadline
  })

  if (!result) return res.status(404).json({ message: 'User not found' })

  res.status(201).json({ ok: true, message: 'Reserve created' })
})

router.put('/:uuid', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.params.uuid as string

  const result = await reserveService.updateReserve(req.userId!, uuid, req.body)

  if (!result) return res.status(404).json({ message: 'Reserve not found' })

  res.json({ ok: true, message: 'Reserve updated' })
})

router.patch('/:uuid/deposit', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.params.uuid as string

  const { amount } = req.body

  if (!amount || amount <= 0) return res.status(400).json({ message: 'Amount must be greater than 0' })

  const result = await reserveService.depositToReserve(req.userId!, uuid, amount)

  if (!result) return res.status(404).json({ message: 'Reserve not found' })

  res.json({ ok: true, message: 'Deposit successful' })
})

router.delete('/:uuid', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.params.uuid as string

  const result = await reserveService.deleteReserve(req.userId!, uuid)

  if (!result) return res.status(404).json({ message: 'Reserve not found' })
    
  res.json({ ok: true, message: 'Reserve deleted' })
})

export default router
