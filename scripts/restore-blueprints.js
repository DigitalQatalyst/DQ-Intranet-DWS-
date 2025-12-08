// scripts/restore-blueprints.js
// Find guides that were converted from Blueprints and restore them
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const BLUEPRINT_GUIDE_TYPES = ['Best practice', 'Policy', 'Process', 'SOP']

async function main() {
  console.log('Finding guides that should be Blueprints...\n')
  
  // Get all guides
  const { data: allGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit, function_area')
    .eq('status', 'Approved')
  
  // Find guides that have Blueprint-related titles or were likely Blueprints
  const likelyBlueprints = (allGuides || []).filter(g => {
    const title = (g.title || '').toLowerCase()
    // Look for guides with titles that suggest they were Blueprints
    return title.includes('blueprint') || 
           title.includes('management guidelines') ||
           title.includes('visual assets')
  })
  
  console.log(`Found ${likelyBlueprints.length} guides that might be Blueprints:`)
  likelyBlueprints.forEach(g => {
    console.log(`  - ${g.title}`)
    console.log(`    Current domain: ${g.domain || 'null'}`)
    console.log(`    Current guide_type: ${g.guide_type || 'null'}`)
    console.log(`    Unit: ${g.unit || g.function_area || 'N/A'}`)
    console.log('')
  })
  
  // Also check Guidelines guides that might have been Blueprints
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
  
  console.log(`\nGuidelines guides that might have been Blueprints:`)
  const candidates = guidelinesGuides.filter(g => {
    const title = (g.title || '').toLowerCase()
    return title.includes('blueprint') || 
           title.includes('management') ||
           (g.guide_type && BLUEPRINT_GUIDE_TYPES.some(bt => g.guide_type.toLowerCase().includes(bt.toLowerCase())))
  })
  
  candidates.forEach(g => {
    console.log(`  - ${g.title} (${g.guide_type || 'N/A'})`)
  })
  
  if (candidates.length > 0) {
    console.log(`\nRestoring ${candidates.length} guides to Blueprints...`)
    for (const guide of candidates) {
      const randomGuideType = BLUEPRINT_GUIDE_TYPES[Math.floor(Math.random() * BLUEPRINT_GUIDE_TYPES.length)]
      try {
        const { error } = await sb
          .from('guides')
          .update({
            domain: 'Blueprint',
            guide_type: randomGuideType
          })
          .eq('id', guide.id)
        
        if (error) {
          console.error(`  ✗ ${guide.title}: ${error.message}`)
        } else {
          console.log(`  ✓ Restored ${guide.title} to Blueprint`)
        }
      } catch (err) {
        console.error(`  ✗ ${guide.title}: ${err.message}`)
      }
    }
  }
  
  // Delete the newly created irrelevant guides
  console.log(`\nDeleting newly created Blueprint guides...`)
  const { data: newBlueprints } = await sb
    .from('guides')
    .select('id, title')
    .eq('status', 'Approved')
    .like('title', 'Blueprint:%')
  
  if (newBlueprints && newBlueprints.length > 0) {
    for (const guide of newBlueprints) {
      try {
        const { error } = await sb
          .from('guides')
          .delete()
          .eq('id', guide.id)
        
        if (error) {
          console.error(`  ✗ Error deleting ${guide.title}: ${error.message}`)
        } else {
          console.log(`  ✓ Deleted ${guide.title}`)
        }
      } catch (err) {
        console.error(`  ✗ Error: ${err.message}`)
      }
    }
  }
  
  // Final check
  const { data: finalBlueprints } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit')
    .eq('status', 'Approved')
  
  const blueprints = (finalBlueprints || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })
  
  console.log(`\n✓ Final Blueprint guides: ${blueprints.length}`)
  blueprints.forEach(g => console.log(`  - ${g.title} (${g.unit || 'N/A'})`))
}

main().catch(console.error)

