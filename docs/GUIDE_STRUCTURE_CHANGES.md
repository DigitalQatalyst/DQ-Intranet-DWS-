# Guide: Where to Change Page Structure for Supabase Data

When data is fetched from Supabase, you need to modify **3 key locations** in `GuideDetailPage.tsx`:

## 📍 Location 1: Interface Definition (Lines 23-46)

**File:** `src/pages/guides/GuideDetailPage.tsx`

Add new fields to the `GuideRecord` interface:

```typescript
interface GuideRecord {
  id: string
  slug?: string
  title: string
  // ... existing fields ...
  
  // ✨ ADD NEW FIELDS HERE:
  likes?: number | null
  comments?: number | null
  contactEmail?: string | null
  department?: string | null
  // ... any other fields from Supabase
}
```

## 📍 Location 2: Supabase Query (Line 82)

**File:** `src/pages/guides/GuideDetailPage.tsx` (Line 82)

The query currently uses `select('*')` which fetches ALL columns. If you want to be specific:

```typescript
// Current (fetches all columns):
let { data: row, error: err1 } = await supabaseClient
  .from('guides')
  .select('*')  // ← Gets all columns
  .eq('slug', key)
  .maybeSingle()

// OR specify columns explicitly:
let { data: row, error: err1 } = await supabaseClient
  .from('guides')
  .select('id, slug, title, summary, likes, comments, contact_email')  // ← Specify columns
  .eq('slug', key)
  .maybeSingle()
```

## 📍 Location 3: Data Mapping (Lines 90-111)

**File:** `src/pages/guides/GuideDetailPage.tsx` (Lines 90-111)

Map Supabase column names (snake_case) to your interface (camelCase):

```typescript
const mapped: GuideRecord = {
  id: row.id,
  slug: row.slug,
  title: row.title,
  // ... existing mappings ...
  
  // ✨ ADD NEW MAPPINGS HERE:
  likes: row.likes ?? row.likes_count ?? null,
  comments: row.comments ?? row.comments_count ?? null,
  contactEmail: row.contact_email ?? null,
  department: row.department ?? row.function_area ?? null,
  // Note: Supabase uses snake_case, interface uses camelCase
}
```

## 📍 Location 4: Use in JSX (Anywhere in the component)

**File:** `src/pages/guides/GuideDetailPage.tsx` (In the return statement)

Use the new fields in your JSX:

```typescript
// Example: Using new fields
{guide.likes && (
  <div>Likes: {guide.likes}</div>
)}

{guide.contactEmail && (
  <a href={`mailto:${guide.contactEmail}`}>Contact</a>
)}
```

---

## 🔄 Complete Example: Adding a "Contact Email" Field

### Step 1: Add to Interface (Line ~41)
```typescript
interface GuideRecord {
  // ... existing fields ...
  contactEmail?: string | null  // ← Add this
}
```

### Step 2: Map in Data Fetching (Line ~108)
```typescript
const mapped: GuideRecord = {
  // ... existing mappings ...
  contactEmail: row.contact_email ?? null,  // ← Add this
}
```

### Step 3: Use in JSX (Anywhere in return)
```typescript
{guide.contactEmail && (
  <div className="text-sm text-gray-600">
    Contact: <a href={`mailto:${guide.contactEmail}`}>{guide.contactEmail}</a>
  </div>
)}
```

---

## 📝 Notes:

1. **Column Naming**: Supabase uses `snake_case` (e.g., `contact_email`), TypeScript uses `camelCase` (e.g., `contactEmail`)

2. **Null Handling**: Always use `?? null` or `?? undefined` to handle null values from Supabase

3. **Related Items**: If you need to fetch related data, check the "Related guides" section (lines 163-217)

4. **API Route**: If data comes from `/api/guides/[id]`, check `api/guides.ts` for the mapping there too

---

## 🎯 Quick Reference:

- **Interface**: Lines 23-46
- **Supabase Query**: Line 82 (and line 85 for fallback)
- **Data Mapping**: Lines 90-111
- **Related Items Query**: Lines 168-217
- **JSX Usage**: Lines 342+ (in the return statement)

