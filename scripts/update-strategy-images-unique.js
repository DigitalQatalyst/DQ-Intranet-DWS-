import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Unique, specific Unsplash images for each service - each with distinct, relevant imagery
const serviceImages = {
  'dq-journey': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3', // Road/path journey
  'dq-beliefs': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3', // Team collaboration
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3', // Horizon/mountain view
  'dq-strategy-2021-2030': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3', // Strategic planning charts
  'dq-competencies': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3', // Skills/technology
  'dq-products': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3', // Product showcase
  'agile-6xd-products': 'https://images.unsplash.com/photo-1553877522-25bcdc54f2de?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3', // Agile workflow/board
  'product-strategy-overview': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228fbb?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3', // Strategy planning/analysis
  'solutions-strategy-framework': 'https://images.unsplash.com/photo-1516321318469-88ce825ef878?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3', // Framework/architecture
  'product-roadmap-planning': 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3' // Roadmap planning/timeline
}

async function updateImages() {
  console.log('🖼️  Updating strategy service images with unique URLs...\n')
  
  let updated = 0
  let errors = 0
  
  for (const [slug, imageUrl] of Object.entries(serviceImages)) {
    const { data, error } = await supabase
      .from('guides')
      .update({
        hero_image_url: imageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select('title, hero_image_url')
      .single()
    
    if (error) {
      console.error(`❌ Error updating "${slug}":`, error.message)
      errors++
    } else if (data) {
      console.log(`✅ Updated: "${data.title}"`)
      console.log(`   Image URL: ${data.hero_image_url?.substring(0, 80)}...`)
      updated++
    } else {
      console.log(`⚠️  Service not found: ${slug}`)
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Errors: ${errors}`)
  console.log(`\n✅ Done!`)
}

updateImages().catch(console.error)

