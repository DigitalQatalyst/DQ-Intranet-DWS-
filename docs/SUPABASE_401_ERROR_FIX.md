# Fixing 401 Authentication Errors with Supabase

## Understanding the Error

The `401 Unauthorized` error occurs when:
1. **Missing or incorrect environment variables** - Supabase URL or anon key not set
2. **RLS policies not configured** - Row Level Security blocking access
3. **Wrong Supabase project** - Environment variables pointing to different project
4. **Expired or invalid anon key** - The anon key has been regenerated

## Step 1: Check Environment Variables

Create or update your `.env` file in the project root:

```env
# Supabase Configuration for Media Center
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Alternative (if using React App)
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### How to Get Your Supabase Credentials:

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

## Step 2: Fix Permissions and RLS Policies

**Error 42501 "permission denied"** means the anon role doesn't have table access.

Run the SQL script in your Supabase SQL Editor:

**File:** `supabase/fix-rls-policies.sql`

Or copy-paste this complete fix:

```sql
-- Step 1: Grant permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.news TO anon;
GRANT SELECT ON public.jobs TO anon;

-- Step 2: Drop existing policies if they exist
DROP POLICY IF EXISTS news_select ON public.news;
DROP POLICY IF EXISTS jobs_select ON public.jobs;

-- Step 3: Enable RLS
ALTER TABLE IF EXISTS public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.jobs ENABLE ROW LEVEL SECURITY;

-- Step 4: Create public read access policies
CREATE POLICY news_select ON public.news 
  FOR SELECT 
  USING (true);

CREATE POLICY jobs_select ON public.jobs 
  FOR SELECT 
  USING (true);
```

**Important:** The `GRANT` statements are critical - they allow the anon role to access the tables.

## Step 3: Verify Tables Exist

Make sure the tables are created by running the schema:

```sql
-- Run the schema from: supabase/marketplace-schema.sql
-- This creates the news and jobs tables with proper structure
```

## Step 4: Restart Development Server

After updating `.env` file:
1. **Stop** your development server (Ctrl+C)
2. **Restart** it to load new environment variables
3. **Clear browser cache** if issues persist

## Step 5: Verify Connection

Check the browser console for:
- ✅ No 401 errors
- ✅ Successful data fetching
- ✅ No "Supabase environment not configured" errors

## Troubleshooting

### Error: "Supabase environment not configured"
- **Solution:** Check that `.env` file exists and has correct variable names
- Ensure variables start with `VITE_` or `REACT_APP_`
- Restart dev server after adding variables

### Error: "401 Unauthorized" persists after setting env vars
- **Solution:** Verify RLS policies are created (see Step 2)
- Check that anon key matches your Supabase project
- Ensure you're using the **anon/public** key, not the service role key

### Error: "Table does not exist"
- **Solution:** Run the schema file: `supabase/marketplace-schema.sql`
- Verify tables are created in Supabase dashboard

### Different Supabase project URL in error
- **Solution:** The error shows `jmhtrffmxjxhoxpesubv.supabase.co` - this is the project your env vars are pointing to
- Either update env vars to match your intended project, or use this project's credentials

## Quick Test

After fixing, test the connection:

```typescript
// This should work without 401 errors
import { fetchAllNews } from '@/services/mediaCenterService';

const news = await fetchAllNews();
console.log('News loaded:', news.length);
```

## Alternative: Use Mock Data (Development Only)

If Supabase is not available, you can temporarily use mock data by modifying `mediaCenterService.ts` to fall back to local data.

---

**Need Help?**
- Check Supabase logs in dashboard: **Logs** → **API Logs**
- Verify API settings: **Settings** → **API**
- Review RLS policies: **Authentication** → **Policies**

