import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Compare LLM Responses
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Easily compare responses from different Large Language Models. Test prompts, analyze performance, and make data-driven decisions.
        </p>
      </div>

      <div className="mt-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Start Comparison
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Compare responses from OpenAI, Cohere, and Anthropic models side by side.
            </p>
            <div className="mt-4">
              <Link
                to="/compare"
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Go to Compare
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              View History
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Access your previous comparisons and analyze performance over time.
            </p>
            <div className="mt-4">
              <Link
                to="/history"
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View History
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Customize Settings
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Configure model parameters, save preferences, and manage API keys.
            </p>
            <div className="mt-4">
              <Link
                to="/settings"
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Go to Settings
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 