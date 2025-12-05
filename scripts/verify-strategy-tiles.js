import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verifyTiles() {
  const slugs = ['dq-vision-and-mission', 'agile-6xd-products', 'dq-competencies']
  
  for (const slug of slugs) {
    const { data, error } = await supabase
      .from('guides')
      .select('title, body')
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error(`Error: ${slug}`, error.message)
      continue
    }
    
    const body = data.body
    const featureBoxes = (body.match(/<div class="feature-box">/g) || []).length
    const numberedItems = (body.match(/### \d+\./g) || []).length
    
    console.log(`\n${data.title}:`)
    console.log(`  Feature boxes: ${featureBoxes}`)
    console.log(`  Numbered items: ${numberedItems}`)
    
    if (numberedItems > 0 && numberedItems !== featureBoxes - 1) {
      console.log(`  ⚠️  Warning: Numbered items don't match expected tile count`)
    } else {
      console.log(`  ✅ Structure looks correct`)
    }
  }
}

verifyTiles().catch(console.error)


