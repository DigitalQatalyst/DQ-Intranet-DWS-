import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Unique image for Scrum Master Guidelines - different from Scrum Guidelines
// Using a team leadership/collaboration image
const uniqueImage = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

async function updateScrumMasterImage() {
  console.log('🖼️  Updating DQ Scrum Master Guidelines image...\n')
  
  const { data, error } = await supabase
    .from('guides')
    .update({ hero_image_url: uniqueImage })
    .eq('slug', 'dq-scrum-master-guidelines')
    .select('title, hero_image_url')
    .single()
  
  if (error) {
    console.error('❌ Error:', error.message)
    return
  }
  
  console.log('✅ Successfully updated image for:', data.title)
  console.log('   New image URL:', data.hero_image_url)
  console.log('\n✅ Done! The DQ Scrum Master Guidelines now has a unique image.')
}

updateScrumMasterImage().catch(console.error)

