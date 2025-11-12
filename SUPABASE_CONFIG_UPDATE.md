# Supabase Configuration Update

## Overview

Updated the Supabase configuration in DQ-Intranet-DWS- to use the new DWS Supabase project environment variables.

## New Configuration

### Environment Variables

The following environment variables have been configured:

- **VITE_SUPABASE_URL**: `https://jmhtrffmxjxhoxpesubv.supabase.co`
- **VITE_SUPABASE_ANON_KEY**: (configured in .env)
- **SUPABASE_SERVICE_ROLE_KEY**: (configured in .env, for server-side operations)
- **VITE_SUPABASE_REDIRECT_URL**: `http://localhost:3000/auth/callback`
- **VITE_SUPABASE_SITE_URL**: `https://dws.digitalqatalyst.com`
- **NODE_ENV**: `development`

## Files Updated

### 1. `src/lib/supabaseClient.ts`
- Updated to use new environment variables
- Added support for `VITE_SUPABASE_REDIRECT_URL` and `VITE_SUPABASE_SITE_URL`
- Enhanced auth configuration with redirect URL support
- Added realtime configuration
- Added client info headers

### 2. `src/lib/supabaseClient.node.ts`
- Updated to support service role key for server-side operations
- Falls back to anon key if service role key is not available
- Added separate admin client export

### 3. `api/lib/supabaseAdmin.ts`
- Updated to use new environment variable names
- Prefers service role key, falls back to anon key
- Added warning when service role key is not available
- Enhanced error messages

### 4. `src/env.d.ts`
- Added TypeScript definitions for new environment variables
- Added support for `VITE_SUPABASE_REDIRECT_URL`
- Added support for `VITE_SUPABASE_SITE_URL`
- Added Node.js process.env types

### 5. `.env.example`
- Created template file with new environment variables
- Includes setup instructions
- Documents all required variables

## Setup Instructions

1. **Create `.env` file** (if not already created):
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` file** with your actual credentials:
   ```env
   VITE_SUPABASE_URL=https://jmhtrffmxjxhoxpesubv.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
   VITE_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
   VITE_SUPABASE_SITE_URL=https://dws.digitalqatalyst.com
   NODE_ENV=development
   ```

3. **Restart development server**:
   ```bash
   npm run dev
   ```

## Verification

To verify the configuration is working:

1. **Check environment variables are loaded**:
   - The application should start without errors
   - No "Missing VITE_SUPABASE_URL" errors in console

2. **Test Supabase connection**:
   - Navigate to `/communities` page
   - Verify communities are loading from the new Supabase project
   - Check browser console for any connection errors

3. **Test authentication**:
   - Try logging in with admin credentials
   - Verify sessions are working correctly

4. **Test real-time subscriptions**:
   - Create a new post
   - Verify real-time updates are working

## Important Notes

### Service Role Key
- The service role key should **never** be exposed in client-side code
- It's only used for server-side operations (API routes, seed scripts, etc.)
- Always use the anon key for client-side operations

### Redirect URL
- The redirect URL is used for OAuth authentication flows
- Update `VITE_SUPABASE_REDIRECT_URL` for different environments:
  - Development: `http://localhost:3000/auth/callback`
  - Production: `https://dws.digitalqatalyst.com/auth/callback`

### Site URL
- The site URL is used for email links and OAuth redirects
- Update `VITE_SUPABASE_SITE_URL` for production deployment

## Troubleshooting

### Error: "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"
- **Solution**: Make sure your `.env` file is in the project root
- **Solution**: Restart your development server after updating `.env`
- **Solution**: Verify the variable names match exactly (case-sensitive)

### Error: "Supabase env vars not set"
- **Solution**: Check that all required variables are set in `.env`
- **Solution**: Verify there are no typos in variable names
- **Solution**: Make sure `.env` file is not in `.gitignore` (it should be)

### Real-time not working
- **Solution**: Check that Realtime is enabled in Supabase Dashboard
- **Solution**: Verify the anon key has proper permissions
- **Solution**: Check browser console for connection errors

## Next Steps

1. **Run schema migration** (if not already done):
   - Execute `db/supabase/dws_communities_schema.sql` in Supabase SQL Editor

2. **Create storage bucket**:
   - Create `community-posts` bucket in Supabase Dashboard
   - Configure storage policies

3. **Seed initial data**:
   - Run `node scripts/seed-dws-communities.js`

4. **Test all features**:
   - Verify communities are loading
   - Test join/leave community flow
   - Test create post flow
   - Verify real-time updates
   - Test RPC functions

## Security Notes

- ⚠️ **Never commit `.env` file to version control**
- ⚠️ **Never expose service role key in client-side code**
- ⚠️ **Use anon key for all client-side operations**
- ⚠️ **Rotate keys if they are accidentally exposed**
- ⚠️ **Use environment-specific keys for different environments**

## Support

If you encounter any issues:
1. Check Supabase Dashboard > Logs for errors
2. Check browser console for client-side errors
3. Verify environment variables are set correctly
4. Review the migration guide for troubleshooting tips

