# Marketplace Setup Instructions

## 1. Run the Schema
Execute this in your Supabase SQL Editor:
```sql
-- Copy and paste the contents of marketplace-schema.sql
```

## 2. Seed the Data
Execute this in your Supabase SQL Editor:
```sql
-- Copy and paste the contents of seed-marketplace.sql
```

## 3. Environment Variables
Your .env file should contain:
```
REACT_APP_SUPABASE_URL=https://jmhtrffmxjxhoxpesubv.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaHRyZmZteGp4aG94cGVzdWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzY3MjQsImV4cCI6MjA3ODA1MjcyNH0.LBQJNajOc8bWMt1Q_fj0Z_-fisUngLRrw2VSN-xrtR8
```

## 4. Verify Tables
After running the SQL, you should see:
- `news` table with 18 records (including your 3 new announcements)
- `jobs` table with 5 records

## 5. Test the Application
- Start your dev server: `npm run dev`
- Navigate to the marketplace
- All three tabs should now fetch data from Supabase
- Detail pages should show full content from the `content` field
