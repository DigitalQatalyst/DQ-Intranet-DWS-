# GHC Duplicate Content Fix Migration

## Overview

This migration fixes the issue where multiple GHC (Golden Honeycomb of Competencies) guides have identical body content, causing changes to one guide to appear on other guides' pages.

## What This Migration Does

### 1. **Identifies Duplicates**
- Function: `identify_ghc_duplicates()`
- Returns all groups of GHC guides that share identical body content
- Shows which guides are affected

### 2. **Prevents Future Duplicates**
- Trigger: `trg_check_ghc_content_uniqueness`
- Automatically prevents inserting/updating GHC guides with duplicate content
- Raises an error if you try to save duplicate content

### 3. **Validation Function**
- Function: `validate_ghc_uniqueness(uuid, text, text)`
- Can be called manually to check if content is unique
- Useful for admin interfaces

### 4. **Status Report**
- Function: `get_ghc_status_report()`
- Returns comprehensive status of all GHC guides
- Shows missing slugs, duplicate groups, empty bodies

## GHC Guide Slugs (Fixed List)

These 7 slugs are considered GHC guides:
- `dq-vision`
- `dq-hov`
- `dq-persona`
- `dq-agile-tms`
- `dq-agile-sos`
- `dq-agile-flows`
- `dq-agile-6xd`

## How to Use

### Step 1: Run the Migration ✅

1. Open Supabase Dashboard → SQL Editor
2. Copy the contents of `20250117_fix_ghc_duplicate_content.sql`
3. Paste and run in SQL Editor
4. Wait for completion
5. **Expected result:** "Success. No rows returned" (this is correct for DDL migrations)

### Step 2: Verify Migration Applied

Run the verification script to confirm everything was created:

```sql
-- Run: db/supabase/verify_ghc_migration.sql
-- This will show:
-- - All functions exist
-- - Trigger is active
-- - Current GHC guide status
-- - Any existing duplicates
```

### Step 3: Check for Existing Duplicates

```sql
-- See all duplicate groups
SELECT * FROM public.identify_ghc_duplicates();
```

This will show:
- Which guides share content
- Preview of the shared content
- Guide IDs, slugs, and titles

### Step 3: Get Status Report

```sql
-- Get comprehensive status
SELECT * FROM public.get_ghc_status_report();
```

This shows:
- Total GHC guides found
- Missing slugs
- Number of duplicate groups
- Guides with empty bodies

### Step 4: Fix Duplicates Manually

1. Use the GHC Inspector page: `http://localhost:3004/admin/ghc-inspector`
2. Find guides highlighted in red (shared content)
3. Click "Edit" for each guide
4. Make the body content unique for each GHC element
5. Save each guide

**Note:** After running this migration, the trigger will prevent you from saving duplicate content. You'll get an error message if you try.

## What Happens After Migration

### ✅ Protection Enabled
- The trigger automatically prevents duplicate content
- You'll get a clear error if you try to save duplicates
- Each GHC guide must have unique body content

### ⚠️ Existing Duplicates
- Existing duplicates are NOT automatically fixed
- You must manually edit each guide to make content unique
- Use the GHC Inspector to identify which guides need fixing

## Testing

After running the migration, test the protection:

```sql
-- This should work (unique content)
UPDATE guides 
SET body = 'Unique content for dq-vision' 
WHERE slug = 'dq-vision';

-- This should FAIL if another GHC guide has the same content
UPDATE guides 
SET body = 'Same content as another guide' 
WHERE slug = 'dq-hov';
```

## Rollback (If Needed)

To remove this migration:

```sql
-- Drop trigger
DROP TRIGGER IF EXISTS trg_check_ghc_content_uniqueness ON public.guides;

-- Drop functions
DROP FUNCTION IF EXISTS public.check_ghc_content_uniqueness();
DROP FUNCTION IF EXISTS public.validate_ghc_uniqueness(uuid, text, text);
DROP FUNCTION IF EXISTS public.identify_ghc_duplicates();
DROP FUNCTION IF EXISTS public.get_ghc_status_report();
```

## Integration with UI

The GHC Inspector page (`/admin/ghc-inspector`) uses these functions to:
- Show duplicate content warnings
- Display status reports
- Help identify which guides need fixing

## Next Steps

1. ✅ Run the migration
2. ✅ Check for duplicates using `identify_ghc_duplicates()`
3. ✅ Fix duplicates manually via admin interface
4. ✅ Verify protection is working (try to create a duplicate - should fail)
5. ✅ Test that each GHC page shows unique content
