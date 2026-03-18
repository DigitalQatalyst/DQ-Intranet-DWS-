# Quick Fix: Error 42501 "permission denied for table news"

## The Problem
Error code `42501` means the `anon` role doesn't have permission to access the `news` table, even though RLS policies exist.

## Quick Fix (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project: https://app.supabase.com
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run This SQL
Copy and paste this entire block:

```sql
-- Grant permissions to anon role (allows unauthenticated access)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.news TO anon;
GRANT SELECT ON public.jobs TO anon;

-- Also grant to authenticated role (for logged-in users)
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.news TO authenticated;
GRANT SELECT ON public.jobs TO authenticated;

-- Ensure RLS policies exist
DROP POLICY IF EXISTS news_select ON public.news;
DROP POLICY IF EXISTS jobs_select ON public.jobs;

ALTER TABLE IF EXISTS public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY news_select ON public.news 
  FOR SELECT 
  USING (true);

CREATE POLICY jobs_select ON public.jobs 
  FOR SELECT 
  USING (true);
```

### Step 3: Click "Run" (or press Ctrl+Enter)

### Step 4: Refresh Your App
Go back to your app and refresh the page. The error should be gone!

## Verify It Worked

Run this test query in SQL Editor:
```sql
SELECT COUNT(*) FROM public.news;
```

If it returns a number (even 0), permissions are fixed! ✅

## Why This Happens

When you create tables in Supabase:
- ✅ Tables are created
- ✅ RLS can be enabled
- ❌ But `GRANT` permissions are **not automatically given** to the `anon` role

The `anon` role is what unauthenticated users use. Without `GRANT SELECT`, even with RLS policies allowing access, PostgreSQL blocks the request at the permission level.

## Alternative: Use the Fix Script

You can also run the complete fix script:
- File: `supabase/fix-rls-policies.sql`

This includes all the same commands plus verification queries.

---

**Still having issues?** Check:
1. Tables exist: `SELECT * FROM public.news LIMIT 1;`
2. Policies exist: Check in **Authentication** → **Policies** in Supabase dashboard
3. Permissions granted: Run the GRANT statements again

















