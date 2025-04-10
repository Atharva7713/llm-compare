import { ComparisonResult } from '../stores/useCompareStore'

interface ExportData {
  prompt: string
  timestamp: string
  results: ComparisonResult[]
}

export const exportToJSON = (data: ExportData) => {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `llm-comparison-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const exportToCSV = (data: ExportData) => {
  const headers = ['Model', 'Response', 'Tokens', 'Time (ms)']
  const rows = data.results.map(result => [
    result.modelId,
    result.response.replace(/"/g, '""'),
    result.tokens,
    result.time
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `llm-comparison-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const exportToMarkdown = (data: ExportData) => {
  const markdown = [
    '# LLM Comparison Results',
    '',
    `**Prompt:** ${data.prompt}`,
    `**Date:** ${new Date(data.timestamp).toLocaleString()}`,
    '',
    '## Responses',
    '',
    ...data.results.map(result => [
      `### ${result.modelId}`,
      '',
      `**Tokens:** ${result.tokens}`,
      `**Time:** ${result.time}ms`,
      '',
      '```',
      result.response,
      '```',
      ''
    ].join('\n'))
  ].join('\n')

  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `llm-comparison-${new Date().toISOString().split('T')[0]}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
} 