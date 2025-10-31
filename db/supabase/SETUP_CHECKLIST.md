# ✅ Communities Setup Checklist

## Pre-Setup
- [x] Updated VITE_SUPABASE_URL in .env
- [x] Updated VITE_SUPABASE_ANON_KEY in .env
- [ ] Verified .env file is in .gitignore

## Database Setup
- [ ] Ran communities_schema.sql in Supabase SQL Editor
- [ ] Ran communities_seed_data.sql in Supabase SQL Editor
- [ ] Ran verify.sql to check setup
- [ ] Verified tables exist in Supabase Dashboard → Table Editor

## Testing
- [ ] Started dev server (npm run dev)
- [ ] Tested /communities route
  - [ ] Shows 6 communities
  - [ ] Community cards display correctly
  - [ ] Images load properly
- [ ] Tested /communities/feed route
  - [ ] Shows posts from multiple communities
  - [ ] Reactions (helpful/insightful) display
  - [ ] Comments show on posts
  - [ ] Can filter by tags

## User Testing
- [ ] Created a new user account through app signup
- [ ] Logged in successfully
- [ ] Joined a community
- [ ] Created a new post
- [ ] Added a comment to a post
- [ ] Added a reaction to a post

## Verification Queries

Run these in Supabase SQL Editor to verify:

```sql
-- Check table counts
SELECT 
    (SELECT COUNT(*) FROM users_local) as users,
    (SELECT COUNT(*) FROM communities) as communities,
    (SELECT COUNT(*) FROM posts) as posts,
    (SELECT COUNT(*) FROM memberships) as memberships;

-- Check if get_feed works
SELECT * FROM get_feed('global', 'recent', NULL, 5, 0);

-- Check communities with counts
SELECT * FROM communities_with_counts ORDER BY member_count DESC;

-- Check posts with reactions
SELECT id, title, helpful_count, insightful_count, comment_count 
FROM posts_with_reactions 
ORDER BY created_at DESC 
LIMIT 5;
```

## Common Issues & Solutions

### Issue: Tables not showing in Supabase
**Solution:** Re-run communities_schema.sql

### Issue: No data in tables
**Solution:** Run communities_seed_data.sql

### Issue: Routes show "Loading..." forever
**Solution:** 
1. Check browser console for errors
2. Verify Supabase credentials in .env
3. Check Supabase logs in Dashboard

### Issue: Can't login with seed users
**Solution:** Seed users have placeholder passwords. Create new users through app signup.

### Issue: RLS blocking queries
**Solution:** Check RLS policies in Supabase Dashboard → Authentication → Policies

## Files Created

- [x] db/supabase/communities_schema.sql
- [x] db/supabase/communities_seed_data.sql
- [x] db/supabase/verify.sql
- [x] db/supabase/README.md
- [x] db/supabase/QUICK_START.md
- [x] db/supabase/setup.ps1
- [x] db/supabase/setup.sh
- [x] COMMUNITIES_SETUP_GUIDE.md

## Next Steps After Setup

1. [ ] Review RLS policies for production use
2. [ ] Update seed user passwords or remove them
3. [ ] Customize communities for your organization
4. [ ] Add your own community images
5. [ ] Configure email notifications (if needed)
6. [ ] Set up proper authentication flow
7. [ ] Add more sample data if needed
8. [ ] Test moderation features
9. [ ] Review and enhance security policies
10. [ ] Deploy to production

## Production Readiness

Before going to production:

- [ ] Remove or update seed data users
- [ ] Review and enhance RLS policies
- [ ] Set up proper backup strategy
- [ ] Configure monitoring and alerts
- [ ] Test all user flows thoroughly
- [ ] Review API rate limits
- [ ] Set up proper error handling
- [ ] Document admin procedures
- [ ] Train moderators
- [ ] Prepare user documentation

## Support Resources

- Supabase Docs: https://supabase.com/docs
- Project README: db/supabase/README.md
- Setup Guide: COMMUNITIES_SETUP_GUIDE.md
- Quick Start: db/supabase/QUICK_START.md

---

**Setup Date:** _____________

**Completed By:** _____________

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
