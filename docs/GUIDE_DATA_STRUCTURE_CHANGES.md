# Guide: Where to Change Data Structure for Media Center Details Page

## Overview
The data flows from **Supabase Database → Component Mapping → UI Display**. Here's where to make changes at each level.

---

## 1. **Component Data Mapping** (Primary Location)
**File:** `src/pages/guides/GuideDetailPage.tsx`

### Location: Lines 90-111
This is where Supabase row data is mapped to the component's data structure.

```typescript
const mapped: GuideRecord = {
  id: row.id,
  slug: row.slug,
  title: row.title,
  summary: row.summary ?? undefined,
  heroImageUrl: row.hero_image_url ?? row.heroImageUrl ?? null,
  domain: row.domain ?? null,
  guideType: row.guide_type ?? row.guideType ?? null,  // Used for category tag
  functionArea: row.function_area ?? null,              // Used for department
  status: row.status ?? null,
  complexityLevel: row.complexity_level ?? null,
  skillLevel: row.skill_level ?? row.skillLevel ?? null,
  estimatedTimeMin: row.estimated_time_min ?? row.estimatedTimeMin ?? null,
  lastUpdatedAt: row.last_updated_at ?? row.lastUpdatedAt ?? null,  // Used for date
  authorName: row.author_name ?? row.authorName ?? null,            // Used for contact
  authorOrg: row.author_org ?? row.authorOrg ?? null,               // Used for contact/department
  isEditorsPick: row.is_editors_pick ?? row.isEditorsPick ?? null,
  downloadCount: row.download_count ?? row.downloadCount ?? null,
  documentUrl: row.document_url ?? row.documentUrl ?? null,
  body: row.body ?? null,
  steps: [], attachments: [], templates: [],
}
```

**To add new fields:**
1. Add the mapping here (e.g., `newField: row.new_field ?? null`)
2. Update the TypeScript interface (see #2 below)
3. Add the field to the database schema (see #3 below)

---

## 2. **TypeScript Interface** (Data Type Definition)
**File:** `src/pages/guides/GuideDetailPage.tsx`

### Location: Lines 23-46
This defines the structure of the `GuideRecord` type.

```typescript
interface GuideRecord {
  id: string
  slug?: string
  title: string
  summary?: string
  heroImageUrl?: string | null
  domain?: string | null
  guideType?: string | null          // Maps to: guide_type in DB
  functionArea?: string | null       // Maps to: function_area in DB
  status?: string | null
  complexityLevel?: string | null
  skillLevel?: string | null
  estimatedTimeMin?: number | null
  lastUpdatedAt?: string | null     // Maps to: last_updated_at in DB
  authorName?: string | null         // Maps to: author_name in DB
  authorOrg?: string | null          // Maps to: author_org in DB
  isEditorsPick?: boolean | null
  downloadCount?: number | null
  documentUrl?: string | null        // Maps to: document_url in DB
  body?: string | null
  steps?: Array<{ id?: string; position?: number; title?: string; content?: string }>
  attachments?: Array<{ id?: string; type?: string; title?: string; url?: string; size?: string }>
  templates?: Array<{ id?: string; title?: string; url?: string; size?: string }>
}
```

**To add new fields:**
- Add the property here with the correct type
- Example: `likes?: number | null` or `comments?: number | null`

---

## 3. **Database Schema** (Supabase)
**Files:**
- `supabase/migrations/20251029091752_remote_commit.sql` (lines 602-626)
- `db/supabase/20251014_guides_simplified.sql`

### Current Schema (from migration file):
```sql
CREATE TABLE IF NOT EXISTS "public"."guides" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "summary" "text",
    "hero_image_url" "text",
    "skill_level" "public"."skill_level" DEFAULT 'Beginner'::"public"."skill_level" NOT NULL,
    "estimated_time_min" integer,
    "last_updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_published_at" timestamp with time zone,
    "status" "public"."guide_status" DEFAULT 'Draft'::"public"."guide_status" NOT NULL,
    "author_name" "text",
    "author_org" "text",
    "is_editors_pick" boolean DEFAULT false NOT NULL,
    "download_count" integer DEFAULT 0 NOT NULL,
    "language" "text" DEFAULT 'English'::"text" NOT NULL,
    "search_vec" "tsvector",
    "domain" "text",
    "guide_type" "text",
    "function_area" "text",
    "complexity_level" "text",
    "document_url" "text",
    "body" "text",
    ...
);
```

**To add new fields:**
1. Create a migration file or run SQL in Supabase:
   ```sql
   ALTER TABLE public.guides
     ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0,
     ADD COLUMN IF NOT EXISTS comments integer DEFAULT 0;
   ```

2. Update the mapping in the component (see #1)

---

## 4. **Supabase Query** (Data Fetching)
**File:** `src/pages/guides/GuideDetailPage.tsx`

### Location: Lines 82-88
This is where data is fetched from Supabase.

```typescript
let { data: row, error: err1 } = await supabaseClient
  .from('guides')
  .select('*')  // Selects all columns
  .eq('slug', key)
  .maybeSingle()
```

**Note:** Using `select('*')` means all columns are fetched. If you add new columns to the database, they'll be available in `row` automatically.

**To fetch specific fields only:**
```typescript
.select('id, title, guide_type, author_name, author_org, ...')
```

---

## 5. **UI Display** (Where Data is Used)
**File:** `src/pages/guides/GuideDetailPage.tsx`

The component uses the mapped data in various places:

- **Category Tag:** `guide.guideType` (line ~370)
- **Date:** `guide.lastUpdatedAt` (line ~375)
- **Author Info:** `guide.authorName` and `guide.authorOrg` (line ~380)
- **Department:** `guide.functionArea` or `guide.domain` (line ~505)
- **Contact:** `guide.authorOrg` or `guide.authorName` (line ~500)

---

## Current Field Mapping Summary

| UI Element | Database Column | Component Property | Location in Code |
|------------|----------------|-------------------|------------------|
| Category Tag | `guide_type` | `guide.guideType` | Line 97, ~370 |
| Date | `last_updated_at` | `guide.lastUpdatedAt` | Line 103, ~375 |
| Author Name | `author_name` | `guide.authorName` | Line 104, ~380 |
| Author Org | `author_org` | `guide.authorOrg` | Line 105, ~380 |
| Department | `function_area` or `domain` | `guide.functionArea` or `guide.domain` | Line 98/96, ~505 |
| Contact | `author_org` or `author_name` | `guide.authorOrg` or `guide.authorName` | Line 105/104, ~500 |
| Document URL | `document_url` | `guide.documentUrl` | Line 108, ~525 |
| Body Content | `body` | `guide.body` | Line 109, ~450 |

---

## Example: Adding Likes/Comments from Database

If you want to store likes and comments in the database instead of using mock data:

### Step 1: Add to Database
```sql
ALTER TABLE public.guides
  ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments integer DEFAULT 0;
```

### Step 2: Update TypeScript Interface (Line 23-46)
```typescript
interface GuideRecord {
  // ... existing fields ...
  likes?: number | null
  comments?: number | null
}
```

### Step 3: Update Data Mapping (Line 90-111)
```typescript
const mapped: GuideRecord = {
  // ... existing mappings ...
  likes: row.likes ?? 0,
  comments: row.comments ?? 0,
}
```

### Step 4: Update UI (Line 63-64, ~545-551)
```typescript
// Change from:
const [likes, setLikes] = useState(47) // Mock
const [comments, setComments] = useState(12) // Mock

// To:
const [likes, setLikes] = useState(guide?.likes ?? 0)
const [comments, setComments] = useState(guide?.comments ?? 0)
```

---

## Quick Reference: File Locations

1. **Data Mapping:** `src/pages/guides/GuideDetailPage.tsx` (lines 90-111)
2. **Type Definition:** `src/pages/guides/GuideDetailPage.tsx` (lines 23-46)
3. **Database Schema:** `supabase/migrations/20251029091752_remote_commit.sql` (lines 602-626)
4. **Data Fetching:** `src/pages/guides/GuideDetailPage.tsx` (lines 82-88)
5. **UI Display:** `src/pages/guides/GuideDetailPage.tsx` (lines 365-575)

---

## Summary

**To change the data structure:**
1. ✅ **Component Mapping** (lines 90-111) - Map Supabase columns to component properties
2. ✅ **TypeScript Interface** (lines 23-46) - Define the data type
3. ✅ **Database Schema** (migration files) - Add/update columns if needed
4. ✅ **UI Display** (throughout component) - Use the mapped data

The current implementation already uses existing database fields, so **no database changes are required** for the current page structure. If you want to add new features (like storing likes/comments), follow the example above.

















