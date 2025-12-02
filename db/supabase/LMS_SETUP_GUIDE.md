# Learning Management System (LMS) - Supabase Setup Guide

This guide will help you set up the Learning Center with Supabase as the database backend.

## Prerequisites

1. A Supabase project (create one at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Access to your Supabase project dashboard

## Step 1: Set Up Supabase Project

1. **Create a new Supabase project** (or use an existing one)
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details (name, database password, region)
   - Wait for the project to be provisioned

2. **Get your Supabase credentials**
   - Go to Project Settings → API
   - Copy the following:
     - `Project URL` (this is your `VITE_SUPABASE_URL`)
     - `anon public` key (this is your `VITE_SUPABASE_ANON_KEY`)
     - `service_role` key (this is your `SUPABASE_SERVICE_ROLE_KEY` - keep this secret!)

## Step 2: Configure Environment Variables

1. **Create a `.env` file** in the project root (if it doesn't exist)

2. **Add the following environment variables:**

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

3. **For Vercel deployment:**
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add the same variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)

## Step 3: Run Database Schema Migration

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Click "New Query"

2. **Run the schema migration**
   - Copy the contents of `db/supabase/lms_schema.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute the migration
   - Verify that all tables, indexes, triggers, and RLS policies were created

3. **Verify the schema**
   - Go to Table Editor in Supabase dashboard
   - You should see the following tables:
     - `lms_courses`
     - `lms_reviews`
     - `lms_case_studies`
     - `lms_references`
     - `lms_faqs`
     - `lms_curriculum_items`
     - `lms_curriculum_topics`
     - `lms_curriculum_lessons`

## Step 4: Seed Initial Data

1. **Option A: Use the seed data script (recommended for testing)**
   - Copy the contents of `db/supabase/lms_seed_data.sql`
   - Paste into the SQL Editor
   - Click "Run" to insert sample data

2. **Option B: Migrate existing TypeScript data**
   - Use the migration script (see Step 5)
   - This will convert your existing `lmsCourseDetails.ts` data to SQL inserts

## Step 5: Migrate Existing Data (Optional)

If you have existing course data in `src/data/lmsCourseDetails.ts`, you can migrate it to Supabase:

1. **Run the migration script:**
   ```bash
   npm run db:migrate:lms
   ```

   Note: You may need to create this script. See `scripts/migrate-lms-data.js` for an example.

2. **Or manually convert the data:**
   - Export your course data from `lmsCourseDetails.ts`
   - Convert it to SQL INSERT statements
   - Run the SQL in Supabase SQL Editor

## Step 6: Update Your Application Code

1. **Update components to use Supabase service:**
   - Replace imports from `src/data/lmsCourseDetails.ts` with `src/services/lmsService.ts`
   - Update `LmsCourses.tsx` to use `fetchAllCourses()` and `fetchCoursesByFilters()`
   - Update `LmsCourseDetailPage.tsx` to use `fetchCourseBySlug()`

2. **Example usage:**
   ```typescript
   import { fetchAllCourses, fetchCourseBySlug } from '../services/lmsService';
   
   // In your component
   const courses = await fetchAllCourses();
   const course = await fetchCourseBySlug('dq-essentials');
   ```

3. **Use React Query for data fetching (recommended):**
   ```typescript
   import { useQuery } from '@tanstack/react-query';
   import { fetchAllCourses } from '../services/lmsService';
   
   function CoursesPage() {
     const { data: courses, isLoading } = useQuery({
       queryKey: ['courses'],
       queryKey: () => fetchAllCourses(),
     });
     
     if (isLoading) return <div>Loading...</div>;
     return <div>{/* Render courses */}</div>;
   }
   ```

## Step 7: Test the Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the Learning Center:**
   - Go to `/lms` in your browser
   - Verify that courses are loaded from Supabase
   - Test filtering and search functionality
   - Test course detail pages

3. **Check the browser console:**
   - Look for any errors related to Supabase
   - Verify that API calls are being made correctly

## Step 8: Set Up Row Level Security (RLS)

The schema includes RLS policies for:
- **Public read access** to all courses and related data
- **Authenticated users** can create reviews
- **Admin operations** require service role key

### Additional RLS Policies (Optional)

If you want to restrict access further, you can modify the RLS policies:

1. **Restrict course access by department:**
   ```sql
   CREATE POLICY "Users can view courses in their department"
     ON lms_courses FOR SELECT
     USING (
       auth.jwt() ->> 'department' = ANY(department)
       OR auth.jwt() ->> 'role' = 'admin'
     );
   ```

2. **Restrict review creation to authenticated users:**
   ```sql
   CREATE POLICY "Authenticated users can create reviews"
     ON lms_reviews FOR INSERT
     TO authenticated
     WITH CHECK (true);
   ```

## Step 9: Generate TypeScript Types (Optional)

Supabase can generate TypeScript types from your database schema:

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Generate types:**
   ```bash
   supabase gen types typescript --project-id your_project_id > src/types/database.types.ts
   ```

3. **Update imports:**
   - Update `src/types/lmsSupabase.ts` to use the generated types
   - This ensures type safety between your database and application

## Troubleshooting

### Common Issues

1. **"Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"**
   - Make sure your `.env` file is in the project root
   - Restart your development server after adding environment variables
   - Check that the variable names are correct (must start with `VITE_` for Vite)

2. **"Row Level Security policy violation"**
   - Check that RLS policies are set up correctly
   - Verify that you're using the correct Supabase client (anon key for public access)
   - Check the Supabase logs for detailed error messages

3. **"Table does not exist"**
   - Verify that the schema migration ran successfully
   - Check the Supabase Table Editor to see if tables exist
   - Re-run the schema migration if necessary

4. **"Invalid enum value"**
   - Make sure the enum types match between your TypeScript code and database
   - Check that course data uses valid enum values (e.g., `'Video'`, `'Guide'`, etc.)

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [Supabase Discord](https://discord.supabase.com)
- Check the project's GitHub issues

## Next Steps

1. **Set up authentication** (if not already done)
   - Configure authentication providers in Supabase
   - Update RLS policies to use user authentication

2. **Add analytics** (optional)
   - Track course views
   - Track user progress
   - Add user enrollment tracking

3. **Set up backups** (recommended)
   - Configure automatic backups in Supabase
   - Set up database replication if needed

4. **Optimize performance**
   - Add database indexes for frequently queried fields
   - Use Supabase Edge Functions for complex operations
   - Implement caching where appropriate

## Schema Overview

### Main Tables

- **lms_courses**: Main course table with all course metadata
- **lms_reviews**: User reviews/testimonials for courses
- **lms_case_studies**: Case studies related to courses
- **lms_references**: Reference materials for courses
- **lms_faqs**: Frequently asked questions for courses (mainly for tracks)

### Curriculum Tables

- **lms_curriculum_items**: Curriculum items (courses in tracks, topics in multi-lesson courses)
- **lms_curriculum_topics**: Topics within curriculum items
- **lms_curriculum_lessons**: Lessons within topics or directly in curriculum items

### Relationships

- Courses → Reviews (one-to-many)
- Courses → Case Studies (one-to-many)
- Courses → References (one-to-many)
- Courses → FAQs (one-to-many)
- Courses → Curriculum Items (one-to-many)
- Curriculum Items → Topics (one-to-many)
- Topics → Lessons (one-to-many)
- Curriculum Items → Lessons (one-to-many, for single lesson courses)

## Data Migration

To migrate existing TypeScript data to Supabase, you can:

1. **Use the provided migration script** (if available)
2. **Manually convert data** from TypeScript to SQL INSERT statements
3. **Use Supabase's CSV import** feature (export data to CSV first)

For large datasets, consider using Supabase's batch insert API or the service role key for faster imports.

