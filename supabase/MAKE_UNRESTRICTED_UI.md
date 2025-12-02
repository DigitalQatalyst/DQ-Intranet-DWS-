# Making LMS Tables Unrestricted via Supabase UI

## Method 1: Using Table Editor (Easiest)

### Step 1: Open Table Editor
1. Go to your Supabase dashboard
2. Click on **Table Editor** in the left sidebar
3. Find your LMS tables:
   - `lms_courses`
   - `lms_curriculum_items`
   - `lms_topics`
   - `lms_lessons`

### Step 2: Disable RLS for Each Table
For each table:
1. Click on the table name (e.g., `lms_courses`)
2. Look for the **"RLS"** toggle or **"Row Level Security"** switch at the top of the table view
3. **Turn OFF** the RLS toggle (it should be grayed out/unchecked)
4. Repeat for all 4 tables

### Step 3: Set Permissions (if needed)
1. While viewing a table, look for a **"Permissions"** or **"Policies"** tab/button
2. Click on it
3. Ensure the `anon` role has permissions checked for:
   - ✅ SELECT (read)
   - ✅ INSERT (if needed)
   - ✅ UPDATE (if needed)
   - ✅ DELETE (if needed)

## Method 2: Using Database Settings

### Step 1: Open Database Settings
1. Go to **Settings** → **Database** (or **API** → **Database**)
2. Look for **"Row Level Security"** section

### Step 2: Disable RLS Globally (if available)
Some Supabase versions allow you to disable RLS for all tables at once, but this is usually done per-table.

## Method 3: Using Authentication → Policies

1. Go to **Authentication** → **Policies** (or **Database** → **Policies**)
2. Find your LMS tables
3. For each table:
   - Delete any existing policies (if you want completely unrestricted)
   - Or ensure there's a policy allowing `anon` role with `USING (true)`

## Visual Guide

### Finding RLS Toggle in Table Editor:
```
┌─────────────────────────────────────┐
│  lms_courses                        │
│  [🔒 RLS: ON] ← Click to turn OFF   │
├─────────────────────────────────────┤
│  Columns | Data | Permissions       │
└─────────────────────────────────────┘
```

### Setting Permissions:
```
┌─────────────────────────────────────┐
│  Permissions for lms_courses        │
├─────────────────────────────────────┤
│  Role: anon                         │
│  ☑ SELECT                           │
│  ☑ INSERT                           │
│  ☑ UPDATE                           │
│  ☑ DELETE                           │
└─────────────────────────────────────┘
```

## Quick Checklist

For each table (`lms_courses`, `lms_curriculum_items`, `lms_topics`, `lms_lessons`):

- [ ] Open table in Table Editor
- [ ] Turn OFF RLS toggle
- [ ] Verify `anon` role has SELECT permission (and others if needed)
- [ ] Test by refreshing your app

## Notes

- The UI location may vary slightly depending on your Supabase version
- If you don't see an RLS toggle, it might be in a different location or your Supabase version might require SQL
- After making changes, refresh your application to test
- Some Supabase projects have RLS enabled by default and require explicit policies even with RLS "off" in some views

## If UI Method Doesn't Work

If you can't find these options in the UI, it's likely because:
1. Your Supabase version requires SQL for these operations
2. The UI has changed in newer versions
3. Your project permissions don't allow UI changes

In that case, the SQL method (`make-lms-tables-unrestricted.sql`) is the most reliable way.

