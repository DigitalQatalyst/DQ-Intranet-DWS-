// scripts/convert-guides-to-blueprints.js
// Convert existing guides to Blueprints to fill empty units
// Usage: node scripts/convert-guides-to-blueprints.js

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

async function main() {
  try {
    console.log('='.repeat(60))
    console.log('CONVERTING GUIDES TO BLUEPRINTS')
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
    
    // Find current Blueprint guides
    const blueprintGuides = (allGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return domain.includes('blueprint') || guideType.includes('blueprint')
    })
    
    console.log(`\nFound ${blueprintGuides.length} existing Blueprint guides`)
    
    // Find Guidelines guides that we can convert to Blueprints
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
    
    console.log(`Found ${guidelinesGuides.length} Guidelines guides that can be converted`)
    
    // Check which Blueprint units need guides
    const unitsNeedingGuides = []
    for (const [unitId, unitName] of Object.entries(UNIT_MAPPING)) {
      const hasGuides = blueprintGuides.some(g => {
        const guideUnit = (g.unit || g.function_area || '').toLowerCase()
        const normalizedUnitName = unitName.toLowerCase()
        return guideUnit.includes(normalizedUnitName) || normalizedUnitName.includes(guideUnit)
      })
      
      if (!hasGuides) {
        unitsNeedingGuides.push({ unitId, unitName })
      }
    }
    
    console.log(`\n${unitsNeedingGuides.length} Blueprint units need guides:`)
    unitsNeedingGuides.forEach(({ unitName }) => console.log(`  - ${unitName}`))
    
    if (unitsNeedingGuides.length === 0) {
      console.log('\n✓ All Blueprint units already have guides!')
      return
    }
    
    // Convert Guidelines guides to Blueprints for empty units
    console.log(`\n${'='.repeat(60)}`)
    console.log('CONVERTING GUIDELINES TO BLUEPRINTS')
    console.log('='.repeat(60))
    
    let guideIndex = 0
    for (const { unitId, unitName } of unitsNeedingGuides) {
      if (guideIndex >= guidelinesGuides.length) {
        console.log(`  ⚠ No more guides available for ${unitName}`)
        continue
      }
      
      const guideToConvert = guidelinesGuides[guideIndex]
      
      // Assign a random guide type from Blueprint types
      const randomGuideType = BLUEPRINT_GUIDE_TYPES[guideIndex % BLUEPRINT_GUIDE_TYPES.length]
      
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
          console.log(`  ✓ Converted "${guideToConvert.title}" to Blueprint (${unitName}, ${randomGuideType})`)
          guideIndex++
        }
      } catch (err) {
        console.error(`  ✗ Network error converting "${guideToConvert.title}":`, err.message)
      }
    }
    
    // Final verification
    console.log(`\n${'='.repeat(60)}`)
    console.log('FINAL BLUEPRINT UNIT DISTRIBUTION')
    console.log('='.repeat(60))
    
    const { data: finalGuides } = await sb
      .from('guides')
      .select('id, title, guide_type, unit, function_area, domain')
      .eq('status', 'Approved')
    
    const finalBlueprints = (finalGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return domain.includes('blueprint') || guideType.includes('blueprint')
    })
    
    for (const [unitId, unitName] of Object.entries(UNIT_MAPPING)) {
      const matchingGuides = finalBlueprints.filter(g => {
        const guideUnit = (g.unit || g.function_area || '').toLowerCase()
        const normalizedUnitName = unitName.toLowerCase()
        return guideUnit.includes(normalizedUnitName) || normalizedUnitName.includes(guideUnit)
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
    
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

