# Database Setup Instructions for Supabase Cloud

## Current Status

✅ **Connection Verified**: Your Supabase cloud instance is connected  
⚠️ **Schema Not Set Up**: The database tables don't exist yet

## What Needs to Be Done

You need to run SQL migrations in your Supabase dashboard to create the tables. There are two main schemas:

1. **DQ Tables** (for Discover DQ 6x view) - `supabase/schema.sql` + `supabase/seed.sql`
2. **Guides Tables** (for Guides Marketplace) - `supabase/migrations/20251029091752_remote_commit.sql`

## Step-by-Step Setup

### Step 1: Open Supabase SQL Editor

1. Go to: https://app.supabase.com
2. Log in with your credentials
3. Select your project: `jmhtrffmxjxhoxpesubv`
4. Click **"SQL Editor"** in the left sidebar
5. Click **"New query"**

### Step 2: Run Guides Schema (Most Important)

The guides marketplace needs the guides tables. Run this migration:

1. Open the file: `supabase/migrations/20251029091752_remote_commit.sql`
2. Copy **ALL** the contents (it's a large file, ~1600 lines)
3. Paste into Supabase SQL Editor
4. Click **"Run"** (or press `Ctrl+Enter`)
5. Wait for completion (may take 30-60 seconds)

This creates:
- `guides` table
- `guide_attachments` table
- `guide_templates` table
- `guide_steps` table
- All indexes and RLS policies

### Step 3: Run DQ Schema (Optional - for Discover DQ page)

1. Create a **new query** in SQL Editor
2. Open: `supabase/schema.sql`
3. Copy all contents
4. Paste and run

### Step 4: Run Seed Data (Optional - for sample data)

1. Create a **new query** in SQL Editor
2. Open: `supabase/seed.sql`
3. Copy all contents
4. Paste and run

This adds sample data for the DQ 6x view.

### Step 5: Verify Setup

After running the migrations, test again:

```bash
npm run test:supabase
```

You should now see:
- ✅ Tables exist
- ✅ Connection successful
- ✅ Record counts

## Quick Test After Setup

Once tables are created, you can test the guides marketplace:

```bash
npm run dev
```

Then navigate to: `http://localhost:5173/marketplace/guides`

## Troubleshooting

### If you get "permission denied" errors:
- Make sure you're using the **service role key** in the test script
- Check that RLS policies were created correctly

### If tables still don't show up:
- Refresh the Supabase dashboard
- Check the SQL Editor for any error messages
- Verify the migration completed successfully

### If you need to start over:
- You can drop tables and re-run migrations
- Be careful - this will delete all data!

## Next Steps After Setup

1. ✅ Test the connection: `npm run test:supabase`
2. ✅ Seed some guide data (if needed)
3. ✅ Test the marketplace UI: `npm run dev`
4. ✅ Verify the Strategy/Guidelines/Blueprints tabs work

