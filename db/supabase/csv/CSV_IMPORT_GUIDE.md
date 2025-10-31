# 📊 CSV Import Guide for Supabase

## Quick Overview

Instead of running SQL scripts, you can import CSV files directly through the Supabase Dashboard. This is easier and more visual!

## 📁 CSV Files Created

Located in `db/supabase/csv/`:

1. **users_local.csv** - 8 test users
2. **communities.csv** - 6 communities
3. **memberships.csv** - 23 user-community relationships
4. **posts.csv** - 10 posts
5. **comments.csv** - 8 comments
6. **reactions.csv** - 13 reactions

---

## 🚀 Step-by-Step Import Process

### Prerequisites

1. ✅ Run `communities_schema.sql` first (creates tables)
2. ✅ Have your Supabase project open

### Import Order (IMPORTANT!)

Import in this exact order due to foreign key dependencies:

1. **users_local.csv** (no dependencies)
2. **communities.csv** (depends on users_local)
3. **memberships.csv** (depends on users_local + communities)
4. **posts.csv** (depends on users_local + communities)
5. **comments.csv** (depends on posts + users_local)
6. **reactions.csv** (depends on posts + users_local)

---

## 📝 Detailed Import Instructions

### Step 1: Create Tables First

Before importing CSV files, you MUST create the tables:

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `communities_schema.sql`
3. Paste and run
4. Wait for completion

### Step 2: Import users_local.csv

1. Go to **Table Editor** in Supabase Dashboard
2. Find the **users_local** table
3. Click **Insert** → **Import data from CSV**
4. Select `users_local.csv`
5. Click **Import**
6. Verify: Should show 8 rows

### Step 3: Import communities.csv

1. Go to **communities** table
2. Click **Insert** → **Import data from CSV**
3. Select `communities.csv`
4. Click **Import**
5. Verify: Should show 6 rows

### Step 4: Import memberships.csv

1. Go to **memberships** table
2. Click **Insert** → **Import data from CSV**
3. Select `memberships.csv`
4. Click **Import**
5. Verify: Should show 23 rows

### Step 5: Import posts.csv

1. Go to **posts** table
2. Click **Insert** → **Import data from CSV**
3. Select `posts.csv`
4. Click **Import**
5. Verify: Should show 10 rows

### Step 6: Import comments.csv

1. Go to **comments** table
2. Click **Insert** → **Import data from CSV**
3. Select `comments.csv`
4. Click **Import**
5. Verify: Should show 8 rows

### Step 7: Import reactions.csv

1. Go to **reactions** table
2. Click **Insert** → **Import data from CSV**
3. Select `reactions.csv`
4. Click **Import**
5. Verify: Should show 13 rows

---

## ✅ Verification

After importing all files, run this in SQL Editor:

```sql
-- Check all imports
SELECT 
    'users_local' as table_name,
    COUNT(*) as row_count,
    CASE WHEN COUNT(*) = 8 THEN '✓' ELSE '✗' END as status
FROM users_local
UNION ALL
SELECT 'communities', COUNT(*), CASE WHEN COUNT(*) = 6 THEN '✓' ELSE '✗' END FROM communities
UNION ALL
SELECT 'memberships', COUNT(*), CASE WHEN COUNT(*) = 23 THEN '✓' ELSE '✗' END FROM memberships
UNION ALL
SELECT 'posts', COUNT(*), CASE WHEN COUNT(*) = 10 THEN '✓' ELSE '✗' END FROM posts
UNION ALL
SELECT 'comments', COUNT(*), CASE WHEN COUNT(*) = 8 THEN '✓' ELSE '✗' END FROM comments
UNION ALL
SELECT 'reactions', COUNT(*), CASE WHEN COUNT(*) = 13 THEN '✓' ELSE '✗' END FROM reactions;
```

Expected output: All rows should show ✓

---

## 🔧 Troubleshooting

### Error: "violates foreign key constraint"

**Cause:** Importing in wrong order  
**Solution:** Import in the order specified above (users → communities → memberships → posts → comments → reactions)

### Error: "duplicate key value"

**Cause:** Data already exists  
**Solution:** Either:
- Delete existing rows first
- Or skip this import

### Error: "column does not exist"

**Cause:** Schema not created yet  
**Solution:** Run `communities_schema.sql` first

### CSV file not uploading

**Cause:** File format issue  
**Solution:** 
- Make sure file is UTF-8 encoded
- Check for special characters
- Try opening in Excel and re-saving as CSV

### Import button greyed out

**Cause:** Table doesn't exist  
**Solution:** Create tables using `communities_schema.sql` first

---

## 📊 Alternative: Import via SQL

If CSV import doesn't work, you can use the original SQL file:

```sql
-- Run this in Supabase SQL Editor
-- Copy contents of communities_seed_data.sql
```

---

## 🎯 What You Get After Import

### Users (8)
- admin@digitalqatalyst.com (admin)
- sarah.smith@digitalqatalyst.com (moderator)
- john.doe@digitalqatalyst.com (member)
- Plus 5 more members

### Communities (6)
- Tech Innovators Abu Dhabi (5 members)
- Digital Transformation Hub (4 members)
- Startup Ecosystem UAE (5 members)
- AI & Machine Learning (3 members)
- Creative Designers Network (3 members)
- Data Science Community (3 members)

### Posts (10)
- Various topics: AI, startups, design, data science
- Mix of text posts and events
- Recent timestamps

### Engagement
- 8 comments across posts
- 13 reactions (helpful/insightful)

---

## 🔐 Important Notes

### Passwords
The CSV includes placeholder password hashes. To use these users:

**Option 1:** Create new users through your app's signup  
**Option 2:** Update passwords manually with bcrypt hashes  
**Option 3:** Use for testing only (not production)

### Arrays in CSV
Tags are stored as PostgreSQL arrays: `"{tag1,tag2,tag3}"`

### Timestamps
All timestamps are in format: `YYYY-MM-DD HH:MM:SS`

---

## 🧪 Test Your Import

After importing, test in your app:

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:5173/communities`
   - Should show 6 communities
3. Visit: `http://localhost:5173/communities/feed`
   - Should show 10 posts with reactions

---

## 📱 Quick Import Checklist

- [ ] Run communities_schema.sql
- [ ] Import users_local.csv (8 rows)
- [ ] Import communities.csv (6 rows)
- [ ] Import memberships.csv (23 rows)
- [ ] Import posts.csv (10 rows)
- [ ] Import comments.csv (8 rows)
- [ ] Import reactions.csv (13 rows)
- [ ] Run verification query
- [ ] Test /communities route
- [ ] Test /communities/feed route

---

## 🆘 Need Help?

If CSV import isn't working:
1. Use the SQL seed file instead: `communities_seed_data.sql`
2. Check Supabase logs for specific errors
3. Verify table schema matches CSV columns
4. Make sure RLS policies aren't blocking inserts

---

**Total Import Time: ~5 minutes** ⏱️

**Difficulty: Easy** ⭐⭐☆☆☆
