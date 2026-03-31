# Create Pull Request - Instructions

## ✅ Branch Pushed Successfully!

Your `feature/landingpage` branch has been pushed to GitHub:
- **Repository**: DigitalQatalyst/DQ-Intranet-DWS
- **Branch**: feature/landingpage
- **Commits**: 91 new commits

## 🚀 Next Step: Create Pull Request on GitHub

### 1. Go to GitHub
Open your browser and go to:
https://github.com/DigitalQatalyst/DQ-Intranet-DWS/pulls

### 2. Click "New Pull Request"

### 3. Set Up the PR
- **Base branch**: `develop`
- **Compare branch**: `feature/landingpage`

### 4. Use This PR Title
```
feat: Dynamic Knowledge Hub and Latest Updates with Supabase Integration
```

### 5. Use This PR Description

```markdown
## 🎯 Summary
Converts home page sections from static data to dynamic Supabase integration, enabling real-time content updates without code deployments.

## ✨ Key Changes

### Dynamic Knowledge Hub Section
- ✅ **Guidelines Tab**: Fetches from Knowledge Hub Supabase database
  - Shows active guidelines (currently 1: DQ Associate Owned Asset Guidelines)
  - Filters by `type='Guideline'` and `status='Approved'`
  
- ✅ **Learning Tab**: Fetches from LMS Supabase database
  - Shows published courses (currently 1: Golden Honeycomb of Competencies)
  - Filters by `status='published'` (excludes 9 archived courses)

### Dynamic Latest Updates Carousel
- ✅ Fetches latest news/announcements from Knowledge Hub Supabase
- ✅ Auto-rotates every 5 seconds
- ✅ Shows up to 8 latest items
- ✅ Excludes guidelines and blueprints (shows only news/insights)
- ✅ CTA buttons link to marketplace guides page

## 🗄️ Database Integration

### Two Separate Supabase Instances
1. **Knowledge Hub DB** (`jmhtrffmxjxhoxpesubv`)
   - Used for: Guidelines, News, Announcements, Insights
   - Table/View: `v_media_all`

2. **LMS DB** (`ivfovdutzaejsfbhqdks`)
   - Used for: Learning courses
   - Table: `lms_courses`

### Service Layer
- Created `src/services/knowledgeHubClient.ts` for Knowledge Hub
- Created `src/lib/lmsSupabaseClient.ts` for LMS
- Proper error handling and fallback content

## 📁 Files Modified

### Components
- `src/components/KnowledgeHub.tsx` - Dynamic tabs with Supabase
- `src/components/FeaturedNationalProgram.tsx` - Dynamic carousel
- `src/components/Home.tsx` - Updated section integration

### Services
- `src/services/knowledgeHubClient.ts` - Knowledge Hub Supabase client
- `src/lib/lmsSupabaseClient.ts` - LMS Supabase client
- `src/data/lmsCourseDetails.ts` - Updated to use LMS client

### Database Scripts (Optional Migration)
- `db/supabase/04_archive_leave_guidelines.sql` - Archive old guidelines
- `db/supabase/05_add_news_columns.sql` - Add columns for news
- `db/supabase/06_insert_news_data.sql` - Migrate 36 news items

### Documentation
- `READY_TO_MERGE_SUMMARY.md` - Complete setup guide
- `FINAL_KNOWLEDGE_HUB_SETUP.md` - Knowledge Hub documentation
- `NEWS_MIGRATION_READY.md` - News migration instructions
- `PR_READINESS_CHECKLIST.md` - PR readiness verification

## ✅ Testing

- ✅ Build succeeds: `npm run build` completes without errors
- ✅ Dev server runs: `npm run dev` works on localhost:3004
- ✅ TypeScript: No type errors
- ✅ Guidelines tab: Shows 1 guideline from database
- ✅ Learning tab: Shows 1 course from database
- ✅ Carousel: Auto-rotates and shows latest content
- ✅ Images: Load from database URLs
- ✅ Fallback: Shows fallback content if database unavailable

## 🎯 Benefits

1. **No Code Deployments**: Add content via Supabase SQL only
2. **Always Up-to-Date**: Shows latest content automatically
3. **Single Source of Truth**: Content managed in one place
4. **Easy Management**: Update once, reflects everywhere
5. **Scalable**: Add unlimited guidelines, courses, news items

## 📋 Environment Variables Required

```env
# Knowledge Hub Database (Guidelines & News)
VITE_KNOWLEDGE_HUB_SUPABASE_URL=https://jmhtrffmxjxhoxpesubv.supabase.co
VITE_KNOWLEDGE_HUB_SUPABASE_ANON_KEY=your_key_here

# LMS Database (Learning Courses)
VITE_LMS_SUPABASE_URL=https://ivfovdutzaejsfbhqdks.supabase.co
VITE_LMS_SUPABASE_ANON_KEY=your_key_here
```

## 🔄 Post-Merge Tasks (Optional)

After merging, you can optionally:

1. **Migrate News to Supabase** (currently using static files):
   - Run `db/supabase/05_add_news_columns.sql` in Knowledge Hub
   - Run `db/supabase/06_insert_news_data.sql` to insert 36 news items
   - Update `src/services/mediaCenterService.ts` to fetch from Supabase

2. **Clean Up**:
   - Remove debug console.log statements
   - Run `db/supabase/04_archive_leave_guidelines.sql` to archive old guidelines

3. **Optimize**:
   - Consider code splitting for bundle size reduction

## 📸 Screenshots

(Add screenshots of the home page showing the dynamic sections)

## 🔗 Related Issues

(Link any related issues or tickets)

## 👥 Reviewers

@mention-reviewers-here

---

**Ready to merge!** All functionality tested and working. Documentation included for setup and future maintenance.
```

### 6. Add Labels (Optional)
- `enhancement`
- `feature`
- `documentation`

### 7. Request Reviewers
Add team members who should review the PR

### 8. Create the PR!
Click "Create Pull Request"

## 📊 What Happens Next

1. **Review Process**: Team reviews your changes
2. **CI/CD**: Automated tests run (if configured)
3. **Approval**: Reviewers approve the PR
4. **Merge**: PR gets merged to develop
5. **Deploy**: Changes go live!

## 🎉 You're Done!

The hard work is complete. Just create the PR on GitHub and wait for review!

---

**Quick Link**: https://github.com/DigitalQatalyst/DQ-Intranet-DWS/compare/develop...feature/landingpage
