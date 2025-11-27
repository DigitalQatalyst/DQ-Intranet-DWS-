import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Completely different, visually distinct images for the three services showing duplicates
const specificImages = {
  'dq-competencies': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team collaboration - different from laptop
  'dq-beliefs': 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Writing/planning - different visual
  'agile-6xd-products': 'https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Agile workspace - completely different
}

async function updateSpecificStrategyImages() {
  console.log('🖼️  Updating specific strategy services with visually distinct images...\n')
  
  // First, check current images
  const { data: current } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .in('slug', Object.keys(specificImages))
  
  console.log('Current images:')
  current?.forEach(s => {
    console.log(`  ${s.title}: ${s.hero_image_url?.substring(0, 70)}...`)
  })
  console.log('')
  
  // Get all strategy images to ensure no conflicts
  const { data: allStrategies } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .eq('domain', 'strategy')
  
  const usedImages = new Set(allStrategies?.map(s => s.hero_image_url).filter(Boolean))
  
  let updatedCount = 0
  let errorCount = 0
  
  for (const [slug, newImage] of Object.entries(specificImages)) {
    const guide = current?.find(s => s.slug === slug)
    
    if (!guide) {
      console.log(`⚠️  Guide not found: ${slug}`)
      continue
    }
    
    if (usedImages.has(newImage) && guide.hero_image_url !== newImage) {
      console.log(`⚠️  Image already in use by another service: ${guide.title}`)
      // Try alternative
      const alternatives = [
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ]
      
      let selectedImage = newImage
      for (const alt of alternatives) {
        if (!usedImages.has(alt)) {
          selectedImage = alt
          break
        }
      }
      
      if (selectedImage === newImage) {
        console.log(`   Using original image anyway...`)
      } else {
        console.log(`   Using alternative image...`)
      }
      
      const { error } = await supabase
        .from('guides')
        .update({
          hero_image_url: selectedImage,
          last_updated_at: new Date().toISOString()
        })
        .eq('slug', slug)
      
      if (error) {
        console.error(`❌ Error updating "${guide.title}":`, error.message)
        errorCount++
      } else {
        console.log(`✅ Updated: "${guide.title}"`)
        console.log(`   New: ${selectedImage.substring(0, 70)}...\n`)
        usedImages.add(selectedImage)
        updatedCount++
      }
    } else {
      const { error } = await supabase
        .from('guides')
        .update({
          hero_image_url: newImage,
          last_updated_at: new Date().toISOString()
        })
        .eq('slug', slug)
      
      if (error) {
        console.error(`❌ Error updating "${guide.title}":`, error.message)
        errorCount++
      } else {
        console.log(`✅ Updated: "${guide.title}"`)
        console.log(`   New: ${newImage.substring(0, 70)}...\n`)
        usedImages.add(newImage)
        updatedCount++
      }
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Updated: ${updatedCount}`)
  console.log(`   Errors: ${errorCount}`)
  
  // Final verification
  console.log(`\n🔍 Final verification...\n`)
  const { data: verify } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .eq('domain', 'strategy')
    .in('slug', Object.keys(specificImages))
    .order('title')
  
  console.log('Updated images:')
  verify?.forEach((s, i) => {
    console.log(`   ${i + 1}. ${s.title}`)
    console.log(`      ${s.hero_image_url.substring(0, 70)}...`)
  })
  
  // Check for duplicates across all strategies
  const { data: allFinal } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .eq('domain', 'strategy')
  
  const imageMap = new Map()
  allFinal?.forEach(s => {
    const img = s.hero_image_url || 'NO_IMAGE'
    if (!imageMap.has(img)) {
      imageMap.set(img, [])
    }
    imageMap.get(img).push(s.title)
  })
  
  const duplicates = Array.from(imageMap.entries()).filter(([_, titles]) => titles.length > 1)
  
  if (duplicates.length > 0) {
    console.log(`\n❌ Still found ${duplicates.length} duplicate(s):\n`)
    duplicates.forEach(([url, titles]) => {
      console.log(`   Image: ${url.substring(0, 70)}...`)
      console.log(`   Used by: ${titles.join(', ')}\n`)
    })
  } else {
    console.log(`\n✅ All strategy services have unique images!`)
  }
}

updateSpecificStrategyImages().catch(console.error)

