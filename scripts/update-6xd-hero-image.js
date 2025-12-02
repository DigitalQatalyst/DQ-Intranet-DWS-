import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function updateHeroImage() {
  // Use a collaboration/office image similar to the screenshot
  const heroImageUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  
  const { data, error } = await supabase
    .from('guides')
    .update({
      hero_image_url: heroImageUrl,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'agile-6xd-products')
    .select('title, slug, hero_image_url')
    .single()
  
  if (error) {
    console.error('❌ Error updating hero image:', error.message)
    return
  }
  
  console.log(`✅ Successfully updated hero image for: ${data.title}`)
  console.log(`✅ Hero image URL: ${data.hero_image_url}`)
}

updateHeroImage().catch(console.error)


