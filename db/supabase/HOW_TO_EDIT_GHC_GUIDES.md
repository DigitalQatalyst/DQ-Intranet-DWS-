# How to Edit GHC Guides in Supabase

## Quick Guide

You can edit GHC guides directly in Supabase using either the Table Editor or SQL Editor.

## Method 1: Table Editor (Easiest) ✅

### Steps:
1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Select your project

2. **Open Table Editor**
   - Click **Table Editor** in the left sidebar
   - Select **`guides`** table

3. **Find the Guide**
   - Use the filter/search to find by `slug`
   - Common GHC slugs:
     - `dq-vision`
     - `dq-hov`
     - `dq-persona`
     - `dq-agile-tms`
     - `dq-agile-sos`
     - `dq-agile-flows`
     - `dq-agile-6xd`
     - `dq-ghc` (main GHC overview)

4. **Edit the Guide**
   - Click on the row to open the editor
   - Edit fields:
     - `title` - The guide title
     - `summary` - Short description
     - `body` - Full content (markdown supported)
   - Click **Save**

5. **Verify**
   - Hard refresh your browser (`Ctrl+Shift+R`)
   - Visit the guide page to see changes

## Method 2: SQL Editor (More Control) 💪

### Steps:
1. **Go to SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

2. **Run Update Query**
   ```sql
   -- Example: Update dq-persona
   UPDATE public.guides
   SET 
     title = 'Persona (Identity)',
     summary = 'Your new summary here...',
     body = '# Persona (Identity)
   
   Your new content here...
   
   ## Section 1
   Content for section 1...
   
   ## Section 2
   Content for section 2...',
     last_updated_at = NOW()
   WHERE slug = 'dq-persona';
   ```

3. **Click Run**

## Important: Duplicate Protection ⚠️

The GHC duplicate protection trigger will **prevent** you from:
- Copying content from one GHC guide to another
- Making two GHC guides have identical body content

### If You Get an Error:
```
ERROR: GHC guide with slug dq-persona cannot have body content identical to other GHC guide(s): dq-ghc...
```

**This means:**
- You're trying to save content that matches another GHC guide
- Each GHC guide MUST have unique content
- This is **intentional** - it prevents the duplicate content issue

**Solution:**
- Make sure your content is unique
- Don't copy/paste from another GHC guide
- Each guide should have its own distinct content

## Best Practices

### ✅ DO:
- Edit content directly in Supabase Table Editor
- Make each guide's content unique
- Update `last_updated_at` when editing (happens automatically in Table Editor)
- Test changes by visiting the guide page

### ❌ DON'T:
- Copy content from one GHC guide to another
- Make multiple guides have identical body content
- Forget to hard refresh browser after changes

## Quick Reference: GHC Guide Slugs

| Slug | Title | What It's About |
|------|-------|----------------|
| `dq-vision` | DQ Vision (Purpose) | Why DQ exists |
| `dq-hov` | HoV (House of Values) | Culture and values |
| `dq-persona` | Persona (Identity) | Who we are |
| `dq-agile-tms` | Agile TMS | Task management |
| `dq-agile-sos` | Agile SoS | Governance |
| `dq-agile-flows` | Agile Flows | Value streams |
| `dq-agile-6xd` | Agile 6xD | Products |
| `dq-ghc` | DQ Golden Honeycomb | Main overview |

## Testing Your Changes

After editing:

1. **Hard refresh browser** (`Ctrl+Shift+R` or `Cmd+Shift+R`)
2. **Visit the guide page**: `/marketplace/guides/{slug}`
3. **Verify content** matches what you edited
4. **Check other guides** to ensure they weren't affected

## Troubleshooting

### Changes Not Showing?
1. Hard refresh browser
2. Check if you saved in Supabase
3. Verify you edited the correct `slug`
4. Check browser console for errors

### Getting Duplicate Content Error?
- This is expected if you try to copy content
- Each GHC guide must have unique content
- Write new content instead of copying

### Need to Update Multiple Guides?
- Edit them one at a time
- Or use SQL with multiple UPDATE statements
- Each guide must remain unique
