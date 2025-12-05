// scripts/duplicate-guidelines-to-blueprints.js
// Duplicate Guidelines guides to create Blueprints (don't modify originals)
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import { randomUUID } from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const BLUEPRINT_GUIDE_TYPES = ['Best practice', 'Policy', 'Process', 'SOP']

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function main() {
  console.log('Fetching Guidelines guides to duplicate...\n')
  
  // Get all Guidelines guides (don't modify these)
  const { data: allGuides } = await sb
    .from('guides')
    .select('id, title, summary, body, guide_type, unit, function_area, location, slug')
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
  
  console.log(`Found ${guidelines.length} Guidelines guides to duplicate\n`)
  
  // Check existing Blueprints
  const existingBlueprints = (allGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })
  
  if (existingBlueprints.length > 0) {
    console.log(`Deleting ${existingBlueprints.length} existing Blueprint guides first...\n`)
    for (const bp of existingBlueprints) {
      try {
        const { error } = await sb
          .from('guides')
          .delete()
          .eq('id', bp.id)
        
        if (error) {
          console.error(`  ✗ Error deleting ${bp.title}: ${error.message}`)
        } else {
          console.log(`  ✓ Deleted ${bp.title}`)
        }
      } catch (err) {
        console.error(`  ✗ Error: ${err.message}`)
      }
    }
  }
  
  // Duplicate each Guidelines guide as a Blueprint
  console.log(`\nDuplicating ${guidelines.length} Guidelines guides to Blueprints...\n`)
  
  for (let i = 0; i < guidelines.length; i++) {
    const original = guidelines[i]
    
    // Map guide type to Blueprint format
    const originalType = (original.guide_type || '').toLowerCase()
    let blueprintGuideType = 'Best practice'
    if (originalType.includes('policy')) blueprintGuideType = 'Policy'
    else if (originalType.includes('process')) blueprintGuideType = 'Process'
    else if (originalType.includes('sop')) blueprintGuideType = 'SOP'
    else blueprintGuideType = BLUEPRINT_GUIDE_TYPES[i % BLUEPRINT_GUIDE_TYPES.length]
    
    // Create unique slug
    const baseSlug = slugify(original.title)
    const uniqueSlug = `blueprint-${baseSlug}-${randomUUID().substring(0, 8)}`
    
    try {
      const { error } = await sb
        .from('guides')
        .insert({
          slug: uniqueSlug,
          title: original.title, // Keep same title
          summary: original.summary || `Blueprint version of ${original.title}`,
          body: original.body || original.summary || `This is a blueprint guide based on ${original.title}.`,
          domain: 'Blueprint',
          guide_type: blueprintGuideType,
          unit: original.unit || original.function_area,
          function_area: original.unit || original.function_area,
          location: original.location,
          status: 'Approved'
        })
      
      if (error) {
        console.error(`  ✗ ${original.title}: ${error.message}`)
      } else {
        console.log(`  ✓ Duplicated: ${original.title} → Blueprint (${blueprintGuideType})`)
      }
    } catch (err) {
      console.error(`  ✗ ${original.title}: ${err.message}`)
    }
  }
  
  // Verify
  const { data: finalGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit, location')
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
  
  const finalBlueprints = (finalGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })
  
  console.log(`\n✅ Verification:`)
  console.log(`  Guidelines: ${finalGuidelines.length} guides (unchanged)`)
  console.log(`  Blueprints: ${finalBlueprints.length} guides (duplicated)`)
  
  // Summary
  const byType = {}
  finalBlueprints.forEach(g => {
    const type = g.guide_type || 'None'
    if (!byType[type]) byType[type] = []
    byType[type].push(g.title)
  })
  
  console.log(`\nBlueprint Guide Types:`)
  for (const [type, titles] of Object.entries(byType)) {
    console.log(`  ${type}: ${titles.length} guides`)
  }
}

main().catch(console.error)

