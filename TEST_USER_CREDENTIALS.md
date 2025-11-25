# Test User Credentials

## Login Credentials

**Email**: `testuser@example.com`  
**Password**: `TestUser123!`

## How to Create the Test User

Run the create-test-user script:

```bash
# Set environment variables first
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export VITE_SUPABASE_URL="https://your-project.supabase.co"

# Run the script
node scripts/create-test-user.js
```

Or with TypeScript:
```bash
npx tsx scripts/create-test-user.ts
```

## What Gets Created

1. **Supabase Auth User** (`auth.users` table)
   - Email: `testuser@example.com`
   - Password: `TestUser123!`
   - Email confirmed: Yes

2. **User Profile** (`users_local` table)
   - Username: `Test User`
   - Role: `member`
   - Linked to auth user via `id` field

## Testing

After running the script, you can:

1. Sign in to the Communities Marketplace
2. Join communities
3. Create posts, comments, and reactions
4. Test all authenticated features

## Notes

- If the user already exists, the script will reset the password to `TestUser123!`
- The script uses the Supabase Admin API (requires service role key)
- The user is automatically email-confirmed, so no email verification is needed


