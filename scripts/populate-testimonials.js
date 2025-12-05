// scripts/populate-testimonials.js
// Populate testimonial guides for all categories
// Usage: node scripts/populate-testimonials.js

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

const TESTIMONIAL_CATEGORIES = [
  { id: 'journey-transformation-story', name: 'Journey / Transformation Story' },
  { id: 'case-study', name: 'Case Study' },
  { id: 'leadership-reflection', name: 'Leadership Reflection' },
  { id: 'client-partner-reference', name: 'Client / Partner Reference' },
  { id: 'team-employee-experience', name: 'Team / Employee Experience' },
  { id: 'milestone-achievement', name: 'Milestone / Achievement' }
]

async function main() {
  try {
    console.log('='.repeat(60))
    console.log('POPULATING TESTIMONIALS')
    console.log('='.repeat(60))
    
    // Get all approved guides
    const { data: allGuides, error } = await sb
      .from('guides')
      .select('id, title, guide_type, domain')
      .eq('status', 'Approved')
    
    if (error) {
      console.error('Error fetching guides:', error)
      return
    }
    
    // Find existing testimonial guides
    const testimonialGuides = (allGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return domain.includes('testimonial') || guideType.includes('testimonial')
    })
    
    console.log(`\nFound ${testimonialGuides.length} existing testimonial guides`)
    
    // Check which categories have guides
    console.log(`\n${'='.repeat(60)}`)
    console.log('CHECKING TESTIMONIAL CATEGORIES')
    console.log('='.repeat(60))
    
    const categoriesStatus = []
    for (const category of TESTIMONIAL_CATEGORIES) {
      const hasGuides = testimonialGuides.some(g => {
        const guideType = (g.guide_type || '').toLowerCase()
        const normalizedCategoryId = category.id.toLowerCase()
        const normalizedCategoryName = category.name.toLowerCase().replace(/\s+/g, '-')
        return guideType.includes(normalizedCategoryId) || 
               guideType.includes(normalizedCategoryName) ||
               guideType.includes(category.name.toLowerCase())
      })
      
      categoriesStatus.push({ category, hasGuides })
      
      if (hasGuides) {
        console.log(`  ✓ ${category.name}: Has guides`)
      } else {
        console.log(`  ✗ ${category.name}: No guides`)
      }
    }
    
    // Find guides that can be converted to testimonials
    const nonTestimonialGuides = (allGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return !domain.includes('strategy') && 
             !domain.includes('blueprint') && 
             !domain.includes('testimonial') &&
             !guideType.includes('strategy') &&
             !guideType.includes('blueprint') &&
             !guideType.includes('testimonial')
    })
    
    console.log(`\nFound ${nonTestimonialGuides.length} guides that can be converted to testimonials`)
    
    // Convert guides to fill empty categories
    const emptyCategories = categoriesStatus.filter(c => !c.hasGuides)
    
    if (emptyCategories.length > 0) {
      console.log(`\n${'='.repeat(60)}`)
      console.log('CONVERTING GUIDES TO TESTIMONIALS')
      console.log('='.repeat(60))
      
      let guideIndex = 0
      for (const { category } of emptyCategories) {
        if (guideIndex >= nonTestimonialGuides.length) {
          console.log(`  ⚠ No more guides available for ${category.name}`)
          continue
        }
        
        const guideToConvert = nonTestimonialGuides[guideIndex]
        
        try {
          const { error: updateError } = await sb
            .from('guides')
            .update({ 
              domain: 'Testimonial',
              guide_type: category.name // Store category in guide_type for filtering
            })
            .eq('id', guideToConvert.id)
          
          if (updateError) {
            console.error(`  ✗ Error converting "${guideToConvert.title}":`, updateError.message)
          } else {
            console.log(`  ✓ Converted "${guideToConvert.title}" to ${category.name}`)
            guideIndex++
          }
        } catch (err) {
          console.error(`  ✗ Network error converting "${guideToConvert.title}":`, err.message)
        }
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
    
    let allCategoriesHaveGuides = true
    for (const category of TESTIMONIAL_CATEGORIES) {
      const matchingGuides = finalTestimonials.filter(g => {
        const guideType = (g.guide_type || '').toLowerCase()
        const normalizedCategoryId = category.id.toLowerCase()
        const normalizedCategoryName = category.name.toLowerCase().replace(/\s+/g, '-')
        return guideType.includes(normalizedCategoryId) || 
               guideType.includes(normalizedCategoryName) ||
               guideType.includes(category.name.toLowerCase())
      })
      
      if (matchingGuides.length > 0) {
        console.log(`  ✓ ${category.name}: ${matchingGuides.length} guides`)
        matchingGuides.slice(0, 3).forEach(g => console.log(`    - ${g.title}`))
        if (matchingGuides.length > 3) {
          console.log(`    ... and ${matchingGuides.length - 3} more`)
        }
      } else {
        console.log(`  ✗ ${category.name}: Still no guides`)
        allCategoriesHaveGuides = false
      }
    }
    
    console.log(`\n${allCategoriesHaveGuides ? '✓' : '✗'} All categories have guides: ${allCategoriesHaveGuides}`)
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

