import React from 'react'
import { TablePreview } from './TablePreview'

interface HTMLProcessorProps {
  html: string
  className?: string
}

export function HTMLProcessor({ html, className = '' }: HTMLProcessorProps) {
  // Function to extract table data from HTML table element
  const extractTableData = (tableHtml: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(tableHtml, 'text/html')
    const table = doc.querySelector('table')
    
    if (!table) return null
    
    const headers: string[] = []
    const rows: string[][] = []
    
    // Extract headers
    const headerRow = table.querySelector('thead tr') || table.querySelector('tr')
    if (headerRow) {
      const headerCells = headerRow.querySelectorAll('th, td')
      headerCells.forEach(cell => {
        headers.push(cell.textContent?.trim() || '')
      })
    }
    
    // Extract data rows (skip header row if it was in tbody)
    const bodyRows = table.querySelectorAll('tbody tr')
    if (bodyRows.length > 0) {
      bodyRows.forEach(row => {
        const cells = row.querySelectorAll('td')
        const rowData: string[] = []
        cells.forEach(cell => {
          rowData.push(cell.textContent?.trim() || '')
        })
        if (rowData.length > 0) {
          rows.push(rowData)
        }
      })
    } else {
      // If no tbody, get all rows except the first (header)
      const allRows = table.querySelectorAll('tr')
      for (let i = 1; i < allRows.length; i++) {
        const cells = allRows[i].querySelectorAll('td')
        const rowData: string[] = []
        cells.forEach(cell => {
          rowData.push(cell.textContent?.trim() || '')
        })
        if (rowData.length > 0) {
          rows.push(rowData)
        }
      }
    }
    
    return { headers, rows }
  }

  // Process HTML to replace tables with TablePreview components
  const processHTML = () => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const tables = doc.querySelectorAll('table')
    
    const components: React.ReactNode[] = []
    let lastIndex = 0
    let htmlContent = html
    
    // If no tables, return original HTML
    if (tables.length === 0) {
      return (
        <div 
          className={className}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )
    }
    
    // Process each table
    tables.forEach((table, index) => {
      const tableHtml = table.outerHTML
      const tableIndex = htmlContent.indexOf(tableHtml, lastIndex)
      
      if (tableIndex !== -1) {
        // Add HTML content before this table
        const beforeTable = htmlContent.substring(lastIndex, tableIndex)
        if (beforeTable.trim()) {
          components.push(
            <div 
              key={`html-${index}`}
              className={className}
              dangerouslySetInnerHTML={{ __html: beforeTable }}
            />
          )
        }
        
        // Extract table data and add TablePreview component
        const tableData = extractTableData(tableHtml)
        if (tableData && tableData.headers.length > 0 && tableData.rows.length > 0) {
          components.push(
            <TablePreview 
              key={`table-${index}`}
              data={tableData}
            />
          )
        }
        
        lastIndex = tableIndex + tableHtml.length
      }
    })
    
    // Add remaining HTML content after the last table
    const remainingHtml = htmlContent.substring(lastIndex)
    if (remainingHtml.trim()) {
      components.push(
        <div 
          key="html-final"
          className={className}
          dangerouslySetInnerHTML={{ __html: remainingHtml }}
        />
      )
    }
    
    return <>{components}</>
  }

  return <div>{processHTML()}</div>
}