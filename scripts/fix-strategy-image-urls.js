import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Original images with full Unsplash URLs for better compatibility
const serviceImages = {
  'dq-journey': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-beliefs': 'https://images.unsplash.com/photo-1521737854947-0b219b6c2c94?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-strategy-2021-2030': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-competencies': 'https://images.unsplash.com/photo-1557800636-23f87b1063e4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  'agile-6xd-products': 'https://images.unsplash.com/photo-1553877522-25bcdc54f2de?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  'product-strategy-overview': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228fbb?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  'solutions-strategy-framework': 'https://images.unsplash.com/photo-1516321318469-88ce825ef878?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
  'product-roadmap-planning': 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3'
}

async function fixImageUrls() {
  console.log('🔧 Fixing strategy service image URLs...\n')
  
  let updated = 0
  let errors = 0
  
  for (const [slug, imageUrl] of Object.entries(serviceImages)) {
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
      console.log(`✅ Updated: "${data.title}"`)
      console.log(`   Image: ${data.hero_image_url?.substring(0, 70)}...`)
      updated++
    } else {
      console.log(`⚠️  Service not found: ${slug}`)
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Errors: ${errors}`)
  console.log(`\n✅ Done! Images should now display correctly.`)
  console.log(`\n💡 If images still don't show, try:`)
  console.log(`   1. Hard refresh the browser (Ctrl+F5 or Cmd+Shift+R)`)
  console.log(`   2. Clear browser cache`)
  console.log(`   3. Check browser console for image loading errors`)
}

fixImageUrls().catch(console.error)

