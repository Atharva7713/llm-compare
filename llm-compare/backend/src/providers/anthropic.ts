import Anthropic from '@anthropic-ai/sdk'
import { Provider, ProviderResponse } from '../types'
import { logger } from '../utils/logger'

export class AnthropicProvider implements Provider {
  private client: Anthropic

  constructor(apiKey: string) {
    // Log the first few characters of the API key to verify it's being passed correctly
    logger.debug(`Initializing Anthropic provider with API key: ${apiKey.substring(0, 8)}...`)
    
    if (!apiKey) {
      throw new Error('Anthropic API key is required')
    }

    this.client = new Anthropic({
      apiKey,
    })
  }

  async generateResponse(prompt: string, config: any): Promise<ProviderResponse> {
    try {
      const startTime = Date.now()
      const response = await this.client.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: config.maxTokens || 1000,
        temperature: config.temperature || 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      const endTime = Date.now()
      const time = endTime - startTime

      // Get the first text content from the response
      const textContent = response.content.find(
        (block) => block.type === 'text'
      )

      return {
        response: textContent && 'text' in textContent ? textContent.text : '',
        tokens: response.usage?.input_tokens || 0,
        time,
      }
    } catch (error) {
      logger.error('Anthropic API error:', error)
      throw error
    }
  }
} 