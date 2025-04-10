// Load environment variables first
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import compareRouter from './routes/compare'
import historyRouter from './routes/history'
import { logger } from './utils/logger'
import { connectDB } from './config/database'

const app = express()
const port = process.env.PORT || 4000

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Routes
app.use('/api/compare', compareRouter)
app.use('/api/history', historyRouter)

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
}) 