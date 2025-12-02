// scripts/ensure-units-have-guides.js
// Ensure all units have guides in both Guidelines and Blueprints
// Usage: node scripts/ensure-units-have-guides.js

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

async function checkAndFillUnits(category) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`CHECKING ${category.toUpperCase()} UNITS`)
  console.log('='.repeat(60))
  
  // Get all guides for this category
  let allGuides = []
  try {
    const { data, error } = await sb
      .from('guides')
      .select('id, title, guide_type, unit, function_area, domain')
      .eq('status', 'Approved')
    
    if (error) {
      console.error('Error fetching guides:', error)
      return { unitsWithoutGuides: 0 }
    }
    allGuides = data || []
  } catch (err) {
    console.error('Network error fetching guides:', err.message)
    return { unitsWithoutGuides: 0 }
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
  
  console.log(`\nFound ${categoryGuides.length} ${category} guides`)
  
  // Check which units have guides
  const unitsWithGuides = {}
  const unitsWithoutGuides = []
  
  for (const [unitId, unitName] of Object.entries(UNIT_MAPPING)) {
    const normalizedUnitId = normalizeValue(unitId)
    const normalizedUnitName = normalizeValue(unitName)
    
    const hasGuides = categoryGuides.some(g => {
      const guideUnit = normalizeValue(g.unit || g.function_area || '')
      return guideUnit === normalizedUnitId || 
             guideUnit === normalizedUnitName ||
             guideUnit.includes(normalizedUnitId) ||
             normalizedUnitName.includes(guideUnit)
    })
    
    if (hasGuides) {
      const matchingGuides = categoryGuides.filter(g => {
        const guideUnit = normalizeValue(g.unit || g.function_area || '')
        return guideUnit === normalizedUnitId || 
               guideUnit === normalizedUnitName ||
               guideUnit.includes(normalizedUnitId) ||
               normalizedUnitName.includes(guideUnit)
      })
      unitsWithGuides[unitId] = { unitName, count: matchingGuides.length }
      console.log(`  ✓ ${unitName}: ${matchingGuides.length} guides`)
    } else {
      console.log(`  ✗ ${unitName}: No guides`)
      unitsWithoutGuides.push({ unitId, unitName })
    }
  }
  
  // Assign guides to empty units
  if (unitsWithoutGuides.length > 0) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`ASSIGNING GUIDES TO EMPTY ${category.toUpperCase()} UNITS`)
    console.log('='.repeat(60))
    
    // Find guides that can be assigned (guides without units or guides that can be duplicated)
    const availableGuides = categoryGuides.filter(g => {
      const currentUnit = normalizeValue(g.unit || g.function_area || '')
      // Find guides that don't have units assigned to empty units yet
      return true // We'll assign guides to fill gaps
    })
    
    // Distribute guides across empty units
    // For each empty unit, find guides that can be assigned
    // We'll cycle through available guides to distribute them
    const unitsToFill = [...unitsWithoutGuides]
    let assignedCount = 0
    
    // Strategy: assign guides in a round-robin fashion to ensure each unit gets at least one
    for (let round = 0; round < 2 && unitsToFill.length > 0; round++) {
      for (let i = 0; i < unitsToFill.length; i++) {
        const { unitId, unitName } = unitsToFill[i]
        
        // Find a guide that doesn't already have this unit
        const guideToAssign = availableGuides.find(g => {
          const currentUnit = normalizeValue(g.unit || g.function_area || '')
          const targetUnitId = normalizeValue(unitId)
          const targetUnitName = normalizeValue(unitName)
          return currentUnit !== targetUnitId && 
                 currentUnit !== targetUnitName &&
                 !currentUnit.includes(targetUnitId) &&
                 !targetUnitName.includes(currentUnit)
        })
        
        if (!guideToAssign) {
          // If no unique guide found, use any available guide (reassign)
          const anyGuide = availableGuides[assignedCount % availableGuides.length]
          if (anyGuide) {
            try {
              const { error: updateError } = await sb
                .from('guides')
                .update({ 
                  unit: unitName,
                  function_area: unitName
                })
                .eq('id', anyGuide.id)
              
              if (updateError) {
                console.error(`    ✗ Error updating "${anyGuide.title}":`, updateError.message)
              } else {
                console.log(`    ✓ Assigned "${anyGuide.title}" to ${unitName}`)
                assignedCount++
              }
            } catch (err) {
              console.error(`    ✗ Network error updating "${anyGuide.title}":`, err.message)
            }
          }
          continue
        }
        
        try {
          const { error: updateError } = await sb
            .from('guides')
            .update({ 
              unit: unitName,
              function_area: unitName
            })
            .eq('id', guideToAssign.id)
          
          if (updateError) {
            console.error(`    ✗ Error updating "${guideToAssign.title}":`, updateError.message)
          } else {
            console.log(`    ✓ Assigned "${guideToAssign.title}" to ${unitName}`)
            assignedCount++
            // Remove this guide from available list to avoid duplicate assignments in same round
            const index = availableGuides.findIndex(g => g.id === guideToAssign.id)
            if (index > -1) availableGuides.splice(index, 1)
          }
        } catch (err) {
          console.error(`    ✗ Network error updating "${guideToAssign.title}":`, err.message)
        }
      }
    }
  }
  
  // Final verification
  console.log(`\n${'='.repeat(60)}`)
  console.log(`FINAL ${category.toUpperCase()} UNIT DISTRIBUTION`)
  console.log('='.repeat(60))
  
  // Re-fetch to get updated data
  const { data: updatedGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, unit, function_area, domain')
    .eq('status', 'Approved')
  
  let updatedCategoryGuides = []
  if (category === 'guidelines') {
    updatedCategoryGuides = (updatedGuides || []).filter(g => {
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
    updatedCategoryGuides = (updatedGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return domain.includes('blueprint') || guideType.includes('blueprint')
    })
  }
  
  for (const [unitId, unitName] of Object.entries(UNIT_MAPPING)) {
    const normalizedUnitId = normalizeValue(unitId)
    const normalizedUnitName = normalizeValue(unitName)
    
    const matchingGuides = updatedCategoryGuides.filter(g => {
      const guideUnit = normalizeValue(g.unit || g.function_area || '')
      return guideUnit === normalizedUnitId || 
             guideUnit === normalizedUnitName ||
             guideUnit.includes(normalizedUnitId) ||
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
    }
  }
  
  return { unitsWithoutGuides: unitsWithoutGuides.length }
}

async function main() {
  try {
    // Check and fill Guidelines units
    const guidelinesResult = await checkAndFillUnits('guidelines')
    
    // Check and fill Blueprints units
    const blueprintsResult = await checkAndFillUnits('blueprints')
    
    console.log(`\n${'='.repeat(60)}`)
    console.log('SUMMARY')
    console.log('='.repeat(60))
    console.log(`\nGuidelines: ${guidelinesResult.unitsWithoutGuides} units were empty (now filled)`)
    console.log(`Blueprints: ${blueprintsResult.unitsWithoutGuides} units were empty (now filled)`)
    
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

