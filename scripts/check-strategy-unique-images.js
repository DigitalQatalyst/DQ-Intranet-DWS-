import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkStrategyUniqueImages() {
  console.log('🔍 Checking if strategy services have unique images...\n')
  
  const { data: strategies, error } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .eq('domain', 'strategy')
    .order('title')
  
  if (error) {
    console.error('❌ Error:', error.message)
    return
  }
  
  if (!strategies || strategies.length === 0) {
    console.log('⚠️  No strategy services found')
    return
  }
  
  console.log(`📊 Total strategy services: ${strategies.length}\n`)
  
  // Group by image URL
  const imageMap = new Map()
  
  strategies.forEach(strategy => {
    const imgUrl = strategy.hero_image_url || 'NO_IMAGE'
    if (!imageMap.has(imgUrl)) {
      imageMap.set(imgUrl, [])
    }
    imageMap.get(imgUrl).push({
      title: strategy.title,
      slug: strategy.slug
    })
  })
  
  // Check for duplicates
  const duplicates = []
  const unique = []
  
  imageMap.forEach((services, imageUrl) => {
    if (services.length > 1) {
      duplicates.push({ imageUrl, services })
    } else {
      unique.push({ imageUrl, service: services[0] })
    }
  })
  
  if (duplicates.length > 0) {
    console.log(`❌ Found ${duplicates.length} image(s) used by multiple strategy services:\n`)
    duplicates.forEach((dup, index) => {
      console.log(`${index + 1}. Image URL: ${dup.imageUrl.substring(0, 80)}...`)
      console.log(`   Used by ${dup.services.length} service(s):`)
      dup.services.forEach((s, i) => {
        console.log(`      ${i + 1}. ${s.title} (${s.slug})`)
      })
      console.log('')
    })
  } else {
    console.log('✅ All strategy services have unique images!\n')
  }
  
  console.log(`📊 Summary:`)
  console.log(`   Total strategy services: ${strategies.length}`)
  console.log(`   Unique images: ${unique.length}`)
  console.log(`   Duplicate images: ${duplicates.length}`)
  console.log(`   Total unique image URLs: ${imageMap.size}\n`)
  
  return { duplicates, unique, strategies }
}

checkStrategyUniqueImages().catch(console.error)

