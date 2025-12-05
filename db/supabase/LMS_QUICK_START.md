# LMS Supabase Integration - Quick Start

This is a quick reference guide for setting up the Learning Center with Supabase.

## Quick Setup (5 minutes)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

2. **Add Environment Variables**
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Run Schema Migration**
   - Open Supabase SQL Editor
   - Copy and run `db/supabase/lms_schema.sql`
   - Verify tables are created

4. **Seed Data (Optional)**
   - Copy and run `db/supabase/lms_seed_data.sql`
   - Or migrate existing data from TypeScript

5. **Update Your Code**
   - Replace imports from `src/data/lmsCourseDetails.ts` with `src/services/lmsService.ts`
   - Use hooks from `src/hooks/useLmsCourses.ts`

## File Structure

```
db/supabase/
├── lms_schema.sql          # Database schema
├── lms_seed_data.sql       # Sample data
├── LMS_SETUP_GUIDE.md      # Detailed setup guide
└── LMS_QUICK_START.md      # This file

src/
├── services/
│   └── lmsService.ts       # Supabase service functions
├── hooks/
│   └── useLmsCourses.ts    # React hooks for data fetching
└── types/
    ├── lmsSupabase.ts      # TypeScript types
    └── database.types.ts   # Generated Supabase types
```

## Key Functions

### Fetch All Courses
```typescript
import { fetchAllCourses } from '../services/lmsService';
const courses = await fetchAllCourses();
```

### Fetch Course by Slug
```typescript
import { fetchCourseBySlug } from '../services/lmsService';
const course = await fetchCourseBySlug('dq-essentials');
```

### Use React Hooks
```typescript
import { useLmsCourses, useLmsCourse } from '../hooks/useLmsCourses';

function CoursesPage() {
  const { data: courses, isLoading } = useLmsCourses();
  // ...
}

function CourseDetailPage({ slug }: { slug: string }) {
  const { data: course, isLoading } = useLmsCourse(slug);
  // ...
}
```

## Database Schema

### Main Tables
- `lms_courses` - Main course table
- `lms_reviews` - Course reviews/testimonials
- `lms_case_studies` - Case studies
- `lms_references` - Reference materials
- `lms_faqs` - FAQs (mainly for tracks)

### Curriculum Tables
- `lms_curriculum_items` - Curriculum items (courses/topics)
- `lms_curriculum_topics` - Topics within items
- `lms_curriculum_lessons` - Lessons within topics/items

## Common Issues

1. **"Missing VITE_SUPABASE_URL"**
   - Check `.env` file exists
   - Restart dev server after adding env vars

2. **"RLS policy violation"**
   - Check RLS policies in Supabase
   - Verify you're using anon key for public access

3. **"Table does not exist"**
   - Run schema migration again
   - Check Supabase Table Editor

## Next Steps

1. Read the full [LMS_SETUP_GUIDE.md](./LMS_SETUP_GUIDE.md)
2. Migrate your existing course data
3. Set up authentication (if needed)
4. Configure RLS policies for your use case

## Support

- See [LMS_SETUP_GUIDE.md](./LMS_SETUP_GUIDE.md) for detailed instructions
- Check Supabase documentation: https://supabase.com/docs
- Review the schema in `lms_schema.sql`

