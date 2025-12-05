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

function basePhotoId(url) {
  if (!url) return 'NONE'
  const i = url.indexOf('images.unsplash.com/')
  if (i === -1) return 'OTHER'
  const after = url.slice(i + 'images.unsplash.com/'.length)
  return after.split('?')[0]
}

async function main() {
  const { data, error } = await sb
    .from('guides')
    .select('id, title, domain, guide_type, hero_image_url')
    .eq('status','Approved')
  if (error) throw error
  const blueprints = (data||[]).filter(r => String(r.domain||'').toLowerCase().includes('blueprint') || String(r.guide_type||'').toLowerCase().includes('blueprint'))
  const rows = blueprints.map(g => ({ title: g.title, base: basePhotoId(g.hero_image_url), url: g.hero_image_url }))
  rows.forEach(r => console.log(`${r.base.padEnd(40)}  ${r.title}`))
}

main().catch(err => { console.error('❌ Error:', err?.message || err); process.exit(1) })
