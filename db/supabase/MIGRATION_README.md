# LMS Data Migration to Supabase

This directory contains scripts to migrate LMS course data from TypeScript to Supabase PostgreSQL database.

## Files

- **`migrate_lms_data.sql`** - PostgreSQL DDL schema definition (creates tables, indexes, triggers)
- **`scripts/migrate-lms-data-to-supabase.ts`** - TypeScript script to generate SQL INSERT statements from `lmsCourseDetails.ts`

## Schema Overview

The migration creates 4 normalized tables:

1. **`courses`** - Main course/track details
2. **`curriculum_items`** - Top level curriculum items (courses in bundles, or topic groups in multi-lesson courses)
3. **`topics`** - Topics nested under curriculum items
4. **`lessons`** - Final content units (can be under topics or directly under curriculum items)

## Usage

### Step 1: Create Schema

Run the DDL script to create tables:

```bash
psql -h <your-supabase-host> -U <user> -d <database> -f db/supabase/migrate_lms_data.sql
```

Or via Supabase CLI:

```bash
supabase db execute -f db/supabase/migrate_lms_data.sql
```

### Step 2: Generate INSERT Statements

Generate SQL INSERT statements from your TypeScript data:

```bash
npx tsx scripts/migrate-lms-data-to-supabase.ts > db/supabase/migrate_lms_data_inserts.sql
```

### Step 3: Populate Data

Run the generated INSERT statements:

```bash
psql -h <your-supabase-host> -U <user> -d <database> -f db/supabase/migrate_lms_data_inserts.sql
```

Or via Supabase CLI:

```bash
supabase db execute -f db/supabase/migrate_lms_data_inserts.sql
```

## Table Structure

### courses

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PRIMARY KEY | Unique course identifier |
| slug | TEXT UNIQUE | URL-friendly identifier |
| title | TEXT | Course title |
| provider | TEXT | Course provider |
| category | TEXT | Course category (from courseCategory) |
| delivery_mode | TEXT | Delivery mode |
| duration | TEXT | Duration label |
| level_code | TEXT | SFIA level code |
| department | TEXT[] | Array of departments |
| locations | TEXT[] | Array of locations |
| audience | TEXT[] | Array of audience types |
| status | TEXT | Course status (live/coming-soon) |
| summary | TEXT | Course summary |
| highlights | TEXT[] | Array of highlights |
| outcomes | TEXT[] | Array of learning outcomes |
| course_type | TEXT | Course type (Bundles/Multi-Lessons/Single Lesson) |
| track | TEXT | Track name (for bundles) |
| rating | DECIMAL(3,2) | Average rating |
| review_count | INTEGER | Number of reviews |
| testimonials | JSONB | Testimonials/reviews array |
| case_studies | JSONB | Case studies array |
| references | JSONB | References array |
| faq | JSONB | FAQ array |

### curriculum_items

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PRIMARY KEY | Unique curriculum item identifier |
| course_id | TEXT FOREIGN KEY | Parent course ID |
| title | TEXT | Curriculum item title |
| description | TEXT | Optional description |
| duration | TEXT | Optional duration |
| item_order | INTEGER | Display order |
| is_locked | BOOLEAN | Lock status |
| course_slug | TEXT | Link to course page (for bundles) |

### topics

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PRIMARY KEY | Unique topic identifier |
| curriculum_item_id | TEXT FOREIGN KEY | Parent curriculum item ID |
| title | TEXT | Topic title |
| description | TEXT | Optional description |
| duration | TEXT | Optional duration |
| topic_order | INTEGER | Display order |
| is_locked | BOOLEAN | Lock status |

### lessons

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PRIMARY KEY | Unique lesson identifier |
| topic_id | TEXT FOREIGN KEY | Parent topic ID (one of topic_id or curriculum_item_id must be set) |
| curriculum_item_id | TEXT FOREIGN KEY | Parent curriculum item ID (for single lesson courses) |
| title | TEXT | Lesson title |
| description | TEXT | Optional description |
| duration | TEXT | Optional duration |
| type | TEXT | Lesson type (video/guide/quiz/workshop/assignment/reading) |
| lesson_order | INTEGER | Display order |
| is_locked | BOOLEAN | Lock status |

## Data Normalization

The migration handles three course types:

1. **Course (Bundles)** - Tracks
   - `curriculum_items` represent courses within the track
   - Each course has `topics`
   - Each topic has `lessons`

2. **Course (Multi-Lessons)** - Multi-topic courses
   - `curriculum_items` represent topic groups/sections
   - Each item has `topics`
   - Each topic has `lessons`

3. **Course (Single Lesson)** - Single lesson courses
   - `curriculum_items` contain `lessons` directly
   - No topics needed

## Verification

After migration, verify data:

```sql
-- Count records
SELECT 
  (SELECT COUNT(*) FROM courses) as courses,
  (SELECT COUNT(*) FROM curriculum_items) as curriculum_items,
  (SELECT COUNT(*) FROM topics) as topics,
  (SELECT COUNT(*) FROM lessons) as lessons;

-- Check relationships
SELECT 
  c.title,
  COUNT(DISTINCT ci.id) as curriculum_items,
  COUNT(DISTINCT t.id) as topics,
  COUNT(DISTINCT l.id) as lessons
FROM courses c
LEFT JOIN curriculum_items ci ON ci.course_id = c.id
LEFT JOIN topics t ON t.curriculum_item_id = ci.id
LEFT JOIN lessons l ON (l.topic_id = t.id OR l.curriculum_item_id = ci.id)
GROUP BY c.id, c.title
ORDER BY c.title;
```

## Notes

- All foreign keys have `ON DELETE CASCADE` to maintain referential integrity
- `updated_at` columns are automatically updated via triggers
- Array and JSONB fields are properly escaped in SQL
- The migration script handles null/undefined values gracefully

