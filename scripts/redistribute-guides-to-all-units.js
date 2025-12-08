// scripts/redistribute-guides-to-all-units.js
// Redistribute guides so all units have guides in both Guidelines and Blueprints
// Usage: node scripts/redistribute-guides-to-all-units.js

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
    console.log('REDISTRIBUTING GUIDES TO ALL UNITS')
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
    
    console.log(`\nTotal approved guides: ${allGuides.length}`)
    
    // Separate by category
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
    
    console.log(`  Guidelines: ${guidelinesGuides.length}`)
    console.log(`  Blueprints: ${blueprintGuides.length}`)
    
    // Plan: We need 11 units × 2 categories = 22 guides minimum
    // But we have limited guides, so we'll distribute them evenly
    // Strategy: Assign one guide per unit per category, cycling through available guides
    
    const units = Object.entries(UNIT_MAPPING)
    const totalNeeded = units.length * 2 // Guidelines + Blueprints for each unit
    
    console.log(`\n${'='.repeat(60)}`)
    console.log('DISTRIBUTION PLAN')
    console.log('='.repeat(60))
    console.log(`Total units: ${units.length}`)
    console.log(`Total guides needed: ${totalNeeded} (${units.length} Guidelines + ${units.length} Blueprints)`)
    console.log(`Available guides: ${allGuides.length}`)
    
    // Create assignment plan
    const assignments = []
    
    // First, assign Guidelines guides
    let guideIndex = 0
    for (const [unitId, unitName] of units) {
      // Find a guide that can be assigned to this unit as Guidelines
      // Prefer guides that are already Guidelines, or guides without a category
      let guideToAssign = guidelinesGuides[guideIndex % guidelinesGuides.length]
      
      // If we run out of Guidelines guides, convert a Blueprint
      if (!guideToAssign && blueprintGuides.length > 0) {
        guideToAssign = blueprintGuides[guideIndex % blueprintGuides.length]
      }
      
      if (guideToAssign) {
        assignments.push({
          guideId: guideToAssign.id,
          guideTitle: guideToAssign.title,
          unit: unitName,
          category: 'guidelines',
          guideType: GUIDELINES_GUIDE_TYPES[guideIndex % GUIDELINES_GUIDE_TYPES.length]
        })
        guideIndex++
      }
    }
    
    // Then, assign Blueprint guides
    guideIndex = 0
    for (const [unitId, unitName] of units) {
      // Find a guide that can be assigned to this unit as Blueprint
      // Prefer guides that are already Blueprints
      let guideToAssign = blueprintGuides[guideIndex % blueprintGuides.length]
      
      // If we run out of Blueprint guides, convert a Guidelines guide
      if (!guideToAssign && guidelinesGuides.length > 0) {
        guideToAssign = guidelinesGuides[guideIndex % guidelinesGuides.length]
      }
      
      if (guideToAssign) {
        assignments.push({
          guideId: guideToAssign.id,
          guideTitle: guideToAssign.title,
          unit: unitName,
          category: 'blueprints',
          guideType: BLUEPRINT_GUIDE_TYPES[guideIndex % BLUEPRINT_GUIDE_TYPES.length]
        })
        guideIndex++
      }
    }
    
    console.log(`\n${'='.repeat(60)}`)
    console.log('EXECUTING ASSIGNMENTS')
    console.log('='.repeat(60))
    
    // Execute assignments
    for (const assignment of assignments) {
      try {
        const updateData = {
          unit: assignment.unit,
          function_area: assignment.unit
        }
        
        if (assignment.category === 'guidelines') {
          updateData.domain = null
          updateData.guide_type = assignment.guideType
        } else {
          updateData.domain = 'Blueprint'
          updateData.guide_type = assignment.guideType
        }
        
        const { error: updateError } = await sb
          .from('guides')
          .update(updateData)
          .eq('id', assignment.guideId)
        
        if (updateError) {
          console.error(`  ✗ ${assignment.category} - ${assignment.unit}: "${assignment.guideTitle}" - ${updateError.message}`)
        } else {
          console.log(`  ✓ ${assignment.category} - ${assignment.unit}: "${assignment.guideTitle}"`)
        }
      } catch (err) {
        console.error(`  ✗ Network error for "${assignment.guideTitle}":`, err.message)
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
    
    let allGood = true
    for (const [unitId, unitName] of units) {
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
        console.log(`  ✓ ${unitName}: Both categories`)
      } else {
        console.log(`  ✗ ${unitName}: Missing ${!hasGuidelines ? 'Guidelines' : ''} ${!hasBlueprints ? 'Blueprints' : ''}`)
        allGood = false
      }
    }
    
    console.log(`\n${allGood ? '✓' : '✗'} All units have guides in both categories`)
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

