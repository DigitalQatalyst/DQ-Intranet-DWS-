# 🚀 Using the Supabase Approach (Like the Other Website)

## What Changed?

I've updated your KnowledgeHub component to work **exactly like the other website** you showed me:

### Before (Local Data)
- ❌ Used local TypeScript files
- ❌ Static content
- ❌ Manual updates needed

### After (Supabase Approach)
- ✅ Fetches from Supabase `v_media_all` view
- ✅ Dynamic content
- ✅ Real-time updates when you add content to database
- ✅ Filters by tags (Guidelines, Learning)
- ✅ Only shows "Approved" status items

## How It Works Now

```typescript
// Fetches from Supabase view
const { data } = await supabase
  .from('v_media_all')
  .select('*')
  .eq('status', 'Approved')
  .order('date', { ascending: false })
  .limit(100);

// Filters by tags
Guidelines: tags include 'Guidelines', 'Policy'
Learning: tags include 'Learning', 'Course', 'Training'
```

## Setup Steps (5 minutes)

### Step 1: Create the Database Table
```bash
# In Supabase SQL Editor:
# https://supabase.com/dashboard/project/faqystypjlxqvgkhnbyq/sql/new
```

Run these scripts **in order**:

1. **Create table:** `db/supabase/00_create_guides_table.sql`
2. **Create view:** `db/supabase/02_create_media_view.sql`
3. **Insert sample content:** `db/supabase/03_insert_sample_content.sql`

### Step 2: Verify Data
```bash
node test-supabase-connection.js
```

You should see:
- ✅ Guides table: EXISTS
- ✅ View created: v_media_all

### Step 3: Test in Browser
```bash
npm run dev
```

Visit: http://localhost:3004

Scroll to "Latest DQ Developments" section - you should see:
- **Guidelines tab:** 3 sample guidelines
- **Learning tab:** 4 sample courses

## Adding New Content

To add new Guidelines or Learning content, just insert into Supabase:

### Add a Guideline
```sql
INSERT INTO public.guides (
  slug, 
  title, 
  excerpt, 
  body, 
  guide_type, 
  status, 
  tags
)
VALUES (
  'my-new-guideline',
  'My New Guideline Title',
  'Short description here',
  '# Full content here...',
  'Guidelines',
  'Approved',
  ARRAY['Guidelines', 'Policy', 'YourCategory']
);
```

### Add a Learning Course
```sql
INSERT INTO public.guides (
  slug, 
  title, 
  excerpt, 
  body, 
  guide_type, 
  status, 
  tags
)
VALUES (
  'my-new-course',
  'My New Course Title',
  'Course description here',
  '# Course content here...',
  'Thought Leadership',
  'Approved',
  ARRAY['Learning', 'Course', 'Training', 'YourTopic']
);
```

**Important:** 
- Set `status = 'Approved'` to make it visible
- Include appropriate tags for filtering
- The content will appear immediately (no code changes needed!)

## How Filtering Works

### Guidelines Tab Shows:
- Items with `type = 'Guidelines'`
- Items with tags containing: 'Guidelines', 'Policy'
- Items with `newsType = 'Policy Update'`

### Learning Tab Shows:
- Items with `type = 'Thought Leadership'`
- Items with tags containing: 'Learning', 'Course', 'Training', 'Education', 'Skill', 'Development'
- Items with keywords in title/excerpt: 'leadership', 'execution', 'learning', 'course', 'training', 'skill', 'growth', 'development'

## Benefits of This Approach

1. **Dynamic Content** - Add/update content without code changes
2. **Real-time** - Changes appear immediately after database update
3. **Scalable** - Can handle hundreds of items
4. **Filtered** - Automatically categorizes by tags
5. **Status Control** - Only shows "Approved" items
6. **Same as Other Site** - Uses proven pattern

## Database Structure

```
guides table
├── id (UUID)
├── slug (unique)
├── title
├── excerpt
├── body (full content)
├── guide_type ('Guidelines' or 'Thought Leadership')
├── domain (category)
├── status ('Approved', 'Draft', etc.)
├── tags (array) ← Used for filtering!
├── image (URL)
└── dates (created_at, updated_at)

v_media_all view
└── Provides unified interface for KnowledgeHub
```

## Testing

### Check what's in the database:
```sql
-- See all Guidelines
SELECT slug, title, tags 
FROM guides 
WHERE tags && ARRAY['Guidelines']
AND status = 'Approved';

-- See all Learning content
SELECT slug, title, tags 
FROM guides 
WHERE tags && ARRAY['Learning']
AND status = 'Approved';
```

### Check the view:
```sql
SELECT * FROM v_media_all 
WHERE status = 'Approved'
ORDER BY date DESC
LIMIT 10;
```

## Troubleshooting

### "No guides found"
- Check if table exists: `SELECT * FROM guides LIMIT 1;`
- Check if view exists: `SELECT * FROM v_media_all LIMIT 1;`
- Check status: Make sure items have `status = 'Approved'`
- Check tags: Make sure items have appropriate tags

### Content not showing in correct tab
- Check the tags array
- Guidelines need: 'Guidelines' or 'Policy' tag
- Learning needs: 'Learning', 'Course', or 'Training' tag

### Database connection error
- Verify `.env` has correct Supabase credentials
- Check Supabase dashboard is accessible
- Run: `node test-supabase-connection.js`

## Next Steps

1. ✅ Run the 3 SQL scripts
2. ✅ Verify data with test script
3. ✅ Test in browser
4. ✅ Add your own content
5. ✅ Merge to develop

This approach is production-ready and scales well!
