import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkMissingStrategyImages() {
  console.log('🔍 Checking which strategy services are missing images...\n')
  
  const { data: strategyServices, error } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .eq('domain', 'strategy')
    .order('title')
  
  if (error) {
    console.error('❌ Error:', error.message)
    return
  }
  
  if (!strategyServices || strategyServices.length === 0) {
    console.log('⚠️  No strategy services found')
    return
  }
  
  const withImages = strategyServices.filter(s => s.hero_image_url && s.hero_image_url.trim().length > 0)
  const withoutImages = strategyServices.filter(s => !s.hero_image_url || s.hero_image_url.trim().length === 0)
  
  console.log(`📊 Total strategy services: ${strategyServices.length}`)
  console.log(`✅ With images: ${withImages.length}`)
  console.log(`❌ Without images: ${withoutImages.length}\n`)
  
  if (withoutImages.length > 0) {
    console.log('❌ Strategy services WITHOUT images:')
    withoutImages.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.title} (${service.slug})`)
    })
  } else {
    console.log('✅ All strategy services have images!')
  }
  
  console.log('\n✅ Services WITH images:')
  withImages.forEach((service, index) => {
    console.log(`   ${index + 1}. ${service.title}`)
  })
}

checkMissingStrategyImages().catch(console.error)

