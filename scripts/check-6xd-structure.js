import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkStructure() {
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
  const featureBoxCount = (body.match(/<div class="feature-box">/g) || []).length
  const closingDivCount = (body.match(/<\/div>/g) || []).length
  
  console.log(`Feature boxes: ${featureBoxCount}`)
  console.log(`Closing divs: ${closingDivCount}`)
  console.log('\nStructure check:')
  console.log(body.substring(0, 500))
}

checkStructure().catch(console.error)


