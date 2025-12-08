// scripts/fill-remaining-blueprint-gaps.js
// Fill remaining Blueprint unit gaps
// Usage: node scripts/fill-remaining-blueprint-gaps.js

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

async function main() {
  try {
    console.log('='.repeat(60))
    console.log('FILLING REMAINING BLUEPRINT GAPS')
    console.log('='.repeat(60))
    
    // Get all Blueprint guides
    const { data: allGuides, error } = await sb
      .from('guides')
      .select('id, title, guide_type, unit, function_area, domain')
      .eq('status', 'Approved')
    
    if (error) {
      console.error('Error:', error)
      return
    }
    
    const blueprintGuides = (allGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return domain.includes('blueprint') || guideType.includes('blueprint')
    })
    
    console.log(`\nFound ${blueprintGuides.length} Blueprint guides`)
    
    // Find guides in "DQ Delivery (Deploys)" and "DQ Delivery (Designs)" - we can reassign one from each
    const deploysGuides = blueprintGuides.filter(g => {
      const unit = (g.unit || g.function_area || '').toLowerCase()
      return unit.includes('deploys')
    })
    
    const designsGuides = blueprintGuides.filter(g => {
      const unit = (g.unit || g.function_area || '').toLowerCase()
      return unit.includes('designs')
    })
    
    console.log(`\nDQ Delivery (Deploys): ${deploysGuides.length} guides`)
    console.log(`DQ Delivery (Designs): ${designsGuides.length} guides`)
    
    // Reassign one from Deploys to Deals
    if (deploysGuides.length > 0) {
      const guideToReassign = deploysGuides[0]
      console.log(`\nReassigning "${guideToReassign.title}" from DQ Delivery (Deploys) to Deals...`)
      
      const { error: updateError } = await sb
        .from('guides')
        .update({ 
          unit: 'Deals',
          function_area: 'Deals'
        })
        .eq('id', guideToReassign.id)
      
      if (updateError) {
        console.error(`  ✗ Error:`, updateError.message)
      } else {
        console.log(`  ✓ Success`)
      }
    }
    
    // Reassign one from Designs to DQ Delivery (Accounts)
    if (designsGuides.length > 0) {
      const guideToReassign = designsGuides[0]
      console.log(`\nReassigning "${guideToReassign.title}" from DQ Delivery (Designs) to DQ Delivery (Accounts)...`)
      
      const { error: updateError } = await sb
        .from('guides')
        .update({ 
          unit: 'DQ Delivery (Accounts)',
          function_area: 'DQ Delivery (Accounts)'
        })
        .eq('id', guideToReassign.id)
      
      if (updateError) {
        console.error(`  ✗ Error:`, updateError.message)
      } else {
        console.log(`  ✓ Success`)
      }
    }
    
    // Final check
    console.log(`\n${'='.repeat(60)}`)
    console.log('FINAL BLUEPRINT UNIT STATUS')
    console.log('='.repeat(60))
    
    const { data: finalGuides } = await sb
      .from('guides')
      .select('id, title, unit, function_area, domain')
      .eq('status', 'Approved')
    
    const finalBlueprints = (finalGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return domain.includes('blueprint') || guideType.includes('blueprint')
    })
    
    const units = ['Deals', 'DQ Delivery (Accounts)', 'DQ Delivery (Deploys)', 'DQ Delivery (Designs)', 
                   'Finance', 'HRA', 'Intelligence', 'Products', 'SecDevOps', 'Solutions', 'Stories']
    
    for (const unitName of units) {
      const matching = finalBlueprints.filter(g => {
        const guideUnit = (g.unit || g.function_area || '').toLowerCase()
        const normalizedUnit = unitName.toLowerCase()
        return guideUnit.includes(normalizedUnit) || normalizedUnit.includes(guideUnit)
      })
      
      if (matching.length > 0) {
        console.log(`  ✓ ${unitName}: ${matching.length} guides`)
      } else {
        console.log(`  ✗ ${unitName}: No guides`)
      }
    }
    
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

