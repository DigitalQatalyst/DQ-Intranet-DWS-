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

const FRAMEWORKS = ['devops','dbp','dxp','dws','products','projects']

const norm = s => String(s||'').toLowerCase()

async function main() {
  const { data, error } = await sb
    .from('guides')
    .select('id,title,domain,guide_type,sub_domain,hero_image_url')
    .eq('status','Approved')
  if (error) throw error

  const blueprints = (data||[]).filter(g => norm(g.domain).includes('blueprint') || norm(g.guide_type).includes('blueprint'))

  const counts = {}
  FRAMEWORKS.forEach(f => counts[f]=0)

  for (const g of blueprints) {
    const allText = `${norm(g.sub_domain)} ${norm(g.domain)} ${norm(g.guide_type)} ${norm(g.title)}`
    for (const f of FRAMEWORKS) {
      if (f==='products') {
        if (allText.includes('product')) counts[f]++
      } else if (f==='projects') {
        if (allText.includes('project')) counts[f]++
      } else if (allText.includes(f)) counts[f]++
    }
  }

  console.log('\nBlueprint Framework Coverage:')
  FRAMEWORKS.forEach(f => console.log(` - ${f.toUpperCase()}: ${counts[f]}`))
}

main().catch(err => { console.error('❌ Error:', err?.message || err); process.exit(1) })
