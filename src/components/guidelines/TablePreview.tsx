import { useState } from 'react'
import { X } from 'lucide-react'

interface TableData {
  headers: string[]
  rows: string[][]
}

interface TablePreviewProps {
  data: TableData
  maxPreviewRows?: number
}

export function TablePreview({ data, maxPreviewRows = 2 }: TablePreviewProps) {
  const [showFullTable, setShowFullTable] = useState(false)
  
  const previewRows = data.rows.slice(0, maxPreviewRows)
  const hasMoreRows = data.rows.length > maxPreviewRows

  return (
    <>
      {/* Preview Table */}
      <div className="my-6">
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {data.headers.map((header, index) => (
                  <th
                    key={index}
                    className="text-white px-4 py-3 text-left font-semibold text-sm border-r last:border-r-0"
                    style={{ backgroundColor: '#030E31', borderRightColor: 'rgba(255,255,255,0.2)' }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 last:border-r-0"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {hasMoreRows && (
          <div className="mt-4 text-right">
            <button
              onClick={() => setShowFullTable(true)}
              className="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#030E31' }}
            >
              View Table
            </button>
          </div>
        )}
      </div>

      {/* Full Table Modal */}
      {showFullTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowFullTable(false)}
          />
          
          {/* Modal panel */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Full Table View
                </h3>
                <button
                  onClick={() => setShowFullTable(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="bg-white px-6 py-4 overflow-y-auto flex-1">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {data.headers.map((header, index) => (
                        <th
                          key={index}
                          className="text-white px-4 py-3 text-left font-semibold text-sm border-r last:border-r-0 sticky top-0"
                          style={{ backgroundColor: '#030E31', borderRightColor: 'rgba(255,255,255,0.2)' }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 last:border-r-0 border-b border-gray-200"
                          >
                            {cell}
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
      )}
    </>
  )
}