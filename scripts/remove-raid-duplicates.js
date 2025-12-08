import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeDuplicates() {
  console.log('🔄 Removing duplicate content from RAID Guidelines...\n')
  
  const { data, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'raid-guidelines')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching:', fetchError.message)
    return
  }
  
  let body = data.body
  
  // Remove all feature-box divs to start fresh
  body = body.replace(/<div class="feature-box">/g, '')
  body = body.replace(/<\/div>/g, '')
  body = body.replace(/\n{3,}/g, '\n\n')
  
  // Remove duplicate title
  body = body.replace(/^# DQ RAID Guidelines\n\n# DQ RAID Guidelines\n\n/, '# DQ RAID Guidelines\n\n')
  
  // Split by major headings (##)
  const parts = body.split(/(?=^##\s+)/m)
  const title = parts[0].trim()
  const sections = parts.slice(1)
  
  // Track which headings we've seen
  const seenHeadings = new Set()
  const uniqueSections = []
  
  for (const section of sections) {
    const headingMatch = section.match(/^##\s+(.+)$/m)
    if (headingMatch) {
      const heading = headingMatch[1].trim()
      
      // Only add if we haven't seen this heading before
      if (!seenHeadings.has(heading)) {
        seenHeadings.add(heading)
        uniqueSections.push(section.trim())
      } else {
        console.log(`  ⚠️  Removed duplicate: "${heading}"`)
      }
    } else {
      // Section without heading - add it
      uniqueSections.push(section.trim())
    }
  }
  
  // Rebuild with unique sections only, each in its own tile
  const tiles = uniqueSections.map(section => {
    return `<div class="feature-box">\n\n${section}\n\n</div>`
  })
  
  const newBody = `${title}\n\n${tiles.join('\n\n')}`
  
  const { data: updated, error } = await supabase
    .from('guides')
    .update({
      body: newBody,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'raid-guidelines')
    .select('title, slug')
    .single()
  
  if (error) {
    console.error('❌ Error updating:', error.message)
    return
  }
  
  const tileCount = (newBody.match(/<div class="feature-box">/g) || []).length
  const uniqueHeadings = seenHeadings.size
  
  console.log(`\n✅ Successfully removed duplicates: ${updated.title}`)
  console.log(`✅ Unique sections: ${uniqueHeadings}`)
  console.log(`✅ Total tiles: ${tileCount}`)
  console.log('✅ No more duplicate content!')
}

removeDuplicates().catch(console.error)


