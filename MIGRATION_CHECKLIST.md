# DQ-Intranet-DWS- Communities Supabase Migration Checklist

## Pre-Migration

- [x] Remove hardcoded Supabase clients
- [x] Consolidate to single client (`src/lib/supabaseClient.ts`)
- [x] Update all community pages to use centralized client
- [x] Create environment variable template (`.env.example`)
- [x] Create comprehensive schema migration script
- [x] Create seed data script
- [x] Create migration guide
- [x] Remove all references to old Supabase URL/key in code

## Migration Steps

### 1. Create New Supabase Project
- [ ] Go to https://supabase.com
- [ ] Create new project: "DQ-Intranet-DWS-Communities"
- [ ] Choose region closest to users
- [ ] Wait for project provisioning (2-3 minutes)

### 2. Get Credentials
- [ ] Copy Project URL from Settings > API
- [ ] Copy anon public key from Settings > API
- [ ] (Optional) Copy service role key for server-side operations

### 3. Configure Environment Variables
- [ ] Copy `.env.example` to `.env`
- [ ] Set `VITE_SUPABASE_URL` to new project URL
- [ ] Set `VITE_SUPABASE_ANON_KEY` to new anon key
- [ ] Verify `.env` is in `.gitignore`

### 4. Run Schema Migration
- [ ] Open Supabase Dashboard > SQL Editor
- [ ] Run `db/supabase/dws_communities_schema.sql`
- [ ] (Alternative) Run `db/supabase/dws_communities_rls_local_auth.sql` for permissive policies
- [ ] Verify all tables, views, functions, and policies were created
- [ ] Check for any errors in the SQL Editor

### 5. Create Storage Bucket
- [ ] Go to Storage > New bucket
- [ ] Create bucket: `community-posts`
- [ ] Set as private (not public)
- [ ] Set file size limit: 10 MB
- [ ] Set allowed MIME types: `image/*, video/*, application/pdf`
- [ ] Create storage policies (see migration guide)

### 6. Seed Initial Data
- [ ] Run `node scripts/seed-dws-communities.js`
- [ ] Verify admin user was created
- [ ] Verify sample communities were created
- [ ] Verify memberships were created
- [ ] Check Supabase Dashboard > Table Editor

### 7. Test Application
- [ ] Start development server: `npm run dev`
- [ ] Navigate to `/communities`
- [ ] Verify communities are loading
- [ ] Verify community details page works
- [ ] Verify join community flow works
- [ ] Verify leave community flow works
- [ ] Verify create post works
- [ ] Verify real-time updates work
- [ ] Verify RPC functions work (`get_feed`, `get_community_members`, etc.)

### 8. Test Authentication
- [ ] Log in with admin account: `admin@dq.com` / `admin123`
- [ ] Verify session persists
- [ ] Verify user data loads correctly
- [ ] Verify logout works
- [ ] Verify protected routes work

### 9. Verify Real-time Subscriptions
- [ ] Create a new post
- [ ] Verify real-time update appears in feed
- [ ] Verify notifications work
- [ ] Verify activity center updates in real-time

### 10. Verify RPC Functions
- [ ] Test `get_feed` function
- [ ] Test `get_community_members` function
- [ ] Test `get_mutual_communities` function
- [ ] Test `update_member_role` function
- [ ] Test `remove_community_member` function
- [ ] Test `increment_poll_vote` function
- [ ] Test `get_relationship_status` function
- [ ] Test `toggle_follow` function
- [ ] Test `create_report_secure` function
- [ ] Test `create_moderation_action_secure` function
- [ ] Test `update_report_status_secure` function
- [ ] Test `search_users` function
- [ ] Test `get_trending_topics` function

### 11. Clean Up
- [ ] Remove old Supabase project references from documentation (optional)
- [ ] Update documentation with new project details
- [ ] Verify no hardcoded URLs/keys remain in code
- [ ] Test in production environment (if applicable)

## Post-Migration

### Verification
- [ ] All community pages load correctly
- [ ] Join/leave community flow works
- [ ] Create post flow works
- [ ] Real-time subscriptions work
- [ ] RPC functions work
- [ ] Authentication works
- [ ] Sessions work correctly
- [ ] Storage uploads work
- [ ] No errors in browser console
- [ ] No errors in Supabase logs

### Documentation
- [ ] Update README with new Supabase setup
- [ ] Update deployment documentation
- [ ] Update environment variable documentation
- [ ] Document any custom configurations

### Security
- [ ] Review RLS policies
- [ ] Verify environment variables are not committed
- [ ] Verify service role key is not exposed
- [ ] Consider migrating to Supabase Auth for better security
- [ ] Set up database backups
- [ ] Set up monitoring and alerts

## Rollback Plan

If migration fails:
- [ ] Keep old Supabase project credentials
- [ ] Update `.env` to point back to old project
- [ ] Restart development server
- [ ] Verify application works with old project
- [ ] Investigate migration issues
- [ ] Fix issues and retry migration

## Notes

- The application uses local authentication (`users_local` table), not Supabase Auth
- RLS policies are permissive to work with local auth
- For production, consider migrating to Supabase Auth for better security
- Storage bucket policies may need adjustment based on your requirements
- Monitor Supabase usage and costs

## Support

If you encounter issues:
1. Check Supabase Dashboard > Logs
2. Check browser console for errors
3. Review migration guide troubleshooting section
4. Contact development team for assistance

## Acceptance Criteria

- ✅ App reads/writes only to the new project
- ✅ All community pages load
- ✅ Join flow works
- ✅ Real-time subscriptions work
- ✅ RPC calls work
- ✅ Authentication works
- ✅ Sessions work correctly
- ✅ No references to old URL/key remain in code
- ✅ Storage uploads work
- ✅ All features work as expected

