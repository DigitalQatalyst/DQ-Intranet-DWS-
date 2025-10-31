# Supabase Communities Setup

This directory contains SQL scripts to set up the database schema and seed data for the Communities feature (`/communities` and `/communities/feed` routes).

## Files

1. **communities_schema.sql** - Creates all tables, views, functions, and indexes
2. **communities_seed_data.sql** - Inserts sample data for testing

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. **Login to your Supabase project**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run Schema Script**
   - Copy the entire contents of `communities_schema.sql`
   - Paste into the SQL editor
   - Click "Run" or press `Ctrl+Enter`
   - Wait for completion (should take 10-30 seconds)

4. **Run Seed Data Script**
   - Create a new query
   - Copy the entire contents of `communities_seed_data.sql`
   - Paste into the SQL editor
   - Click "Run"
   - You should see a summary table showing counts of created records

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project (replace with your project ref)
supabase link --project-ref your-project-ref

# Run schema migration
supabase db push --db-url "your-database-url"

# Or execute SQL files directly
psql "your-database-connection-string" -f db/supabase/communities_schema.sql
psql "your-database-connection-string" -f db/supabase/communities_seed_data.sql
```

### Option 3: Using psql Command Line

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run the schema file
\i db/supabase/communities_schema.sql

# Run the seed data file
\i db/supabase/communities_seed_data.sql
```

## Verification

After running both scripts, verify the setup:

```sql
-- Check tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('communities', 'posts', 'users_local', 'memberships');

-- Check views were created
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';

-- Check functions were created
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';

-- Verify data was seeded
SELECT 
    (SELECT COUNT(*) FROM users_local) as users,
    (SELECT COUNT(*) FROM communities) as communities,
    (SELECT COUNT(*) FROM posts) as posts,
    (SELECT COUNT(*) FROM memberships) as memberships;
```

## Sample Users

The seed data creates these test users (all with placeholder passwords):

| Email | Username | Role | Use Case |
|-------|----------|------|----------|
| admin@digitalqatalyst.com | admin_user | admin | Full admin access |
| sarah.smith@digitalqatalyst.com | sarah_smith | moderator | Community moderation |
| john.doe@digitalqatalyst.com | john_doe | member | Regular user |
| mike.johnson@digitalqatalyst.com | mike_j | member | Regular user |
| emma.wilson@digitalqatalyst.com | emma_w | member | Regular user |

**Note:** The passwords are hashed placeholders. You'll need to either:
1. Update passwords using your authentication system
2. Create new users through your app's signup flow
3. Manually update the password hashes with bcrypt-generated values

## Sample Communities

- **Tech Innovators Abu Dhabi** - Technology community (245+ members)
- **Digital Transformation Hub** - Business/Enterprise (189+ members)
- **Startup Ecosystem UAE** - Entrepreneurship (312+ members)
- **AI & Machine Learning** - AI/ML focused
- **Creative Designers Network** - Design community
- **Data Science Community** - Data analytics

## Key Features Enabled

✅ Communities listing with member counts (`/communities`)  
✅ Community feed with posts (`/communities/feed`)  
✅ Post reactions (helpful, insightful)  
✅ Comments on posts  
✅ User memberships and roles  
✅ Trending topics function  
✅ Moderation capabilities  
✅ Row Level Security (RLS) policies  

## Troubleshooting

### Error: "relation already exists"
- The script includes `IF NOT EXISTS` clauses, but if you need a clean slate:
```sql
-- Drop all tables (WARNING: This deletes all data!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### Error: "type already exists"
- The script handles this with `DO $$ BEGIN ... EXCEPTION` blocks
- You can safely ignore these warnings

### RLS Policies Not Working
- Make sure RLS is enabled on tables:
```sql
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

### Function Not Found
- Check if functions were created:
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_name = 'get_feed';
```

## Next Steps

1. Update your `.env` file with the new Supabase credentials
2. Test the `/communities` route - should show 6 communities
3. Test the `/communities/feed` route - should show recent posts
4. Create a new user through your app's authentication
5. Test joining communities and creating posts

## Database Schema Overview

### Core Tables
- `users_local` - User accounts
- `communities` - Community definitions
- `memberships` - User-community relationships
- `posts` - Community posts
- `comments` - Post comments
- `reactions` - Post reactions (helpful, insightful)

### Supporting Tables
- `notifications` - User notifications
- `messages` - Direct messages
- `conversations` - Message threads
- `reports` - Content reports
- `moderation_actions` - Moderation history
- `events` - Community events
- `media_files` - Uploaded media

### Views
- `communities_with_counts` - Communities with member counts
- `posts_with_reactions` - Posts with reaction counts
- `posts_with_meta` - Posts with basic metadata

### Functions
- `get_feed()` - Main feed query function
- `get_trending_topics()` - Get popular tags
- `can_moderate()` - Check moderation permissions
- `get_community_members()` - List community members

## Security Notes

⚠️ **Important Security Considerations:**

1. **Update Passwords**: The seed data uses placeholder password hashes. Update these before production use.

2. **RLS Policies**: Basic RLS policies are included but should be reviewed and enhanced for your specific security requirements.

3. **API Keys**: Never commit your Supabase anon key or service role key to version control.

4. **Environment Variables**: Ensure your `.env` file is in `.gitignore`.

## Support

For issues or questions:
- Check Supabase docs: https://supabase.com/docs
- Review the TypeScript types in `src/communities/integrations/supabase/types.ts`
- Check application logs for detailed error messages
