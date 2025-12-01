// scripts/check-guidelines-units.js
// Check which guidelines guides have unit values and fix them
// Usage: node scripts/check-guidelines-units.js

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

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeValue(value) {
  if (!value) return ''
  return value.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

async function main() {
  try {
    // Get all guidelines guides (not Strategy, Blueprint, or Testimonial)
    const { data: allGuides, error } = await sb
      .from('guides')
      .select('id, title, slug, unit, function_area, domain, guide_type')
      .eq('status', 'Approved')
      .order('title')
    
    if (error) {
      console.error('Error fetching guides:', error)
      return
    }
    
    // Filter guidelines
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
    
    console.log(`Found ${guidelinesGuides.length} guidelines guides\n`)
    console.log('='.repeat(60))
    console.log('GUIDELINES GUIDES AND THEIR UNITS')
    console.log('='.repeat(60))
    
    const guidesWithoutUnits = []
    const guidesByUnit = {}
    
    for (const guide of guidelinesGuides) {
      const unitValue = guide.unit || guide.function_area || ''
      console.log(`\n"${guide.title}"`)
      console.log(`  Unit: ${unitValue || 'NONE'}`)
      console.log(`  Function Area: ${guide.function_area || 'NONE'}`)
      
      if (!unitValue) {
        guidesWithoutUnits.push(guide)
      } else {
        // Check which filter this matches
        const normalizedUnit = normalizeValue(unitValue)
        let matchedUnit = null
        for (const [unitId, unitName] of Object.entries(UNIT_MAPPING)) {
          const normalizedId = normalizeValue(unitId)
          const normalizedName = normalizeValue(unitName)
          if (normalizedUnit === normalizedId || 
              normalizedUnit === normalizedName ||
              normalizedUnit.includes(normalizedId) ||
              normalizedName.includes(normalizedUnit)) {
            matchedUnit = unitId
            if (!guidesByUnit[unitId]) guidesByUnit[unitId] = []
            guidesByUnit[unitId].push(guide)
            break
          }
        }
        if (matchedUnit) {
          console.log(`  ✓ Matches filter: ${UNIT_MAPPING[matchedUnit]}`)
        } else {
          console.log(`  ✗ No matching filter found`)
          guidesWithoutUnits.push(guide)
        }
      }
    }
    
    console.log(`\n${'='.repeat(60)}`)
    console.log('SUMMARY')
    console.log('='.repeat(60))
    console.log(`\nTotal guidelines guides: ${guidelinesGuides.length}`)
    console.log(`Guides without units: ${guidesWithoutUnits.length}`)
    console.log(`\nGuides by unit:`)
    for (const [unitId, unitName] of Object.entries(UNIT_MAPPING)) {
      const count = guidesByUnit[unitId] ? guidesByUnit[unitId].length : 0
      console.log(`  ${unitName}: ${count} guides`)
    }
    
    if (guidesWithoutUnits.length > 0) {
      console.log(`\n${'='.repeat(60)}`)
      console.log('ASSIGNING UNITS TO GUIDES WITHOUT UNITS')
      console.log('='.repeat(60))
      
      // Distribute guides across units
      const units = Object.keys(UNIT_MAPPING)
      let unitIndex = 0
      
      for (const guide of guidesWithoutUnits) {
        const unitId = units[unitIndex % units.length]
        const unitName = UNIT_MAPPING[unitId]
        
        const { error: updateError } = await sb
          .from('guides')
          .update({ 
            unit: unitName,
            function_area: unitName
          })
          .eq('id', guide.id)
        
        if (updateError) {
          console.error(`  ✗ Error updating "${guide.title}":`, updateError.message)
        } else {
          console.log(`  ✓ Assigned "${guide.title}" to ${unitName}`)
          if (!guidesByUnit[unitId]) guidesByUnit[unitId] = []
          guidesByUnit[unitId].push(guide)
        }
        
        unitIndex++
      }
      
      console.log(`\n✓ Assigned units to ${guidesWithoutUnits.length} guides`)
    }
    
    // Final summary
    console.log(`\n${'='.repeat(60)}`)
    console.log('FINAL SUMMARY')
    console.log('='.repeat(60))
    for (const [unitId, unitName] of Object.entries(UNIT_MAPPING)) {
      const count = guidesByUnit[unitId] ? guidesByUnit[unitId].length : 0
      console.log(`  ${unitName}: ${count} guides`)
    }
    
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

