import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkAllGuidesImages() {
  console.log('🔍 Checking all guides for missing images...\n')
  
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('slug, title, domain, guide_type, hero_image_url')
    .eq('status', 'Approved')
    .order('domain')
    .order('title')
  
  if (error) {
    console.error('❌ Error:', error.message)
    return
  }
  
  if (!allGuides || allGuides.length === 0) {
    console.log('⚠️  No guides found')
    return
  }
  
  const withImages = allGuides.filter(g => g.hero_image_url && g.hero_image_url.trim().length > 0)
  const withoutImages = allGuides.filter(g => !g.hero_image_url || g.hero_image_url.trim().length === 0)
  
  console.log(`📊 Total guides: ${allGuides.length}`)
  console.log(`✅ With images: ${withImages.length}`)
  console.log(`❌ Without images: ${withoutImages.length}\n`)
  
  if (withoutImages.length > 0) {
    console.log('❌ Guides WITHOUT images:\n')
    const byDomain = {}
    withoutImages.forEach(guide => {
      const domain = guide.domain || 'Unknown'
      if (!byDomain[domain]) byDomain[domain] = []
      byDomain[domain].push(guide)
    })
    
    Object.keys(byDomain).sort().forEach(domain => {
      console.log(`\n📁 ${domain} (${byDomain[domain].length} guides):`)
      byDomain[domain].forEach((guide, index) => {
        console.log(`   ${index + 1}. ${guide.title} (${guide.slug})`)
      })
    })
  } else {
    console.log('✅ All guides have images!')
  }
  
  return { allGuides, withoutImages }
}

checkAllGuidesImages().catch(console.error)
