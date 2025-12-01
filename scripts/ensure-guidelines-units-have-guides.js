// scripts/ensure-guidelines-units-have-guides.js
// Ensure all units have guides in Guidelines tab
// Usage: node scripts/ensure-guidelines-units-have-guides.js

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

function normalizeValue(value) {
  if (!value) return ''
  return value.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

async function main() {
  try {
    console.log('='.repeat(60))
    console.log('ENSURING GUIDELINES UNITS HAVE GUIDES')
    console.log('='.repeat(60))
    
    // Get all approved guides
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
    
    // Filter Guidelines guides (not Strategy, Blueprint, or Testimonial)
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
    
    console.log(`\nFound ${guidelinesGuides.length} Guidelines guides`)
    
    // Check which units have guides
    console.log(`\n${'='.repeat(60)}`)
    console.log('CHECKING UNIT COVERAGE')
    console.log('='.repeat(60))
    
    const unitsStatus = []
    for (const unitName of REQUIRED_UNITS) {
      const normalizedUnitName = normalizeValue(unitName)
      
      const matchingGuides = guidelinesGuides.filter(g => {
        const guideUnit = normalizeValue(g.unit || g.function_area || '')
        return guideUnit === normalizedUnitName || 
               guideUnit.includes(normalizedUnitName) ||
               normalizedUnitName.includes(guideUnit)
      })
      
      unitsStatus.push({
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
    
    // Find units that need guides
    const emptyUnits = unitsStatus.filter(u => u.count === 0)
    const unitsWithMultipleGuides = unitsStatus.filter(u => u.count > 1)
    
    console.log(`\n${emptyUnits.length} units need guides`)
    console.log(`${unitsWithMultipleGuides.length} units have multiple guides (can redistribute)`)
    
    if (emptyUnits.length > 0) {
      console.log(`\n${'='.repeat(60)}`)
      console.log('FILLING EMPTY UNITS')
      console.log('='.repeat(60))
      
      // Strategy 1: Use guides from units with multiple guides
      const guidesToReassign = []
      for (const unit of unitsWithMultipleGuides) {
        // Take all but the first guide from units with multiple guides
        guidesToReassign.push(...unit.guides.slice(1))
      }
      
      // Strategy 2: Use guides without units
      const guidesWithoutUnits = guidelinesGuides.filter(g => {
        const guideUnit = normalizeValue(g.unit || g.function_area || '')
        return !guideUnit || guideUnit === ''
      })
      
      const availableGuides = [...guidesToReassign, ...guidesWithoutUnits]
      
      console.log(`\nAvailable guides for reassignment: ${availableGuides.length}`)
      
      // Assign guides to empty units
      let assigned = 0
      for (const emptyUnit of emptyUnits) {
        if (assigned >= availableGuides.length) {
          console.log(`  ⚠ No more guides available for ${emptyUnit.unitName}`)
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
    
    // Final verification
    console.log(`\n${'='.repeat(60)}`)
    console.log('FINAL GUIDELINES UNIT STATUS')
    console.log('='.repeat(60))
    
    // Re-fetch to get updated data
    let finalGuides = []
    try {
      const { data: finalData } = await sb
        .from('guides')
        .select('id, title, guide_type, unit, function_area, domain')
        .eq('status', 'Approved')
      
      finalGuides = finalData || []
    } catch (err) {
      console.error('Network error fetching final data:', err.message)
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

