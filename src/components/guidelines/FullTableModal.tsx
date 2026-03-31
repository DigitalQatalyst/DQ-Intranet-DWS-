import React, { useEffect, useRef } from 'react'
import { renderCellContent } from './cellRenderer'

export interface FullTableModalColumn {
  header: string
  accessor: string
}

export interface FullTableModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly title: string
  readonly columns: FullTableModalColumn[]
  readonly data: Record<string, string | number>[]
  readonly description?: string
}

export function FullTableModal({ isOpen, onClose, title, columns, data, description }: FullTableModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
    } else {
      dialog.close()
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const filteredColumns = columns.filter(col => col.header.trim() !== '' && col.accessor.trim() !== '')

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto p-0 bg-transparent max-w-5xl w-full max-h-[85vh] rounded-xl overflow-hidden backdrop:bg-black backdrop:bg-opacity-50"
      onClose={onClose}
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900">{title}</h2>
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
                  {filteredColumns.map((col) => (
                    <th
                      key={col.accessor}
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
                  <tr key={`row-${rowIdx}-${String(row[filteredColumns[0]?.accessor] ?? rowIdx).slice(0, 20)}`} className="bg-white">
                    {filteredColumns.map((col) => (
                      <td
                        key={col.accessor}
                        className="px-6 py-4 text-sm border"
                        style={{ borderColor: '#E5E7EB' }}
                      >
                        {renderCellContent(row[col.accessor] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </dialog>
  )
}
