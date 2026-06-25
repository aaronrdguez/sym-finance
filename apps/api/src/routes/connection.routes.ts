import express, { Response } from 'express'
import * as middleware from '../middleware/auth.middleware'
import { AuthenticatedRequest } from '../types/index'
import * as connectionService from '../services/connection.service'
import { orchestrateSync } from '../services/sync-orchestrator.service'

const router = express.Router()

router.get('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const connections = await connectionService.listConnections(req.userId!)
  
  res.json({ ok: true, connections })
})

router.get('/:uuid', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.params.uuid as string
  const connection = await connectionService.getConnection(uuid, req.userId!)
  
  if (!connection) return res.status(404).json({ ok: false, message: 'Connection not found' })
  
  res.json({ ok: true, connection })
})

router.post('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const { service, label, credentials, enabled } = req.body
  
  if (!service || !credentials) return res.status(400).json({ ok: false, message: 'service and credentials are required' })

  const conn = await connectionService.createConnection(req.userId!, { service, label, credentials, enabled })

  const response: any = { uuid: conn.uuid, service: conn.service }

  const syncResult = await orchestrateSync(req.uuid!, req.userId!, conn.uuid)
  if (!syncResult.success) {
    response.syncWarning = syncResult.error
  } else {
    response.syncResult = {
      accountsCreated: syncResult.accountsCreated,
      accountsUpdated: syncResult.accountsUpdated,
      holdingsCreated: syncResult.holdingsCreated,
      holdingsUpdated: syncResult.holdingsUpdated,
      favoritesAdded: syncResult.favoritesAdded,
    }
  }

  res.json({ ok: true, connection: response })
})

router.put('/:uuid', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.params.uuid as string
  const { label, credentials, enabled } = req.body
  const result = await connectionService.updateConnection(uuid, req.userId!, { label, credentials, enabled })
  
  if (!result) return res.status(404).json({ ok: false, message: 'Connection not found' })
  
  const response: any = { ok: true }

  if (credentials) {
    const syncResult = await orchestrateSync(req.uuid!, req.userId!, uuid)
    if (!syncResult.success) {
      response.syncWarning = syncResult.error
    } else {
      response.syncResult = {
        accountsCreated: syncResult.accountsCreated,
        accountsUpdated: syncResult.accountsUpdated,
        holdingsCreated: syncResult.holdingsCreated,
        holdingsUpdated: syncResult.holdingsUpdated,
        favoritesAdded: syncResult.favoritesAdded,
      }
    }
  }

  res.json(response)
})

router.delete('/:uuid', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const uuid = req.params.uuid as string
  const result = await connectionService.deleteConnection(uuid, req.userId!)
  
  if (!result) return res.status(404).json({ ok: false, message: 'Connection not found' })
  
  res.json({ ok: true })
})

export default router
