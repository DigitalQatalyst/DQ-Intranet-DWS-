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

// Contextually relevant images based on what each service card actually offers
const contextuallyRelevantImages = {
  // DQ Vision (Purpose) - "To perfect life's transactions" - vision, purpose, forward-looking
  'dq-vision': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Vision/horizon
  
  // Vision & Mission - Strategic vision, DCO, DBP, mission goals
  'dq-vision-and-mission': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228fbb?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Strategic planning/vision
  
  // DQ Competencies (HoV) - House of Values, 3 mantras, 12 guiding values, culture
  'dq-competencies': 'https://images.unsplash.com/photo-1556761175-597af40f565e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team values/culture
  
  // HoV (House of Values) - Culture system, 3 mantras (Self-Development, Lean Working, Value Co-Creation)
  'dq-hov': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Team collaboration/values
  
  // Persona (Identity) - Purpose-driven, Perceptive, Proactive, Persevering, Precise traits
  'dq-persona': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Diverse professional team/identity
  
  // Agile TMS - Task Management System, sprints, daily check-ins, task management
  'dq-agile-tms': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Task management/planning board
  
  // Agile SoS (Governance) - System of Systems, governance model, 4 systems (SoG, SoQ, SoV, SoD)
  'dq-agile-sos': 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Governance/strategy board
  
  // Agile Flows (Value Streams) - 6 stages value chain, flow management, value streams
  'dq-agile-flows': 'https://images.unsplash.com/photo-1556073709-9fae23b835b2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Flow diagram/process visualization
  
  // Agile 6xD (Products) - 6 Digital Perspectives framework, transformation compass
  'dq-agile-6xd': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Product development/framework
  
  // DQ Products - Product offerings (DTMP, DTMI, DTO4T, DTMA, DTMB, TMaaS)
  'dq-products': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Product showcase/technology
  
  // GHC - Golden Honeycomb of Competencies, master framework, Framework of Frameworks
  'dq-ghc': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Framework/blueprint structure
};

async function assignContextuallyRelevantImages() {
  console.log('🎯 Assigning contextually relevant images based on actual service card content...\n');

  // Verify all images are unique
  const imageUrls = Object.values(contextuallyRelevantImages);
  const uniqueUrls = new Set(imageUrls);
  if (imageUrls.length !== uniqueUrls.size) {
    console.error('❌ ERROR: Some images are duplicated!');
    const duplicates = imageUrls.filter((url, index) => imageUrls.indexOf(url) !== index);
    console.error('   Duplicates:', duplicates);
    return;
  }

  console.log('✅ All images are unique\n');

  for (const [slug, imageUrl] of Object.entries(contextuallyRelevantImages)) {
    console.log(`📋 Processing: ${slug}`);
    
    try {
      const { data, error } = await supabase
        .from('guides')
        .update({
          hero_image_url: imageUrl,
          last_updated_at: new Date().toISOString()
        })
        .eq('slug', slug)
        .select('id, title, slug');

      if (error) {
        console.error(`❌ Error updating ${slug}:`, error.message);
        continue;
      }

      if (data && data.length > 0) {
        console.log(`✅ Updated: ${data[0].title}`);
        console.log(`   Image: ${imageUrl.substring(0, 60)}...`);
      } else {
        console.log(`⚠️  No guide found with slug: ${slug}`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${slug}:`, err);
    }
    
    console.log('');
  }

  console.log('✅ Done! All cards now have contextually relevant images.\n');
  console.log('📝 Image Themes (matching actual content):');
  console.log('   🎯 DQ Vision: Vision/horizon (perfecting life\'s transactions)');
  console.log('   📊 Vision & Mission: Strategic planning (DCO, DBP, mission)');
  console.log('   🏠 DQ Competencies: Team values/culture (House of Values)');
  console.log('   🤝 HoV: Team collaboration (3 mantras, 12 values)');
  console.log('   👤 Persona: Diverse professional team (identity traits)');
  console.log('   ✅ Agile TMS: Task management board (sprints, tasks)');
  console.log('   ⚖️  Agile SoS: Governance/strategy board (4 systems)');
  console.log('   🌊 Agile Flows: Flow diagram (6-stage value chain)');
  console.log('   🔄 Agile 6xD: Product development (6 perspectives)');
  console.log('   📦 DQ Products: Product showcase (DTMP, DTMI, etc.)');
  console.log('   🍯 GHC: Framework/blueprint (master framework)');
}

assignContextuallyRelevantImages().catch(console.error);

