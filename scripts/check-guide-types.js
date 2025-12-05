// scripts/check-guide-types.js
// Quick check of guide types in Guidelines
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

async function main() {
  const { data } = await sb
    .from('guides')
    .select('id, title, guide_type, domain')
    .eq('status', 'Approved')
  
  const guidelines = (data || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return !d.includes('strategy') && !d.includes('blueprint') && !d.includes('testimonial') &&
           !gt.includes('strategy') && !gt.includes('blueprint') && !gt.includes('testimonial')
  })
  
  console.log('Guidelines guides by guide_type:')
  const byType = {}
  for (const g of guidelines) {
    const type = g.guide_type || 'None'
    if (!byType[type]) byType[type] = []
    byType[type].push(g.title)
  }
  
  for (const [type, titles] of Object.entries(byType)) {
    console.log(`  ${type}: ${titles.length} guides`)
    titles.forEach(t => console.log(`    - ${t}`))
  }
}

main().catch(console.error)

