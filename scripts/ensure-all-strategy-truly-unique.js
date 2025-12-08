import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Completely unique images for ALL 10 strategy services - no duplicates
const allStrategyImages = {
  'dq-journey': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Mountain road
  'dq-beliefs': 'https://images.unsplash.com/photo-1521737854947-0b219b6c2c94?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Blueprint
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team meeting
  'dq-strategy-2021-2030': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Charts
  'dq-competencies': 'https://images.unsplash.com/photo-1557800636-23f87b1063e4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Collaboration
  'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Product board
  'agile-6xd-products': 'https://images.unsplash.com/photo-1553877522-25bcdc54f2de?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Sticky notes
  'product-strategy-overview': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team discussion
  'solutions-strategy-framework': 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Planning board
  'product-roadmap-planning': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Calendar
}

async function ensureAllStrategyTrulyUnique() {
  console.log('🖼️  Ensuring ALL strategy services have truly unique images...\n')
  
  // Verify no duplicates in our mapping
  const imageValues = Object.values(allStrategyImages)
  const uniqueImages = new Set(imageValues)
  if (imageValues.length !== uniqueImages.size) {
    console.log('❌ ERROR: Duplicate images found in mapping!')
    return
  }
  
  console.log('✅ Image mapping verified - all unique\n')
  
  let updatedCount = 0
  let errorCount = 0
  
  for (const [slug, imageUrl] of Object.entries(allStrategyImages)) {
    const { data: guide, error: fetchError } = await supabase
      .from('guides')
      .select('title, hero_image_url')
      .eq('slug', slug)
      .single()
    
    if (fetchError) {
      console.error(`❌ Error fetching "${slug}":`, fetchError.message)
      errorCount++
      continue
    }
    
    if (!guide) {
      console.log(`⚠️  Guide not found: ${slug}`)
      continue
    }
    
    if (guide.hero_image_url === imageUrl) {
      console.log(`✓ Already correct: "${guide.title}"`)
      continue
    }
    
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: imageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
    
    if (updateError) {
      console.error(`❌ Error updating "${guide.title}":`, updateError.message)
      errorCount++
    } else {
      console.log(`✅ Updated: "${guide.title}"`)
      updatedCount++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Updated: ${updatedCount}`)
  console.log(`   Already correct: ${Object.keys(allStrategyImages).length - updatedCount - errorCount}`)
  console.log(`   Errors: ${errorCount}`)
  
  // Final verification
  console.log(`\n🔍 Final verification...\n`)
  const { data: verify } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .eq('domain', 'strategy')
    .order('title')
  
  const imageMap = new Map()
  verify?.forEach(s => {
    const img = s.hero_image_url || 'NO_IMAGE'
    if (!imageMap.has(img)) {
      imageMap.set(img, [])
    }
    imageMap.get(img).push(s.title)
  })
  
  const duplicates = Array.from(imageMap.entries()).filter(([_, titles]) => titles.length > 1)
  
  if (duplicates.length > 0) {
    console.log(`❌ Found ${duplicates.length} duplicate(s):\n`)
    duplicates.forEach(([url, titles]) => {
      console.log(`   Image: ${url.substring(0, 70)}...`)
      console.log(`   Used by: ${titles.join(', ')}\n`)
    })
  } else {
    console.log(`✅ All ${verify?.length} strategy services have unique images!\n`)
    console.log('📋 All strategy service images (verified unique):')
    verify?.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.title}`)
      console.log(`      ${s.hero_image_url.substring(0, 70)}...`)
    })
  }
}

ensureAllStrategyTrulyUnique().catch(console.error)

