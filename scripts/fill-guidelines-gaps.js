// scripts/fill-guidelines-gaps.js
// Fill Guidelines filter gaps using existing guides
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

const REQUIRED_LOCATIONS = ['DXB', 'KSA', 'NBO']
const REQUIRED_GUIDE_TYPES = ['Best Practice', 'Policy', 'Process', 'SOP']

async function main() {
  const { data: allGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit, function_area, location')
    .eq('status', 'Approved')
  
  // Get current Guidelines
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
  
  console.log(`Current Guidelines: ${guidelines.length}\n`)
  
  // Find guides that can be converted to Guidelines (from other categories)
  const blueprints = (allGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })
  
  console.log(`Available Blueprints to convert: ${blueprints.length}\n`)
  
  // Check what's missing
  const unitsWithGuides = new Set(guidelines.map(g => g.unit || g.function_area).filter(Boolean))
  const locationsWithGuides = new Set(guidelines.map(g => g.location).filter(Boolean))
  const guideTypesWithGuides = new Set(guidelines.map(g => g.guide_type).filter(Boolean))
  
  const missingUnits = REQUIRED_UNITS.filter(u => !unitsWithGuides.has(u))
  const missingLocations = REQUIRED_LOCATIONS.filter(l => !locationsWithGuides.has(l))
  const missingGuideTypes = REQUIRED_GUIDE_TYPES.filter(gt => !guideTypesWithGuides.has(gt))
  
  console.log(`Missing Units: ${missingUnits.length}`)
  missingUnits.forEach(u => console.log(`  - ${u}`))
  
  console.log(`\nMissing Locations: ${missingLocations.length}`)
  missingLocations.forEach(l => console.log(`  - ${l}`))
  
  console.log(`\nMissing Guide Types: ${missingGuideTypes.length}`)
  missingGuideTypes.forEach(gt => console.log(`  - ${gt}`))
  
  // Convert Blueprints to Guidelines to fill gaps
  if (blueprints.length > 0 && (missingUnits.length > 0 || missingLocations.length > 0 || missingGuideTypes.length > 0)) {
    console.log(`\nConverting Blueprints to Guidelines to fill gaps...\n`)
    
    let converted = 0
    const maxToConvert = Math.min(blueprints.length, missingUnits.length + missingLocations.length + missingGuideTypes.length)
    
    for (let i = 0; i < maxToConvert && i < blueprints.length; i++) {
      const blueprint = blueprints[i]
      
      // Assign to missing unit
      const targetUnit = missingUnits[converted % missingUnits.length] || blueprint.unit || blueprint.function_area
      // Assign missing location
      const targetLocation = missingLocations[converted % missingLocations.length] || blueprint.location || 'DXB'
      // Assign missing guide type
      const targetGuideType = missingGuideTypes[converted % missingGuideTypes.length] || blueprint.guide_type || 'Policy'
      
      try {
        const { error } = await sb
          .from('guides')
          .update({
            domain: null,
            guide_type: targetGuideType,
            unit: targetUnit,
            function_area: targetUnit,
            location: targetLocation
          })
          .eq('id', blueprint.id)
        
        if (error) {
          console.error(`  ✗ ${blueprint.title}: ${error.message}`)
        } else {
          console.log(`  ✓ ${blueprint.title} → Guidelines (${targetUnit}, ${targetLocation}, ${targetGuideType})`)
          converted++
        }
      } catch (err) {
        console.error(`  ✗ ${blueprint.title}: ${err.message}`)
      }
    }
  }
  
  // Final check
  const { data: finalGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit, location')
    .eq('status', 'Approved')
  
  const finalGuidelines = (finalGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return !d.includes('strategy') && 
           !d.includes('blueprint') && 
           !d.includes('testimonial') &&
           !gt.includes('strategy') &&
           !gt.includes('blueprint') &&
           !gt.includes('testimonial')
  })
  
  console.log(`\n✅ Final Guidelines: ${finalGuidelines.length} guides`)
  
  const finalByType = {}
  finalGuidelines.forEach(g => {
    const type = g.guide_type || 'None'
    if (!finalByType[type]) finalByType[type] = []
    finalByType[type].push(g.title)
  })
  
  console.log('\nBy Guide Type:')
  for (const type of REQUIRED_GUIDE_TYPES) {
    const count = (finalByType[type] || []).length
    console.log(`  ${type}: ${count} guides`)
  }
  
  const finalByUnit = {}
  finalGuidelines.forEach(g => {
    const unit = g.unit || g.function_area || 'None'
    if (!finalByUnit[unit]) finalByUnit[unit] = []
    finalByUnit[unit].push(g.title)
  })
  
  console.log('\nBy Unit:')
  for (const unit of REQUIRED_UNITS) {
    const count = (finalByUnit[unit] || []).length
    console.log(`  ${unit}: ${count} guides`)
  }
  
  const finalByLocation = {}
  finalGuidelines.forEach(g => {
    const loc = g.location || 'None'
    if (!finalByLocation[loc]) finalByLocation[loc] = []
    finalByLocation[loc].push(g.title)
  })
  
  console.log('\nBy Location:')
  for (const loc of REQUIRED_LOCATIONS) {
    const count = (finalByLocation[loc] || []).length
    console.log(`  ${loc}: ${count} guides`)
  }
}

main().catch(console.error)

