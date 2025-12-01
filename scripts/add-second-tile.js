import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function addSecondTile() {
  console.log('🔄 Adding second tile (Digital Economy) after overview...\n')
  
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
  
  // Second tile - Digital Economy (DE)
  const secondTile = `<div class="feature-box">

### 1. Digital Economy (DE)

_Why should organisations change?_

Helps leaders understand shifts in market logic, customer behaviour, and value creation — identifying the forces that drive transformation.

</div>`
  
  // Add the second tile after the overview tile
  let newBody = current.body
  
  // Find where the overview tile ends
  const overviewEndRegex = /(<div class="feature-box">[\s\S]*?## Overview[\s\S]*?<\/div>)\s*/i
  if (overviewEndRegex.test(newBody)) {
    // Insert second tile after overview
    newBody = newBody.replace(overviewEndRegex, '$1\n\n' + secondTile)
    console.log('✅ Added second tile after overview')
  } else {
    // If overview not found, add at the end
    newBody = newBody + '\n\n' + secondTile
    console.log('✅ Added second tile at the end')
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
  console.log('✅ Second tile (Digital Economy) added!')
}

addSecondTile().catch(console.error)


