import React from 'react'

interface TableColumn {
  header: string
  accessor: string
}

interface GuidelineTableProps {
  columns: TableColumn[]
  data: Record<string, string | number>[]
  title?: string
}

export function GuidelineTable({ columns, data, title }: GuidelineTableProps) {
  return (
    <div className="my-8 overflow-x-auto">
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      )}
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
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="bg-white">
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className="px-6 py-4 text-sm text-gray-900 border border-gray-300"
                >
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
