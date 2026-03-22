# Knowledge Hub Setup - Complete Guide

## Current Status ✅

The Knowledge Hub component on the home page now has 2 tabs:
- **Guidelines Tab**: Shows guidelines from Knowledge Hub database
- **Learning Tab**: Shows courses from LMS database

## How It Works

### Guidelines Tab
- **Database**: Knowledge Hub Supabase (`jmhtrffmxjxhoxpesubv`)
- **Table/View**: `v_media_all`
- **Filter**: 
  - `status = 'Approved'` (excludes archived items)
  - `type = 'Guideline'` (only guideline items)
  - Excludes `slug = 'dq-leave-guidelines'` (temporary until DB is updated)
- **Currently Shows**: 1 guideline
  - ✅ DQ Associate Owned Asset Guidelines

### Learning Tab
- **Database**: LMS Supabase (`ivfovdutzaejsfbhqdks`)
- **Table**: `lms_courses`
- **Filter**: 
  - `status = 'published'` (excludes archived courses)
- **Currently Shows**: 1 course
  - ✅ Golden Honeycomb of Competencies (GHC)

## Adding New Content

### To Add a New Guideline:
1. Go to Knowledge Hub Supabase SQL Editor
2. Insert into `guides` table with:
   - `type = 'Guideline'`
   - `status = 'Approved'`
   - All required fields (title, slug, description, date, etc.)
3. The guideline will automatically appear on the home page

### To Add a New Course:
1. Go to LMS Supabase SQL Editor
2. Insert into `lms_courses` table with:
   - `status = 'published'` (lowercase)
   - All required fields (title, slug, excerpt, category, etc.)
3. The course will automatically appear on the home page

## Important: Database Cleanup Needed

There's currently 1 guideline that should be archived:
- **DQ LEAVE GUIDELINES** - Currently has `status = 'Approved'` but should be archived

### To Fix This (RECOMMENDED):
Run this SQL in your Knowledge Hub Supabase SQL Editor:

```sql
-- Archive the leave guidelines
UPDATE guides
SET status = 'Archived'
WHERE slug = 'dq-leave-guidelines';
```

After running this SQL, you can remove the temporary hardcoded exclusion in the code.

## Files Modified

### Main Component
- `src/components/KnowledgeHub.tsx`
  - Fetches from 2 separate Supabase databases
  - Filters Guidelines by type='Guideline' and status='Approved'
  - Filters Learning by status='published'
  - Temporarily excludes 'dq-leave-guidelines' by slug

### Database Scripts
- `db/supabase/04_archive_leave_guidelines.sql` - SQL to archive leave guidelines

### Analysis Scripts
- `check-marketplace-courses.js` - Check LMS courses status
- `check-knowledge-hub-guides.js` - Check Knowledge Hub items
- `check-guidelines-status.js` - Check guideline items specifically

## Environment Variables Required

```env
# Knowledge Hub Database (Guidelines)
VITE_KNOWLEDGE_HUB_SUPABASE_URL=https://jmhtrffmxjxhoxpesubv.supabase.co
VITE_KNOWLEDGE_HUB_SUPABASE_ANON_KEY=...

# LMS Database (Learning Courses)
VITE_LMS_SUPABASE_URL=https://ivfovdutzaejsfbhqdks.supabase.co
VITE_LMS_SUPABASE_ANON_KEY=...
```

## Merging to Develop

When you merge this branch to develop:
1. ✅ All changes will be included
2. ✅ New guidelines with `type='Guideline'` and `status='Approved'` will show automatically
3. ✅ New courses with `status='published'` will show automatically
4. ⚠️ Make sure to run the SQL script to archive "DQ LEAVE GUIDELINES" for cleaner filtering

## Future Improvements

1. **Remove Hardcoded Exclusion**: After running the archive SQL, update the filter to:
   ```typescript
   // Simply filter by type, status already filtered at DB level
   const isGuideline = itemType === 'guideline' || itemType === 'guidelines';
   return isGuideline;
   ```

2. **Add Status Filter at DB Level**: Consider adding status filter in the database query:
   ```typescript
   .eq('status', 'Approved')
   .ilike('type', 'guideline')
   ```

3. **Remove Debug Logs**: Remove console.log statements once everything is working perfectly
