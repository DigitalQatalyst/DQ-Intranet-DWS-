# Testing Guide - What to Check

## Current Status

✅ **Connection**: Supabase cloud is connected  
✅ **Table Exists**: You can see the guides table in the dashboard  
⚠️ **API Access**: Getting permission errors via API (might be RLS configuration)

## What to Test

### 1. Test the Application UI

The dev server should be running. Open your browser and test:

1. **Guides Marketplace**: http://localhost:5173/marketplace/guides
   - Check if guides load
   - Test the Strategy/Guidelines/Blueprints tabs
   - Try searching and filtering

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for any errors
   - Check Network tab for API calls

### 2. Check What You See in Supabase Dashboard

In the Supabase dashboard, please check:

1. **Table Editor** → `guides` table:
   - How many rows?
   - What columns exist?
   - Sample data?

2. **SQL Editor**:
   - Can you run: `SELECT COUNT(*) FROM guides;`?
   - What does it return?

3. **Settings** → **API**:
   - Is "Enable Anonymous Access" enabled?
   - Are there any restrictions?

4. **Authentication** → **Policies**:
   - Check RLS policies on `guides` table
   - What policies exist?

### 3. Possible Issues & Solutions

#### Issue: Permission Denied for Schema Public

**Possible Causes:**
- RLS policies are too restrictive
- Service role key doesn't have proper permissions
- Schema-level permissions not set

**Solutions:**
1. Check RLS policies in Supabase dashboard
2. Verify service role key is correct
3. May need to grant permissions to the public schema

#### Issue: Table Exists But Can't Query

**Possible Causes:**
- RLS blocking all access
- Missing SELECT policy
- API access disabled

**Solutions:**
1. Create/update RLS policy:
   ```sql
   CREATE POLICY "Allow public read access" ON guides
   FOR SELECT USING (true);
   ```

2. Or for service role:
   ```sql
   GRANT ALL ON public.guides TO service_role;
   ```

## Next Steps

1. **Test the UI** - See if the marketplace works despite API errors
2. **Check RLS Policies** - Verify what policies exist
3. **Share Results** - Let me know what you see in the dashboard and UI

## Quick RLS Fix (If Needed)

If you need to allow public read access temporarily for testing:

```sql
-- Allow anonymous users to read approved guides
CREATE POLICY "guides_select_approved" ON public.guides
FOR SELECT USING (status = 'Approved');

-- Allow service role full access
GRANT ALL ON public.guides TO service_role;
```

Run this in Supabase SQL Editor if needed.


