import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function ensureAllStrategyImages() {
  console.log('🖼️  Ensuring all strategy services have images...\n')
  
  // Complete image mapping for all 10 strategy services
  const strategyImages = {
    'dq-journey': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'dq-beliefs': 'https://images.unsplash.com/photo-1521737854947-0b219b6c2c94?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'dq-vision-and-mission': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'dq-strategy-2021-2030': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'dq-competencies': 'https://images.unsplash.com/photo-1557800636-23f87b1063e4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'agile-6xd-products': 'https://images.unsplash.com/photo-1553877522-25bcdc54f2de?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'product-strategy-overview': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'solutions-strategy-framework': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'product-roadmap-planning': 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  }
  
  // Get all strategy services
  const { data: strategyServices, error: fetchError } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .eq('domain', 'strategy')
    .order('title')
  
  if (fetchError) {
    console.error('❌ Error fetching strategy services:', fetchError.message)
    return
  }
  
  if (!strategyServices || strategyServices.length === 0) {
    console.log('⚠️  No strategy services found')
    return
  }
  
  console.log(`Found ${strategyServices.length} strategy service(s)\n`)
  
  let updatedCount = 0
  let alreadyHasImageCount = 0
  let missingImageCount = 0
  let errorCount = 0
  
  for (const service of strategyServices) {
    const imageUrl = strategyImages[service.slug]
    
    if (!imageUrl) {
      console.log(`⚠️  No image defined for: "${service.title}" (${service.slug})`)
      missingImageCount++
      continue
    }
    
    // Check if image is already set and matches
    if (service.hero_image_url === imageUrl) {
      console.log(`✓ Already has correct image: "${service.title}"`)
      alreadyHasImageCount++
      continue
    }
    
    // Update the image
    const { error } = await supabase
      .from('guides')
      .update({
        hero_image_url: imageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', service.slug)
    
    if (error) {
      console.error(`❌ Error updating "${service.title}":`, error.message)
      errorCount++
    } else {
      console.log(`✅ Updated: "${service.title}"`)
      updatedCount++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Updated: ${updatedCount}`)
  console.log(`   Already had image: ${alreadyHasImageCount}`)
  console.log(`   Missing image definition: ${missingImageCount}`)
  console.log(`   Errors: ${errorCount}`)
  console.log(`\n✅ All strategy services now have images!`)
}

ensureAllStrategyImages().catch(console.error)

