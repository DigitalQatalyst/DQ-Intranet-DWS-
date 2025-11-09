# Supabase Migration Guide for DQ-Intranet-DWS- Communities

This guide walks you through decoupling DQ-Intranet-DWS- Communities from the shared MZN Supabase project and setting up a dedicated Supabase project.

## Prerequisites

1. A Supabase account (https://supabase.com)
2. Node.js and npm installed
3. Access to the DQ-Intranet-DWS- codebase

## Step 1: Create a New Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: DQ-Intranet-DWS-Communities (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is sufficient for development
4. Click "Create new project"
5. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Save the file

## Step 4: Run the Schema Migration

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open the file `db/supabase/dws_communities_schema.sql`
4. Copy the entire contents of the file
5. Paste it into the SQL Editor
6. Click "Run" (or press Ctrl+Enter)
7. Wait for the migration to complete (should take 10-30 seconds)
8. Verify that all tables, views, functions, and policies were created successfully

## Step 5: Create Storage Bucket

1. In your Supabase project dashboard, go to **Storage**
2. Click "New bucket"
3. Create a bucket with the following settings:
   - **Name**: `community-posts`
   - **Public bucket**: No (private)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: `image/*, video/*, application/pdf`
4. Click "Create bucket"

### Configure Storage Policies

1. Click on the `community-posts` bucket
2. Go to **Policies** tab
3. Create the following policies:

   **Policy 1: Users can upload files**
   - Policy name: `Users can upload files`
   - Allowed operation: `INSERT`
   - Policy definition:
     ```sql
     (bucket_id = 'community-posts'::text) AND (auth.role() = 'authenticated'::text)
     ```

   **Policy 2: Users can read files**
   - Policy name: `Users can read files`
   - Allowed operation: `SELECT`
   - Policy definition:
     ```sql
     (bucket_id = 'community-posts'::text) AND (auth.role() = 'authenticated'::text)
     ```

   **Policy 3: Users can delete own files**
   - Policy name: `Users can delete own files`
   - Allowed operation: `DELETE`
   - Policy definition:
     ```sql
     (bucket_id = 'community-posts'::text) AND (auth.role() = 'authenticated'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
     ```

## Step 6: Seed Initial Data

1. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

2. Run the seed script:
   ```bash
   node scripts/seed-dws-communities.js
   ```

3. Verify that the seed data was created:
   - Check the Supabase dashboard > **Table Editor** > `users_local`
   - Check the Supabase dashboard > **Table Editor** > `communities`
   - Check the Supabase dashboard > **Table Editor** > `memberships`

## Step 7: Verify the Migration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Communities section:
   - Go to `/communities` in your browser
   - Verify that communities are loading
   - Verify that you can view community details
   - Verify that you can join communities
   - Verify that real-time updates are working

3. Test authentication:
   - Log in with the admin account: `admin@dq.com` / `admin123`
   - Verify that sessions are working
   - Verify that user data is loading correctly

4. Test RPC functions:
   - Verify that `get_feed` is working
   - Verify that `get_community_members` is working
   - Verify that `get_mutual_communities` is working

## Step 8: Update RLS Policies (if needed)

The schema migration includes basic RLS policies. However, since DQ-Intranet-DWS- uses local authentication (not Supabase Auth), you may need to adjust the RLS policies:

1. **Option 1: Disable RLS** (for development)
   - Not recommended for production
   - Can be done by running: `ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;`

2. **Option 2: Use Service Role Key** (for development)
   - Use the service role key for all operations
   - Not recommended for client-side code

3. **Option 3: Migrate to Supabase Auth** (recommended for production)
   - Migrate from `users_local` table to Supabase Auth
   - Update RLS policies to use `auth.uid()`
   - Update authentication code to use Supabase Auth

## Troubleshooting

### Error: "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"
- **Solution**: Make sure your `.env` file is in the root directory and contains the correct values
- **Solution**: Restart your development server after updating `.env`

### Error: "permission denied for table"
- **Solution**: Check that RLS policies are correctly configured
- **Solution**: Verify that you're using the correct API key (anon key for client-side, service role key for server-side)

### Error: "relation does not exist"
- **Solution**: Make sure you ran the schema migration script
- **Solution**: Verify that all tables were created in the Supabase dashboard

### Error: "function does not exist"
- **Solution**: Make sure you ran the schema migration script completely
- **Solution**: Verify that all functions were created in the Supabase dashboard

### Real-time subscriptions not working
- **Solution**: Check that Realtime is enabled in Supabase Dashboard > Settings > API
- **Solution**: Verify that the tables have Realtime enabled (Supabase Dashboard > Database > Replication)

## Next Steps

1. **Update authentication**: Consider migrating to Supabase Auth for better security and RLS support
2. **Set up backups**: Configure automated backups in Supabase Dashboard > Settings > Database
3. **Monitor usage**: Set up monitoring and alerts in Supabase Dashboard > Settings > Usage
4. **Optimize performance**: Review and optimize database queries and indexes
5. **Security review**: Review and update RLS policies for production use

## Support

If you encounter any issues during the migration:
1. Check the Supabase logs in the Dashboard > Logs
2. Check the browser console for client-side errors
3. Review the migration script for any syntax errors
4. Contact the development team for assistance

## Rollback Plan

If you need to rollback the migration:
1. Keep the old Supabase project credentials
2. Update `.env` to point back to the old project
3. Restart the development server
4. The application should work with the old project (if it's still accessible)

