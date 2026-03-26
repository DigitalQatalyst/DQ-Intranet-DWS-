# Frontend HTML Rendering Instructions

## Objective

Update the frontend to render HTML content directly from the `guides.body` field, matching what the Admin app saves.

---

## Current Frontend Behavior (INCORRECT)

The frontend currently expects JSON and tries to parse it:

```typescript
// ❌ CURRENT CODE (WRONG)
const { data } = await supabaseClient
  .from('guides')
  .select('title, last_updated_at, body')
  .eq('slug', 'dq-associate-owned-asset-guidelines')
  .maybeSingle()

// Tries to parse as JSON
const content: GuidelineContent = JSON.parse(data.body)
setSections(content.sections || [])

// Renders sections
{sections.map((section) => (
  section.type === 'text' ? 
    <div dangerouslySetInnerHTML={{ __html: section.content }} /> :
  section.type === 'table' ?
    <SummaryTable columns={section.table.columns} data={section.table.data} /> :
    null
))}
```

---

## New Frontend Behavior (CORRECT)

The frontend should render HTML directly without JSON parsing:

```typescript
// ✅ NEW CODE (CORRECT)
const { data } = await supabaseClient
  .from('guides')
  .select('title, last_updated_at, body')
  .eq('slug', 'dq-associate-owned-asset-guidelines')
  .maybeSingle()

// Store HTML directly (no JSON parsing)
setGuideHtml(data.body || '')

// Render HTML directly
<div 
  className="prose max-w-none"
  dangerouslySetInnerHTML={{ __html: guideHtml }}
/>
```

---

## Implementation Steps

### Step 1: Update State Management

**Before:**
```typescript
const [sections, setSections] = useState<Section[]>([])
```

**After:**
```typescript
const [guideHtml, setGuideHtml] = useState<string>('')
```

### Step 2: Update Data Fetching

**Before:**
```typescript
useEffect(() => {
  (async () => {
    const { data, error } = await supabaseClient
      .from('guides')
      .select('title, last_updated_at, body')
      .eq('slug', slug)
      .maybeSingle()
    
    if (data?.body) {
      const content = JSON.parse(data.body)  // ❌ Remove this
      setSections(content.sections || [])     // ❌ Remove this
    }
  })()
}, [slug])
```

**After:**
```typescript
useEffect(() => {
  (async () => {
    const { data, error } = await supabaseClient
      .from('guides')
      .select('title, last_updated_at, body')
      .eq('slug', slug)
      .maybeSingle()
    
    if (data?.body) {
      setGuideHtml(data.body)  // ✅ Store HTML directly
    }
  })()
}, [slug])
```

### Step 3: Update Rendering Logic

**Before:**
```typescript
{sections.map((section) => (
  <div key={section.id}>
    <GuidelineSection id={section.id} title={section.title}>
      {section.type === 'text' && (
        <div dangerouslySetInnerHTML={{ __html: section.content }} />
      )}
      {section.type === 'table' && section.table && (
        <SummaryTable
          columns={section.table.columns}
          data={section.table.data}
        />
      )}
    </GuidelineSection>
  </div>
))}
```

**After:**
```typescript
<div 
  className="prose prose-lg max-w-none
             prose-headings:font-bold prose-headings:text-gray-900
             prose-p:text-gray-700 prose-p:leading-relaxed
             prose-table:border-collapse prose-table:w-full
             prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-3
             prose-td:border prose-td:border-gray-300 prose-td:p-3"
  dangerouslySetInnerHTML={{ __html: guideHtml }}
/>
```

### Step 4: Add Styling for HTML Tables

Since tables are now HTML `<table>` elements, add CSS to style them properly:

```css
/* Add to your global CSS or component styles */
.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.prose th {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
}

.prose td {
  border: 1px solid #d1d5db;
  padding: 0.75rem;
}

.prose tr:nth-child(even) {
  background-color: #f9fafb;
}

.prose h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.prose h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
}
```

---

## Complete Example Component

```typescript
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSupabaseClient2 } from '../lib/supabaseClient'

export const GuidelinePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [guideTitle, setGuideTitle] = useState<string>('')
  const [guideHtml, setGuideHtml] = useState<string>('')
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        setLoading(true)
        const supabaseClient = getSupabaseClient2()
        
        const { data, error } = await supabaseClient
          .from('guides')
          .select('title, last_updated_at, body')
          .eq('slug', slug)
          .maybeSingle()

        if (error) throw error

        if (!cancelled && data) {
          setGuideTitle(data.title || '')
          setGuideHtml(data.body || '')
          setLastUpdated(data.last_updated_at || '')
        }
      } catch (err) {
        console.error('Error fetching guide:', err)
        if (!cancelled) {
          setError('Failed to load guide')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {guideTitle}
        </h1>
        {lastUpdated && (
          <p className="text-sm text-gray-500">
            Last updated: {new Date(lastUpdated).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* HTML Content */}
      <div 
        className="prose prose-lg max-w-none
                   prose-headings:font-bold prose-headings:text-gray-900
                   prose-p:text-gray-700 prose-p:leading-relaxed
                   prose-a:text-blue-600 prose-a:underline
                   prose-ul:list-disc prose-ul:ml-6
                   prose-ol:list-decimal prose-ol:ml-6
                   prose-table:border-collapse prose-table:w-full
                   prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left
                   prose-td:border prose-td:border-gray-300 prose-td:p-3
                   prose-tr:even:bg-gray-50"
        dangerouslySetInnerHTML={{ __html: guideHtml }}
      />
    </div>
  )
}
```

---

## Files to Update

Based on your documentation, these files likely need updates:

1. **Guide/Guideline Page Components**
   - Any component that fetches from `guides` table
   - Remove `JSON.parse()` calls
   - Remove section mapping logic
   - Add direct HTML rendering

2. **Type Definitions**
   - Remove `Section` interface with `type`, `table`, etc.
   - Simplify to just store HTML string

3. **Styling**
   - Add CSS for HTML tables
   - Use Tailwind's `prose` classes for typography
   - Ensure tables are responsive

---

## Benefits of This Approach

✅ **Simpler**: No JSON parsing, no section management
✅ **Consistent**: Matches what Admin saves
✅ **Flexible**: Admin can use full CKEditor features (tables, lists, formatting)
✅ **Maintainable**: Single source of truth (HTML)
✅ **No data loss**: Existing guides work immediately

---

## Security Note

Using `dangerouslySetInnerHTML` requires trust in the content source. Since content comes from your Admin app with authentication:

1. ✅ Content is created by authenticated admins
2. ✅ RichTextEditor sanitizes HTML with DOMPurify
3. ✅ Only allowed HTML tags are saved
4. ✅ Safe to render on frontend

---

## Testing Checklist

After implementing:

- [ ] Fetch a guide from database
- [ ] Verify HTML renders correctly
- [ ] Check tables display properly
- [ ] Verify headings have correct styling
- [ ] Test paragraphs and lists
- [ ] Ensure links work
- [ ] Check responsive layout
- [ ] Verify no console errors

---

## Migration Note

If you have existing guides with JSON format in the database, you have two options:

**Option A: Convert JSON to HTML (one-time migration)**
```typescript
// Migration script
const convertJsonToHtml = (jsonBody: string): string => {
  const content = JSON.parse(jsonBody)
  let html = ''
  
  content.sections.forEach(section => {
    if (section.type === 'text') {
      html += `<h2>${section.title}</h2>`
      html += section.content
    } else if (section.type === 'table') {
      html += `<h2>${section.title}</h2>`
      if (section.description) {
        html += `<p>${section.description}</p>`
      }
      html += '<table>'
      html += '<thead><tr>'
      section.table.columns.forEach(col => {
        html += `<th>${col.header}</th>`
      })
      html += '</tr></thead><tbody>'
      section.table.data.forEach(row => {
        html += '<tr>'
        section.table.columns.forEach(col => {
          html += `<td>${row[col.accessor]}</td>`
        })
        html += '</tr>'
      })
      html += '</tbody></table>'
    }
  })
  
  return html
}
```

**Option B: Support both formats (detect and render accordingly)**
```typescript
const renderGuide = (body: string) => {
  // Try to detect if it's JSON
  if (body.trim().startsWith('{')) {
    try {
      const content = JSON.parse(body)
      if (content.sections) {
        // Render JSON format (old way)
        return renderJsonSections(content.sections)
      }
    } catch {
      // Not JSON, fall through to HTML
    }
  }
  
  // Render as HTML (new way)
  return <div dangerouslySetInnerHTML={{ __html: body }} />
}
```

---

## Summary

**Change**: Frontend should render HTML directly from `guides.body` field
**Remove**: JSON parsing, section mapping, structured table components
**Add**: Direct HTML rendering with `dangerouslySetInnerHTML`
**Style**: Use Tailwind `prose` classes and custom table CSS
**Result**: Frontend matches Admin app's HTML output
