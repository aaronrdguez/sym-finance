import express, { Response } from 'express'
import * as middleware from '../middleware/auth.middleware'
import { AuthenticatedRequest } from '../types/index'
import * as preferenceService from '../services/preference.service'

const router = express.Router()

router.get('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const preferences = await preferenceService.getPreferences(req.uuid!)

  res.json({ ok: true, preferences })
})

router.post('/', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const { theme, widgetLayout, connections } = req.body

  if (theme && (theme === 'dark' || theme === 'light')) {
    const result = await preferenceService.setTheme(req.uuid!, theme)
    return res.json(result)
  }

  if (widgetLayout) {
    const result = await preferenceService.setWidgetLayout(req.uuid!, widgetLayout)
    return res.json(result)
  }

  if (connections) {
    const result = await preferenceService.setConnections(req.uuid!, connections)
    return res.json(result)
  }
  
  res.status(400).json({ ok: false, message: 'Invalid preferences.' })
})

export default router
