import React, { useEffect } from 'react'

export interface FullTableModalColumn {
  header: string
  accessor: string
}

export interface FullTableModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  columns: FullTableModalColumn[]
  data: Record<string, string | number>[]
  description?: string
}

function renderCellContent(value: string | number): React.ReactNode {
  if (typeof value !== 'string') {
    return value
  }

  const lines = value.split('\n').filter(line => line.trim())
  const hasBullets = lines.some(line => line.trim().startsWith('-'))

  if (hasBullets) {
    const bulletItems = lines
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim())

    if (bulletItems.length > 0) {
      return (
        <ul className="list-inside space-y-2">
          {bulletItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#FB5535] flex-shrink-0"></span>
              <span className="text-base text-gray-800">{item}</span>
            </li>
          ))}
        </ul>
      )
    }
  }

  return <span className="text-gray-700 whitespace-pre-line">{value}</span>
}

export function FullTableModal({ isOpen, onClose, title, columns, data, description }: FullTableModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const filteredColumns = columns.filter(col => col.header.trim() !== '' && col.accessor.trim() !== '')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-5xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {description && (
            <p className="mb-6 text-gray-700">{description}</p>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border" style={{ borderColor: '#E5E7EB' }}>
              <thead>
                <tr style={{ backgroundColor: '#0A1A3B' }}>
                  {filteredColumns.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-4 text-left text-sm font-semibold text-white border"
                      style={{ borderColor: '#E5E7EB' }}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {data.map((row, rowIdx) => (
                  <tr key={rowIdx} className="bg-white">
                    {filteredColumns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className="px-6 py-4 text-sm border"
                        style={{ borderColor: '#E5E7EB' }}
                      >
                        {renderCellContent(row[col.accessor] || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

