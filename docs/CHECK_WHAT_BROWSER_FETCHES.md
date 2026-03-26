# Check What Content Browser is Actually Fetching

## The Good News ✅
Your console shows: `✅ [DQ-PERSONA] Guide loaded: Object`

This means the page **IS fetching from Supabase successfully**. The content mismatch might be:
1. Browser cache showing old content
2. The actual data in Supabase is different than expected

## How to See What Browser is Fetching

### Step 1: Check Browser Console Log
1. Open your app: `/marketplace/guides/dq-persona`
2. Open browser console (F12)
3. Look for: `✅ [DQ-PERSONA] Guide loaded:`
4. Click on the `Object` to expand it
5. Check:
   - `title` - What title is shown?
   - `bodyPreview` - First 100 characters of body
   - `bodyLength` - Length of body content

### Step 2: Compare with Supabase
Run this in Supabase SQL Editor:

```sql
SELECT 
  slug,
  title,
  LENGTH(body) as body_length,
  LEFT(body, 100) as body_preview
FROM public.guides
WHERE slug = 'dq-persona';
```

**Compare:**
- Does the `title` in console match Supabase?
- Does the `bodyPreview` in console match Supabase?
- Does the `bodyLength` match?

### Step 3: Check Network Tab
1. Open DevTools (F12) → Network tab
2. Filter by "supabase" or "guides"
3. Find the request to Supabase for dq-persona
4. Click on it → Response tab
5. Check the actual JSON response

## Quick Fix: Clear Cache and Check

1. **Hard refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Check console log** - Expand the `Object` in `✅ [DQ-PERSONA] Guide loaded:`
3. **Compare** with what's in Supabase

## If Content Still Doesn't Match

The console log shows exactly what was fetched. Share:
1. The `title` from console log
2. The `bodyPreview` from console log  
3. The `bodyLength` from console log
4. What you see in Supabase (from the SQL query)

This will tell us if:
- Browser is fetching old cached data
- Supabase has different data than expected
- There's a sync issue
