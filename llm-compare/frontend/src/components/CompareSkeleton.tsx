import React from 'react'
import Skeleton from './Skeleton'

const CompareSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Compare LLM Responses
        </h2>
        
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-32 w-full" />
          </div>

          <div>
            <Skeleton className="h-4 w-48 mb-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Results
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CompareSkeleton 