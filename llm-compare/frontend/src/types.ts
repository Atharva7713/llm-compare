export interface ModelConfig {
  id: string
  name: string
  provider: 'OpenAI' | 'Anthropic' | 'Gemini' | 'Cohere'
  temperature: number
  maxTokens: number
}

export interface ComparisonResult {
  modelId: string
  response: string
  tokens: number
  time: number
  feedback?: Feedback
}

export interface Feedback {
  rating: 'good' | 'average' | 'bad'
  comment?: string
}

export interface CompareState {
  prompt: string
  selectedModels: ModelConfig[]
  results: ComparisonResult[]
  isLoading: boolean
  error: string | null
  setPrompt: (prompt: string) => void
  setSelectedModels: (selectedModels: ModelConfig[]) => void
  setResults: (results: ComparisonResult[]) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearResults: () => void
} 