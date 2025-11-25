# How to Run the Test User Creation Script

## Quick Start

### Step 1: Get Your Supabase Service Role Key

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Find the **`service_role`** key (NOT the `anon` key)
5. Copy this key - you'll need it in the next step

⚠️ **Important**: The service role key has admin privileges. Keep it secret and never commit it to git.

### Step 2: Set Environment Variables

#### Option A: Windows (PowerShell)
```powershell
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
$env:VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

#### Option B: Windows (Command Prompt)
```cmd
set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
set VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
set VITE_SUPABASE_URL=https://your-project-id.supabase.co
```

#### Option C: Mac/Linux (Terminal)
```bash
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
export VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

#### Option D: Create a .env file (Recommended)

Create a `.env` file in the project root (same folder as `package.json`):

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
VITE_SUPABASE_URL=https://your-project-id.supabase.co
```

Then install `dotenv` if needed:
```bash
npm install dotenv
```

And modify the script to load it (or use a package that auto-loads .env files).

### Step 3: Run the Script

#### Option A: Using Node.js (JavaScript version)

```bash
node scripts/create-test-user.js
```

#### Option B: Using TypeScript (if you have tsx installed)

First install tsx if you don't have it:
```bash
npm install -g tsx
# or
npx tsx --version  # to test if it works
```

Then run:
```bash
npx tsx scripts/create-test-user.ts
```

#### Option C: Add to package.json (Easier)

Add this to your `package.json` scripts section:

```json
{
  "scripts": {
    "create-test-user": "node scripts/create-test-user.js"
  }
}
```

Then run:
```bash
npm run create-test-user
```

## Complete Example (Windows PowerShell)

```powershell
# 1. Navigate to project directory
cd C:\Users\githi\OneDrive\Desktop\DQ-Intranet-DWS-

# 2. Set environment variables
$env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
$env:VITE_SUPABASE_URL="https://xxxxx.supabase.co"

# 3. Run the script
node scripts/create-test-user.js
```

## Complete Example (Mac/Linux)

```bash
# 1. Navigate to project directory
cd ~/path/to/DQ-Intranet-DWS-

# 2. Set environment variables
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
export VITE_SUPABASE_URL="https://xxxxx.supabase.co"

# 3. Run the script
node scripts/create-test-user.js
```

## What You Should See

If successful, you'll see output like:

```
Creating test user...
Email: testuser@example.com
Password: TestUser123!

Step 1: Checking if user exists in auth.users...
Step 2: Creating new user in auth.users...
✓ User created successfully with ID: xxxxx-xxxx-xxxx-xxxx-xxxxx

Step 3: Checking users_local table...
Creating profile in users_local...
✓ Profile created successfully

========================================
✓ Test user created successfully!
========================================

Credentials:
  Email: testuser@example.com
  Password: TestUser123!

You can now use these credentials to sign in.
```

## Troubleshooting

### Error: "Missing SUPABASE_SERVICE_ROLE_KEY"

**Solution**: Make sure you set the environment variable before running the script.

**Windows PowerShell:**
```powershell
$env:SUPABASE_SERVICE_ROLE_KEY="your-key-here"
```

**Windows CMD:**
```cmd
set SUPABASE_SERVICE_ROLE_KEY=your-key-here
```

**Mac/Linux:**
```bash
export SUPABASE_SERVICE_ROLE_KEY="your-key-here"
```

### Error: "Missing VITE_SUPABASE_URL"

**Solution**: Set the Supabase project URL.

**Find your URL:**
- Go to Supabase Dashboard → Settings → API
- Copy the "Project URL" (looks like: `https://xxxxx.supabase.co`)

**Set it:**
```bash
export VITE_SUPABASE_URL="https://xxxxx.supabase.co"
```

### Error: "Cannot find module '@supabase/supabase-js'"

**Solution**: Install dependencies first:
```bash
npm install
```

### Error: "User creation failed"

**Possible causes:**
1. Wrong service role key - make sure you're using the `service_role` key, not `anon`
2. Project URL is incorrect
3. Supabase project is paused or has restrictions

**Check:**
- Verify the service role key in Supabase Dashboard
- Verify the project URL is correct
- Check Supabase dashboard for any project issues

### Script runs but user can't login

**Solution**: 
1. Check that the script output shows "✓ Test user created successfully!"
2. Try resetting the password by running the script again (it will reset if user exists)
3. Verify in Supabase Dashboard → Authentication → Users that the user exists

## Alternative: Manual Creation via Supabase Dashboard

If the script doesn't work, you can create the user manually:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter:
   - Email: `testuser@example.com`
   - Password: `TestUser123!`
   - Auto Confirm User: ✅ (checked)
4. Click "Create user"
5. Copy the User UID
6. Go to Table Editor → `users_local`
7. Insert new row:
   - `id`: (paste the User UID)
   - `email`: `testuser@example.com`
   - `username`: `Test User`
   - `role`: `member`
   - `created_at`: (current timestamp)

## Verify It Worked

1. **Check Supabase Dashboard:**
   - Go to Authentication → Users
   - You should see `testuser@example.com`

2. **Check users_local table:**
   - Go to Table Editor → `users_local`
   - You should see a row with email `testuser@example.com`

3. **Test Login:**
   - Go to your app's login page
   - Enter: `testuser@example.com` / `TestUser123!`
   - Should successfully sign in

## Need Help?

If you're still having issues:
1. Check the error message carefully
2. Verify your environment variables are set correctly
3. Make sure you're using the `service_role` key (not `anon`)
4. Check that your Supabase project is active and not paused


