# DQ Schema Update Summary

## Overview
Updated the `dq_tiles` and `dq_dna_nodes` tables to include an `image_url` field for visual content support.

## Schema Changes

### 1. `dq_tiles` Table
**Added Field:**
- `image_url` (text, nullable) - Unsplash image URL for tile visual representation

**Updated Schema:**
```sql
CREATE TABLE public.dq_tiles (
  id text PRIMARY KEY,                -- e.g. 'dtmp','dtmaas','dtq4t','dtmb','dtmi','dtma','dcocc'
  title text NOT NULL,
  subtitle text NOT NULL,
  description text NOT NULL,
  tone dq_tone NOT NULL,
  href text,
  sort_order integer NOT NULL DEFAULT 0,
  image_url text,                     -- NEW: Unsplash image URL for tile
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### 2. `dq_dna_nodes` Table
**Added Field:**
- `image_url` (text, nullable) - Unsplash image URL for DNA node visual representation

**Updated Schema:**
```sql
CREATE TABLE public.dq_dna_nodes (
  id integer PRIMARY KEY,             -- matches UI numbering (1..7)
  role dq_role NOT NULL,
  title text NOT NULL,
  subtitle text NOT NULL,
  fill dq_fill NOT NULL,
  details text[],                     -- optional bullet points
  kb_url text NOT NULL,
  lms_url text NOT NULL,
  image_url text,                     -- NEW: Unsplash image URL for DNA node
  created_at timestamptz NOT NULL DEFAULT now()
);
```

## Code Updates

### Files Modified:

#### 1. **Type Definitions**
- **Created:** `src/types/dq.ts`
  - Added `DqDnaNode` interface with `image_url` field
  - Added `DqTile` interface with `image_url` field
  - Added supporting types: `DqRole`, `DqFill`, `DqTone`

#### 2. **Components**
- **Updated:** `src/components/Discover/DqDnaSection.tsx`
  - Added `image_url?: string` to `DnaItem` type
  - Added image URLs to all 7 DNA items

- **Updated:** `src/components/Discover/DQDNA.tsx`
  - Added `image_url` property to all DNA items in the array

### Image URLs Assigned

| ID | DNA Node | Image URL | Theme |
|----|----------|-----------|-------|
| 1 | The Vision | `photo-1451187580459-43490279c0fa` | Space/Future |
| 2 | The HoV | `photo-1522071820081-009f0129c71c` | Team Collaboration |
| 3 | The Personas | `photo-1573497019940-1c28c88b4f3e` | People/Identity |
| 4 | Agile TMS | `photo-1484480974693-6ca0a78fb36b` | Task Management |
| 5 | Agile SOS | `photo-1450101499163-c8848c66ca85` | Governance/Strategy |
| 6 | Agile Flows | `photo-1551288049-bebda4e38f71` | Analytics/Data |
| 7 | Agile DTMF | `photo-1460925895917-afdab827c52f` | Products/Services |

## Migration Steps

### 1. Run Database Migration
```sql
-- Execute in Supabase SQL Editor
-- File: supabase/migrations/add_image_url_to_dq_tables.sql
```

### 2. Verify Changes
```sql
-- Check dq_dna_nodes
SELECT id, title, image_url FROM public.dq_dna_nodes ORDER BY id;

-- Check dq_tiles
SELECT id, title, image_url FROM public.dq_tiles ORDER BY sort_order;
```

### 3. Update Application Code
The following files have been updated and are ready to use:
- ✅ `src/types/dq.ts` (new)
- ✅ `src/components/Discover/DqDnaSection.tsx`
- ✅ `src/components/Discover/DQDNA.tsx`

## Usage Examples

### Accessing Image URL in Components

```typescript
import { DnaItem } from '@/components/Discover/DqDnaSection';

const MyComponent = ({ item }: { item: DnaItem }) => {
  return (
    <div>
      {item.image_url && (
        <img 
          src={item.image_url} 
          alt={item.title}
          className="w-full h-48 object-cover rounded-lg"
        />
      )}
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  );
};
```

### Fetching from Supabase

```typescript
import { supabase } from '@/lib/supabaseClient';
import type { DqDnaNode } from '@/types/dq';

const fetchDnaNodes = async (): Promise<DqDnaNode[]> => {
  const { data, error } = await supabase
    .from('dq_dna_nodes')
    .select('*')
    .order('id');
  
  if (error) throw error;
  return data || [];
};
```

## Future Enhancements

### Potential Additions:
1. **Image Metadata**
   - Add `image_alt_text` for accessibility
   - Add `image_credit` for attribution
   - Add `image_thumbnail_url` for performance

2. **Multiple Images**
   - Support for image galleries
   - Different images for light/dark themes
   - Responsive image variants

3. **Image Management**
   - Admin interface for image uploads
   - Integration with image CDN
   - Automatic image optimization

## Notes

- All image URLs use Unsplash with optimized parameters (`w=800&h=600&fit=crop`)
- Images are optional (nullable field) to maintain backward compatibility
- Existing data without images will continue to work
- Consider adding image validation in the application layer
- Implement lazy loading for images to improve performance

## Rollback

If needed, to remove the image_url fields:

```sql
ALTER TABLE public.dq_tiles DROP COLUMN IF EXISTS image_url;
ALTER TABLE public.dq_dna_nodes DROP COLUMN IF EXISTS image_url;
```
