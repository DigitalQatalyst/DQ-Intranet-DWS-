import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function updateJourneyImage() {
  // Use a different image - perhaps something related to journey/path/transformation
  const heroImageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  
  // Find the DQ Journey guide
  const { data: guides, error: searchError } = await supabase
    .from('guides')
    .select('slug, title, hero_image_url')
    .ilike('title', '%journey%')
  
  if (searchError) {
    console.error('❌ Error searching:', searchError.message)
    return
  }
  
  if (!guides || guides.length === 0) {
    console.log('❌ No guide found with "journey" in title')
    return
  }
  
  const guide = guides[0]
  console.log(`🔄 Updating hero image for: ${guide.title} (${guide.slug})`)
  
  const { data, error } = await supabase
    .from('guides')
    .update({
      hero_image_url: heroImageUrl,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', guide.slug)
    .select('title, slug, hero_image_url')
    .single()
  
  if (error) {
    console.error('❌ Error updating hero image:', error.message)
    return
  }
  
  console.log(`✅ Successfully updated hero image for: ${data.title}`)
  console.log(`✅ New hero image URL: ${data.hero_image_url}`)
}

updateJourneyImage().catch(console.error)


