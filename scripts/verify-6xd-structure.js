import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verifyStructure() {
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
  console.log(`Match: ${openBoxes === closeBoxes ? 'YES ✅' : 'NO ❌'}`)
  
  // Check structure
  const boxes = body.split('<div class="feature-box">')
  console.log(`\nTotal sections: ${boxes.length - 1}`)
  
  boxes.slice(1).forEach((box, i) => {
    const content = box.split('</div>')[0]
    const hasHeading = content.match(/^#+\s+/m)
    const heading = hasHeading ? hasHeading[0].trim() : 'No heading'
    console.log(`  Box ${i + 1}: ${heading.substring(0, 50)}`)
  })
}

verifyStructure().catch(console.error)


