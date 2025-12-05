import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkGuides() {
  console.log('Checking current guides in database...\n')
  
  const { data, error } = await supabase
    .from('guides')
    .select('slug, title, domain, guide_type')
    .order('title')
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log(`Total guides: ${data.length}\n`)
  console.log('Current guides:')
  data.forEach((g, i) => {
    console.log(`${i + 1}. ${g.title}`)
    console.log(`   Slug: ${g.slug}`)
    console.log(`   Domain: ${g.domain || 'none'}`)
    console.log(`   Type: ${g.guide_type || 'none'}\n`)
  })
}

checkGuides()

