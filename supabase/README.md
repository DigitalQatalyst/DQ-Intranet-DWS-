# Supabase Setup for Discover DQ

## Quick Start

1. **Open Supabase SQL Editor** in your Supabase dashboard at `http://57.129.34.22:31819`

2. **Run the schema** (creates tables, enums, and RLS policies):
   ```sql
   -- Copy and paste the contents of schema.sql
   ```

3. **Run the seed data** (populates initial data):
   ```sql
   -- Copy and paste the contents of seed.sql
   ```

4. **Verify RLS policies** (optional, to check everything is set up):
   ```sql
   -- Copy and paste the contents of verify-rls.sql
   ```

## Troubleshooting 401 Errors

If you're getting `401 Unauthorized` errors:

### Step 1: Verify Tables Exist
Run in Supabase SQL Editor:
```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' AND tablename LIKE 'dq_%';
```

You should see:
- `dq_lanes`
- `dq_tiles`
- `dq_lane_tile_map`
- `dq_6x_page_copy`
- `dq_dna_nodes`
- `dq_dna_callouts`

### Step 2: Check RLS is Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename LIKE 'dq_%';
```

All tables should show `rowsecurity = true`.

### Step 3: Verify Policies Exist
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename LIKE 'dq_%';
```

You should see policies like:
- `dq_lanes_select`
- `dq_tiles_select`
- `dq_dna_nodes_select`
- `dq_dna_callouts_select`
- etc.

### Step 4: Check Anon Key
1. Open `.env.local` in your project root
2. Verify `VITE_SUPABASE_ANON_KEY` matches the anon key from your Supabase dashboard
3. Restart your dev server: `npm run dev`

### Step 5: Verify Supabase Project Settings
In Supabase dashboard → Settings → API:
- Ensure "Enable Anonymous Access" or similar setting is enabled
- Verify the API URL matches: `http://57.129.34.22:31819`

## If Still Having Issues

1. **Re-run schema.sql** - Sometimes policies need to be recreated
2. **Check browser console** - Look for detailed error messages
3. **Test direct API call**:
   ```bash
   curl -H "apikey: YOUR_ANON_KEY" \
        -H "Authorization: Bearer YOUR_ANON_KEY" \
        "http://57.129.34.22:31819/rest/v1/dq_dna_nodes?select=id"
   ```

## Files

- `schema.sql` - Creates tables, enums, and RLS policies
- `seed.sql` - Populates initial data
- `verify-rls.sql` - Diagnostic queries to check setup





