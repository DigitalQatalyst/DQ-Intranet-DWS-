import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkBoxes() {
  const { data, error } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'dq-vision-and-mission')
    .single()
  
  if (error) {
    console.error(error)
    return
  }
  
  const body = data.body
  const boxes = body.split('<div class="feature-box">')
  
  console.log('Total boxes:', boxes.length - 1)
  console.log('\nFull content:')
  console.log(body)
  
  // Check for empty boxes
  boxes.slice(1).forEach((box, i) => {
    const content = box.split('</div>')[0].trim()
    const isEmpty = !content || content.length < 10
    console.log(`\nBox ${i + 1}: ${isEmpty ? 'EMPTY' : 'HAS CONTENT'} (${content.length} chars)`)
    if (isEmpty) {
      console.log('Content:', JSON.stringify(content))
    }
  })
}

checkBoxes().catch(console.error)


