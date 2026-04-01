# 🚀 Quick Database Setup - Get Your Knowledge Center Working!

## ✨ NEW: Using the Supabase Approach (Like Other Websites)

Your KnowledgeHub now works **exactly like the other website** - it fetches content dynamically from Supabase!

## The Problem
Your page shows "No guides found" because the database is empty.

## The Solution (3 minutes - Even Faster!)
Follow these 3 simple steps to populate your database.

---

## Step 1: Create the Guides Table

1. **Open Supabase SQL Editor:**
   - Click here: https://supabase.com/dashboard/project/faqystypjlxqvgkhnbyq/sql/new

2. **Copy and paste this script:**
   - Open file: `db/supabase/00_create_guides_table.sql`
   - Copy ALL content (Ctrl+A, Ctrl+C)
   - Paste in SQL Editor
   - Click "RUN" button

3. **You should see:** ✅ Success message

---

## Step 2: Create the Media View

1. **In the same SQL Editor:**
   - Open file: `db/supabase/02_create_media_view.sql`
   - Copy ALL content
   - Paste in SQL Editor
   - Click "RUN"

2. **You should see:** ✅ View created: v_media_all

---

## Step 3: Insert Sample Content

1. **In the same SQL Editor:**
   - Open file: `db/supabase/03_insert_sample_content.sql`
   - Copy ALL content
   - Paste in SQL Editor
   - Click "RUN"

2. **You should see:** 
   - ✅ 3 Guidelines items
   - ✅ 4 Learning items

---

## Step 4: Verify It Worked

Run this test:
```bash
node test-supabase-connection.js
```

You should see:
- ✅ Guides table: EXISTS
- ✅ Content loaded

---

## Step 5: Refresh Your Browser

1. Go back to your app: http://localhost:3004
2. Scroll to "Latest DQ Developments" section
3. You should now see:
   - **Guidelines tab:** 3 guidelines
   - **Learning tab:** 4 courses

---

## 🎉 That's It!

Your Knowledge Center now works like the other website:
- ✅ Fetches from Supabase dynamically
- ✅ Filters by tags automatically
- ✅ Real-time updates when you add content
- ✅ No code changes needed to add new items

## Adding More Content

Just insert into Supabase - no code changes needed!

**Add a Guideline:**
```sql
INSERT INTO guides (slug, title, excerpt, guide_type, status, tags)
VALUES (
  'my-guideline',
  'My Guideline Title',
  'Description here',
  'Guidelines',
  'Approved',
  ARRAY['Guidelines', 'Policy']
);
```

**Add a Learning Course:**
```sql
INSERT INTO guides (slug, title, excerpt, guide_type, status, tags)
VALUES (
  'my-course',
  'My Course Title',
  'Description here',
  'Thought Leadership',
  'Approved',
  ARRAY['Learning', 'Course', 'Training']
);
```

Content appears immediately! 🚀

---

## Step 5: Refresh Your Browser

1. Go back to your app: http://localhost:3004
2. Navigate to the DQ Knowledge Center page
3. You should now see guides!

---

## Troubleshooting

### "Table already exists" error
- Skip Step 1, go directly to Step 2

### "No rows updated" in Step 3
- Make sure you ran Step 2 first
- Check if the guide slug exists: `SELECT * FROM guides WHERE slug = 'dq-vision';`

### Still showing "No guides found"
- Check browser console for errors (F12)
- Verify data exists: Run in SQL Editor:
  ```sql
  SELECT slug, title, LENGTH(body) as content_length 
  FROM guides 
  WHERE status = 'Approved';
  ```
- Make sure you're on the right page (DQ Knowledge Center tab)

### Permission errors
- Check RLS policies in Supabase Dashboard
- Make sure the guides_select_approved policy exists

---

## Quick Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/faqystypjlxqvgkhnbyq
- **SQL Editor:** https://supabase.com/dashboard/project/faqystypjlxqvgkhnbyq/sql/new
- **Table Editor:** https://supabase.com/dashboard/project/faqystypjlxqvgkhnbyq/editor/guides

---

## Summary

✅ Step 1: Create table (1 script)
✅ Step 2: Insert base records (1 script)  
✅ Step 3: Populate content (7-8 scripts)
✅ Step 4: Test connection
✅ Step 5: Refresh browser

**Total time:** ~5 minutes
**Result:** Working Knowledge Center with real data!

---

## After Setup

Once this is done:
- Your Knowledge Center will show real guides
- Guidelines & Learning tabs will have content
- You can merge to develop with confidence
- The app will fetch data from Supabase

Good luck! 🚀
