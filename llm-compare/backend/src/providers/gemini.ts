import { GoogleGenerativeAI } from '@google/generative-ai'
import { Provider, ProviderResponse } from '../types'
import { logger } from '../utils/logger'

export class GeminiProvider implements Provider {
  private client: GoogleGenerativeAI

  constructor(apiKey: string) {
    // Log the first few characters of the API key to verify it's being passed correctly
    logger.debug(`Initializing Gemini provider with API key: ${apiKey.substring(0, 8)}...`)
    
    if (!apiKey) {
      throw new Error('Gemini API key is required')
    }

    this.client = new GoogleGenerativeAI(apiKey)
  }

  async generateResponse(prompt: string, config: any): Promise<ProviderResponse> {
    try {
      const startTime = Date.now()
      const model = this.client.getGenerativeModel({ model: 'gemini-1.5-pro' })
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: config.temperature || 0.7,
          maxOutputTokens: config.maxTokens || 1000,
        },
      })

      const response = await result.response
      const text = response.text()
      const endTime = Date.now()
      const time = endTime - startTime

      // Estimate tokens (Gemini doesn't provide token count in response)
      const estimatedTokens = Math.ceil(text.length / 4)

      return {
        response: text,
        tokens: estimatedTokens,
        time,
      }
    } catch (error) {
      logger.error('Gemini API error:', error)
      throw error
    }
  }
} 