import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { ComparisonResult } from '../stores/useCompareStore'

interface PerformanceAnalyticsProps {
  results: ComparisonResult[]
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ results }) => {
  const chartData = results.map(result => ({
    model: result.modelId,
    tokens: result.tokens,
    time: result.time,
    tokensPerSecond: Math.round((result.tokens / result.time) * 1000),
  }))

  const averageTokens = Math.round(
    results.reduce((acc, result) => acc + result.tokens, 0) / results.length
  )

  const averageTime = Math.round(
    results.reduce((acc, result) => acc + result.time, 0) / results.length
  )

  const fastestModel = results.reduce((fastest, current) =>
    current.time < fastest.time ? current : fastest
  )

  const mostEfficientModel = results.reduce((efficient, current) =>
    (current.tokens / current.time) > (efficient.tokens / efficient.time) ? current : efficient
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Tokens</h4>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{averageTokens}</p>
        </div>
        <div className="card p-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Time</h4>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{averageTime}ms</p>
        </div>
        <div className="card p-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fastest Model</h4>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{fastestModel.modelId}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{fastestModel.time}ms</p>
        </div>
        <div className="card p-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Efficient</h4>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{mostEfficientModel.modelId}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round((mostEfficientModel.tokens / mostEfficientModel.time) * 1000)} tokens/s
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Response Time</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="time" fill="#4F46E5" name="Time (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tokens per Second</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tokensPerSecond"
                  stroke="#4F46E5"
                  name="Tokens/s"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceAnalytics 