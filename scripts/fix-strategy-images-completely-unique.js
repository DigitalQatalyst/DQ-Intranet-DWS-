import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Completely different, visually distinct images - no laptop screens, no similar charts
const uniqueImages = {
  'solutions-strategy-framework': 'https://images.unsplash.com/photo-1553877522-25bcdc54f2de?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Colorful sticky notes/planning
  'product-strategy-overview': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team meeting/discussion
  'product-roadmap-planning': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Calendar/planning
}

async function fixStrategyImagesCompletelyUnique() {
  console.log('🖼️  Updating with completely unique, visually distinct images...\n')
  
  let updatedCount = 0
  let errorCount = 0
  
  for (const [slug, imageUrl] of Object.entries(uniqueImages)) {
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
      console.log(`   New image: ${imageUrl.substring(0, 70)}...\n`)
      updatedCount++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Updated: ${updatedCount}`)
  console.log(`   Errors: ${errorCount}`)
  
  // Verify they're all unique now
  console.log(`\n🔍 Verifying all strategy services have unique images...\n`)
  const { data: allStrategies } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .eq('domain', 'strategy')
    .order('title')
  
  const imageMap = new Map()
  allStrategies?.forEach(s => {
    const img = s.hero_image_url || 'NO_IMAGE'
    if (!imageMap.has(img)) {
      imageMap.set(img, [])
    }
    imageMap.get(img).push(s.title)
  })
  
  const duplicates = Array.from(imageMap.entries()).filter(([_, titles]) => titles.length > 1)
  
  if (duplicates.length > 0) {
    console.log(`❌ Still found ${duplicates.length} duplicate(s):\n`)
    duplicates.forEach(([url, titles]) => {
      console.log(`   Image: ${url.substring(0, 70)}...`)
      console.log(`   Used by: ${titles.join(', ')}\n`)
    })
  } else {
    console.log(`✅ All ${allStrategies?.length} strategy services have unique images!\n`)
    console.log('📋 All strategy service images:')
    allStrategies?.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.title}`)
      console.log(`      ${s.hero_image_url.substring(0, 70)}...`)
    })
  }
}

fixStrategyImagesCompletelyUnique().catch(console.error)

