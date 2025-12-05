// scripts/check-guidelines-guides.js
// Check if Guidelines guides exist and are being filtered correctly
// Usage: node scripts/check-guidelines-guides.js

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
    // Get all approved guides
    const { data: allGuides, error } = await sb
      .from('guides')
      .select('id, title, domain, guide_type, unit, function_area, status')
      .eq('status', 'Approved')
      .order('title')
    
    if (error) {
      console.error('Error fetching guides:', error)
      return
    }
    
    console.log(`Total approved guides: ${allGuides.length}\n`)
    
    // Categorize guides
    const strategyGuides = []
    const blueprintGuides = []
    const testimonialGuides = []
    const guidelinesGuides = []
    const otherGuides = []
    
    for (const guide of allGuides) {
      const domain = (guide.domain || '').toLowerCase().trim()
      const guideType = (guide.guide_type || '').toLowerCase().trim()
      
      const hasStrategy = domain.includes('strategy') || guideType.includes('strategy')
      const hasBlueprint = domain.includes('blueprint') || guideType.includes('blueprint')
      const hasTestimonial = domain.includes('testimonial') || guideType.includes('testimonial')
      
      if (hasStrategy) {
        strategyGuides.push(guide)
      } else if (hasBlueprint) {
        blueprintGuides.push(guide)
      } else if (hasTestimonial) {
        testimonialGuides.push(guide)
      } else if (!hasStrategy && !hasBlueprint && !hasTestimonial) {
        guidelinesGuides.push(guide)
      } else {
        otherGuides.push(guide)
      }
    }
    
    console.log('='.repeat(60))
    console.log('GUIDE CATEGORIZATION')
    console.log('='.repeat(60))
    console.log(`\nStrategy: ${strategyGuides.length} guides`)
    console.log(`Blueprints: ${blueprintGuides.length} guides`)
    console.log(`Testimonials: ${testimonialGuides.length} guides`)
    console.log(`Guidelines: ${guidelinesGuides.length} guides`)
    console.log(`Other/Uncategorized: ${otherGuides.length} guides`)
    
    console.log(`\n${'='.repeat(60)}`)
    console.log('GUIDELINES GUIDES')
    console.log('='.repeat(60))
    if (guidelinesGuides.length === 0) {
      console.log('\n⚠️  NO GUIDELINES GUIDES FOUND!')
      console.log('\nThis is why the Guidelines tab shows no services.')
    } else {
      console.log(`\nFound ${guidelinesGuides.length} guidelines guides:\n`)
      guidelinesGuides.forEach((g, idx) => {
        console.log(`${idx + 1}. "${g.title}"`)
        console.log(`   Domain: ${g.domain || 'None'}`)
        console.log(`   Guide Type: ${g.guide_type || 'None'}`)
        console.log(`   Unit: ${g.unit || g.function_area || 'None'}`)
        console.log()
      })
    }
    
    console.log(`\n${'='.repeat(60)}`)
    console.log('RECOMMENDATIONS')
    console.log('='.repeat(60))
    if (guidelinesGuides.length === 0) {
      console.log('\n⚠️  You need to add guides to the Guidelines category.')
      console.log('Guidelines guides should NOT have:')
      console.log('  - domain containing "strategy", "blueprint", or "testimonial"')
      console.log('  - guide_type containing "strategy", "blueprint", or "testimonial"')
      console.log('\nTo create Guidelines guides, ensure their domain and guide_type')
      console.log('fields are either empty or contain values other than Strategy/Blueprint/Testimonial.')
    } else {
      console.log(`\n✓ Guidelines tab should show ${guidelinesGuides.length} guides.`)
      console.log('If you\'re not seeing them, check the filtering logic.')
    }
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

