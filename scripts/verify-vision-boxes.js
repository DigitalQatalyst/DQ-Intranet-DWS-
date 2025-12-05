import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verifyBoxes() {
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
  const boxes = (body.match(/<div class="feature-box">/g) || []).length
  console.log(`✅ Feature-box divs found: ${boxes}`)
  
  const sections = body.split('<div class="feature-box">')
  console.log(`\n📦 Box breakdown:`)
  sections.slice(1).forEach((section, i) => {
    const content = section.split('</div>')[0]
    const heading = content.match(/##\s+→\s+(.+)/)?.[1] || content.match(/##\s+(.+)/)?.[1] || 'No heading found'
    const hasContent = content.trim().length > 50
    console.log(`  Box ${i + 1}: ${heading.substring(0, 40)} ${hasContent ? '✅' : '❌ EMPTY'}`)
  })
  
  console.log(`\n✅ All ${boxes} boxes should render as distinct tiles!`)
}

verifyBoxes().catch(console.error)


