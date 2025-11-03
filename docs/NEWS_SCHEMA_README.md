# News & Announcements Database Schema

## Overview
This document describes the Supabase database schema for the Digital Qatalyst News & Announcements feature.

## Tables

### 1. `news_categories`
Stores news article categories (e.g., Technology, Company, Events).

**Columns:**
- `id` (UUID, PK): Unique identifier
- `name` (VARCHAR): Category name (unique)
- `description` (TEXT): Category description
- `icon` (VARCHAR): Icon name (Lucide icon)
- `color` (VARCHAR): Hex color code for UI
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Default Categories:**
- Technology
- Company
- Events
- Achievement
- Security
- Facilities
- HR
- Training

---

### 2. `news_tags`
Stores tags that can be applied to articles for better categorization.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `name` (VARCHAR): Tag name (unique)
- `created_at` (TIMESTAMP): Creation timestamp

**Default Tags:**
- AI, Innovation, Town Hall, Leadership, Team Building, Award, Recognition, Training, Compliance, Office, Expansion, etc.

---

### 3. `news_articles`
Main table for storing news articles and announcements.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `title` (VARCHAR): Article title
- `slug` (VARCHAR): URL-friendly slug (unique)
- `description` (TEXT): Short description/excerpt
- `content` (TEXT): Full article content (supports HTML/Markdown)
- `excerpt` (TEXT): Optional custom excerpt
- `featured_image_url` (TEXT): URL to featured image
- `category_id` (UUID, FK): Reference to category
- `author_id` (UUID, FK): Reference to auth.users
- `publisher_name` (VARCHAR): Publisher name (default: 'Digital Qatalyst')
- `publisher_department` (VARCHAR): Department name
- `status` (VARCHAR): Article status (draft, review, published, archived)
- `published_at` (TIMESTAMP): Publication date
- `views_count` (INTEGER): Number of views
- `is_featured` (BOOLEAN): Featured article flag
- `is_pinned` (BOOLEAN): Pinned to top flag
- `metadata` (JSONB): Additional metadata
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Status Values:**
- `draft`: Article is being written
- `review`: Article is under review
- `published`: Article is live
- `archived`: Article is archived

---

### 4. `news_article_tags`
Junction table for many-to-many relationship between articles and tags.

**Columns:**
- `article_id` (UUID, FK): Reference to news_articles
- `tag_id` (UUID, FK): Reference to news_tags
- **Composite PK:** (article_id, tag_id)

---

### 5. `news_bookmarks`
Stores user bookmarks for articles.

**Columns:**
- `id` (UUID, PK): Unique identifier
- `user_id` (UUID, FK): Reference to auth.users
- `article_id` (UUID, FK): Reference to news_articles
- `created_at` (TIMESTAMP): Creation timestamp
- **Unique constraint:** (user_id, article_id)

---

### 6. `news_comments`
Stores user comments on articles (supports nested comments).

**Columns:**
- `id` (UUID, PK): Unique identifier
- `article_id` (UUID, FK): Reference to news_articles
- `user_id` (UUID, FK): Reference to auth.users
- `parent_comment_id` (UUID, FK): Reference to parent comment (for replies)
- `content` (TEXT): Comment content
- `is_edited` (BOOLEAN): Edit flag
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

---

### 7. `news_reactions`
Stores user reactions to articles (like, love, insightful, celebrate).

**Columns:**
- `id` (UUID, PK): Unique identifier
- `article_id` (UUID, FK): Reference to news_articles
- `user_id` (UUID, FK): Reference to auth.users
- `reaction_type` (VARCHAR): Type of reaction
- `created_at` (TIMESTAMP): Creation timestamp
- **Unique constraint:** (user_id, article_id, reaction_type)

**Reaction Types:**
- `like`: Standard like
- `love`: Love reaction
- `insightful`: Insightful content
- `celebrate`: Celebrate achievement

---

## Views

### `news_articles_with_details`
Aggregated view combining articles with related data (categories, tags, reactions, comments).

**Additional Fields:**
- `category_name`: Category name
- `category_color`: Category color
- `category_icon`: Category icon
- `tags`: JSON array of tags
- `reaction_counts`: JSON object with reaction counts
- `comment_count`: Total number of comments

---

## Functions

### `increment_article_views(article_uuid UUID)`
Increments the view count for an article.

**Usage:**
```sql
SELECT increment_article_views('article-uuid-here');
```

---

## Row Level Security (RLS)

### Categories & Tags
- **Read:** Public (anyone can view)
- **Write:** Admins only

### Articles
- **Read:** Anyone can view published articles; authors and admins can view drafts
- **Create:** Authenticated users (becomes author)
- **Update:** Authors can update their own articles; admins can update any
- **Delete:** Admins only

### Bookmarks
- **Read/Create/Delete:** Users can only manage their own bookmarks

### Comments
- **Read:** Public
- **Create:** Authenticated users
- **Update:** Users can update their own comments
- **Delete:** Users can delete their own; admins can delete any

### Reactions
- **Read:** Public
- **Create:** Authenticated users
- **Delete:** Users can delete their own reactions

---

## Indexes

Performance indexes are created on:
- `news_articles.category_id`
- `news_articles.author_id`
- `news_articles.status`
- `news_articles.published_at` (DESC)
- `news_articles.slug`
- Full-text search on title, description, and content
- `news_bookmarks.user_id`
- `news_comments.article_id`
- `news_reactions.article_id`

---

## Usage Examples

### Fetch Published Articles
```typescript
import { fetchNewsArticles } from '@/services/newsService';

const { articles, total } = await fetchNewsArticles(
  { status: 'published' },
  1, // page
  12  // limit
);
```

### Fetch Single Article
```typescript
import { fetchNewsArticle } from '@/services/newsService';

const article = await fetchNewsArticle('article-slug-or-uuid');
```

### Toggle Bookmark
```typescript
import { toggleBookmark } from '@/services/newsService';

const isBookmarked = await toggleBookmark(articleId, userId);
```

### Add Comment
```typescript
import { addComment } from '@/services/newsService';

const comment = await addComment(
  articleId,
  userId,
  'Great article!',
  parentCommentId // optional, for replies
);
```

### Add Reaction
```typescript
import { toggleReaction } from '@/services/newsService';

const hasReaction = await toggleReaction(
  articleId,
  userId,
  'like'
);
```

---

## Migration

To apply this schema to your Supabase project:

1. Navigate to your Supabase project dashboard
2. Go to SQL Editor
3. Copy the contents of `supabase/migrations/create_news_schema.sql`
4. Run the migration

Or use Supabase CLI:
```bash
supabase db push
```

---

## Future Enhancements

Potential features to add:
- Article versioning/history
- Draft autosave
- Article scheduling
- Email notifications for new articles
- Article analytics dashboard
- Rich text editor integration
- Image upload and management
- Article series/collections
- User mentions in comments
- Comment moderation queue
