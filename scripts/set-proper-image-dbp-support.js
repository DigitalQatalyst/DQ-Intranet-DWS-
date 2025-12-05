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

// Professional helpdesk/ops style image (used originally in seed)
const BASE_PHOTO = 'photo-1525182008055-f88b95ff7980'

function urlFor(id, salt) {
  const u = createHash('md5').update(`${id}-${salt}`).digest('hex').slice(0, 8)
  return `https://images.unsplash.com/${id}?w=800&h=400&fit=crop&q=80&u=${u}`
}

async function main() {
  console.log('🖼️  Setting a proper image for DBP Support Guidelines (and any Blueprint copies)...')

  const { data: rows, error } = await sb
    .from('guides')
    .select('id, title, slug, hero_image_url')
    .eq('status', 'Approved')
    .or('slug.eq.dbp-support-guidelines,title.eq.DBP Support Guidelines')

  if (error) { console.error('Fetch failed:', error.message); process.exit(1) }

  let updated = 0
  for (const r of (rows || [])) {
    const next = urlFor(BASE_PHOTO, r.id)
    if (r.hero_image_url === next) continue
    const { error: updErr } = await sb
      .from('guides')
      .update({ hero_image_url: next, last_updated_at: new Date().toISOString() })
      .eq('id', r.id)
    if (updErr) console.error(`  ✗ ${r.title}: ${updErr.message}`)
    else { updated++; console.log(`  ✓ Updated ${r.title}`) }
  }

  console.log(`✅ Done. Updated ${updated} row(s).`)
}

main().catch(err => { console.error('❌ Failed:', err?.message || err); process.exit(1) })
