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

const TITLE = 'Blueprint: SecDevOps Process'
const SLUG = 'blueprint-secdevops-process'
const SUMMARY = 'Security and DevOps process blueprint covering CI/CD, IaC, observability, and controls.'
const BODY = `# SecDevOps Process Blueprint\n\nThis blueprint defines a practical, secure-by-default operating model for building and running software using CI/CD, Infrastructure as Code, observability, and automated controls.`
// DevOps-themed image
const BASE_PHOTO = 'photo-1552664730-d307ca884978'
const imageFor = (id) => {
  const u = createHash('md5').update(id).digest('hex').slice(0, 8)
  return `https://images.unsplash.com/${BASE_PHOTO}?w=800&h=400&fit=crop&q=80&u=${u}`
}

async function main() {
  console.log('🔁 Restoring DevOps Blueprint card...')

  // Try to find by slug or title
  const { data: existingBySlug } = await sb
    .from('guides')
    .select('id, slug, title')
    .eq('slug', SLUG)
    .maybeSingle()

  let id = existingBySlug?.id || null
  if (!id) {
    const { data: existingByTitle } = await sb
      .from('guides')
      .select('id, slug, title')
      .eq('title', TITLE)
      .maybeSingle()
    id = existingByTitle?.id || null
  }

  if (id) {
    const { error: updErr } = await sb
      .from('guides')
      .update({
        title: TITLE,
        summary: SUMMARY,
        body: BODY,
        domain: 'Blueprint',
        guide_type: 'Process',
        unit: 'SecDevOps',
        function_area: 'SecDevOps',
        sub_domain: 'devops',
        hero_image_url: imageFor(id),
        status: 'Approved',
        last_updated_at: new Date().toISOString(),
      })
      .eq('id', id)
    if (updErr) {
      console.error('✗ Update failed:', updErr.message)
    } else {
      console.log('✓ Updated existing DevOps Blueprint')
    }
  } else {
    const { data: inserted, error: insErr } = await sb
      .from('guides')
      .insert({
        slug: SLUG,
        title: TITLE,
        summary: SUMMARY,
        body: BODY,
        domain: 'Blueprint',
        guide_type: 'Process',
        unit: 'SecDevOps',
        function_area: 'SecDevOps',
        sub_domain: 'devops',
        hero_image_url: imageFor(SLUG),
        status: 'Approved',
      })
      .select('id')
      .maybeSingle()
    if (insErr) {
      console.error('✗ Insert failed:', insErr.message)
    } else {
      console.log('✓ Created DevOps Blueprint')
    }
  }

  // Verify
  const { data: verify } = await sb
    .from('guides')
    .select('id, title, slug, domain, guide_type, sub_domain, hero_image_url')
    .eq('status', 'Approved')
    .eq('slug', SLUG)
    .maybeSingle()
  if (verify) {
    console.log('✅ DevOps Blueprint ready:', verify.title)
  }
}

main().catch(err => { console.error('❌ Error:', err?.message || err); process.exit(1) })
