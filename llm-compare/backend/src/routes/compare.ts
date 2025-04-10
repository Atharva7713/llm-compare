import express from 'express'
import { OpenAIProvider } from '../providers/openai'
import { CohereProvider } from '../providers/cohere'
import { AnthropicProvider } from '../providers/anthropic'
import { GeminiProvider } from '../providers/gemini'
import { logger } from '../utils/logger'
import { ProviderResponse, ModelConfig } from '../types'
import { Comparison } from '../models/Comparison'

const router = express.Router()

// Log environment variables (without exposing full keys)
logger.debug('Environment variables loaded:')
logger.debug(`ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? 'Present' : 'Missing'}`)
logger.debug(`OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'Present' : 'Missing'}`)
logger.debug(`COHERE_API_KEY: ${process.env.COHERE_API_KEY ? 'Present' : 'Missing'}`)
logger.debug(`GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'Present' : 'Missing'}`)

// Initialize providers only if their respective API keys are present
const providers: Record<string, any> = {}

if (process.env.OPENAI_API_KEY) {
  providers.OpenAI = new OpenAIProvider(process.env.OPENAI_API_KEY)
}

if (process.env.ANTHROPIC_API_KEY) {
  providers.Anthropic = new AnthropicProvider(process.env.ANTHROPIC_API_KEY)
}

if (process.env.COHERE_API_KEY) {
  providers.Cohere = new CohereProvider(process.env.COHERE_API_KEY)
}

if (process.env.GEMINI_API_KEY) {
  providers.Gemini = new GeminiProvider(process.env.GEMINI_API_KEY)
}

const models = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI' as const,
    temperature: 0.7,
    maxTokens: 1000,
  },
  {
    id: 'claude-instant-1',
    name: 'Claude Instant',
    provider: 'Anthropic' as const,
    temperature: 0.7,
    maxTokens: 1000,
  },
  {
    id: 'claude-2',
    name: 'Claude 2',
    provider: 'Anthropic' as const,
    temperature: 0.7,
    maxTokens: 1000,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic' as const,
    temperature: 0.7,
    maxTokens: 1000,
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic' as const,
    temperature: 0.7,
    maxTokens: 1000,
  },
  {
    id: 'cohere-command-light',
    name: 'Cohere Command Light',
    provider: 'Cohere' as const,
    temperature: 0.7,
    maxTokens: 1000,
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Gemini' as const,
    temperature: 0.7,
    maxTokens: 1000,
  },
]

router.post('/', async (req, res) => {
  const { prompt, selectedModels } = req.body

  if (!prompt || !selectedModels || !Array.isArray(selectedModels)) {
    return res.status(400).json({ error: 'Invalid request parameters' })
  }

  try {
    logger.info('Processing comparison request:', { prompt, selectedModels })
    const results = await Promise.all(
      selectedModels.map(async (modelId: string | ModelConfig) => {
        // Handle both string IDs and model configurations
        const model = typeof modelId === 'string' 
          ? models.find((m) => m.id === modelId)
          : models.find((m) => m.id === modelId.id)

        if (!model) {
          throw new Error(`Model ${typeof modelId === 'string' ? modelId : modelId.id} not found`)
        }

        const provider = providers[model.provider]
        if (!provider) {
          return {
            modelId: model.id,
            response: `Error: Provider ${model.provider} is not available. Please check API key configuration.`,
            tokens: 0,
            time: 0,
          }
        }

        try {
          const response = await provider.generateResponse(prompt, {
            temperature: model.temperature,
            maxTokens: model.maxTokens,
          })

          return {
            modelId: model.id,
            ...response,
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
          logger.error(`Error with ${model.id}:`, error)
          return {
            modelId: model.id,
            response: `Error: ${errorMessage}`,
            tokens: 0,
            time: 0,
          }
        }
      })
    )

    // Save comparison to MongoDB
    logger.info('Saving comparison to MongoDB')
    const savedComparison = await Comparison.create({
      prompt,
      selectedModels: selectedModels.map(model => 
        typeof model === 'string' ? model : model.id
      ),
      results,
    })
    logger.info('Comparison saved successfully:', { id: savedComparison._id })

    res.json(results)
  } catch (error) {
    logger.error('Error processing request:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/feedback', async (req, res) => {
  const { modelId, feedback } = req.body

  if (!modelId || !feedback || !feedback.rating) {
    return res.status(400).json({ error: 'Invalid feedback data' })
  }

  try {
    logger.info('Updating feedback for model:', { modelId, feedback })
    
    const comparison = await Comparison.findOne({
      'results.modelId': modelId,
    }).sort({ createdAt: -1 }) // Get the most recent comparison

    if (!comparison) {
      return res.status(404).json({ error: 'Comparison not found' })
    }

    // Update the feedback for the specific model
    const resultIndex = comparison.results.findIndex(result => result.modelId === modelId)
    if (resultIndex === -1) {
      return res.status(404).json({ error: 'Model result not found' })
    }

    // Update the feedback
    comparison.results[resultIndex].feedback = {
      rating: feedback.rating,
      comment: feedback.comment || '',
    }

    await comparison.save()
    logger.info('Feedback updated successfully')
    res.json(comparison)
  } catch (error) {
    logger.error('Error saving feedback:', error)
    res.status(500).json({ error: 'Failed to save feedback' })
  }
})

export default router 