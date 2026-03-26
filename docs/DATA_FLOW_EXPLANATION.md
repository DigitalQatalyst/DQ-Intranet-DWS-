# Data Flow: Database → Rendered Page

## Overview

The data flows through 3 stages:
1. **Storage Format** (Database)
2. **Fetch & Parse** (Component)
3. **Render** (UI)

---

## 1. Storage Format (Database)

### Location
- **Table**: `guides`
- **Field**: `body` (TEXT/JSONB)
- **Record**: `slug = 'dq-associate-owned-asset-guidelines'`

### Format: JSON String
The content is stored as a JSON string with this structure:

```json
{
  "sections": [
    {
      "id": "context",
      "title": "1. Context",
      "order": 1,
      "type": "text",
      "content": "The Associate Owned Asset Initiative is a strategic effort..."
    },
    {
      "id": "core-components",
      "title": "4. Core Components",
      "order": 4,
      "type": "table",
      "description": "The Guidelines comprises of three core programs...",
      "table": {
        "title": "Core Components",
        "columns": [
          { "header": "#", "accessor": "number" },
          { "header": "Program", "accessor": "program" },
          { "header": "Description", "accessor": "description" }
        ],
        "data": [
          {
            "number": "01",
            "program": "BYOD (Bring Your Own Device)",
            "description": "Associates are required to bring their personal devices..."
          },
          {
            "number": "02",
            "program": "FYOD (Finance Your Own Device)",
            "description": "Associates can apply for the FYOD program..."
          }
        ]
      }
    }
  ]
}
```

### Key Points:
- **Text sections**: Have `type: "text"` and `content` field (can contain HTML)
- **Table sections**: Have `type: "table"` and `table` object with columns and data
- **Order**: Each section has an `order` field for sorting

---

## 2. Fetch & Parse (Component)

### Step 1: Fetch from Database

```typescript
const { data, error } = await supabaseClient
  .from('guides')
  .select('title, last_updated_at, body')
  .eq('slug', 'dq-associate-owned-asset-guidelines')
  .maybeSingle()
```

**Returns:**
```javascript
{
  title: "DQ Associate Owned Asset Guidelines",
  last_updated_at: "2026-02-26T07:25:23.705+00:00",
  body: "{\"sections\":[{\"id\":\"context\",\"title\":\"1. Context\"...}]}"
}
```

### Step 2: Parse JSON String

```typescript
const content: GuidelineContent = JSON.parse(data.body)
```

**Converts to JavaScript Object:**
```javascript
{
  sections: [
    {
      id: "context",
      title: "1. Context",
      order: 1,
      type: "text",
      content: "The Associate Owned Asset Initiative..."
    },
    // ... more sections
  ]
}
```

### Step 3: Store in State

```typescript
setSections(content.sections || [])
```

**State now contains:**
```javascript
[
  { id: "context", title: "1. Context", type: "text", content: "..." },
  { id: "overview", title: "2. Overview", type: "text", content: "..." },
  { id: "core-components", title: "4. Core Components", type: "table", table: {...} },
  // ... 15 more sections
]
```

---

## 3. Render (UI)

### Rendering Logic

```typescript
{sections.map((section) => (
  <div key={section.id}>
    <GuidelineSection id={section.id} title={section.title}>
      {section.type === 'text' && (
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: section.content || '' }}
        />
      )}
      
      {section.type === 'table' && section.table && (
        <>
          {section.description && <p className="mb-6">{section.description}</p>}
          <SummaryTable
            title={section.table.title}
            columns={section.table.columns}
            data={section.table.data}
            onViewFull={() => openModal(section.id)}
          />
        </>
      )}
    </GuidelineSection>
  </div>
))}
```

### How Each Type Renders

#### Text Sections
```typescript
// Input from database:
{
  type: "text",
  content: "The Associate Owned Asset Initiative is a strategic effort..."
}

// Renders as:
<div className="prose max-w-none">
  The Associate Owned Asset Initiative is a strategic effort...
</div>
```

#### Table Sections
```typescript
// Input from database:
{
  type: "table",
  table: {
    title: "Core Components",
    columns: [
      { header: "#", accessor: "number" },
      { header: "Program", accessor: "program" }
    ],
    data: [
      { number: "01", program: "BYOD" }
    ]
  }
}

// Renders as:
<SummaryTable
  title="Core Components"
  columns={[...]}
  data={[...]}
/>
```

---

## Complete Data Flow Example

### Example: "1. Context" Section

**1. Database (JSON String):**
```json
{
  "id": "context",
  "title": "1. Context",
  "order": 1,
  "type": "text",
  "content": "The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency..."
}
```

**2. After Fetch & Parse (JavaScript Object):**
```javascript
{
  id: "context",
  title: "1. Context",
  order: 1,
  type: "text",
  content: "The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency..."
}
```

**3. Rendered HTML:**
```html
<div>
  <div id="context">
    <h2>1. Context</h2>
    <div class="prose max-w-none">
      The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency...
    </div>
  </div>
</div>
```

**4. What You See:**
```
1. Context
The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency...
```

---

## Complete Data Flow Example: Table

### Example: "Core Components" Table

**1. Database (JSON String):**
```json
{
  "id": "core-components",
  "title": "4. Core Components",
  "order": 4,
  "type": "table",
  "description": "The Guidelines comprises of three core programs...",
  "table": {
    "title": "Core Components",
    "columns": [
      { "header": "#", "accessor": "number" },
      { "header": "Program", "accessor": "program" },
      { "header": "Description", "accessor": "description" }
    ],
    "data": [
      {
        "number": "01",
        "program": "BYOD (Bring Your Own Device)",
        "description": "Associates are required to bring their personal devices..."
      }
    ]
  }
}
```

**2. After Fetch & Parse (JavaScript Object):**
```javascript
{
  id: "core-components",
  title: "4. Core Components",
  order: 4,
  type: "table",
  description: "The Guidelines comprises of three core programs...",
  table: {
    title: "Core Components",
    columns: [
      { header: "#", accessor: "number" },
      { header: "Program", accessor: "program" },
      { header: "Description", accessor: "description" }
    ],
    data: [
      {
        number: "01",
        program: "BYOD (Bring Your Own Device)",
        description: "Associates are required to bring their personal devices..."
      }
    ]
  }
}
```

**3. Rendered HTML:**
```html
<div>
  <div id="core-components">
    <h2>4. Core Components</h2>
    <p>The Guidelines comprises of three core programs...</p>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Program</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>01</td>
          <td>BYOD (Bring Your Own Device)</td>
          <td>Associates are required to bring their personal devices...</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

**4. What You See:**
```
4. Core Components
The Guidelines comprises of three core programs...

┌────┬─────────────────────────────┬──────────────────────────────┐
│ #  │ Program                     │ Description                  │
├────┼─────────────────────────────┼──────────────────────────────┤
│ 01 │ BYOD (Bring Your Own Device)│ Associates are required...   │
└────┴─────────────────────────────┴──────────────────────────────┘
```

---

## TypeScript Interfaces

### Data Structure Types

```typescript
interface Section {
  id: string              // Unique identifier (e.g., "context")
  title: string           // Display title (e.g., "1. Context")
  order: number           // Sort order (1, 2, 3...)
  type: 'text' | 'table'  // Section type
  content?: string        // For text sections (can contain HTML)
  description?: string    // For table sections (intro text)
  table?: TableData       // For table sections
}

interface TableData {
  title: string           // Table title
  columns: Column[]       // Column definitions
  data: Row[]            // Table rows
}

interface Column {
  header: string          // Column header text
  accessor: string        // Key to access data in row
}

type Row = Record<string, string>  // Dynamic object with string keys/values
```

---

## Summary

### Format Chain:
1. **Database**: JSON string in `body` field
2. **Fetch**: String retrieved via Supabase client
3. **Parse**: `JSON.parse()` converts to JavaScript object
4. **State**: Stored in React state as array of sections
5. **Render**: Mapped to React components based on `type`

### Rendering Strategy:
- **Text sections**: Use `dangerouslySetInnerHTML` to render HTML content
- **Table sections**: Pass data to `SummaryTable` component which renders table HTML
- **Dynamic**: All sections rendered in a loop using `.map()`

### Key Benefits:
- ✅ Single source of truth (database)
- ✅ Type-safe with TypeScript interfaces
- ✅ Flexible structure (easy to add new section types)
- ✅ Reusable components (SummaryTable, GuidelineSection)
- ✅ No hardcoded content in component
