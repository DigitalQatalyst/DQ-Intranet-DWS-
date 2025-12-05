import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const SLUGS = [
  'client-session-guidelines',
  'blueprint-management-guidelines',
  'visual-assets-design-rules',
  'stakeholder-catalog-guidelines',
  'proposal-commercial-guidelines',
]

const TITLES_FALLBACK = [
  'Client Session Guidelines',
  'Blueprint Management Guidelines',
  'Visual Assets for Social Media — Design Rules',
  'Stakeholder Catalog Guidelines',
  'Proposal & Projects Commercial Guidelines',
]

const DEP_TABLES = [
  'guide_steps',
  'guide_attachments',
  'guide_templates',
  'guide_tool_xref',
  'guide_topic_xref',
  'guide_audience_xref',
  'guide_format_xref',
  'guide_language_xref',
]

async function main() {
  console.log('🗑️  Removing specified guidelines...')

  const { data: bySlug, error: slugErr } = await sb
    .from('guides')
    .select('id, slug, title')
    .in('slug', SLUGS)

  if (slugErr) throw slugErr

  let targets = bySlug || []

  if (targets.length < SLUGS.length) {
    const { data: byTitle, error: titleErr } = await sb
      .from('guides')
      .select('id, slug, title')
      .in('title', TITLES_FALLBACK)
    if (titleErr) throw titleErr

    const existingIds = new Set(targets.map(t => t.id))
    for (const t of (byTitle || [])) {
      if (!existingIds.has(t.id)) targets.push(t)
    }
  }

  if (!targets.length) {
    console.log('✓ No matching guides found. Nothing to remove.')
    return
  }

  console.log(`Found ${targets.length} guide(s) to remove:`)
  targets.forEach(g => console.log(` - ${g.title} (slug: ${g.slug || 'n/a'}, id: ${g.id})`))

  const ids = targets.map(t => t.id)

  for (const t of DEP_TABLES) {
    try {
      await sb.from(t).delete().in('guide_id', ids)
      console.log(`   • Cleaned ${t}`)
    } catch (e) {
      console.warn(`   • Skipped ${t}: ${e?.message || e}`)
    }
  }

  const { error: delErr } = await sb.from('guides').delete().in('id', ids)
  if (delErr) throw delErr

  console.log(`✅ Deleted ${ids.length} guide(s).`)

  // Verify removal
  const { data: verify } = await sb
    .from('guides')
    .select('id, slug, title')
    .or(`slug.in.(${SLUGS.map(s => `"${s}"`).join(',')}),title.in.(${TITLES_FALLBACK.map(t => `"${t}"`).join(',')})`)

  console.log(`🔁 Verification remaining matches: ${verify?.length || 0}`)
}

main().catch(err => { console.error('❌ Failed:', err?.message || err); process.exit(1) })
