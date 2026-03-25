# Troubleshooting DQ Glossary Supabase Integration

If you're seeing "Failed to load glossary terms" error, follow these steps:

## Common Issues and Solutions

### 1. Table Does Not Exist

**Error Message:** `Table "glossary_terms" does not exist`

**Solution:**
1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the entire contents of `sql/glossary_terms_table.sql`
3. Click "Run" to execute
4. Verify the table was created in the Table Editor

### 2. Permission Denied / RLS Policy Issue

**Error Message:** `Permission denied` or `401 Unauthorized`

**Solution:**
1. Check if RLS is enabled on the table:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'glossary_terms';
   ```
2. Verify the policy exists:
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'glossary_terms';
   ```
3. If the policy doesn't exist, run this:
   ```sql
   DROP POLICY IF EXISTS "Allow public read access to glossary_terms" ON glossary_terms;
   
   CREATE POLICY "Allow public read access to glossary_terms"
     ON glossary_terms
     FOR SELECT
     USING (true);
   ```

### 3. No Data / Empty Results

**Symptom:** Page loads but shows "No glossary terms found"

**Solution:**
1. Run the seed script: `sql/glossary_terms_seed.sql`
2. Verify data exists:
   ```sql
   SELECT COUNT(*) FROM glossary_terms;
   ```
   Should return 10.

### 4. Environment Variables Not Set

**Error:** Connection errors or authentication failures

**Solution:**
1. Check `.env.local` or `.env` file has:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Restart your dev server after adding env vars

### 5. Column Mismatch

**Error:** Data mapping errors or missing fields

**Solution:**
1. Verify table structure matches:
   ```sql
   \d glossary_terms
   ```
2. Check all required columns exist:
   - id, term, slug, short_definition, full_definition
   - category, used_in, related_terms
   - status, owner, updated_at

## Quick Verification Steps

Run these queries in Supabase SQL Editor to verify setup:

```sql
-- 1. Check table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_name = 'glossary_terms'
);

-- 2. Check row count
SELECT COUNT(*) FROM glossary_terms;

-- 3. Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'glossary_terms';

-- 4. Check policy exists
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'glossary_terms';

-- 5. Test read access (should return data)
SELECT * FROM glossary_terms LIMIT 1;
```

## Still Having Issues?

1. Check browser console for detailed error messages
2. Check Supabase logs in Dashboard → Logs
3. Verify your Supabase project is active
4. Ensure you're using the correct project URL and anon key

