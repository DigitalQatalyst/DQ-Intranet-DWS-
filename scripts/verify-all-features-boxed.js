import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const allFeaturesBoxed = `## Features

The DWS platform consists of 10 core feature categories, each providing specialized functionality for different aspects of the digital workspace.

<div class="feature-box">

### DWS Landing

The main entry point and navigation hub for the Digital Workspace platform.

**Components:**
- **Home**: Primary landing page providing access to all DWS features and services
- **Discover DQ**: Interactive exploration tool to discover DQ services, teams, and organizational capabilities
- **Scrum Master Space**: Dedicated workspace environment for Scrum Masters with specialized tools and resources
- **AI Working Space**: AI-powered workspace featuring intelligent automation and productivity enhancements

**Deployment Considerations:**
- Requires authentication integration
- Depends on navigation service configuration
- Supports role-based access control

</div>

<div class="feature-box">

### DQ Learning Center

Comprehensive learning and development platform for continuous professional growth.

**Components:**
- **Courses & Curricula**: Structured learning courses and comprehensive curriculum management system
- **Learning Tracks**: Guided learning paths and professional development tracks tailored to career progression
- **Reviews**: Learning content review and rating system for continuous improvement

**Deployment Considerations:**
- Integrates with LMS backend services
- Requires content management system
- Supports progress tracking and analytics

</div>

<div class="feature-box">

### DQ Services Center

Centralized hub for accessing DQ technology and business services.

**Components:**
- **Technology**: Technology services, solutions, and technical support resources
- **Business**: Business services, offerings, and strategic business solutions
- **Digital Worker**: Digital worker services, tools, and productivity applications

**Deployment Considerations:**
- Requires service catalog integration
- Supports service request workflows
- Implements service level agreements (SLAs)

</div>

<div class="feature-box">

### DQ Work Center

Activity management and tracking system for work execution and monitoring.

**Components:**
- **Activities - Sessions**: Work session management and tracking system
- **Activities - Tasks**: Comprehensive task management and tracking functionality
- **Activities - Trackers**: Activity tracking and monitoring tools for performance measurement

**Deployment Considerations:**
- Requires task management backend
- Supports real-time updates
- Implements notification systems

</div>

<div class="feature-box">

### DQ Work Directory

Organizational directory and structure management system.

**Components:**
- **Units**: Organizational units, departments, and structural hierarchy management
- **Positions**: Job positions, role definitions, and organizational structure
- **Associates**: Associate directory, profiles, and organizational network management

**Deployment Considerations:**
- Requires HR system integration
- Supports organizational chart visualization
- Implements directory synchronization

</div>

<div class="feature-box">

### DQ Media Center

Content management and communication platform for organizational information sharing.

**Components:**
- **News & Announcement**: Company news, announcements, and organizational communications
- **Jobs Opening**: Job openings, career opportunities, and recruitment portal
- **Blogs**: Company blogs, articles, and content publishing platform

**Deployment Considerations:**
- Requires content management system
- Supports rich text editing
- Implements content approval workflows

</div>

<div class="feature-box">

### DQ Work Communities

Collaboration and engagement platform for team interactions and community building.

**Components:**
- **Discussion**: Community discussion forums for knowledge sharing and collaboration
- **Pulse**: Community pulse, engagement metrics, and sentiment tracking
- **Events**: Community events, gatherings, and organizational activities management

**Deployment Considerations:**
- Requires real-time messaging infrastructure
- Supports file sharing and attachments
- Implements moderation tools

</div>

<div class="feature-box">

### DQ Knowledge Center

Centralized knowledge repository and documentation system.

**Components:**
- **Work Guide - Strategy**: Strategic guides, documentation, and strategic planning resources
- **Testimonials**: Client testimonials, case studies, and success stories
- **Work Guide - Guidelines**: Operational guidelines, best practices, and procedural documentation
- **Work Guide - Blueprints**: Blueprint templates, frameworks, and implementation guides
- **Resources**: Reference materials including Glossary and FAQs

**Deployment Considerations:**
- Requires document management system
- Supports search and indexing
- Implements version control

</div>

<div class="feature-box">

### DWS Transact Apps

Transaction processing and administrative application suite.

**Components:**
- **End User**: End-user transaction applications and user-facing transaction tools
- **Processing**: Transaction processing tools and backend processing systems
- **Administrative Tools**: Administrative and management tools for system administration

**Deployment Considerations:**
- Requires transaction processing backend
- Supports workflow automation
- Implements audit logging

</div>

<div class="feature-box">

### DQ Analytics Center

Analytics and reporting platform for data-driven decision making.

**Components:**
- **Market**: Market analytics, insights, and market intelligence reporting
- **Strategy**: Strategic analytics, strategic reporting, and strategic insights
- **Operational**: Operational analytics, metrics, and operational performance reporting

**Deployment Considerations:**
- Requires data warehouse integration
- Supports real-time analytics
- Implements data visualization

</div>`;

async function verifyAndUpdateFeatures() {
  console.log('Verifying and updating Features section to ensure all features are boxed...\n');

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
    
    const newBody = beforeFeatures + allFeaturesBoxed + '\n\n' + afterFeatures;
    
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
      console.log('✓ Features section verified and updated!');
      console.log('✓ All 10 features are now in their own boxes:');
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
    console.error('✗ Error updating Features section:', error.message);
  }

  console.log('\nDone!');
}

verifyAndUpdateFeatures();

