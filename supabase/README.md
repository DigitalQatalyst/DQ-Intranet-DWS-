# Supabase Schema and Seed Files

## Overview

This directory contains the complete schema and seed files for the DWS News & Announcements Marketplace, designed to seamlessly integrate with Supabase and replace all hardcoded data in the application.

## Files

1. **`migrations/20250101000000_complete_schema.sql`** - Complete database schema for all tables
2. **`seed-news.sql`** - Seed data for news and announcements (matches `src/data/media/news.ts`)
3. **`seed-jobs.sql`** - Seed data for jobs (matches `src/data/media/jobs.ts`)
4. **`seed-work-directory.sql`** - Seed data for work directory (matches `src/data/directoryData.ts`)
5. **`seed-marketplace-services.sql`** - Seed data for marketplace services (courses, financial, guides, etc.)

## Setup Instructions

### 1. Run Schema Migration

In your Supabase SQL Editor, run:

```sql
-- Run the complete schema file
-- Copy and paste the contents of migrations/20250101000000_complete_schema.sql
```

Or using Supabase CLI:

```bash
supabase db push
```

### 2. Run Seed Files

After the schema is created, run the seed files in order:

```sql
-- 1. News and Announcements
-- Copy and paste contents of seed-news.sql

-- 2. Jobs
-- Copy and paste contents of seed-jobs.sql

-- 3. Work Directory
-- Copy and paste contents of seed-work-directory.sql

-- 4. Marketplace Services
-- Copy and paste contents of seed-marketplace-services.sql
```

## Schema Structure

### News Table (`public.news`)
- Matches `NewsItem` type from `src/data/media/news.ts`
- Supports: Announcements, Guidelines, Notices, Thought Leadership
- Includes full article content, tags, metadata

### Jobs Table (`public.jobs`)
- Matches `JobItem` type from `src/data/media/jobs.ts`
- Includes responsibilities, requirements, benefits
- SFIA level support

### Work Directory Tables
- `work_units` - Organizational units (factories, teams)
- `work_positions` - Job positions and roles
- `work_associates` - Employee directory
- `employee_profiles` - Extended employee information

### Marketplace Services Table (`public.marketplace_services`)
- Unified table for all marketplace items:
  - Courses (`service_type = 'course'`)
  - Financial Services (`service_type = 'financial'`)
  - Non-Financial Services (`service_type = 'non-financial'`)
  - Guides/Knowledge Hub (`service_type = 'guide'`)
  - Onboarding Flows (`service_type = 'onboarding'`)

## Security

All tables have Row Level Security (RLS) enabled with public read access policies. Adjust these policies based on your security requirements.

## Migration Path

When ready to switch from hardcoded data to Supabase:

1. Update service files (`src/services/mediaCenterService.ts`) to query Supabase instead of importing from `src/data`
2. Update components to handle async data loading
3. Comment out hardcoded data imports
4. Test thoroughly before removing hardcoded data files

## Notes

- All seed data matches the exact structure from the hardcoded TypeScript files
- Dates are stored as DATE or TIMESTAMPTZ types
- Arrays (tags, responsibilities, etc.) are stored as TEXT[] arrays
- JSONB is used for flexible metadata where needed

