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

async function assignToAllFilters() {
  console.log('🔄 Assigning Strategy services to all filters for testing...\n');

  // Get all Strategy guides
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, unit, location, domain')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${allGuides.length} Strategy guides\n`);

  // Check current coverage
  console.log('📊 Checking current filter coverage...\n');

  // Strategy Types coverage
  console.log('Strategy Types:');
  const typeCoverage = {};
  STRATEGY_TYPES.forEach(type => {
    const matching = allGuides.filter(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      return subDomain.includes(type) || 
             (type === '6xd' && subDomain.includes('digital-framework')) ||
             (type === 'ghc' && subDomain.includes('ghc') && !subDomain.includes('ghc-leader'));
    });
    typeCoverage[type] = matching.length;
    const status = matching.length > 0 ? '✅' : '❌';
    console.log(`   ${status} ${type}: ${matching.length} guides`);
  });

  // Framework coverage
  console.log('\nFrameworks:');
  const frameworkCoverage = {};
  STRATEGY_FRAMEWORKS.forEach(framework => {
    const matching = allGuides.filter(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      const domain = (g.domain || '').toLowerCase();
      const allText = `${subDomain} ${domain}`.toLowerCase();
      return allText.includes(framework.toLowerCase()) ||
             (framework === '6xd' && (allText.includes('6xd') || allText.includes('digital-framework'))) ||
             (framework === 'ghc' && allText.includes('ghc') && !allText.includes('ghc-leader')) ||
             (framework === 'ghc-leader' && allText.includes('ghc-leader')) ||
             (framework === 'testimonials-insights' && (allText.includes('testimonial') || allText.includes('insight')));
    });
    frameworkCoverage[framework] = matching.length;
    const status = matching.length > 0 ? '✅' : '❌';
    console.log(`   ${status} ${framework}: ${matching.length} guides`);
  });

  // Units coverage
  console.log('\nUnits:');
  const unitCoverage = {};
  UNITS.forEach(unit => {
    const matching = allGuides.filter(g => {
      const guideUnit = g.unit || '';
      return guideUnit.toLowerCase() === unit.toLowerCase();
    });
    unitCoverage[unit] = matching.length;
    const status = matching.length > 0 ? '✅' : '❌';
    console.log(`   ${status} ${unit}: ${matching.length} guides`);
  });

  // Locations coverage
  console.log('\nLocations:');
  const locationCoverage = {};
  LOCATIONS.forEach(location => {
    const matching = allGuides.filter(g => {
      const guideLocation = g.location || '';
      return guideLocation.toLowerCase() === location.toLowerCase();
    });
    locationCoverage[location] = matching.length;
    const status = matching.length > 0 ? '✅' : '❌';
    console.log(`   ${status} ${location}: ${matching.length} guides`);
  });

  // Identify empty filters
  const emptyTypes = STRATEGY_TYPES.filter(type => typeCoverage[type] === 0);
  const emptyFrameworks = STRATEGY_FRAMEWORKS.filter(fw => frameworkCoverage[fw] === 0);
  const emptyUnits = UNITS.filter(unit => unitCoverage[unit] === 0);
  const emptyLocations = LOCATIONS.filter(loc => locationCoverage[loc] === 0);

  console.log(`\n\n📋 Empty filters found:`);
  console.log(`   Strategy Types: ${emptyTypes.length} (${emptyTypes.join(', ')})`);
  console.log(`   Frameworks: ${emptyFrameworks.length} (${emptyFrameworks.join(', ')})`);
  console.log(`   Units: ${emptyUnits.length} (${emptyUnits.join(', ')})`);
  console.log(`   Locations: ${emptyLocations.length} (${emptyLocations.join(', ')})`);

  if (emptyTypes.length === 0 && emptyFrameworks.length === 0 && emptyUnits.length === 0 && emptyLocations.length === 0) {
    console.log(`\n✅ All filters already have services!`);
    return;
  }

  // Assign guides to empty filters
  console.log(`\n\n🔄 Assigning guides to empty filters...\n`);

  let updateCount = 0;

  // Assign to empty Strategy Types
  for (const type of emptyTypes) {
    // Find a guide that can be assigned
    const availableGuide = allGuides.find(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      // Don't use guides that are already assigned to other important categories
      return !subDomain.includes('journey') && !subDomain.includes('ghc');
    }) || allGuides[0];

    if (availableGuide) {
      const currentSubDomain = availableGuide.sub_domain || '';
      const newSubDomain = currentSubDomain ? `${currentSubDomain},${type}` : type;

      console.log(`Assigning "${availableGuide.title}" to Strategy Type: ${type}`);
      console.log(`   Old sub_domain: ${currentSubDomain || 'null'}`);
      console.log(`   New sub_domain: ${newSubDomain}`);

      const { error: updateError } = await supabase
        .from('guides')
        .update({
          sub_domain: newSubDomain,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', availableGuide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated`);
        updateCount++;
      }
    }
  }

  // Assign to empty Frameworks
  for (const framework of emptyFrameworks) {
    const availableGuide = allGuides.find(g => {
      const subDomain = (g.sub_domain || '').toLowerCase();
      return !subDomain.includes(framework);
    }) || allGuides[0];

    if (availableGuide) {
      const currentSubDomain = availableGuide.sub_domain || '';
      const newSubDomain = currentSubDomain ? `${currentSubDomain},${framework}` : framework;

      console.log(`\nAssigning "${availableGuide.title}" to Framework: ${framework}`);
      console.log(`   Old sub_domain: ${currentSubDomain || 'null'}`);
      console.log(`   New sub_domain: ${newSubDomain}`);

      const { error: updateError } = await supabase
        .from('guides')
        .update({
          sub_domain: newSubDomain,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', availableGuide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated`);
        updateCount++;
      }
    }
  }

  // Assign to empty Units
  for (const unit of emptyUnits) {
    // Find a guide that's not already assigned to this unit
    const availableGuide = allGuides.find(g => {
      const guideUnit = g.unit || '';
      return guideUnit.toLowerCase() !== unit.toLowerCase();
    }) || allGuides[0];

    if (availableGuide) {
      console.log(`\nAssigning "${availableGuide.title}" to Unit: ${unit}`);
      console.log(`   Old unit: ${availableGuide.unit || 'null'}`);
      console.log(`   New unit: ${unit}`);

      const { error: updateError } = await supabase
        .from('guides')
        .update({
          unit: unit,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', availableGuide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated`);
        updateCount++;
      }
    }
  }

  // Assign to empty Locations
  for (const location of emptyLocations) {
    const availableGuide = allGuides.find(g => {
      const guideLocation = g.location || '';
      return guideLocation.toLowerCase() !== location.toLowerCase();
    }) || allGuides[0];

    if (availableGuide) {
      console.log(`\nAssigning "${availableGuide.title}" to Location: ${location}`);
      console.log(`   Old location: ${availableGuide.location || 'null'}`);
      console.log(`   New location: ${location}`);

      const { error: updateError } = await supabase
        .from('guides')
        .update({
          location: location,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', availableGuide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated`);
        updateCount++;
      }
    }
  }

  console.log(`\n\n✅ Updated ${updateCount} guide(s) to fill empty filters.`);
  console.log(`\n💡 All Strategy filters should now have at least one service for testing.`);
}

assignToAllFilters().catch(console.error);

