import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixFinalStrategyDuplicate() {
  console.log('🖼️  Fixing final duplicate - Solutions Strategy Framework...\n')
  
  // Get all current strategy images to avoid duplicates
  const { data: allStrategies } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .eq('domain', 'strategy')
  
  const usedImages = new Set(allStrategies?.map(s => s.hero_image_url).filter(Boolean))
  
  // Use a completely different image that's not in use
  const newImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' // Analytics/data visualization - different from all others
  
  // Check if this image is already used
  if (usedImages.has(newImage)) {
    console.log('⚠️  Image already in use, trying alternative...')
    // Alternative: use a different analytics/strategy image
    const altImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    if (usedImages.has(altImage)) {
      console.log('⚠️  Alternative also in use, trying another...')
      // Another alternative
      const finalImage = 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      await updateImage('solutions-strategy-framework', finalImage)
    } else {
      await updateImage('solutions-strategy-framework', altImage)
    }
  } else {
    await updateImage('solutions-strategy-framework', newImage)
  }
  
  async function updateImage(slug, imageUrl) {
    const { data: guide } = await supabase
      .from('guides')
      .select('title')
      .eq('slug', slug)
      .single()
    
    if (!guide) {
      console.log(`⚠️  Guide not found: ${slug}`)
      return
    }
    
    const { error } = await supabase
      .from('guides')
      .update({
        hero_image_url: imageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
    
    if (error) {
      console.error(`❌ Error:`, error.message)
    } else {
      console.log(`✅ Updated: "${guide.title}"`)
      console.log(`   New image: ${imageUrl.substring(0, 70)}...\n`)
    }
  }
  
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
    console.log(`❌ Still found ${duplicates.length} duplicate(s):\n`)
    duplicates.forEach(([url, titles]) => {
      console.log(`   Image: ${url.substring(0, 70)}...`)
      console.log(`   Used by: ${titles.join(', ')}\n`)
    })
  } else {
    console.log(`✅ All ${verify?.length} strategy services have unique images!\n`)
  }
}

fixFinalStrategyDuplicate().catch(console.error)

