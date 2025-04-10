import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ModelConfig {
  id: string
  name: string
  provider: string
  temperature: number
  maxTokens: number
}

export interface ComparisonResult {
  modelId: string
  response: string
  tokens: number
  time: number
  feedback?: {
    rating: 'good' | 'bad' | 'average'
    comment?: string
  }
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

export const useCompareStore = create<CompareState>()(
  persist(
    (set) => ({
      prompt: '',
      selectedModels: [],
      results: [],
      isLoading: false,
      error: null,
      setPrompt: (prompt) => set({ prompt }),
      setSelectedModels: (selectedModels) => set({ 
        selectedModels: selectedModels.map(model => 
          typeof model === 'string' 
            ? { id: model, name: model, provider: 'OpenAI', temperature: 0.7, maxTokens: 1000 }
            : model
        ) 
      }),
      setResults: (results) => set({ results: Array.isArray(results) ? results : [] }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearResults: () => set({ results: [] }),
    }),
    {
      name: 'compare-storage',
      version: 2,
      migrate: (persistedState, version) => {
        if (version < 2) {
          return {
            prompt: '',
            selectedModels: [],
            results: [],
            isLoading: false,
            error: null,
          }
        }
        return persistedState as CompareState
      },
    }
  )
) 
