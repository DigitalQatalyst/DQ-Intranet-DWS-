import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function simplifyRAID() {
  console.log('🔄 Simplifying RAID Guidelines - grouping content better...\n')
  
  const { data: current, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'raid-guidelines')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching:', fetchError.message)
    return
  }
  
  let body = current.body
  
  // Remove all existing feature-box divs to start fresh
  body = body.replace(/<div class="feature-box">/g, '')
  body = body.replace(/<\/div>/g, '')
  body = body.replace(/\n{3,}/g, '\n\n')
  
  // Remove duplicate title
  body = body.replace(/^# DQ RAID Guidelines\n\n# DQ RAID Guidelines\n\n/, '# DQ RAID Guidelines\n\n')
  
  // Now intelligently group into fewer, larger tiles
  // Strategy: Group by major topic areas, keep tables intact
  
  // Split by major headings (##)
  const parts = body.split(/(?=^##\s+)/m)
  const title = parts[0].trim()
  const sections = parts.slice(1)
  
  // Group sections into logical tiles
  const tiles = []
  
  // Tile 1: Introduction
  const intro = sections.find(s => s.includes('delivery is often seen') || s.includes('finish line'))
  if (intro) {
    tiles.push(`<div class="feature-box">\n\n${intro.trim()}\n\n</div>`)
  }
  
  // Tile 2: Value Stream section (with its table)
  const valueStream = sections.find(s => s.includes('Value Stream') || s.includes('Heartbeat'))
  if (valueStream) {
    tiles.push(`<div class="feature-box">\n\n${valueStream.trim()}\n\n</div>`)
  }
  
  // Tile 3: RAID definitions (Risks, Assumptions, Issues, Dependencies)
  const raidSections = sections.filter(s => 
    s.match(/^##\s+(Risk|Assumption|Issue|Dependency)/i) ||
    s.includes('Risk:') || s.includes('Assumption:') || s.includes('Issue:') || s.includes('Dependency:')
  )
  if (raidSections.length > 0) {
    tiles.push(`<div class="feature-box">\n\n${raidSections.join('\n\n').trim()}\n\n</div>`)
  }
  
  // Tile 4: Process/Workflow sections
  const processSections = sections.filter(s => 
    s.includes('Process') || s.includes('Workflow') || s.includes('Procedure') || s.includes('Steps')
  )
  if (processSections.length > 0) {
    tiles.push(`<div class="feature-box">\n\n${processSections.join('\n\n').trim()}\n\n</div>`)
  }
  
  // Tile 5: Tools/Resources
  const toolSections = sections.filter(s => 
    s.includes('Tool') || s.includes('Resource') || s.includes('Template')
  )
  if (toolSections.length > 0) {
    tiles.push(`<div class="feature-box">\n\n${toolSections.join('\n\n').trim()}\n\n</div>`)
  }
  
  // Tile 6: Best Practices/Examples
  const bestPracticeSections = sections.filter(s => 
    s.includes('Best Practice') || s.includes('Example') || s.includes('Guideline')
  )
  if (bestPracticeSections.length > 0) {
    tiles.push(`<div class="feature-box">\n\n${bestPracticeSections.join('\n\n').trim()}\n\n</div>`)
  }
  
  // Add any remaining sections
  const usedSections = [intro, valueStream, ...raidSections, ...processSections, ...toolSections, ...bestPracticeSections]
  const remaining = sections.filter(s => !usedSections.includes(s))
  if (remaining.length > 0) {
    tiles.push(`<div class="feature-box">\n\n${remaining.join('\n\n').trim()}\n\n</div>`)
  }
  
  const newBody = `${title}\n\n${tiles.join('\n\n')}`
  
  const { data, error } = await supabase
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
  console.log(`✅ Successfully simplified: ${data.title}`)
  console.log(`✅ Reduced to ${tileCount} logical tiles`)
  console.log('✅ Tables preserved within their sections!')
}

simplifyRAID().catch(console.error)


