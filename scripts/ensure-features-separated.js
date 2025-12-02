import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const separatedFeatures = `## Features

The DWS platform consists of 10 core feature categories, each providing specialized functionality for different aspects of the digital workspace.

<div class="feature-box">

### DWS Landing

The main entry point and navigation hub for the Digital Workspace platform.

- **Home**: Primary landing page providing access to all DWS features and services
- **Discover DQ**: Interactive exploration tool to discover DQ services, teams, and organizational capabilities
- **Scrum Master Space**: Dedicated workspace environment for Scrum Masters with specialized tools and resources
- **AI Working Space**: AI-powered workspace featuring intelligent automation and productivity enhancements
- **Deployment Considerations**: Requires authentication integration, depends on navigation service configuration, supports role-based access control

</div>

<div class="feature-box">

### DQ Learning Center

Comprehensive learning and development platform for continuous professional growth.

- **Courses & Curricula**: Structured learning courses and comprehensive curriculum management system
- **Learning Tracks**: Guided learning paths and professional development tracks tailored to career progression
- **Reviews**: Learning content review and rating system for continuous improvement
- **Deployment Considerations**: Integrates with LMS backend services, requires content management system, supports progress tracking and analytics

</div>

<div class="feature-box">

### DQ Services Center

Centralized hub for accessing DQ technology and business services.

- **Technology**: Technology services, solutions, and technical support resources
- **Business**: Business services, offerings, and strategic business solutions
- **Digital Worker**: Digital worker services, tools, and productivity applications
- **Deployment Considerations**: Requires service catalog integration, supports service request workflows, implements service level agreements (SLAs)

</div>

<div class="feature-box">

### DQ Work Center

Activity management and tracking system for work execution and monitoring.

- **Activities - Sessions**: Work session management and tracking system
- **Activities - Tasks**: Comprehensive task management and tracking functionality
- **Activities - Trackers**: Activity tracking and monitoring tools for performance measurement
- **Deployment Considerations**: Requires task management backend, supports real-time updates, implements notification systems

</div>

<div class="feature-box">

### DQ Work Directory

Organizational directory and structure management system.

- **Units**: Organizational units, departments, and structural hierarchy management
- **Positions**: Job positions, role definitions, and organizational structure
- **Associates**: Associate directory, profiles, and organizational network management
- **Deployment Considerations**: Requires HR system integration, supports organizational chart visualization, implements directory synchronization

</div>

<div class="feature-box">

### DQ Media Center

Content management and communication platform for organizational information sharing.

- **News & Announcement**: Company news, announcements, and organizational communications
- **Jobs Opening**: Job openings, career opportunities, and recruitment portal
- **Blogs**: Company blogs, articles, and content publishing platform
- **Deployment Considerations**: Requires content management system, supports rich text editing, implements content approval workflows

</div>

<div class="feature-box">

### DQ Work Communities

Collaboration and engagement platform for team interactions and community building.

- **Discussion**: Community discussion forums for knowledge sharing and collaboration
- **Pulse**: Community pulse, engagement metrics, and sentiment tracking
- **Events**: Community events, gatherings, and organizational activities management
- **Deployment Considerations**: Requires real-time messaging infrastructure, supports file sharing and attachments, implements moderation tools

</div>

<div class="feature-box">

### DQ Knowledge Center

Centralized knowledge repository and documentation system.

- **Work Guide - Strategy**: Strategic guides, documentation, and strategic planning resources
- **Testimonials**: Client testimonials, case studies, and success stories
- **Work Guide - Guidelines**: Operational guidelines, best practices, and procedural documentation
- **Work Guide - Blueprints**: Blueprint templates, frameworks, and implementation guides
- **Resources**: Reference materials including Glossary and FAQs
- **Deployment Considerations**: Requires document management system, supports search and indexing, implements version control

</div>

<div class="feature-box">

### DWS Transact Apps

Transaction processing and administrative application suite.

- **End User**: End-user transaction applications and user-facing transaction tools
- **Processing**: Transaction processing tools and backend processing systems
- **Administrative Tools**: Administrative and management tools for system administration
- **Deployment Considerations**: Requires transaction processing backend, supports workflow automation, implements audit logging

</div>

<div class="feature-box">

### DQ Analytics Center

Analytics and reporting platform for data-driven decision making.

- **Market**: Market analytics, insights, and market intelligence reporting
- **Strategy**: Strategic analytics, strategic reporting, and strategic insights
- **Operational**: Operational analytics, metrics, and operational performance reporting
- **Deployment Considerations**: Requires data warehouse integration, supports real-time analytics, implements data visualization

</div>`;

async function ensureFeaturesSeparated() {
  console.log('Ensuring all features are in separate segments...\n');

  try {
    const { data: currentData, error: fetchError } = await supabase
      .from('guides')
      .select('body')
      .eq('slug', 'dws-blueprint')
      .single();

    if (fetchError) throw fetchError;

    const currentBody = currentData.body;
    const featuresStart = currentBody.indexOf('## Features');
    const featuresEnd = currentBody.indexOf('## AI Tools');
    
    if (featuresStart === -1 || featuresEnd === -1) {
      console.log('⚠ Could not find Features section boundaries');
      return;
    }
    
    const beforeFeatures = currentBody.substring(0, featuresStart);
    const afterFeatures = currentBody.substring(featuresEnd);
    
    const newBody = beforeFeatures + separatedFeatures + '\n\n' + afterFeatures;
    
    const { data, error } = await supabase
      .from('guides')
      .update({
        body: newBody,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', 'dws-blueprint')
      .select();

    if (error) throw error;

    if (data && data.length > 0) {
      console.log('✓ All features are now in separate segments!');
      console.log('✓ Each feature is wrapped in its own <div class="feature-box">');
      console.log('✓ Proper spacing between segments');
      console.log('\nFeatures:');
      console.log('  1. DWS Landing');
      console.log('  2. DQ Learning Center');
      console.log('  3. DQ Services Center');
      console.log('  4. DQ Work Center');
      console.log('  5. DQ Work Directory');
      console.log('  6. DQ Media Center');
      console.log('  7. DQ Work Communities');
      console.log('  8. DQ Knowledge Center');
      console.log('  9. DWS Transact Apps');
      console.log('  10. DQ Analytics Center');
    } else {
      console.log('⚠ No blueprint found with slug "dws-blueprint"');
    }
  } catch (error) {
    console.error('✗ Error ensuring features are separated:', error.message);
  }

  console.log('\nDone!');
}

ensureFeaturesSeparated();

