import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verifyTiles() {
  const { data, error } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'agile-6xd-products')
    .single()
  
  if (error) {
    console.error(error)
    return
  }
  
  const body = data.body
  const openBoxes = (body.match(/<div class="feature-box">/g) || []).length
  const closeBoxes = (body.match(/<\/div>/g) || []).length
  
  console.log(`Opening feature-box divs: ${openBoxes}`)
  console.log(`Closing divs: ${closeBoxes}`)
  console.log(`\nFull body content:`)
  console.log(body)
}

verifyTiles().catch(console.error)


