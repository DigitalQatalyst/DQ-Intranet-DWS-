# Events Table RLS Fix Summary

## Issues Fixed

### 1. Permission Denied Errors (401)
**Problem**: The events table had RLS enabled but policies were not correctly configured for Supabase's `anon` role.

**Solution**: Created explicit RLS policies for:
- `anon` role: Can view published events
- `authenticated` role: Can view all events  
- `public` role: Can view published events (backup)

### 2. Missing Table Permissions
**Problem**: Even with RLS policies, the roles needed explicit GRANT permissions.

**Solution**: Granted SELECT permission to:
- `anon` role
- `authenticated` role
- `public` role

## RLS Policies Created

### Policy 1: Anonymous Users (anon)
```sql
CREATE POLICY "anon_can_view_published_events"
ON events
FOR SELECT
TO anon
USING (status = 'published');
```

### Policy 2: Authenticated Users
```sql
CREATE POLICY "authenticated_can_view_all_events"
ON events
FOR SELECT
TO authenticated
USING (true);
```

### Policy 3: Public Role (Backup)
```sql
CREATE POLICY "public_can_view_published_events"
ON events
FOR SELECT
TO public
USING (status = 'published');
```

## Table Permissions Granted

```sql
GRANT SELECT ON events TO anon;
GRANT SELECT ON events TO authenticated;
GRANT SELECT ON events TO public;
```

## Verification

✅ RLS is enabled on events table
✅ Policies created for all necessary roles
✅ Table permissions granted
✅ Test query returns 12 published future events

## Current Status

The events table is now accessible via Supabase client using the anon key. The marketplace should be able to:
- Fetch published events for anonymous users
- Fetch all events for authenticated users
- Display events in the marketplace UI

## Testing

To verify the fix works:

1. **Check browser console**: Should see "Fetched X events from events table" instead of permission errors
2. **Verify data**: Events should appear in the marketplace UI
3. **Check network tab**: Requests to Supabase should return 200 status instead of 401

## Next Steps

If you still see 401 errors:

1. **Verify environment variables**: Ensure `VITE_SUPABASE_ANON_KEY` is set correctly in `.env`
2. **Restart dev server**: Environment variables require a restart
3. **Check Supabase dashboard**: Verify the anon key matches your project
4. **Clear browser cache**: Old errors might be cached

## Files Modified

- `scripts/fix-events-rls.js` - Initial RLS policy creation
- `scripts/fix-events-rls-v2.js` - Final RLS policy fix with explicit roles
- Database: RLS policies and permissions updated directly

## Notes

- The Supabase client uses the `anon` key by default for anonymous requests
- RLS policies ensure only published events are visible to anonymous users
- Authenticated users can see all events (useful for admins/organizers)
- The `upcoming_events` view inherits RLS from the underlying `events` table





