export interface NewsCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsTag {
  id: string;
  name: string;
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  category_id?: string;
  author_id?: string;
  publisher_name?: string;
  publisher_department?: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  published_at?: string;
  views_count: number;
  is_featured: boolean;
  is_pinned: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface NewsArticleWithDetails extends NewsArticle {
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  tags: NewsTag[];
  reaction_counts: {
    like?: number;
    love?: number;
    insightful?: number;
    celebrate?: number;
  };
  comment_count: number;
}

export interface NewsBookmark {
  id: string;
  user_id: string;
  article_id: string;
  created_at: string;
}

export interface NewsComment {
  id: string;
  article_id: string;
  user_id: string;
  parent_comment_id?: string;
  content: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsReaction {
  id: string;
  article_id: string;
  user_id: string;
  reaction_type: 'like' | 'love' | 'insightful' | 'celebrate';
  created_at: string;
}

// API Response types
export interface NewsListResponse {
  articles: NewsArticleWithDetails[];
  total: number;
  page: number;
  limit: number;
}

export interface NewsFilters {
  category?: string;
  tags?: string[];
  search?: string;
  status?: NewsArticle['status'];
  is_featured?: boolean;
  is_pinned?: boolean;
  date_from?: string;
  date_to?: string;
}
