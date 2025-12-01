// scripts/balance-guides-between-categories.js
// Balance guides between Guidelines and Blueprints to ensure all units have guides in both
// Usage: node scripts/balance-guides-between-categories.js

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

const BLUEPRINT_GUIDE_TYPES = ['Best practice', 'Policy', 'Process', 'SOP']
const GUIDELINES_GUIDE_TYPES = ['Best Practice', 'Policy', 'Process', 'SOP']

function normalizeValue(value) {
  if (!value) return ''
  return value.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

async function main() {
  try {
    console.log('='.repeat(60))
    console.log('BALANCING GUIDES BETWEEN GUIDELINES AND BLUEPRINTS')
    console.log('='.repeat(60))
    
    // Get all approved guides
    const { data: allGuides, error } = await sb
      .from('guides')
      .select('id, title, guide_type, unit, function_area, domain')
      .eq('status', 'Approved')
    
    if (error) {
      console.error('Error fetching guides:', error)
      return
    }
    
    // Categorize guides
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
    
    const blueprintGuides = (allGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return domain.includes('blueprint') || guideType.includes('blueprint')
    })
    
    console.log(`\nCurrent state:`)
    console.log(`  Guidelines: ${guidelinesGuides.length} guides`)
    console.log(`  Blueprints: ${blueprintGuides.length} guides`)
    
    // Check which units need guides in each category
    console.log(`\n${'='.repeat(60)}`)
    console.log('CHECKING UNIT COVERAGE')
    console.log('='.repeat(60))
    
    const unitsNeedingGuidelines = []
    const unitsNeedingBlueprints = []
    
    for (const [unitId, unitName] of Object.entries(UNIT_MAPPING)) {
      const normalizedUnitName = normalizeValue(unitName)
      
      const hasGuidelines = guidelinesGuides.some(g => {
        const guideUnit = normalizeValue(g.unit || g.function_area || '')
        return guideUnit === normalizedUnitName || 
               guideUnit.includes(normalizedUnitName) ||
               normalizedUnitName.includes(guideUnit)
      })
      
      const hasBlueprints = blueprintGuides.some(g => {
        const guideUnit = normalizeValue(g.unit || g.function_area || '')
        return guideUnit === normalizedUnitName || 
               guideUnit.includes(normalizedUnitName) ||
               normalizedUnitName.includes(guideUnit)
      })
      
      if (!hasGuidelines) {
        unitsNeedingGuidelines.push({ unitId, unitName })
        console.log(`  ✗ ${unitName}: Missing Guidelines`)
      }
      if (!hasBlueprints) {
        unitsNeedingBlueprints.push({ unitId, unitName })
        console.log(`  ✗ ${unitName}: Missing Blueprints`)
      }
      if (hasGuidelines && hasBlueprints) {
        console.log(`  ✓ ${unitName}: Has both`)
      }
    }
    
    // Strategy: Convert some Blueprints back to Guidelines for units that need Guidelines
    if (unitsNeedingGuidelines.length > 0 && blueprintGuides.length > unitsNeedingGuidelines.length) {
      console.log(`\n${'='.repeat(60)}`)
      console.log('CONVERTING BLUEPRINTS TO GUIDELINES')
      console.log('='.repeat(60))
      
      // Find Blueprint guides that can be converted (ones in units that already have multiple Blueprints)
      const blueprintsByUnit = new Map()
      for (const guide of blueprintGuides) {
        const guideUnit = normalizeValue(guide.unit || guide.function_area || '')
        if (!blueprintsByUnit.has(guideUnit)) {
          blueprintsByUnit.set(guideUnit, [])
        }
        blueprintsByUnit.get(guideUnit).push(guide)
      }
      
      let converted = 0
      for (const { unitId, unitName } of unitsNeedingGuidelines) {
        if (converted >= unitsNeedingGuidelines.length) break
        
        // Find a Blueprint guide in a unit that has multiple Blueprints
        let guideToConvert = null
        for (const [unit, guides] of blueprintsByUnit.entries()) {
          if (guides.length > 1) {
            guideToConvert = guides[0] // Take first one
            blueprintsByUnit.set(unit, guides.slice(1)) // Remove from list
            break
          }
        }
        
        if (!guideToConvert) {
          // If no unit has multiple, just take any Blueprint guide
          guideToConvert = blueprintGuides.find(g => {
            const guideUnit = normalizeValue(g.unit || g.function_area || '')
            const targetUnit = normalizeValue(unitName)
            return guideUnit !== targetUnit
          })
        }
        
        if (guideToConvert) {
          const randomGuideType = GUIDELINES_GUIDE_TYPES[converted % GUIDELINES_GUIDE_TYPES.length]
          
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
              console.log(`  ✓ Converted "${guideToConvert.title}" to Guidelines (${unitName})`)
              converted++
            }
          } catch (err) {
            console.error(`  ✗ Network error:`, err.message)
          }
        }
      }
    }
    
    // Fill remaining Blueprint gaps
    if (unitsNeedingBlueprints.length > 0) {
      console.log(`\n${'='.repeat(60)}`)
      console.log('FILLING REMAINING BLUEPRINT GAPS')
      console.log('='.repeat(60))
      
      // Re-fetch to get updated data
      const { data: updatedGuides } = await sb
        .from('guides')
        .select('id, title, guide_type, unit, function_area, domain')
        .eq('status', 'Approved')
      
      const updatedGuidelines = (updatedGuides || []).filter(g => {
        const domain = (g.domain || '').toLowerCase()
        const guideType = (g.guide_type || '').toLowerCase()
        return !domain.includes('strategy') && 
               !domain.includes('blueprint') && 
               !domain.includes('testimonial') &&
               !guideType.includes('strategy') &&
               !guideType.includes('blueprint') &&
               !guideType.includes('testimonial')
      })
      
      // Find Guidelines guides in units that have multiple guides
      const guidelinesByUnit = new Map()
      for (const guide of updatedGuidelines) {
        const guideUnit = normalizeValue(guide.unit || guide.function_area || '')
        if (!guidelinesByUnit.has(guideUnit)) {
          guidelinesByUnit.set(guideUnit, [])
        }
        guidelinesByUnit.get(guideUnit).push(guide)
      }
      
      for (const { unitId, unitName } of unitsNeedingBlueprints) {
        // Find a Guidelines guide in a unit that has multiple guides
        let guideToConvert = null
        for (const [unit, guides] of guidelinesByUnit.entries()) {
          if (guides.length > 1) {
            guideToConvert = guides[0]
            guidelinesByUnit.set(unit, guides.slice(1))
            break
          }
        }
        
        if (!guideToConvert) {
          // Take any Guidelines guide
          guideToConvert = updatedGuidelines.find(g => {
            const guideUnit = normalizeValue(g.unit || g.function_area || '')
            const targetUnit = normalizeValue(unitName)
            return guideUnit !== targetUnit
          })
        }
        
        if (guideToConvert) {
          const randomGuideType = BLUEPRINT_GUIDE_TYPES[Math.floor(Math.random() * BLUEPRINT_GUIDE_TYPES.length)]
          
          try {
            const { error: updateError } = await sb
              .from('guides')
              .update({ 
                domain: 'Blueprint',
                guide_type: randomGuideType,
                unit: unitName,
                function_area: unitName
              })
              .eq('id', guideToConvert.id)
            
            if (updateError) {
              console.error(`  ✗ Error converting "${guideToConvert.title}":`, updateError.message)
            } else {
              console.log(`  ✓ Converted "${guideToConvert.title}" to Blueprint (${unitName})`)
            }
          } catch (err) {
            console.error(`  ✗ Network error:`, err.message)
          }
        }
      }
    }
    
    // Final verification
    console.log(`\n${'='.repeat(60)}`)
    console.log('FINAL VERIFICATION')
    console.log('='.repeat(60))
    
    const { data: finalGuides } = await sb
      .from('guides')
      .select('id, title, guide_type, unit, function_area, domain')
      .eq('status', 'Approved')
    
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
    
    const finalBlueprints = (finalGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return domain.includes('blueprint') || guideType.includes('blueprint')
    })
    
    console.log(`\nGuidelines: ${finalGuidelines.length} guides`)
    console.log(`Blueprints: ${finalBlueprints.length} guides`)
    
    let allUnitsHaveBoth = true
    for (const [unitId, unitName] of Object.entries(UNIT_MAPPING)) {
      const normalizedUnitName = normalizeValue(unitName)
      
      const hasGuidelines = finalGuidelines.some(g => {
        const guideUnit = normalizeValue(g.unit || g.function_area || '')
        return guideUnit === normalizedUnitName || 
               guideUnit.includes(normalizedUnitName) ||
               normalizedUnitName.includes(guideUnit)
      })
      
      const hasBlueprints = finalBlueprints.some(g => {
        const guideUnit = normalizeValue(g.unit || g.function_area || '')
        return guideUnit === normalizedUnitName || 
               guideUnit.includes(normalizedUnitName) ||
               normalizedUnitName.includes(guideUnit)
      })
      
      if (hasGuidelines && hasBlueprints) {
        console.log(`  ✓ ${unitName}: Has both`)
      } else {
        console.log(`  ✗ ${unitName}: Missing ${!hasGuidelines ? 'Guidelines' : ''} ${!hasBlueprints ? 'Blueprints' : ''}`)
        allUnitsHaveBoth = false
      }
    }
    
    console.log(`\n${allUnitsHaveBoth ? '✓' : '✗'} All units have guides in both categories: ${allUnitsHaveBoth}`)
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

