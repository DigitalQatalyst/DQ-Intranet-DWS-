# Migrate News to Supabase - Step by Step Guide

You have 36 news items in `src/data/media/news.ts` that need to be migrated to Knowledge Hub Supabase so they appear on both the Home page and Media Center page.

## Step 1: Add Required Columns to Database

Run this SQL in your **Knowledge Hub Supabase SQL Editor**:

```sql
-- File: db/supabase/05_add_news_columns.sql
-- This adds all columns needed for news/media items

ALTER TABLE public.guides 
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS type TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS date DATE,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS author_name TEXT,
  ADD COLUMN IF NOT EXISTS news_type TEXT,
  ADD COLUMN IF NOT EXISTS focus_area TEXT,
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS reading_time TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS format TEXT,
  ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS guides_type_idx ON public.guides (type);
CREATE INDEX IF NOT EXISTS guides_category_idx ON public.guides (category);
CREATE INDEX IF NOT EXISTS guides_date_idx ON public.guides (date);

-- Update the view
DROP VIEW IF EXISTS public.v_media_all;
CREATE OR REPLACE VIEW public.v_media_all AS
SELECT 
  id, slug, title, description, summary, excerpt, body, content,
  type, category, domain, guide_type, function_area, status,
  date, image_url, image, source, author_name, tags,
  news_type, focus_area, reading_time, location, format, audio_url,
  created_at, updated_at
FROM public.guides
WHERE status = 'Approved'
ORDER BY date DESC NULLS LAST, created_at DESC;

GRANT SELECT ON public.v_media_all TO anon, authenticated;
```

## Step 2: Option A - Manual Migration (Recommended for First Time)

Insert a few news items manually to test:

```sql
-- Example: Insert one news item
INSERT INTO public.guides (
  id, slug, title, description, type, category, status, date,
  image_url, source, author_name, tags, news_type, focus_area, content
) VALUES (
  'dxb-eoy-event-postponement',
  'dxb-eoy-event-postponement',
  'DXB EoY Event Postponement',
  'Due to unfavourable weather conditions, the DQ Studios Y/E Annual Gathering scheduled for 19.12.2025 has been rescheduled for everyone''s safety.',
  'Announcement',
  'Operations',
  'Approved',
  '2025-12-19',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  'DQ Operations',
  'Fadil A',
  ARRAY['event', 'postponement', 'annual gathering', 'weather'],
  'Company News',
  'Culture & People',
  '# DXB EoY Event Postponement

Due to unfavourable weather conditions, the DQ Studios Y/E Annual Gathering scheduled for 19.12.2025 has been rescheduled for everyone''s safety.

We sincerely apologise for the inconvenience and appreciate your understanding.'
);
```

## Step 3: Option B - Bulk Migration Script

I've created `migrate-news-to-supabase.js` but it needs the TypeScript file to be converted. 

**Easier approach**: Use a tool like [this online converter](https://transform.tools/typescript-to-javascript) to convert `src/data/media/news.ts` to JSON, then create INSERT statements.

## Step 4: Update Media Center to Use Supabase

Once news is in Supabase, update the Media Center service:

### File: `src/services/mediaCenterService.ts`

```typescript
import { knowledgeHubSupabase } from '@/services/knowledgeHubClient';
import type { NewsItem } from '@/data/media/news';
import type { JobItem } from '@/data/media/jobs';

/**
 * Fetch all news items from Knowledge Hub Supabase
 * Returns news sorted by date (newest first)
 */
export async function fetchAllNews(): Promise<NewsItem[]> {
  try {
    if (!knowledgeHubSupabase) {
      console.warn('Knowledge Hub Supabase not available');
      return [];
    }

    const { data, error } = await knowledgeHubSupabase
      .from('v_media_all')
      .select('*')
      .in('type', ['Announcement', 'Thought Leadership', 'Notice'])
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      return [];
    }

    // Transform to NewsItem format
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      date: item.date,
      author: item.author_name || 'DQ',
      byline: item.source,
      views: 0,
      excerpt: item.description || item.summary || '',
      image: item.image_url,
      department: item.category,
      location: item.location,
      tags: item.tags || [],
      newsType: item.news_type,
      newsSource: item.source,
      focusArea: item.focus_area,
      content: item.content,
      format: item.format,
      readingTime: item.reading_time,
      audioUrl: item.audio_url,
    }));
  } catch (err) {
    console.error('Failed to fetch news:', err);
    return [];
  }
}

// Keep jobs as-is for now (or migrate separately)
export async function fetchAllJobs(): Promise<JobItem[]> {
  const { JOBS } = await import('@/data/media/jobs');
  return [...JOBS].sort((a, b) => {
    const dateA = new Date(a.postedOn).getTime();
    const dateB = new Date(b.postedOn).getTime();
    return dateB - dateA;
  });
}
```

## Step 5: Test Everything

1. **Home Page - Latest Updates**: Should show news from Supabase
2. **Home Page - Knowledge Hub**: Should show guidelines and courses
3. **Media Center Page**: Should show news from Supabase

## Benefits After Migration

✅ Single source of truth for all news
✅ Add news via Supabase SQL Editor (no code deployment)
✅ Both Home page and Media Center show same content
✅ Images, tags, categories all work automatically
✅ Easy to manage and update content

## Quick Start (Recommended)

1. Run `db/supabase/05_add_news_columns.sql` in Supabase
2. Manually insert 2-3 news items to test
3. Verify they show on Home page
4. Update `mediaCenterService.ts` to fetch from Supabase
5. Verify Media Center page works
6. Bulk insert remaining news items

## Need Help?

If you want me to:
- Generate SQL INSERT statements for all 36 news items
- Create a different migration approach
- Help with any step

Just let me know!
