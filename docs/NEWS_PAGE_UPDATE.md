# News Page - Supabase Integration Update

## Overview
Updated `NewsPage.tsx` to fetch and display all fields from the `news_articles` table (via `news_articles_with_details` view) from Supabase.

## Changes Made

### 1. **Removed Old Interface**
Removed the local `NewsItem` interface and now uses `NewsArticleWithDetails` from the types file.

### 2. **Updated NewsCard Component**

#### **Props Type**
```typescript
// Before
const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => {

// After
const NewsCard: React.FC<{ item: NewsArticleWithDetails }> = ({ item }) => {
```

#### **Field Mappings**
| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `item.image` | `item.featured_image_url` | Direct mapping |
| `item.date` | `item.published_at` | Formatted date |
| `item.category` | `item.category_name` | From joined view |
| `item.tags[0]` | `item.tags[0].name` | Array of objects |
| `item.provider.name` | `publisherDisplay` | Combines name + department |
| N/A | `item.views_count` | NEW - Shows view count |
| N/A | `item.is_featured` | NEW - Featured badge |
| N/A | `item.is_pinned` | NEW - Pinned badge |
| N/A | `item.category_color` | NEW - Dynamic badge colors |

### 3. **New Visual Features**

#### **Featured Badge**
Orange badge displayed on featured articles:
```tsx
{item.is_featured && (
  <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded shadow-md flex items-center gap-1">
    <Star size={12} fill="currentColor" />
    <span className="text-xs font-medium">Featured</span>
  </div>
)}
```

#### **Pinned Badge**
Purple badge displayed on pinned articles:
```tsx
{item.is_pinned && (
  <div className="absolute bottom-3 left-3 bg-purple-500 text-white px-2 py-1 rounded shadow-md flex items-center gap-1">
    <Pin size={12} />
    <span className="text-xs font-medium">Pinned</span>
  </div>
)}
```

#### **Dynamic Category Badge**
Uses `category_color` from database:
```tsx
<span 
  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  style={{
    backgroundColor: item.category_color ? `${item.category_color}20` : '#DBEAFE',
    color: item.category_color || '#1E40AF'
  }}
>
  {item.category_name}
</span>
```

#### **View Count Display**
Shows article views with eye icon:
```tsx
<div className="flex items-center gap-2">
  <Eye className="w-4 h-4" />
  <span>{item.views_count.toLocaleString()} views</span>
</div>
```

#### **Publisher Display**
Combines publisher name and department:
```tsx
const publisherDisplay = item.publisher_department 
  ? `${item.publisher_name || 'Digital Qatalyst'} • ${item.publisher_department}`
  : item.publisher_name || 'Digital Qatalyst';
```

### 4. **Dynamic Filters**

#### **Categories from Database**
```tsx
{categories.map((category) => (
  <button
    key={category.id}
    onClick={() => handleCategoryClick(category.id)}
    className={`block w-full text-left px-3 py-2 text-sm rounded ${category.id === selectedCategory ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'} transition`}
  >
    {category.name}
  </button>
))}
```

#### **Tags from Database**
```tsx
{tags.map((tag) => (
  <button
    key={tag.id}
    onClick={() => handleTagClick(tag.name)}
    className={`block w-full text-left px-3 py-2 text-sm rounded ${selectedTags.includes(tag.name) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'} transition`}
  >
    {tag.name}
  </button>
))}
```

### 5. **UI States**

#### **Loading State**
```tsx
{loading && (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading news articles...</p>
    </div>
  </div>
)}
```

#### **Error State**
```tsx
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
    <p className="font-medium">Error loading news</p>
    <p className="text-sm">{error}</p>
  </div>
)}
```

#### **Empty State**
```tsx
{filteredItems.length === 0 && !loading && (
  <div className="text-center py-12">
    <p className="text-gray-500 text-lg">No news articles found</p>
    <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search query</p>
  </div>
)}
```

## Database Fields Used

All fields from `news_articles` table are now queried through the `news_articles_with_details` view:

### **Core Fields** (Displayed)
- ✅ `id` - Article identifier
- ✅ `title` - Card title
- ✅ `description` - Card description (line-clamped to 2 lines)
- ✅ `featured_image_url` - Card image
- ✅ `published_at` - Formatted date display
- ✅ `views_count` - View count with icon
- ✅ `is_featured` - Featured badge
- ✅ `is_pinned` - Pinned badge

### **Metadata Fields** (Displayed)
- ✅ `publisher_name` - Combined with department
- ✅ `publisher_department` - Combined with name
- ✅ `category_name` - Category badge
- ✅ `category_color` - Badge styling
- ✅ `tags` - Tag display and filtering

### **Fields Available** (Not Currently Displayed)
- `slug` - Available for URL routing
- `content` - Full article content (shown on detail page)
- `excerpt` - Short excerpt
- `category_id` - Used for filtering
- `author_id` - Available for future use
- `status` - Used in query filter
- `metadata` - Available for custom data
- `created_at` - Available for sorting
- `updated_at` - Available for "last updated" display
- `category_icon` - Available for visual enhancement
- `reaction_counts` - Available for engagement display
- `comment_count` - Available for engagement display

## New Icons Added
- `Eye` - For view count
- `Star` - For featured badge
- `Pin` - For pinned badge

## Filter Behavior

### **Category Filter**
- Filters by `category_id`
- Displays `category_name`
- Populated from database

### **Tag Filter**
- Filters by tag names in `tags` array
- Multiple tags can be selected (AND logic)
- Populated from database

### **Search Filter**
- Searches in `title` and `description`
- Case-insensitive

## Performance Considerations

1. **Pagination**: Currently loads all articles (limit: 100). Consider implementing pagination for large datasets.
2. **Image Loading**: Consider lazy loading for images
3. **Filter Performance**: Client-side filtering works well for <1000 items. For larger datasets, consider server-side filtering.

## Future Enhancements

1. **Sorting Options**
   - By date (newest/oldest)
   - By views (most/least viewed)
   - By reactions

2. **Additional Filters**
   - By author
   - By date range
   - By status (for admins)

3. **Card Enhancements**
   - Show reaction counts
   - Show comment counts
   - Author avatar

4. **Infinite Scroll**
   - Load more articles on scroll
   - Better UX for large datasets

5. **Skeleton Loading**
   - Show skeleton cards while loading
   - Better perceived performance

## Testing Checklist

- [ ] Articles load from Supabase
- [ ] All fields display correctly
- [ ] Featured badge shows on featured articles
- [ ] Pinned badge shows on pinned articles
- [ ] Category colors apply correctly
- [ ] View count displays with proper formatting
- [ ] Publisher info shows correctly
- [ ] Category filter works
- [ ] Tag filter works (multiple selection)
- [ ] Search filter works
- [ ] Loading state displays
- [ ] Error state displays
- [ ] Empty state displays
- [ ] Images load correctly
- [ ] Navigation to detail page works
- [ ] Responsive design maintained
