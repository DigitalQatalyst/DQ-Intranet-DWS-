import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { createHash } from 'crypto'

dotenv.config()

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const TARGETS = [
  {
    slug: 'dq-functional-tracker-guidelines',
    title: 'DQ Functional Tracker Guidelines',
    // Unique Unsplash photo (not used elsewhere here)
    basePhoto: 'photo-1519389950473-47ba0277781c',
  },
  {
    slug: 'dq-agenda-scheduling-guidelines',
    title: 'DQ Agenda & Scheduling Guidelines',
    basePhoto: 'photo-1487017159836-4e23ece2e4cf',
  },
]

function makeImageUrl(photoId, salt) {
  const u = createHash('md5').update(`${photoId}-${salt}`).digest('hex').slice(0, 8)
  return `https://images.unsplash.com/${photoId}?w=800&h=400&fit=crop&q=80&u=${u}`
}

async function main() {
  console.log('🖼️  Setting unique images for selected guides...\n')

  for (const t of TARGETS) {
    // Try slug first, fallback to title
    let row = null
    const { data: bySlug, error: e1 } = await sb
      .from('guides')
      .select('id, slug, title, hero_image_url')
      .eq('slug', t.slug)
      .eq('status', 'Approved')
      .maybeSingle()
    if (e1) console.warn(`Warn: lookup by slug failed for ${t.slug}:`, e1.message)
    row = bySlug || null

    if (!row) {
      const { data: byTitle, error: e2 } = await sb
        .from('guides')
        .select('id, slug, title, hero_image_url')
        .eq('title', t.title)
        .eq('status', 'Approved')
        .maybeSingle()
      if (e2) console.warn(`Warn: lookup by title failed for ${t.title}:`, e2.message)
      row = byTitle || null
    }

    if (!row) {
      console.log(`⚠️  Not found: ${t.title}`)
      continue
    }

    const newUrl = makeImageUrl(t.basePhoto, row.id)
    console.log(`Updating: ${row.title} (${row.id})`) 
    console.log(`  Old: ${row.hero_image_url || 'none'}`)
    console.log(`  New: ${newUrl}`)

    const { error: updErr } = await sb
      .from('guides')
      .update({ hero_image_url: newUrl, last_updated_at: new Date().toISOString() })
      .eq('id', row.id)

    if (updErr) {
      console.error(`   ❌ Update failed: ${updErr.message}`)
    } else {
      console.log('   ✅ Updated')
    }
  }

  // Quick verify
  const { data: verify } = await sb
    .from('guides')
    .select('id, slug, title, hero_image_url')
    .in('slug', TARGETS.map(t => t.slug))
    .eq('status', 'Approved')

  console.log('\n🔁 Verification:')
  ;(verify || []).forEach(g => console.log(` - ${g.title}: ${g.hero_image_url?.slice(0, 90)}...`))
}

main().catch(err => { console.error('❌ Failed:', err?.message || err); process.exit(1) })
