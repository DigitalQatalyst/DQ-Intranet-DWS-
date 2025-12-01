import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function readContent() {
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
    
    console.log(`\n=== ${data.title} ===`)
    console.log(data.body)
    console.log('\n---\n')
  }
}

readContent().catch(console.error)


