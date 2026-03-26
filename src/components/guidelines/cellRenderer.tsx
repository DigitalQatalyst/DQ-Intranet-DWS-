import React from 'react'

export function renderCellContent(value: string | number): React.ReactNode {
  if (typeof value !== 'string') return value

  const lines = value.split('\n').filter(line => line.trim())
  const hasBullets = lines.some(line => line.trim().startsWith('-'))

  if (hasBullets) {
    const bulletItems = lines
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim())

    if (bulletItems.length > 0) {
      return (
        <ul className="list-inside space-y-2">
          {bulletItems.map((item) => (
            <li key={item.slice(0, 40)} className="flex items-start gap-3">
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
