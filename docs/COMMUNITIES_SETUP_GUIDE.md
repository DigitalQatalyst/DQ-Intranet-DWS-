# Communities Database Setup Guide

## Quick Start

You've updated your Supabase credentials in `.env`. Now you need to create the database tables and add sample data.

### ✅ What Was Created

I've created the following files in `db/supabase/`:

1. **communities_schema.sql** - Complete database schema (tables, views, functions)
2. **communities_seed_data.sql** - Sample data (users, communities, posts)
3. **README.md** - Detailed documentation
4. **setup.ps1** - PowerShell setup helper (for Windows)
5. **setup.sh** - Bash setup helper (for Mac/Linux)

---

## 🚀 Easiest Setup Method (Recommended)

### Option A: CSV Import (Easiest!)

1. **Create tables:** Run `communities_schema.sql` in Supabase SQL Editor
2. **Import CSV files:** Go to Table Editor and import each CSV file in order
   - See `db/supabase/csv/QUICK_IMPORT.md` for step-by-step guide
   - Takes ~5 minutes total

### Option B: PowerShell Script

Open PowerShell in the project root and run:

```powershell
cd db\supabase
.\setup.ps1
```

Choose **Option 3** to copy the schema SQL to clipboard, then paste it in Supabase.  
Then run the script again and choose **Option 4** for the seed data.

### Step 2: Verify

Go to your Supabase Dashboard → Table Editor and verify these tables exist:
- `communities`
- `posts`
- `users_local`
- `memberships`
- `comments`
- `reactions`

---

## 📋 Manual Setup (Alternative)

If you prefer to do it manually:

### 1. Open Supabase SQL Editor

Go to: [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Select your project
- Click "SQL Editor" in sidebar
- Click "New query"

### 2. Run Schema File

- Open `db/supabase/communities_schema.sql` in your code editor
- Copy **all** contents (Ctrl+A, Ctrl+C)
- Paste into Supabase SQL Editor
- Click "Run" (or Ctrl+Enter)
- Wait for completion (~10-30 seconds)

### 3. Run Seed Data File

- Create a new query in Supabase SQL Editor
- Open `db/supabase/communities_seed_data.sql`
- Copy **all** contents
- Paste into Supabase SQL Editor
- Click "Run"
- You should see a summary showing counts of created records

---

## 🧪 Test Your Setup

### 1. Start Your Dev Server

```bash
npm run dev
```

### 2. Test the Routes

**Test /communities:**
- Navigate to `http://localhost:5173/communities`
- You should see 6 communities:
  - Tech Innovators Abu Dhabi
  - Digital Transformation Hub
  - Startup Ecosystem UAE
  - AI & Machine Learning
  - Creative Designers Network
  - Data Science Community

**Test /communities/feed:**
- Navigate to `http://localhost:5173/communities/feed`
- You should see recent posts from various communities
- Posts should have reactions (helpful/insightful counts)
- Some posts should have comments

---

## 📊 What Data Was Created

### Users (8 test users)
- `admin@digitalqatalyst.com` - Admin user
- `sarah.smith@digitalqatalyst.com` - Moderator
- `john.doe@digitalqatalyst.com` - Regular member
- Plus 5 more members

**Note:** Passwords are placeholder hashes. You'll need to create real users through your app's signup flow.

### Communities (6 communities)
- Various categories: Technology, Business, Creative
- Member counts ranging from 3-5 members each
- Sample images from Unsplash

### Posts (10 posts)
- Mix of text posts and events
- Tagged with relevant topics
- Created by different users
- Distributed across communities

### Engagement
- 8 comments on various posts
- 13 reactions (helpful/insightful)
- Realistic timestamps (recent activity)

---

## 🔧 Troubleshooting

### "Table already exists" error
The schema file includes `IF NOT EXISTS` checks, so this shouldn't happen. If it does, you can either:
1. Ignore it (tables already exist)
2. Drop and recreate (see README.md for instructions)

### Routes show "Loading..." forever
Check browser console for errors. Common issues:
- Supabase URL/Key mismatch in `.env`
- RLS policies blocking queries
- Network/CORS issues

### No data showing
Verify seed data was inserted:
```sql
SELECT COUNT(*) FROM communities;
SELECT COUNT(*) FROM posts;
SELECT COUNT(*) FROM users_local;
```

### Authentication issues
The seed data creates users with placeholder passwords. You'll need to:
1. Create new users through your app's signup
2. Or update password hashes manually with bcrypt

---

## 📁 Database Schema Overview

### Core Tables
```
users_local          → User accounts
communities          → Community definitions  
memberships          → User-community relationships
posts                → Community posts
comments             → Post comments
reactions            → Post reactions (helpful, insightful)
```

### Key Views
```
communities_with_counts  → Communities with member counts (used by /communities)
posts_with_reactions     → Posts with reaction counts (used by /communities/feed)
```

### Key Functions
```
get_feed()              → Fetch feed posts (used by /communities/feed)
get_trending_topics()   → Get popular tags
can_moderate()          → Check moderation permissions
```

---

## 🔐 Security Notes

⚠️ **Before Production:**

1. **Update passwords** - Seed data has placeholder hashes
2. **Review RLS policies** - Basic policies are included but should be enhanced
3. **Never commit** your Supabase keys to git
4. **Use environment variables** for all sensitive data

---

## 📚 Additional Resources

- **Detailed docs:** `db/supabase/README.md`
- **Schema file:** `db/supabase/communities_schema.sql`
- **Seed data:** `db/supabase/communities_seed_data.sql`
- **Supabase docs:** https://supabase.com/docs
- **TypeScript types:** `src/communities/integrations/supabase/types.ts`

---

## ✨ Next Steps

After successful setup:

1. ✅ Verify tables in Supabase Dashboard
2. ✅ Test both routes in your browser
3. ✅ Create a real user account through your app
4. ✅ Test joining a community
5. ✅ Test creating a post
6. ✅ Test adding reactions and comments

---

## 🆘 Need Help?

If you encounter issues:

1. Check the browser console for errors
2. Check Supabase logs in Dashboard → Logs
3. Review `db/supabase/README.md` for detailed troubleshooting
4. Verify your `.env` file has the correct credentials
5. Make sure you ran both SQL files (schema + seed data)

---

**Happy coding! 🚀**
