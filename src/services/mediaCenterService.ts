import { knowledgeHubSupabase } from '@/services/knowledgeHubClient'
import type { NewsItem } from '@/data/media/news'
import type { JobItem } from '@/data/media/jobs'

// Use Knowledge Hub Supabase instance for news and jobs tables
const supabase = knowledgeHubSupabase

// Temporarily exclude specific legacy announcements from UI listings
const EXCLUDED_NEWS_IDS: string[] = [
  'dq-dxb-ksa-christmas-new-year-schedule',
  'dq-nbo-christmas-new-year-schedule'
]

// Map a raw Supabase news row into a NewsItem used by the UI
function mapNewsRowToItem(row: any): NewsItem {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    date: row.date,
    author: row.author,
    byline: row.byline ?? undefined,
    views: row.views ?? 0,
    excerpt: row.excerpt,
    image: row.image ?? undefined,
    department: row.department ?? undefined,
    location: row.location ?? undefined,
    domain: row.domain ?? undefined,
    theme: row.theme ?? undefined,
    tags: row.tags ?? undefined,
    readingTime: row.reading_time ?? undefined,
    newsType: row.news_type ?? undefined,
    newsSource: row.news_source ?? undefined,
    focusArea: row.focus_area ?? undefined,
    content: row.content ?? undefined,
    format: row.format ?? undefined,
    source: row.source ?? undefined,
    audioUrl: row.audio_url ?? undefined,
  }
}

/**
 * Fetch all news items from Supabase
 * Returns news sorted by date (newest first)
 */
export async function fetchAllNews(): Promise<NewsItem[]> {
  if (!supabase) {
    console.warn('[fetchAllNews] Knowledge Hub Supabase client not initialized');
    return [];
  }

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchAllNews] Supabase error:', {
      message: (error as any)?.message,
      code: (error as any)?.code,
      details: (error as any)?.details,
      hint: (error as any)?.hint,
      error,
    })
    throw error
  }

  const rows = (data ?? []) as any[]

  return rows
    .filter(row => !EXCLUDED_NEWS_IDS.includes(row.id))
    .map(mapNewsRowToItem)
}

// Map a raw Supabase jobs row into a JobItem used by the UI
function mapJobRowToItem(row: any): JobItem {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    roleType: row.role_type,
    location: row.location,
    type: row.type,
    seniority: row.seniority,
    sfiaLevel: row.sfia_level,
    summary: row.summary,
    description: row.description,
    responsibilities: row.responsibilities ?? [],
    requirements: row.requirements ?? [],
    benefits: row.benefits ?? [],
    postedOn: row.posted_on,
    applyUrl: row.apply_url ?? undefined,
    image: row.image ?? undefined,
  }
}

/**
 * Fetch all job items from Supabase
 * Returns jobs sorted by posted date (newest first)
 */
export async function fetchAllJobs(): Promise<JobItem[]> {
  if (!supabase) {
    console.warn('[fetchAllJobs] Knowledge Hub Supabase client not initialized');
    return [];
  }

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('posted_on', { ascending: false })

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchAllJobs] Supabase error:', {
      message: (error as any)?.message,
      code: (error as any)?.code,
      details: (error as any)?.details,
      hint: (error as any)?.hint,
      error,
    })
    throw error
  }

  const rows = (data ?? []) as any[]
  return rows.map(mapJobRowToItem)
}

/**
 * Fetch a single news item by ID from Supabase
 */
export async function fetchNewsById(id: string): Promise<NewsItem | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchNewsById] Supabase error:', error)
    return null
  }

  if (!data) return null
  return mapNewsRowToItem(data as any)
}

/**
 * Fetch a single job item by ID from Supabase
 */
export async function fetchJobById(id: string): Promise<JobItem | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchJobById] Supabase error:', error)
    return null
  }

  if (!data) return null
  return mapJobRowToItem(data as any)
}
