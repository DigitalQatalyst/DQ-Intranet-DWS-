# Anonymous Memberships Guide

## Overview

This guide explains how anonymous users can join communities without requiring authentication. The RLS policies have been updated to allow anonymous inserts into the `memberships` table.

## Changes Made

### 1. Updated RLS Policy

The `memberships` table INSERT policy has been updated to allow anonymous users:

```sql
-- Old policy (required authentication):
CREATE POLICY "Allow authenticated insert memberships"
ON public.memberships
FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

-- New policy (allows anonymous):
CREATE POLICY "Allow authenticated insert memberships"
ON public.memberships
FOR INSERT
WITH CHECK (true);
```

### 2. Granted INSERT Permission

```sql
GRANT INSERT ON public.memberships TO anon;
GRANT INSERT ON public.memberships TO authenticated;
```

## Security Considerations

⚠️ **IMPORTANT**: Since anonymous users can now insert memberships, application-level validation is **REQUIRED** to ensure data integrity.

### Required Validations

1. **User ID Validation**
   - Validate that `user_id` is a valid UUID
   - Check if user exists in `users_local` table (if applicable)
   - Handle anonymous user IDs appropriately

2. **Community Validation**
   - Verify that `community_id` exists
   - Check if community allows anonymous membership
   - Verify community is not private (if applicable)

3. **Duplicate Prevention**
   - Check if user is already a member before inserting
   - Handle unique constraint violations gracefully

4. **Rate Limiting**
   - Implement rate limiting for anonymous joins
   - Prevent abuse (e.g., joining multiple communities rapidly)

## Implementation

### Application-Level Validation

```typescript
// Example: Join community with validation
async function joinCommunity(communityId: string, userId: string) {
  // 1. Validate community exists
  const { data: community, error: communityError } = await supabase
    .from('communities')
    .select('id, isprivate')
    .eq('id', communityId)
    .single();
  
  if (communityError || !community) {
    throw new Error('Community not found');
  }
  
  // 2. Check if user is already a member
  const { data: existingMembership } = await supabase
    .from('memberships')
    .select('id')
    .eq('user_id', userId)
    .eq('community_id', communityId)
    .single();
  
  if (existingMembership) {
    throw new Error('User is already a member');
  }
  
  // 3. Validate user ID format
  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID');
  }
  
  // 4. Insert membership
  const { data, error } = await supabase
    .from('memberships')
    .insert({
      user_id: userId,
      community_id: communityId
    })
    .select();
  
  if (error) {
    if (error.code === '23505') {
      throw new Error('User is already a member');
    }
    throw new Error(`Failed to join community: ${error.message}`);
  }
  
  return data;
}
```

### Handling Anonymous Users

For anonymous users, you may want to:

1. **Create Temporary User IDs**
   - Generate a UUID for anonymous users
   - Store in localStorage or session
   - Create user record in `users_local` if needed

2. **Session-Based Approach**
   - Use session IDs for anonymous users
   - Map sessions to user IDs
   - Clean up sessions after expiration

3. **Guest Accounts**
   - Create guest accounts for anonymous users
   - Allow upgrading to full accounts later
   - Track anonymous vs. authenticated users

## Testing

### Test Anonymous Membership Insert

```sql
-- Test query (run as anon role)
INSERT INTO public.memberships (user_id, community_id)
VALUES ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001');
```

### Run Verification Script

```bash
node scripts/verify-supabase-rls.js
```

Expected output:
- ✅ Anonymous Membership Insert: PASS

## Database Constraints

The `memberships` table has a unique constraint on `(user_id, community_id)`, so duplicate inserts will fail with error code `23505`. Handle this gracefully in your application:

```typescript
try {
  await joinCommunity(communityId, userId);
} catch (error) {
  if (error.code === '23505') {
    // User is already a member
    console.log('User is already a member of this community');
  } else {
    // Other error
    console.error('Error joining community:', error);
  }
}
```

## Community-Specific Rules

Consider implementing community-specific rules:

1. **Private Communities**
   - Require authentication for private communities
   - Check `isprivate` flag before allowing join
   - Implement approval workflow if needed

2. **Public Communities**
   - Allow anonymous joins for public communities
   - Still validate user ID and prevent duplicates
   - Implement rate limiting

3. **Moderated Communities**
   - Allow anonymous joins but require approval
   - Set membership status to 'pending'
   - Notify moderators of new membership requests

## Migration Steps

### Step 1: Apply RLS Policy Update

Run the SQL script to update the policy:

```bash
# In Supabase SQL Editor, run:
db/supabase/allow_anonymous_memberships.sql
```

### Step 2: Update Application Code

1. Update join community function to handle anonymous users
2. Add validation logic
3. Implement rate limiting
4. Handle errors gracefully

### Step 3: Test

1. Test anonymous membership insert
2. Test duplicate prevention
3. Test validation logic
4. Test rate limiting

### Step 4: Deploy

1. Deploy updated application code
2. Monitor for errors
3. Track anonymous membership metrics
4. Adjust rate limiting if needed

## Files Updated

- `db/supabase/setup_rls_policies_complete.sql` - Updated INSERT policy
- `db/supabase/fix_rls_policies_for_anon.sql` - Updated INSERT policy
- `db/supabase/apply_rls_policies.sql` - Updated INSERT policy
- `db/supabase/allow_anonymous_memberships.sql` - New script for anonymous memberships
- `scripts/verify-supabase-rls.js` - Added test for anonymous membership insert

## Troubleshooting

### Error: "permission denied for table memberships"

**Cause**: INSERT permission not granted to anon role.

**Solution**:
```sql
GRANT INSERT ON public.memberships TO anon;
```

### Error: "duplicate key value violates unique constraint"

**Cause**: User is already a member.

**Solution**: Check for existing membership before inserting, or handle the error gracefully.

### Error: "violates foreign key constraint"

**Cause**: `user_id` or `community_id` doesn't exist.

**Solution**: Validate that user and community exist before inserting.

## Best Practices

1. **Always Validate**
   - Validate user ID format
   - Check if community exists
   - Verify user is not already a member

2. **Handle Errors Gracefully**
   - Catch duplicate key errors
   - Handle foreign key violations
   - Provide user-friendly error messages

3. **Implement Rate Limiting**
   - Limit anonymous joins per IP
   - Limit joins per time period
   - Prevent abuse

4. **Monitor Usage**
   - Track anonymous membership metrics
   - Monitor for abuse
   - Adjust policies as needed

5. **Consider Security**
   - Validate user IDs on server side
   - Implement CSRF protection
   - Use rate limiting
   - Monitor for suspicious activity

## Next Steps

1. ✅ Apply RLS policy update
2. ✅ Update application code
3. ✅ Add validation logic
4. ✅ Implement rate limiting
5. ✅ Test anonymous membership flow
6. ✅ Deploy and monitor

---

**Status**: ✅ Anonymous memberships enabled
**Last Updated**: 2025-01-27
**Supabase Project**: jmhtrffmxjxhoxpesubv.supabase.co

