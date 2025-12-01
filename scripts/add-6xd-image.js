import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function add6xDImage() {
  console.log('🔄 Adding image to Agile 6xD (Products)...\n')
  
  // Image URL for Agile 6xD Products - using a product/roadmap related image
  const imageUrl = 'https://images.unsplash.com/photo-1553877522-25bcdc54f2de?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  
  const { data, error } = await supabase
    .from('guides')
    .update({
      hero_image_url: imageUrl,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'agile-6xd-products')
    .select('title, slug, hero_image_url')
    .single()
  
  if (error) {
    console.error('❌ Error updating:', error.message)
    return
  }
  
  console.log(`✅ Successfully updated: ${data.title} (${data.slug})`)
  console.log(`✅ Image URL: ${data.hero_image_url}`)
}

add6xDImage().catch(console.error)


