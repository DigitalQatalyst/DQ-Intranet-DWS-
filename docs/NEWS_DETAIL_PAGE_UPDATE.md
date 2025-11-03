# News Detail Page - Supabase Integration Update

## Overview
Updated `NewsDetailPage.tsx` to fetch all fields from the `news_articles_with_details` Supabase view instead of using mock data.

## Changes Made

### 1. **Imports Updated**
- Added Supabase service imports: `fetchNewsArticle`, `fetchRelatedArticles`
- Added TypeScript type: `NewsArticleWithDetails`
- Added additional icons for stats display: `Eye`, `Heart`, `ThumbsUp`, `Lightbulb`, `PartyPopper`

### 2. **State Management**
```typescript
// Before
const [item, setItem] = useState<NewsItem | null>(null);
const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);

// After
const [item, setItem] = useState<NewsArticleWithDetails | null>(null);
const [relatedNews, setRelatedNews] = useState<NewsArticleWithDetails[]>([]);
const [error, setError] = useState<string | null>(null);
```

### 3. **Data Fetching**
Replaced mock data with Supabase API calls:

```typescript
useEffect(() => {
  const loadArticle = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch the article (by ID or slug)
      const article = await fetchNewsArticle(id);
      
      if (article) {
        setItem(article);
        
        // Fetch related articles
        const related = await fetchRelatedArticles(article.id, article.category_id);
        setRelatedNews(related);
      } else {
        setError('Article not found');
      }
    } catch (err) {
      console.error('Error loading article:', err);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };
  
  loadArticle();
}, [id]);
```

### 4. **Field Mapping**

| UI Element | Database Field | Notes |
|------------|----------------|-------|
| Title | `title` | Direct mapping |
| Description | `description` | Direct mapping |
| Content | `content` | Rendered as HTML |
| Image | `featured_image_url` | Was `image` |
| Published Date | `published_at` | Was `date` |
| Category | `category_name` | Was `category` |
| Category Color | `category_color` | NEW - Used for badge styling |
| Tags | `tags[]` | Array of objects with `id` and `name` |
| Publisher | `publisher_name` + `publisher_department` | Combined display |
| Views | `views_count` | NEW - Displayed with Eye icon |
| Comments | `comment_count` | NEW - Displayed when > 0 |
| Reactions | `reaction_counts` | NEW - Aggregated total |
| Status | `status` | NEW - Shown in News Info box |
| Featured | `is_featured` | NEW - Badge in News Info |
| Pinned | `is_pinned` | NEW - Badge in News Info |

### 5. **New Features Added**

#### **Stats Display**
Shows article engagement metrics:
- View count with eye icon
- Comment count (when > 0)
- Reaction count (when > 0)

```tsx
<div className="flex items-center gap-4 text-sm text-gray-600">
  <span className="flex items-center gap-1">
    <Eye size={16} />
    {item.views_count.toLocaleString()} views
  </span>
  {item.comment_count > 0 && (
    <span className="flex items-center gap-1">
      💬 {item.comment_count} comments
    </span>
  )}
  {/* ... reactions ... */}
</div>
```

#### **Dynamic Category Badges**
Uses category color from database:

```tsx
<span 
  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
  style={{
    backgroundColor: item.category_color ? `${item.category_color}20` : '#DBEAFE',
    color: item.category_color || '#1E40AF'
  }}
>
  {item.category_name}
</span>
```

#### **Enhanced News Info Box**
Now displays:
- Category (from database)
- Status (draft/review/published/archived)
- Published date
- Publisher with department
- Featured badge (if `is_featured`)
- Pinned badge (if `is_pinned`)

#### **HTML Content Rendering**
Article content from database is rendered as HTML:

```tsx
<div 
  className="prose max-w-none"
  dangerouslySetInnerHTML={{ __html: item.content }}
/>
```

### 6. **Related News**
Updated to use `featured_image_url` instead of `image`:

```tsx
{relatedItem.featured_image_url ? (
  <img
    src={relatedItem.featured_image_url}
    alt={relatedItem.title}
    className="w-full h-full object-cover"
  />
) : (
  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
)}
```

## Database Fields Used

All fields from `news_articles_with_details` view are now queried and utilized:

### **Core Fields**
- ✅ `id` - Article identifier
- ✅ `title` - Article title
- ✅ `slug` - URL-friendly slug
- ✅ `description` - Short description
- ✅ `content` - Full HTML content
- ✅ `excerpt` - Optional excerpt (not currently displayed)
- ✅ `featured_image_url` - Main article image

### **Metadata Fields**
- ✅ `category_id` - For fetching related articles
- ✅ `author_id` - Stored (not displayed yet)
- ✅ `publisher_name` - Displayed in News Info
- ✅ `publisher_department` - Combined with publisher_name
- ✅ `status` - Displayed in News Info
- ✅ `published_at` - Formatted and displayed
- ✅ `views_count` - Displayed with stats
- ✅ `is_featured` - Badge in News Info
- ✅ `is_pinned` - Badge in News Info
- ✅ `metadata` - Stored (not displayed yet)
- ✅ `created_at` - Available (not displayed)
- ✅ `updated_at` - Available (not displayed)

### **Joined Fields**
- ✅ `category_name` - Category display name
- ✅ `category_color` - For badge styling
- ✅ `category_icon` - Available (not displayed yet)
- ✅ `tags` - Array of tag objects
- ✅ `reaction_counts` - Aggregated reactions
- ✅ `comment_count` - Total comments

## Error Handling

Added comprehensive error handling:
- Loading state with spinner
- Error state with message
- Not found state with back button
- Try-catch blocks for async operations

## Future Enhancements

### Potential Additions:
1. **Author Information**
   - Display author name and avatar
   - Link to author profile

2. **Category Icon**
   - Use `category_icon` field for visual representation

3. **Metadata Display**
   - Show custom metadata if present

4. **Timestamps**
   - Show "Last updated" using `updated_at`
   - Show "Published" vs "Created" dates

5. **Reactions UI**
   - Interactive reaction buttons
   - Show breakdown by reaction type (like, love, insightful, celebrate)

6. **Comments Section**
   - Display existing comments
   - Add comment form for authenticated users

7. **Bookmark Integration**
   - Connect to user authentication
   - Persist bookmark state

8. **Share Functionality**
   - Social media sharing
   - Copy link to clipboard

## Testing Checklist

- [ ] Article loads correctly from Supabase
- [ ] All fields display properly
- [ ] Images render correctly
- [ ] HTML content renders safely
- [ ] Related articles show up
- [ ] Stats display accurately
- [ ] Category colors apply correctly
- [ ] Featured/Pinned badges show when applicable
- [ ] Error states work correctly
- [ ] Loading states work correctly
- [ ] Navigation works (breadcrumbs, back button)
- [ ] Responsive design maintained

## Notes

- The `dangerouslySetInnerHTML` is used for content rendering. Ensure content is sanitized on the backend.
- Bookmark functionality is stubbed out pending user authentication implementation.
- Some unused icons (Heart, ThumbsUp, Lightbulb, PartyPopper) are imported for future reaction feature.
