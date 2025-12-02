import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixRAIDGuidelines() {
  console.log('🔄 Fixing RAID Guidelines - preserving tables and reducing fragmentation...\n')
  
  // Get current content
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
  
  // Remove duplicate title
  body = body.replace(/^# DQ RAID Guidelines\n\n<div class="feature-box">\n\n\n\n# DQ RAID Guidelines\n\n/, '# DQ RAID Guidelines\n\n<div class="feature-box">\n\n')
  
  // Strategy: Keep tables WITH their section headings, don't split them
  // Group related content together in fewer, more meaningful tiles
  
  // Split by major sections but preserve tables
  const sections = []
  const lines = body.split('\n')
  let currentSection = { heading: '', content: [], hasTable: false }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Check if we're in a table
    if (line.includes('|') || line.match(/^\|.*\|$/)) {
      currentSection.hasTable = true
      currentSection.content.push(line)
      continue
    }
    
    // Check for major heading (## or ###)
    if (line.match(/^#{2,3}\s+/)) {
      // Save previous section if it has content
      if (currentSection.heading || currentSection.content.length > 0) {
        sections.push(currentSection)
      }
      currentSection = { heading: line, content: [], hasTable: false }
    } else {
      currentSection.content.push(line)
    }
  }
  
  // Add last section
  if (currentSection.heading || currentSection.content.length > 0) {
    sections.push(currentSection)
  }
  
  // Rebuild with better grouping - keep tables with their sections
  const title = '# DQ RAID Guidelines'
  const tiles = []
  
  // First tile: Introduction
  const introSection = sections.find(s => s.content.some(l => l.includes('delivery is often seen')))
  if (introSection) {
    tiles.push(`<div class="feature-box">\n\n${introSection.content.join('\n').trim()}\n\n</div>`)
  }
  
  // Group remaining sections - keep tables with their headings
  for (const section of sections) {
    if (section === introSection) continue
    
    const content = section.content.join('\n').trim()
    if (!content) continue
    
    // If section has a table, keep it together
    if (section.hasTable || content.includes('|')) {
      tiles.push(`<div class="feature-box">\n\n${section.heading}\n\n${content}\n\n</div>`)
    } else if (section.heading) {
      // Regular section
      tiles.push(`<div class="feature-box">\n\n${section.heading}\n\n${content}\n\n</div>`)
    }
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
  console.log(`✅ Successfully fixed: ${data.title}`)
  console.log(`✅ Reduced to ${tileCount} tiles (tables preserved)`)
  console.log('✅ Tables are now kept with their section headings!')
}

fixRAIDGuidelines().catch(console.error)


