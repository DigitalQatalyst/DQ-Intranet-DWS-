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

function slugify(text) { return String(text||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'') }

async function main() {
  console.log('🔁 Resetting Blueprints to EXACTLY mirror domain=Guidelines...')

  // 1) Fetch current approved Guidelines (strict: domain === 'Guidelines', case-insensitive)
  const { data: guidelines, error: gErr } = await sb
    .from('guides')
    .select('id, slug, title, summary, body, guide_type, unit, function_area, location, hero_image_url')
    .eq('status', 'Approved')
    .ilike('domain', 'guidelines')

  if (gErr) { console.error('❌ Fetch Guidelines failed:', gErr.message); process.exit(1) }
  const source = guidelines || []
  console.log(`   ✓ Found ${source.length} Guidelines to mirror`)

  // 2) Delete ALL existing Blueprints
  const { data: existingBps } = await sb
    .from('guides')
    .select('id, title')
    .eq('status', 'Approved')
    .or('domain.ilike.%blueprint%,guide_type.ilike.%blueprint%')

  if (existingBps && existingBps.length) {
    console.log(`   🗑️  Deleting ${existingBps.length} existing Blueprints...`)
    const ids = existingBps.map(r => r.id)
    const { error: delErr } = await sb.from('guides').delete().in('id', ids)
    if (delErr) { console.error('❌ Delete Blueprints failed:', delErr.message); process.exit(1) }
  }

  // 3) Insert Blueprints cloned from Guidelines (carry images)
  let inserted = 0
  for (const g of source) {
    const uniqueSlug = `blueprint-${slugify(g.slug || g.title)}-${randomUUID().slice(0,8)}`
    const { error: insErr } = await sb
      .from('guides')
      .insert({
        slug: uniqueSlug,
        title: g.title,
        summary: g.summary || null,
        body: g.body || g.summary || null,
        domain: 'Blueprint',
        guide_type: g.guide_type || null,
        unit: g.unit || g.function_area || null,
        function_area: g.unit || g.function_area || null,
        location: g.location || null,
        hero_image_url: g.hero_image_url || null,
        status: 'Approved'
      })
    if (insErr) {
      console.error(`   ✗ Insert failed for ${g.title}: ${insErr.message}`)
    } else {
      inserted++
    }
  }

  console.log(`   ✅ Inserted ${inserted} Blueprints from ${source.length} Guidelines`)

  // 4) Verify counts
  const { data: verifyGuides } = await sb
    .from('guides')
    .select('id, domain, guide_type')
    .eq('status', 'Approved')
  const countGuidelines = (verifyGuides||[]).filter(r => (String(r.domain||'').toLowerCase()==='guidelines')).length
  const countBlueprints = (verifyGuides||[]).filter(r => (String(r.domain||'').toLowerCase().includes('blueprint') || String(r.guide_type||'').toLowerCase().includes('blueprint'))).length
  console.log(`\n📊 Final counts -> Guidelines: ${countGuidelines}, Blueprints: ${countBlueprints}`)
}

main().catch(err => { console.error('❌ Error:', err?.message || err); process.exit(1) })
