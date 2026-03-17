import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateFeaturesAndAIToolsSections() {
  console.log('📝 Updating Features and AI Tools sections...\n');

  const slug = 'dws-blueprint';

  // Get current blueprint
  const { data: current, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', slug)
    .maybeSingle();

  if (fetchError) {
    console.error('❌ Error fetching blueprint:', fetchError.message);
    return;
  }

  if (!current || !current.body) {
    console.error('❌ DWS Blueprint not found');
    return;
  }

  // New Features section with overview and table
  const newFeaturesSection = `## Features

The DWS platform consists of 10 core feature categories, each providing specialized functionality for different aspects of the digital workspace. These features work together to create a comprehensive digital ecosystem that supports organizational transformation, collaboration, and growth. Each feature is designed with specific components and capabilities that address distinct organizational needs, from learning and development to analytics and transaction processing.

| Feature | Key Components | Primary Purpose |
|---|---|---|
| **DWS Landing** | Home Dashboard, Discover DQ, Scrum Master Space, AI Working Space | Central command center and navigation hub for the entire Digital Workspace platform, providing seamless access to all features and services |
| **DQ Learning Center** | Courses & Curricula, Learning Tracks, Reviews & Feedback | Comprehensive learning ecosystem for continuous professional growth, supporting structured learning paths and skill development |
| **DQ Services Center** | Technology Services, Business Services, Digital Worker Tools | Centralized service marketplace and hub for accessing DQ technology and business services |
| **DQ Work Center** | Activities - Sessions, Activities - Tasks, Activities - Trackers | Activity management and execution hub for work tracking, task management, and performance monitoring |
| **DQ Work Directory** | Units, Positions, Associates | Organizational intelligence and structure management system for navigating organizational hierarchy and finding colleagues |
| **DQ Media Center** | News & Announcements, Job Openings, Blogs | Organizational communication and content management platform for information sharing and engagement |
| **DQ Work Communities** | Discussion Forums, Pulse Metrics, Events Management | Collaboration and engagement platform for team interactions, knowledge sharing, and community building |
| **DQ Knowledge Center** | Work Guide - Strategy, Testimonials, Work Guide - Guidelines, Work Guide - Blueprints, Resources | Centralized knowledge repository and documentation system for accessing organizational knowledge and best practices |
| **DWS Transact Apps** | End User Applications, Processing Tools, Administrative Tools | Transaction processing suite for handling business transactions, workflows, and administrative operations |
| **DQ Analytics Center** | Market Analytics, Strategy Analytics, Operational Analytics | Data-driven decision making platform providing insights across market, strategy, and operational dimensions |`;

  // New AI Tools section with overview and table
  const newAIToolsSection = `## AI Tools

The DWS platform integrates cutting-edge AI-powered development tools that enhance productivity and code quality throughout the software development lifecycle. These intelligent assistants provide contextual understanding, predictive suggestions, and intelligent automation that adapt to project patterns and team workflows. By leveraging AI tools, development teams can accelerate development cycles, improve code quality, and maintain consistency across the codebase while reducing manual effort and cognitive load.

| Tool | Type | Description |
|---|---|---|
| **Cursor** | AI-Powered Code Editor | AI-powered code editor that transforms the coding experience by understanding context, learning from codebases, and providing intelligent suggestions. It offers context-aware code completion, automated refactoring, natural language code generation, and real-time error detection. The tool integrates seamlessly into development workflows with minimal configuration, automatically adapting to project structure and coding styles. |
| **Windsurf** | AI-Integrated Development Environment | AI-integrated development environment offering advanced code generation, analysis, and optimization capabilities. It provides comprehensive assistance from initial design through optimization and debugging, with intelligent code analysis, performance optimization recommendations, and CI/CD pipeline integration. The platform enables team collaboration by learning from coding patterns and creating shared knowledge across the organization. |`;

  let updatedBody = current.body;

  // Find and replace the Features section
  const featuresRegex = /## Features[\s\S]*?(?=\n## |$)/i;
  if (featuresRegex.test(updatedBody)) {
    updatedBody = updatedBody.replace(featuresRegex, newFeaturesSection);
    console.log('✅ Updated Features section');
  } else {
    console.error('❌ Features section not found in blueprint');
  }

  // Find and replace the AI Tools section (handle both ## and ###)
  const aiToolsRegex = /## AI Tools[\s\S]*?(?=\n## |$)/i;
  if (!aiToolsRegex.test(updatedBody)) {
    // Try with ###
    const aiToolsRegexAlt = /### AI Tools[\s\S]*?(?=\n## |\n### |$)/i;
    if (aiToolsRegexAlt.test(updatedBody)) {
      updatedBody = updatedBody.replace(aiToolsRegexAlt, newAIToolsSection);
      console.log('✅ Updated AI Tools section (### format)');
    } else {
      console.error('❌ AI Tools section not found in blueprint');
    }
  } else {
    updatedBody = updatedBody.replace(aiToolsRegex, newAIToolsSection);
    console.log('✅ Updated AI Tools section (## format)');
  }

  // Update the blueprint
  const { error: updateError } = await supabase
    .from('guides')
    .update({
      body: updatedBody,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', slug);

  if (updateError) {
    console.error('❌ Error updating blueprint:', updateError.message);
    return;
  }

  console.log('\n✅ Successfully updated Features and AI Tools sections!');
  console.log(`   Guide is now available at: /marketplace/guides/${slug}`);
  console.log('   Both sections now include overview and table format');
}

updateFeaturesAndAIToolsSections().catch(console.error);

