import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function remove6xDOverview() {
  console.log('🔄 Removing overview section from Agile 6xD (Products)...\n')
  
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
  
  // Remove the entire overview section
  let newBody = current.body
  const overviewRegex = /## Overview[\s\S]*?(?=\n<div class="feature-box">|$)/i
  
  if (overviewRegex.test(newBody)) {
    newBody = newBody.replace(overviewRegex, '')
    console.log('✅ Removed overview section')
  } else {
    console.log('⚠️  Overview section not found')
  }
  
  // Clean up extra blank lines
  newBody = newBody.replace(/\n{3,}/g, '\n\n')
  newBody = newBody.trim()
  
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
  console.log('✅ Overview section completely removed!')
}

remove6xDOverview().catch(console.error)


