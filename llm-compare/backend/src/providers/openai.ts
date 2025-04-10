import OpenAI from 'openai'
import { Provider, ProviderResponse } from '../types'
import { logger } from '../utils/logger'

export class OpenAIProvider implements Provider {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async generateResponse(prompt: string, config: any): Promise<ProviderResponse> {
    try {
      const startTime = Date.now()
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 1000,
      })

      const endTime = Date.now()
      const time = endTime - startTime

      return {
        response: completion.choices[0]?.message?.content || '',
        tokens: completion.usage?.total_tokens || 0,
        time,
      }
    } catch (error) {
      logger.error('OpenAI API error:', error)
      throw error
    }
  }
} 