import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseShareableLink } from '../utils/share'
import { ComparisonResult } from '../types'
import PerformanceAnalytics from '../components/PerformanceAnalytics'
import ExportButton from '../components/ExportButton'

const Share: React.FC = () => {
  const navigate = useNavigate()
  const [data, setData] = useState<{
    prompt: string
    results: ComparisonResult[]
    timestamp: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sharedData = parseShareableLink()
    if (!sharedData) {
      setError('Invalid or missing share data')
      return
    }
    setData(sharedData)
  }, [])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary mt-4"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Loading...
          </h1>
        </div>
      </div>
    )
  }

  const { prompt, results, timestamp } = data
  const date = new Date(timestamp).toLocaleString()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Shared Comparison
            </h1>
            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              New Comparison
            </button>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Shared on {date}
          </div>

          <div className="prose dark:prose-invert max-w-none mb-6">
            <h2 className="text-xl font-semibold">Prompt</h2>
            <p>{prompt}</p>
          </div>

          <div className="flex justify-end space-x-4">
            <ExportButton prompt={prompt} results={results} />
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Performance Analytics
          </h2>
          <PerformanceAnalytics results={results} />
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Results
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.map((result) => (
              <div
                key={result.modelId}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-2">
                  {result.modelId}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {result.tokens} tokens • {result.time}ms
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  {result.response}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Share 