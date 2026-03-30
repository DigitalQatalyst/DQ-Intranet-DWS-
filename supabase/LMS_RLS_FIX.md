# Fixing Permission Denied Errors for LMS Tables

## Problem
You're getting "permission denied" errors when trying to fetch data from Supabase, even though you have the anon key configured. This happens because **Row Level Security (RLS)** is enabled on your tables, but there are no policies allowing the `anon` role to read the data.

## Solution: Create RLS Policies

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**

### Step 2: Run the RLS Policies Script
Copy and paste the contents of `lms-rls-policies.sql` into the SQL Editor and run it.

This will:
- Enable RLS on all LMS tables (if not already enabled)
- Create policies that allow the `anon` role to read (SELECT) from all LMS tables

### Step 3: Verify Policies Were Created
Run the contents of `verify-lms-rls.sql` to check:
- If RLS is enabled on your tables
- If the policies exist and are configured correctly

You should see policies like:
- `Allow anon to read lms_courses`
- `Allow anon to read lms_curriculum_items`
- `Allow anon to read lms_topics`
- `Allow anon to read lms_lessons`

### Step 4: Test Your Application
After running the policies, refresh your application and try fetching courses again. The permission errors should be resolved.

## Alternative: Temporarily Disable RLS (NOT RECOMMENDED FOR PRODUCTION)

If you need to quickly test without RLS, you can temporarily disable it:

```sql
-- ⚠️ WARNING: Only use this for development/testing
ALTER TABLE lms_courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE lms_curriculum_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE lms_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE lms_lessons DISABLE ROW LEVEL SECURITY;
```

**Remember to re-enable RLS and create proper policies before going to production!**

## Understanding RLS Policies

The policies we created use `USING (true)`, which means:
- **Role**: `anon` (anonymous/unauthenticated users)
- **Command**: `SELECT` (read only)
- **Condition**: `true` (allow all rows)

This allows anyone with the anon key to read all data from these tables. For production, you might want to add more restrictive conditions based on your security requirements.

## Troubleshooting

### Still getting permission denied?
1. **Check your anon key**: Make sure `VITE_SUPABASE_ANON_KEY` in your `.env` file matches the anon key from your Supabase dashboard (Settings → API)
2. **Restart your dev server**: After updating `.env`, restart with `npm run dev`
3. **Check browser console**: Look for detailed error messages
4. **Verify policies**: Run `verify-lms-rls.sql` to ensure policies exist
5. **Check table names**: Ensure your table names match exactly (case-sensitive)

### Testing with curl
You can test if the policies work by making a direct API call:

```bash
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     "YOUR_SUPABASE_URL/rest/v1/lms_courses?select=*"
```

Replace:
- `YOUR_ANON_KEY` with your actual anon key
- `YOUR_SUPABASE_URL` with your Supabase project URL

If this works, the policies are correct and the issue might be in your application code.

