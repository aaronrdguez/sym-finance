import express, { Response } from 'express'
import * as middleware from '../middleware/auth.middleware'
import { AuthenticatedRequest } from '../types/index'
import * as installmentService from '../services/installment.service'

const router = express.Router()

router.get('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const installments = await installmentService.listInstallments(req.userId!)
  
  res.json({ ok: true, installments })
})

router.post('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const { description, totalAmount, installmentCount, startDate, frequency, category, currency, notes } = req.body

  if (!description || !totalAmount || !installmentCount || !startDate || !frequency || !category || !currency) return res.status(400).json({ message: 'Missing required fields' })
  
  const result = await installmentService.createInstallment(req.userId!, {
    description, totalAmount, installmentCount, startDate, frequency, category, currency, notes
  })

  if (!result) return res.status(404).json({ message: 'User not found' })

  res.status(201).json({ ok: true, message: 'Installment created' })
})

router.put('/:uuid/pay', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.params.uuid as string
  const result = await installmentService.payInstallment(req.userId!, uuid)

  if (!result) return res.status(404).json({ message: 'Installment not found' })

  res.json({ ok: true, message: 'Installment paid' })
})

router.put('/:uuid', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.params.uuid as string
  const result = await installmentService.updateInstallment(req.userId!, uuid, req.body)

  if (!result) return res.status(404).json({ message: 'Installment not found' })

  res.json({ ok: true, message: 'Installment updated' })
})

router.delete('/:uuid', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.params.uuid as string
  const result = await installmentService.deleteInstallment(req.userId!, uuid)

  if (!result) return res.status(404).json({ message: 'Installment not found' })

  res.json({ ok: true, message: 'Installment deleted' })
})

export default router
