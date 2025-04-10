import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { API_BASE_URL } from '../config'

interface Comparison {
  _id: string
  prompt: string
  selectedModels: string[]
  results: Array<{
    modelId: string
    response: string
    tokens: number
    time: number
    feedback?: {
      rating: string
      comment?: string
    }
  }>
  createdAt: string
}

const History: React.FC = () => {
  const queryClient = useQueryClient()

  const { data: history, isLoading, error } = useQuery<Comparison[]>({
    queryKey: ['history'],
    queryFn: async () => {
      console.log('Fetching history from:', `${API_BASE_URL}/api/history`)
      const response = await fetch(`${API_BASE_URL}/api/history`)
      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.statusText}`)
      }
      const data = await response.json()
      console.log('Received history data:', data)
      return data
    },
    staleTime: 0, // Always fetch fresh data
  })

  // Subscribe to feedback updates
  React.useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/api/events`)
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'feedback_updated') {
        queryClient.invalidateQueries({ queryKey: ['history'] })
      }
    }

    return () => {
      eventSource.close()
    }
  }, [queryClient])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-gray-600 dark:text-gray-300">Loading history...</div>
      </div>
    )
  }

  if (error) {
    console.error('Error fetching history:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500">Error loading history: {error instanceof Error ? error.message : 'Unknown error'}</div>
      </div>
    )
  }

  if (!history || history.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Comparison History
        </h1>
        <div className="text-gray-600 dark:text-gray-300">
          No comparison history found. Try making some comparisons first!
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Comparison History
      </h1>
      <div className="space-y-6">
        {history.map((comparison) => (
          <div
            key={comparison._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Prompt
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {comparison.prompt}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Models Used
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {comparison.selectedModels.map((model) => (
                  <span
                    key={model}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                  >
                    {model}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {comparison.results.map((result) => (
                  <div
                    key={result.modelId}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {result.modelId}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {result.tokens} tokens • {result.time}ms
                    </div>
                    <div className="mt-2 text-gray-600 dark:text-gray-300">
                      {result.response}
                    </div>
                    
                    {/* Feedback Section */}
                    {result.feedback && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Rating:
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.feedback.rating === 'good'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : result.feedback.rating === 'bad'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {result.feedback.rating.charAt(0).toUpperCase() + result.feedback.rating.slice(1)}
                          </span>
                        </div>
                        {result.feedback.comment && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              Feedback:
                            </span>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                              {result.feedback.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(comparison.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default History 