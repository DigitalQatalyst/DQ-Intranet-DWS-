# Visual Data Flow: Database → Rendered Page

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    1. DATABASE (Supabase)                       │
│                                                                 │
│  Table: guides                                                  │
│  Field: body (TEXT)                                            │
│  Format: JSON String                                           │
│                                                                 │
│  "{\"sections\":[                                              │
│    {\"id\":\"context\",                                        │
│     \"title\":\"1. Context\",                                  │
│     \"type\":\"text\",                                         │
│     \"content\":\"The Associate Owned Asset...\"},            │
│    {\"id\":\"core-components\",                                │
│     \"type\":\"table\",                                        │
│     \"table\":{\"columns\":[...],\"data\":[...]}}             │
│  ]}"                                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [Supabase Client Fetch]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              2. FETCH & PARSE (React Component)                 │
│                                                                 │
│  Step 1: Fetch from Database                                   │
│  ────────────────────────────                                  │
│  const { data } = await supabaseClient                         │
│    .from('guides')                                             │
│    .select('body')                                             │
│    .eq('slug', 'dq-associate-owned-asset-guidelines')          │
│                                                                 │
│  Returns: { body: "{\"sections\":[...]}" }                     │
│                                                                 │
│  Step 2: Parse JSON String                                     │
│  ────────────────────────                                      │
│  const content = JSON.parse(data.body)                         │
│                                                                 │
│  Converts to JavaScript Object:                                │
│  {                                                             │
│    sections: [                                                 │
│      { id: "context", type: "text", content: "..." },         │
│      { id: "core-components", type: "table", table: {...} }   │
│    ]                                                           │
│  }                                                             │
│                                                                 │
│  Step 3: Store in State                                        │
│  ────────────────────────                                      │
│  setSections(content.sections)                                 │
│                                                                 │
│  State: Array of 18 section objects                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                      [React Rendering]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   3. RENDER (UI Components)                     │
│                                                                 │
│  {sections.map((section) => (                                  │
│    <div key={section.id}>                                      │
│      {section.type === 'text' && (                             │
│        <div dangerouslySetInnerHTML={{                         │
│          __html: section.content                               │
│        }} />                                                    │
│      )}                                                         │
│      {section.type === 'table' && (                            │
│        <SummaryTable                                           │
│          columns={section.table.columns}                       │
│          data={section.table.data}                             │
│        />                                                       │
│      )}                                                         │
│    </div>                                                       │
│  ))}                                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                      [Browser Renders]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    4. FINAL HTML (Browser)                      │
│                                                                 │
│  <div>                                                          │
│    <h2>1. Context</h2>                                         │
│    <div class="prose">                                         │
│      The Associate Owned Asset Initiative is a strategic...    │
│    </div>                                                       │
│  </div>                                                         │
│                                                                 │
│  <div>                                                          │
│    <h2>4. Core Components</h2>                                 │
│    <table>                                                      │
│      <thead>                                                    │
│        <tr><th>#</th><th>Program</th><th>Description</th></tr> │
│      </thead>                                                   │
│      <tbody>                                                    │
│        <tr>                                                     │
│          <td>01</td>                                           │
│          <td>BYOD (Bring Your Own Device)</td>                │
│          <td>Associates are required to bring...</td>          │
│        </tr>                                                    │
│      </tbody>                                                   │
│    </table>                                                     │
│  </div>                                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Format at Each Stage

### Stage 1: Database Storage
```
Format: JSON String (TEXT field)
Size: ~50KB
Encoding: UTF-8
```

### Stage 2: After Fetch
```
Format: JavaScript String
Type: string
Example: "{\"sections\":[{\"id\":\"context\"...}]}"
```

### Stage 3: After Parse
```
Format: JavaScript Object
Type: GuidelineContent
Structure: { sections: Section[] }
```

### Stage 4: In React State
```
Format: Array of Section objects
Type: Section[]
Length: 18 items
```

### Stage 5: Rendered HTML
```
Format: HTML DOM Elements
Type: HTMLElement nodes
Display: Visual content in browser
```

---

## 🎯 Two Rendering Paths

### Path A: Text Sections

```
Database JSON:
{
  "type": "text",
  "content": "The Associate Owned Asset Initiative..."
}
        ↓
React Component:
<div dangerouslySetInnerHTML={{ __html: section.content }} />
        ↓
Browser HTML:
<div class="prose max-w-none">
  The Associate Owned Asset Initiative...
</div>
        ↓
What You See:
The Associate Owned Asset Initiative is a strategic effort...
```

### Path B: Table Sections

```
Database JSON:
{
  "type": "table",
  "table": {
    "columns": [
      { "header": "#", "accessor": "number" },
      { "header": "Program", "accessor": "program" }
    ],
    "data": [
      { "number": "01", "program": "BYOD" }
    ]
  }
}
        ↓
React Component:
<SummaryTable
  columns={section.table.columns}
  data={section.table.data}
/>
        ↓
SummaryTable Component:
<table>
  <thead>
    <tr>
      {columns.map(col => <th>{col.header}</th>)}
    </tr>
  </thead>
  <tbody>
    {data.map(row => (
      <tr>
        {columns.map(col => <td>{row[col.accessor]}</td>)}
      </tr>
    ))}
  </tbody>
</table>
        ↓
Browser HTML:
<table class="min-w-full divide-y divide-gray-200">
  <thead class="bg-gray-50">
    <tr>
      <th>#</th>
      <th>Program</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>01</td>
      <td>BYOD</td>
    </tr>
  </tbody>
</table>
        ↓
What You See:
┌────┬──────────────────────────────┐
│ #  │ Program                      │
├────┼──────────────────────────────┤
│ 01 │ BYOD (Bring Your Own Device) │
└────┴──────────────────────────────┘
```

---

## 🔍 Real Example: "1. Context" Section

### 1. In Database (Raw)
```json
{
  "id": "context",
  "title": "1. Context",
  "order": 1,
  "type": "text",
  "content": "The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency, reducing asset management costs, and improving the accountability of devices used for company work. As a result of this initiative, the Associate Owned Asset Guidelines have been developed to mitigate the risk of asset theft by departing associates, while ensuring secure management and compliance with company standards. Through flexible options such as BYOD, FYOD and HYOD, DQ empowers associates to manage their own devices, fostering a more efficient and scalable approach to device management.\\n\\nIn this context, the `Company` refers to DQ whereas `Devices` refers to laptops."
}
```

### 2. After JSON.parse() (JavaScript Object)
```javascript
{
  id: "context",
  title: "1. Context",
  order: 1,
  type: "text",
  content: "The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency, reducing asset management costs, and improving the accountability of devices used for company work. As a result of this initiative, the Associate Owned Asset Guidelines have been developed to mitigate the risk of asset theft by departing associates, while ensuring secure management and compliance with company standards. Through flexible options such as BYOD, FYOD and HYOD, DQ empowers associates to manage their own devices, fostering a more efficient and scalable approach to device management.\n\nIn this context, the `Company` refers to DQ whereas `Devices` refers to laptops."
}
```

### 3. React JSX (Component)
```jsx
<GuidelineSection id="context" title="1. Context">
  <div 
    className="prose max-w-none"
    dangerouslySetInnerHTML={{ 
      __html: "The Associate Owned Asset Initiative is a strategic effort..." 
    }}
  />
</GuidelineSection>
```

### 4. Rendered HTML (Browser)
```html
<div id="context" class="mb-12">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">1. Context</h2>
  <div class="prose max-w-none">
    <p>The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency, reducing asset management costs, and improving the accountability of devices used for company work. As a result of this initiative, the Associate Owned Asset Guidelines have been developed to mitigate the risk of asset theft by departing associates, while ensuring secure management and compliance with company standards. Through flexible options such as BYOD, FYOD and HYOD, DQ empowers associates to manage their own devices, fostering a more efficient and scalable approach to device management.</p>
    <p>In this context, the `Company` refers to DQ whereas `Devices` refers to laptops.</p>
  </div>
</div>
```

### 5. What You See (Visual)
```
1. Context

The Associate Owned Asset Initiative is a strategic effort aimed at 
enhancing operational efficiency, reducing asset management costs, and 
improving the accountability of devices used for company work. As a 
result of this initiative, the Associate Owned Asset Guidelines have 
been developed to mitigate the risk of asset theft by departing 
associates, while ensuring secure management and compliance with 
company standards. Through flexible options such as BYOD, FYOD and 
HYOD, DQ empowers associates to manage their own devices, fostering 
a more efficient and scalable approach to device management.

In this context, the `Company` refers to DQ whereas `Devices` refers 
to laptops.
```

---

## 📝 Summary

### Format Chain:
1. **Database**: JSON string (TEXT field)
2. **Fetch**: JavaScript string
3. **Parse**: JavaScript object
4. **State**: Array of section objects
5. **Render**: React components
6. **Output**: HTML DOM elements
7. **Display**: Visual content

### Key Technologies:
- **Storage**: Supabase PostgreSQL
- **Fetch**: Supabase JavaScript Client
- **Parse**: `JSON.parse()`
- **State**: React `useState` hook
- **Render**: React JSX + `dangerouslySetInnerHTML` / Custom components
- **Display**: Browser DOM

### Rendering Methods:
- **Text sections**: `dangerouslySetInnerHTML` (allows HTML content)
- **Table sections**: Custom `SummaryTable` component (structured data)
- **Dynamic**: `.map()` loop over sections array
