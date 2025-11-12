# Supabase Configuration Update Summary

## Status: ✅ Configuration Updated

The Supabase configuration in DQ-Intranet-DWS- has been updated to use the new DWS Supabase project for Communities.

## Environment Variables

### ✅ Already Configured

The following variables are already set in your `.env` file:

- **VITE_SUPABASE_URL**: `https://jmhtrffmxjxhoxpesubv.supabase.co` ✅
- **VITE_SUPABASE_ANON_KEY**: (DWS project anon key) ✅
- **VITE_SUPABASE_SERVICE_ROLE_KEY**: (DWS project service role key) ✅
- **NODE_ENV**: `development` ✅

### ⚠️  Needs to be Added

Add these variables to your `.env` file if they're not already present:

```env
# DWS Communities Supabase Configuration
VITE_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
VITE_SUPABASE_SITE_URL=https://dws.digitalqatalyst.com
```

### 📝 Note on Backend Configuration

Your `.env` file contains a separate backend Supabase configuration:
- **SUPABASE_URL**: `https://nywlgmvnpaeemyxlhttx.supabase.co` (Backend API project)
- **SUPABASE_SERVICE_ROLE_KEY**: (Backend API service role key)

This is correct - the backend API uses a different Supabase project than the Communities feature.

## Files Updated

### 1. `src/lib/supabaseClient.ts`
- ✅ Updated to use new environment variables
- ✅ Added support for `VITE_SUPABASE_REDIRECT_URL`
- ✅ Added support for `VITE_SUPABASE_SITE_URL`
- ✅ Enhanced auth configuration
- ✅ Added realtime configuration
- ✅ Added client info headers

### 2. `src/lib/supabaseClient.node.ts`
- ✅ Updated to support service role key
- ✅ Falls back to anon key if service role key not available
- ✅ Added separate admin client export

### 3. `api/lib/supabaseAdmin.ts`
- ✅ Updated to prefer service role key
- ✅ Enhanced error messages
- ✅ Added warnings for missing service role key

### 4. `src/env.d.ts`
- ✅ Added TypeScript definitions for new environment variables
- ✅ Added Node.js process.env types

### 5. `.env.example`
- ✅ Created template file with all environment variables
- ✅ Includes setup instructions

## Configuration Architecture

### Frontend (Communities Feature)
- Uses: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Project: `jmhtrffmxjxhoxpesubv.supabase.co` (DWS Communities)
- Client: `src/lib/supabaseClient.ts`

### Backend (API Server)
- Uses: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Project: `nywlgmvnpaeemyxlhttx.supabase.co` (Backend API)
- Client: `api/lib/supabaseAdmin.ts`

## Next Steps

### 1. Add Missing Environment Variables

If `VITE_SUPABASE_REDIRECT_URL` and `VITE_SUPABASE_SITE_URL` are not in your `.env` file, add them:

```env
VITE_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
VITE_SUPABASE_SITE_URL=https://dws.digitalqatalyst.com
```

### 2. Verify Configuration

Run the verification script:
```bash
powershell -ExecutionPolicy Bypass -File "scripts/verify-supabase-config.ps1"
```

### 3. Restart Development Server

After updating environment variables:
```bash
npm run dev
```

### 4. Test the Application

1. Navigate to `/communities`
2. Verify communities are loading from the new Supabase project
3. Test join/leave community flow
4. Test create post flow
5. Verify real-time updates
6. Test authentication

## Verification Checklist

- [x] `VITE_SUPABASE_URL` points to new DWS project
- [x] `VITE_SUPABASE_ANON_KEY` is set for DWS project
- [x] `VITE_SUPABASE_SERVICE_ROLE_KEY` is set for DWS project
- [ ] `VITE_SUPABASE_REDIRECT_URL` is set (add if missing)
- [ ] `VITE_SUPABASE_SITE_URL` is set (add if missing)
- [ ] Development server restarted
- [ ] Communities page loads correctly
- [ ] Join/leave community works
- [ ] Real-time subscriptions work
- [ ] RPC functions work

## Important Notes

### Service Role Key Usage

- **Frontend (Communities)**: Uses `VITE_SUPABASE_SERVICE_ROLE_KEY` for server-side scripts (seed, migrations)
- **Backend (API)**: Uses `SUPABASE_SERVICE_ROLE_KEY` for API server operations
- **Never expose service role keys in client-side code**

### Redirect URL

- Development: `http://localhost:3000/auth/callback`
- Production: Update to `https://dws.digitalqatalyst.com/auth/callback`

### Site URL

- Development: Can use `http://localhost:3000`
- Production: `https://dws.digitalqatalyst.com`

## Troubleshooting

### Error: "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"
- **Solution**: Verify `.env` file is in project root
- **Solution**: Restart development server after updating `.env`
- **Solution**: Check variable names match exactly (case-sensitive)

### Communities not loading
- **Solution**: Verify schema migration was run on new Supabase project
- **Solution**: Check Supabase Dashboard > Logs for errors
- **Solution**: Verify anon key has proper permissions

### Real-time not working
- **Solution**: Check Realtime is enabled in Supabase Dashboard
- **Solution**: Verify anon key has realtime permissions
- **Solution**: Check browser console for connection errors

## Support

If you encounter issues:
1. Check Supabase Dashboard > Logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Review the migration guide for troubleshooting

## Summary

✅ **Configuration Updated**: All code files have been updated to use the new DWS Supabase project
✅ **Environment Variables**: Core variables are configured in `.env`
⚠️  **Action Required**: Add `VITE_SUPABASE_REDIRECT_URL` and `VITE_SUPABASE_SITE_URL` if missing
✅ **Ready to Test**: Application is ready to test with new Supabase project

