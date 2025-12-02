import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function compareStructures() {
  const { data: blueprint } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'dws-blueprint')
    .single()
  
  const { data: products } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'agile-6xd-products')
    .single()
  
  console.log('=== DWS Blueprint first feature-box ===')
  const bpFirst = blueprint.body.match(/<div class="feature-box">[\s\S]{1,300}/)
  console.log(bpFirst ? bpFirst[0] : 'Not found')
  
  console.log('\n=== 6xD Products first feature-box ===')
  const prodFirst = products.body.match(/<div class="feature-box">[\s\S]{1,300}/)
  console.log(prodFirst ? prodFirst[0] : 'Not found')
  
  console.log('\n=== Comparison ===')
  console.log('Blueprint format matches 6xD:', bpFirst && prodFirst && bpFirst[0].substring(0, 50) === prodFirst[0].substring(0, 50))
}

compareStructures().catch(console.error)


