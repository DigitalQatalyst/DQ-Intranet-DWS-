// scripts/fix-guidelines-guide-types.js
// Fix guide type values to match filter IDs
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const GUIDE_TYPE_MAPPING = {
  'Best Practice': 'Best Practice',
  'Best practice': 'Best Practice', // Fix lowercase 'p'
  'Policy': 'Policy',
  'Process': 'Process',
  'SOP': 'SOP'
}

async function main() {
  const { data: allGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain')
    .eq('status', 'Approved')
  
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
  
  console.log(`Found ${guidelines.length} Guidelines guides\n`)
  
  // Fix guide types to be consistent
  for (const guide of guidelines) {
    const currentType = guide.guide_type
    const correctType = GUIDE_TYPE_MAPPING[currentType] || currentType
    
    if (currentType !== correctType) {
      try {
        const { error } = await sb
          .from('guides')
          .update({ guide_type: correctType })
          .eq('id', guide.id)
        
        if (error) {
          console.error(`  ✗ ${guide.title}: ${error.message}`)
        } else {
          console.log(`  ✓ ${guide.title}: "${currentType}" → "${correctType}"`)
        }
      } catch (err) {
        console.error(`  ✗ ${guide.title}: ${err.message}`)
      }
    } else {
      console.log(`  - ${guide.title}: Already correct (${currentType})`)
    }
  }
  
  // Now ensure each guide type has guides
  console.log(`\nEnsuring all guide types have guides...\n`)
  
  const requiredTypes = ['Best Practice', 'Policy', 'Process', 'SOP']
  const { data: updatedGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain')
    .eq('status', 'Approved')
  
  const updatedGuidelines = (updatedGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return !d.includes('strategy') && 
           !d.includes('blueprint') && 
           !d.includes('testimonial') &&
           !gt.includes('strategy') &&
           !gt.includes('blueprint') &&
           !gt.includes('testimonial')
  })
  
  const byType = {}
  updatedGuidelines.forEach(g => {
    const type = g.guide_type || 'None'
    if (!byType[type]) byType[type] = []
    byType[type].push(g)
  })
  
  for (const requiredType of requiredTypes) {
    const guides = byType[requiredType] || []
    if (guides.length === 0) {
      console.log(`  ✗ ${requiredType}: No guides - need to assign one`)
      // Find a guide with multiple of another type and reassign
      const guidesWithMultipleTypes = Object.entries(byType).filter(([type, gs]) => type !== requiredType && gs.length > 1)
      if (guidesWithMultipleTypes.length > 0) {
        const [sourceType, sourceGuides] = guidesWithMultipleTypes[0]
        const guideToReassign = sourceGuides[0]
        
        try {
          const { error } = await sb
            .from('guides')
            .update({ guide_type: requiredType })
            .eq('id', guideToReassign.id)
          
          if (error) {
            console.error(`    ✗ Error: ${error.message}`)
          } else {
            console.log(`    ✓ Reassigned "${guideToReassign.title}" from ${sourceType} to ${requiredType}`)
          }
        } catch (err) {
          console.error(`    ✗ Error: ${err.message}`)
        }
      }
    } else {
      console.log(`  ✓ ${requiredType}: ${guides.length} guides`)
      guides.forEach(g => console.log(`    - ${g.title}`))
    }
  }
  
  // Final summary
  const { data: finalGuides } = await sb
    .from('guides')
    .select('id, title, guide_type')
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
  
  console.log(`\n✅ Final Guidelines by Guide Type:`)
  const finalByType = {}
  finalGuidelines.forEach(g => {
    const type = g.guide_type || 'None'
    if (!finalByType[type]) finalByType[type] = []
    finalByType[type].push(g.title)
  })
  
  for (const type of requiredTypes) {
    const count = (finalByType[type] || []).length
    console.log(`  ${type}: ${count} guides`)
  }
}

main().catch(console.error)

