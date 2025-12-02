// scripts/check-guidelines-in-db.js
// Check what Guidelines guides exist in the database
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
  const { data: allGuides, error } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit, function_area, location')
    .eq('status', 'Approved')
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  // Filter Guidelines guides (not Strategy, Blueprint, or Testimonial)
  const guidelines = (allGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return !d.includes('strategy') && 
           !d.includes('blueprint') && 
           !d.includes('testimonial') &&
           !gt.includes('strategy') &&
           !gt.includes('blueprint') &&
           !gt.includes('testimonial')
  })
  
  console.log(`Total approved guides: ${allGuides.length}`)
  console.log(`Guidelines guides: ${guidelines.length}\n`)
  
  if (guidelines.length === 0) {
    console.log('❌ No Guidelines guides found in database')
  } else {
    console.log('✅ Guidelines guides found:\n')
    guidelines.forEach((g, i) => {
      console.log(`${i + 1}. ${g.title}`)
      console.log(`   Guide Type: ${g.guide_type || 'N/A'}`)
      console.log(`   Domain: ${g.domain || 'null'}`)
      console.log(`   Unit: ${g.unit || g.function_area || 'N/A'}`)
      console.log(`   Location: ${g.location || 'N/A'}`)
      console.log('')
    })
    
    // Summary by guide type
    const byType = {}
    guidelines.forEach(g => {
      const type = g.guide_type || 'None'
      if (!byType[type]) byType[type] = []
      byType[type].push(g.title)
    })
    
    console.log('Summary by Guide Type:')
    for (const [type, titles] of Object.entries(byType)) {
      console.log(`  ${type}: ${titles.length} guides`)
    }
    
    // Summary by unit
    const byUnit = {}
    guidelines.forEach(g => {
      const unit = g.unit || g.function_area || 'None'
      if (!byUnit[unit]) byUnit[unit] = []
      byUnit[unit].push(g.title)
    })
    
    console.log('\nSummary by Unit:')
    for (const [unit, titles] of Object.entries(byUnit)) {
      console.log(`  ${unit}: ${titles.length} guides`)
    }
    
    // Summary by location
    const byLocation = {}
    guidelines.forEach(g => {
      const loc = g.location || 'None'
      if (!byLocation[loc]) byLocation[loc] = []
      byLocation[loc].push(g.title)
    })
    
    console.log('\nSummary by Location:')
    for (const [loc, titles] of Object.entries(byLocation)) {
      console.log(`  ${loc}: ${titles.length} guides`)
    }
  }
}

main().catch(console.error)

