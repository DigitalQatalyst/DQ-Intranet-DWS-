import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Image for L24 Working Rooms - virtual collaboration/team workspace
const workingRoomsImage = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

async function updateL24WorkingRoomsImage() {
  console.log('🖼️  Updating DQ L24 Working Rooms Guidelines image...\n')
  
  const { data, error } = await supabase
    .from('guides')
    .update({ hero_image_url: workingRoomsImage })
    .eq('slug', 'dq-l24-working-rooms-guidelines')
    .select('title, hero_image_url')
    .single()
  
  if (error) {
    console.error('❌ Error:', error.message)
    return
  }
  
  console.log('✅ Successfully updated image for:', data.title)
  console.log('   New image URL:', data.hero_image_url)
  console.log('\n✅ Done! The DQ L24 Working Rooms Guidelines now has an image.')
}

updateL24WorkingRoomsImage().catch(console.error)

