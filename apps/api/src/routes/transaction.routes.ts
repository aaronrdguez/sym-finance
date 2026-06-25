import express, { Response } from 'express'
import * as middleware from '../middleware/auth.middleware'
import { AuthenticatedRequest } from '../types/index'
import * as transactionService from '../services/transaction.service'

const router = express.Router()

router.get('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const transactions = await transactionService.listTransactions(req.userId!)

  res.json({ ok: true, transactions })
})

router.post('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const { accountName, amount, type, category, currency, description } = req.body

  if (!accountName || !amount || !type || !category) return res.status(400).json({ message: 'Missing required fields: accountName, amount, type, category' })

  const result = await transactionService.createTransaction(req.userId!, {
    accountName, amount, type, category, currency, description
  })

  if (!result) return res.status(404).json({ message: 'Account not found' })

  res.status(201).json({ ok: true, message: 'Transaction registered' })
})

router.put('/:uuid', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.params.uuid as string

  const result = await transactionService.updateTransaction(req.userId!, uuid, req.body)

  if (!result) return res.status(404).json({ message: 'Transaction not found' })

  res.json({ ok: true, message: 'Transaction updated' })
})

router.delete('/:uuid', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.params.uuid as string

  const result = await transactionService.deleteTransaction(req.userId!, uuid)

  if (!result) return res.status(404).json({ message: 'Transaction not found' })
    
  res.json({ ok: true, message: 'Transaction deleted' })
})

export default router
