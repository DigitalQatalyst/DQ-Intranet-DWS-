# Quick Fix: Communities Not Displaying

## Immediate Steps

### Step 1: Run the Migration

Go to **Supabase Dashboard → SQL Editor** and run:

```sql
-- Disable RLS on communities and memberships
ALTER TABLE communities DISABLE ROW LEVEL SECURITY;
ALTER TABLE memberships DISABLE ROW LEVEL SECURITY;

-- Create/update the view
CREATE OR REPLACE VIEW communities_with_counts AS
SELECT 
  c.*,
  COALESCE(COUNT(DISTINCT m.user_id), 0) as member_count
FROM communities c
LEFT JOIN memberships m ON m.community_id = c.id
GROUP BY c.id;

-- Grant access
GRANT SELECT ON communities_with_counts TO anon, authenticated;
```

### Step 2: Check if Data Exists

```sql
-- Check communities count
SELECT COUNT(*) FROM communities;

-- If 0, you need to seed data
-- Check: supabase/seed/communities_seed.ts or community_seed.sql
```

### Step 3: Check Browser Console

1. Open your app in browser
2. Press F12 to open DevTools
3. Go to **Console** tab
4. Look for errors when loading Communities page
5. Go to **Network** tab
6. Look for requests to `/rest/v1/communities` or `/rest/v1/communities_with_counts`
7. Check the response - is it empty `[]` or an error?

## Common Issues

### Issue 1: No Data
**Fix**: Run seed script or manually add communities

### Issue 2: RLS Blocking
**Fix**: Run the SQL above to disable RLS (or add SELECT policies)

### Issue 3: View Missing
**Fix**: The SQL above creates the view

### Issue 4: Permission Denied
**Fix**: The SQL above grants access to the view

## Test Query

After running the migration, test in Supabase SQL Editor:

```sql
-- Should return communities
SELECT * FROM communities_with_counts LIMIT 5;

-- Or base table
SELECT * FROM communities LIMIT 5;
```

## Still Not Working?

1. **Run diagnostic script**:
   ```bash
   node scripts/diagnose-communities-issue.js
   ```

2. **Check browser console** for specific error messages

3. **Verify you're signed in** (if RLS requires authentication)

4. **Check Network tab** in browser DevTools to see the actual API response


