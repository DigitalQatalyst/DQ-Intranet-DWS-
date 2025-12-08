// scripts/check-all-guides.js
// Check all guides in database
// Usage: node scripts/check-all-guides.js

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
    const { data: allGuides, error } = await sb
      .from('guides')
      .select('id, title, guide_type, domain')
      .eq('status', 'Approved')
      .limit(50)
    
    if (error) {
      console.error('Error:', error)
      return
    }
    
    console.log(`Total approved guides: ${allGuides.length}\n`)
    
    const byCategory = {
      strategy: [],
      blueprint: [],
      testimonial: [],
      guidelines: [],
      other: []
    }
    
    for (const guide of allGuides) {
      const domain = (guide.domain || '').toLowerCase()
      const guideType = (guide.guide_type || '').toLowerCase()
      
      if (domain.includes('strategy') || guideType.includes('strategy')) {
        byCategory.strategy.push(guide)
      } else if (domain.includes('blueprint') || guideType.includes('blueprint')) {
        byCategory.blueprint.push(guide)
      } else if (domain.includes('testimonial') || guideType.includes('testimonial')) {
        byCategory.testimonial.push(guide)
      } else if (!domain && !guideType) {
        byCategory.other.push(guide)
      } else {
        byCategory.guidelines.push(guide)
      }
    }
    
    console.log('By category:')
    console.log(`  Strategy: ${byCategory.strategy.length}`)
    console.log(`  Blueprint: ${byCategory.blueprint.length}`)
    console.log(`  Testimonial: ${byCategory.testimonial.length}`)
    console.log(`  Guidelines: ${byCategory.guidelines.length}`)
    console.log(`  Other/Uncategorized: ${byCategory.other.length}`)
    
    console.log(`\n${'='.repeat(60)}`)
    console.log('TESTIMONIAL GUIDES:')
    console.log('='.repeat(60))
    byCategory.testimonial.forEach(g => {
      console.log(`  - ${g.title} (${g.guide_type || 'N/A'})`)
    })
    
    console.log(`\n${'='.repeat(60)}`)
    console.log('GUIDELINES GUIDES (can convert):')
    console.log('='.repeat(60))
    byCategory.guidelines.slice(0, 10).forEach(g => {
      console.log(`  - ${g.title} (domain: ${g.domain || 'N/A'}, type: ${g.guide_type || 'N/A'})`)
    })
    
    if (byCategory.guidelines.length > 10) {
      console.log(`  ... and ${byCategory.guidelines.length - 10} more`)
    }
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

