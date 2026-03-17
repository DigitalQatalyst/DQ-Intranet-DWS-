# Fix Schema Permissions

## The Problem

You're getting "permission denied for schema public" errors even with the service role key. This is a **schema-level permission issue**, not an RLS issue.

## The Solution

Run this SQL in your Supabase SQL Editor to fix the permissions:

### Step 1: Open Supabase SQL Editor

1. Go to: https://app.supabase.com/project/jmhtrffmxjxhoxpesubv
2. Click **"SQL Editor"** → **"New query"**

### Step 2: Run the Fix Script

Copy and paste the contents of `fix-schema-permissions.sql` into the SQL Editor and run it.

This will:
- ✅ Grant schema usage to anon, authenticated, and service_role
- ✅ Grant table permissions on guides and related tables
- ✅ Ensure the RLS policy is correct
- ✅ Show you what policies exist

### Step 3: Test Again

After running the script, test the connection:

```bash
node check-rls-policies.js
```

You should now see:
- ✅ Anon key can read approved guides
- ✅ Service role can read all guides

### Step 4: Test the UI

1. Make sure dev server is running: `npm run dev`
2. Open: http://localhost:5173/marketplace/guides
3. Check if guides load
4. Test the Strategy/Guidelines/Blueprints tabs

## Alternative: Check in Dashboard

If you want to check what's currently configured:

1. **Supabase Dashboard** → **Table Editor** → `guides` table
2. Click the **"..."** menu → **"View Policies"**
3. See what RLS policies exist

4. **Supabase Dashboard** → **Database** → **Roles**
5. Check permissions for `anon`, `authenticated`, and `service_role`

## Why This Happens

Sometimes when tables are created manually or via migrations, the schema-level permissions aren't automatically granted. This fix ensures all the necessary roles have access to the public schema and the guides table.


