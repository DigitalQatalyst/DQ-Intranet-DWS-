# RLS Policy Setup Guide for DWS Communities

## Overview

This guide explains how to set up Row Level Security (RLS) policies for the DWS Communities Supabase project to allow anon role access to communities and memberships data.

## Current Status

❌ **RLS policies are not configured** - The verification script shows permission denied errors for anon role access.

## Required Setup

### Step 1: Run Schema Migration (If Not Done)

First, ensure the database schema is created:

1. Open Supabase Dashboard: https://supabase.com/dashboard/project/jmhtrffmxjxhoxpesubv
2. Go to SQL Editor
3. Run `db/supabase/dws_communities_schema.sql`
4. Verify all tables, views, and functions were created

### Step 2: Apply RLS Policies

Run the complete RLS setup script:

1. Open Supabase Dashboard > SQL Editor
2. Copy and paste the contents of `db/supabase/setup_rls_policies_complete.sql`
3. Click "Run" to execute the script
4. Verify the success message appears

### Step 3: Verify RLS Policies

Run the verification script to test that RLS policies are working:

```bash
node scripts/verify-supabase-rls.js
```

Expected output:
- ✅ Communities Read: PASS
- ✅ Memberships Read: PASS
- ✅ Communities With Counts View: PASS
- ✅ Get Feed RPC: PASS
- ✅ Get Community Members RPC: PASS

### Step 4: Test Manually

Test the query manually in Supabase SQL Editor:

```sql
-- Test as anon role (this should work without 401 error)
SELECT * FROM communities LIMIT 1;
```

Expected result: Should return data without permission errors.

## Required RLS Policies

### 1. Communities Table

```sql
-- Enable RLS
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read communities"
ON public.communities
FOR SELECT
USING (true);
```

### 2. Memberships Table

```sql
-- Enable RLS
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read memberships"
ON public.memberships
FOR SELECT
USING (true);

-- Authenticated users can join communities
CREATE POLICY "Allow authenticated insert memberships"
ON public.memberships
FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);
```

### 3. Grant Permissions to Anon Role

```sql
-- Grant SELECT permission on tables
GRANT SELECT ON public.communities TO anon;
GRANT SELECT ON public.memberships TO anon;

-- Grant SELECT permission on views
GRANT SELECT ON public.communities_with_counts TO anon;
GRANT SELECT ON public.posts_with_meta TO anon;
GRANT SELECT ON public.posts_with_reactions TO anon;

-- Grant EXECUTE permission on RPC functions
GRANT EXECUTE ON FUNCTION public.get_feed TO anon;
GRANT EXECUTE ON FUNCTION public.get_community_members TO anon;
GRANT EXECUTE ON FUNCTION public.get_mutual_communities TO anon;
-- ... (and other RPC functions)
```

## Views and RPC Functions

### Views

Views inherit RLS from underlying tables. Since we have public read policies on `communities` and `memberships`, the following views should be accessible:

- `communities_with_counts` - Used by `/communities` page
- `posts_with_meta` - Used by feed pages
- `posts_with_reactions` - Used for displaying posts with reactions

### RPC Functions

The following RPC functions need EXECUTE permission for anon role:

- `get_feed` - Fetches feed posts
- `get_community_members` - Fetches community members
- `get_mutual_communities` - Fetches mutual communities
- `get_trending_topics` - Fetches trending topics
- `can_moderate` - Checks if user can moderate
- `can_moderate_community` - Checks if user can moderate community
- `update_member_role` - Updates member role
- `remove_community_member` - Removes community member
- `increment_poll_vote` - Increments poll vote
- `get_relationship_status` - Gets relationship status
- `toggle_follow` - Toggles follow status
- `search_users` - Searches users

## Troubleshooting

### Error: "permission denied for table communities"

**Cause**: RLS is enabled but no policy allows anon role to read.

**Solution**:
1. Check if RLS is enabled: `SELECT relrowsecurity FROM pg_class WHERE relname = 'communities';`
2. Check if policy exists: `SELECT * FROM pg_policies WHERE tablename = 'communities';`
3. Run the RLS setup script: `db/supabase/setup_rls_policies_complete.sql`
4. Verify GRANT SELECT was executed: `SELECT * FROM information_schema.table_privileges WHERE table_name = 'communities' AND grantee = 'anon';`

### Error: "permission denied for view communities_with_counts"

**Cause**: View doesn't have SELECT permission or underlying tables don't have RLS policies.

**Solution**:
1. Grant SELECT on the view: `GRANT SELECT ON public.communities_with_counts TO anon;`
2. Verify underlying tables have RLS policies
3. Check view definition: `SELECT definition FROM pg_views WHERE viewname = 'communities_with_counts';`

### Error: "permission denied for function get_feed"

**Cause**: RPC function doesn't have EXECUTE permission for anon role.

**Solution**:
1. Grant EXECUTE permission: `GRANT EXECUTE ON FUNCTION public.get_feed TO anon;`
2. Verify function exists: `SELECT * FROM pg_proc WHERE proname = 'get_feed';`
3. Check function definition for any RLS issues

### Error: "relation 'users_local' does not exist"

**Cause**: Schema migration wasn't run or table doesn't exist.

**Solution**:
1. Run the schema migration: `db/supabase/dws_communities_schema.sql`
2. Verify table exists: `SELECT * FROM information_schema.tables WHERE table_name = 'users_local';`
3. Check if you're using the correct Supabase project

## Verification Checklist

- [ ] Schema migration completed (`dws_communities_schema.sql`)
- [ ] RLS enabled on `communities` table
- [ ] RLS enabled on `memberships` table
- [ ] Policy "Allow public read communities" exists
- [ ] Policy "Allow public read memberships" exists
- [ ] Policy "Allow authenticated insert memberships" exists
- [ ] GRANT SELECT on `communities` to anon
- [ ] GRANT SELECT on `memberships` to anon
- [ ] GRANT SELECT on views to anon
- [ ] GRANT EXECUTE on RPC functions to anon
- [ ] Test query works: `SELECT * FROM communities LIMIT 1;`
- [ ] Verification script passes: `node scripts/verify-supabase-rls.js`

## Files

- `db/supabase/setup_rls_policies_complete.sql` - Complete RLS setup script (run this)
- `db/supabase/verify_and_fix_rls.sql` - Verification and fix script
- `db/supabase/fix_rls_policies_for_anon.sql` - Fix RLS policies for anon role
- `db/supabase/verify_views_and_rpcs_rls.sql` - Verify views and RPCs have proper access
- `scripts/verify-supabase-rls.js` - Node.js verification script
- `db/supabase/test_rls_anon_role.sql` - Manual test queries

## Next Steps

After RLS policies are set up:

1. ✅ Run the complete RLS setup script
2. ✅ Verify policies are working with the verification script
3. ✅ Test the application - navigate to `/communities`
4. ✅ Verify communities load without errors
5. ✅ Test join/leave community flow
6. ✅ Test create post flow
7. ✅ Verify real-time updates work

## Support

If you encounter issues:

1. Check Supabase Dashboard > Logs for errors
2. Run the verification script to identify specific issues
3. Check the troubleshooting section above
4. Verify all SQL scripts were run successfully
5. Contact the development team for assistance

---

**Status**: ⚠️ RLS policies need to be applied
**Last Updated**: 2025-01-27
**Supabase Project**: jmhtrffmxjxhoxpesubv.supabase.co

