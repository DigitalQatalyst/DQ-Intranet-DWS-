// scripts/convert-blueprints-to-guidelines.js
// Convert Blueprint guides to Guidelines to fill empty units
// Usage: node scripts/convert-blueprints-to-guidelines.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY envs. Aborting.')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const REQUIRED_UNITS = [
  'Deals',
  'DQ Delivery (Accounts)',
  'DQ Delivery (Deploys)',
  'DQ Delivery (Designs)',
  'Finance',
  'HRA',
  'Intelligence',
  'Products',
  'SecDevOps',
  'Solutions',
  'Stories'
]

const GUIDELINES_GUIDE_TYPES = ['Best Practice', 'Policy', 'Process', 'SOP']

function normalizeValue(value) {
  if (!value) return ''
  return value.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

async function main() {
  try {
    console.log('='.repeat(60))
    console.log('CONVERTING BLUEPRINTS TO GUIDELINES')
    console.log('='.repeat(60))
    
    // Get all approved guides
    let allGuides = []
    try {
      const { data, error } = await sb
        .from('guides')
        .select('id, title, guide_type, unit, function_area, domain')
        .eq('status', 'Approved')
      
      if (error) {
        console.error('Error:', error)
        return
      }
      allGuides = data || []
    } catch (err) {
      console.error('Network error:', err.message)
      return
    }
    
    // Get Guidelines guides and check which units need guides
    const guidelinesGuides = (allGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return !domain.includes('strategy') && 
             !domain.includes('blueprint') && 
             !domain.includes('testimonial') &&
             !guideType.includes('strategy') &&
             !guideType.includes('blueprint') &&
             !guideType.includes('testimonial')
    })
    
    // Get Blueprint guides
    const blueprintGuides = (allGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return domain.includes('blueprint') || guideType.includes('blueprint')
    })
    
    console.log(`\nGuidelines guides: ${guidelinesGuides.length}`)
    console.log(`Blueprint guides: ${blueprintGuides.length}`)
    
    // Check which units need Guidelines guides
    const unitsNeedingGuides = []
    for (const unitName of REQUIRED_UNITS) {
      const normalizedUnitName = normalizeValue(unitName)
      
      const hasGuides = guidelinesGuides.some(g => {
        const guideUnit = normalizeValue(g.unit || g.function_area || '')
        return guideUnit === normalizedUnitName || 
               guideUnit.includes(normalizedUnitName) ||
               normalizedUnitName.includes(guideUnit)
      })
      
      if (!hasGuides) {
        unitsNeedingGuides.push(unitName)
      }
    }
    
    console.log(`\n${unitsNeedingGuides.length} units need Guidelines guides:`)
    unitsNeedingGuides.forEach(u => console.log(`  - ${u}`))
    
    if (unitsNeedingGuides.length === 0) {
      console.log('\n✓ All units already have Guidelines guides!')
      return
    }
    
    // Group Blueprint guides by unit to find units with multiple Blueprints
    const blueprintsByUnit = new Map()
    for (const guide of blueprintGuides) {
      const unit = (guide.unit || guide.function_area || 'uncategorized').toLowerCase()
      if (!blueprintsByUnit.has(unit)) {
        blueprintsByUnit.set(unit, [])
      }
      blueprintsByUnit.get(unit).push(guide)
    }
    
    // Find Blueprint guides that can be converted (from units with multiple Blueprints)
    const guidesToConvert = []
    for (const [unit, guides] of blueprintsByUnit.entries()) {
      if (guides.length > 1) {
        // Take one from units with multiple Blueprints
        guidesToConvert.push(guides[0])
      }
    }
    
    // If not enough, also take single guides
    if (guidesToConvert.length < unitsNeedingGuides.length) {
      for (const [unit, guides] of blueprintsByUnit.entries()) {
        if (guides.length === 1 && guidesToConvert.length < unitsNeedingGuides.length) {
          guidesToConvert.push(guides[0])
        }
      }
    }
    
    console.log(`\n${'='.repeat(60)}`)
    console.log('CONVERTING BLUEPRINTS TO GUIDELINES')
    console.log('='.repeat(60))
    
    // Convert guides to fill empty units
    for (let i = 0; i < unitsNeedingGuides.length && i < guidesToConvert.length; i++) {
      const unitName = unitsNeedingGuides[i]
      const guideToConvert = guidesToConvert[i]
      const randomGuideType = GUIDELINES_GUIDE_TYPES[i % GUIDELINES_GUIDE_TYPES.length]
      
      try {
        const { error: updateError } = await sb
          .from('guides')
          .update({ 
            domain: null, // Clear domain to make it Guidelines
            guide_type: randomGuideType,
            unit: unitName,
            function_area: unitName
          })
          .eq('id', guideToConvert.id)
        
        if (updateError) {
          console.error(`  ✗ Error converting "${guideToConvert.title}":`, updateError.message)
        } else {
          console.log(`  ✓ Converted "${guideToConvert.title}" to Guidelines (${unitName}, ${randomGuideType})`)
        }
      } catch (err) {
        console.error(`  ✗ Network error:`, err.message)
      }
    }
    
    // Final verification
    console.log(`\n${'='.repeat(60)}`)
    console.log('FINAL GUIDELINES UNIT STATUS')
    console.log('='.repeat(60))
    
    // Re-fetch
    let finalGuides = []
    try {
      const { data: finalData } = await sb
        .from('guides')
        .select('id, title, guide_type, unit, function_area, domain')
        .eq('status', 'Approved')
      
      finalGuides = finalData || []
    } catch (err) {
      console.error('Network error:', err.message)
      return
    }
    
    const finalGuidelines = (finalGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return !domain.includes('strategy') && 
             !domain.includes('blueprint') && 
             !domain.includes('testimonial') &&
             !guideType.includes('strategy') &&
             !guideType.includes('blueprint') &&
             !guideType.includes('testimonial')
    })
    
    let allUnitsHaveGuides = true
    for (const unitName of REQUIRED_UNITS) {
      const normalizedUnitName = normalizeValue(unitName)
      
      const matchingGuides = finalGuidelines.filter(g => {
        const guideUnit = normalizeValue(g.unit || g.function_area || '')
        return guideUnit === normalizedUnitName || 
               guideUnit.includes(normalizedUnitName) ||
               normalizedUnitName.includes(guideUnit)
      })
      
      if (matchingGuides.length > 0) {
        console.log(`  ✓ ${unitName}: ${matchingGuides.length} guides`)
        matchingGuides.slice(0, 3).forEach(g => console.log(`    - ${g.title}`))
        if (matchingGuides.length > 3) {
          console.log(`    ... and ${matchingGuides.length - 3} more`)
        }
      } else {
        console.log(`  ✗ ${unitName}: Still no guides`)
        allUnitsHaveGuides = false
      }
    }
    
    console.log(`\n${allUnitsHaveGuides ? '✓' : '✗'} All units have guides: ${allUnitsHaveGuides}`)
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

