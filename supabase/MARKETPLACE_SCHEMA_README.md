# Marketplace Database Schema Documentation

This directory contains the complete Supabase schema and seed data for the Marketplace feature, which includes News & Announcements and Job Openings.

## Files Overview

### 1. `marketplace-complete-schema.sql`
Complete database schema that matches the hardcoded data structure from:
- `src/data/media/news.ts` (NewsItem type)
- `src/data/media/jobs.ts` (JobItem type)

**Features:**
- Exact field matching with TypeScript types
- Proper constraints and check constraints for enum values
- Array support for tags, responsibilities, requirements, and benefits
- Comprehensive indexes for optimal querying
- Full-text search indexes
- Row Level Security (RLS) policies
- Helper views for common queries
- Auto-updating timestamps via triggers

### 2. `marketplace-complete-seed.sql`
Seed data file that populates the database with all current hardcoded data:
- All 20 news items from the NEWS array
- All job items from the JOBS array (currently 1 active job)

**Features:**
- Uses `ON CONFLICT` for idempotent inserts (safe to run multiple times)
- Properly escaped SQL strings
- Includes full content for articles that have it
- Preserves all metadata (tags, dates, authors, etc.)

## Database Schema Structure

### News Table (`public.news`)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | text | PRIMARY KEY | Unique identifier (e.g., 'dq-townhall-meeting-agenda') |
| `title` | text | NOT NULL | Article title |
| `type` | text | NOT NULL, CHECK | 'Announcement', 'Guidelines', 'Notice', 'Thought Leadership' |
| `date` | date | NOT NULL | Publication date |
| `author` | text | NOT NULL | Author name |
| `byline` | text | | Optional byline |
| `views` | integer | NOT NULL, DEFAULT 0 | View count |
| `excerpt` | text | NOT NULL | Short description |
| `image` | text | | Image URL |
| `department` | text | | Department name |
| `location` | text | CHECK | 'Dubai', 'Nairobi', 'Riyadh', 'Remote' |
| `domain` | text | CHECK | 'Technology', 'Business', 'People', 'Operations' |
| `theme` | text | CHECK | 'Leadership', 'Delivery', 'Culture', 'DTMF' |
| `tags` | text[] | DEFAULT '{}' | Array of tags |
| `readingTime` | text | CHECK | '<5', '5–10', '10–20', '20+' |
| `newsType` | text | CHECK | 'Corporate Announcements', 'Product / Project Updates', 'Events & Campaigns', 'Digital Tech News' |
| `newsSource` | text | CHECK | 'DQ Leadership', 'DQ Operations', 'DQ Communications' |
| `focusArea` | text | CHECK | 'GHC', 'DWS', 'Culture & People' |
| `content` | text | | Full article content (markdown) |
| `created_at` | timestamptz | NOT NULL, DEFAULT now() | Creation timestamp |
| `updated_at` | timestamptz | NOT NULL, DEFAULT now() | Last update timestamp |

### Jobs Table (`public.jobs`)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | text | PRIMARY KEY | Unique identifier (e.g., 'hr-lead-o2p') |
| `title` | text | NOT NULL | Job title |
| `department` | text | | Department name |
| `roleType` | text | CHECK | 'Tech', 'Design', 'Ops', 'Finance', 'HR' |
| `location` | text | CHECK | 'Dubai', 'Nairobi', 'Riyadh', 'Remote' |
| `type` | text | CHECK | 'Full-time', 'Part-time', 'Contract', 'Intern' |
| `seniority` | text | CHECK | 'Junior', 'Mid', 'Senior', 'Lead' |
| `sfiaLevel` | text | CHECK | 'L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7' |
| `summary` | text | NOT NULL | Job summary |
| `description` | text | | Full job description |
| `responsibilities` | text[] | DEFAULT '{}' | Array of responsibilities |
| `requirements` | text[] | DEFAULT '{}' | Array of requirements |
| `benefits` | text[] | DEFAULT '{}' | Array of benefits |
| `postedOn` | date | NOT NULL | Posting date |
| `applyUrl` | text | | Application URL |
| `image` | text | | Job image URL |
| `created_at` | timestamptz | NOT NULL, DEFAULT now() | Creation timestamp |
| `updated_at` | timestamptz | NOT NULL, DEFAULT now() | Last update timestamp |

## Indexes

### News Indexes
- `idx_news_type` - Filter by article type
- `idx_news_date` - Sort by date (DESC)
- `idx_news_department` - Filter by department
- `idx_news_location` - Filter by location
- `idx_news_domain` - Filter by domain
- `idx_news_news_type` - Filter by news type
- `idx_news_news_source` - Filter by news source
- `idx_news_focus_area` - Filter by focus area
- `idx_news_author` - Filter by author
- `idx_news_tags` - GIN index for array tag searches
- `idx_news_search` - Full-text search index

### Jobs Indexes
- `idx_jobs_posted_on` - Sort by posting date (DESC)
- `idx_jobs_department` - Filter by department
- `idx_jobs_location` - Filter by location
- `idx_jobs_role_type` - Filter by role type
- `idx_jobs_type` - Filter by contract type
- `idx_jobs_seniority` - Filter by seniority
- `idx_jobs_sfia_level` - Filter by SFIA level
- `idx_jobs_search` - Full-text search index

## Row Level Security (RLS)

### News Policies
- **SELECT**: Public read access (anyone can view)
- **INSERT/UPDATE/DELETE**: Authenticated users only

### Jobs Policies
- **SELECT**: Public read access (anyone can view)
- **INSERT/UPDATE/DELETE**: Authenticated users only

*Note: Adjust RLS policies based on your authentication requirements. You may want to restrict INSERT/UPDATE/DELETE to admin roles only.*

## Helper Views

### `news_summary`
Provides a simplified view of news articles with computed fields:
- Includes `has_content` boolean flag
- Excludes full `content` field for performance

### `jobs_summary`
Provides a simplified view of jobs with computed fields:
- Includes counts for responsibilities, requirements, and benefits arrays
- Useful for listing pages

## Functions

### `increment_news_views(news_id text)`
Increments the view count for a news article. Can be called from the frontend when a user views an article.

**Usage:**
```sql
SELECT increment_news_views('dq-townhall-meeting-agenda');
```

### `update_updated_at_column()`
Trigger function that automatically updates the `updated_at` timestamp when a row is modified.

## Installation Instructions

### 1. Run the Schema
```sql
-- In Supabase SQL Editor or via CLI
\i supabase/marketplace-complete-schema.sql
```

### 2. Seed the Data
```sql
-- In Supabase SQL Editor or via CLI
\i supabase/marketplace-complete-seed.sql
```

### 3. Verify Installation
```sql
-- Check news count
SELECT COUNT(*) as news_count FROM public.news;

-- Check jobs count
SELECT COUNT(*) as jobs_count FROM public.jobs;

-- Check news by type
SELECT type, COUNT(*) FROM public.news GROUP BY type;

-- Check jobs by role type
SELECT "roleType", COUNT(*) FROM public.jobs GROUP BY "roleType";
```

## Querying Examples

### Get all announcements
```sql
SELECT * FROM public.news 
WHERE type = 'Announcement' 
ORDER BY date DESC;
```

### Search news by keyword
```sql
SELECT * FROM public.news 
WHERE to_tsvector('english', title || ' ' || excerpt || ' ' || coalesce(content, '')) 
  @@ plainto_tsquery('english', 'townhall')
ORDER BY date DESC;
```

### Get jobs by location and role type
```sql
SELECT * FROM public.jobs 
WHERE location = 'Dubai' 
  AND "roleType" = 'HR'
ORDER BY "postedOn" DESC;
```

### Get news with specific tags
```sql
SELECT * FROM public.news 
WHERE 'townhall' = ANY(tags) 
  OR 'meeting' = ANY(tags)
ORDER BY date DESC;
```

### Get jobs with specific SFIA level
```sql
SELECT * FROM public.jobs 
WHERE "sfiaLevel" = 'L5'
ORDER BY "postedOn" DESC;
```

## Migration from Hardcoded Data

### Frontend Changes Required

1. **Update data fetching** to use Supabase client instead of importing from `src/data/media/`:
   ```typescript
   // Before
   import { NEWS, JOBS } from '@/data/media/news';
   
   // After
   import { supabase } from '@/lib/supabaseClient';
   const { data: news } = await supabase.from('news').select('*');
   const { data: jobs } = await supabase.from('jobs').select('*');
   ```

2. **Update filtering logic** to use Supabase queries:
   ```typescript
   // Example: Filter by type
   const { data } = await supabase
     .from('news')
     .select('*')
     .eq('type', 'Announcement')
     .order('date', { ascending: false });
   ```

3. **Update search** to use full-text search:
   ```typescript
   const { data } = await supabase
     .from('news')
     .select('*')
     .textSearch('title,excerpt,content', searchQuery)
     .order('date', { ascending: false });
   ```

## Data Maintenance

### Adding New News Items
```sql
INSERT INTO public.news (id, title, type, date, author, views, excerpt, ...)
VALUES ('new-item-id', 'New Title', 'Announcement', '2025-01-01', 'Author Name', 0, 'Excerpt...', ...)
ON CONFLICT (id) DO UPDATE SET ...;
```

### Adding New Jobs
```sql
INSERT INTO public.jobs (id, title, department, "roleType", location, type, seniority, "sfiaLevel", summary, "postedOn", ...)
VALUES ('new-job-id', 'Job Title', 'Department', 'Tech', 'Dubai', 'Full-time', 'Senior', 'L4', 'Summary...', '2025-01-01', ...)
ON CONFLICT (id) DO UPDATE SET ...;
```

### Updating View Counts
```sql
SELECT increment_news_views('article-id');
```

## Notes

- The schema uses `text` for IDs to match the current hardcoded structure (e.g., 'dq-townhall-meeting-agenda')
- All enum values are enforced via CHECK constraints
- Array fields (tags, responsibilities, etc.) use PostgreSQL's native array type
- The seed file uses `ON CONFLICT` to make it safe to run multiple times
- Full-text search is enabled for both news and jobs tables
- RLS policies allow public read access but restrict writes to authenticated users

## Troubleshooting

### Issue: "relation already exists"
**Solution**: Drop existing tables first or use `DROP TABLE IF EXISTS` (already included in schema)

### Issue: "permission denied"
**Solution**: Ensure RLS policies are correctly configured and user has appropriate permissions

### Issue: "array type mismatch"
**Solution**: Ensure array fields are properly formatted as PostgreSQL arrays: `ARRAY['tag1', 'tag2']`

### Issue: "check constraint violation"
**Solution**: Verify that enum values match the CHECK constraints (case-sensitive)

## Support

For questions or issues with the schema, please refer to:
- Supabase documentation: https://supabase.com/docs
- PostgreSQL array documentation: https://www.postgresql.org/docs/current/arrays.html
- Supabase RLS documentation: https://supabase.com/docs/guides/auth/row-level-security

