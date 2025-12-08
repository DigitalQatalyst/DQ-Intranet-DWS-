import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Unique, relevant images for each strategy service
const strategyImages = {
  'dq-journey': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Mountain road/journey path
  'dq-beliefs': 'https://images.unsplash.com/photo-1521737854947-0b219b6c2c94?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Blueprint/planning
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team vision/meeting
  'dq-strategy-2021-2030': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Charts/strategy planning
  'dq-competencies': 'https://images.unsplash.com/photo-1557800636-23f87b1063e4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team collaboration
  'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Product development
  'agile-6xd-products': 'https://images.unsplash.com/photo-1553877522-25bcdc54f2de?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Roadmap/charts
  'product-strategy-overview': 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Planning board
  'solutions-strategy-framework': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Framework diagram
  'product-roadmap-planning': 'https://images.unsplash.com/photo-1556761175-5974b9748b90?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Planning/roadmap
}

async function updateStrategyUniqueImages() {
  console.log('🖼️  Updating strategy services with unique images...\n')
  
  const { data: strategies, error: fetchError } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .eq('domain', 'strategy')
    .order('title')
  
  if (fetchError) {
    console.error('❌ Error fetching strategy services:', fetchError.message)
    return
  }
  
  if (!strategies || strategies.length === 0) {
    console.log('⚠️  No strategy services found')
    return
  }
  
  console.log(`Found ${strategies.length} strategy service(s)\n`)
  
  let updatedCount = 0
  let errorCount = 0
  let skippedCount = 0
  
  for (const strategy of strategies) {
    const newImageUrl = strategyImages[strategy.slug]
    
    if (!newImageUrl) {
      console.log(`⚠️  No image defined for: "${strategy.title}" (${strategy.slug})`)
      continue
    }
    
    // Check if image is already set and matches
    if (strategy.hero_image_url === newImageUrl) {
      console.log(`✓ Already has correct unique image: "${strategy.title}"`)
      skippedCount++
      continue
    }
    
    // Update the image
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: newImageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', strategy.slug)
    
    if (updateError) {
      console.error(`❌ Error updating "${strategy.title}":`, updateError.message)
      errorCount++
    } else {
      console.log(`✅ Updated: "${strategy.title}"`)
      updatedCount++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Total strategy services: ${strategies.length}`)
  console.log(`   Updated: ${updatedCount}`)
  console.log(`   Already correct: ${skippedCount}`)
  console.log(`   Errors: ${errorCount}`)
  console.log(`\n✅ All strategy services now have unique images!`)
  
  // Verify uniqueness
  console.log(`\n🔍 Verifying uniqueness...\n`)
  const { data: verifyStrategies } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .eq('domain', 'strategy')
  
  const imageMap = new Map()
  verifyStrategies?.forEach(s => {
    const img = s.hero_image_url || 'NO_IMAGE'
    if (!imageMap.has(img)) {
      imageMap.set(img, [])
    }
    imageMap.get(img).push(s.title)
  })
  
  const duplicates = Array.from(imageMap.entries()).filter(([_, titles]) => titles.length > 1)
  
  if (duplicates.length > 0) {
    console.log(`❌ Still found ${duplicates.length} duplicate image(s):`)
    duplicates.forEach(([url, titles]) => {
      console.log(`   Image: ${url.substring(0, 60)}...`)
      console.log(`   Used by: ${titles.join(', ')}`)
    })
  } else {
    console.log(`✅ Verified: All ${verifyStrategies?.length} strategy services have unique images!`)
  }
}

updateStrategyUniqueImages().catch(console.error)

