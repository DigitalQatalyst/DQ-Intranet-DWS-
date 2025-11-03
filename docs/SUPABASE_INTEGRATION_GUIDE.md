# Supabase Integration Guide for News & Announcements

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Run Database Migrations

Execute the schema migration in your Supabase SQL Editor:

```bash
# Copy the contents of supabase/migrations/create_news_schema.sql
# and run it in your Supabase project's SQL Editor
```

Or using Supabase CLI:
```bash
supabase db push
```

### 3. Seed the Database

Run the seed file to populate with initial data:

```bash
# Copy the contents of supabase/seed.sql
# and run it in your Supabase project's SQL Editor
```

### 4. Update NewsPage Component

The NewsPage has been updated to fetch from Supabase. Key changes:

**Before (Mock Data):**
```typescript
const items = [
  { id: '1', title: '...', ... },
  // ... more items
];
```

**After (Supabase):**
```typescript
const [items, setItems] = useState<NewsArticleWithDetails[]>([]);

useEffect(() => {
  const loadData = async () => {
    const { articles } = await fetchNewsArticles({ status: 'published' });
    setItems(articles);
  };
  loadData();
}, []);
```

### 5. Update NewsCard Component

The NewsCard component needs to handle the Supabase data structure:

**Key Mapping:**
- `item.date` → `item.published_at`
- `item.category` → `item.category_name`
- `item.image` → `item.featured_image_url`
- `item.tags` → `item.tags` (array of objects with `name` property)
- `item.provider.name` → `item.publisher_name + ' • ' + item.publisher_department`

### 6. Update Filters

**Categories:**
Replace hardcoded categories with dynamic ones from Supabase:
```typescript
const [categories, setCategories] = useState<NewsCategory[]>([]);

useEffect(() => {
  const loadCategories = async () => {
    const cats = await fetchNewsCategories();
    setCategories(cats);
  };
  loadCategories();
}, []);

// In JSX:
{categories.map((category) => (
  <button
    key={category.id}
    onClick={() => handleCategoryClick(category.id)}
  >
    {category.name}
  </button>
))}
```

**Tags:**
Replace hardcoded tags with dynamic ones:
```typescript
const [tags, setTags] = useState<NewsTag[]>([]);

useEffect(() => {
  const loadTags = async () => {
    const tagsList = await fetchNewsTags();
    setTags(tagsList);
  };
  loadTags();
}, []);

// In JSX:
{tags.map((tag) => (
  <button
    key={tag.id}
    onClick={() => handleTagClick(tag.name)}
  >
    {tag.name}
  </button>
))}
```

### 7. Update NewsDetailPage

Similar changes needed for NewsDetailPage:

```typescript
const [item, setItem] = useState<NewsArticleWithDetails | null>(null);
const [relatedNews, setRelatedNews] = useState<NewsArticleWithDetails[]>([]);

useEffect(() => {
  const loadArticle = async () => {
    const article = await fetchNewsArticle(id!);
    if (article) {
      setItem(article);
      const related = await fetchRelatedArticles(article.id, article.category_id);
      setRelatedNews(related);
    }
  };
  loadArticle();
}, [id]);
```

## Data Structure Mapping

### From Mock Data to Supabase

| Mock Field | Supabase Field | Type | Notes |
|------------|----------------|------|-------|
| `id` | `id` | UUID | Same |
| `title` | `title` | string | Same |
| `description` | `description` | string | Same |
| `date` | `published_at` | timestamp | Format with `formatDate()` |
| `category` | `category_name` | string | From joined view |
| `tags` | `tags` | Tag[] | Array of `{ id, name }` objects |
| `image` | `featured_image_url` | string | Same concept |
| `provider.name` | `publisher_name` + `publisher_department` | string | Combine both fields |

## Testing

1. **Verify Supabase Connection:**
   - Check browser console for any connection errors
   - Verify environment variables are loaded

2. **Test Data Fetching:**
   - Navigate to `/marketplace/opportunities`
   - Should see 6 seeded articles
   - Check network tab for Supabase API calls

3. **Test Filters:**
   - Click on categories - should filter articles
   - Click on tags - should filter articles
   - Search - should filter by title/description

4. **Test Detail Page:**
   - Click "Read More" on any article
   - Should navigate to detail page
   - Should show full content
   - Should show related articles

## Troubleshooting

### Issue: "Failed to load news articles"
- **Solution:** Check Supabase URL and anon key in `.env`
- **Solution:** Verify RLS policies are set correctly
- **Solution:** Check browser console for specific error

### Issue: No articles showing
- **Solution:** Run the seed.sql file
- **Solution:** Check article status is 'published'
- **Solution:** Verify `published_at` is not in the future

### Issue: TypeScript errors
- **Solution:** Ensure all type imports are correct
- **Solution:** Update `NewsItem` interface to match `NewsArticleWithDetails`

## Next Steps

1. **Add User Authentication:**
   - Implement Supabase Auth
   - Enable bookmarks and comments for logged-in users

2. **Add Admin Panel:**
   - Create/Edit/Delete articles
   - Manage categories and tags
   - Moderate comments

3. **Add Real-time Updates:**
   - Use Supabase real-time subscriptions
   - Show new articles without refresh

4. **Add Rich Text Editor:**
   - Integrate TipTap or similar
   - Support for formatting, images, embeds

5. **Add Analytics:**
   - Track article views
   - Popular articles widget
   - User engagement metrics
