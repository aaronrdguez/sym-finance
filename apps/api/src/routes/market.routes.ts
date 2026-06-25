import express, { Response } from 'express'
import * as middleware from '../middleware/auth.middleware'
import { AuthenticatedRequest } from '../types/index'
import * as marketService from '../services/market.service'
import * as preferenceService from '../services/preference.service'

const router = express.Router()

router.get('/exchange-rates', middleware.processToken, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const rates = await marketService.getExchangeRates('USD')

    res.json({ ok: true, ...rates })
  } catch (e: any) {
    console.error('[market] exchange-rates error:', e.message)

    res.status(502).json({ ok: false, message: e.message })
  }
})

router.get('/stock/:symbol', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const symbol = req.params.symbol as string
    const quote = await marketService.getStockQuote(symbol)

    res.json({ ok: true, ...quote })
  } catch (e: any) {
    console.error(`[market] stock/${req.params.symbol} error:`, e.message)

    res.status(502).json({ ok: false, message: e.message })
  }
})

router.post('/stocks/batch', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { symbols } = req.body as { symbols: string[] }

    if (!Array.isArray(symbols)) return res.status(400).json({ ok: false, message: 'symbols must be an array' })
    
    const quotes = await marketService.getStockQuotes(symbols)

    res.json({ ok: true, quotes })
  } catch (e: any) {
    console.error('[market] stocks/batch error:', e.message)

    res.status(502).json({ ok: false, message: e.message })
  }
})

router.post('/crypto/batch', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { coins } = req.body as { coins: string[] }

    if (!Array.isArray(coins)) return res.status(400).json({ ok: false, message: 'coins must be an array' })
    
    const prices = await marketService.getCryptoPrices(coins)
    
    res.json({ ok: true, prices })
  } catch (e: any) {
    console.error('[market] crypto/batch error:', e.message)
    
    res.status(502).json({ ok: false, message: e.message })
  }
})

router.get('/crypto/:coinId', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const coinId = req.params.coinId as string
    const price = await marketService.getCryptoPrice(coinId)
    
    res.json({ ok: true, ...price })
  } catch (e: any) {
    console.error(`[market] crypto/${req.params.coinId} error:`, e.message)
    
    res.status(502).json({ ok: false, message: e.message })
  }
})

router.post('/favorites', middleware.processToken, async (req: AuthenticatedRequest, res: Response) => {
  const { favoriteStocks, favoriteCryptos } = req.body as { favoriteStocks?: string[]; favoriteCryptos?: string[] }

  if (favoriteStocks) await preferenceService.setFavorites(req.uuid!, 'favoriteStocks', favoriteStocks)
  
  if (favoriteCryptos) await preferenceService.setFavorites(req.uuid!, 'favoriteCryptos', favoriteCryptos)
  

  res.json({ ok: true })
})

export default router
