import React from 'react'
import Skeleton from './Skeleton'

const HistorySkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Comparison History
        </h2>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-96" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HistorySkeleton 