// scripts/fill-remaining-testimonials.js
// Fill remaining testimonial categories
// Usage: node scripts/fill-remaining-testimonials.js

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

const REMAINING_CATEGORIES = [
  { id: 'milestone-achievement', name: 'Milestone / Achievement' }
]

async function main() {
  try {
    console.log('='.repeat(60))
    console.log('FILLING REMAINING TESTIMONIAL CATEGORIES')
    console.log('='.repeat(60))
    
    // Get all approved guides
    const { data: allGuides, error } = await sb
      .from('guides')
      .select('id, title, guide_type, domain')
      .eq('status', 'Approved')
    
    if (error) {
      console.error('Error:', error)
      return
    }
    
    // Find guides that are NOT testimonials
    // We can use Blueprint or Guidelines guides that have duplicates
    const availableGuides = (allGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return !domain.includes('testimonial') && 
             !guideType.includes('testimonial')
    })
    
    console.log(`\nFound ${availableGuides.length} guides available for conversion`)
    
    // Group by unit to find units with multiple guides
    const guidesByUnit = new Map()
    for (const guide of availableGuides) {
      const unit = (guide.unit || guide.function_area || 'uncategorized').toLowerCase()
      if (!guidesByUnit.has(unit)) {
        guidesByUnit.set(unit, [])
      }
      guidesByUnit.get(unit).push(guide)
    }
    
    // Find guides from units that have multiple guides (we can convert one)
    const guidesToConvert = []
    for (const [unit, guides] of guidesByUnit.entries()) {
      if (guides.length > 1) {
        guidesToConvert.push(guides[0]) // Take first one from each unit with multiple
      }
    }
    
    // If not enough, also add single guides
    if (guidesToConvert.length < REMAINING_CATEGORIES.length) {
      for (const [unit, guides] of guidesByUnit.entries()) {
        if (guides.length === 1 && guidesToConvert.length < REMAINING_CATEGORIES.length) {
          guidesToConvert.push(guides[0])
        }
      }
    }
    
    console.log(`Found ${guidesToConvert.length} guides that can be converted`)
    
    if (guidesToConvert.length === 0) {
      console.log('No guides available to convert')
      return
    }
    
    // Convert guides to fill remaining categories
    console.log(`\n${'='.repeat(60)}`)
    console.log('CONVERTING GUIDES TO TESTIMONIALS')
    console.log('='.repeat(60))
    
    for (let i = 0; i < REMAINING_CATEGORIES.length && i < guidesToConvert.length; i++) {
      const category = REMAINING_CATEGORIES[i]
      const guideToConvert = guidesToConvert[i]
      
      try {
        const { error: updateError } = await sb
          .from('guides')
          .update({ 
            domain: 'Testimonial',
            guide_type: category.name
          })
          .eq('id', guideToConvert.id)
        
        if (updateError) {
          console.error(`  ✗ Error converting "${guideToConvert.title}":`, updateError.message)
        } else {
          console.log(`  ✓ Converted "${guideToConvert.title}" to ${category.name}`)
        }
      } catch (err) {
        console.error(`  ✗ Network error converting "${guideToConvert.title}":`, err.message)
      }
    }
    
    // Final verification
    console.log(`\n${'='.repeat(60)}`)
    console.log('FINAL TESTIMONIAL CATEGORY STATUS')
    console.log('='.repeat(60))
    
    const { data: finalGuides } = await sb
      .from('guides')
      .select('id, title, guide_type, domain')
      .eq('status', 'Approved')
    
    const finalTestimonials = (finalGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return domain.includes('testimonial') || guideType.includes('testimonial')
    })
    
    const allCategories = [
      { id: 'journey-transformation-story', name: 'Journey / Transformation Story' },
      { id: 'case-study', name: 'Case Study' },
      { id: 'leadership-reflection', name: 'Leadership Reflection' },
      { id: 'client-partner-reference', name: 'Client / Partner Reference' },
      { id: 'team-employee-experience', name: 'Team / Employee Experience' },
      { id: 'milestone-achievement', name: 'Milestone / Achievement' }
    ]
    
    let allHaveGuides = true
    for (const category of allCategories) {
      const matchingGuides = finalTestimonials.filter(g => {
        const guideType = (g.guide_type || '').toLowerCase().trim()
        const categoryNameLower = category.name.toLowerCase().trim()
        // Match if guide_type exactly equals category name, or contains it
        return guideType === categoryNameLower ||
               guideType.includes(categoryNameLower) ||
               categoryNameLower.includes(guideType)
      })
      
      if (matchingGuides.length > 0) {
        console.log(`  ✓ ${category.name}: ${matchingGuides.length} guides`)
        matchingGuides.forEach(g => console.log(`    - ${g.title}`))
      } else {
        console.log(`  ✗ ${category.name}: Still no guides`)
        allHaveGuides = false
      }
    }
    
    console.log(`\n${allHaveGuides ? '✓' : '✗'} All categories have guides: ${allHaveGuides}`)
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

