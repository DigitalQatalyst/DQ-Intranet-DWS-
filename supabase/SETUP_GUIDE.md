# Complete Setup Guide for Supabase Integration

## Overview

This guide will help you set up the complete database schema and seed data for the DWS News & Announcements Marketplace, transitioning from hardcoded TypeScript data to Supabase.

## Prerequisites

1. Supabase project created
2. Access to Supabase SQL Editor
3. All source TypeScript files intact (for reference during seed generation)

## Step-by-Step Setup

### Step 1: Run Schema Migration

1. Open your Supabase SQL Editor
2. Copy the entire contents of `supabase/migrations/20250101000000_complete_schema.sql`
3. Paste and execute in the SQL Editor
4. Verify all tables are created:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('news', 'jobs', 'work_units', 'work_positions', 'work_associates', 'employee_profiles', 'marketplace_services');
   ```

### Step 2: Complete Seed Files

#### 2.1 News Seed File (`seed-news.sql`)

The file `seed-news-partial.sql` contains examples. To complete:

1. Open `src/data/media/news.ts`
2. Extract all items from the `NEWS` array (approximately 25+ items)
3. Convert each item to SQL INSERT format following the pattern in `seed-news-partial.sql`
4. Save as `seed-news.sql`

**Key Points:**
- Escape single quotes in strings: `'` → `''`
- Use `ARRAY['tag1', 'tag2']` for tags
- For long content strings, consider using dollar-quoting: `$content$...$content$`

#### 2.2 Marketplace Services Seed File (`seed-marketplace-services.sql`)

The template file shows the structure. Complete by extracting from:

- `src/utils/mockData.ts` - `mockCourses` and `mockOnboardingFlows`
- `src/utils/mockMarketplaceData.ts` - `mockFinancialServices`, `mockNonFinancialServices`, `mockKnowledgeHubItems`

**Service Type Mapping:**
- `service_type = 'course'` for LMS courses
- `service_type = 'financial'` for financial services
- `service_type = 'non-financial'` for technology/business services
- `service_type = 'guide'` for knowledge hub items
- `service_type = 'onboarding'` for onboarding flows

### Step 3: Run Seed Files

Execute seed files in this order:

```sql
-- 1. Jobs (smallest, good for testing)
\i supabase/seed-jobs.sql
-- Or copy/paste contents into SQL Editor

-- 2. Work Directory
\i supabase/seed-work-directory.sql

-- 3. News (after completion)
\i supabase/seed-news.sql

-- 4. Marketplace Services (after completion)
\i supabase/seed-marketplace-services.sql
```

### Step 4: Verify Data

Check that data was inserted:

```sql
-- Count records
SELECT 'news' as table_name, COUNT(*) as count FROM public.news
UNION ALL
SELECT 'jobs', COUNT(*) FROM public.jobs
UNION ALL
SELECT 'work_units', COUNT(*) FROM public.work_units
UNION ALL
SELECT 'work_associates', COUNT(*) FROM public.work_associates
UNION ALL
SELECT 'marketplace_services', COUNT(*) FROM public.marketplace_services;

-- Sample queries
SELECT id, title, type, date FROM public.news ORDER BY date DESC LIMIT 5;
SELECT id, title, department, location FROM public.jobs;
SELECT id, title, service_type FROM public.marketplace_services LIMIT 10;
```

### Step 5: Update Application Code

#### 5.1 Update Service Files

Modify `src/services/mediaCenterService.ts`:

```typescript
// OLD (hardcoded)
import { NEWS } from '@/data/media/news';
import { JOBS } from '@/data/media/jobs';

// NEW (Supabase)
import { supabaseClient } from '@/lib/supabaseClient';

export async function fetchAllNews(): Promise<NewsItem[]> {
  const { data, error } = await supabaseClient
    .from('news')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  
  // Transform Supabase data to NewsItem format
  return data.map(item => ({
    id: item.id,
    title: item.title,
    type: item.type,
    date: item.date,
    // ... map all fields
  }));
}
```

#### 5.2 Comment Out Hardcoded Data

Temporarily comment out hardcoded imports:

```typescript
// import { NEWS } from '@/data/media/news'; // TODO: Remove after Supabase migration
// import { JOBS } from '@/data/media/jobs'; // TODO: Remove after Supabase migration
```

#### 5.3 Test Thoroughly

1. Test all pages that use news/jobs/marketplace data
2. Verify filtering and search functionality
3. Check that all fields are correctly mapped
4. Test with empty database (no data) to ensure error handling

### Step 6: Final Cleanup (After Verification)

Once everything works:

1. Remove commented-out hardcoded imports
2. Delete hardcoded data files (or move to archive)
3. Update documentation

## Schema Field Mappings

### NewsItem → news table
- `id` → `id`
- `title` → `title`
- `type` → `type`
- `date` → `date`
- `author` → `author`
- `byline` → `byline`
- `views` → `views`
- `excerpt` → `excerpt`
- `image` → `image`
- `department` → `department`
- `location` → `location`
- `domain` → `domain`
- `theme` → `theme`
- `tags` → `tags` (TEXT[])
- `readingTime` → `reading_time`
- `newsType` → `news_type`
- `newsSource` → `news_source`
- `focusArea` → `focus_area`
- `content` → `content`
- `format` → `format`
- `source` → `source`
- `audioUrl` → `audio_url`

### JobItem → jobs table
- All fields map directly (camelCase → snake_case)

### Marketplace Services
- Unified table structure accommodates all service types
- Use `service_type` to distinguish between courses, financial, etc.
- Flexible `metadata` JSONB field for type-specific data

## Troubleshooting

### Issue: SQL syntax errors
- Check string escaping (single quotes)
- Verify array syntax: `ARRAY['item1', 'item2']`
- Ensure date formats: `'YYYY-MM-DD'`

### Issue: Data not showing in application
- Verify RLS policies allow read access
- Check Supabase client configuration
- Ensure field mappings are correct
- Check browser console for errors

### Issue: Performance concerns
- Add appropriate indexes (already in schema)
- Consider pagination for large datasets
- Use `.select()` to limit fields returned

## Next Steps

1. Complete seed files using the templates and instructions
2. Run seed files in Supabase
3. Update application code to use Supabase
4. Test thoroughly
5. Deploy to production

## Support

For issues or questions:
1. Check `GENERATE_SEEDS_INSTRUCTIONS.md` for seed generation help
2. Review `README.md` for schema overview
3. Verify your seed files match the TypeScript source data exactly

