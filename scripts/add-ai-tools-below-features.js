import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function addAIToolsBelowFeatures() {
  console.log('🔄 Adding AI Tools section below Features...\n')
  
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
  
  // Create the AI Tools section with exact content provided
  const aiToolsSection = `### AI Tools

DWS leverages cutting-edge AI-powered development tools to enhance productivity and code quality throughout the software development lifecycle.

#### Cursor

AI-powered code editor providing intelligent code completion, refactoring, and assistance for faster development.

**Key Features:**

- Intelligent code completion and suggestions
- Automated refactoring capabilities
- Context-aware code generation
- Real-time error detection and fixes
- Multi-language support

#### Windsurf

AI-integrated development environment offering advanced code generation, analysis, and optimization capabilities.

**Key Features:**

- Advanced code generation from natural language
- Code analysis and optimization suggestions
- Intelligent debugging assistance
- Performance optimization recommendations
- Integration with CI/CD pipelines

`
  
  // Find where "## Features" section ends and insert AI Tools before the next section
  const featuresRegex = /(## Features[\s\S]*?)(?=\n## |\n### |$)/
  
  if (featuresRegex.test(newBody)) {
    // Insert AI Tools section after Features
    newBody = newBody.replace(featuresRegex, '$1\n\n' + aiToolsSection.trim() + '\n\n')
  } else {
    // If Features not found, try to find Model Provider and insert before it
    const modelProviderRegex = /(### Model Provider|## Model Provider)/
    if (modelProviderRegex.test(newBody)) {
      newBody = newBody.replace(modelProviderRegex, aiToolsSection.trim() + '\n\n$1')
    } else {
      // Add at the end
      newBody = newBody + '\n\n' + aiToolsSection.trim()
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
    console.log('✅ Successfully added AI Tools section below Features!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log('\n✅ AI Tools tile has been created with Cursor and Windsurf.')
  }
}

addAIToolsBelowFeatures().catch(console.error)

