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

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556761175-b413ae4e686c?w=800&h=400&fit=crop&q=80',
]

function normalizeTitle(t) {
  return String(t || '').toLowerCase().replace(/\s+/g, ' ').trim()
}

async function main() {
  console.log('🔄 Syncing Blueprint images from Guidelines...')

  // Fetch all approved guides with relevant fields
  const { data: all, error } = await sb
    .from('guides')
    .select('id, title, slug, domain, guide_type, hero_image_url, status')
    .eq('status', 'Approved')

  if (error) {
    console.error('❌ Fetch failed:', error.message)
    process.exit(1)
  }

  const guidelines = (all || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return !d.includes('strategy') && !d.includes('blueprint') && !d.includes('testimonial') &&
           !gt.includes('strategy') && !gt.includes('blueprint') && !gt.includes('testimonial')
  })
  const blueprints = (all || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })

  const guideByTitle = new Map()
  for (const g of guidelines) {
    guideByTitle.set(normalizeTitle(g.title), g)
  }

  let updated = 0
  let fallbackUsed = 0
  for (const b of blueprints) {
    const key = normalizeTitle(b.title)
    const src = guideByTitle.get(key)
    let nextUrl = src?.hero_image_url || null
    if (!nextUrl) {
      nextUrl = FALLBACK_IMAGES[updated % FALLBACK_IMAGES.length]
      fallbackUsed++
    }

    if (nextUrl && nextUrl !== b.hero_image_url) {
      const { error: updErr } = await sb
        .from('guides')
        .update({ hero_image_url: nextUrl, last_updated_at: new Date().toISOString() })
        .eq('id', b.id)
      if (updErr) {
        console.error(`   ✗ Failed: ${b.title} -> ${updErr.message}`)
      } else {
        updated++
        console.log(`   ✓ Set image: ${b.title}`)
      }
    }
  }

  console.log(`\n✅ Done. Updated ${updated} Blueprint images. Fallback used for ${fallbackUsed}.`)
}

main().catch(err => { console.error('❌ Error:', err?.message || err); process.exit(1) })
