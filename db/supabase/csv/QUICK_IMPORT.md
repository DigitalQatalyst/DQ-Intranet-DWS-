# ⚡ Quick CSV Import - 3 Steps

## Step 1: Create Tables (One Time)

In Supabase Dashboard → SQL Editor:

1. Copy all of `communities_schema.sql`
2. Paste and Run
3. Wait ~30 seconds

## Step 2: Import CSV Files (In Order!)

Go to **Table Editor** and import each file:

### Import Order:
1. **users_local** table → Import `users_local.csv` → 8 rows ✓
2. **communities** table → Import `communities.csv` → 6 rows ✓
3. **memberships** table → Import `memberships.csv` → 23 rows ✓
4. **posts** table → Import `posts.csv` → 10 rows ✓
5. **comments** table → Import `comments.csv` → 8 rows ✓
6. **reactions** table → Import `reactions.csv` → 13 rows ✓

**How to import:**
- Click table name in Table Editor
- Click "Insert" → "Import data from CSV"
- Select the CSV file
- Click "Import"

## Step 3: Verify

Run in SQL Editor:

```sql
SELECT 
    (SELECT COUNT(*) FROM users_local) as users,
    (SELECT COUNT(*) FROM communities) as communities,
    (SELECT COUNT(*) FROM posts) as posts;
```

Should show: `users: 8, communities: 6, posts: 10`

---

## ✅ Done!

Test your app:
- `/communities` → Should show 6 communities
- `/communities/feed` → Should show 10 posts

---

## ⚠️ Important

**Must import in the exact order above!** (Due to foreign key relationships)

If you get errors, see `CSV_IMPORT_GUIDE.md` for detailed troubleshooting.
