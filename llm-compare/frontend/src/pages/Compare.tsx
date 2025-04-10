import React, { useState, useEffect } from 'react'
import { PlayIcon, StopIcon, Cog6ToothIcon, CommandLineIcon } from '@heroicons/react/24/outline'
import { useCompareStore } from '../stores/useCompareStore'
import { ModelConfig } from '../types'
import { usePreferencesStore } from '../stores/usePreferencesStore'
import CompareSkeleton from '../components/CompareSkeleton'
import ExportButton from '../components/ExportButton'
import ShareButton from '../components/ShareButton'
import PerformanceAnalytics from '../components/PerformanceAnalytics'
import ModelConfigDialog from '../components/ModelConfigDialog'
import KeyboardShortcutsDialog from '../components/KeyboardShortcutsDialog'
import { keyboardShortcuts } from '../utils/keyboardShortcuts'
import { API_BASE_URL } from '../config'
import ReactMarkdown from 'react-markdown'

interface Feedback {
  rating: 'good' | 'bad' | 'average'
  comment: string
}

const Compare: React.FC = () => {
  const {
    prompt,
    selectedModels,
    results,
    isLoading,
    error,
    setPrompt,
    setSelectedModels,
    setResults,
    setIsLoading,
    setError,
  } = useCompareStore()

  const { defaultTemperature, defaultMaxTokens } = usePreferencesStore()
  const [configuringModel, setConfiguringModel] = React.useState<ModelConfig | null>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({})

  // Clear localStorage when component mounts
  useEffect(() => {
    localStorage.removeItem('compare-storage')
  }, [])

  const availableModels: ModelConfig[] = [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', temperature: defaultTemperature, maxTokens: defaultMaxTokens },
    { id: 'claude-instant-1', name: 'Claude Instant', provider: 'Anthropic', temperature: defaultTemperature, maxTokens: defaultMaxTokens },
    { id: 'claude-2', name: 'Claude 2', provider: 'Anthropic', temperature: defaultTemperature, maxTokens: defaultMaxTokens },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', temperature: defaultTemperature, maxTokens: defaultMaxTokens },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', temperature: defaultTemperature, maxTokens: defaultMaxTokens },
    { id: 'cohere-command-light', name: 'Cohere Command Light', provider: 'Cohere', temperature: defaultTemperature, maxTokens: defaultMaxTokens },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Gemini', temperature: defaultTemperature, maxTokens: defaultMaxTokens },
  ]

  const handleModelToggle = (model: ModelConfig) => {
    setSelectedModels(
      selectedModels.find(m => m.id === model.id)
        ? selectedModels.filter(m => m.id !== model.id)
        : [...selectedModels, model]
    )
  }

  const handleModelConfig = (model: ModelConfig) => {
    setConfiguringModel(model)
  }

  const handleConfigSave = (config: ModelConfig) => {
    setSelectedModels(selectedModels.map(model =>
      model.id === config.id ? config : model
    ))
    setConfiguringModel(null)
  }

  const handleCompare = async () => {
    if (!prompt || selectedModels.length === 0) {
      setError('Please enter a prompt and select at least one model')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Send only the model IDs to the backend
      const modelIds = selectedModels.map(model => model.id)

      const response = await fetch(`${API_BASE_URL}/api/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          selectedModels: modelIds,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to compare models')
      }

      const data = await response.json()
      setResults(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error comparing models:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedbackChange = (modelId: string, field: keyof Feedback, value: string) => {
    setFeedback(prev => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        [field]: value
      }
    }))
  }

  const handleSubmitFeedback = async (modelId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/compare/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelId,
          feedback: feedback[modelId],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      const updatedComparison = await response.json()
      
      // Update the results with the feedback
      const updatedResults = Array.isArray(results) ? results.map(result => 
        result.modelId === modelId 
          ? { ...result, feedback: feedback[modelId] }
          : result
      ) : []
      setResults(updatedResults)

      // Clear the feedback for this model
      setFeedback(prev => {
        const newFeedback = { ...prev }
        delete newFeedback[modelId]
        return newFeedback
      })
    } catch (error) {
      console.error('Error submitting feedback:', error)
      setError('Failed to submit feedback. Please try again.')
    }
  }

  useEffect(() => {
    // Register keyboard shortcuts
    keyboardShortcuts.register('ctrl+enter', 'Run comparison', handleCompare)
    keyboardShortcuts.register('ctrl+k', 'Toggle shortcuts dialog', () => setShowShortcuts(true))
    keyboardShortcuts.register('esc', 'Close dialogs', () => {
      setConfiguringModel(null)
      setShowShortcuts(false)
    })

    // Toggle model shortcuts
    availableModels.forEach((model, index) => {
      keyboardShortcuts.register(
        `ctrl+${index + 1}`,
        `Toggle ${model.name}`,
        () => handleModelToggle(model)
      )
    })

    return () => {
      // Unregister all shortcuts when component unmounts
      keyboardShortcuts.unregister('ctrl+enter')
      keyboardShortcuts.unregister('ctrl+k')
      keyboardShortcuts.unregister('esc')
      availableModels.forEach((_, index) => {
        keyboardShortcuts.unregister(`ctrl+${index + 1}`)
      })
    }
  }, [selectedModels])

  if (isLoading) {
    return <CompareSkeleton />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compare Models</h1>
        <button
          onClick={() => setShowShortcuts(true)}
          className="btn btn-secondary flex items-center"
        >
          <CommandLineIcon className="h-5 w-5 mr-2" />
          Shortcuts
        </button>
      </div>

      <div className="space-y-6">
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Compare LLM Responses
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter your prompt
              </label>
              <textarea
                id="prompt"
                rows={4}
                className="input mt-1"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select models to compare
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {availableModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-4 rounded-lg border ${
                      selectedModels.find(m => m.id === model.id)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <button
                        onClick={() => handleModelToggle(model)}
                        className="flex-1 text-left"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">{model.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{model.provider}</div>
                      </button>
                      <button
                        onClick={() => handleModelConfig(model)}
                        className="ml-2 p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <Cog6ToothIcon className="h-5 w-5" />
                      </button>
                    </div>
                    {selectedModels.find(m => m.id === model.id) && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Temp: {model.temperature} • Max: {model.maxTokens}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              {results && results.length > 0 && (
                <>
                  <ShareButton prompt={prompt} results={results} />
                  <ExportButton prompt={prompt} results={results} />
                </>
              )}
              <button
                onClick={handleCompare}
                disabled={isLoading || !prompt || selectedModels.length === 0}
                className="btn btn-primary inline-flex items-center"
              >
                {isLoading ? (
                  <>
                    <StopIcon className="h-5 w-5 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-5 w-5 mr-2" />
                    Compare
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {results && results.length > 0 && (
          <>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Performance Analytics
              </h3>
              <PerformanceAnalytics results={results} />
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((result) => (
                  <div key={result.modelId} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {result.modelId}
                      </h4>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {result.tokens} tokens • {result.time}ms
                      </div>
                    </div>
                    <div className="prose dark:prose-invert max-w-none mb-4">
                      <ReactMarkdown>{result.response}</ReactMarkdown>
                    </div>
                    
                    {/* Feedback Section */}
                    <div className="mt-4 border-t pt-4">
                      <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Rate this response
                      </h5>
                      <div className="space-y-4">
                        <select
                          value={feedback[result.modelId]?.rating || ''}
                          onChange={(e) => handleFeedbackChange(result.modelId, 'rating', e.target.value)}
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        >
                          <option value="">Select rating</option>
                          <option value="good">Good Response</option>
                          <option value="average">Average Response</option>
                          <option value="bad">Bad Response</option>
                        </select>
                        
                        <textarea
                          value={feedback[result.modelId]?.comment || ''}
                          onChange={(e) => handleFeedbackChange(result.modelId, 'comment', e.target.value)}
                          placeholder="Provide feedback (optional)"
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                          rows={3}
                        />
                        
                        <button
                          onClick={() => handleSubmitFeedback(result.modelId)}
                          disabled={!feedback[result.modelId]?.rating}
                          className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Submit Feedback
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {configuringModel && (
          <ModelConfigDialog
            model={configuringModel}
            isOpen={true}
            onClose={() => setConfiguringModel(null)}
            onSave={handleConfigSave}
          />
        )}
      </div>

      <KeyboardShortcutsDialog
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  )
}

export default Compare 