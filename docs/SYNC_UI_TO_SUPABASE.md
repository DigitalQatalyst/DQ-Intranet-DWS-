# Sync UI Changes to Supabase

## Problem
You edited content in the UI (localhost), and it shows on localhost, but those changes are **NOT saved to Supabase**. You need to get those changes into Supabase.

## Solution Options

### Option 1: Use Admin Editor to Save (Recommended) ✅

If you edited through the admin editor:

1. **Go to Admin Editor**
   - Navigate to: `/admin/guides/{guide-id}`
   - Find the guide you edited (e.g., `dq-ghc`)

2. **Check if there's a Save button**
   - Look for "Save" or "Update" button
   - Click it to save changes to Supabase

3. **If no Save button or it's not working:**
   - Copy the content from the editor
   - Use Option 2 below

### Option 2: Copy Content from UI to Supabase (Manual)

1. **Get the content from localhost:**
   - Open the guide page on localhost
   - View page source or inspect element
   - Copy the content you see

2. **Update in Supabase:**
   - Go to Supabase Dashboard → Table Editor
   - Find the guide (filter by `slug` = `dq-ghc`)
   - Paste the content into the `body` field
   - Click Save

### Option 3: Use Browser Console to Get Content

1. **Open the guide page on localhost**
2. **Open browser console (F12)**
3. **Find the log**: `✅ [DQ-GHC] Guide loaded: Object`
4. **Expand the Object** to see the content
5. **Copy the `body` content**
6. **Paste into Supabase** (Table Editor or SQL Editor)

### Option 4: SQL Script to Update from Console Data

If you can get the content from console, I can create a SQL script to update it.

## Quick Steps to Save from Admin Editor

1. **Navigate to**: `/admin/guides`
2. **Find your guide** (search for "dq-ghc" or "Golden Honeycomb")
3. **Click Edit**
4. **Make sure all fields are correct**
5. **Click "Save" or "Update" button**
6. **Verify** it saved (check Supabase)

## If Save Button Doesn't Work

Check browser console for errors when clicking Save. Common issues:
- Authentication error
- Network error
- Validation error (duplicate content protection)

## Need Help?

Share:
1. **Where did you edit?** (Admin editor? Direct page edit?)
2. **What content did you change?** (Title? Body? Summary?)
3. **Is there a Save button?** (Does it work?)
4. **Any errors in console?** (When trying to save)

I can help create a script to sync the content!
