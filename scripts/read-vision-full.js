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
    .eq('slug', 'dq-vision-and-mission')
    .single()
  
  if (error) {
    console.error(error)
    return
  }
  
  console.log(data.body)
}

readFull().catch(console.error)


