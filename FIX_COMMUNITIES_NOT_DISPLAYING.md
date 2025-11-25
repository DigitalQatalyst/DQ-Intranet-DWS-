# Fix: Communities Marketplace Not Displaying Data

## Quick Diagnosis

Run the diagnostic script to identify the issue:

```bash
# Set environment variables
$env:VITE_SUPABASE_URL="https://your-project.supabase.co"
$env:VITE_SUPABASE_ANON_KEY="your-anon-key"

# Run diagnosis
node scripts/diagnose-communities-issue.js
```

## Common Causes & Fixes

### 1. No Data in Database

**Symptom**: Diagnostic shows 0 communities

**Fix**: Seed the communities table

```sql
-- Check if communities exist
SELECT COUNT(*) FROM communities;

-- If 0, you need to seed data
-- Check supabase/seed/ directory for seed files
```

### 2. RLS Blocking Access

**Symptom**: "permission denied" errors

**Fix**: Check and update RLS policies

The `communities` table should allow SELECT for everyone (or at least authenticated users). Check current policies:

```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'communities';

-- Check existing policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'communities';
```

**If RLS is enabled but no SELECT policy exists**, add one:

```sql
-- Allow anyone to view communities (or authenticated users)
CREATE POLICY "Anyone can view communities"
ON communities FOR SELECT
USING (true);
```

Or for authenticated users only:

```sql
CREATE POLICY "Authenticated users can view communities"
ON communities FOR SELECT
USING (auth.uid() IS NOT NULL);
```

### 3. View Missing or Inaccessible

**Symptom**: `communities_with_counts` view doesn't exist or has permission issues

**Fix**: The code has a fallback, but you can create the view:

```sql
-- Create communities_with_counts view
CREATE OR REPLACE VIEW communities_with_counts AS
SELECT 
  c.*,
  COALESCE(COUNT(DISTINCT m.user_id), 0) as member_count
FROM communities c
LEFT JOIN memberships m ON m.community_id = c.id
GROUP BY c.id;
```

### 4. Memberships Table RLS Blocking Counts

**Symptom**: Communities load but member_count is always 0

**Fix**: Check memberships RLS policies

```sql
-- Check memberships RLS
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'memberships';

-- Add policy to allow reading member counts (if needed)
CREATE POLICY "Anyone can view membership counts"
ON memberships FOR SELECT
USING (true);
```

### 5. RLS Disabled But Still Not Working

**Check**: Verify RLS is actually disabled

```sql
-- Disable RLS on communities (if needed for development)
ALTER TABLE communities DISABLE ROW LEVEL SECURITY;

-- Verify it's disabled
SELECT rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'communities';
-- Should return false
```

## Quick Fix Script

Run this SQL in Supabase SQL Editor to ensure communities are viewable:

```sql
-- 1. Disable RLS on communities (for development)
ALTER TABLE communities DISABLE ROW LEVEL SECURITY;

-- 2. Ensure memberships can be read for counts
ALTER TABLE memberships DISABLE ROW LEVEL SECURITY;

-- 3. Create/update communities_with_counts view
CREATE OR REPLACE VIEW communities_with_counts AS
SELECT 
  c.*,
  COALESCE(COUNT(DISTINCT m.user_id), 0) as member_count
FROM communities c
LEFT JOIN memberships m ON m.community_id = c.id
GROUP BY c.id;

-- 4. Grant access to the view
GRANT SELECT ON communities_with_counts TO anon, authenticated;
```

## Check Browser Console

Open browser DevTools (F12) and check:

1. **Console tab**: Look for errors when loading the Communities page
2. **Network tab**: Check the Supabase API calls
   - Look for requests to `/rest/v1/communities` or `/rest/v1/communities_with_counts`
   - Check the response status and body

## Verify Data Exists

```sql
-- Check communities count
SELECT COUNT(*) as total_communities FROM communities;

-- Check sample data
SELECT id, name, description, created_at 
FROM communities 
LIMIT 5;

-- Check memberships
SELECT COUNT(*) as total_memberships FROM memberships;
```

## Test Query Manually

Test the exact query the app uses:

```sql
-- Test the view query
SELECT * FROM communities_with_counts LIMIT 5;

-- Test the base table query
SELECT 
  c.*,
  COUNT(DISTINCT m.user_id) as member_count
FROM communities c
LEFT JOIN memberships m ON m.community_id = c.id
GROUP BY c.id
LIMIT 5;
```

## Next Steps

1. **Run the diagnostic script** to identify the specific issue
2. **Check browser console** for error messages
3. **Verify data exists** in the database
4. **Check RLS policies** and disable if needed for development
5. **Test the queries** manually in Supabase SQL Editor


