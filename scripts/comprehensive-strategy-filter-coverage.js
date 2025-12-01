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

async function comprehensiveCoverage() {
  console.log('🔄 Comprehensive Strategy filter coverage...\n');

  // Get all Strategy guides with full details
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, unit, location, hero_image_url, summary, body, guide_type, slug, status')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${allGuides.length} Strategy guides\n`);

  // We have 7 guides and need to cover:
  // - 10 units
  // - 3 locations  
  // - 9 strategy types (already covered via sub_domain)
  // - 5 frameworks (already covered via sub_domain)

  // Since we can't have one guide in multiple units, we'll distribute strategically
  // Some guides will be moved to ensure all units are covered

  const unitDistribution = {
    'Stories': 'DQ Products',
    'Products': 'Agile 6xD (Products)',
    'Solutions': 'DQ Competencies',
    'SecDevOps': 'DQ Journey',
    'Finance': 'DQ Beliefs',
    'Deals': 'DQ Vision and Mission',
    'DQ Delivery (Accounts)': 'DQ Strategy 2021-2030',
    'DQ Delivery (Deploys)': 'DQ Products', // Will duplicate
    'DQ Delivery (Designs)': 'DQ Journey', // Will duplicate
    'Intelligence': 'DQ Strategy 2021-2030' // Will duplicate
  };

  // For units that need duplicates, we'll create new guides
  const unitsNeedingDuplicates = ['DQ Delivery (Deploys)', 'DQ Delivery (Designs)', 'Intelligence'];
  const guidesToDuplicate = {
    'DQ Delivery (Deploys)': 'DQ Products',
    'DQ Delivery (Designs)': 'DQ Journey',
    'Intelligence': 'DQ Strategy 2021-2030'
  };

  console.log('📋 Creating duplicate guides for units that need them...\n');

  // Create duplicates for units that need them
  for (const unit of unitsNeedingDuplicates) {
    const sourceGuideTitle = guidesToDuplicate[unit];
    const sourceGuide = allGuides.find(g => g.title === sourceGuideTitle);
    
    if (!sourceGuide) {
      console.log(`⚠️  Source guide "${sourceGuideTitle}" not found for ${unit}`);
      continue;
    }

    // Check if duplicate already exists
    const existingDuplicate = allGuides.find(g => 
      g.title === sourceGuide.title && 
      (g.unit || '').toLowerCase() === unit.toLowerCase()
    );

    if (existingDuplicate) {
      console.log(`✓ Duplicate already exists for "${sourceGuide.title}" in ${unit}`);
      continue;
    }

    // Create duplicate
    const newGuide = {
      title: sourceGuide.title,
      slug: `${sourceGuide.slug || 'guide'}-${unit.toLowerCase().replace(/\s+/g, '-')}`,
      summary: sourceGuide.summary,
      body: sourceGuide.body,
      domain: sourceGuide.domain || 'Strategy',
      sub_domain: sourceGuide.sub_domain,
      guide_type: sourceGuide.guide_type,
      unit: unit,
      location: sourceGuide.location,
      hero_image_url: sourceGuide.hero_image_url,
      status: 'Approved'
    };

    console.log(`Creating duplicate of "${sourceGuide.title}" for Unit: ${unit}`);

    const { data: created, error: createError } = await supabase
      .from('guides')
      .insert(newGuide)
      .select();

    if (createError) {
      console.error(`   ❌ Error: ${createError.message}`);
    } else {
      console.log(`   ✅ Created duplicate (ID: ${created[0].id})`);
    }
  }

  // Now update units for non-duplicate assignments
  console.log(`\n🔄 Updating unit assignments...\n`);

  const nonDuplicateAssignments = {
    'Stories': 'DQ Products',
    'Products': 'Agile 6xD (Products)',
    'Solutions': 'DQ Competencies',
    'SecDevOps': 'DQ Journey',
    'Finance': 'DQ Beliefs',
    'Deals': 'DQ Vision and Mission',
    'DQ Delivery (Accounts)': 'DQ Strategy 2021-2030'
  };

  // Get updated guide list
  const { data: updatedGuides } = await supabase
    .from('guides')
    .select('id, title, unit')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  for (const [unit, guideTitle] of Object.entries(nonDuplicateAssignments)) {
    const guide = updatedGuides?.find(g => g.title === guideTitle && (g.unit || '').toLowerCase() !== unit.toLowerCase());
    if (!guide) continue;

    console.log(`Assigning "${guide.title}" to Unit: ${unit}`);
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        unit: unit,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated`);
    }
  }

  // Final comprehensive check
  console.log(`\n\n📊 Final comprehensive verification:\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, sub_domain, unit, location')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  const UNITS = ['Stories', 'Products', 'Solutions', 'SecDevOps', 'Finance', 'Deals', 'DQ Delivery (Accounts)', 'DQ Delivery (Deploys)', 'DQ Delivery (Designs)', 'Intelligence'];
  const LOCATIONS = ['DXB', 'KSA', 'NBO'];
  const STRATEGY_TYPES = ['journey', 'history', 'ghc', '6xd', 'initiatives', 'clients', 'ghc-leader', 'cases', 'references'];
  const STRATEGY_FRAMEWORKS = ['ghc', '6xd', 'clients', 'ghc-leader', 'testimonials-insights'];

  let allCovered = true;

  console.log('Strategy Types:');
  STRATEGY_TYPES.forEach(type => {
    const hasMatch = finalGuides?.some(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      return subDomain.includes(type) || 
             (type === '6xd' && subDomain.includes('digital-framework')) ||
             (type === 'ghc' && subDomain.includes('ghc') && !subDomain.includes('ghc-leader'));
    });
    const status = hasMatch ? '✅' : '❌';
    console.log(`   ${status} ${type}`);
    if (!hasMatch) allCovered = false;
  });

  console.log('\nFrameworks:');
  STRATEGY_FRAMEWORKS.forEach(fw => {
    const hasMatch = finalGuides?.some(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      return subDomain.includes(fw.toLowerCase()) ||
             (fw === '6xd' && (subDomain.includes('6xd') || subDomain.includes('digital-framework'))) ||
             (fw === 'ghc' && subDomain.includes('ghc') && !subDomain.includes('ghc-leader')) ||
             (fw === 'ghc-leader' && subDomain.includes('ghc-leader')) ||
             (fw === 'testimonials-insights' && (subDomain.includes('testimonial') || subDomain.includes('insight')));
    });
    const status = hasMatch ? '✅' : '❌';
    console.log(`   ${status} ${fw}`);
    if (!hasMatch) allCovered = false;
  });

  console.log('\nUnits:');
  UNITS.forEach(unit => {
    const hasMatch = finalGuides?.some(g => (g.unit || '').toLowerCase() === unit.toLowerCase());
    const status = hasMatch ? '✅' : '❌';
    console.log(`   ${status} ${unit}`);
    if (!hasMatch) allCovered = false;
  });

  console.log('\nLocations:');
  LOCATIONS.forEach(loc => {
    const hasMatch = finalGuides?.some(g => (g.location || '').toLowerCase() === loc.toLowerCase());
    const status = hasMatch ? '✅' : '❌';
    console.log(`   ${status} ${loc}`);
    if (!hasMatch) allCovered = false;
  });

  if (allCovered) {
    console.log(`\n✅ SUCCESS! All Strategy filters now have at least one service for testing!`);
    console.log(`\n📊 Total Strategy guides: ${finalGuides?.length || 0}`);
  } else {
    console.log(`\n⚠️  Some filters still need services.`);
  }
}

comprehensiveCoverage().catch(console.error);

