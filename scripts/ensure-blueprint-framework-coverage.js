import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { randomUUID } from 'crypto'

dotenv.config()

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const FRAMEWORKS = ['devops','dbp','dxp','dws','products','projects']
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&q=80'

const slugify = (t) => String(t||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')

async function main() {
  console.log('🔧 Ensuring each Blueprint framework has at least one service...')

  const { data: all, error } = await sb
    .from('guides')
    .select('id, slug, title, summary, body, domain, guide_type, unit, function_area, location, sub_domain, hero_image_url, status')
    .eq('status','Approved')
  if (error) { console.error('Fetch failed:', error.message); process.exit(1) }

  const guidelines = (all||[]).filter(g => {
    const d = (g.domain||'').toLowerCase(); const gt=(g.guide_type||'').toLowerCase()
    return !d.includes('strategy') && !d.includes('blueprint') && !d.includes('testimonial') &&
           !gt.includes('strategy') && !gt.includes('blueprint') && !gt.includes('testimonial')
  })
  let blueprints = (all||[]).filter(g => (String(g.domain||'').toLowerCase().includes('blueprint') || String(g.guide_type||'').toLowerCase().includes('blueprint')))

  const hasFramework = (bp, fw) => {
    const sub = String(bp.sub_domain||'').toLowerCase()
    const dom = String(bp.domain||'').toLowerCase()
    const gt  = String(bp.guide_type||'').toLowerCase()
    const ti  = String(bp.title||'').toLowerCase()
    const allText = `${sub} ${dom} ${gt} ${ti}`
    if (fw==='products') return allText.includes('product')
    if (fw==='projects') return allText.includes('project')
    return allText.includes(fw)
  }

  let created = 0, updated = 0

  for (const fw of FRAMEWORKS) {
    const existing = blueprints.find(bp => hasFramework(bp, fw))
    if (existing) {
      // Ensure sub_domain tag is set to the framework for reliable filtering
      if ((existing.sub_domain||'').toLowerCase() !== fw) {
        const { error: upErr } = await sb.from('guides').update({ sub_domain: fw, last_updated_at: new Date().toISOString() }).eq('id', existing.id)
        if (!upErr) { updated++ ; existing.sub_domain = fw }
      }
      continue
    }
    // Create from a guideline source (pick first for speed)
    const src = guidelines[created % (guidelines.length || 1)]
    if (!src) break
    const { error: insErr } = await sb.from('guides').insert({
      slug: `blueprint-${slugify(src.slug||src.title)}-${randomUUID().slice(0,8)}`,
      title: src.title,
      summary: src.summary || null,
      body: src.body || src.summary || null,
      domain: 'Blueprint',
      guide_type: src.guide_type || null,
      unit: src.unit || src.function_area || null,
      function_area: src.unit || src.function_area || null,
      location: src.location || null,
      sub_domain: fw,
      hero_image_url: src.hero_image_url || DEFAULT_IMG,
      status: 'Approved'
    })
    if (!insErr) { created++ }
  }

  console.log(`✅ Done. Updated ${updated}, Created ${created} to cover frameworks.`)
}

main().catch(err => { console.error('❌ Error:', err?.message || err); process.exit(1) })
