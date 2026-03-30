# Fix: dq-persona Showing Same Content as dq-ghc

## Problem
When you open the Persona (GHC) element page, it shows the same content as the main DQ Golden Honeycomb of Competencies (GHC) card. This happens because both guides have **identical body content** in the database.

## Root Cause
The `dq-persona` guide in Supabase has the same `body` content as `dq-ghc`. This is a duplicate content issue.

## Solution
Run the fix script to update `dq-persona` with its correct unique content.

## Steps to Fix

### Step 1: Check Current State
Run this query in Supabase SQL Editor to see the problem:

```sql
-- Check if dq-persona and dq-ghc have identical content
SELECT 
  g1.slug as slug1,
  g2.slug as slug2,
  CASE 
    WHEN TRIM(COALESCE(g1.body, '')) = TRIM(COALESCE(g2.body, '')) THEN 'IDENTICAL - NEEDS FIX'
    ELSE 'DIFFERENT - OK'
  END as content_match
FROM public.guides g1
CROSS JOIN public.guides g2
WHERE g1.slug = 'dq-persona'
  AND g2.slug = 'dq-ghc';
```

### Step 2: Run the Fix Script
1. Open Supabase SQL Editor
2. Open the file: `db/supabase/fix_persona_duplicate_content.sql`
3. Copy the entire contents
4. Paste into SQL Editor
5. Click **Run**

### Step 3: Verify the Fix
After running the script, verify:

```sql
-- Check dq-persona now has unique content
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as body_length
FROM public.guides
WHERE slug = 'dq-persona';

-- Check for any remaining duplicates
SELECT * FROM public.identify_ghc_duplicates();
```

### Step 4: Test in Your App
1. Hard refresh your browser (`Ctrl+Shift+R` or `Cmd+Shift+R`)
2. Navigate to: `/marketplace/guides/dq-persona`
3. Verify it shows Persona-specific content (not GHC content)
4. Navigate to: `/marketplace/guides/dq-ghc`
5. Verify it shows GHC overview content

## What the Script Does

1. ✅ Checks current state of both guides
2. ✅ Identifies if they have duplicate content
3. ✅ Updates `dq-persona` with correct unique content:
   - Title: "Persona (Identity)"
   - Summary: About DQ Persona traits
   - Body: Full Persona content (purpose-driven, perceptive, proactive, etc.)
4. ✅ Only updates if content is duplicate or empty (safe to run multiple times)
5. ✅ Verifies the fix worked

## Expected Content After Fix

**dq-persona** should show:
- Title: "Persona (Identity)"
- Content about: Purpose-driven, Perceptive, Proactive, Persevering, Precise traits
- Link to full GHC framework

**dq-ghc** should show:
- Title: "DQ Golden Honeycomb of Competencies (GHC)"
- Overview of the entire GHC framework
- Introduction to all 7 elements

## If You Still See Duplicate Content

1. **Check browser cache** - Hard refresh (`Ctrl+Shift+R`)
2. **Check if update ran** - Verify in Supabase that `dq-persona` has different body content
3. **Check RLS policies** - Make sure you can read/write to guides table
4. **Run duplicate check** - `SELECT * FROM public.identify_ghc_duplicates();`

## Prevention

The GHC duplicate protection trigger should prevent this from happening again. If you try to update a GHC guide with content that matches another GHC guide, it will block the update with an error.
