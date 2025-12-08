import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function readFull() {
  const { data, error } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'raid-guidelines')
    .single()
  
  if (error) {
    console.error(error)
    return
  }
  
  // Count tiles and tables
  const tiles = (data.body.match(/<div class="feature-box">/g) || []).length
  const tables = (data.body.match(/\|.*\|/g) || []).length
  
  console.log(`Tiles: ${tiles}`)
  console.log(`Table rows: ${tables}`)
  console.log('\n=== Full Content ===\n')
  console.log(data.body)
}

readFull().catch(console.error)


