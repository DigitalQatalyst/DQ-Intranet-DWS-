-- Create news_categories table
CREATE TABLE IF NOT EXISTS public.news_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news_tags table
CREATE TABLE IF NOT EXISTS public.news_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news_articles table
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  category_id UUID REFERENCES public.news_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  publisher_name VARCHAR(100) DEFAULT 'Digital Qatalyst',
  publisher_department VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news_article_tags junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.news_article_tags (
  article_id UUID REFERENCES public.news_articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.news_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Create news_bookmarks table
CREATE TABLE IF NOT EXISTS public.news_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES public.news_articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- Create news_comments table
CREATE TABLE IF NOT EXISTS public.news_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES public.news_articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.news_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news_reactions table
CREATE TABLE IF NOT EXISTS public.news_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES public.news_articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('like', 'love', 'insightful', 'celebrate')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id, reaction_type)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON public.news_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_news_articles_author ON public.news_articles(author_id);
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON public.news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON public.news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_slug ON public.news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_news_bookmarks_user ON public.news_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_news_comments_article ON public.news_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_news_reactions_article ON public.news_reactions(article_id);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_news_articles_search ON public.news_articles 
  USING gin(to_tsvector('english', title || ' ' || description || ' ' || content));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_categories_updated_at
  BEFORE UPDATE ON public.news_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_comments_updated_at
  BEFORE UPDATE ON public.news_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_article_views(article_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.news_articles
  SET views_count = views_count + 1
  WHERE id = article_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for news_categories (public read, admin write)
CREATE POLICY "Anyone can view categories"
  ON public.news_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.news_categories FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for news_tags (public read, admin write)
CREATE POLICY "Anyone can view tags"
  ON public.news_tags FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tags"
  ON public.news_tags FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for news_articles (public read published, author/admin write)
CREATE POLICY "Anyone can view published articles"
  ON public.news_articles FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Authors can create articles"
  ON public.news_articles FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own articles"
  ON public.news_articles FOR UPDATE
  USING (auth.uid() = author_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete articles"
  ON public.news_articles FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for news_article_tags
CREATE POLICY "Anyone can view article tags"
  ON public.news_article_tags FOR SELECT
  USING (true);

CREATE POLICY "Authors can manage article tags"
  ON public.news_article_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.news_articles
      WHERE id = article_id 
      AND (author_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  );

-- RLS Policies for news_bookmarks (users manage their own)
CREATE POLICY "Users can view own bookmarks"
  ON public.news_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks"
  ON public.news_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON public.news_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for news_comments (authenticated users)
CREATE POLICY "Anyone can view comments"
  ON public.news_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.news_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.news_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.news_comments FOR DELETE
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for news_reactions (authenticated users)
CREATE POLICY "Anyone can view reactions"
  ON public.news_reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reactions"
  ON public.news_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON public.news_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Insert default categories
INSERT INTO public.news_categories (name, description, icon, color) VALUES
  ('Technology', 'Technology updates and innovations', 'Cpu', '#3B82F6'),
  ('Company', 'Company-wide announcements and updates', 'Building2', '#8B5CF6'),
  ('Events', 'Upcoming events and activities', 'Calendar', '#10B981'),
  ('Achievement', 'Team and company achievements', 'Award', '#F59E0B'),
  ('Security', 'Security and compliance updates', 'Shield', '#EF4444'),
  ('Facilities', 'Office and facilities updates', 'Home', '#6366F1'),
  ('HR', 'Human resources announcements', 'Users', '#EC4899'),
  ('Training', 'Learning and development opportunities', 'GraduationCap', '#14B8A6')
ON CONFLICT (name) DO NOTHING;

-- Insert default tags
INSERT INTO public.news_tags (name) VALUES
  ('AI'),
  ('Innovation'),
  ('Town Hall'),
  ('Leadership'),
  ('Team Building'),
  ('Award'),
  ('Recognition'),
  ('Training'),
  ('Compliance'),
  ('Office'),
  ('Expansion'),
  ('Project Management'),
  ('Security'),
  ('Renovation'),
  ('Culture'),
  ('Wellness')
ON CONFLICT (name) DO NOTHING;

-- Create view for article with related data
CREATE OR REPLACE VIEW public.news_articles_with_details AS
SELECT 
  a.*,
  c.name as category_name,
  c.color as category_color,
  c.icon as category_icon,
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'id', t.id,
        'name', t.name
      )
    ) FILTER (WHERE t.id IS NOT NULL),
    '[]'::json
  ) as tags,
  COALESCE(r.reaction_counts, '{}'::jsonb) as reaction_counts,
  COALESCE(cm.comment_count, 0) as comment_count
FROM public.news_articles a
LEFT JOIN public.news_categories c ON a.category_id = c.id
LEFT JOIN public.news_article_tags at ON a.id = at.article_id
LEFT JOIN public.news_tags t ON at.tag_id = t.id
LEFT JOIN (
  SELECT 
    article_id,
    jsonb_object_agg(reaction_type, count) as reaction_counts
  FROM (
    SELECT article_id, reaction_type, COUNT(*) as count
    FROM public.news_reactions
    GROUP BY article_id, reaction_type
  ) sub
  GROUP BY article_id
) r ON a.id = r.article_id
LEFT JOIN (
  SELECT article_id, COUNT(*) as comment_count
  FROM public.news_comments
  GROUP BY article_id
) cm ON a.id = cm.article_id
GROUP BY a.id, c.name, c.color, c.icon, r.reaction_counts, cm.comment_count;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.news_categories TO anon, authenticated;
GRANT SELECT ON public.news_tags TO anon, authenticated;
GRANT SELECT ON public.news_articles TO anon, authenticated;
GRANT SELECT ON public.news_article_tags TO anon, authenticated;
GRANT SELECT ON public.news_articles_with_details TO anon, authenticated;
GRANT ALL ON public.news_bookmarks TO authenticated;
GRANT ALL ON public.news_comments TO authenticated;
GRANT ALL ON public.news_reactions TO authenticated;
