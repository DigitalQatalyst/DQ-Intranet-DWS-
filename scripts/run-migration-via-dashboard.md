# Running LMS Migration via Supabase Dashboard

The migration file has been generated successfully. Here's how to run it:

## Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire contents of: `db/supabase/complete_lms_migration.sql`
6. Paste into the SQL Editor
7. Click **Run** (or press Cmd/Ctrl + Enter)

## Option 2: Using psql (if you have database connection string)

If you have `DATABASE_URL` in your `.env` file:

```bash
psql "$DATABASE_URL" -f db/supabase/complete_lms_migration.sql
```

Or construct the connection string:
```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  -f db/supabase/complete_lms_migration.sql
```

## Option 3: Supabase CLI

If you have Supabase CLI installed and linked:

```bash
supabase db execute -f db/supabase/complete_lms_migration.sql
```

## Verification

After running the migration, verify the data:

```sql
SELECT 
  (SELECT COUNT(*) FROM courses) as courses,
  (SELECT COUNT(*) FROM curriculum_items) as curriculum_items,
  (SELECT COUNT(*) FROM topics) as topics,
  (SELECT COUNT(*) FROM lessons) as lessons;
```

Expected results:
- courses: ~15-20
- curriculum_items: ~50-100
- topics: ~100-200
- lessons: ~200-500

