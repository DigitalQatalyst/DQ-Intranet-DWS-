# News Migration to Supabase - READY TO RUN! 🚀

All scripts are generated and ready. Follow these 3 simple steps to migrate your news to Supabase.

## Step 1: Add Columns to Database (2 minutes)

Run this SQL in your **Knowledge Hub Supabase SQL Editor**:

**File**: `db/supabase/05_add_news_columns.sql`

This adds all the columns needed for news items (description, type, date, image_url, etc.)

## Step 2: Insert News Data (5 minutes)

Run this SQL in your **Knowledge Hub Supabase SQL Editor**:

**File**: `db/supabase/06_insert_news_data.sql`

This inserts all 36 news items from your `news.ts` file into the database.

## Step 3: Update Media Center Service (2 minutes)

Replace the content of `src/services/mediaCenterService.ts` with:

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
      .in('type', ['Announcement', 'Thought Leadership', 'Notice', 'Guidelines'])
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      return [];
    }

    // Transform to NewsItem format
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      type: item.type as any,
      date: item.date,
      author: item.author_name || 'DQ',
      byline: item.source,
      views: 0,
      excerpt: item.description || item.summary || '',
      image: item.image_url,
      department: item.category,
      location: item.location as any,
      tags: item.tags || [],
      newsType: item.news_type as any,
      newsSource: item.source as any,
      focusArea: item.focus_area as any,
      content: item.content,
      format: item.format as any,
      readingTime: item.reading_time as any,
      audioUrl: item.audio_url,
    }));
  } catch (err) {
    console.error('Failed to fetch news:', err);
    return [];
  }
}

/**
 * Fetch all job items from local data
 * Returns jobs sorted by posted date (newest first)
 */
export async function fetchAllJobs(): Promise<JobItem[]> {
  const { JOBS } = await import('@/data/media/jobs');
  return [...JOBS].sort((a, b) => {
    const dateA = new Date(a.postedOn).getTime();
    const dateB = new Date(b.postedOn).getTime();
    return dateB - dateA;
  });
}

/**
 * Fetch a single news item by ID from Supabase
 */
export async function fetchNewsById(id: string): Promise<NewsItem | null> {
  try {
    if (!knowledgeHubSupabase) {
      return null;
    }

    const { data, error } = await knowledgeHubSupabase
      .from('v_media_all')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      type: data.type as any,
      date: data.date,
      author: data.author_name || 'DQ',
      byline: data.source,
      views: 0,
      excerpt: data.description || data.summary || '',
      image: data.image_url,
      department: data.category,
      location: data.location as any,
      tags: data.tags || [],
      newsType: data.news_type as any,
      newsSource: data.source as any,
      focusArea: data.focus_area as any,
      content: data.content,
      format: data.format as any,
      readingTime: data.reading_time as any,
      audioUrl: data.audio_url,
    };
  } catch (err) {
    console.error('Failed to fetch news by ID:', err);
    return null;
  }
}

/**
 * Fetch a single job item by ID from local data
 */
export async function fetchJobById(id: string): Promise<JobItem | null> {
  const { JOBS } = await import('@/data/media/jobs');
  return JOBS.find(item => item.id === id) || null;
}
```

## That's It! ✅

After these 3 steps:

✅ **Home Page - Latest Updates**: Shows news from Supabase
✅ **Home Page - Knowledge Hub**: Shows guidelines and courses from Supabase
✅ **Media Center Page**: Shows news from Supabase
✅ **All images**: Work automatically
✅ **All content**: Synced across pages

## What You Get

1. **Single Source of Truth**: All news in one database
2. **No Code Deployments**: Add news via SQL only
3. **Automatic Updates**: Both pages show latest content
4. **Easy Management**: Update once, reflects everywhere

## Adding New News Later

Just run SQL in Supabase:

```sql
INSERT INTO public.guides (
  id, slug, title, description, type, status, date, image_url, source
) VALUES (
  'your-news-id',
  'your-news-slug',
  'Your News Title',
  'News description...',
  'Announcement',
  'Approved',
  '2025-02-27',
  'https://image-url.com/image.jpg',
  'DQ Communications'
);
```

## Files Created

- ✅ `db/supabase/05_add_news_columns.sql` - Adds columns to database
- ✅ `db/supabase/06_insert_news_data.sql` - Inserts all 36 news items
- ✅ `generate-news-sql.js` - Script that generated the SQL
- ✅ `MIGRATE_NEWS_TO_SUPABASE_GUIDE.md` - Detailed guide
- ✅ `NEWS_MIGRATION_READY.md` - This file

## Ready to Go!

Run the SQL files in order (05, then 06), update the service file, and you're done! 🎉
