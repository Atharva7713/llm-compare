import { ComparisonResult } from '../types'

interface ShareableComparison {
  prompt: string
  results: ComparisonResult[]
  timestamp: number
}

export const generateShareableLink = (prompt: string, results: ComparisonResult[]): string => {
  const shareableData: ShareableComparison = {
    prompt,
    results,
    timestamp: Date.now(),
  }
  
  const encodedData = encodeURIComponent(JSON.stringify(shareableData))
  return `${window.location.origin}/share?data=${encodedData}`
}

export const parseShareableLink = (): ShareableComparison | null => {
  const params = new URLSearchParams(window.location.search)
  const data = params.get('data')
  
  if (!data) return null
  
  try {
    const decodedData = JSON.parse(decodeURIComponent(data))
    return decodedData as ShareableComparison
  } catch (error) {
    console.error('Error parsing shareable link:', error)
    return null
  }
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
} 