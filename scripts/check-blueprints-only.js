// scripts/check-blueprints-only.js
// Check Blueprints guides only
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const REQUIRED_GUIDE_TYPES = ['Best practice', 'Policy', 'Process', 'SOP']
const REQUIRED_UNITS = [
  'Deals', 'DQ Delivery (Accounts)', 'DQ Delivery (Deploys)', 'DQ Delivery (Designs)',
  'Finance', 'HRA', 'Intelligence', 'Products', 'SecDevOps', 'Solutions', 'Stories'
]
const REQUIRED_LOCATIONS = ['DXB', 'KSA', 'NBO']

async function main() {
  const { data: allGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit, function_area, location')
    .eq('status', 'Approved')
  
  const blueprints = (allGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })
  
  console.log(`Total Blueprint guides: ${blueprints.length}\n`)
  
  if (blueprints.length === 0) {
    console.log('❌ No Blueprint guides found!')
    return
  }
  
  blueprints.forEach((g, i) => {
    console.log(`${i + 1}. ${g.title}`)
    console.log(`   Guide Type: ${g.guide_type || 'N/A'}`)
    console.log(`   Domain: ${g.domain || 'N/A'}`)
    console.log(`   Unit: ${g.unit || g.function_area || 'N/A'}`)
    console.log(`   Location: ${g.location || 'N/A'}`)
    console.log('')
  })
  
  // Check Guide Types
  const byGuideType = {}
  blueprints.forEach(g => {
    const type = g.guide_type || 'None'
    if (!byGuideType[type]) byGuideType[type] = []
    byGuideType[type].push(g.title)
  })
  
  console.log('Guide Types:')
  for (const type of REQUIRED_GUIDE_TYPES) {
    const count = (byGuideType[type] || []).length
    if (count === 0) {
      console.log(`  ✗ ${type}: No guides`)
    } else {
      console.log(`  ✓ ${type}: ${count} guides`)
    }
  }
  
  // Check Units
  const byUnit = {}
  blueprints.forEach(g => {
    const unit = g.unit || g.function_area || 'None'
    if (!byUnit[unit]) byUnit[unit] = []
    byUnit[unit].push(g.title)
  })
  
  console.log('\nUnits:')
  for (const unit of REQUIRED_UNITS) {
    const count = (byUnit[unit] || []).length
    if (count === 0) {
      console.log(`  ✗ ${unit}: No guides`)
    } else {
      console.log(`  ✓ ${unit}: ${count} guides`)
    }
  }
  
  // Check Locations
  const byLocation = {}
  blueprints.forEach(g => {
    const loc = g.location || 'None'
    if (!byLocation[loc]) byLocation[loc] = []
    byLocation[loc].push(g.title)
  })
  
  console.log('\nLocations:')
  for (const loc of REQUIRED_LOCATIONS) {
    const count = (byLocation[loc] || []).length
    if (count === 0) {
      console.log(`  ✗ ${loc}: No guides`)
    } else {
      console.log(`  ✓ ${loc}: ${count} guides`)
    }
  }
}

main().catch(console.error)

