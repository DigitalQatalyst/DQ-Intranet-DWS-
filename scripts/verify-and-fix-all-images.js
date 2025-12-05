import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Ensure all images use full Unsplash URLs with proper parameters
const imageMap = {
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
  guidelines: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  blueprints: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  testimonials: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  default: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
}

function getImageForGuide(guide) {
  const domain = (guide.domain || '').toLowerCase()
  const slug = guide.slug || ''
  
  if (domain.includes('strategy') && imageMap.strategy[slug]) {
    return imageMap.strategy[slug]
  }
  if (domain.includes('guideline')) return imageMap.guidelines
  if (domain.includes('blueprint')) return imageMap.blueprints
  if (domain.includes('testimonial')) return imageMap.testimonials
  if (domain.includes('strategy')) {
    return 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
  return imageMap.default
}

async function verifyAndFixAllImages() {
  console.log('🔍 Verifying and fixing all guide images...\n')
  
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('slug, title, domain, guide_type, hero_image_url, status')
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
  
  const needsUpdate = []
  
  for (const guide of allGuides) {
    const currentImg = guide.hero_image_url
    const expectedImg = getImageForGuide(guide)
    
    // Check if image is missing, invalid, or doesn't match expected
    if (!currentImg || 
        currentImg.trim().length === 0 || 
        !currentImg.startsWith('http') ||
        (guide.domain?.toLowerCase().includes('strategy') && imageMap.strategy[guide.slug] && currentImg !== expectedImg)) {
      needsUpdate.push({ guide, expectedImg })
    }
  }
  
  if (needsUpdate.length === 0) {
    console.log('✅ All guides have valid, properly formatted images!')
    return
  }
  
  console.log(`🔄 Updating ${needsUpdate.length} guide(s)...\n`)
  
  let updatedCount = 0
  let errorCount = 0
  
  for (const { guide, expectedImg } of needsUpdate) {
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: expectedImg,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', guide.slug)
    
    if (updateError) {
      console.error(`❌ Error updating "${guide.title}":`, updateError.message)
      errorCount++
    } else {
      console.log(`✅ Updated: "${guide.title}"`)
      updatedCount++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Total guides: ${allGuides.length}`)
  console.log(`   Updated: ${updatedCount}`)
  console.log(`   Errors: ${errorCount}`)
  console.log(`\n✅ Done!`)
}

verifyAndFixAllImages().catch(console.error)

