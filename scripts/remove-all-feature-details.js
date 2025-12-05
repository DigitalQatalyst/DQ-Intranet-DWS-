import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeAllFeatureDetails() {
  console.log('🔄 Removing all detailed Components and Deployment Considerations from Feature Modules...\n')
  
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
  
  // Find the Feature Modules section
  const featureModulesMatch = newBody.match(/(### Feature Modules[\s\S]*?)(?=### AI Tools|##)/)
  
  if (!featureModulesMatch) {
    console.log('⚠️  Feature Modules section not found')
    return
  }
  
  // Replace with clean version - just the 10 numbered features with short descriptions
  const cleanFeaturesSection = `### Feature Modules

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
  
  // Replace the entire Feature Modules section
  newBody = newBody.replace(/(### Feature Modules[\s\S]*?)(?=### AI Tools|##)/, cleanFeaturesSection)
  
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
    console.log('✅ Successfully removed all detailed explanations!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log('\n✅ Feature Modules now shows only the 10 numbered features with short descriptions.')
    console.log('   All Components and Deployment Considerations sections have been removed.')
  }
}

removeAllFeatureDetails().catch(console.error)

