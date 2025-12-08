import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env at project root
dotenv.config()

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

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

async function main () {
  console.log('🔎 Looking for duplicate "Leave Guidelines" guides...')

  const { data: found, error } = await sb
    .from('guides')
    .select('id, slug, title, status, domain, sub_domain')
    .or('title.ilike.%Leave Guidelines%,slug.eq.leave-guidelines')
    .eq('status', 'Approved')
    .order('id', { ascending: true })

  if (error) throw error

  const matches = found || []
  console.log(`📊 Found ${matches.length} matching guide(s).`)

  if (matches.length <= 1) {
    console.log('✓ No duplicates to remove.')
    return
  }

  // Prefer keeping the canonical slug if present; otherwise keep the first by id
  const canonical = matches.find(g => (g.slug || '').toLowerCase() === 'leave-guidelines') || matches[0]
  const toDelete = matches.filter(g => g.id !== canonical.id)

  console.log(`\n📌 Keeping: ${canonical.title} (slug: ${canonical.slug || 'n/a'}, id: ${canonical.id})`)
  console.log(`🗑️  Deleting ${toDelete.length} duplicate(s):`)
  toDelete.forEach(g => console.log(`   - ${g.title} (slug: ${g.slug || 'n/a'}, id: ${g.id})`))

  const ids = toDelete.map(g => g.id)
  if (ids.length === 0) {
    console.log('✓ Nothing to delete.')
    return
  }

  // Best-effort clean-up of dependent rows first
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

  console.log(`\n✅ Deleted ${ids.length} duplicate guide(s).`)

  // Final verification
  const { data: verify } = await sb
    .from('guides')
    .select('id, slug, title')
    .or('title.ilike.%Leave Guidelines%,slug.eq.leave-guidelines')
    .eq('status', 'Approved')

  console.log(`\n🔁 Verification: ${verify?.length || 0} matching guide(s) remain.`)
  ;(verify || []).forEach((g, i) => console.log(`   ${i + 1}. ${g.title} (slug: ${g.slug || 'n/a'}, id: ${g.id})`))

  console.log('\nDone.')
}

main().catch(err => { console.error('❌ Failed:', err?.message || err); process.exit(1) })
