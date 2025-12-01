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
    titles: ['Agile Working Guidelines'],
    // Agile/teamwork image
    basePhoto: 'photo-1552581234-26160f608093',
  },
  {
    titles: ['Leave Guidelines'],
    // HR/leave themed image
    basePhoto: 'photo-1554224155-6726b3ff858f',
  },
]

function uniqueUrl(photoId, salt) {
  const u = createHash('md5').update(`${photoId}-${salt}`).digest('hex').slice(0, 8)
  return `https://images.unsplash.com/${photoId}?w=800&h=400&fit=crop&q=80&u=${u}`
}

async function main() {
  console.log('🖼️  Setting distinct images for Agile Working Guidelines and Leave Guidelines (including Blueprint copies)...')

  for (const t of TARGETS) {
    const { data: rows, error } = await sb
      .from('guides')
      .select('id, title, slug, hero_image_url')
      .eq('status', 'Approved')
      .in('title', t.titles)

    if (error) {
      console.error('Fetch error:', error.message)
      continue
    }

    for (const r of rows || []) {
      const url = uniqueUrl(t.basePhoto, r.id)
      if (r.hero_image_url === url) continue
      const { error: updErr } = await sb
        .from('guides')
        .update({ hero_image_url: url, last_updated_at: new Date().toISOString() })
        .eq('id', r.id)
      if (updErr) console.error(`  ✗ ${r.title}: ${updErr.message}`)
      else console.log(`  ✓ Updated ${r.title}`)
    }
  }

  console.log('✅ Done. Images are now distinct.')
}

main().catch(err => { console.error('❌ Failed:', err?.message || err); process.exit(1) })
