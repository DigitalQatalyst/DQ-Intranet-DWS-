// scripts/ensure-blueprints-have-all-units.js
// Ensure Blueprints has guides for all units
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const REQUIRED_UNITS = [
  'Deals', 'DQ Delivery (Accounts)', 'DQ Delivery (Deploys)', 'DQ Delivery (Designs)',
  'Finance', 'HRA', 'Intelligence', 'Products', 'SecDevOps', 'Solutions', 'Stories'
]

const BLUEPRINT_GUIDE_TYPES = ['Best practice', 'Policy', 'Process', 'SOP']

async function main() {
  const { data: allGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit, function_area')
    .eq('status', 'Approved')
  
  const blueprints = (allGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })
  
  console.log(`Current Blueprints: ${blueprints.length}\n`)
  
  // Check which units have Blueprints
  const unitsWithBlueprints = new Set()
  blueprints.forEach(g => {
    const unit = g.unit || g.function_area
    if (unit) unitsWithBlueprints.add(unit)
  })
  
  const missingUnits = REQUIRED_UNITS.filter(u => !unitsWithBlueprints.has(u))
  
  console.log(`Units with Blueprints: ${unitsWithBlueprints.size}`)
  console.log(`Missing units: ${missingUnits.length}`)
  missingUnits.forEach(u => console.log(`  - ${u}`))
  
  if (missingUnits.length > 0) {
    // Convert some Guidelines guides to Blueprints for missing units
    const guidelines = (allGuides || []).filter(g => {
      const d = (g.domain || '').toLowerCase()
      const gt = (g.guide_type || '').toLowerCase()
      return !d.includes('strategy') && !d.includes('blueprint') && !d.includes('testimonial') &&
             !gt.includes('strategy') && !gt.includes('blueprint') && !gt.includes('testimonial')
    })
    
    console.log(`\nConverting ${missingUnits.length} Guidelines guides to Blueprints...\n`)
    
    for (let i = 0; i < missingUnits.length && i < guidelines.length; i++) {
      const unit = missingUnits[i]
      const guide = guidelines[i]
      const guideType = BLUEPRINT_GUIDE_TYPES[i % BLUEPRINT_GUIDE_TYPES.length]
      
      try {
        const { error } = await sb
          .from('guides')
          .update({
            domain: 'Blueprint',
            guide_type: guideType,
            unit: unit,
            function_area: unit
          })
          .eq('id', guide.id)
        
        if (error) {
          console.error(`  ✗ ${guide.title}: ${error.message}`)
        } else {
          console.log(`  ✓ ${guide.title} → Blueprint (${unit}, ${guideType})`)
        }
      } catch (err) {
        console.error(`  ✗ ${guide.title}: ${err.message}`)
      }
    }
  }
  
  // Final check
  const { data: finalGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit')
    .eq('status', 'Approved')
  
  const finalBlueprints = (finalGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })
  
  console.log(`\n✓ Final Blueprints: ${finalBlueprints.length} guides`)
  finalBlueprints.forEach(g => console.log(`  - ${g.title} (${g.unit || 'N/A'})`))
}

main().catch(console.error)

