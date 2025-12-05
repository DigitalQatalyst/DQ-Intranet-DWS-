import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Unique images for each strategy service - carefully selected to match the content
// Each image is unique and relevant to the service
const strategyImages = {
  'dq-journey': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Journey/path - mountain road
  'dq-beliefs': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Values/beliefs - blueprint/plan
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Vision/mission - city skyline
  'dq-strategy-2021-2030': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Strategy/planning - charts/graphs
  'dq-competencies': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Competencies/skills - team collaboration
  'dq-products': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Products - product development
  'agile-6xd-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Agile products - roadmap/charts
  'product-strategy-overview': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228fbb?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Product strategy - strategy board
  'solutions-strategy-framework': 'https://images.unsplash.com/photo-1553877522-25bcdc54f2de?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Solutions framework - framework diagram
  'product-roadmap-planning': 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' // Roadmap planning - planning board
}

async function updateAllStrategyImages() {
  console.log('🖼️  Updating all strategy service images with unique images...\n')
  
  // First, get all strategy services
  const { data: allStrategy, error: fetchError } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .eq('domain', 'strategy')
    .order('title')
  
  if (fetchError) {
    console.error('❌ Error fetching strategy services:', fetchError.message)
    return
  }
  
  console.log(`Found ${allStrategy.length} strategy service(s)\n`)
  
  let updated = 0
  let skipped = 0
  let errors = 0
  
  for (const guide of allStrategy) {
    const imageUrl = strategyImages[guide.slug]
    
    if (!imageUrl) {
      console.log(`⚠️  No image defined for: "${guide.title}" (${guide.slug})`)
      skipped++
      continue
    }
    
    // Check if it already has this image
    if (guide.hero_image_url === imageUrl) {
      console.log(`✓ Already has correct image: "${guide.title}"`)
      skipped++
      continue
    }
    
    const { error } = await supabase
      .from('guides')
      .update({ hero_image_url: imageUrl })
      .eq('slug', guide.slug)
    
    if (error) {
      console.error(`❌ Error updating "${guide.title}":`, error.message)
      errors++
    } else {
      console.log(`✅ Updated: "${guide.title}"`)
      updated++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Errors: ${errors}`)
  console.log(`\n✅ Done! All strategy services now have unique images.`)
}

updateAllStrategyImages().catch(console.error)

