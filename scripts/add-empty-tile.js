import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function addEmptyTile() {
  console.log('🔄 Adding empty tile after overview...\n')
  
  const { data: current, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'agile-6xd-products')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching guide:', fetchError.message)
    return
  }
  
  if (!current || !current.body) {
    console.log('⚠️  Guide not found or has no body')
    return
  }
  
  // Empty tile with no content
  const emptyTile = `<div class="feature-box">

</div>`
  
  // Add the empty tile after the overview tile
  let newBody = current.body
  
  // Find where the overview tile ends
  const overviewEndRegex = /(<div class="feature-box">[\s\S]*?## Overview[\s\S]*?<\/div>)\s*/i
  if (overviewEndRegex.test(newBody)) {
    // Insert empty tile after overview
    newBody = newBody.replace(overviewEndRegex, '$1\n\n' + emptyTile)
    console.log('✅ Added empty tile after overview')
  } else {
    // If overview not found, add at the end
    newBody = newBody + '\n\n' + emptyTile
    console.log('✅ Added empty tile at the end')
  }
  
  // Clean up extra blank lines
  newBody = newBody.replace(/\n{3,}/g, '\n\n')
  
  // Update the guide
  const { data, error } = await supabase
    .from('guides')
    .update({
      body: newBody,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'agile-6xd-products')
    .select('title, slug')
    .single()
  
  if (error) {
    console.error('❌ Error updating:', error.message)
    return
  }
  
  console.log(`✅ Successfully updated: ${data.title} (${data.slug})`)
  console.log('✅ Empty tile added!')
}

addEmptyTile().catch(console.error)


