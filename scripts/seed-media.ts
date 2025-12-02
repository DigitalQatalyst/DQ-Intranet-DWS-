/*
  Seed Supabase with mock media data (news, jobs) via upsert
  Usage after installing ts-node:
    npm run db:seed-media
*/

import { supabaseClient as supabase } from '../src/lib/supabaseClient.node'
import { NEWS, type NewsItem } from '../src/data/media/news'
import { JOBS, type JobItem } from '../src/data/media/jobs'

function clean<T extends object>(row: T): T {
  // Replace undefined with null to satisfy PostgREST
  return JSON.parse(
    JSON.stringify(row, (_k, v) => (v === undefined ? null : v))
  ) as T
}

async function upsertNews(items: NewsItem[]) {
  const rows = items.map((n) =>
    clean({
      id: n.id,
      title: n.title,
      type: n.type,
      date: n.date,
      author: n.author,
      byline: n.byline ?? null,
      views: n.views ?? 0,
      excerpt: n.excerpt,
      image: n.image ?? null,
      department: n.department ?? null,
      location: n.location ?? null,
      domain: n.domain ?? null,
      theme: n.theme ?? null,
      tags: n.tags ?? null,
      readingTime: n.readingTime ?? null,
      newsType: n.newsType ?? null,
      newsSource: n.newsSource ?? null,
      focusArea: n.focusArea ?? null,
    })
  )

  const { error, status } = await supabase.from('news').upsert(rows, { onConflict: 'id' })
  if (error) throw new Error(`news upsert failed (${status}): ${error.message}`)
  return rows.length
}

async function upsertJobs(items: JobItem[]) {
  const rows = items.map((j) =>
    clean({
      id: j.id,
      title: j.title,
      department: j.department,
      roleType: j.roleType,
      location: j.location,
      type: j.type,
      seniority: j.seniority,
      sfiaLevel: j.sfiaLevel,
      summary: j.summary,
      description: j.description,
      responsibilities: j.responsibilities ?? null,
      requirements: j.requirements ?? null,
      benefits: j.benefits ?? null,
      postedOn: j.postedOn,
      applyUrl: j.applyUrl ?? null,
      image: j.image ?? null,
    })
  )

  const { error, status } = await supabase.from('jobs').upsert(rows, { onConflict: 'id' })
  if (error) throw new Error(`jobs upsert failed (${status}): ${error.message}`)
  return rows.length
}

async function main() {
  try {
    // Basic env guard; supabaseClient.node will also assert env existence
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
    }

    const newsCount = await upsertNews(NEWS)
    const jobsCount = await upsertJobs(JOBS)

    // eslint-disable-next-line no-console
    console.log(`Seed complete: news=${newsCount}, jobs=${jobsCount}`)
    process.exit(0)
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', err?.message || err)
    process.exit(1)
  }
}

// Execute
main()
