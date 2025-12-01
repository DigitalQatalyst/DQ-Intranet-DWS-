import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function addOverviewSection() {
  console.log('🔄 Adding Overview section above Features...\n')
  
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
  
  // Create the Overview section content
  const overviewSection = `## Overview

The DWS (Digital Workspace) Blueprint is a comprehensive framework that defines a repeatable set of resources, patterns, and standards for implementing and managing the Digital Workspace platform. Just as a blueprint allows an engineer or architect to sketch a project's design parameters, the DWS Blueprint enables cloud architects and central information technology groups to define a consistent set of digital workspace components that implements and adheres to organizational standards, patterns, and requirements.

The DWS Blueprint makes it possible for development teams to rapidly build and deploy new workspace environments with confidence that they're building within organizational compliance, with a set of built-in components such as authentication, data management, and service integration to speed up development and delivery.

`
  
  // Find where "## Features" appears and insert Overview section before it
  const featuresRegex = /(## Features)/
  
  if (featuresRegex.test(newBody)) {
    // Insert Overview section before Features
    newBody = newBody.replace(featuresRegex, overviewSection + '$1')
  } else {
    // If Features not found, add at the beginning
    newBody = overviewSection + newBody
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
    console.log('✅ Successfully added Overview section above Features!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log('\n✅ Overview section has been added as a tile above Features.')
  }
}

addOverviewSection().catch(console.error)

