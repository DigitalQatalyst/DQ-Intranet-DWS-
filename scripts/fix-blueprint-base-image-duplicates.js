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

const PHOTOS = {
  devops: [
    'photo-1518770660439-4636190af475',
    'photo-1518779578993-ec3579fee39f',
    'photo-1542831371-29b0f74f9713',
    'photo-1510511459019-5dda7724fd87',
    'photo-1527430253228-e93688616381',
    'photo-1504384308090-c894fdcc538d',
  ],
  dbp: [
    'photo-1553877522-43269d4ea984',
    'photo-1551836022-d5d88e9218df',
    'photo-1559526324-593bc073d938',
    'photo-1556761175-b413ae4e686c',
  ],
  dxp: [
    'photo-1498050108023-c5249f4df085',
    'photo-1529336953121-ad03f44b98e3',
    'photo-1519389950473-47ba0277781c',
    'photo-1515879218367-8466d910aaa4',
  ],
  dws: [
    'photo-1521737604893-d14cc237f11d',
    'photo-1529333166437-7750f620c5ea',
    'photo-1517245386807-bb43f82c33c4',
    'photo-1522071820081-009f0129c71c',
  ],
  products: [
    'photo-1529333166437-7750f620c5ea',
    'photo-1518773553398-650c184e0bb3',
    'photo-1515879218367-8466d910aaa4',
    'photo-1519389950473-47ba0277781c',
  ],
  projects: [
    'photo-1552581234-26160f608093',
    'photo-1522071820081-009f0129c71c',
    'photo-1517245386807-bb43f82c33c4',
    'photo-1521737604893-d14cc237f11d',
  ],
  general: [
    'photo-1498050108023-c5249f4df085',
    'photo-1552664730-d307ca884978',
    'photo-1522071820081-009f0129c71c',
    'photo-1552581234-26160f608093',
    'photo-1515879218367-8466d910aaa4',
    'photo-1519389950473-47ba0277781c',
    'photo-1556761175-b413ae4e686c',
    'photo-1521737604893-d14cc237f11d',
  ],
}

function basePhotoId(url) {
  if (!url) return 'NONE'
  const i = url.indexOf('images.unsplash.com/')
  if (i === -1) return 'OTHER'
  const after = url.slice(i + 'images.unsplash.com/'.length)
  return after.split('?')[0]
}

function chooseCategory(b) {
  const sub = String(b.sub_domain || '').toLowerCase()
  const title = String(b.title || '').toLowerCase()
  if (sub.includes('devops') || title.includes('devops')) return 'devops'
  if (sub.includes('dbp') || title.includes('dbp')) return 'dbp'
  if (sub.includes('dxp') || title.includes('dxp')) return 'dxp'
  if (sub.includes('dws') || title.includes('dws')) return 'dws'
  if (sub.includes('product') || title.includes('product')) return 'products'
  if (sub.includes('project') || title.includes('project') || title.includes('program increment') || title.includes('pi planning') || title.includes('planning')) return 'projects'
  return 'general'
}

function makeUrl(photoId, salt) {
  const u = createHash('md5').update(`${photoId}-${salt}`).digest('hex').slice(0, 8)
  return `https://images.unsplash.com/${photoId}?w=800&h=400&fit=crop&q=80&u=${u}`
}

async function main() {
  const { data: rows, error } = await sb
    .from('guides')
    .select('id, title, domain, guide_type, sub_domain, hero_image_url')
    .eq('status','Approved')
  if (error) throw error

  const blueprints = (rows||[]).filter(b => String(b.domain||'').toLowerCase().includes('blueprint') || String(b.guide_type||'').toLowerCase().includes('blueprint'))

  const byBase = new Map()
  for (const b of blueprints) {
    const key = basePhotoId(b.hero_image_url)
    if (!byBase.has(key)) byBase.set(key, [])
    byBase.get(key).push(b)
  }
  const duplicates = [...byBase.entries()].filter(([k, arr]) => k !== 'NONE' && k !== 'OTHER' && arr.length > 1)

  if (!duplicates.length) {
    console.log('✅ No duplicate base images among Blueprints')
    return
  }
  console.log(`🔧 Fixing ${duplicates.length} duplicate base image group(s)`)

  const used = new Set([...byBase.keys()].filter(k => k !== 'NONE' && k !== 'OTHER'))
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
  for (const [baseId, arr] of duplicates) {
    for (let i = 1; i < arr.length; i++) {
      const b = arr[i]
      const cat = chooseCategory(b)
      const pool = PHOTOS[cat] && PHOTOS[cat].length ? PHOTOS[cat] : PHOTOS.general
      let photo = pool.find(p => !used.has(p))
      if (!photo) photo = globalPool.find(p => !used.has(p))
      if (!photo) continue
      used.add(photo)
      const newUrl = makeUrl(photo, b.id)
      const { error: updErr } = await sb.from('guides').update({ hero_image_url: newUrl, last_updated_at: new Date().toISOString() }).eq('id', b.id)
      if (!updErr) { updated++; console.log(`  ✓ ${b.title} -> ${photo}`) }
      else console.error(`  ✗ ${b.title}: ${updErr.message}`)
    }
  }
  console.log(`✅ Updated ${updated} Blueprint(s) with new unique photos`)
}

main().catch(err => { console.error('❌ Error:', err?.message || err); process.exit(1) })
