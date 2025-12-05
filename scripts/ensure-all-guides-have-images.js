import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Comprehensive image mapping
const imageMap = {
  // Strategy-specific images
  strategy: {
    'dq-journey': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'dq-beliefs': 'https://images.unsplash.com/photo-1521737854947-0b219b6c2c94?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'dq-vision-and-mission': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'dq-strategy-2021-2030': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'dq-competencies': 'https://images.unsplash.com/photo-1557800636-23f87b1063e4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'agile-6xd-products': 'https://images.unsplash.com/photo-1553877522-25bcdc54f2de?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'product-strategy-overview': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'solutions-strategy-framework': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'product-roadmap-planning': 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  // Domain-based defaults
  guidelines: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  blueprints: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  testimonials: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  default: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
}

function getImageForGuide(guide) {
  const domain = (guide.domain || '').toLowerCase()
  const slug = guide.slug || ''
  
  // Check strategy-specific images first
  if (domain.includes('strategy') && imageMap.strategy[slug]) {
    return imageMap.strategy[slug]
  }
  
  // Check domain-based images
  if (domain.includes('guideline')) {
    return imageMap.guidelines
  }
  if (domain.includes('blueprint')) {
    return imageMap.blueprints
  }
  if (domain.includes('testimonial')) {
    return imageMap.testimonials
  }
  if (domain.includes('strategy')) {
    return 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
  
  return imageMap.default
}

async function ensureAllGuidesHaveImages() {
  console.log('🖼️  Ensuring ALL guides have images...\n')
  
  // Get ALL guides regardless of status
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
  
  console.log(`📊 Total guides found: ${allGuides.length}\n`)
  
  const needsImage = allGuides.filter(g => {
    const img = g.hero_image_url
    return !img || img.trim().length === 0 || !img.startsWith('http')
  })
  
  if (needsImage.length === 0) {
    console.log('✅ All guides already have valid images!')
    console.log(`\n📊 Summary:`)
    console.log(`   Total guides: ${allGuides.length}`)
    console.log(`   All have images: ✅`)
    return
  }
  
  console.log(`❌ Found ${needsImage.length} guide(s) that need images:\n`)
  const byStatus = {}
  needsImage.forEach(guide => {
    const status = guide.status || 'Unknown'
    if (!byStatus[status]) byStatus[status] = []
    byStatus[status].push(guide)
  })
  
  Object.keys(byStatus).sort().forEach(status => {
    console.log(`\n📁 Status: ${status} (${byStatus[status].length} guides):`)
    byStatus[status].forEach((guide, index) => {
      console.log(`   ${index + 1}. ${guide.title} (${guide.slug}) - Domain: ${guide.domain || 'Unknown'}`)
    })
  })
  
  console.log(`\n🔄 Adding images to ${needsImage.length} guide(s)...\n`)
  
  let updatedCount = 0
  let errorCount = 0
  
  for (const guide of needsImage) {
    const imageUrl = getImageForGuide(guide)
    
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: imageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', guide.slug)
    
    if (updateError) {
      console.error(`❌ Error updating "${guide.title}":`, updateError.message)
      errorCount++
    } else {
      console.log(`✅ Added image to: "${guide.title}"`)
      updatedCount++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Total guides: ${allGuides.length}`)
  console.log(`   Needed images: ${needsImage.length}`)
  console.log(`   Updated: ${updatedCount}`)
  console.log(`   Errors: ${errorCount}`)
  console.log(`\n✅ Done! All guides now have images.`)
}

ensureAllGuidesHaveImages().catch(console.error)

