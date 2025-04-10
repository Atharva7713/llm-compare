import express from 'express'
import { Comparison } from '../models/Comparison'
import { logger } from '../utils/logger'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    logger.info('Fetching comparison history')
    const history = await Comparison.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
    
    logger.info(`Found ${history.length} comparisons`)
    logger.debug('History data:', JSON.stringify(history, null, 2))
    res.json(history)
  } catch (error) {
    logger.error('Error fetching history:', error)
    res.status(500).json({ error: 'Failed to fetch history' })
  }
})

export default router 