// scripts/seed-guides.js
// Seed Supabase with simplified Guides (service role) and canonical domains
// Usage: node scripts/seed-guides.js

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

/* ------------------------------ Setup ------------------------------ */

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const fail = (msg) => { console.error(msg); process.exit(1) }

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) fail('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY envs. Aborting.')

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const readJson = async (p) => JSON.parse(await fs.readFile(p, 'utf-8'))

/* ----------------------- Canonical domain logic --------------------- */

const CANONICAL_DOMAINS = ['strategy', 'guidelines', 'blueprints']

const STRATEGY_HINTS = [
  'strategy','roadmap','vision','policy','framework','operating model','target state','maturity','charter'
]
const GUIDELINES_HINTS = [
  'guide','how to','how-to','howto','sop','standard operating procedure','best practice','checklist','runbook','playbook',
  'procedure','instruction','tips','guideline','guidelines'
]
const BLUEPRINTS_HINTS = [
  'blueprint','reference architecture','reference design','solution design','solution architecture','template','spec','specification',
  'architecture','archetype','pattern','design doc','diagram'
]

const matchesAny = (text, hints) => {
  if (!text) return false
  const t = String(text).toLowerCase()
  return hints.some(h => t.includes(h))
}

const classifyDomain = (g) => {
  const d0 = (g.domain || '').toLowerCase()
  const type0 = (g.guide_type || '').toLowerCase()
  const title0 = (g.title || '').toLowerCase()

  if (CANONICAL_DOMAINS.includes(d0)) return d0
  if (matchesAny(d0, STRATEGY_HINTS) || matchesAny(type0, STRATEGY_HINTS) || matchesAny(title0, STRATEGY_HINTS)) return 'strategy'
  if (matchesAny(d0, BLUEPRINTS_HINTS) || matchesAny(type0, BLUEPRINTS_HINTS) || matchesAny(title0, BLUEPRINTS_HINTS)) return 'blueprints'
  if (matchesAny(d0, GUIDELINES_HINTS) || matchesAny(type0, GUIDELINES_HINTS) || matchesAny(title0, GUIDELINES_HINTS)) return 'guidelines'
  if (['sop','how-to','how to','guide','runbook','playbook','checklist'].includes(type0)) return 'guidelines'
  if (['blueprint','reference architecture','architecture','template','spec'].includes(type0)) return 'blueprints'
  if (['strategy','policy','framework','roadmap'].includes(type0)) return 'strategy'
  return 'guidelines'
}

/* --------------------------- Body fallback -------------------------- */

const buildFallbackBody = (g, canonicalDomain) => {
  const lines = []
  lines.push(`# ${g.title}`)
  if (g.summary) lines.push('', g.summary)
  lines.push('', '## Overview')
  if (canonicalDomain) lines.push(`- Domain: **${canonicalDomain[0].toUpperCase() + canonicalDomain.slice(1)}**`)
  if (g.guide_type) lines.push(`- Type: **${g.guide_type}**`)
  if (g.subDomain) lines.push(`- Sub-domain: **${g.subDomain}**`)
  if (g.function_area || g.unit) lines.push(`- Unit: **${g.unit || g.function_area}**`)
  if (g.location) lines.push(`- Location: **${g.location}**`)
  if (g.complexity_level) lines.push(`- Complexity: **${g.complexity_level}**`)
  if (g.authorName || g.authorOrg) lines.push(`- Author: **${g.authorName || ''}${g.authorOrg ? ' · ' + g.authorOrg : ''}**`)
  lines.push('', '## Details')
  lines.push('This guide provides practical, actionable guidance. Open the document for full content if available.')
  return lines.join('\n')
}

/* ----------------------------- Mapper ------------------------------ */

const mapGuideToDb = (g) => {
  const domainCanonical = classifyDomain(g)
  const nowIso = new Date().toISOString()
  return {
    slug: g.slug,
    title: g.title,
    summary: g.summary ?? null,
    hero_image_url: g.heroImageUrl ?? null,
    last_updated_at: g.lastUpdatedAt ?? nowIso,
    status: g.status ?? 'Approved',                    // Draft | Approved | Archived
    author_name: g.authorName ?? null,
    author_org: g.authorOrg ?? null,
    is_editors_pick: Boolean(g.isEditorsPick),
    download_count: g.downloadCount ?? 0,
    // Simplified taxonomy columns
    domain: domainCanonical,
    guide_type: g.guide_type ?? null,
    sub_domain: g.subDomain ?? g.sub_domain ?? null,
    unit: g.unit ?? g.function_area ?? null,
    function_area: g.function_area ?? g.unit ?? null,
    complexity_level: g.complexity_level ?? null,
    location: g.location ?? null,
    body: g.body ?? buildFallbackBody(g, domainCanonical),
    document_url: g.documentUrl ?? g.document_url ?? null,
  }
}

/* ------------- Upsert with automatic fallback for extra cols -------- */

async function upsertGuides(rows) {
  // First try with visibility columns
  let { error } = await sb.from('guides').upsert(rows, { onConflict: 'slug', ignoreDuplicates: false })
  if (!error) return

  // If table doesn't have some columns (e.g., is_public), strip them and retry
  console.warn('Upsert failed with extra columns; retrying with minimal shape...', error?.message || error)
  const minimal = rows.map(r => {
    const {
      sub_domain, unit, location,
      ...rest
    } = r
    return { ...rest }
  })
  const retry = await sb.from('guides').upsert(minimal, { onConflict: 'slug', ignoreDuplicates: false })
  if (retry.error) throw retry.error
}

/* ----------------------- Backfill (one-time) ------------------------ */

async function backfillExistingDomains () {
  console.log('Backfilling existing guides -> canonical domains...')
  let from = 0
  const pageSize = 200

  while (true) {
    const { data, error } = await sb
      .from('guides')
      .select('id, title, domain, guide_type')
      .order('id', { ascending: true })
      .range(from, from + pageSize - 1)

    if (error) throw error
    if (!data || data.length === 0) break

    const updates = data
      .map(row => {
        const nextDomain = classifyDomain(row)
        return (nextDomain !== row.domain) ? { id: row.id, domain: nextDomain } : null
      })
      .filter(Boolean)

    if (updates.length) {
      const { error: upErr } = await sb.from('guides').upsert(updates)
      if (upErr) throw upErr
      console.log(`Updated ${updates.length} existing rows (batch starting at ${from}).`)
    }

    if (data.length < pageSize) break
    from += pageSize
  }

  console.log('Backfill complete.')
}

/* ------------------------------ Main ------------------------------- */

async function main () {
  const guidesPath = path.resolve(root, 'data', 'seed-guides.json')
  const guides = await readJson(guidesPath)

  // 3 official DQ governance policies
  const dqPolicies = [
    {
      slug: 'it-security-management-policy',
      title: 'IT Security Management Policy',
      summary: `This documentation applies to all DQ internal and external resources, assets, 
and technologies, including but not limited to systems, applications, 
infrastructure, and third-party service providers.
DQ reserves the right to revise, update, or supplement its IT governance 
documentation at any time to reflect evolving business, regulatory, and 
technological requirements.
All approved changes shall be formally recorded and communicated through 
official DQ communication channels.`,
      authorName: 'Digital Qatalyst',
      authorOrg: 'DQ Governance Office',
      guide_type: 'Policy',
      subDomain: 'digital-framework',
      unit: 'SecDevOps',
      function_area: 'SecDevOps',
      location: 'NBO',
      complexity_level: 'Intermediate',
      domain: 'strategy',
      documentUrl: 'https://arqitek.sharepoint.com/:b:/s/PROJNEOM2.0DigitalCity/EeoNUCEz5-VHrfZRGq6Hb60BtYoTxa75kOg_js9SQDSlcA?e=cgABJL'
    },
    {
      slug: 'risk-management-policy',
      title: 'Risk Management Policy',
      summary: `This documentation applies to all DQ associates, assets, systems, and technologies, 
both internal and external, as defined by each policy. DQ reserves the right to review, 
amend, or enhance any IT governance documentation as part of continuous 
improvement efforts. Any updates or changes shall be approved by authorized 
personnel and communicated to all relevant stakeholders through official DQ 
channels.`,
      authorName: 'Digital Qatalyst',
      authorOrg: 'DQ Governance Office',
      guide_type: 'Policy',
      subDomain: 'initiatives',
      unit: 'Finance',
      function_area: 'Finance',
      location: 'NBO',
      complexity_level: 'Intermediate',
      domain: 'strategy',
      documentUrl: 'https://arqitek.sharepoint.com/:b:/s/PROJNEOM2.0DigitalCity/EXWh6C2xj8xCj0aBtXw6aJMBviwwlGcvDfwpxhpEsr1rAg?e=CWNbsP'
    },
    {
      slug: 'dq-it-operation-security-policy',
      title: 'DQ IT Operation Security Policy',
      summary: `This documentation applies to all DQ resources, platforms, applications, and 
technologies — whether managed internally or by authorized third parties. 
DQ reserves the right to revise, enhance, or supplement this documentation at any 
time to reflect emerging business needs, regulatory changes, or technological 
advancements. All approved changes shall be communicated through official DQ 
communication channels such as Live24, DQ Hub, or internal circulars, and will take 
effect immediately upon approval.`,
      authorName: 'Digital Qatalyst',
      authorOrg: 'DQ Governance Office',
      guide_type: 'Policy',
      subDomain: 'digital-framework',
      unit: 'SecDevOps',
      function_area: 'SecDevOps',
      location: 'NBO',
      complexity_level: 'Intermediate',
      domain: 'strategy',
      documentUrl: 'https://arqitek.sharepoint.com/:b:/s/PROJNEOM2.0DigitalCity/EYauJdXx6_1AuqkwYMFNgGYBPY2oG2cPiZp7PnMqCAcFdA?e=MMgtDw'
    }
  ]

  const combinedGuides = [...guides, ...dqPolicies]

  console.log('Upserting guides...')
  const baseRows = combinedGuides.map(mapGuideToDb)
  await upsertGuides(baseRows)

  // Prune any guides not in the seed set (includes policies)
  const keepSlugs = new Set(combinedGuides.map(g => g.slug))
  const { data: existing, error: fetchErr } = await sb.from('guides').select('id,slug')
  if (fetchErr) throw fetchErr
  const toDelete = (existing || []).filter(r => !keepSlugs.has(r.slug))

  if (toDelete.length) {
    const ids = toDelete.map(r => r.id)
    console.log(`Pruning ${ids.length} old guides not in seed set...`)
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
      try { await sb.from(t).delete().in('guide_id', ids) } catch { /* ignore */ }
    }
    const { error: delErr } = await sb.from('guides').delete().in('id', ids)
    if (delErr) throw delErr
    console.log(`Deleted ${ids.length} guides.`)
  }

  console.log(`Done. Upserted ${baseRows.length} guides. Retained only seed set.`)
  console.log('Example queries:')
  console.log('- /api/guides?domain=strategy&page=1&pageSize=12')
  console.log('- /api/guides?domain=guidelines&page=1&pageSize=12')
  console.log('- /api/guides?domain=blueprints&page=1&pageSize=12')
}

/* ----------------------------- Execute ----------------------------- */

main()
  .then(() => backfillExistingDomains())
  .catch(err => { console.error('Seed failed:', err?.message || err); process.exit(1) })
