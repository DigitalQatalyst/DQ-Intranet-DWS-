// scripts/seed-guides.js
// Seed Supabase with guides + taxonomies (service role)
// Usage: node scripts/seed-guides.js

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const fail = (msg) => { console.error(msg); process.exit(1) }

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) fail('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY envs. Aborting.')

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const readJson = async (p) => JSON.parse(await fs.readFile(p, 'utf-8'))
const toMap = (arr, key = 'slug') => { const m = new Map(); for (const a of arr) m.set(a[key], a); return m }

const upsert = async (table, rows, conflict = 'slug') => {
  if (!rows || rows.length === 0) return { count: 0 }
  const { error, count } = await sb.from(table).upsert(rows, { onConflict: conflict, ignoreDuplicates: false, count: 'exact' })
  if (error) throw error
  return { count: count ?? rows.length }
}

const getIdBy = async (table, key, value) => {
  const { data, error } = await sb.from(table).select('id').eq(key, value).maybeSingle()
  if (error) throw error
  return data?.id ?? null
}

const deleteWhere = async (table, filter) => {
  let q = sb.from(table).delete()
  for (const [k, v] of Object.entries(filter)) q = q.eq(k, v)
  const { error } = await q
  if (error) throw error
}

const mapGuideToDb = (g) => ({
  // let DB generate id if new; slug is our upsert key
  slug: g.slug,
  title: g.title,
  summary: g.summary ?? null,
  hero_image_url: g.heroImageUrl ?? null,
  skill_level: g.skillLevel,                      // 'Beginner' | 'Intermediate' | 'Advanced'
  estimated_time_min: g.estimatedTimeMin ?? null,
  last_updated_at: g.lastUpdatedAt ?? new Date().toISOString(),
  last_published_at: g.lastPublishedAt ?? null, // uncomment only if you have this column
  status: g.status ?? 'Published',                // 'Draft' | 'Published' | 'Archived'
  author_name: g.authorName ?? null,
  author_org: g.authorOrg ?? null,
  is_editors_pick: Boolean(g.isEditorsPick),
  download_count: g.downloadCount ?? 0,
  // DO NOT send: guideType, timeBucket, freshness, audiences/topics/tools/formats/languages
  language: g.language ?? null
})

async function main () {
  const taxonomyPath = path.resolve(root, 'data', 'seed-taxonomy.json')
  const guidesPath   = path.resolve(root, 'data', 'seed-guides.json')
  const xrefsPath    = path.resolve(root, 'data', 'seed-xrefs.json')

  const taxonomy = await readJson(taxonomyPath)
  const guides   = await readJson(guidesPath)
  const xrefs    = await readJson(xrefsPath)

  console.log('Seeding lookups...')
  const tools     = taxonomy.tools.map(t => ({ slug: t.slug, name: t.name }))
  const topics    = taxonomy.topics.map(t => ({ slug: t.slug, name: t.name }))
  const audiences = taxonomy.audiences.map(a => ({ slug: a.slug, name: a.name }))
  const formats   = taxonomy.formats.map(f => ({ slug: f.slug, name: f.name }))
  const languages = taxonomy.languages.map(l => ({ slug: l.slug, name: l.name }))

  await upsert('guide_tools', tools)
  await upsert('guide_topics', topics)
  await upsert('guide_audiences', audiences)
  await upsert('guide_formats', formats)
  await upsert('guide_languages', languages)

  console.log('Upserting guides base rows...')
  const baseRows = guides.map(mapGuideToDb)
  {
    const { error } = await sb.from('guides').upsert(baseRows, { onConflict: 'slug', ignoreDuplicates: false })
    if (error) throw error
  }

  // Build id maps for lookups
  const toolId = {};     for (const t of tools)     toolId[t.slug]     = await getIdBy('guide_tools', 'slug', t.slug)
  const topicId = {};    for (const t of topics)    topicId[t.slug]    = await getIdBy('guide_topics', 'slug', t.slug)
  const audienceId = {}; for (const a of audiences) audienceId[a.slug] = await getIdBy('guide_audiences', 'slug', a.slug)
  const formatId = {};   for (const f of formats)   formatId[f.slug]   = await getIdBy('guide_formats', 'slug', f.slug)
  const languageId = {}; for (const l of languages) languageId[l.slug] = await getIdBy('guide_languages', 'slug', l.slug)

  const xrefBySlug = toMap(xrefs.guides, 'slug')

  console.log('Seeding content arrays and xrefs...')
  let stepsCount = 0, attsCount = 0, tmplCount = 0, toolX = 0, topicX = 0, audX = 0, fmtX = 0, langX = 0

  for (const g of guides) {
    const { data: row, error: findErr } = await sb.from('guides').select('id,slug').eq('slug', g.slug).maybeSingle()
    if (findErr) throw findErr
    const guideId = row?.id
    if (!guideId) { console.warn('Guide not found after upsert', g.slug); continue }

    // Reset dependent content
    await deleteWhere('guide_steps', { guide_id: guideId })
    await deleteWhere('guide_attachments', { guide_id: guideId })
    await deleteWhere('guide_templates', { guide_id: guideId })
    await deleteWhere('guide_tool_xref', { guide_id: guideId })
    await deleteWhere('guide_topic_xref', { guide_id: guideId })
    await deleteWhere('guide_audience_xref', { guide_id: guideId })
    await deleteWhere('guide_format_xref', { guide_id: guideId })
    await deleteWhere('guide_language_xref', { guide_id: guideId })

    // Content arrays
    if (Array.isArray(g.steps) && g.steps.length) {
      const rows = g.steps.map(s => ({ guide_id: guideId, position: s.position, title: s.title, body: s.body }))
      const { error } = await sb.from('guide_steps').insert(rows)
      if (error) throw error
      stepsCount += rows.length
    }
    if (Array.isArray(g.attachments) && g.attachments.length) {
      const rows = g.attachments.map(a => ({ guide_id: guideId, kind: a.kind || 'link', title: a.title, url: a.url, size: a.size || null }))
      const { error } = await sb.from('guide_attachments').insert(rows)
      if (error) throw error
      attsCount += rows.length
    }
    if (Array.isArray(g.templates) && g.templates.length) {
      const rows = g.templates.map(t => ({ guide_id: guideId, title: t.title, url: t.url, size: t.size || null }))
      const { error } = await sb.from('guide_templates').insert(rows)
      if (error) throw error
      tmplCount += rows.length
    }

    // Xrefs from xrefs.json
    const xr = xrefBySlug.get(g.slug) || {}

    if (Array.isArray(xr.tools) && xr.tools.length) {
      const rows = xr.tools
        .map(slug => ({ guide_id: guideId, tool_id: toolId[slug] }))
        .filter(r => r.tool_id)
      if (rows.length) { const { error } = await sb.from('guide_tool_xref').insert(rows); if (error) throw error; toolX += rows.length }
    }

    if (Array.isArray(xr.topics) && xr.topics.length) {
      const rows = xr.topics
        .map(slug => ({ guide_id: guideId, topic_id: topicId[slug] }))
        .filter(r => r.topic_id)
      if (rows.length) { const { error } = await sb.from('guide_topic_xref').insert(rows); if (error) throw error; topicX += rows.length }
    }

    if (Array.isArray(xr.audiences) && xr.audiences.length) {
      const rows = xr.audiences
        .map(slug => ({ guide_id: guideId, audience_id: audienceId[slug] }))
        .filter(r => r.audience_id)
      if (rows.length) { const { error } = await sb.from('guide_audience_xref').insert(rows); if (error) throw error; audX += rows.length }
    }

    // format is SINGLE-SELECT — pick the first if multiple provided
    if (Array.isArray(xr.formats) && xr.formats.length) {
      const first = xr.formats[0]
      const rowIns = { guide_id: guideId, format_id: formatId[first] }
      if (rowIns.format_id) {
        const { error } = await sb.from('guide_format_xref').insert(rowIns)
        if (error) throw error
        fmtX += 1
      }
    }

    if (Array.isArray(xr.languages) && xr.languages.length) {
      const rows = xr.languages
        .map(slug => ({ guide_id: guideId, language_id: languageId[slug] }))
        .filter(r => r.language_id)
      if (rows.length) { const { error } = await sb.from('guide_language_xref').insert(rows); if (error) throw error; langX += rows.length }
    }
  }

  console.log('✅ Seeding complete.')
  console.table({ steps: stepsCount, attachments: attsCount, templates: tmplCount, toolX, topicX, audX, fmtX, langX })
  console.log('Try query: /api/guides?q=notion&tool=notion&sort=updated&page=1&pageSize=12')
}

main().catch(err => { console.error('Seed failed:', err?.message || err); process.exit(1) })
