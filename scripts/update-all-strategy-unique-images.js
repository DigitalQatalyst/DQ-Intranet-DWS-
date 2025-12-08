import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Completely unique images for each strategy service - using diverse, relevant Unsplash images
const strategyImages = {
  'dq-journey': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Mountain road/journey
  'dq-beliefs': 'https://images.unsplash.com/photo-1521737854947-0b219b6c2c94?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Blueprint/planning document
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team meeting/vision
  'dq-strategy-2021-2030': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Charts/strategy board
  'dq-competencies': 'https://images.unsplash.com/photo-1557800636-23f87b1063e4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team collaboration
  'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Product development board
  'agile-6xd-products': 'https://images.unsplash.com/photo-1553877522-25bcdc54f2de?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Agile/roadmap charts
  'product-strategy-overview': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Analytics/data visualization
  'solutions-strategy-framework': 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Framework/architecture diagram
  'product-roadmap-planning': 'https://images.unsplash.com/photo-1556761175-5974b9748b90?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Planning/whiteboard
}

async function updateAllStrategyUniqueImages() {
  console.log('🖼️  Updating ALL strategy services with completely unique images...\n')
  
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
  
  for (const strategy of strategies) {
    const newImageUrl = strategyImages[strategy.slug]
    
    if (!newImageUrl) {
      console.log(`⚠️  No image defined for: "${strategy.title}" (${strategy.slug})`)
      continue
    }
    
    // Always update to ensure uniqueness
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
      const wasSame = strategy.hero_image_url === newImageUrl
      console.log(`${wasSame ? '✓' : '✅'} ${wasSame ? 'Verified' : 'Updated'}: "${strategy.title}"`)
      if (!wasSame) updatedCount++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Total strategy services: ${strategies.length}`)
  console.log(`   Updated: ${updatedCount}`)
  console.log(`   Errors: ${errorCount}`)
  
  // Verify uniqueness
  console.log(`\n🔍 Verifying all images are unique...\n`)
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
    imageMap.get(img).push({ title: s.title, slug: s.slug })
  })
  
  const duplicates = Array.from(imageMap.entries()).filter(([_, services]) => services.length > 1)
  
  if (duplicates.length > 0) {
    console.log(`❌ Still found ${duplicates.length} duplicate image(s):\n`)
    duplicates.forEach(([url, services]) => {
      console.log(`   Image: ${url.substring(0, 70)}...`)
      console.log(`   Used by ${services.length} service(s):`)
      services.forEach((s, i) => console.log(`      ${i + 1}. ${s.title} (${s.slug})`))
      console.log('')
    })
  } else {
    console.log(`✅ Verified: All ${verifyStrategies?.length} strategy services have unique images!`)
    console.log('\n📋 Image assignments:')
    verifyStrategies?.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.title}`)
      console.log(`      ${s.hero_image_url.substring(0, 70)}...`)
    })
  }
}

updateAllStrategyUniqueImages().catch(console.error)

