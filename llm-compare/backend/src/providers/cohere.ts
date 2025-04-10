import { CohereClient } from 'cohere-ai'
import { Provider, ProviderResponse } from '../types'
import { logger } from '../utils/logger'

export class CohereProvider implements Provider {
  private client: CohereClient

  constructor(apiKey: string) {
    this.client = new CohereClient({
      token: apiKey,
    })
  }

  async generateResponse(prompt: string, config: any): Promise<ProviderResponse> {
    try {
      const startTime = Date.now()
      const response = await this.client.generate({
        model: 'command',
        prompt,
        temperature: config.temperature || 0.7,
        maxTokens: config.maxTokens || 1000,
      })

      const endTime = Date.now()
      const time = endTime - startTime

      // Estimate tokens based on response length (rough approximation)
      const estimatedTokens = Math.ceil(response.generations[0].text.length / 4)

      return {
        response: response.generations[0].text,
        tokens: estimatedTokens,
        time,
      }
    } catch (error) {
      logger.error('Cohere API error:', error)
      throw error
    }
  }
} 