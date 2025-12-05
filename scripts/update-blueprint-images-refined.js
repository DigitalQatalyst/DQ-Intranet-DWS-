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

// More specific and relevant images for each service
const imageMapping = {
  'High-Level Architecture Design Document': {
    photoId: '1460925895917-afdab827c52f', // System architecture diagrams
    description: 'High-level system architecture and design'
  },
  'Low-Level Architecture Design Document': {
    photoId: '1551288049-bebda4e38f71', // Detailed technical diagrams
    description: 'Detailed technical architecture and code structure'
  },
  'Module Configuration Document': {
    photoId: '1554224155-6726b3ff858f', // Configuration files
    description: 'Configuration and settings management'
  },
  'Program Increment Planning Report': {
    photoId: '1522071820081-009f0129c71c', // Agile planning boards
    description: 'Agile planning and team collaboration'
  },
  'Release Readiness Report': {
    photoId: '1551288049-bebda4e38f71', // Quality dashboard (temporary - need better)
    description: 'Quality metrics and release assessment'
  },
  'Admin and User Guides': {
    photoId: '1515879218367-8466d910aaa4', // Documentation
    description: 'Documentation and user guides'
  },
  'Requirement Specification Report': {
    photoId: '1552664730-d307ca884978', // Requirements documents
    description: 'Requirements and specification documents'
  },
  'Test Execution Report': {
    photoId: '1518779578993-ec3579fee39f', // Testing and QA
    description: 'Testing and quality assurance'
  },
  'Business Requirement Document': {
    photoId: '1556761175-b413ae4e686c', // Business analysis
    description: 'Business requirements and analysis'
  },
  'Deployment Design Report': {
    photoId: '1519389950473-47ba0277781c', // Deployment infrastructure
    description: 'Deployment and infrastructure design'
  }
};

// Better image selection - using more specific Unsplash photo IDs
const refinedImageMapping = {
  'High-Level Architecture Design Document': {
    photoId: '1460925895917-afdab827c52f', // Architecture/system design
    description: 'System architecture and design diagrams'
  },
  'Low-Level Architecture Design Document': {
    photoId: '1551288049-bebda4e38f71', // Technical diagrams, code
    description: 'Detailed technical architecture'
  },
  'Module Configuration Document': {
    photoId: '1554224155-6726b3ff858f', // Configuration, settings
    description: 'Configuration management'
  },
  'Program Increment Planning Report': {
    photoId: '1522071820081-009f0129c71c', // Planning, collaboration
    description: 'Agile planning and collaboration'
  },
  'Release Readiness Report': {
    photoId: '1518770660439-4636190af475', // Quality, metrics, dashboard
    description: 'Quality metrics and release assessment'
  },
  'Admin and User Guides': {
    photoId: '1515879218367-8466d910aaa4', // Documentation, guides
    description: 'Documentation and guides'
  },
  'Requirement Specification Report': {
    photoId: '1552664730-d307ca884978', // Requirements, specs
    description: 'Requirements and specifications'
  },
  'Test Execution Report': {
    photoId: '1518779578993-ec3579fee39f', // Testing, QA
    description: 'Testing and quality assurance'
  },
  'Business Requirement Document': {
    photoId: '1556761175-b413ae4e686c', // Business, analysis
    description: 'Business requirements'
  },
  'Deployment Design Report': {
    photoId: '1519389950473-47ba0277781c', // Deployment, infrastructure
    description: 'Deployment and infrastructure'
  }
};

function getUniqueImageUrl(photoId, title) {
  const hash = createHash('md5').update(`${title}-${Date.now()}`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}&t=${Date.now()}`;
}

async function updateBlueprintImagesRefined() {
  console.log('🖼️  Updating Blueprint images with refined selections...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('domain', 'Blueprint')
    .eq('status', 'Approved')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!guides || guides.length === 0) {
    console.log('No guides found');
    return;
  }

  console.log(`Found ${guides.length} Blueprint guide(s)\n`);

  for (const guide of guides) {
    const mapping = refinedImageMapping[guide.title];
    
    if (!mapping) {
      console.log(`⚠️  No image mapping found for: "${guide.title}"`);
      continue;
    }

    const imageUrl = getUniqueImageUrl(mapping.photoId, guide.title);
    
    console.log(`Updating "${guide.title}"...`);
    console.log(`   Theme: ${mapping.description}`);
    console.log(`   Photo ID: ${mapping.photoId}`);
    
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: imageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated\n`);
    }
  }

  console.log('✅ Finished updating Blueprint images!');
}

updateBlueprintImagesRefined().catch(console.error);

