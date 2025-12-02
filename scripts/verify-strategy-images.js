import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verifyImages() {
  console.log('🔍 Verifying strategy service images...\n')
  
  const { data, error } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url, domain')
    .eq('domain', 'strategy')
    .order('title')
  
  if (error) {
    console.error('❌ Error:', error.message)
    return
  }
  
  if (!data || data.length === 0) {
    console.log('No strategy services found.')
    return
  }
  
  console.log(`Found ${data.length} strategy service(s):\n`)
  
  let hasImages = 0
  let missingImages = 0
  
  data.forEach((g, i) => {
    const hasImage = g.hero_image_url && g.hero_image_url.trim() !== ''
    if (hasImage) {
      hasImages++
      console.log(`${i + 1}. ✅ "${g.title}"`)
      console.log(`   Image: ${g.hero_image_url.substring(0, 80)}...`)
    } else {
      missingImages++
      console.log(`${i + 1}. ❌ "${g.title}" - NO IMAGE`)
    }
    console.log()
  })
  
  console.log(`\n📊 Summary:`)
  console.log(`   Total: ${data.length}`)
  console.log(`   With images: ${hasImages}`)
  console.log(`   Missing images: ${missingImages}`)
}

verifyImages().catch(console.error)

