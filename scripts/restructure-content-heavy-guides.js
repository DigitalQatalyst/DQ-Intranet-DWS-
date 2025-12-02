import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Strategy: Group content logically, keep tables with their sections
async function restructureGuide(slug, title) {
  console.log(`\n🔄 Restructuring ${title}...`)
  
  const { data, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', slug)
    .single()
  
  if (fetchError) {
    console.error(`❌ Error fetching ${title}:`, fetchError.message)
    return
  }
  
  let body = data.body
  
  // Remove all feature-box divs to start fresh
  body = body.replace(/<div class="feature-box">/g, '')
  body = body.replace(/<\/div>/g, '')
  body = body.replace(/\n{3,}/g, '\n\n')
  
  // Remove duplicate title
  const titleMatch = body.match(/^#\s+.+$/m)
  const titleLine = titleMatch ? titleMatch[0] : `# ${title}`
  body = body.replace(/^#\s+.+$/m, '')
  
  // Split by major headings (##)
  const sections = body.split(/(?=^##\s+)/m).filter(s => s.trim())
  
  // Group sections logically
  const groupedTiles = []
  let currentGroup = []
  let currentGroupTitle = ''
  
  for (const section of sections) {
    const headingMatch = section.match(/^##\s+(.+)$/m)
    const heading = headingMatch ? headingMatch[1].trim() : ''
    const content = section.replace(/^##\s+.+$/m, '').trim()
    
    // If section has a table, it should be in its own tile
    if (content.includes('|') && content.split('\n').some(l => l.match(/^\|.*\|$/))) {
      // Save current group if any
      if (currentGroup.length > 0) {
        groupedTiles.push({
          title: currentGroupTitle || 'Overview',
          content: currentGroup.join('\n\n')
        })
        currentGroup = []
      }
      // Table section gets its own tile
      groupedTiles.push({
        title: heading,
        content: content
      })
    } else if (heading.toLowerCase().includes('introduction') || heading.toLowerCase().includes('overview')) {
      // Introduction/Overview gets its own tile
      if (currentGroup.length > 0) {
        groupedTiles.push({
          title: currentGroupTitle || 'Overview',
          content: currentGroup.join('\n\n')
        })
        currentGroup = []
      }
      groupedTiles.push({
        title: heading,
        content: content
      })
    } else {
      // Group related sections together
      if (currentGroup.length === 0) {
        currentGroupTitle = heading
      }
      currentGroup.push(`## ${heading}\n\n${content}`)
      
      // If group is getting too large (> 2000 chars), split it
      const groupContent = currentGroup.join('\n\n')
      if (groupContent.length > 2000) {
        groupedTiles.push({
          title: currentGroupTitle,
          content: currentGroup.slice(0, -1).join('\n\n')
        })
        currentGroup = [currentGroup[currentGroup.length - 1]]
        currentGroupTitle = heading
      }
    }
  }
  
  // Add remaining group
  if (currentGroup.length > 0) {
    groupedTiles.push({
      title: currentGroupTitle || 'Additional Information',
      content: currentGroup.join('\n\n')
    })
  }
  
  // Build new body with feature-box tiles
  const tiles = groupedTiles.map(group => {
    return `<div class="feature-box">\n\n## ${group.title}\n\n${group.content}\n\n</div>`
  })
  
  const newBody = `${titleLine}\n\n${tiles.join('\n\n')}`
  
  const { data: updated, error } = await supabase
    .from('guides')
    .update({
      body: newBody,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', slug)
    .select('title, slug')
    .single()
  
  if (error) {
    console.error(`❌ Error updating ${title}:`, error.message)
    return
  }
  
  const newTileCount = (newBody.match(/<div class="feature-box">/g) || []).length
  console.log(`✅ Restructured: ${updated.title}`)
  console.log(`✅ Reduced to ${newTileCount} logical tiles`)
  console.log(`✅ Tables preserved with their sections`)
}

async function restructureAll() {
  console.log('🔄 Restructuring content-heavy guides with best practices...\n')
  
  const guides = [
    { slug: 'dq-l24-working-rooms-guidelines', title: 'DQ L24 Working Rooms Guidelines' },
    { slug: 'raid-guidelines', title: 'DQ RAID Guidelines' }
  ]
  
  for (const guide of guides) {
    await restructureGuide(guide.slug, guide.title)
  }
  
  console.log('\n✅ All content-heavy guides restructured!')
  console.log('✅ Using best practices: fewer tiles, tables preserved, logical grouping')
}

restructureAll().catch(console.error)


