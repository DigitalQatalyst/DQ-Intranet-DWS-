# Fix Missing dq-hov Guide - Step by Step Instructions

## Problem
The `dq-hov` (House of Values) guide is missing from the database. The query shows 6 out of 7 expected GHC guides exist, with `dq-hov` being the missing one.

## Solution
Run the SQL script to create the missing guide with all the correct content.

## Steps to Fix

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**

### Step 2: Run the Fix Script
1. Open the file: `db/supabase/create_missing_dq_hov.sql`
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

### Step 3: Verify the Fix
After running the script, you should see:
- A success message: `✅ Successfully created dq-hov guide!`
- A verification query result showing the created guide with:
  - ID (UUID)
  - Slug: `dq-hov`
  - Title: `HoV (House of Values)`
  - Status: `Approved`
  - Body length (should be > 0)
  - Body status: `HAS CONTENT`

### Step 4: Verify All 7 GHC Guides Exist
Run this query to confirm all 7 guides are now present:

```sql
SELECT 
  g.slug,
  guides.title,
  CASE 
    WHEN guides.slug IS NOT NULL THEN 'EXISTS'
    ELSE 'MISSING'
  END as status
FROM (VALUES 
  ('dq-vision'),
  ('dq-hov'),
  ('dq-persona'),
  ('dq-agile-tms'),
  ('dq-agile-sos'),
  ('dq-agile-flows'),
  ('dq-agile-6xd')
) AS g(slug)
LEFT JOIN guides ON guides.slug = g.slug
ORDER BY g.slug;
```

**Expected Result:** All 7 guides should show `EXISTS` status.

### Step 5: Test the Guide Page
1. Navigate to: `/marketplace/guides/dq-hov` in your application
2. Verify the page loads correctly
3. Verify the content displays properly

## What the Script Does

The script:
1. ✅ Checks if `dq-hov` already exists (prevents duplicates)
2. ✅ Creates the guide with:
   - Correct slug: `dq-hov`
   - Title: `HoV (House of Values)`
   - Full content about the 3 Mantras and 12 Guiding Values
   - Domain: `Strategy`
   - Status: `Approved`
   - Hero image URL
   - All required fields
3. ✅ Verifies the creation was successful

## Troubleshooting

### If you get an error about duplicate content:
The GHC duplicate protection trigger might be blocking the insert if another GHC guide has the same body content. This is expected behavior - each GHC guide must have unique content.

**Solution:** The script uses unique content for `dq-hov`, so this shouldn't happen. If it does, check if another guide was accidentally created with the same content.

### If the guide still shows as MISSING:
1. Check the Supabase logs for any errors
2. Verify the INSERT statement completed successfully
3. Run the verification query again
4. Check if there's a RLS (Row Level Security) policy blocking the insert

### If you see permission errors:
Make sure you're running the script with appropriate database permissions (admin/service role key).

## Next Steps After Fix

1. ✅ Verify all 7 GHC guides exist
2. ✅ Check for any duplicate content using: `SELECT * FROM public.identify_ghc_duplicates();`
3. ✅ Get status report: `SELECT * FROM public.get_ghc_status_report();`
4. ✅ Test the guide page in your application

## Files Involved

- **Fix Script:** `db/supabase/create_missing_dq_hov.sql`
- **Verification Script:** `db/supabase/step2_check_duplicates.sql`
- **Content Source:** `scripts/create-ghc-core-elements-cards.js` (lines 68-130)
