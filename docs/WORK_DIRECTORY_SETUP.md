# Work Directory Setup Guide

This guide will help you set up the Work Directory tables in your Supabase database.

## Step 1: Run the Schema Migration

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor**
   - Click **New Query**

2. **Run the schema migration**
   - Copy the contents of `supabase/work-directory-schema.sql`
   - Paste into the SQL Editor
   - Click **Run** to execute the migration
   - Verify that all tables were created:
     - `work_units`
     - `work_positions`
     - `work_associates`
     - `employee_profiles`

## Step 2: (Optional) Add Seed Data

If you want to test with sample data:

1. **Run the seed script**
   - Copy the contents of `supabase/work-directory-seed.sql`
   - Paste into the SQL Editor
   - Click **Run** to insert sample data

## Step 3: Verify Tables

You can verify the tables were created by:

1. Going to **Table Editor** in Supabase dashboard
2. You should see:
   - `work_units` - with columns matching the WorkUnit interface
   - `work_positions` - with columns matching the WorkPosition interface
   - `work_associates` - with columns matching the WorkAssociate interface
   - `employee_profiles` - with columns matching the EmployeeProfile interface

## Step 4: Check RLS Policies

The schema includes Row Level Security (RLS) policies that allow public read access. If you need to restrict access:

1. Go to **Authentication** → **Policies** in Supabase
2. Modify the policies for each table as needed

## Troubleshooting

### Error: "relation does not exist"
- Make sure you ran the schema migration first
- Check that you're running it in the correct database

### Error: "permission denied"
- Check your RLS policies
- Verify your Supabase anon key has the correct permissions

### Tables exist but no data shows
- Check that you have data in the tables
- Verify RLS policies allow SELECT operations
- Check browser console for specific error messages

## Next Steps

After setting up the tables:
1. Add your actual data to the tables
2. Restart your development server
3. The Work Directory page should now load data from Supabase

