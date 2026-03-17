import React from 'react'

export interface SummaryTableColumn {
  header: string
  accessor: string
}

export interface SummaryTableProps {
  columns: SummaryTableColumn[]
  data: Record<string, string | number>[]
  title?: string
  onViewFull?: () => void
  getSummary?: (value: string | number) => string
}

export function SummaryTable({ columns, data, title, onViewFull, getSummary }: SummaryTableProps) {
  const extractSummary = (value: string | number): string => {
    if (getSummary) return getSummary(value)
    
    if (typeof value === 'string') {
      // Extract first 2 bullet points
      const lines = value.split('\n').filter(line => line.trim())
      const bulletPoints = lines.filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      
      if (bulletPoints.length > 0) {
        return bulletPoints.slice(0, 2).join('\n')
      }
      
      // If no bullet points, take first 2 sentences
      const sentences = value.split(/[.!?]+/).filter(s => s.trim())
      if (sentences.length > 0) {
        return sentences.slice(0, 2).join('. ').trim() + (sentences.length > 2 ? '...' : '')
      }
      
      // Fallback: truncate to first 2 lines or 150 chars
      const firstTwoLines = lines.slice(0, 2).join('\n')
      return firstTwoLines.length > 150 ? firstTwoLines.substring(0, 150) + '...' : firstTwoLines
    }
    
    return String(value)
  }

  return (
    <div className="my-8">
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr style={{ backgroundColor: '#030E31' }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-left text-sm font-semibold text-white border border-gray-300"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.slice(0, 2).map((row, rowIdx) => (
              <tr key={rowIdx} className="bg-white">
                {columns.map((col, colIdx) => {
                  const value = row[col.accessor]
                  const isLastColumn = colIdx === columns.length - 1
                  const shouldSummarize = isLastColumn && typeof value === 'string' && value.length > 100
                  
                  return (
                    <td
                      key={colIdx}
                      className="px-6 py-4 text-sm text-gray-900 border border-gray-300 whitespace-pre-line"
                    >
                      {shouldSummarize ? extractSummary(value) : value}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {onViewFull && data.length > 2 && (
        <div className="mt-4 text-right">
          <button
            onClick={onViewFull}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#030E31' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#020A28'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#030E31'}
          >
            View Full Table
          </button>
        </div>
      )}
    </div>
  )
}

