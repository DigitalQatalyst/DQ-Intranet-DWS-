import { mediaSupabaseClient } from '@/lib/mediaSupabaseClient'
import type { NewsItem } from '@/data/media/news'
import type { JobItem } from '@/data/media/jobs'

export async function fetchAllNews(): Promise<NewsItem[]> {
  const { data, error } = await mediaSupabaseClient
    .from('news')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching news from Supabase', error)
    throw error
  }

  return (data ?? []) as NewsItem[]
}

export async function fetchAllJobs(): Promise<JobItem[]> {
  const { data, error } = await mediaSupabaseClient
    .from('jobs')
    .select('*')
    .order('postedOn', { ascending: false })

  if (error) {
    console.error('Error fetching jobs from Supabase', error)
    throw error
  }

  return (data ?? []) as JobItem[]
}

export async function fetchNewsById(id: string): Promise<NewsItem | null> {
  const { data, error } = await mediaSupabaseClient
    .from('news')
    .select('*')
    .eq('id', id)
    .limit(1)

  if (error) {
    console.error('Error fetching news item from Supabase', error)
    return null
  }

  const row = data && data[0]
  return row ? (row as NewsItem) : null
}

export async function fetchJobById(id: string): Promise<JobItem | null> {
  const { data, error } = await mediaSupabaseClient
    .from('jobs')
    .select('*')
    .eq('id', id)
    .limit(1)

  if (error) {
    console.error('Error fetching job from Supabase', error)
    return null
  }

  const row = data && data[0]
  return row ? (row as JobItem) : null
}
