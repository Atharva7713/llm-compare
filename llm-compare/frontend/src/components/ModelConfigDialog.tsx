import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ModelConfig } from '../stores/useCompareStore'

interface ModelConfigDialogProps {
  model: ModelConfig
  isOpen: boolean
  onClose: () => void
  onSave: (config: ModelConfig) => void
}

const ModelConfigDialog: React.FC<ModelConfigDialogProps> = ({
  model,
  isOpen,
  onClose,
  onSave,
}) => {
  const [config, setConfig] = React.useState<ModelConfig>(model)

  React.useEffect(() => {
    setConfig(model)
  }, [model])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Configure {model.name}
              </h3>

              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Temperature
                  </label>
                  <div className="mt-1">
                    <input
                      type="range"
                      id="temperature"
                      min="0"
                      max="2"
                      step="0.1"
                      value={config.temperature}
                      onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {config.temperature.toFixed(1)}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Tokens
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="maxTokens"
                      min="1"
                      max="4000"
                      value={config.maxTokens}
                      onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                      className="input w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="btn btn-primary sm:ml-3 sm:w-auto"
              onClick={() => onSave(config)}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary mt-3 sm:mt-0 sm:w-auto"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModelConfigDialog 