import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkAllItemsImages() {
  console.log('🔍 Checking ALL guides (including non-approved) for images...\n')
  
  // Check all guides regardless of status
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('slug, title, domain, guide_type, hero_image_url, status')
    .order('status')
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
  
  const needsImage = allGuides.filter(g => {
    const img = g.hero_image_url
    return !img || img.trim().length === 0 || !img.startsWith('http')
  })
  
  const hasImage = allGuides.filter(g => {
    const img = g.hero_image_url
    return img && img.trim().length > 0 && img.startsWith('http')
  })
  
  console.log(`📊 Total guides: ${allGuides.length}`)
  console.log(`✅ With images: ${hasImage.length}`)
  console.log(`❌ Without images: ${needsImage.length}\n`)
  
  if (needsImage.length > 0) {
    console.log('❌ Guides WITHOUT images:\n')
    const byStatus = {}
    needsImage.forEach(guide => {
      const status = guide.status || 'Unknown'
      if (!byStatus[status]) byStatus[status] = []
      byStatus[status].push(guide)
    })
    
    Object.keys(byStatus).sort().forEach(status => {
      console.log(`\n📁 Status: ${status} (${byStatus[status].length} guides):`)
      const byDomain = {}
      byStatus[status].forEach(guide => {
        const domain = guide.domain || 'Unknown'
        if (!byDomain[domain]) byDomain[domain] = []
        byDomain[domain].push(guide)
      })
      
      Object.keys(byDomain).sort().forEach(domain => {
        console.log(`   📂 ${domain}:`)
        byDomain[domain].forEach((guide, index) => {
          console.log(`      ${index + 1}. ${guide.title} (${guide.slug})`)
        })
      })
    })
    
    return { needsImage, allGuides }
  } else {
    console.log('✅ All guides have images!')
    return { needsImage: [], allGuides }
  }
}

checkAllItemsImages().catch(console.error)

