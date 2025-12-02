# Learning Management System (LMS) - Supabase Integration

This directory contains all the files needed to set up the Learning Center with Supabase as the database backend.

## Files

- **`lms_schema.sql`** - Complete database schema with tables, indexes, triggers, and RLS policies
- **`lms_seed_data.sql`** - Sample data for testing (template)
- **`LMS_SETUP_GUIDE.md`** - Detailed setup instructions
- **`LMS_QUICK_START.md`** - Quick reference guide

## Quick Start

1. **Set up Supabase project** (see [LMS_SETUP_GUIDE.md](./LMS_SETUP_GUIDE.md))
2. **Run schema migration** (copy and run `lms_schema.sql` in Supabase SQL Editor)
3. **Seed data** (copy and run `lms_seed_data.sql` or migrate your existing data)
4. **Update your code** to use `src/services/lmsService.ts` instead of `src/data/lmsCourseDetails.ts`

## Schema Overview

The schema includes:

### Main Tables
- `lms_courses` - Main course table with all metadata
- `lms_reviews` - User reviews/testimonials
- `lms_case_studies` - Case studies
- `lms_references` - Reference materials
- `lms_faqs` - FAQs (mainly for tracks)

### Curriculum Tables
- `lms_curriculum_items` - Curriculum items (courses in tracks, topics in multi-lesson courses)
- `lms_curriculum_topics` - Topics within curriculum items
- `lms_curriculum_lessons` - Lessons within topics or directly in curriculum items

### Features
- **Row Level Security (RLS)** - Public read access, authenticated users can create reviews
- **Automatic triggers** - Update review counts and ratings automatically
- **Indexes** - Optimized for common queries
- **Views** - Helper views for aggregated data

## Usage

### In Your Components

```typescript
import { useLmsCourses, useLmsCourse } from '../hooks/useLmsCourses';

// Fetch all courses
const { data: courses, isLoading } = useLmsCourses();

// Fetch single course
const { data: course } = useLmsCourse('dq-essentials');
```

### Service Functions

```typescript
import { fetchAllCourses, fetchCourseBySlug } from '../services/lmsService';

// Fetch all courses
const courses = await fetchAllCourses();

// Fetch course by slug
const course = await fetchCourseBySlug('dq-essentials');
```

## Data Migration

To migrate existing TypeScript data:

1. **Export data** from `src/data/lmsCourseDetails.ts`
2. **Convert to SQL** INSERT statements
3. **Run in Supabase** SQL Editor

Or use the migration script (see `scripts/migrate-lms-data.js`).

## Type Safety

TypeScript types are available in:
- `src/types/lmsSupabase.ts` - Manual type definitions
- `src/types/database.types.ts` - Generated Supabase types (placeholder)

To generate actual types from your database:
```bash
supabase gen types typescript --project-id your_project_id > src/types/database.types.ts
```

## Next Steps

1. Read [LMS_SETUP_GUIDE.md](./LMS_SETUP_GUIDE.md) for detailed instructions
2. Set up your Supabase project
3. Run the schema migration
4. Migrate your existing data
5. Update your components to use the new service

## Support

- Check [LMS_SETUP_GUIDE.md](./LMS_SETUP_GUIDE.md) for troubleshooting
- Review Supabase documentation: https://supabase.com/docs
- Check the schema file for table structure
