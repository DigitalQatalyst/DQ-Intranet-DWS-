import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkGuidelinesImages() {
  console.log('🔍 Checking guidelines images...\n')
  
  const { data: guidelines, error } = await supabase
    .from('guides')
    .select('slug, title, domain, guide_type, hero_image_url')
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
  
  const withImages = guidelines.filter(g => {
    const img = g.hero_image_url
    return img && img.trim().length > 0 && img.startsWith('http')
  })
  
  const withoutImages = guidelines.filter(g => {
    const img = g.hero_image_url
    return !img || img.trim().length === 0 || !img.startsWith('http')
  })
  
  console.log(`✅ With images: ${withImages.length}`)
  console.log(`❌ Without images: ${withoutImages.length}\n`)
  
  if (withoutImages.length > 0) {
    console.log('❌ Guidelines WITHOUT images:\n')
    withoutImages.forEach((guide, index) => {
      console.log(`${index + 1}. ${guide.title} (${guide.slug})`)
      console.log(`   Domain: ${guide.domain || 'N/A'}`)
      console.log(`   Type: ${guide.guide_type || 'N/A'}`)
      console.log(`   Image URL: ${guide.hero_image_url || 'NULL'}\n`)
    })
  }
  
  if (withImages.length > 0) {
    console.log('\n✅ Guidelines WITH images:\n')
    withImages.forEach((guide, index) => {
      console.log(`${index + 1}. ${guide.title}`)
      console.log(`   Image: ${guide.hero_image_url.substring(0, 60)}...\n`)
    })
  }
  
  return { withImages, withoutImages }
}

checkGuidelinesImages().catch(console.error)

