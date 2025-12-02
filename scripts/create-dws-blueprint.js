import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// DWS Blueprint content - comprehensive framework
const dwsBlueprint = {
  slug: 'dws-blueprint',
  title: 'DWS Blueprint',
  summary: 'Comprehensive framework for implementing and managing the Digital Workspace (DWS) platform. Covers architecture, deployment, configuration, and operational best practices.',
  body: `# DWS Blueprint

## Overview

The DWS (Digital Workspace) Blueprint is a comprehensive framework that defines a repeatable set of resources, patterns, and standards for implementing and managing the Digital Workspace platform. Just as a blueprint allows an engineer or architect to sketch a project's design parameters, the DWS Blueprint enables cloud architects and central information technology groups to define a consistent set of digital workspace components that implements and adheres to organizational standards, patterns, and requirements.

The DWS Blueprint makes it possible for development teams to rapidly build and deploy new workspace environments with confidence that they're building within organizational compliance, with a set of built-in components such as authentication, data management, and service integration to speed up development and delivery.

## What is the DWS Blueprint?

The DWS Blueprint is a declarative way to orchestrate the deployment and configuration of various workspace components and artifacts, including:

- Platform architecture and infrastructure
- Authentication and authorization systems
- Data management and storage
- Service integration patterns
- Security and compliance controls
- Monitoring and observability

The DWS Blueprint service is designed to provide a consistent, repeatable approach to deploying digital workspace solutions across different environments and use cases.

## Key Benefits

While standard documentation provides reference information, the DWS Blueprint provides:

- **Consistency**: Standardized deployment patterns across all environments
- **Speed**: Rapid deployment with pre-configured components
- **Compliance**: Built-in adherence to organizational standards
- **Scalability**: Patterns that scale with organizational growth
- **Maintainability**: Centralized management of workspace configurations

## Blueprint Components

A DWS Blueprint is composed of several key components, each serving a specific purpose in the overall workspace implementation.

| Component | Description |
|-----------|-------------|
| Architecture | Defines the overall structure and design of the workspace platform |
| Deployment | Specifies how components are deployed and configured |
| Configuration | Details the configuration parameters and settings |
| Integration | Describes how services connect and interact |
| Security | Outlines security controls and compliance requirements |
| Operations | Defines monitoring, maintenance, and operational procedures |

## Platform Features

The DWS platform includes the following key features:

- **DWS Landing (Home)**: Main entry point and navigation hub for the Digital Workspace platform
- **DQ Learning Center (Courses & Curricula)**: Access to structured learning courses and curriculum programs
- **DQ Learning Center (Learning Tracks)**: Guided learning paths for skill development
- **DQ Learning Center (Reviews)**: Review and track learning progress and achievements
- **DQ Services Center (Technology)**: Technology services and solutions marketplace
- **DQ Services Center (Business)**: Business services and offerings
- **DQ Service Center (Digital Worker)**: Digital worker services and tools
- **DQ Work Center (Activities - Sessions)**: Manage and participate in work sessions
- **DQ Work Center (Activities - projects / task)**: Track and manage projects and tasks
- **DQ Work Center (Activities - Trackers)**: Monitor progress with activity trackers

## Getting Started

To get started with the DWS Blueprint:

1. Review the architecture and component documentation
2. Understand the deployment patterns and requirements
3. Configure your environment according to the blueprint specifications
4. Deploy components following the defined patterns
5. Validate deployment against compliance requirements
6. Monitor and maintain according to operational procedures

## Support

For questions or support regarding the DWS Blueprint, please contact the DWS Platform Team.`,
  domain: 'blueprints',
  guide_type: 'Blueprint',
  function_area: 'Platform',
  status: 'Approved',
  complexity_level: 'Comprehensive',
  author_name: 'DWS Platform Team',
  author_org: 'Digital Qatalyst',
  hero_image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  last_updated_at: new Date().toISOString(),
  is_editors_pick: false,
  download_count: 0
}

async function createDWSBlueprint() {
  console.log('➕ Creating DWS Blueprint...\n')
  
  // Check if it already exists
  const { data: existing } = await supabase
    .from('guides')
    .select('id, title')
    .eq('slug', 'dws-blueprint')
    .single()
  
  if (existing) {
    console.log('⚠️  DWS Blueprint already exists. Updating instead...\n')
    
    const { error } = await supabase
      .from('guides')
      .update(dwsBlueprint)
      .eq('slug', 'dws-blueprint')
    
    if (error) {
      console.error('❌ Error updating:', error.message)
      return
    }
    
    console.log('✅ Successfully updated DWS Blueprint!')
  } else {
    const { data, error } = await supabase
      .from('guides')
      .insert(dwsBlueprint)
      .select('id, title')
      .single()
    
    if (error) {
      console.error('❌ Error creating:', error.message)
      return
    }
    
    console.log('✅ Successfully created DWS Blueprint!')
    console.log(`   ID: ${data.id}`)
    console.log(`   Title: ${data.title}`)
  }
  
  console.log('\n✅ Done! DWS Blueprint is now available.')
}

createDWSBlueprint().catch(console.error)

