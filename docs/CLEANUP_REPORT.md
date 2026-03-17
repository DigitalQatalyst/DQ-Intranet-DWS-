# Codebase Cleanup Report - Work Directory Branch

## Analysis Date
2025-12-05

## Branch
`feature/-work-directory`

## Files KEPT (Work Directory Related)

### Core Work Directory Files
- `src/pages/DQWorkDirectoryPage.tsx`
- `src/pages/WorkPositionProfilePage.tsx`
- `src/pages/UnitProfilePage.tsx`
- `src/hooks/useWorkDirectory.ts`
- `src/api/workDirectory.ts`
- `src/data/workDirectoryTypes.ts`

### Work Directory Components
- `src/components/work-directory/AssociateProfileModal.tsx`
- `src/components/work-directory/PositionHero.tsx`
- `src/components/work-directory/unitStyles.ts`
- `src/components/work-directory/WorkDirectoryOverview.tsx`

### Work Directory SQL Files
- `supabase/work-directory-schema.sql`
- `supabase/work-directory-seed.sql`
- `supabase/work-directory-positions-from-adp.sql`
- `supabase/fix-work-positions-department.sql`
- `supabase/WORK_DIRECTORY_SETUP.md`

### Work Directory Scripts
- `scripts/check-work-directory-tables.js`
- `scripts/setup-work-directory.js`
- `scripts/inspect-existing-tables.js`
- `scripts/fix-work-directory-rls.sql`
- `scripts/review-position-locations.sql`
- `scripts/update-position-locations.sql`

### Shared Components (Used by Work Directory)
- `src/components/associates/AssociateCard.tsx`
- `src/components/marketplace/FilterSidebar.tsx`
- `src/components/SearchBar.tsx`
- `src/components/SimpleTabs.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/Directory/unitIcons.ts`

### Core Infrastructure
- `src/lib/supabaseClient.ts`
- `src/AppRouter.tsx` (contains work-directory routes)

## Files REMOVED (Unrelated to Work Directory)

### Marketplace Schema Files (7 files)
- ✅ `supabase/marketplace-schema.sql`
- ✅ `supabase/marketplace-complete-schema.sql`
- ✅ `supabase/marketplace-complete-seed.sql`
- ✅ `supabase/marketplace-services-schema.sql`
- ✅ `supabase/seed-marketplace.sql`
- ✅ `supabase/MARKETPLACE_SCHEMA_README.md`
- ✅ `supabase/setup-marketplace.md`

### LMS Schema Files (4 files)
- ✅ `supabase/lms-rls-policies.sql`
- ✅ `supabase/make-lms-tables-unrestricted.sql`
- ✅ `supabase/verify-lms-rls.sql`
- ✅ `supabase/LMS_RLS_FIX.md`

### DQ DNA Schema Files (2 files)
- ✅ `supabase/schema.sql` (DQ DNA/6x Digital View schema)
- ✅ `supabase/seed.sql` (News & Announcements seed)

### Other Unrelated Files (5 files)
- ✅ `supabase/check-table-permissions.sql` (generic)
- ✅ `supabase/verify-rls.sql` (generic)
- ✅ `supabase/RLS_EXPLANATION.md` (generic)
- ✅ `supabase/MAKE_UNRESTRICTED_UI.md` (LMS related)
- ✅ `supabase/README.md` (DQ DNA setup guide)

### Migration Files (4 files)
- ✅ `supabase/migrations/20251029091752_remote_commit.sql` (full DB dump)
- ✅ `supabase/migrations/create_news_schema.sql` (News marketplace)
- ✅ `supabase/migrations/create-job-applications-table.sql` (Jobs marketplace)
- ✅ `supabase/migrations/add_image_url_to_dq_tables.sql` (DQ DNA)
- ✅ `supabase/migrations/` (empty directory removed)

### Documentation Files (5 files)
- ✅ `docs/COMMUNITIES_SUPABASE_IMPLEMENTATION.md`
- ✅ `docs/NEWS_DETAIL_PAGE_UPDATE.md`
- ✅ `docs/NEWS_PAGE_UPDATE.md`
- ✅ `docs/NEWS_SCHEMA_README.md`
- ✅ `docs/DQ_SCHEMA_UPDATE_SUMMARY.md`
- ✅ `docs/guides/` (entire directory - guides marketplace docs)

### Scripts Directory Cleanup (400+ files removed)

**Scripts KEPT (7 files):**
- ✅ `check-work-directory-tables.js` - Verify tables exist
- ✅ `setup-work-directory.js` - Interactive setup
- ✅ `inspect-existing-tables.js` - Inspect Supabase tables
- ✅ `fix-work-directory-rls.sql` - Fix RLS policies
- ✅ `review-position-locations.sql` - Review position locations
- ✅ `update-position-locations.sql` - Update position locations
- ✅ `check-env.js` - Generic utility for env checks

**Scripts REMOVED (400+ files):**
- ❌ All guides/marketplace scripts (200+ files)
- ❌ All DQ DNA/6x Digital View scripts (50+ files)
- ❌ All LMS migration scripts (3 files)
- ❌ All image/content management scripts (100+ files)
- ❌ All testimonial scripts (20+ files)
- ❌ All strategy/content scripts (50+ files)
- ❌ QA directory with guides RPC scripts (2 files)
- ❌ LMS migration documentation (1 file)

## Summary

**Total Files Removed: 427+ files + 2 directories**

- 7 Marketplace schema/documentation files
- 4 LMS schema/documentation files
- 2 DQ DNA schema files
- 5 Generic/other Supabase files
- 4 Migration files
- 5 Documentation files
- 400+ Unrelated scripts
- 1 Empty directory (migrations/)
- 1 QA directory (guides-related)

## Notes

- Shared components like `FilterSidebar`, `SearchBar`, etc. are kept because they're used by work-directory
- The `marketplace` folder in components is kept because `FilterSidebar` is used
- Core infrastructure files are kept
- Only schema/documentation files clearly unrelated to work-directory are removed

