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

// Curated Unsplash photo IDs by framework/topic
const PHOTOS = {
  devops: [
    'photo-1518770660439-4636190af475', // servers
    'photo-1518779578993-ec3579fee39f', // datacenter
    'photo-1542831371-29b0f74f9713', // code
    'photo-1510511459019-5dda7724fd87', // terminal
    'photo-1527430253228-e93688616381', // automation
    'photo-1504384308090-c894fdcc538d', // cloud
  ],
  dbp: [
    'photo-1553877522-43269d4ea984', // dashboard analytics
    'photo-1551836022-d5d88e9218df', // charts
    'photo-1559526324-593bc073d938', // analytics
    'photo-1556761175-b413ae4e686c', // workspace overview
  ],
  dxp: [
    'photo-1498050108023-c5249f4df085', // coding screen
    'photo-1529336953121-ad03f44b98e3', // screens ui
    'photo-1519389950473-47ba0277781c', // team laptops
    'photo-1515879218367-8466d910aaa4', // prototyping
  ],
  dws: [
    'photo-1521737604893-d14cc237f11d', // team workspace
    'photo-1529333166437-7750f620c5ea', // whiteboard
    'photo-1517245386807-bb43f82c33c4', // meeting
    'photo-1522071820081-009f0129c71c', // planning
  ],
  products: [
    'photo-1529333166437-7750f620c5ea', // design wall
    'photo-1518773553398-650c184e0bb3', // product board
    'photo-1515879218367-8466d910aaa4', // prototyping
    'photo-1519389950473-47ba0277781c', // team work
  ],
  projects: [
    'photo-1552581234-26160f608093', // kanban
    'photo-1522071820081-009f0129c71c', // notes
    'photo-1517245386807-bb43f82c33c4', // meeting
    'photo-1521737604893-d14cc237f11d', // team
  ],
  general: [
    'photo-1498050108023-c5249f4df085', // coding screen
    'photo-1552664730-d307ca884978', // notes board
    'photo-1522071820081-009f0129c71c', // planning
    'photo-1552581234-26160f608093', // kanban
    'photo-1515879218367-8466d910aaa4', // prototyping
    'photo-1519389950473-47ba0277781c', // team laptops
    'photo-1556761175-b413ae4e686c', // analytics screen
    'photo-1521737604893-d14cc237f11d', // team workspace
  ],
}

function chooseCategory(b) {
  const sub = String(b.sub_domain || '').toLowerCase()
  const title = String(b.title || '').toLowerCase()
  if (sub.includes('devops') || title.includes('devops')) return 'devops'
  if (sub.includes('dbp') || title.includes('dbp')) return 'dbp'
  if (sub.includes('dxp') || title.includes('dxp')) return 'dxp'
  if (sub.includes('dws') || title.includes('dws')) return 'dws'
  if (sub.includes('product') || title.includes('product')) return 'products'
  if (
    sub.includes('project') ||
    title.includes('project') ||
    title.includes('program increment') ||
    title.includes('pi planning') ||
    title.includes('planning')
  ) return 'projects'
  return 'general'
}

function makeUrl(photoId, salt) {
  const u = createHash('md5').update(`${photoId}-${salt}`).digest('hex').slice(0, 8)
  return `https://images.unsplash.com/${photoId}?w=800&h=400&fit=crop&q=80&u=${u}`
}

async function main() {
  console.log('🎨 Assigning unique, themed images to all Blueprints...')
  const { data: rows, error } = await sb
    .from('guides')
    .select('id, title, slug, domain, guide_type, sub_domain, hero_image_url')
    .eq('status', 'Approved')
  if (error) { console.error('Fetch failed:', error.message); process.exit(1) }

  const blueprints = (rows || []).filter(b => {
    const d = String(b.domain||'').toLowerCase()
    const gt = String(b.guide_type||'').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })

  // Track used base photos to avoid duplicates across Blueprints
  const used = new Set()
  // Pre-build a global pool order to ensure high variety
  const globalPool = Array.from(new Set([].concat(
    PHOTOS.devops,
    PHOTOS.dbp,
    PHOTOS.dxp,
    PHOTOS.dws,
    PHOTOS.products,
    PHOTOS.projects,
    PHOTOS.general,
  )))

  let updated = 0
  for (const b of blueprints) {
    const cat = chooseCategory(b)
    const pool = PHOTOS[cat] && PHOTOS[cat].length ? PHOTOS[cat] : PHOTOS.general
    // pick first unused in category; else pick from global unused; else fall back to hashed choice
    let photo = pool.find(p => !used.has(p))
    if (!photo) photo = globalPool.find(p => !used.has(p))
    if (!photo) {
      // deterministic from id if all exhausted
      const candidates = PHOTOS[cat].length ? PHOTOS[cat] : PHOTOS.general
      const idx = createHash('md5').update(String(b.id)).digest('hex').charCodeAt(0) % candidates.length
      photo = candidates[idx]
    }
    used.add(photo)
    const newUrl = makeUrl(photo, b.id)
    if (b.hero_image_url !== newUrl) {
      const { error: updErr } = await sb
        .from('guides')
        .update({ hero_image_url: newUrl, last_updated_at: new Date().toISOString() })
        .eq('id', b.id)
      if (!updErr) { updated++; console.log(`  ✓ ${b.title} -> ${cat}`) }
      else console.error(`  ✗ ${b.title}: ${updErr.message}`)
    }
  }

  console.log(`\n✅ Done. Updated ${updated} Blueprint image(s).`)
}

main().catch(err => { console.error('❌ Error:', err?.message || err); process.exit(1) })
