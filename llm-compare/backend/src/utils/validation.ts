interface CompareRequest {
  prompt: string
  models: {
    id: string
    name: string
    provider: string
    temperature: number
    maxTokens: number
  }[]
}

export function validateCompareRequest(body: any): string | null {
  if (!body.prompt || typeof body.prompt !== 'string') {
    return 'Prompt is required and must be a string'
  }

  if (!body.models || !Array.isArray(body.models) || body.models.length === 0) {
    return 'At least one model must be selected'
  }

  for (const model of body.models) {
    if (!model.id || typeof model.id !== 'string') {
      return 'Model ID is required and must be a string'
    }

    if (!model.name || typeof model.name !== 'string') {
      return 'Model name is required and must be a string'
    }

    if (!model.provider || typeof model.provider !== 'string') {
      return 'Model provider is required and must be a string'
    }

    if (typeof model.temperature !== 'number' || model.temperature < 0 || model.temperature > 1) {
      return 'Temperature must be a number between 0 and 1'
    }

    if (typeof model.maxTokens !== 'number' || model.maxTokens < 1) {
      return 'Max tokens must be a positive number'
    }
  }

  return null
}

export function validateHistoryId(id: string): boolean {
  // Add validation for history ID format (e.g., UUID validation)
  return typeof id === 'string' && id.length > 0
} 