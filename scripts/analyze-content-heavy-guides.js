import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function analyzeGuides() {
  const guides = [
    { slug: 'dq-l24-working-rooms-guidelines', title: 'L24 Working Rooms' },
    { slug: 'raid-guidelines', title: 'RAID Guidelines' }
  ]
  
  for (const guide of guides) {
    const { data, error } = await supabase
      .from('guides')
      .select('body')
      .eq('slug', guide.slug)
      .single()
    
    if (error) {
      console.error(`Error fetching ${guide.title}:`, error.message)
      continue
    }
    
    const body = data.body
    const tileCount = (body.match(/<div class="feature-box">/g) || []).length
    const tableCount = (body.match(/\|.*\|/g) || []).length / 3 // Approximate table count
    const headingCount = (body.match(/^##\s+/gm) || []).length
    
    console.log(`\n${guide.title}:`)
    console.log(`  Tiles: ${tileCount}`)
    console.log(`  Tables: ~${Math.round(tableCount)}`)
    console.log(`  Headings: ${headingCount}`)
    console.log(`  Avg content per tile: ${headingCount / tileCount}`)
  }
}

analyzeGuides().catch(console.error)


