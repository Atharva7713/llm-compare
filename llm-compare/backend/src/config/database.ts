import mongoose from 'mongoose'
import { logger } from '../utils/logger'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/llm-compare'

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    logger.info('Connected to MongoDB successfully')
  } catch (error) {
    logger.error('MongoDB connection error:', error)
    process.exit(1)
  }
} 