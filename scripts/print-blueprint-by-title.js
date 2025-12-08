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

async function main() {
  const title = process.argv.slice(2).join(' ') || 'Business Requirement Document'
  const { data, error } = await sb
    .from('guides')
    .select('id, title, domain, guide_type, hero_image_url, sub_domain, last_updated_at')
    .eq('status', 'Approved')
    .eq('title', title)
  if (error) throw error
  console.log(JSON.stringify(data, null, 2))
}

main().catch(err => { console.error('❌ Error:', err?.message || err); process.exit(1) })
