// scripts/seed-guides.js
// Seed Supabase with simplified Guides (service role)
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

const buildFallbackBody = (g) => {
  const lines = []
  lines.push(`# ${g.title}`)
  if (g.summary) lines.push('', g.summary)
  lines.push('', '## Overview')
  if (g.domain) lines.push(`- Domain: **${g.domain}**`)
  if (g.guide_type) lines.push(`- Type: **${g.guide_type}**`)
  if (g.function_area) lines.push(`- Function Area: **${g.function_area}**`)
  if (g.complexity_level) lines.push(`- Complexity: **${g.complexity_level}**`)
  if (g.authorName || g.authorOrg) lines.push(`- Author: **${g.authorName || ''}${g.authorOrg ? ' · ' + g.authorOrg : ''}**`)
  lines.push('', '## Details')
  lines.push('This guide provides practical, actionable guidance. Open the document for full content if available.')
  return lines.join('\n')
}

const mapGuideToDb = (g) => ({
  slug: g.slug,
  title: g.title,
  summary: g.summary ?? null,
  hero_image_url: g.heroImageUrl ?? null,
  last_updated_at: g.lastUpdatedAt ?? new Date().toISOString(),
  status: g.status ?? 'Approved', // Draft | Approved | Archived
  author_name: g.authorName ?? null,
  author_org: g.authorOrg ?? null,
  is_editors_pick: Boolean(g.isEditorsPick),
  download_count: g.downloadCount ?? 0,
  // New simplified taxonomy columns
  domain: g.domain ?? null,
  guide_type: g.guide_type ?? null,
  function_area: g.function_area ?? null,
  complexity_level: g.complexity_level ?? null,
  body: g.body ?? buildFallbackBody(g),
  document_url: g.documentUrl ?? g.document_url ?? null,
})

async function main () {
  const guidesPath = path.resolve(root, 'data', 'seed-guides.json')
  const guides = await readJson(guidesPath)

  console.log('Upserting guides...')
  const baseRows = guides.map(mapGuideToDb)
  const { error } = await sb.from('guides').upsert(baseRows, { onConflict: 'slug', ignoreDuplicates: false })
  if (error) throw error

  // Prune any guides not in the seed list
  const keepSlugs = new Set(guides.map(g => g.slug))
  const { data: existing, error: fetchErr } = await sb.from('guides').select('id,slug')
  if (fetchErr) throw fetchErr
  const toDelete = (existing || []).filter(r => !keepSlugs.has(r.slug))
  if (toDelete.length) {
    const ids = toDelete.map(r => r.id)
    console.log(`Pruning ${ids.length} old guides not in seed set...`)
    // Best-effort delete from dependents first
    const tables = [
      'guide_steps',
      'guide_attachments',
      'guide_templates',
      'guide_tool_xref',
      'guide_topic_xref',
      'guide_audience_xref',
      'guide_format_xref',
      'guide_language_xref'
    ]
    for (const t of tables) {
      try { await sb.from(t).delete().in('guide_id', ids) } catch (e) { /* ignore */ }
    }
    const { error: delErr } = await sb.from('guides').delete().in('id', ids)
    if (delErr) throw delErr
    console.log(`Deleted ${ids.length} guides.`)
  }

  console.log(`Done. Upserted ${baseRows.length} guides. Retained only seed set.`)
  console.log('Example: /api/guides?domain=Digital Workspace&guide_type=SOP&sort=updated&page=1&pageSize=12')
}

main().catch(err => { console.error('Seed failed:', err?.message || err); process.exit(1) })
