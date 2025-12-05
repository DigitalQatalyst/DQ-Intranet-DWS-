import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Get all current images to see what's duplicated
async function fixRemainingStrategyDuplicates() {
  console.log('🔍 Checking for remaining duplicate images...\n')
  
  const { data: strategies } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .eq('domain', 'strategy')
    .order('title')
  
  // Group by image URL
  const imageMap = new Map()
  strategies?.forEach(s => {
    const img = s.hero_image_url || 'NO_IMAGE'
    if (!imageMap.has(img)) {
      imageMap.set(img, [])
    }
    imageMap.get(img).push({ slug: s.slug, title: s.title })
  })
  
  // Find duplicates
  const duplicates = Array.from(imageMap.entries()).filter(([_, services]) => services.length > 1)
  
  if (duplicates.length > 0) {
    console.log(`❌ Found ${duplicates.length} duplicate image(s):\n`)
    duplicates.forEach(([url, services]) => {
      console.log(`   Image: ${url.substring(0, 70)}...`)
      console.log(`   Used by ${services.length} service(s):`)
      services.forEach((s, i) => console.log(`      ${i + 1}. ${s.title} (${s.slug})`))
      console.log('')
    })
    
    // Update duplicates with unique images
    console.log('🖼️  Updating duplicates with unique images...\n')
    
    // Completely unique images for each service - no laptop screens
    const uniqueImageMap = {
      'dq-competencies': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team collaboration
      'dq-beliefs': 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Writing/planning
      'agile-6xd-products': 'https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Agile workspace
    }
    
    // Get all current images to avoid conflicts
    const allCurrentImages = new Set(strategies?.map(s => s.hero_image_url).filter(Boolean))
    
    let updatedCount = 0
    let errorCount = 0
    
    for (const [url, services] of duplicates) {
      for (const service of services) {
        const newImage = uniqueImageMap[service.slug]
        
        if (!newImage) {
          // If no specific image defined, use a fallback that's not in use
          const fallbackImages = [
            'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          ]
          
          // Find first unused image
          let selectedImage = null
          for (const fallback of fallbackImages) {
            if (!allCurrentImages.has(fallback)) {
              selectedImage = fallback
              break
            }
          }
          
          if (!selectedImage) {
            console.log(`⚠️  No available image for: ${service.title}`)
            continue
          }
          
          const { error } = await supabase
            .from('guides')
            .update({
              hero_image_url: selectedImage,
              last_updated_at: new Date().toISOString()
            })
            .eq('slug', service.slug)
          
          if (error) {
            console.error(`❌ Error updating "${service.title}":`, error.message)
            errorCount++
          } else {
            console.log(`✅ Updated: "${service.title}"`)
            allCurrentImages.add(selectedImage)
            updatedCount++
          }
        } else {
          // Use the predefined unique image
          if (allCurrentImages.has(newImage)) {
            console.log(`⚠️  Image already in use for: ${service.title}, skipping...`)
            continue
          }
          
          const { error } = await supabase
            .from('guides')
            .update({
              hero_image_url: newImage,
              last_updated_at: new Date().toISOString()
            })
            .eq('slug', service.slug)
          
          if (error) {
            console.error(`❌ Error updating "${service.title}":`, error.message)
            errorCount++
          } else {
            console.log(`✅ Updated: "${service.title}"`)
            allCurrentImages.add(newImage)
            updatedCount++
          }
        }
      }
    }
    
    console.log(`\n📊 Summary:`)
    console.log(`   Updated: ${updatedCount}`)
    console.log(`   Errors: ${errorCount}`)
  } else {
    console.log('✅ No duplicates found - all images are unique!')
  }
  
  // Final verification
  console.log(`\n🔍 Final verification...\n`)
  const { data: verify } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .eq('domain', 'strategy')
    .order('title')
  
  const finalImageMap = new Map()
  verify?.forEach(s => {
    const img = s.hero_image_url || 'NO_IMAGE'
    if (!finalImageMap.has(img)) {
      finalImageMap.set(img, [])
    }
    finalImageMap.get(img).push(s.title)
  })
  
  const finalDuplicates = Array.from(finalImageMap.entries()).filter(([_, titles]) => titles.length > 1)
  
  if (finalDuplicates.length > 0) {
    console.log(`❌ Still found ${finalDuplicates.length} duplicate(s):\n`)
    finalDuplicates.forEach(([url, titles]) => {
      console.log(`   Image: ${url.substring(0, 70)}...`)
      console.log(`   Used by: ${titles.join(', ')}\n`)
    })
  } else {
    console.log(`✅ All ${verify?.length} strategy services have unique images!\n`)
  }
}

fixRemainingStrategyDuplicates().catch(console.error)

