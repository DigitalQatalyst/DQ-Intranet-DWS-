# Troubleshooting UI ↔ Supabase Sync Issues

## Problem
- Changes in UI don't appear in Supabase
- Changes in Supabase don't appear on localhost

## Common Causes & Solutions

### 1. **Browser Cache**
**Solution:** Hard refresh your browser
- **Chrome/Edge:** `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- **Firefox:** `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Or open DevTools → Network tab → Check "Disable cache"

### 2. **React Query / Data Caching**
The app might be caching data. Try:

**Option A: Clear browser cache and reload**
1. Open DevTools (F12)
2. Go to Application tab → Clear Storage
3. Click "Clear site data"
4. Refresh the page

**Option B: Check if React Query is caching**
- Open browser console
- Look for cache-related logs
- The app might need a manual cache refresh

### 3. **Wrong Supabase Project**
Your localhost might be pointing to a different Supabase project than the one you're editing.

**Check your environment variables:**
```bash
# In your project root, check .env file
cat .env | grep SUPABASE
```

**Verify in Supabase Dashboard:**
1. Go to Supabase Dashboard → Settings → API
2. Compare the Project URL with your `.env` file
3. Make sure `VITE_SUPABASE_URL` matches

### 4. **Dev Server Not Restarted**
After changing `.env` file, you MUST restart the dev server.

**Steps:**
1. Stop your dev server (Ctrl+C)
2. Restart it: `npm run dev` or `vite`
3. Hard refresh browser (Ctrl+Shift+R)

### 5. **Row Level Security (RLS) Policies**
RLS might be blocking your updates or reads.

**Check RLS:**
```sql
-- Run this in Supabase SQL Editor
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'guides';
```

**Temporarily disable RLS for testing (NOT for production!):**
```sql
ALTER TABLE public.guides DISABLE ROW LEVEL SECURITY;
```

### 6. **Check Which Supabase Client is Being Used**
The app might be using different clients for reads vs writes.

**Check the code:**
- Reads: `supabaseClient` from `src/lib/supabaseClient.ts`
- Writes: `supabaseAdmin` from `api/_supabase.ts` (server-side)

### 7. **Network Tab Inspection**
Check if requests are actually being sent:

1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Make a change in the UI
4. Check if a request is sent to Supabase
5. Check the response status and data

### 8. **Verify Data in Supabase**
Directly query Supabase to confirm data exists:

```sql
-- Check if dq-hov exists and has content
SELECT 
  slug,
  title,
  LENGTH(body) as body_length,
  last_updated_at
FROM public.guides
WHERE slug = 'dq-hov';
```

## Step-by-Step Debugging

### Step 1: Verify Environment Variables
```bash
# Check what Supabase URL your app is using
echo $VITE_SUPABASE_URL

# Or check in browser console
console.log(import.meta.env.VITE_SUPABASE_URL)
```

### Step 2: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for:
   - Supabase connection logs
   - Error messages
   - Cache-related warnings

### Step 3: Check Network Requests
1. Open DevTools → Network tab
2. Filter by "supabase"
3. Make a change in UI
4. Check if request is sent
5. Check response status (200 = success, 401/403 = auth issue)

### Step 4: Test Direct Supabase Query
Run this in Supabase SQL Editor to verify data:

```sql
-- Get all GHC guides
SELECT slug, title, status, last_updated_at
FROM public.guides
WHERE slug IN (
  'dq-vision', 'dq-hov', 'dq-persona', 
  'dq-agile-tms', 'dq-agile-sos', 
  'dq-agile-flows', 'dq-agile-6xd'
)
ORDER BY slug;
```

### Step 5: Force Refresh in Code
If using React Query, you might need to invalidate the cache:

```typescript
// In your component
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Force refresh
queryClient.invalidateQueries(['guides']);
```

## Quick Fix Checklist

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Restart dev server
- [ ] Check `.env` file has correct Supabase URL
- [ ] Verify you're editing the same Supabase project
- [ ] Check browser console for errors
- [ ] Check Network tab for failed requests
- [ ] Clear browser cache
- [ ] Verify RLS policies allow your operations

## Still Not Working?

1. **Check Supabase Logs:**
   - Go to Supabase Dashboard → Logs
   - Look for errors or blocked requests

2. **Test with Direct API Call:**
   ```bash
   curl -X GET \
     'YOUR_SUPABASE_URL/rest/v1/guides?slug=eq.dq-hov' \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```

3. **Check Authentication:**
   - Make sure you're authenticated if RLS requires it
   - Check if service role key is needed for admin operations

## Common Error Messages

- **401 Unauthorized:** Check your API keys
- **403 Forbidden:** RLS policy is blocking the request
- **404 Not Found:** Wrong Supabase URL or table doesn't exist
- **Network Error:** Check your internet connection or Supabase status
