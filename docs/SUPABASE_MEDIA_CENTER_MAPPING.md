# Supabase Media Center Marketplace - Field Mapping Guide

## Overview
This document ensures all fields used in the Media Center details page are properly mapped from the Supabase `news` table.

## Current Supabase Schema
**Table:** `public.news`

```sql
CREATE TABLE public.news (
  id text PRIMARY KEY,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('Announcement', 'Guidelines', 'Notice', 'Thought Leadership')),
  date timestamptz NOT NULL,
  author text NOT NULL,
  byline text,
  views integer NOT NULL DEFAULT 0,
  excerpt text NOT NULL,
  image text,
  department text,
  location text CHECK (location IN ('Dubai', 'Nairobi', 'Riyadh', 'Remote')),
  domain text CHECK (domain IN ('Technology', 'Business', 'People', 'Operations')),
  theme text CHECK (theme IN ('Leadership', 'Delivery', 'Culture', 'DTMF')),
  tags text[],
  "readingTime" text CHECK ("readingTime" IN ('<5', '5–10', '10–20', '20+')),
  "newsType" text CHECK ("newsType" IN ('Corporate Announcements', 'Product / Project Updates', 'Events & Campaigns', 'Digital Tech News')),
  "newsSource" text CHECK ("newsSource" IN ('DQ Leadership', 'DQ Operations', 'DQ Communications')),
  "focusArea" text CHECK ("focusArea" IN ('GHC', 'DWS', 'Culture & People')),
  content text, -- Full article content for detail page
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

## Field Mapping: Supabase → Component

### Header Section

| UI Element | Supabase Column | Component Property | Used In |
|------------|----------------|-------------------|---------|
| Category Tag | `type` | `article.type` | Header (blue pill tag) |
| Date | `date` | `article.date` | Header (with calendar icon) |
| Title | `title` | `article.title` | Header (main title) |
| Author Initials | `author`, `byline`, `newsSource`, `department` | `displayAuthor`, `getAuthorInitials()` | Header (circular icon) |
| Author Name | `author` | `article.author` | Header (below icon) |
| Author Org | `newsSource` or `department` | `article.newsSource` or `article.department` | Header (below icon) |
| Hero Image | `image` | `article.image` | Header (if available) |

### Content Section

| UI Element | Supabase Column | Component Property | Used In |
|------------|----------------|-------------------|---------|
| Overview Paragraphs | `content`, `excerpt` | `article.content`, `article.excerpt` | `buildOverview()` function |
| Content Body | `content` | `article.content` | Article body (4-paragraph overview) |

### COMPANY NEWS DETAILS Section

| UI Element | Supabase Column | Component Property | Used In |
|------------|----------------|-------------------|---------|
| Announcement Date | `date` | `article.date` | COMPANY NEWS DETAILS (formatted) |
| Relevant Contact | `author` | `displayAuthor` | COMPANY NEWS DETAILS (author name) |
| Department | `department` or `domain` | `article.department` or `article.domain` | COMPANY NEWS DETAILS |

### NEXT STEPS Section

| UI Element | Supabase Column | Component Property | Used In |
|------------|----------------|-------------------|---------|
| Read Full Policy Button | `content` (if available) | `article.content` | NEXT STEPS (button action) |

### Engagement Metrics

| UI Element | Supabase Column | Component Property | Used In |
|------------|----------------|-------------------|---------|
| Likes | **Not in schema** | Mock: `47` | Engagement section |
| Comments | **Not in schema** | Mock: `12` | Engagement section |
| Views | `views` | `article.views` | Not currently displayed (available) |

### Related Announcements Sidebar

| UI Element | Supabase Column | Component Property | Used In |
|------------|----------------|-------------------|---------|
| Related Article Title | `title` | `item.title` | Related cards |
| Related Article Type | `type` | `item.type` | Related cards (tag color) |
| Related Article Date | `date` | `item.date` | Related cards |

### Questions Section

| UI Element | Supabase Column | Component Property | Used In |
|------------|----------------|-------------------|---------|
| Contact Person | `author` | `displayAuthor` | Questions section |

## Data Service Mapping

**File:** `src/services/mediaCenterService.ts`

```typescript
// Current implementation fetches all columns with select('*')
export async function fetchNewsById(id: string): Promise<NewsItem | null> {
  const { data, error } = await mediaSupabaseClient
    .from('news')
    .select('*')  // ✅ Fetches all columns
    .eq('id', id)
    .limit(1)
  
  return row ? (row as NewsItem) : null
}
```

**Status:** ✅ The service already fetches all columns using `select('*')`, so all fields are available.

## Component Usage Verification

### Fields Used in NewsDetailPage:

1. ✅ `article.id` - For routing and identification
2. ✅ `article.title` - Main title (with special case handling)
3. ✅ `article.type` - Category tag
4. ✅ `article.date` - Announcement date
5. ✅ `article.author` - Author name (for displayAuthor)
6. ✅ `article.byline` - Alternative author (for Thought Leadership)
7. ✅ `article.newsSource` - Author organization
8. ✅ `article.department` - Department info
9. ✅ `article.domain` - Alternative department
10. ✅ `article.image` - Hero image
11. ✅ `article.content` - Full content (for overview generation)
12. ✅ `article.excerpt` - Summary text
13. ✅ `article.views` - View count (available but not displayed)
14. ✅ `article.tags` - Tags (available but not displayed in details page)
15. ✅ `article.readingTime` - Reading time (available but not displayed)
16. ✅ `article.newsType` - News type (available but not displayed)
17. ✅ `article.focusArea` - Focus area (available but not displayed)
18. ✅ `article.location` - Location (available but not displayed)

## Schema Verification Checklist

### Required Fields (Used in Details Page):
- ✅ `id` - Used for fetching and routing
- ✅ `title` - Main title display
- ✅ `type` - Category tag
- ✅ `date` - Announcement date
- ✅ `author` - Author name (Relevant Contact)
- ✅ `byline` - Alternative author for Thought Leadership
- ✅ `newsSource` - Author organization
- ✅ `department` - Department info
- ✅ `domain` - Alternative department
- ✅ `image` - Hero image
- ✅ `content` - Full content for overview
- ✅ `excerpt` - Summary text

### Optional Fields (Available but not displayed):
- ✅ `views` - View count (available for future use)
- ✅ `tags` - Tags (available for future use)
- ✅ `readingTime` - Reading time (available for future use)
- ✅ `newsType` - News type (available for future use)
- ✅ `focusArea` - Focus area (available for future use)
- ✅ `location` - Location (available for future use)
- ✅ `theme` - Theme (available for future use)

## Special Title Handling

The component includes special title transformations for specific articles:

```typescript
// Title transformations applied in both NewsCard and NewsDetailPage:
- 'dq-scrum-master-structure-update' → 'Updated Scrum Master Structure'
- 'dq-townhall-meeting-agenda' → 'DQ Townhall Meeting'
- 'company-wide-lunch-break-schedule' → 'Company-Wide Lunch Break Schedule'
- 'grading-review-program-grp' → 'Grading Review Program (GRP)'
```

## Data Flow

```
Supabase Database (news table)
    ↓
mediaCenterService.fetchNewsById()
    ↓
NewsItem type (TypeScript interface)
    ↓
NewsDetailPage component
    ↓
UI Display (with field mappings)
```

## Verification Steps

1. ✅ **Schema Check**: All required fields exist in `marketplace-schema.sql`
2. ✅ **Service Check**: `fetchNewsById` uses `select('*')` to fetch all columns
3. ✅ **Type Check**: `NewsItem` interface matches Supabase columns
4. ✅ **Component Check**: All fields are properly mapped in NewsDetailPage

## Missing Fields (Future Enhancements)

If you want to add engagement metrics from the database:

```sql
-- Add to news table if needed:
ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments integer DEFAULT 0;
```

## Summary

✅ **All required fields are present in the Supabase schema**
✅ **Service fetches all columns with `select('*')`**
✅ **Component properly maps all fields**
✅ **Ready for Supabase integration**

The current schema in `supabase/marketplace-schema.sql` contains all necessary fields for the Media Center details page. You can run this schema directly in Supabase without any modifications.

















