# CSV Import Files for Communities Feature

## 📁 Files in This Directory

| File | Rows | Description |
|------|------|-------------|
| `users_local.csv` | 8 | Test users (admin, moderator, members) |
| `communities.csv` | 6 | Sample communities (Tech, Business, Creative) |
| `memberships.csv` | 23 | User-community relationships |
| `posts.csv` | 10 | Sample posts across communities |
| `comments.csv` | 8 | Comments on posts |
| `reactions.csv` | 13 | Helpful/Insightful reactions |

**Total: 68 rows of sample data**

---

## 🚀 Quick Start

### 1. Create Tables
Run `communities_schema.sql` in Supabase SQL Editor (one level up)

### 2. Import CSV Files
Follow the guide in `QUICK_IMPORT.md`

### 3. Test
Visit `/communities` and `/communities/feed` in your app

---

## 📚 Documentation

- **QUICK_IMPORT.md** - 3-step quick start guide
- **CSV_IMPORT_GUIDE.md** - Detailed instructions with troubleshooting
- **IMPORT_ORDER.txt** - Visual diagram of import sequence

---

## ⚡ Why CSV Instead of SQL?

**Advantages:**
- ✅ Visual import through Supabase Dashboard
- ✅ See data before importing
- ✅ Easy to edit in Excel/Sheets
- ✅ No SQL knowledge required
- ✅ Can import selectively

**When to use SQL instead:**
- Large datasets (>1000 rows)
- Complex data transformations
- Automated deployments
- CI/CD pipelines

---

## 🔄 Import Order (Critical!)

Must import in this exact order:

1. **users_local.csv** ← No dependencies
2. **communities.csv** ← Needs users
3. **memberships.csv** ← Needs users + communities
4. **posts.csv** ← Needs users + communities
5. **comments.csv** ← Needs posts + users
6. **reactions.csv** ← Needs posts + users

See `IMPORT_ORDER.txt` for visual diagram.

---

## 📊 Data Overview

### Users (8)
- 1 admin
- 1 moderator
- 6 members
- All with placeholder passwords

### Communities (6)
- Tech Innovators Abu Dhabi
- Digital Transformation Hub
- Startup Ecosystem UAE
- AI & Machine Learning
- Creative Designers Network
- Data Science Community

### Content
- 10 posts (mix of discussions, events, questions)
- 8 comments
- 13 reactions
- Realistic timestamps and relationships

---

## 🛠️ Editing CSV Files

You can customize the data before importing:

**Using Excel:**
1. Open CSV file in Excel
2. Edit data
3. Save as CSV (UTF-8)

**Using VS Code:**
1. Install "Rainbow CSV" extension
2. Edit with syntax highlighting
3. Save

**Important:**
- Keep column headers unchanged
- Maintain UUID format for IDs
- Use proper date format: `YYYY-MM-DD HH:MM:SS`
- Arrays use PostgreSQL format: `"{item1,item2}"`

---

## ⚠️ Important Notes

### Passwords
All users have placeholder password hashes. For actual use:
- Create new users through your app's signup
- Or update with real bcrypt hashes

### UUIDs
All IDs are pre-generated UUIDs. Don't change unless you update all references.

### Foreign Keys
CSV files have relationships. Import order matters!

### Timestamps
All dates are in 2024 with recent activity for realistic testing.

---

## 🧪 Verification

After importing, run in SQL Editor:

```sql
-- Quick check
SELECT 
    (SELECT COUNT(*) FROM users_local) as users,
    (SELECT COUNT(*) FROM communities) as communities,
    (SELECT COUNT(*) FROM posts) as posts,
    (SELECT COUNT(*) FROM memberships) as memberships,
    (SELECT COUNT(*) FROM comments) as comments,
    (SELECT COUNT(*) FROM reactions) as reactions;
```

Expected: `8, 6, 10, 23, 8, 13`

---

## 🆘 Troubleshooting

### "Foreign key violation"
→ Import in wrong order. Follow sequence in IMPORT_ORDER.txt

### "Duplicate key"
→ Data already exists. Delete existing rows or skip import

### "Column not found"
→ Tables not created. Run communities_schema.sql first

### CSV won't upload
→ Check file encoding (should be UTF-8)

See `CSV_IMPORT_GUIDE.md` for detailed troubleshooting.

---

## 🔄 Alternative Methods

If CSV import doesn't work:

1. **SQL Script:** Use `communities_seed_data.sql` (one level up)
2. **Manual Entry:** Add data through Supabase Table Editor
3. **API:** Insert via your app's API

---

## 📝 File Format Details

### Date Format
```
YYYY-MM-DD HH:MM:SS
Example: 2024-10-30 10:00:00
```

### Array Format (PostgreSQL)
```
"{item1,item2,item3}"
Example: "{tech,innovation,startups}"
```

### Boolean Format
```
true or false (lowercase)
```

### UUID Format
```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Example: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
```

---

## 🎯 Next Steps After Import

1. ✅ Verify all data imported correctly
2. ✅ Test `/communities` route
3. ✅ Test `/communities/feed` route
4. ✅ Create a real user account
5. ✅ Test joining a community
6. ✅ Test creating a post

---

## 📞 Support

- **Quick Start:** QUICK_IMPORT.md
- **Detailed Guide:** CSV_IMPORT_GUIDE.md
- **Visual Guide:** IMPORT_ORDER.txt
- **Main Docs:** ../README.md

---

**Happy importing! 🚀**
