import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Original images from the restore script
const originalImages = {
  'dq-journey': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&q=80',
  'dq-beliefs': 'https://images.unsplash.com/photo-1521737854947-0b219b6c2c94?w=800&h=400&fit=crop&q=80',
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&q=80',
  'dq-strategy-2021-2030': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop&q=80',
  'dq-competencies': 'https://images.unsplash.com/photo-1557800636-23f87b1063e4?w=800&h=400&fit=crop&q=80',
  'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&q=80',
  'agile-6xd-products': 'https://images.unsplash.com/photo-1553877522-25bcdc54f2de?w=800&h=400&fit=crop&q=80',
  'product-strategy-overview': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228fbb?w=800&h=400&fit=crop&q=80',
  'solutions-strategy-framework': 'https://images.unsplash.com/photo-1516321318469-88ce825ef878?w=800&h=400&fit=crop&q=80',
  'product-roadmap-planning': 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?w=800&h=400&fit=crop&q=80'
}

async function restoreOriginalImages() {
  console.log('🖼️  Restoring original images for strategy services...\n')
  
  let updated = 0
  let errors = 0
  
  for (const [slug, imageUrl] of Object.entries(originalImages)) {
    const { data, error } = await supabase
      .from('guides')
      .update({
        hero_image_url: imageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select('title, hero_image_url')
      .single()
    
    if (error) {
      console.error(`❌ Error updating "${slug}":`, error.message)
      errors++
    } else if (data) {
      console.log(`✅ Restored original image for: "${data.title}"`)
      console.log(`   Image: ${data.hero_image_url}`)
      updated++
    } else {
      console.log(`⚠️  Service not found: ${slug}`)
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Errors: ${errors}`)
  console.log(`\n✅ Done!`)
}

restoreOriginalImages().catch(console.error)

