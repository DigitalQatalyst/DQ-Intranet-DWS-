import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Unique images for each strategy service
const strategyImages = {
  'product-roadmap-planning': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Roadmap/planning charts
  'solutions-strategy-framework': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Strategy framework/architecture
  'product-strategy-overview': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' // Product strategy/vision
}

async function updateStrategyImages() {
  console.log('🖼️  Updating strategy service images...\n')
  
  let updated = 0
  let errors = 0
  
  for (const [slug, imageUrl] of Object.entries(strategyImages)) {
    const { data, error } = await supabase
      .from('guides')
      .update({ hero_image_url: imageUrl })
      .eq('slug', slug)
      .select('title, hero_image_url')
      .single()
    
    if (error) {
      console.error(`❌ Error updating "${slug}":`, error.message)
      errors++
    } else if (data) {
      console.log(`✅ Updated: "${data.title}"`)
      updated++
    } else {
      console.log(`⚠️  Not found: ${slug}`)
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Errors: ${errors}`)
  console.log(`\n✅ Done!`)
}

updateStrategyImages().catch(console.error)

