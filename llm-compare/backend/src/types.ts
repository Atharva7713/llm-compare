export interface ProviderResponse {
  response: string
  tokens: number
  time: number
}

export interface Provider {
  generateResponse(prompt: string, config: any): Promise<ProviderResponse>
}

export interface ModelConfig {
  id: string
  name: string
  provider: 'OpenAI' | 'Anthropic' | 'Cohere'
  temperature: number
  maxTokens: number
} 