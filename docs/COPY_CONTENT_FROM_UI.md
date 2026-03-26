# How to Copy Content from UI to Supabase

## Problem
You edited content in the UI (localhost), it shows on localhost, but it's NOT in Supabase. You need to sync it.

## Method 1: Use Admin Editor (If Available) ✅

1. **Go to Admin Editor:**
   - Navigate to: `/admin/guides`
   - Find the guide (search for "dq-ghc" or "Golden Honeycomb")
   - Click **Edit**

2. **Check the content:**
   - The editor should show the current content
   - If it shows the OLD content (from Supabase), that means your UI changes weren't saved

3. **Save the changes:**
   - Make sure all fields are correct
   - Click **"Save"** or **"Update"** button
   - Check browser console for: `✅ Successfully updated GHC guide`

## Method 2: Get Content from Browser Console

1. **Open the guide page on localhost:**
   - Go to: `/marketplace/guides/dq-ghc` (or the guide you edited)

2. **Open browser console (F12)**

3. **Find the log:**
   - Look for: `✅ [DQ-GHC] Guide loaded: Object`
   - Click on `Object` to expand

4. **Copy the content:**
   - Copy the `body` field (full content)
   - Copy the `title` field
   - Copy the `summary` field (if changed)

5. **Update in Supabase:**
   - Go to Supabase Dashboard → Table Editor
   - Find guide by `slug` = `dq-ghc`
   - Paste content into `body`, `title`, `summary` fields
   - Click **Save**

## Method 3: Use This JavaScript Helper

Run this in browser console on the guide page:

```javascript
// Get the guide data from the page
const guideData = window.guideData || null;

// Or if you see the console log, you can get it from there
// Look for: ✅ [DQ-GHC] Guide loaded: Object
// Then in console, type:
// guideData = { title: "...", body: "...", summary: "..." }

// Then copy the output:
console.log('=== COPY THIS TO SUPABASE ===');
console.log('Title:', guideData?.title);
console.log('Summary:', guideData?.summary);
console.log('Body:', guideData?.body);
console.log('=== END ===');
```

## Method 4: Create SQL Script from Console Data

1. **Get content from console** (Method 2 above)
2. **Share the content with me** and I'll create a SQL script to update Supabase

## Quick Fix: Update dq-ghc in Supabase

If you know what content you want in Supabase:

1. **Go to Supabase Dashboard**
2. **Table Editor** → `guides` table
3. **Filter by**: `slug` = `dq-ghc`
4. **Click the row** to edit
5. **Update fields:**
   - `title`
   - `summary`
   - `body`
6. **Click Save**

## Verify It Worked

After updating in Supabase:

1. **Hard refresh browser** (`Ctrl+Shift+R`)
2. **Check the page** - should show Supabase content
3. **Check console log** - should show updated content

## Need Help?

Share:
1. **What guide did you edit?** (dq-ghc? dq-persona?)
2. **What content did you change?** (Can you copy/paste it?)
3. **Where did you edit?** (Admin editor? Direct page?)

I can create a SQL script to update Supabase with your content!
