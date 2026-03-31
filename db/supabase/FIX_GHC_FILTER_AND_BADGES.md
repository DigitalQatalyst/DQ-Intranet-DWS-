# Fix GHC Filter and Badge Display

## Issues Identified

1. **GHC Filter Not Working**: When clicking "GHC" filter, only 3 cards show instead of all 15 GHC guides
2. **All Cards Show "Strategy" Badge**: All GHC guides have `domain: "Strategy"`, so they all display "Strategy" badge (this is expected behavior)

## Root Cause

The GHC filter checks if `sub_domain` includes 'ghc'. Currently:
- ✅ `dq-ghc` has `sub_domain: "ghc"` - **works**
- ❌ Other GHC guides have different `sub_domain` values (e.g., "hov", "persona", "vision", "competencies") - **don't show in filter**

## Solution

### Step 1: Update sub_domain for all GHC guides

Run the SQL script: `db/supabase/fix_ghc_subdomain_filtering.sql`

This will:
- Set `sub_domain = 'ghc'` for all 8 core GHC guides
- Set `sub_domain = 'ghc,competencies'` for all 7 competency guides

### Step 2: Verify the fix

After running the SQL script, check that all GHC guides now have 'ghc' in their `sub_domain`:

```sql
SELECT slug, title, sub_domain 
FROM public.guides 
WHERE sub_domain LIKE '%ghc%'
ORDER BY slug;
```

You should see all 15 GHC guides.

### Step 3: Test the filter

1. Go to `/marketplace/guides?tab=strategy`
2. Click the "GHC" filter under "Strategy Framework"
3. You should now see all 15 GHC guides (not just 3)

## About the "Strategy" Badge

All GHC guides correctly have `domain: "Strategy"` because they are part of the Strategy framework. The badge showing "Strategy" is correct behavior.

If you want to show a different badge (e.g., "GHC" instead of "Strategy"), we would need to:
1. Add a new field to distinguish GHC guides, OR
2. Modify the `GuideCard` component to show `sub_domain` or a custom badge for GHC guides

However, showing "Strategy" is semantically correct since these are Strategy domain guides.

## Expected Results After Fix

- ✅ GHC filter shows all 15 guides:
  - 1 overview guide (`dq-ghc`)
  - 7 core element guides (vision, hov, persona, agile-tms, agile-sos, agile-flows, agile-6xd)
  - 7 competency guides (trust, customer, learning, responsibility, growth-mindset, precision, perseverance)
- ✅ All cards continue to show "Strategy" badge (correct behavior)
