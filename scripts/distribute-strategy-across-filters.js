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

// Strategy filter options
const STRATEGY_TYPES = ['journey', 'history', 'ghc', '6xd', 'initiatives', 'clients', 'ghc-leader', 'cases', 'references'];
const STRATEGY_FRAMEWORKS = ['ghc', '6xd', 'clients', 'ghc-leader', 'testimonials-insights'];
const UNITS = ['Stories', 'Products', 'Solutions', 'SecDevOps', 'Finance', 'Deals', 'DQ Delivery (Accounts)', 'DQ Delivery (Deploys)', 'DQ Delivery (Designs)', 'Intelligence'];
const LOCATIONS = ['DXB', 'KSA', 'NBO'];

async function distributeAcrossFilters() {
  console.log('🔄 Distributing Strategy services across all filters...\n');

  // Get all Strategy guides
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, unit, location, domain, hero_image_url, summary, body, guide_type, slug, status')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${allGuides.length} Strategy guides\n`);

  // Check what's missing
  const missingTypes = [];
  const missingFrameworks = [];
  const missingUnits = [];
  const missingLocations = [];

  // Check Strategy Types
  STRATEGY_TYPES.forEach(type => {
    const hasMatch = allGuides.some(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      return subDomain.includes(type) || 
             (type === '6xd' && subDomain.includes('digital-framework')) ||
             (type === 'ghc' && subDomain.includes('ghc') && !subDomain.includes('ghc-leader'));
    });
    if (!hasMatch) missingTypes.push(type);
  });

  // Check Frameworks
  STRATEGY_FRAMEWORKS.forEach(fw => {
    const hasMatch = allGuides.some(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      const domain = (g.domain || '').toLowerCase();
      const allText = `${subDomain} ${domain}`.toLowerCase();
      return allText.includes(fw.toLowerCase()) ||
             (fw === '6xd' && (allText.includes('6xd') || allText.includes('digital-framework'))) ||
             (fw === 'ghc' && allText.includes('ghc') && !allText.includes('ghc-leader')) ||
             (fw === 'ghc-leader' && allText.includes('ghc-leader')) ||
             (fw === 'testimonials-insights' && (allText.includes('testimonial') || allText.includes('insight')));
    });
    if (!hasMatch) missingFrameworks.push(fw);
  });

  // Check Units
  UNITS.forEach(unit => {
    const hasMatch = allGuides.some(g => {
      const guideUnit = g.unit || '';
      return guideUnit.toLowerCase() === unit.toLowerCase();
    });
    if (!hasMatch) missingUnits.push(unit);
  });

  // Check Locations
  LOCATIONS.forEach(loc => {
    const hasMatch = allGuides.some(g => {
      const guideLoc = g.location || '';
      return guideLoc.toLowerCase() === loc.toLowerCase();
    });
    if (!hasMatch) missingLocations.push(loc);
  });

  console.log(`📋 Missing filters:`);
  console.log(`   Strategy Types: ${missingTypes.length} - ${missingTypes.join(', ')}`);
  console.log(`   Frameworks: ${missingFrameworks.length} - ${missingFrameworks.join(', ')}`);
  console.log(`   Units: ${missingUnits.length} - ${missingUnits.join(', ')}`);
  console.log(`   Locations: ${missingLocations.length} - ${missingLocations.join(', ')}`);

  if (missingTypes.length === 0 && missingFrameworks.length === 0 && missingUnits.length === 0 && missingLocations.length === 0) {
    console.log(`\n✅ All filters already have services!`);
    return;
  }

  // Strategy: Update existing guides to cover missing filters
  // We'll append to sub_domain and update unit/location as needed
  console.log(`\n\n🔄 Updating guides to cover all filters...\n`);

  let guideIndex = 0;
  const totalMissing = missingTypes.length + missingFrameworks.length + missingUnits.length + missingLocations.length;
  const guidesNeeded = Math.min(allGuides.length, totalMissing);

  // Assign missing Strategy Types
  for (let i = 0; i < missingTypes.length && i < allGuides.length; i++) {
    const guide = allGuides[i];
    const type = missingTypes[i];
    const currentSubDomain = guide.sub_domain || '';
    const newSubDomain = currentSubDomain ? `${currentSubDomain},${type}` : type;

    console.log(`Assigning "${guide.title}" to Strategy Type: ${type}`);
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        sub_domain: newSubDomain,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated`);
      // Update the guide object for next iterations
      guide.sub_domain = newSubDomain;
    }
  }

  // Assign missing Frameworks
  let frameworkIndex = 0;
  for (const framework of missingFrameworks) {
    const guide = allGuides[frameworkIndex % allGuides.length];
    const currentSubDomain = guide.sub_domain || '';
    const newSubDomain = currentSubDomain ? `${currentSubDomain},${framework}` : framework;

    console.log(`\nAssigning "${guide.title}" to Framework: ${framework}`);
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        sub_domain: newSubDomain,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated`);
      guide.sub_domain = newSubDomain;
    }
    frameworkIndex++;
  }

  // Assign missing Units - distribute across different guides
  for (let i = 0; i < missingUnits.length; i++) {
    const guide = allGuides[i % allGuides.length];
    const unit = missingUnits[i];

    console.log(`\nAssigning "${guide.title}" to Unit: ${unit}`);
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

  // Assign missing Locations - distribute across different guides
  for (let i = 0; i < missingLocations.length; i++) {
    const guide = allGuides[(i + 1) % allGuides.length]; // Use different guide than units
    const location = missingLocations[i];

    console.log(`\nAssigning "${guide.title}" to Location: ${location}`);
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        location: location,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated`);
    }
  }

  // Final verification
  console.log(`\n\n📊 Final verification...\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, sub_domain, unit, location')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  // Re-check coverage
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
      const allText = subDomain;
      return allText.includes(fw.toLowerCase()) ||
             (fw === '6xd' && (allText.includes('6xd') || allText.includes('digital-framework'))) ||
             (fw === 'ghc' && allText.includes('ghc') && !allText.includes('ghc-leader')) ||
             (fw === 'ghc-leader' && allText.includes('ghc-leader')) ||
             (fw === 'testimonials-insights' && (allText.includes('testimonial') || allText.includes('insight')));
    });
    const status = hasMatch ? '✅' : '❌';
    console.log(`   ${status} ${fw}`);
    if (!hasMatch) allCovered = false;
  });

  console.log('\nUnits:');
  UNITS.forEach(unit => {
    const hasMatch = finalGuides?.some(g => {
      const guideUnit = g.unit || '';
      return guideUnit.toLowerCase() === unit.toLowerCase();
    });
    const status = hasMatch ? '✅' : '❌';
    console.log(`   ${status} ${unit}`);
    if (!hasMatch) allCovered = false;
  });

  console.log('\nLocations:');
  LOCATIONS.forEach(loc => {
    const hasMatch = finalGuides?.some(g => {
      const guideLoc = g.location || '';
      return guideLoc.toLowerCase() === loc.toLowerCase();
    });
    const status = hasMatch ? '✅' : '❌';
    console.log(`   ${status} ${loc}`);
    if (!hasMatch) allCovered = false;
  });

  if (allCovered) {
    console.log(`\n✅ All Strategy filters now have at least one service!`);
  } else {
    console.log(`\n⚠️  Some filters still need services.`);
  }
}

distributeAcrossFilters().catch(console.error);

