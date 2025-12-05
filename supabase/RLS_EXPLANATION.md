# Why Previous API Key Worked: RLS Explained

## The Key Difference

The **API key itself doesn't grant permissions** - it's the **RLS (Row Level Security) status** of your tables that controls access.

## Three Scenarios

### 1. RLS Disabled (Your Previous Setup)
```sql
-- RLS is OFF
ALTER TABLE lms_courses DISABLE ROW LEVEL SECURITY;
```
**Result**: ✅ **Anyone with any API key can access** (including anon key)
- No security checks
- All roles can read/write
- This is why your previous setup worked

### 2. RLS Enabled + No Policies (Your Current Setup)
```sql
-- RLS is ON, but no policies exist
ALTER TABLE lms_courses ENABLE ROW LEVEL SECURITY;
-- No CREATE POLICY statements
```
**Result**: ❌ **NO ONE can access** (not even with anon key)
- RLS blocks everything by default
- Even the anon key is blocked
- This is why you're getting permission denied errors

### 3. RLS Enabled + Policies (What You Need)
```sql
-- RLS is ON, with policies
ALTER TABLE lms_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon to read" ON lms_courses FOR SELECT TO anon USING (true);
```
**Result**: ✅ **Only roles matching policies can access**
- Anon key works because policy allows it
- Secure and controlled access

## Why Your Previous Setup Worked

Your **previous Supabase instance** likely had:
- **RLS disabled** on the tables, OR
- **RLS enabled but with existing policies** that allowed anon access

Your **new Supabase instance** has:
- **RLS enabled by default** (newer Supabase projects enable RLS automatically)
- **No policies created yet** (fresh tables)

## The API Key Doesn't Matter

Both anon keys work the same way - they authenticate as the `anon` role. The difference is:

| Setup | RLS Status | Can Anon Key Access? |
|-------|-----------|---------------------|
| Previous | RLS Disabled | ✅ Yes (no restrictions) |
| Current | RLS Enabled, No Policies | ❌ No (blocked by default) |
| After Fix | RLS Enabled, With Policies | ✅ Yes (policy allows it) |

## What Changed?

When you switched Supabase instances/projects:
1. **New tables** were created (with `lms_` prefix)
2. **RLS was enabled by default** (Supabase security best practice)
3. **No policies were created** (you need to add them)

## Solution

You have two options:

### Option 1: Disable RLS (Like Before) - Quick but Less Secure
```sql
ALTER TABLE lms_courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE lms_curriculum_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE lms_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE lms_lessons DISABLE ROW LEVEL SECURITY;
```
⚠️ **Warning**: This removes all security. Anyone with your anon key can read/write everything.

### Option 2: Enable RLS + Add Policies (Recommended) - Secure
Run the `lms-rls-policies.sql` script to create policies that allow anon to read data.

## Summary

- **Previous API key worked** because RLS was disabled (no restrictions)
- **Current API key doesn't work** because RLS is enabled with no policies (everything blocked)
- **The anon key itself is fine** - it's the RLS configuration that changed
- **Solution**: Either disable RLS (like before) or add policies (more secure)

