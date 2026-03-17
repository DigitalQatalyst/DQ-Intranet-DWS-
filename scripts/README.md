# Work Directory Scripts

This directory contains scripts and utilities for the Work Directory feature.

## Available Scripts

### Setup & Verification

- **`check-work-directory-tables.js`** - Checks if Work Directory tables exist in Supabase
  ```bash
  node scripts/check-work-directory-tables.js
  ```

- **`setup-work-directory.js`** - Interactive script to set up Work Directory tables
  ```bash
  node scripts/setup-work-directory.js
  ```

- **`inspect-existing-tables.js`** - Inspects existing Supabase tables to see what's there
  ```bash
  node scripts/inspect-existing-tables.js
  ```

- **`check-env.js`** - Checks if Supabase environment variables are set correctly
  ```bash
  node scripts/check-env.js
  ```

### Database Maintenance

- **`fix-work-directory-rls.sql`** - Fixes Row Level Security (RLS) policies for Work Directory tables
  - Run this in Supabase SQL Editor if you're getting permission errors
  - Location: `scripts/fix-work-directory-rls.sql`

- **`review-position-locations.sql`** - Reviews all positions and their location data
  - Helps identify which positions should have location tags
  - Run in Supabase SQL Editor

- **`update-position-locations.sql`** - Updates and standardizes position location values
  - Run in Supabase SQL Editor after reviewing with `review-position-locations.sql`

## Prerequisites

All scripts require Supabase environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Set these in your `.env` or `.env.local` file.

## Usage

1. **First time setup:**
   ```bash
   node scripts/check-env.js  # Verify environment variables
   node scripts/setup-work-directory.js  # Interactive setup
   ```

2. **Verify tables exist:**
   ```bash
   node scripts/check-work-directory-tables.js
   ```

3. **If you get permission errors:**
   - Open Supabase SQL Editor
   - Run `scripts/fix-work-directory-rls.sql`

4. **Review/update position locations:**
   - Run `scripts/review-position-locations.sql` in Supabase SQL Editor
   - Then run `scripts/update-position-locations.sql` if needed

## Related Files

- Schema: `supabase/work-directory-schema.sql`
- Seed data: `supabase/work-directory-seed.sql`
- Position data: `supabase/work-directory-positions-from-adp.sql`
- Setup guide: `supabase/WORK_DIRECTORY_SETUP.md`


