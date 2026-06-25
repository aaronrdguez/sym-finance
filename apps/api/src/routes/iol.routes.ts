import express, { Response } from 'express'
import * as middleware from '../middleware/auth.middleware'
import { AuthenticatedRequest } from '../types/index'
import { orchestrateSync } from '../services/sync-orchestrator.service'

const router = express.Router()

router.post('/sync/:connectionUuid', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const connectionUuid = req.params.connectionUuid as string

  try {
    const result = await orchestrateSync(req.uuid!, req.userId!, connectionUuid)
    res.json({ ok: true, message: result.success ? 'Sync completado' : 'Sync falló', result })
  } catch (err: any) {
    res.status(400).json({ ok: false, message: err.message || 'IOL sync failed' })
  }
})

export default router
