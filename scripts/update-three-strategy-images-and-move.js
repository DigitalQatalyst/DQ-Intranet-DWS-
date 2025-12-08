import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Unique images for the three strategy services
const strategyImages = {
  'product-roadmap-planning': 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Planning board
  'solutions-strategy-framework': 'https://images.unsplash.com/photo-1553877522-25bcdc54f2de?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Framework diagram
  'product-strategy-overview': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228fbb?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' // Strategy board
}

// Old date to move them to the end
const oldDate = new Date('2020-01-01').toISOString()

async function updateAndMove() {
  console.log('🖼️  Updating images and moving to end...\n')
  
  let updated = 0
  let errors = 0
  
  for (const [slug, imageUrl] of Object.entries(strategyImages)) {
    const { error } = await supabase
      .from('guides')
      .update({ 
        hero_image_url: imageUrl,
        last_updated_at: oldDate,
        is_editors_pick: false,
        download_count: 0
      })
      .eq('slug', slug)
      .select('title')
      .single()
    
    if (error) {
      console.error(`❌ Error updating "${slug}":`, error.message)
      errors++
    } else {
      console.log(`✅ Updated and moved to end: "${slug}"`)
      updated++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Errors: ${errors}`)
  console.log(`\n✅ Done! All three services now have images and are at the end.`)
}

updateAndMove().catch(console.error)

