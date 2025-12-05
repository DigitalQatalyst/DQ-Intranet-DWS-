import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function formatAIToolsBoxes() {
  console.log('🔄 Formatting AI Tools (Cursor and Windsurf) into outlined boxes...\n')
  
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
  
  // Create the AI Tools section with each tool in its own feature-box
  const aiToolsSection = `### AI Tools

DWS leverages cutting-edge AI-powered development tools to enhance productivity and code quality throughout the software development lifecycle.

<div class="feature-box">

#### Cursor

AI-powered code editor that provides intelligent code completion, refactoring, and assistance for faster development.

**Features:**

- Intelligent code completion and suggestions based on context
- Automated refactoring capabilities for code improvement
- Context-aware code generation from natural language descriptions
- Real-time error detection and automated fixes
- Multi-language support for various programming languages
- Code review assistance and best practice recommendations

**Integration Requirements:**

- IDE/Editor plugin installation
- API key configuration
- Workspace settings configuration
- Team access management

**Best Practices:**

- Use for code completion and suggestions
- Leverage for code refactoring tasks
- Utilize for generating boilerplate code
- Review AI suggestions before accepting
- Customize prompts for project-specific patterns

</div>

<div class="feature-box">

#### Windsurf

AI-integrated development environment offering advanced code generation, analysis, and optimization capabilities.

**Features:**

- Advanced code generation from natural language descriptions
- Code analysis and optimization suggestions
- Intelligent debugging assistance and error resolution
- Performance optimization recommendations
- Integration with development workflows and CI/CD pipelines
- Team collaboration features

**Integration Requirements:**

- Development environment setup
- API configuration and authentication
- Project workspace initialization
- Team workspace configuration

**Best Practices:**

- Use for complex code generation tasks
- Leverage for code analysis and optimization
- Utilize for debugging assistance
- Review generated code thoroughly
- Integrate with version control systems

</div>`
  
  // Find the AI Tools section and replace it
  const aiToolsRegex = /### AI Tools[\s\S]*?(?=\n## |\n### |$)/i
  
  if (aiToolsRegex.test(newBody)) {
    // Replace the existing AI Tools section
    newBody = newBody.replace(aiToolsRegex, aiToolsSection.trim())
    console.log('✅ Found and replaced AI Tools section')
  } else {
    // If AI Tools section not found, try to find where to insert it (after Features)
    const featuresRegex = /(## Features[\s\S]*?)(?=\n## |\n### |$)/i
    
    if (featuresRegex.test(newBody)) {
      // Insert AI Tools section after Features
      newBody = newBody.replace(featuresRegex, '$1\n\n' + aiToolsSection.trim() + '\n\n')
      console.log('✅ Added AI Tools section after Features')
    } else {
      // Add at the end
      newBody = newBody + '\n\n' + aiToolsSection.trim()
      console.log('✅ Added AI Tools section at the end')
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
    console.log('✅ Successfully formatted AI Tools section!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log('\n✅ Cursor and Windsurf are now each in their own outlined boxes.')
  }
}

formatAIToolsBoxes().catch(console.error)


