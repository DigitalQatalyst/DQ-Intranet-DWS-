import { supabase } from './supabaseClient';

export type ServiceCard = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  path?: string | null;
  icon?: string | null;
  tags?: string[] | null;
  is_active?: boolean | null;
  order?: number | null;
};

export type Story = {
  id: string;
  title: string;
  excerpt?: string | null;
  image?: string | null;
  author?: string | null;
  published_at?: string | null;
};

export type NewsItem = {
  id: string;
  title: string;
  excerpt?: string | null;
  link?: string | null;
  type?: string | null;
  published_at?: string | null;
};

export type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  link?: string | null;
};

export type JourneyStep = {
  id: string;
  title: string;
  summary?: string | null;
  stage?: string | null;
  order?: number | null;
  cta_label?: string | null;
  cta_link?: string | null;
};

export type SearchResult = {
  id: string;
  title: string;
  type: 'service' | 'journey' | 'story' | 'news' | 'event';
  description?: string | null;
  link?: string | null;
};

async function handle<T>(promise: Promise<{ data: T | null; error: unknown }>): Promise<T> {
  const { data, error } = await promise;
  if (error) throw error;
  return data ?? ([] as unknown as T);
}

export async function fetchServicesByCategory(category: string, limit = 20): Promise<ServiceCard[]> {
  return handle(
    supabase
      .from('services')
      .select('id, title, description, category, path, icon, tags, is_active, order')
      .eq('category', category)
      .eq('is_active', true)
      .order('order', { ascending: true })
      .limit(limit)
  );
}

export async function fetchStories(limit = 6): Promise<Story[]> {
  return handle(
    supabase
      .from('stories')
      .select('id, title, excerpt, image, author, published_at')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(limit)
  );
}

export async function fetchNews(limit = 6): Promise<NewsItem[]> {
  return handle(
    supabase
      .from('news')
      .select('id, title, excerpt, link, type, published_at')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(limit)
  );
}

export async function fetchEvents(limit = 6): Promise<EventItem[]> {
  return handle(
    supabase
      .from('events')
      .select('id, title, description, location, starts_at, ends_at, link')
      .gte('ends_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(limit)
  );
}

export async function fetchJourneys(): Promise<JourneyStep[]> {
  return handle(
    supabase
      .from('journeys')
      .select('id, title, summary, stage, order, cta_label, cta_link')
      .order('order', { ascending: true })
  );
}

// If you add a Postgres function "search_home_content(query text)" that returns unified results,
// this will call it. Adjust the function name/params to match your schema.
export async function searchHomeContent(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  return handle(
    supabase.rpc('search_home_content', { query }).limit(10)
  );
}

export async function fetchHomePageContent() {
  const [stories, news, events, journeys] = await Promise.all([
    fetchStories(),
    fetchNews(),
    fetchEvents(),
    fetchJourneys()
  ]);

  return { stories, news, events, journeys };
}
