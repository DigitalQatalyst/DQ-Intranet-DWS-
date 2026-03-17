# 🚀 Quick Start - 3 Steps to Get Communities Working

## Step 1: Run Setup Script (Easiest)

Open PowerShell in the project root:

```powershell
cd db\supabase
.\setup.ps1
```

Choose **Option 3** → Paste in Supabase SQL Editor → Run  
Choose **Option 4** → Paste in Supabase SQL Editor → Run

**Done!** ✅

---

## Step 2: Verify Setup

Run the verification script in Supabase SQL Editor:

```sql
-- Copy and paste contents of verify.sql
```

You should see "✓ ALL CHECKS PASSED"

---

## Step 3: Test in Browser

```bash
npm run dev
```

Visit:
- http://localhost:5173/communities (should show 6 communities)
- http://localhost:5173/communities/feed (should show posts)

---

## 📝 What You Get

### 6 Sample Communities
- Tech Innovators Abu Dhabi
- Digital Transformation Hub  
- Startup Ecosystem UAE
- AI & Machine Learning
- Creative Designers Network
- Data Science Community

### 10 Sample Posts
- Various topics (AI, startups, design, etc.)
- With comments and reactions
- Realistic timestamps

### 8 Test Users
- admin@digitalqatalyst.com (admin)
- sarah.smith@digitalqatalyst.com (moderator)
- john.doe@digitalqatalyst.com (member)
- Plus 5 more members

---

## ⚠️ Important Notes

1. **Passwords are placeholders** - Create real users through your app
2. **Test data only** - Not for production use
3. **RLS enabled** - Basic security policies included

---

## 🆘 Troubleshooting

**Nothing showing?**
- Check browser console for errors
- Verify .env has correct Supabase URL and key
- Run verify.sql to check database

**Can't login?**
- Seed users have placeholder passwords
- Create a new user through your app's signup

**SQL errors?**
- Make sure to run schema.sql BEFORE seed_data.sql
- Check Supabase logs in Dashboard

---

## 📚 More Info

- Full guide: `COMMUNITIES_SETUP_GUIDE.md`
- Detailed docs: `README.md`
- Verification: `verify.sql`

---

**That's it! Your communities feature is ready to use. 🎉**
