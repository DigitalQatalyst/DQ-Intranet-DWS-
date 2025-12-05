# Supabase Cloud Setup Guide

## Step 1: Get Your Supabase Project Credentials

You've provided login credentials, but we need the **API keys** from your Supabase project dashboard.

### How to Get Your Credentials:

1. **Log in to Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Use your credentials:
     - Email: `donna.nyacuru@digitalqatalyst.com` 
     - Password: `Dws.clouddb123`

2. **Select Your Project**
   - Find your DWS project in the dashboard
   - Click on it to open

3. **Get API Credentials**
   - Go to: **Settings** → **API** (in the left sidebar)
   - You'll see:
     - **Project URL**: Something like `https://xxxxx.supabase.co`
     - **anon/public key**: A long string starting with `eyJ...`
     - **service_role key**: Another long string (KEEP THIS SECRET!)

## Step 2: Create .env File

Create a `.env` file in the project root with:

```env
# Your Supabase Project URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase anon/public key (safe for client-side)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Your Supabase service role key (KEEP SECRET - server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Test the Connection

Run the test script:

```bash
node test-supabase-connection.js
```

This will:
- ✅ Verify your connection works
- ✅ Check which tables exist
- ✅ Count records in the guides table
- ✅ Test RLS (Row Level Security) policies

## Step 4: Check Current Database State

After connection is verified, we can:
1. Check what tables exist
2. See what data is already there
3. Verify the schema matches what we expect
4. Test the guides marketplace functionality

## Troubleshooting

### If you get "Missing environment variables":
- Make sure `.env` file exists in project root
- Check that variable names match exactly (case-sensitive)
- Restart your dev server after creating/updating `.env`

### If you get connection errors:
- Verify the Project URL is correct (should end with `.supabase.co`)
- Check that the anon key is correct (should start with `eyJ`)
- Make sure your Supabase project is active (not paused)

### If tables don't exist:
- We'll need to run the schema migrations
- Check `supabase/schema.sql` for the schema
- Check `supabase/seed.sql` for seed data

