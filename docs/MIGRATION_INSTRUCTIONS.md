# Marketplace Services Migration Instructions

## Quick Migration Guide

To make services persist in the database across branches, you need to run the migration in Supabase.

### Step 1: Run the Migration

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Log in and select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration**
   - Open the file: `supabase/marketplace-services-schema.sql`
   - Copy **ALL** the contents
   - Paste into the SQL Editor
   - Click **"Run"** (or press `Ctrl+Enter`)
   - Wait for completion (should take a few seconds)

### Step 2: Verify Migration

After running the migration, verify it worked:

```bash
npm run db:migrate-services
```

This will check if the table exists.

### Step 3: Seed the Services

Once the migration is complete, seed the services into the database:

```bash
npm run db:seed-services
```

This will populate the `marketplace_services` table with all financial and non-financial services from your mock data.

### What This Migration Creates

- **Table**: `marketplace_services`
  - Stores both financial and non-financial services
  - Includes all necessary fields (title, description, provider, etc.)
  - Supports filtering by category, service type, business stage, etc.

- **Indexes**: For fast searching and filtering
- **RLS Policies**: Public read access for active services
- **Triggers**: Auto-update `updated_at` timestamp

### Troubleshooting

If you get errors:

1. **Table already exists**: The migration uses `DROP TABLE IF EXISTS`, so it's safe to re-run
2. **Permission errors**: Make sure you're using the service role key
3. **Connection errors**: Verify your `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set correctly

### After Migration

Once services are seeded, they will:
- ✅ Persist across all branches
- ✅ Be available immediately when switching branches
- ✅ Support full-text search
- ✅ Support filtering and pagination

