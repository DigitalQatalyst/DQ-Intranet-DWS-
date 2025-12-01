// scripts/final-unit-verification.js
// Final verification and filling of all units for Guidelines and Blueprints
// Usage: node scripts/final-unit-verification.js

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

const UNIT_MAPPING = {
  'deals': 'Deals',
  'dq-delivery-accounts': 'DQ Delivery (Accounts)',
  'dq-delivery-deploys': 'DQ Delivery (Deploys)',
  'dq-delivery-designs': 'DQ Delivery (Designs)',
  'finance': 'Finance',
  'hra': 'HRA',
  'intelligence': 'Intelligence',
  'products': 'Products',
  'secdevops': 'SecDevOps',
  'solutions': 'Solutions',
  'stories': 'Stories'
}

function normalizeValue(value) {
  if (!value) return ''
  return value.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

async function verifyAndFill(category) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`${category.toUpperCase()} - UNIT VERIFICATION`)
  console.log('='.repeat(60))
  
  let allGuides = []
  try {
    const { data, error } = await sb
      .from('guides')
      .select('id, title, guide_type, unit, function_area, domain')
      .eq('status', 'Approved')
    
    if (error) {
      console.error('Error fetching guides:', error)
      return
    }
    allGuides = data || []
  } catch (err) {
    console.error('Network error:', err.message)
    return
  }
  
  // Filter by category
  let categoryGuides = []
  if (category === 'guidelines') {
    categoryGuides = (allGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return !domain.includes('strategy') && 
             !domain.includes('blueprint') && 
             !domain.includes('testimonial') &&
             !guideType.includes('strategy') &&
             !guideType.includes('blueprint') &&
             !guideType.includes('testimonial')
    })
  } else if (category === 'blueprints') {
    categoryGuides = (allGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return domain.includes('blueprint') || guideType.includes('blueprint')
    })
  }
  
  console.log(`\nTotal ${category} guides: ${categoryGuides.length}`)
  
  // Check each unit
  const unitsStatus = []
  for (const [unitId, unitName] of Object.entries(UNIT_MAPPING)) {
    const normalizedUnitId = normalizeValue(unitId)
    const normalizedUnitName = normalizeValue(unitName)
    
    const matchingGuides = categoryGuides.filter(g => {
      const guideUnit = normalizeValue(g.unit || g.function_area || '')
      return guideUnit === normalizedUnitId || 
             guideUnit === normalizedUnitName ||
             guideUnit.includes(normalizedUnitId) ||
             normalizedUnitName.includes(guideUnit)
    })
    
    unitsStatus.push({
      unitId,
      unitName,
      count: matchingGuides.length,
      guides: matchingGuides
    })
    
    if (matchingGuides.length > 0) {
      console.log(`  ✓ ${unitName}: ${matchingGuides.length} guides`)
    } else {
      console.log(`  ✗ ${unitName}: No guides`)
    }
  }
  
  // Fill empty units
  const emptyUnits = unitsStatus.filter(u => u.count === 0)
  if (emptyUnits.length > 0) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`FILLING ${emptyUnits.length} EMPTY ${category.toUpperCase()} UNITS`)
    console.log('='.repeat(60))
    
    // Find guides without units or guides that can be reassigned
    const guidesWithoutUnits = categoryGuides.filter(g => {
      const currentUnit = normalizeValue(g.unit || g.function_area || '')
      return !currentUnit || currentUnit === ''
    })
    
    // Also find guides that are in units with multiple guides (we can reassign one)
    const unitsWithMultipleGuides = unitsStatus.filter(u => u.count > 1)
    const guidesFromMultipleUnits = []
    for (const unit of unitsWithMultipleGuides) {
      guidesFromMultipleUnits.push(...unit.guides.slice(1)) // Take all but first
    }
    
    const availableGuides = [...guidesWithoutUnits, ...guidesFromMultipleUnits]
    
    console.log(`\nAvailable guides for reassignment: ${availableGuides.length}`)
    
    let assigned = 0
    for (const emptyUnit of emptyUnits) {
      if (assigned >= availableGuides.length) {
        console.log(`  ⚠ No more guides for ${emptyUnit.unitName}`)
        continue
      }
      
      const guideToAssign = availableGuides[assigned]
      
      try {
        const { error: updateError } = await sb
          .from('guides')
          .update({ 
            unit: emptyUnit.unitName,
            function_area: emptyUnit.unitName
          })
          .eq('id', guideToAssign.id)
        
        if (updateError) {
          console.error(`  ✗ Error assigning "${guideToAssign.title}":`, updateError.message)
        } else {
          console.log(`  ✓ Assigned "${guideToAssign.title}" to ${emptyUnit.unitName}`)
          assigned++
        }
      } catch (err) {
        console.error(`  ✗ Network error:`, err.message)
      }
    }
  }
  
  // Final check
  console.log(`\n${'='.repeat(60)}`)
  console.log(`FINAL ${category.toUpperCase()} STATUS`)
  console.log('='.repeat(60))
  
  // Re-fetch
  try {
    const { data: finalData } = await sb
      .from('guides')
      .select('id, title, guide_type, unit, function_area, domain')
      .eq('status', 'Approved')
    
    let finalCategoryGuides = []
    if (category === 'guidelines') {
      finalCategoryGuides = (finalData || []).filter(g => {
        const domain = (g.domain || '').toLowerCase()
        const guideType = (g.guide_type || '').toLowerCase()
        return !domain.includes('strategy') && 
               !domain.includes('blueprint') && 
               !domain.includes('testimonial') &&
               !guideType.includes('strategy') &&
               !guideType.includes('blueprint') &&
               !guideType.includes('testimonial')
      })
    } else if (category === 'blueprints') {
      finalCategoryGuides = (finalData || []).filter(g => {
        const domain = (g.domain || '').toLowerCase()
        const guideType = (g.guide_type || '').toLowerCase()
        return domain.includes('blueprint') || guideType.includes('blueprint')
      })
    }
    
    let allHaveGuides = true
    for (const [unitId, unitName] of Object.entries(UNIT_MAPPING)) {
      const normalizedUnitId = normalizeValue(unitId)
      const normalizedUnitName = normalizeValue(unitName)
      
      const matchingGuides = finalCategoryGuides.filter(g => {
        const guideUnit = normalizeValue(g.unit || g.function_area || '')
        return guideUnit === normalizedUnitId || 
               guideUnit === normalizedUnitName ||
               guideUnit.includes(normalizedUnitId) ||
               normalizedUnitName.includes(guideUnit)
      })
      
      if (matchingGuides.length > 0) {
        console.log(`  ✓ ${unitName}: ${matchingGuides.length} guides`)
      } else {
        console.log(`  ✗ ${unitName}: Still no guides`)
        allHaveGuides = false
      }
    }
    
    return allHaveGuides
  } catch (err) {
    console.error('Error in final check:', err.message)
    return false
  }
}

async function main() {
  try {
    const guidelinesOk = await verifyAndFill('guidelines')
    const blueprintsOk = await verifyAndFill('blueprints')
    
    console.log(`\n${'='.repeat(60)}`)
    console.log('FINAL SUMMARY')
    console.log('='.repeat(60))
    console.log(`Guidelines: ${guidelinesOk ? '✓ All units have guides' : '✗ Some units missing guides'}`)
    console.log(`Blueprints: ${blueprintsOk ? '✓ All units have guides' : '✗ Some units missing guides'}`)
    
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

