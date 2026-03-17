# Latest Updates Section - Now Dynamic!

## What Changed

The "Latest Updates" carousel section on the home page now fetches data dynamically from your Knowledge Hub Supabase database instead of using static TypeScript files.

## How It Works Now

### Data Source
- **Database**: Knowledge Hub Supabase (`jmhtrffmxjxhoxpesubv`)
- **Table/View**: `v_media_all`
- **Filter**: 
  - `status = 'Approved'`
  - Excludes `type = 'Guideline'` and `type = 'Blueprint'`
  - Shows only news, announcements, and insights
- **Limit**: Shows up to 8 latest items
- **Auto-rotation**: Changes every 5 seconds

### What Shows Up
The carousel will display:
- ✅ News items (type: 'News', 'Announcement')
- ✅ Insights/Blogs (type: 'Thought Leadership', 'Blog')
- ❌ Guidelines (filtered out - they show in Knowledge Hub tabs)
- ❌ Blueprints (filtered out)

### CTA Buttons
When users click the button on a carousel item:
- **News**: "READ STORY" → Goes to `/marketplace/guides`
- **Insights**: "READ INSIGHT" → Goes to `/marketplace/guides`

The marketplace guides page shows the full list of all items where users can explore more.

## Adding New Content

To add a new item to the "Latest Updates" carousel:

1. Go to Knowledge Hub Supabase SQL Editor
2. Insert into `guides` table:
   ```sql
   INSERT INTO guides (
     title,
     slug,
     description,
     type,
     status,
     date,
     image_url,
     source,
     author_name
   ) VALUES (
     'Your News Title',
     'your-news-slug',
     'Brief description of the news...',
     'News', -- or 'Thought Leadership' for insights
     'Approved',
     '2025-02-27',
     'https://your-image-url.com/image.jpg',
     'DQ Communications',
     'Author Name'
   );
   ```
3. The item will automatically appear in the carousel (newest first)

## Files Modified

- `src/components/FeaturedNationalProgram.tsx`
  - Removed static data imports
  - Added Knowledge Hub Supabase client
  - Fetches from `v_media_all` view
  - Filters out guidelines and blueprints
  - Transforms data to carousel format

## Benefits

1. ✅ **Always Up-to-Date**: Shows latest content automatically
2. ✅ **No Code Deployment**: Add new items via database only
3. ✅ **Consistent Source**: Same database as Knowledge Hub tabs
4. ✅ **Easy Management**: Update content in one place

## Fallback

If the database is unavailable, the carousel shows a fallback welcome message:
- "Welcome to the Digital Workspace"
- Links to marketplace guides

## Testing

To verify it's working:
1. Refresh the home page
2. Check browser console for any errors
3. Verify carousel shows latest items from database
4. Click CTA buttons to ensure they go to `/marketplace/guides`
5. Wait 5 seconds to see auto-rotation

## Next Steps

When you merge to develop:
- ✅ Latest Updates will be dynamic
- ✅ New items added to Knowledge Hub database will show automatically
- ✅ No need to update code to add new news/announcements
