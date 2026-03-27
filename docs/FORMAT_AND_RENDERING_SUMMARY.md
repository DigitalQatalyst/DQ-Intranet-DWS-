# Format & Rendering Summary

## Quick Answer

**Format**: JSON stored as a string in the database
**Rendering**: Parsed to JavaScript objects, then rendered as React components

---

## The Simple Version

### 1. Database Format
```
Stored as: JSON string in the `body` field
Example: "{\"sections\":[{\"id\":\"context\",\"type\":\"text\"...}]}"
```

### 2. How It's Fetched
```typescript
// Fetch from Supabase
const { data } = await supabaseClient
  .from('guides')
  .select('body')
  .eq('slug', 'dq-associate-owned-asset-guidelines')

// Parse JSON string to JavaScript object
const content = JSON.parse(data.body)

// Store in React state
setSections(content.sections)
```

### 3. How It's Rendered
```typescript
// Loop through sections and render based on type
{sections.map((section) => (
  section.type === 'text' 
    ? <div dangerouslySetInnerHTML={{ __html: section.content }} />
    : <SummaryTable data={section.table.data} />
))}
```

---

## The Two Content Types

### Type 1: Text Sections (11 sections)

**Database:**
```json
{
  "type": "text",
  "content": "The Associate Owned Asset Initiative..."
}
```

**Rendered As:**
```html
<div class="prose">
  The Associate Owned Asset Initiative...
</div>
```

**Examples:**
- 1. Context
- 2. Overview
- 3. Purpose and Scope
- 5. Roles and Responsibilities
- 5.1 BYOD
- 5.2 FYOD
- 5.2.3 HYOD
- 6. Guiding Principles
- 7. Tools and Resources
- 8. KPIs
- 9. Review Schedule

---

### Type 2: Table Sections (7 sections)

**Database:**
```json
{
  "type": "table",
  "table": {
    "title": "Core Components",
    "columns": [
      { "header": "#", "accessor": "number" },
      { "header": "Program", "accessor": "program" }
    ],
    "data": [
      { "number": "01", "program": "BYOD" }
    ]
  }
}
```

**Rendered As:**
```html
<table>
  <thead>
    <tr><th>#</th><th>Program</th></tr>
  </thead>
  <tbody>
    <tr><td>01</td><td>BYOD</td></tr>
  </tbody>
</table>
```

**Examples:**
- 4. Core Components (3 rows)
- 5.1.1 BYOD Procedure (3 rows)
- 5.1.2 BYOD Responsibilities (4 rows)
- 5.2.1 FYOD Procedure (5 rows)
- 5.2.2 FYOD Responsibilities (4 rows)
- 5.2.4 HYOD Procedure (5 rows)
- 5.2.5 HYOD Responsibilities (4 rows)

---

## Data Flow in 5 Steps

```
1. DATABASE (Supabase)
   Format: JSON string
   ↓
2. FETCH (Supabase Client)
   Format: JavaScript string
   ↓
3. PARSE (JSON.parse)
   Format: JavaScript object
   ↓
4. STATE (React useState)
   Format: Array of sections
   ↓
5. RENDER (React JSX)
   Format: HTML elements
```

---

## Key Points

✅ **Storage**: JSON string in database `body` field
✅ **Fetch**: Supabase client retrieves the string
✅ **Parse**: `JSON.parse()` converts to JavaScript object
✅ **State**: Stored in React state as array
✅ **Render**: Mapped to React components dynamically
✅ **Display**: Browser renders as HTML

---

## Why This Approach?

### Advantages:
1. **Flexible**: Can store any structure in JSON
2. **Type-safe**: TypeScript interfaces ensure correct structure
3. **Dynamic**: Content changes without code changes
4. **Scalable**: Easy to add new section types
5. **Maintainable**: Single source of truth in database

### How It Works:
- Text sections use `dangerouslySetInnerHTML` to render HTML
- Table sections use custom `SummaryTable` component
- All sections rendered in a loop using `.map()`
- Each section type has its own rendering logic

---

## See It In Action

### Open Browser Console (F12)
You'll see these logs:
```
✅ [DATABASE] Loaded guideline content from database
📊 [DATABASE] Total sections: 18
📝 [DATABASE] Text sections: 11
📋 [DATABASE] Table sections: 7
```

### Check Network Tab
You'll see:
```
Request: GET /rest/v1/guides?slug=eq.dq-associate-owned-asset-guidelines
Response: { body: "{\"sections\":[...]}" }
```

### Inspect Element
Right-click any section and "Inspect":
```html
<div id="context">
  <h2>1. Context</h2>
  <div class="prose">...</div>
</div>
```

---

## Files to Review

1. **Component**: `src/pages/guidelines/associate-owned-asset-guidelines/GuidelinePage.tsx`
   - Lines 47-76: Fetch and parse logic
   - Lines 162-185: Rendering logic

2. **Data Flow**: `DATA_FLOW_EXPLANATION.md`
   - Complete explanation with examples

3. **Visual Flow**: `RENDERING_FLOW_VISUAL.md`
   - Diagrams showing data transformation

4. **Verification**: `DATABASE_VERIFICATION_PROOF.md`
   - Proof that content is from database
