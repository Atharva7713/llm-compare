import React from 'react'
import { XMarkIcon, CommandLineIcon } from '@heroicons/react/24/outline'
import { keyboardShortcuts } from '../utils/keyboardShortcuts'

interface KeyboardShortcutsDialogProps {
  isOpen: boolean
  onClose: () => void
}

const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null

  const shortcuts = keyboardShortcuts.getShortcuts()

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
              <div className="flex items-center">
                <CommandLineIcon className="h-6 w-6 text-primary-500 mr-2" />
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Keyboard Shortcuts
                </h3>
              </div>

              <div className="mt-4">
                <div className="space-y-4">
                  {shortcuts.map((shortcut) => (
                    <div key={shortcut.key} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="btn btn-primary sm:ml-3 sm:w-auto"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KeyboardShortcutsDialog 