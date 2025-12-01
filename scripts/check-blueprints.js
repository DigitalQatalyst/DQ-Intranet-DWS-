// scripts/check-blueprints.js
// Quick check of Blueprints guides
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
    .select('id, title, guide_type, domain, unit, function_area')
    .eq('status', 'Approved')
  
  const blueprints = (data || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })
  
  console.log(`Found ${blueprints.length} Blueprint guides:\n`)
  blueprints.forEach(g => {
    console.log(`  - ${g.title}`)
    console.log(`    domain: ${g.domain || 'N/A'}`)
    console.log(`    guide_type: ${g.guide_type || 'N/A'}`)
    console.log(`    unit: ${g.unit || g.function_area || 'N/A'}`)
    console.log('')
  })
}

main().catch(console.error)

