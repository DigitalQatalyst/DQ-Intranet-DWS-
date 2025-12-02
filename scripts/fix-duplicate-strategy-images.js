import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Completely different, unique images for the three services that were showing duplicates
const uniqueImages = {
  'solutions-strategy-framework': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Framework/architecture diagram - different style
  'product-strategy-overview': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Strategy board/planning - different visual
  'product-roadmap-planning': 'https://images.unsplash.com/photo-1556761175-5974b9748b90?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Whiteboard/planning - completely different
}

async function fixDuplicateStrategyImages() {
  console.log('🖼️  Fixing duplicate strategy images with completely unique ones...\n')
  
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
    
    console.log(`Updating: "${guide.title}"`)
    console.log(`  Old: ${guide.hero_image_url?.substring(0, 70)}...`)
    console.log(`  New: ${imageUrl.substring(0, 70)}...`)
    
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
      console.log(`✅ Updated: "${guide.title}"\n`)
      updatedCount++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Updated: ${updatedCount}`)
  console.log(`   Errors: ${errorCount}`)
  
  // Verify they're all unique now
  console.log(`\n🔍 Verifying uniqueness...\n`)
  const { data: verify } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .in('slug', Object.keys(uniqueImages))
  
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
    console.log(`❌ Still found duplicates:`)
    duplicates.forEach(([url, titles]) => {
      console.log(`   Image: ${url.substring(0, 70)}...`)
      console.log(`   Used by: ${titles.join(', ')}`)
    })
  } else {
    console.log(`✅ All three services now have unique images!`)
    verify?.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.title}`)
      console.log(`      ${s.hero_image_url.substring(0, 70)}...`)
    })
  }
}

fixDuplicateStrategyImages().catch(console.error)

