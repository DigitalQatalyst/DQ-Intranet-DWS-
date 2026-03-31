# Fix Vision Content Cache Issue

## Problem
Vision page is showing old/cached content even though Supabase has the correct content.

## Verification
✅ **Database is correct**: Vision content in Supabase is different from GHC content
- Vision starts with: "Starting at DQ is exciting, but it can also feel like stepping into a fast-moving ecosystem..."
- GHC starts with: "Starting at DQ or even navigating your role as an existing Qatalyst can feel overwhelming..."

## Solution: Clear Browser Cache

The issue is **browser cache**. The frontend is showing cached content instead of fetching fresh data from Supabase.

### Quick Fix (Try This First):

1. **Hard Refresh Browser**:
   - **Chrome/Edge (Windows)**: `Ctrl + Shift + R`
   - **Chrome/Edge (Mac)**: `Cmd + Shift + R`
   - **Firefox**: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)

2. **Clear Browser Cache**:
   - Open DevTools (F12)
   - Go to **Application** tab → **Storage** → **Clear site data**
   - Refresh the page

3. **Disable Cache in DevTools**:
   - Open DevTools (F12)
   - Go to **Network** tab
   - Check **"Disable cache"**
   - Keep DevTools open and refresh the page

### Verify It's Fixed:

1. Open browser console (F12)
2. Navigate to `/marketplace/guides/dq-vision`
3. Look for the console log: `✅ [DQ-VISION] Guide loaded:`
4. Check the `bodyPreview` - it should start with: `"# Introduction\n\nStarting at DQ is exciting, but it can also feel like stepping into a fast-moving ecosystem..."`

If it still shows GHC content, the console log will show a different preview.

## If Hard Refresh Doesn't Work:

1. **Check if you ran the SQL script**:
   - Run `db/supabase/sync_dq_vision_to_supabase.sql` in Supabase SQL Editor
   - Verify with `db/supabase/verify_vision_content.sql`

2. **Check browser console for errors**:
   - Look for any fetch errors or warnings
   - Check Network tab to see if the request is being cached

3. **Try incognito/private window**:
   - Open the page in an incognito window
   - This bypasses all cache

## Code Changes Made

I've updated `src/pages/strategy/dq-vision/GuidelinePage.tsx` to add better error logging. The fetch itself is correct - it's just a cache issue.
