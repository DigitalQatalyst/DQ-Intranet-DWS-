# Create Test User Script

This script creates a test user for authentication testing in the Communities Marketplace.

## Test User Credentials

- **Email**: `testuser@example.com`
- **Password**: `TestUser123!`

## Prerequisites

1. **Supabase Service Role Key**: You need the service role key (not the anon key) to create users via the admin API.

   - Get it from: Supabase Dashboard → Project Settings → API → `service_role` key
   - Set it as an environment variable: `SUPABASE_SERVICE_ROLE_KEY`

2. **Supabase URL**: Your Supabase project URL
   - Set as: `VITE_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`

## Usage

### Option 1: TypeScript (if you have tsx installed)

```bash
# Install tsx if needed
npm install -g tsx

# Set environment variables
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export VITE_SUPABASE_URL="https://your-project.supabase.co"

# Run the script
npx tsx scripts/create-test-user.ts
```

### Option 2: JavaScript (Node.js)

```bash
# Set environment variables
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export VITE_SUPABASE_URL="https://your-project.supabase.co"

# Run the script
node scripts/create-test-user.js
```

### Option 3: Using .env file

Create a `.env` file in the project root:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
VITE_SUPABASE_URL=https://your-project.supabase.co
```

Then run:
```bash
# For TypeScript
npx tsx scripts/create-test-user.ts

# For JavaScript
node scripts/create-test-user.js
```

## What the Script Does

1. **Checks if user exists** in `auth.users` table
   - If exists: Resets password to `TestUser123!`
   - If not: Creates new user with email confirmation

2. **Creates/Updates profile** in `users_local` table
   - Sets username to "Test User"
   - Sets role to "member"
   - Links to the auth user via `id` field

3. **Outputs credentials** for testing

## Security Note

⚠️ **Important**: The service role key has admin privileges and bypasses RLS. Keep it secure and never commit it to version control.

## Troubleshooting

### Error: "Missing SUPABASE_SERVICE_ROLE_KEY"
- Make sure you've set the environment variable
- Use the `service_role` key, not the `anon` key

### Error: "Missing VITE_SUPABASE_URL"
- Set the environment variable with your Supabase project URL
- Format: `https://xxxxx.supabase.co`

### Error: "User creation failed"
- Check that your Supabase project is active
- Verify the service role key is correct
- Check Supabase dashboard for any project restrictions

## Testing the User

After running the script, you can test login:

1. Go to the Communities Marketplace login page
2. Enter:
   - Email: `testuser@example.com`
   - Password: `TestUser123!`
3. You should be able to sign in and access all authenticated features


