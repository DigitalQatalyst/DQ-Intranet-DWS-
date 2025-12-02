import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkDuplicates() {
  const { data, error } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'raid-guidelines')
    .single()
  
  if (error) {
    console.error(error)
    return
  }
  
  const body = data.body
  
  // Check for duplicate headings
  const headings = []
  const headingMatches = body.matchAll(/^##\s+(.+)$/gm)
  for (const match of headingMatches) {
    headings.push(match[1].trim())
  }
  
  console.log(`Total headings: ${headings.length}`)
  console.log('\nAll headings:')
  headings.forEach((h, i) => console.log(`${i + 1}. ${h}`))
  
  // Find duplicates
  const seen = new Set()
  const duplicates = []
  headings.forEach((h, i) => {
    if (seen.has(h)) {
      duplicates.push({ heading: h, index: i + 1 })
    } else {
      seen.add(h)
    }
  })
  
  if (duplicates.length > 0) {
    console.log('\n❌ DUPLICATE HEADINGS FOUND:')
    duplicates.forEach(d => console.log(`  - "${d.heading}" (appears at position ${d.index})`))
  } else {
    console.log('\n✅ No duplicate headings found')
  }
  
  // Check for duplicate content blocks
  const tiles = body.split('<div class="feature-box">')
  console.log(`\nTotal tiles: ${tiles.length - 1}`)
  
  // Check if any tile content is repeated
  const tileContents = tiles.slice(1).map(tile => {
    const content = tile.split('</div>')[0].trim()
    const heading = content.match(/^##\s+(.+)$/m)?.[1] || 'No heading'
    return { heading, content: content.substring(0, 200) }
  })
  
  console.log('\nTile contents:')
  tileContents.forEach((t, i) => {
    console.log(`\nTile ${i + 1}: ${t.heading}`)
    console.log(`  Preview: ${t.content.substring(0, 100)}...`)
  })
}

checkDuplicates().catch(console.error)


