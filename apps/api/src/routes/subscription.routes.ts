import express, { Response } from 'express'
import * as middleware from '../middleware/auth.middleware'
import { AuthenticatedRequest } from '../types/index'
import * as subscriptionService from '../services/subscription.service'

const router = express.Router()

router.get('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const subscriptions = await subscriptionService.listSubscriptions(req.userId!)
  
  res.json({ ok: true, subscriptions })
})

router.post('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const { amount, currency, description, reason, frequency, nextPaymentDate } = req.body

  if (!amount || !currency || !reason || !frequency || !nextPaymentDate) return res.status(400).json({ message: 'Missing required fields' })

  const result = await subscriptionService.createSubscription(req.userId!, {
    amount, currency, description, reason, frequency, nextPaymentDate
  })

  if (!result) return res.status(404).json({ message: 'User not found' })

  res.status(201).json({ ok: true, message: 'Subscription created' })
})

router.put('/:uuid', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.params.uuid as string

  const result = await subscriptionService.updateSubscription(req.userId!, uuid, req.body)

  if (!result) return res.status(404).json({ message: 'Subscription not found' })

  res.json({ ok: true, message: 'Subscription updated' })
})

router.delete('/:uuid', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.params.uuid as string

  const result = await subscriptionService.deleteSubscription(req.userId!, uuid)

  if (!result) return res.status(404).json({ message: 'Subscription not found' })
    
  res.json({ ok: true, message: 'Subscription deleted' })
})

export default router
