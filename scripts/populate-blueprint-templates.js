import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function getUniqueImage(title, index) {
  const hash = createHash('md5').update(`${title}-${index}`).digest('hex');
  const hashNum = parseInt(hash.substring(0, 8), 16);
  const photoIds = [
    '1552664730-d307ca884978', '1522071820081-009f0129c71c', '1551288049-bebda4e38f71',
    '1454165804606-c3d57bc86b40', '1460925895917-afdab827c52f', '1556742049-0cfed4f6a45d',
    '1500530855697-b586d89ba3ee', '1518085250887-2f903c200fee', '1554224155-6726b3ff858f',
    '1667372335937-d03be6fb0a9c', '1551288049-bebda4e38f71', '1454165804606-c3d57bc86b40',
  ];
  const photoId = photoIds[hashNum % photoIds.length];
  const uniqueParam = hash.substring(0, 8);
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}&t=${Date.now()}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const blueprintTemplates = [
  {
    title: 'High-Level Architecture Design Document',
    summary: 'Comprehensive template for documenting high-level system architecture, including system components, interactions, and design principles.',
    body: `# High-Level Architecture Design Document

## Overview
This document provides a template for creating high-level architecture design documents that outline the overall system structure, components, and design principles.

## Purpose
- Define the high-level system architecture
- Document major system components and their interactions
- Establish design principles and patterns
- Guide development teams in implementation

## Key Sections
1. **System Overview**: High-level description of the system
2. **Architecture Patterns**: Design patterns and architectural styles used
3. **Component Diagram**: Visual representation of system components
4. **Technology Stack**: Technologies and frameworks selected
5. **Integration Points**: External systems and integration methods
6. **Non-Functional Requirements**: Performance, scalability, security considerations

## Usage
Use this template when designing new systems or documenting existing architecture at a high level.`,
    guide_type: 'Template'
  },
  {
    title: 'Low-Level Architecture Design Document',
    summary: 'Detailed template for documenting low-level system design, including module specifications, data flows, and implementation details.',
    body: `# Low-Level Architecture Design Document

## Overview
This document provides a template for creating detailed low-level architecture design documents that specify module-level design, data structures, and implementation details.

## Purpose
- Define detailed module and component specifications
- Document data flows and processing logic
- Specify interfaces and APIs
- Guide developers in implementation

## Key Sections
1. **Module Design**: Detailed specifications for each module
2. **Data Structures**: Database schemas and data models
3. **API Specifications**: Interface definitions and contracts
4. **Algorithm Design**: Processing logic and workflows
5. **Error Handling**: Error scenarios and handling strategies
6. **Testing Strategy**: Unit and integration testing approaches

## Usage
Use this template when designing detailed module-level architecture and implementation specifications.`,
    guide_type: 'Template'
  },
  {
    title: 'Module Configuration Document',
    summary: 'Template for documenting module configuration settings, parameters, and deployment configurations.',
    body: `# Module Configuration Document

## Overview
This document provides a template for documenting module configuration settings, environment variables, and deployment parameters.

## Purpose
- Document all configuration parameters
- Specify environment-specific settings
- Define configuration validation rules
- Guide deployment and operations teams

## Key Sections
1. **Configuration Overview**: Purpose and scope of configurations
2. **Configuration Parameters**: List of all configurable parameters
3. **Environment Settings**: Development, staging, production configurations
4. **Validation Rules**: Parameter validation and constraints
5. **Default Values**: Default settings and their rationale
6. **Security Considerations**: Sensitive configuration handling

## Usage
Use this template when documenting module configurations for deployment and operations.`,
    guide_type: 'Template'
  },
  {
    title: 'Program Increment Planning Report',
    summary: 'Template for documenting Program Increment (PI) planning outcomes, including objectives, risks, and dependencies.',
    body: `# Program Increment Planning Report

## Overview
This document provides a template for documenting Program Increment planning sessions, outcomes, and commitments.

## Purpose
- Document PI planning objectives and outcomes
- Track team commitments and dependencies
- Identify risks and mitigation strategies
- Communicate planning results to stakeholders

## Key Sections
1. **PI Overview**: Program Increment goals and timeline
2. **Team Objectives**: Objectives for each team
3. **Dependencies**: Cross-team dependencies and coordination
4. **Risks and Impediments**: Identified risks and mitigation plans
5. **Capacity Planning**: Team capacity and allocation
6. **Stakeholder Communication**: Communication plan and updates

## Usage
Use this template after each Program Increment planning session to document outcomes and commitments.`,
    guide_type: 'Template'
  },
  {
    title: 'Release Readiness Report',
    summary: 'Template for assessing and documenting release readiness, including quality metrics, testing results, and go-live criteria.',
    body: `# Release Readiness Report

## Overview
This document provides a template for assessing and documenting release readiness before deployment to production.

## Purpose
- Assess release readiness across all dimensions
- Document quality metrics and testing results
- Validate go-live criteria
- Provide release decision support

## Key Sections
1. **Release Overview**: Release scope and objectives
2. **Quality Metrics**: Code quality, test coverage, performance metrics
3. **Testing Summary**: Test execution results and coverage
4. **Risk Assessment**: Identified risks and mitigation status
5. **Go-Live Criteria**: Criteria checklist and validation
6. **Deployment Plan**: Deployment steps and rollback procedures

## Usage
Use this template before each production release to assess readiness and make go-live decisions.`,
    guide_type: 'Template'
  },
  {
    title: 'Admin and User Guides',
    summary: 'Template for creating comprehensive admin and user documentation, including setup, configuration, and usage instructions.',
    body: `# Admin and User Guides

## Overview
This document provides a template for creating comprehensive guides for both administrators and end users.

## Purpose
- Document system administration procedures
- Provide user-facing documentation
- Guide setup and configuration processes
- Support training and onboarding

## Key Sections
1. **Getting Started**: Initial setup and installation
2. **Administration Guide**: Admin configuration and management
3. **User Guide**: End-user features and workflows
4. **Troubleshooting**: Common issues and solutions
5. **FAQs**: Frequently asked questions
6. **Appendices**: Reference materials and additional resources

## Usage
Use this template when creating documentation for system administrators and end users.`,
    guide_type: 'Template'
  },
  {
    title: 'Requirement Specification Report',
    summary: 'Template for documenting detailed requirements, including functional and non-functional requirements, use cases, and acceptance criteria.',
    body: `# Requirement Specification Report

## Overview
This document provides a template for documenting detailed system requirements, including functional and non-functional specifications.

## Purpose
- Document comprehensive system requirements
- Define functional and non-functional requirements
- Specify use cases and user stories
- Establish acceptance criteria

## Key Sections
1. **Requirements Overview**: Scope and purpose
2. **Functional Requirements**: Feature specifications and use cases
3. **Non-Functional Requirements**: Performance, security, usability requirements
4. **User Stories**: Detailed user stories with acceptance criteria
5. **Requirements Traceability**: Mapping to design and implementation
6. **Change Management**: Requirements change process

## Usage
Use this template when documenting detailed requirements for new features or systems.`,
    guide_type: 'Template'
  },
  {
    title: 'Test Execution Report',
    summary: 'Template for documenting test execution results, including test cases, results, defects, and quality metrics.',
    body: `# Test Execution Report

## Overview
This document provides a template for documenting test execution results, test coverage, and quality metrics.

## Purpose
- Document test execution results
- Track test coverage and quality metrics
- Report defects and their status
- Provide quality assessment

## Key Sections
1. **Test Overview**: Test scope and objectives
2. **Test Execution Summary**: Overall results and metrics
3. **Test Case Results**: Detailed test case execution results
4. **Defect Summary**: Defects found and their status
5. **Coverage Analysis**: Test coverage metrics
6. **Quality Assessment**: Overall quality assessment and recommendations

## Usage
Use this template after test execution cycles to document results and quality metrics.`,
    guide_type: 'Template'
  },
  {
    title: 'Business Requirement Document',
    summary: 'Template for documenting business requirements, including business objectives, stakeholder needs, and business rules.',
    body: `# Business Requirement Document

## Overview
This document provides a template for documenting business requirements, objectives, and stakeholder needs.

## Purpose
- Document business objectives and needs
- Capture stakeholder requirements
- Define business rules and constraints
- Align technical solutions with business goals

## Key Sections
1. **Business Overview**: Business context and objectives
2. **Stakeholder Analysis**: Key stakeholders and their needs
3. **Business Requirements**: High-level business requirements
4. **Business Rules**: Business rules and constraints
5. **Success Criteria**: Business success metrics
6. **Assumptions and Constraints**: Business assumptions and limitations

## Usage
Use this template when documenting business requirements for new initiatives or projects.`,
    guide_type: 'Template'
  },
  {
    title: 'Deployment Design Report',
    summary: 'Template for documenting deployment architecture, including infrastructure, deployment procedures, and operational considerations.',
    body: `# Deployment Design Report

## Overview
This document provides a template for documenting deployment architecture, infrastructure requirements, and deployment procedures.

## Purpose
- Document deployment architecture and infrastructure
- Specify deployment procedures and steps
- Define operational requirements
- Guide deployment and operations teams

## Key Sections
1. **Deployment Overview**: Deployment scope and objectives
2. **Infrastructure Design**: Infrastructure architecture and components
3. **Deployment Procedures**: Step-by-step deployment process
4. **Configuration Management**: Environment configurations
5. **Rollback Procedures**: Rollback strategy and procedures
6. **Operational Considerations**: Monitoring, logging, and maintenance

## Usage
Use this template when designing and documenting deployment architecture and procedures.`,
    guide_type: 'Template'
  }
];

async function populateBlueprintTemplates() {
  console.log('📝 Populating Blueprint document templates...\n');

  for (let i = 0; i < blueprintTemplates.length; i++) {
    const template = blueprintTemplates[i];
    const slug = slugify(template.title);
    
    console.log(`Creating: "${template.title}"...`);

    // Check if it already exists
    const { data: existing } = await supabase
      .from('guides')
      .select('id, title')
      .eq('slug', slug)
      .eq('domain', 'Blueprint')
      .eq('status', 'Approved')
      .maybeSingle();

    if (existing) {
      console.log(`   ⚠️  Already exists: ${existing.title} (ID: ${existing.id})`);
      console.log(`   Updating...`);
      
      const imageUrl = getUniqueImage(template.title, i);
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          title: template.title,
          summary: template.summary,
          body: template.body,
          guide_type: template.guide_type,
          hero_image_url: imageUrl,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error(`   ❌ Error updating: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated successfully`);
      }
      continue;
    }

    // Create new guide
    const imageUrl = getUniqueImage(template.title, i);
    const newGuide = {
      title: template.title,
      slug: slug,
      summary: template.summary,
      body: template.body,
      domain: 'Blueprint',
      guide_type: template.guide_type,
      hero_image_url: imageUrl,
      status: 'Approved',
      unit: 'Deploy'
    };

    const { data, error } = await supabase
      .from('guides')
      .insert(newGuide)
      .select();

    if (error) {
      console.error(`   ❌ Error creating: ${error.message}`);
    } else if (data && data.length > 0) {
      console.log(`   ✅ Created successfully (ID: ${data[0].id})`);
    }
    console.log('');
  }

  console.log('✅ Finished populating Blueprint templates!');
}

populateBlueprintTemplates().catch(console.error);

