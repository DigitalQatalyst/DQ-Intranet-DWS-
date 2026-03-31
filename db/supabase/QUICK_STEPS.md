# Quick Steps: Fix GHC Duplicate Content

## ✅ Step 1: Verify Migration (Already Done!)
Migration applied successfully! "No rows returned" is correct.

## 📋 Step 2: Check Current Status

Run in Supabase SQL Editor:

```sql
-- Get status report
SELECT * FROM public.get_ghc_status_report();

-- Check for duplicates
SELECT * FROM public.identify_ghc_duplicates();

-- List all GHC guides
SELECT slug, title, LENGTH(COALESCE(body, '')) as body_length
FROM guides
WHERE slug IN ('dq-vision', 'dq-hov', 'dq-persona', 'dq-agile-tms', 'dq-agile-sos', 'dq-agile-flows', 'dq-agile-6xd')
ORDER BY slug;
```

## 🔧 Step 3: Fix Duplicates (If Found)

### Option A: Use GHC Inspector (Easiest)
1. Go to: `http://localhost:3004/admin/ghc-inspector`
2. Find red highlighted guides
3. Click "Edit" for each
4. Make content unique
5. Save

### Option B: Fix via SQL
```sql
-- Update each guide with unique content
UPDATE guides SET body = 'Unique content for DQ Vision...' WHERE slug = 'dq-vision';
UPDATE guides SET body = 'Unique content for DQ HoV...' WHERE slug = 'dq-hov';
-- Repeat for each guide
```

## ✅ Step 4: Verify Fixes

```sql
-- Should return no rows
SELECT * FROM public.identify_ghc_duplicates();
```

## 🧪 Step 5: Test Protection

```sql
-- This should FAIL (protection working!)
UPDATE guides 
SET body = (SELECT body FROM guides WHERE slug = 'dq-vision' LIMIT 1)
WHERE slug = 'dq-hov';
```

## 🎯 Step 6: Test in Browser

Visit each page - should show unique content:
- `/marketplace/guides/dq-vision`
- `/marketplace/guides/dq-hov`
- `/marketplace/guides/dq-persona`
- etc.

## 📊 Expected Results

✅ **All Good:**
- `get_ghc_status_report()` shows: `duplicate_content_groups: 0`
- `identify_ghc_duplicates()` returns: No rows
- Each GHC page shows unique content
- Protection trigger prevents duplicates

❌ **If Issues:**
- Red warnings in GHC Inspector
- Duplicate groups found
- Same content on multiple pages
