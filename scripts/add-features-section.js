import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function addFeaturesSection() {
  console.log('🔄 Adding Features section above AI Tools...\n')
  
  // Get current blueprint
  const { data: current, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'dws-blueprint')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching blueprint:', fetchError.message)
    return
  }
  
  if (!current || !current.body) {
    console.log('⚠️  DWS Blueprint not found')
    return
  }
  
  let newBody = current.body
  
  // Create the Features section content
  const featuresSection = `## Features

The DWS platform consists of 10 core feature categories, each providing specialized functionality for different aspects of the digital workspace.

1. **DWS Landing**: Main entry point and navigation hub for the Digital Workspace platform, providing access to all DWS features and services.

2. **DQ Learning Center**: Comprehensive learning and development platform for continuous professional growth, including courses, curricula, learning tracks, and reviews.

3. **DQ Services Center**: Centralized hub for accessing DQ technology and business services, including technology solutions, business offerings, and digital worker tools.

4. **DQ Work Center**: Activity management and tracking system for work execution and monitoring, including sessions, tasks, and activity trackers.

5. **DQ Work Directory**: Organizational directory and structure management system for units, positions, and associates.

6. **DQ Media Center**: Content management and communication platform for organizational information sharing, including news, announcements, job openings, and blogs.

7. **DQ Work Communities**: Collaboration and engagement platform for team interactions and community building, including discussions, pulse metrics, and events.

8. **DQ Knowledge Center**: Centralized knowledge repository and documentation system, including strategic guides, testimonials, guidelines, blueprints, and resources.

9. **DWS Transact Apps**: Transaction processing and administrative application suite for end users, processing, and administrative tools.

10. **DQ Analytics Center**: Analytics and reporting platform for data-driven decision making, including market, strategy, and operational analytics.

`
  
  // Find where "### AI Tools" or "## AI Tools" appears and insert Features section before it
  const aiToolsRegex = /(### AI Tools|## AI Tools)/
  
  if (aiToolsRegex.test(newBody)) {
    // Insert Features section before AI Tools
    newBody = newBody.replace(aiToolsRegex, featuresSection + '$1')
  } else {
    // If AI Tools not found, try to find the first section after any intro and add it there
    // Or add it at the beginning if no sections found
    const firstSectionRegex = /(## |### )/
    if (firstSectionRegex.test(newBody)) {
      newBody = newBody.replace(firstSectionRegex, featuresSection + '$1')
    } else {
      // Add at the beginning
      newBody = featuresSection + newBody
    }
  }
  
  // Clean up any extra blank lines
  newBody = newBody.replace(/\n{3,}/g, '\n\n')
  
  // Update the blueprint
  const { data, error } = await supabase
    .from('guides')
    .update({
      body: newBody,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'dws-blueprint')
    .select('title, slug')
    .single()
  
  if (error) {
    console.error('❌ Error updating:', error.message)
    return
  }
  
  if (data) {
    console.log('✅ Successfully added Features section above AI Tools!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log('\n✅ Features section with 10 features has been added as a tile above AI Tools.')
  }
}

addFeaturesSection().catch(console.error)

