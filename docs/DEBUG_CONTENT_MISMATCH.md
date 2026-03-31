# Debug: Content Mismatch Between Supabase and Localhost

## Problem
The content you see on localhost is different from what's in Supabase.

## Possible Causes

### 1. **Browser Cache** (Most Common) 🔴
Your browser is showing **cached/old content** instead of fetching fresh data from Supabase.

**Fix:**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or: Open DevTools (F12) → Network tab → Check "Disable cache" → Refresh

### 2. **Wrong Supabase Project** 🔴
Your localhost might be connected to a **different Supabase project** than the one you're editing.

**Check:**
1. Open browser console (F12)
2. Look for: `✅ supabaseClient initialized:`
3. Check the URL in the console
4. Compare with your `.env` file

### 3. **Data Actually Different** 🟡
The content in Supabase might actually be different from what you expect.

**Check:**
Run the diagnostic query: `db/supabase/debug_content_mismatch.sql`

### 4. **Fetch Error** 🟡
The page might be failing to fetch and showing cached/fallback data.

**Check:**
1. Open browser console (F12)
2. Look for errors or warnings
3. Look for: `✅ [DQ-PERSONA] Guide loaded:` log
4. Check Network tab for failed requests

## Step-by-Step Debugging

### Step 1: Check What's Actually in Supabase
Run this in Supabase SQL Editor:

```sql
SELECT 
  slug,
  title,
  LENGTH(body) as body_length,
  LEFT(body, 200) as preview
FROM public.guides
WHERE slug = 'dq-persona';
```

**Note down:**
- The title
- The body length
- The first 200 characters

### Step 2: Check What Browser is Fetching
1. Open your app on localhost
2. Navigate to: `/marketplace/guides/dq-persona`
3. Open browser console (F12)
4. Look for the log: `✅ [DQ-PERSONA] Guide loaded:`
5. Check the `bodyPreview` in the console log

**Compare:**
- Does the console log match what's in Supabase?
- If NO → Browser is fetching different data (wrong project or cache)
- If YES → Browser cache issue

### Step 3: Check Network Request
1. Open DevTools (F12) → Network tab
2. Filter by "supabase" or "guides"
3. Refresh the page
4. Find the request to Supabase
5. Click on it → Check:
   - **Status**: Should be 200 (success)
   - **Response**: Should show the guide data
   - **Request URL**: Should point to your Supabase project

### Step 4: Verify Environment Variables
Check your `.env` file matches your Supabase project:

```bash
# In terminal
cat .env | grep SUPABASE
```

Should show:
- `VITE_SUPABASE_URL=https://jmhtrffmxjxhoxpesubv.supabase.co`
- `VITE_SUPABASE_ANON_KEY=eyJ...` (your key)

## Quick Fixes

### Fix 1: Clear Browser Cache Completely
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Clear storage** (left sidebar)
4. Check all boxes
5. Click **Clear site data**
6. Close and reopen browser
7. Hard refresh (`Ctrl+Shift+R`)

### Fix 2: Restart Dev Server
```bash
# Stop server (Ctrl+C)
# Restart:
npm run dev
```

### Fix 3: Check Console Logs
The page logs what it fetches. Look for:
```
✅ [DQ-PERSONA] Guide loaded: {
  id: "...",
  slug: "dq-persona",
  title: "...",
  bodyLength: 1234,
  bodyPreview: "..."
}
```

**If this shows different content than Supabase:**
- Wrong Supabase project
- Cache issue
- Environment variable mismatch

## Still Not Working?

Share:
1. **What you see in Supabase** (from the SQL query)
2. **What you see in browser console** (the log output)
3. **What you see on the page** (screenshot or description)
4. **Any errors** in browser console

This will help identify the exact issue.
