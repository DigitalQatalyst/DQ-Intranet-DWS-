import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function listStrategyImages() {
  console.log('📋 Strategy Service Images:\n')
  
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
  
  strategyServices.forEach((service, index) => {
    console.log(`${index + 1}. ${service.title}`)
    console.log(`   Slug: ${service.slug}`)
    if (service.hero_image_url) {
      console.log(`   Image: ${service.hero_image_url}`)
    } else {
      console.log(`   Image: ❌ NO IMAGE`)
    }
    console.log('')
  })
  
  console.log(`\n✅ Total: ${strategyServices.length} strategy services`)
  const withImages = strategyServices.filter(s => s.hero_image_url).length
  console.log(`   With images: ${withImages}`)
  console.log(`   Without images: ${strategyServices.length - withImages}`)
}

listStrategyImages().catch(console.error)

