# Add Test User to All Communities

This script ensures that "Test User" is a member of all communities and can perform all interactions.

## What This Script Does

1. **Finds Test User** - Locates the Test User account in the database
2. **Fetches All Communities** - Gets a list of all communities
3. **Checks Existing Memberships** - Identifies which communities Test User is already a member of
4. **Adds Missing Memberships** - Adds Test User to any communities they're not already a member of
5. **Verifies Permissions** - Confirms that Test User can perform all interactions

## Prerequisites

1. **Test User must exist** - Run `create-test-user.ts` first if needed:
   ```bash
   npx tsx scripts/create-test-user.ts
   ```

2. **Environment Variables** - Set the following:
   - `VITE_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Usage

### Windows (PowerShell)

```powershell
# Set environment variables
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
$env:VITE_SUPABASE_URL="https://your-project.supabase.co"

# Run the script
npx tsx scripts/add-test-user-to-all-communities.ts
```

### Mac/Linux

```bash
# Set environment variables
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export VITE_SUPABASE_URL="https://your-project.supabase.co"

# Run the script
npx tsx scripts/add-test-user-to-all-communities.ts
```

## What Test User Can Do After Running This Script

Once Test User is added to all communities, they can:

✅ **View all community content**
- See all posts, comments, and reactions
- Access member-only content

✅ **Create posts**
- Post in any community they're a member of
- Create text, media, poll, event, article, and announcement posts

✅ **Comment on posts**
- Add comments to any post in communities they're a member of
- Reply to other comments

✅ **React to posts and comments**
- Like posts/comments
- Mark posts/comments as Helpful
- Mark posts/comments as Insightful

✅ **Access member-only features**
- View private community content
- Participate in member-only discussions

## Example Output

```
Adding Test User to all communities...

Step 1: Finding Test User...
✓ Found Test User:
  ID: xxxxx-xxxx-xxxx-xxxx-xxxxx
  Username: Test User
  Email: testuser@example.com

Step 2: Fetching all communities...
✓ Found 5 communities

Step 3: Checking existing memberships...
✓ Test User is currently a member of 2 communities

Step 4: Adding Test User to 3 communities...

✓ Successfully added Test User to 3 communities

========================================
✓ Summary
========================================

Test User: Test User (testuser@example.com)
Total Communities: 5
Memberships Added: 3
Total Memberships: 5

Communities Test User is now a member of:
  ✓ 1. Community A (Public)
  ✓ 2. Community B (Private)
  🆕 3. Community C (Public)
  🆕 4. Community D (Public)
  🆕 5. Community E (Private)

Step 5: Verifying permissions...
✓ Permissions verified:
  - Can view all communities (member)
  - Can create posts in communities
  - Can comment on posts
  - Can react to posts and comments
  - Can view member-only content

========================================
✓ Test User is now a member of all communities!
========================================
```

## Troubleshooting

### Error: "Test User not found"

**Solution**: Create Test User first:
```bash
npx tsx scripts/create-test-user.ts
```

### Error: "No communities found"

**Solution**: Create some communities in your Supabase project first, then run this script again.

### Error: "Missing SUPABASE_SERVICE_ROLE_KEY"

**Solution**: Set the environment variable:
```powershell
# PowerShell
$env:SUPABASE_SERVICE_ROLE_KEY="your-key-here"
```

### Error: "Missing VITE_SUPABASE_URL"

**Solution**: Set the environment variable:
```powershell
# PowerShell
$env:VITE_SUPABASE_URL="https://your-project.supabase.co"
```

## Notes

- The script uses the service role key to bypass RLS policies
- Membership checks for interactions are handled in the application layer
- Test User must be authenticated (signed in) to perform interactions
- The script is idempotent - running it multiple times is safe


