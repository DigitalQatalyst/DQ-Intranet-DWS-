import React, { useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'
import { TablePreview } from './TablePreview'

interface HTMLProcessorProps {
  html: string
  className?: string
}

// Safe HTML block rendered via ref to avoid dangerouslySetInnerHTML
function SafeHTMLBlock({ html, htmlKey }: { html: string; htmlKey: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = DOMPurify.sanitize(html)
    }
  }, [html])

  return <div key={htmlKey} ref={ref} />
}

interface HTMLProcessorProps {
  html: string
  className?: string
}

export function HTMLProcessor({ html, className = '' }: HTMLProcessorProps) {
  const extractTableData = (tableHtml: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(tableHtml, 'text/html')
    const table = doc.querySelector('table')
    if (!table) return null

    const headers: string[] = []
    const rows: string[][] = []

    const headerRow = table.querySelector('thead tr') || table.querySelector('tr')
    if (headerRow) {
      headerRow.querySelectorAll('th, td').forEach(cell => {
        headers.push(cell.textContent?.trim() || '')
      })
    }

    const bodyRows = table.querySelectorAll('tbody tr')
    if (bodyRows.length > 0) {
      bodyRows.forEach(row => {
        const rowData: string[] = []
        row.querySelectorAll('td').forEach(cell => {
          rowData.push(cell.textContent?.trim() || '')
        })
        if (rowData.length > 0) rows.push(rowData)
      })
    } else {
      const allRows = table.querySelectorAll('tr')
      for (let i = 1; i < allRows.length; i++) {
        const rowData: string[] = []
        allRows[i].querySelectorAll('td').forEach(cell => {
          rowData.push(cell.textContent?.trim() || '')
        })
        if (rowData.length > 0) rows.push(rowData)
      }
    }

    return { headers, rows }
  }

  const processHTML = () => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const tables = doc.querySelectorAll('table')

    if (tables.length === 0) {
      return <SafeHTMLBlock html={html} htmlKey="html-only" />
    }

    const components: React.ReactNode[] = []
    let lastIndex = 0

    tables.forEach((table, index) => {
      const tableHtml = table.outerHTML
      const tableIndex = html.indexOf(tableHtml, lastIndex)

      if (tableIndex !== -1) {
        const beforeTable = html.substring(lastIndex, tableIndex)
        if (beforeTable.trim()) {
          components.push(
            <SafeHTMLBlock key={`html-${index}`} html={beforeTable} htmlKey={`html-${index}`} />
          )
        }

        const tableData = extractTableData(tableHtml)
        if (tableData && tableData.headers.length > 0 && tableData.rows.length > 0) {
          components.push(
            <TablePreview key={`table-${index}`} data={tableData} />
          )
        }

        lastIndex = tableIndex + tableHtml.length
      }
    })

    const remainingHtml = html.substring(lastIndex)
    if (remainingHtml.trim()) {
      components.push(
        <SafeHTMLBlock key="html-final" html={remainingHtml} htmlKey="html-final" />
      )
    }

    return <>{components}</>
  }

  return <div className={className}>{processHTML()}</div>
}
