import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeEmptyBlocks() {
  console.log('🔄 Removing empty blocks from DQ Vision and Mission...\n')
  
  const { data, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'dq-vision-and-mission')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching:', fetchError.message)
    return
  }
  
  let body = data.body
  
  // Remove empty feature-box divs
  body = body.replace(/<div class="feature-box">\s*<\/div>/g, '')
  body = body.replace(/<div class="feature-box">\s*\n\s*<\/div>/g, '')
  body = body.replace(/<div class="feature-box">\s*\n\s*\n\s*<\/div>/g, '')
  
  // Remove any feature-box with only whitespace
  body = body.replace(/<div class="feature-box">\s*<\/div>/g, '')
  
  // Clean up multiple consecutive newlines
  body = body.replace(/\n{3,}/g, '\n\n')
  
  const { data: updated, error: updateError } = await supabase
    .from('guides')
    .update({
      body: body,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'dq-vision-and-mission')
    .select('title, slug')
    .single()
  
  if (updateError) {
    console.error('❌ Error updating:', updateError.message)
    return
  }
  
  console.log(`✅ Successfully removed empty blocks from: ${updated.title}`)
  console.log('✅ Content cleaned!')
}

removeEmptyBlocks().catch(console.error)


