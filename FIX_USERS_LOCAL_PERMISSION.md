# Fix: "permission denied for table users_local" Error

## The Problem

The user was created successfully in `auth.users`, but inserting into `users_local` fails with:
```
permission denied for table users_local
```

## Solution

I've updated the script to use the REST API directly with the service role key, which should bypass RLS. However, if you still get this error, here are additional solutions:

## Option 1: Check RLS on users_local Table

The `users_local` table might have RLS enabled. Check in Supabase:

1. Go to **Table Editor** → `users_local`
2. Check if RLS is enabled
3. If enabled, you can either:
   - **Temporarily disable RLS** for this operation
   - **Add a policy** that allows service role to insert

### Temporarily Disable RLS (Quick Fix)

Run this SQL in Supabase SQL Editor:

```sql
-- Temporarily disable RLS on users_local
ALTER TABLE users_local DISABLE ROW LEVEL SECURITY;

-- After running the script, you can re-enable it:
-- ALTER TABLE users_local ENABLE ROW LEVEL SECURITY;
```

### Add Service Role Policy (Better Solution)

Run this SQL in Supabase SQL Editor:

```sql
-- Allow service role to manage users_local
CREATE POLICY "Service role can manage users_local"
ON users_local
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

## Option 2: Use Supabase SQL Editor (Manual)

If the script still fails, create the profile manually:

1. **Get the User ID** from the script output (you already have it: `15ea3b80-91a0-4b05-be68-3f13d7db7214`)

2. **Go to Supabase SQL Editor** and run:

```sql
INSERT INTO users_local (id, email, username, role, created_at)
VALUES (
  '15ea3b80-91a0-4b05-be68-3f13d7db7214',
  'testuser@example.com',
  'Test User',
  'member',
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  role = EXCLUDED.role;
```

## Option 3: Check Table Structure

Verify the `users_local` table exists and has the correct structure:

```sql
-- Check if table exists
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users_local';

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users_local';
```

## Option 4: Verify Service Role Key

Make sure you're using the correct service role key:

1. Go to **Settings** → **API**
2. Verify you copied the **`service_role`** key (not anon)
3. The key should be very long and start with `eyJ`

## Quick Fix: Run SQL Directly

Since the user is already created in `auth.users`, you can just add the profile:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this (replace with your actual user ID):

```sql
INSERT INTO users_local (id, email, username, role, created_at)
VALUES (
  '15ea3b80-91a0-4b05-be68-3f13d7db7214',  -- Your user ID from the script
  'testuser@example.com',
  'Test User',
  'member',
  NOW()
)
ON CONFLICT (id) DO NOTHING;
```

3. Then test login with:
   - **Email**: `testuser@example.com`
   - **Password**: `TestUser123!`

## Updated Script

The script has been updated to use the REST API directly, which should work better. Try running it again:

```powershell
npm run create-test-user
```

If it still fails, use Option 4 (SQL Editor) to manually create the profile - the user is already created in auth, so you just need the profile entry.


