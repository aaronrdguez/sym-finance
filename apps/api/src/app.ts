import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'

import authRoutes from './routes/auth.routes'
import accountRoutes from './routes/account.routes'
import transactionRoutes from './routes/transaction.routes'
import subscriptionRoutes from './routes/subscription.routes'
import preferenceRoutes from './routes/preference.routes'
import reserveRoutes from './routes/reserve.routes'
import installmentRoutes from './routes/installment.routes'
import marketRoutes from './routes/market.routes'
import connectionRoutes from './routes/connection.routes'
import profileRoutes from './routes/profile.routes'
import iolRoutes from './routes/iol.routes'

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json({ limit: '5mb' }))
app.use(cookieParser())

app.use('/uploads', express.static(path.resolve('public')))
app.use('/api/auth', authRoutes)
app.use('/api/accounts', accountRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/preferences', preferenceRoutes)
app.use('/api/reserves', reserveRoutes)
app.use('/api/installments', installmentRoutes)
app.use('/api/market', marketRoutes)
app.use('/api/connections', connectionRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/iol', iolRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
