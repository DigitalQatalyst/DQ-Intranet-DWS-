import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verifyAllImages() {
  console.log('🔍 Verifying all guide images...\n')
  
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
  
  console.log(`📊 Total guides: ${allGuides.length}\n`)
  
  const issues = []
  const good = []
  
  for (const guide of allGuides) {
    const imageUrl = guide.hero_image_url
    
    if (!imageUrl || imageUrl.trim().length === 0) {
      issues.push({
        ...guide,
        issue: 'Missing image URL'
      })
    } else if (!imageUrl.startsWith('http')) {
      issues.push({
        ...guide,
        issue: 'Invalid image URL (not http/https)'
      })
    } else {
      good.push(guide)
    }
  }
  
  if (issues.length > 0) {
    console.log(`❌ Found ${issues.length} guide(s) with image issues:\n`)
    const byDomain = {}
    issues.forEach(guide => {
      const domain = guide.domain || 'Unknown'
      if (!byDomain[domain]) byDomain[domain] = []
      byDomain[domain].push(guide)
    })
    
    Object.keys(byDomain).sort().forEach(domain => {
      console.log(`\n📁 ${domain}:`)
      byDomain[domain].forEach((guide, index) => {
        console.log(`   ${index + 1}. ${guide.title} (${guide.slug})`)
        console.log(`      Issue: ${guide.issue}`)
      })
    })
  } else {
    console.log('✅ All guides have valid image URLs!')
  }
  
  console.log(`\n✅ Guides with valid images: ${good.length}`)
  
  return { allGuides, issues, good }
}

verifyAllImages().catch(console.error)

