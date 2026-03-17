import { supabase } from '@/lib/supabaseClient';
import type { 
  NewsArticle, 
  NewsArticleWithDetails, 
  NewsFilters, 
  NewsListResponse,
  NewsBookmark,
  NewsComment,
  NewsReaction,
  NewsCategory,
  NewsTag
} from '@/types/news';

/**
 * Fetch paginated news articles with filters
 */
export async function fetchNewsArticles(
  filters: NewsFilters = {},
  page: number = 1,
  limit: number = 12
): Promise<NewsListResponse> {
  let query = supabase
    .from('news_articles_with_details')
    .select('*', { count: 'exact' });

  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status);
  } else {
    // Default to published articles only
    query = query.eq('status', 'published');
  }

  if (filters.category) {
    query = query.eq('category_id', filters.category);
  }

  if (filters.is_featured !== undefined) {
    query = query.eq('is_featured', filters.is_featured);
  }

  if (filters.is_pinned !== undefined) {
    query = query.eq('is_pinned', filters.is_pinned);
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters.date_from) {
    query = query.gte('published_at', filters.date_from);
  }

  if (filters.date_to) {
    query = query.lte('published_at', filters.date_to);
  }

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching news articles:', error);
    throw error;
  }

  return {
    articles: (data as NewsArticleWithDetails[]) || [],
    total: count || 0,
    page,
    limit,
  };
}

/**
 * Fetch a single news article by ID or slug
 */
export async function fetchNewsArticle(
  idOrSlug: string
): Promise<NewsArticleWithDetails | null> {
  // Try to fetch by ID first, then by slug
  let query = supabase
    .from('news_articles_with_details')
    .select('*')
    .eq('status', 'published');

  // Check if it's a UUID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
  
  if (isUUID) {
    query = query.eq('id', idOrSlug);
  } else {
    query = query.eq('slug', idOrSlug);
  }

  const { data, error } = await query.single();

  if (error) {
    console.error('Error fetching news article:', error);
    return null;
  }

  // Increment view count
  if (data) {
    await incrementArticleViews(data.id);
  }

  return data as NewsArticleWithDetails;
}

/**
 * Increment article view count
 */
export async function incrementArticleViews(articleId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_article_views', {
    article_uuid: articleId,
  });

  if (error) {
    console.error('Error incrementing views:', error);
  }
}

/**
 * Fetch related articles based on category and tags
 */
export async function fetchRelatedArticles(
  articleId: string,
  categoryId?: string,
  limit: number = 3
): Promise<NewsArticleWithDetails[]> {
  let query = supabase
    .from('news_articles_with_details')
    .select('*')
    .eq('status', 'published')
    .neq('id', articleId);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  query = query
    .order('published_at', { ascending: false })
    .limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }

  return (data as NewsArticleWithDetails[]) || [];
}

/**
 * Fetch all categories
 */
export async function fetchNewsCategories(): Promise<NewsCategory[]> {
  const { data, error } = await supabase
    .from('news_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all tags
 */
export async function fetchNewsTags(): Promise<NewsTag[]> {
  const { data, error } = await supabase
    .from('news_tags')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }

  return data || [];
}

/**
 * Toggle bookmark for an article
 */
export async function toggleBookmark(
  articleId: string,
  userId: string
): Promise<boolean> {
  // Check if bookmark exists
  const { data: existing } = await supabase
    .from('news_bookmarks')
    .select('id')
    .eq('article_id', articleId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    // Remove bookmark
    const { error } = await supabase
      .from('news_bookmarks')
      .delete()
      .eq('id', existing.id);

    if (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
    return false;
  } else {
    // Add bookmark
    const { error } = await supabase
      .from('news_bookmarks')
      .insert({ article_id: articleId, user_id: userId });

    if (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
    return true;
  }
}

/**
 * Check if article is bookmarked by user
 */
export async function isArticleBookmarked(
  articleId: string,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('news_bookmarks')
    .select('id')
    .eq('article_id', articleId)
    .eq('user_id', userId)
    .single();

  return !!data;
}

/**
 * Fetch user's bookmarked articles
 */
export async function fetchUserBookmarks(
  userId: string
): Promise<NewsArticleWithDetails[]> {
  const { data, error } = await supabase
    .from('news_bookmarks')
    .select(`
      article_id,
      news_articles_with_details (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }

  return data?.map((b: any) => b.news_articles_with_details) || [];
}

/**
 * Add a comment to an article
 */
export async function addComment(
  articleId: string,
  userId: string,
  content: string,
  parentCommentId?: string
): Promise<NewsComment | null> {
  const { data, error } = await supabase
    .from('news_comments')
    .insert({
      article_id: articleId,
      user_id: userId,
      content,
      parent_comment_id: parentCommentId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding comment:', error);
    throw error;
  }

  return data;
}

/**
 * Fetch comments for an article
 */
export async function fetchArticleComments(
  articleId: string
): Promise<NewsComment[]> {
  const { data, error } = await supabase
    .from('news_comments')
    .select('*')
    .eq('article_id', articleId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data || [];
}

/**
 * Add or update a reaction to an article
 */
export async function toggleReaction(
  articleId: string,
  userId: string,
  reactionType: NewsReaction['reaction_type']
): Promise<boolean> {
  // Check if reaction exists
  const { data: existing } = await supabase
    .from('news_reactions')
    .select('id, reaction_type')
    .eq('article_id', articleId)
    .eq('user_id', userId)
    .eq('reaction_type', reactionType)
    .single();

  if (existing) {
    // Remove reaction
    const { error } = await supabase
      .from('news_reactions')
      .delete()
      .eq('id', existing.id);

    if (error) {
      console.error('Error removing reaction:', error);
      throw error;
    }
    return false;
  } else {
    // Add reaction
    const { error } = await supabase
      .from('news_reactions')
      .insert({
        article_id: articleId,
        user_id: userId,
        reaction_type: reactionType,
      });

    if (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
    return true;
  }
}

/**
 * Create a new article (admin/author only)
 */
export async function createArticle(
  article: Partial<NewsArticle>
): Promise<NewsArticle | null> {
  const { data, error } = await supabase
    .from('news_articles')
    .insert(article)
    .select()
    .single();

  if (error) {
    console.error('Error creating article:', error);
    throw error;
  }

  return data;
}

/**
 * Update an article (admin/author only)
 */
export async function updateArticle(
  articleId: string,
  updates: Partial<NewsArticle>
): Promise<NewsArticle | null> {
  const { data, error } = await supabase
    .from('news_articles')
    .update(updates)
    .eq('id', articleId)
    .select()
    .single();

  if (error) {
    console.error('Error updating article:', error);
    throw error;
  }

  return data;
}

/**
 * Delete an article (admin only)
 */
export async function deleteArticle(articleId: string): Promise<boolean> {
  const { error } = await supabase
    .from('news_articles')
    .delete()
    .eq('id', articleId);

  if (error) {
    console.error('Error deleting article:', error);
    throw error;
  }

  return true;
}
