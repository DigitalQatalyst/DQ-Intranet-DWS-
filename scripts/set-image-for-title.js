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

function makeUrl(photoId, salt) {
  const u = createHash('md5').update(`${photoId}-${salt}`).digest('hex').slice(0, 8)
  return `https://images.unsplash.com/${photoId}?w=800&h=400&fit=crop&q=80&u=${u}`
}

async function main() {
  const [title, photoId] = process.argv.slice(2)
  if (!title || !photoId) {
    console.log('Usage: node scripts/set-image-for-title.js "<Exact Title>" <unsplash_photo_id>')
    process.exit(1)
  }

  const { data, error } = await sb
    .from('guides')
    .select('id, title, domain, guide_type, hero_image_url')
    .eq('status', 'Approved')
    .eq('title', title)
    .maybeSingle()
  if (error) throw error
  if (!data) { console.log('⚠️  Not found:', title); return }

  const newUrl = makeUrl(photoId, data.id)
  console.log(`Updating ${title}`)
  console.log('Old:', data.hero_image_url || 'none')
  console.log('New:', newUrl)

  const { error: updErr } = await sb
    .from('guides')
    .update({ hero_image_url: newUrl, last_updated_at: new Date().toISOString() })
    .eq('id', data.id)
  if (updErr) throw updErr
  console.log('✅ Updated')
}

main().catch(err => { console.error('❌ Error:', err?.message || err); process.exit(1) })
