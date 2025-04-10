import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PreferencesState {
  isDarkMode: boolean
  defaultTemperature: number
  defaultMaxTokens: number
  setIsDarkMode: (isDarkMode: boolean) => void
  setDefaultTemperature: (temperature: number) => void
  setDefaultMaxTokens: (maxTokens: number) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      defaultTemperature: 0.7,
      defaultMaxTokens: 2000,
      setIsDarkMode: (isDarkMode) => set({ isDarkMode }),
      setDefaultTemperature: (defaultTemperature) => set({ defaultTemperature }),
      setDefaultMaxTokens: (defaultMaxTokens) => set({ defaultMaxTokens }),
    }),
    {
      name: 'preferences-storage',
    }
  )
) 