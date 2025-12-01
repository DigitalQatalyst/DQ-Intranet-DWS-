// scripts/cleanup-incorrect-testimonials.js
// Clean up guides that were incorrectly converted to testimonials
// Usage: node scripts/cleanup-incorrect-testimonials.js

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
    console.log('CLEANING UP INCORRECTLY CONVERTED TESTIMONIALS')
    console.log('='.repeat(60))
    
    // Get all testimonial guides
    const { data: allTestimonials, error } = await sb
      .from('guides')
      .select('id, title, guide_type, domain')
      .eq('status', 'Approved')
      .or('domain.eq.Testimonial,guide_type.ilike.%Testimonial%')
    
    if (error) {
      console.error('Error:', error)
      return
    }
    
    // Find guides that were incorrectly converted (have "Guidelines" in title)
    const incorrectGuides = (allTestimonials || []).filter(g => {
      const title = (g.title || '').toLowerCase()
      return title.includes('guidelines') || title.includes('guideline')
    })
    
    console.log(`\nFound ${incorrectGuides.length} incorrectly converted guides:`)
    incorrectGuides.forEach(g => console.log(`  - ${g.title}`))
    
    if (incorrectGuides.length === 0) {
      console.log('\nNo guides to clean up!')
      return
    }
    
    // Convert them back to Guidelines
    console.log(`\n${'='.repeat(60)}`)
    console.log('CONVERTING BACK TO GUIDELINES')
    console.log('='.repeat(60))
    
    for (const guide of incorrectGuides) {
      try {
        const { error: updateError } = await sb
          .from('guides')
          .update({ 
            domain: null,
            guide_type: 'Best Practice'
          })
          .eq('id', guide.id)
        
        if (updateError) {
          console.error(`  ✗ Error converting "${guide.title}":`, updateError.message)
        } else {
          console.log(`  ✓ Converted "${guide.title}" back to Guidelines`)
        }
      } catch (err) {
        console.error(`  ✗ Network error:`, err.message)
      }
    }
    
    // Final verification
    console.log(`\n${'='.repeat(60)}`)
    console.log('FINAL TESTIMONIAL STATUS')
    console.log('='.repeat(60))
    
    const { data: finalTestimonials } = await sb
      .from('guides')
      .select('id, title, guide_type, domain')
      .eq('status', 'Approved')
      .or('domain.eq.Testimonial,guide_type.ilike.%Testimonial%')
    
    const categories = [
      'Journey / Transformation Story',
      'Case Study',
      'Leadership Reflection',
      'Client / Partner Reference',
      'Team / Employee Experience',
      'Milestone / Achievement'
    ]
    
    for (const category of categories) {
      const matching = (finalTestimonials || []).filter(g => {
        const guideType = (g.guide_type || '').toLowerCase().trim()
        return guideType === category.toLowerCase().trim() ||
               guideType.includes(category.toLowerCase())
      })
      
      if (matching.length > 0) {
        console.log(`  ✓ ${category}: ${matching.length} guides`)
        matching.forEach(g => console.log(`    - ${g.title}`))
      } else {
        console.log(`  ✗ ${category}: No guides`)
      }
    }
    
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

