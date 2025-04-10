import React, { useState } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { exportToJSON, exportToCSV, exportToMarkdown } from '../utils/export'
import { ComparisonResult } from '../stores/useCompareStore'

interface ExportButtonProps {
  prompt: string
  results: ComparisonResult[]
}

const ExportButton: React.FC<ExportButtonProps> = ({ prompt, results }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleExport = (format: 'json' | 'csv' | 'markdown') => {
    const data = {
      prompt,
      timestamp: new Date().toISOString(),
      results,
    }

    switch (format) {
      case 'json':
        exportToJSON(data)
        break
      case 'csv':
        exportToCSV(data)
        break
      case 'markdown':
        exportToMarkdown(data)
        break
    }

    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary inline-flex items-center"
      >
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Export
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu">
            <button
              onClick={() => handleExport('json')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
            >
              Export as JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
            >
              Export as CSV
            </button>
            <button
              onClick={() => handleExport('markdown')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
            >
              Export as Markdown
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExportButton 