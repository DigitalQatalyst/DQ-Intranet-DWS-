import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkGuidelinesUniqueImages() {
  console.log('🔍 Checking if guidelines have unique images...\n')
  
  const { data: guidelines, error } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .or('domain.ilike.%guideline%,guide_type.ilike.%guideline%,title.ilike.%guideline%')
    .order('title')
  
  if (error) {
    console.error('❌ Error:', error.message)
    return
  }
  
  if (!guidelines || guidelines.length === 0) {
    console.log('⚠️  No guidelines found')
    return
  }
  
  console.log(`📊 Total guidelines: ${guidelines.length}\n`)
  
  // Group by image URL
  const imageMap = new Map()
  
  guidelines.forEach(guide => {
    const imgUrl = guide.hero_image_url || 'NO_IMAGE'
    if (!imageMap.has(imgUrl)) {
      imageMap.set(imgUrl, [])
    }
    imageMap.get(imgUrl).push({
      title: guide.title,
      slug: guide.slug
    })
  })
  
  // Check for duplicates
  const duplicates = []
  const unique = []
  
  imageMap.forEach((guides, imageUrl) => {
    if (guides.length > 1) {
      duplicates.push({ imageUrl, guides })
    } else {
      unique.push({ imageUrl, guide: guides[0] })
    }
  })
  
  if (duplicates.length > 0) {
    console.log(`❌ Found ${duplicates.length} image(s) used by multiple guidelines:\n`)
    duplicates.forEach((dup, index) => {
      console.log(`${index + 1}. Image URL: ${dup.imageUrl.substring(0, 80)}...`)
      console.log(`   Used by ${dup.guides.length} guideline(s):`)
      dup.guides.forEach((g, i) => {
        console.log(`      ${i + 1}. ${g.title} (${g.slug})`)
      })
      console.log('')
    })
  } else {
    console.log('✅ All guidelines have unique images!\n')
  }
  
  console.log(`📊 Summary:`)
  console.log(`   Total guidelines: ${guidelines.length}`)
  console.log(`   Unique images: ${unique.length}`)
  console.log(`   Duplicate images: ${duplicates.length}`)
  console.log(`   Total unique image URLs: ${imageMap.size}\n`)
  
  if (unique.length > 0 && duplicates.length === 0) {
    console.log('✅ All guidelines have unique images!')
  } else if (duplicates.length > 0) {
    console.log('⚠️  Some guidelines share the same images.')
  }
  
  return { duplicates, unique }
}

checkGuidelinesUniqueImages().catch(console.error)

