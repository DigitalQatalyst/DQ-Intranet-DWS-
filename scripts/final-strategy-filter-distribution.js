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

async function finalDistribution() {
  console.log('🔄 Final Strategy filter distribution...\n');

  // Get all Strategy guides
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, unit, location')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  // Target distribution - ensure each filter has at least one guide
  const targetDistribution = {
    units: {
      'Stories': 'DQ Products',
      'Products': 'Agile 6xD (Products)',
      'Solutions': 'DQ Competencies',
      'SecDevOps': 'DQ Journey',
      'Finance': 'DQ Beliefs',
      'Deals': 'DQ Vision and Mission',
      'DQ Delivery (Accounts)': 'DQ Strategy 2021-2030',
      'DQ Delivery (Deploys)': 'DQ Products',
      'DQ Delivery (Designs)': 'DQ Journey',
      'Intelligence': 'DQ Strategy 2021-2030'
    },
    locations: {
      'DXB': 'DQ Products',
      'KSA': 'DQ Competencies',
      'NBO': 'DQ Beliefs'
    }
  };

  console.log('🔄 Updating units and locations...\n');

  // Update units
  for (const [unit, guideTitle] of Object.entries(targetDistribution.units)) {
    const guide = allGuides.find(g => g.title === guideTitle);
    if (!guide) {
      console.log(`⚠️  Guide "${guideTitle}" not found for unit ${unit}`);
      continue;
    }

    const currentUnit = guide.unit || '';
    if (currentUnit.toLowerCase() !== unit.toLowerCase()) {
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
    } else {
      console.log(`✓ "${guide.title}" already in Unit: ${unit}`);
    }
  }

  // Update locations
  console.log(`\n`);
  for (const [location, guideTitle] of Object.entries(targetDistribution.locations)) {
    const guide = allGuides.find(g => g.title === guideTitle);
    if (!guide) {
      console.log(`⚠️  Guide "${guideTitle}" not found for location ${location}`);
      continue;
    }

    const currentLocation = guide.location || '';
    if (currentLocation.toLowerCase() !== location.toLowerCase()) {
      console.log(`Assigning "${guide.title}" to Location: ${location}`);
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
    } else {
      console.log(`✓ "${guide.title}" already in Location: ${location}`);
    }
  }

  // Final verification
  console.log(`\n\n📊 Final verification:\n`);
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
    console.log(`\n✅ SUCCESS! All Strategy filters now have at least one service for testing!`);
    console.log(`\n📊 Summary:`);
    console.log(`   Strategy Types: ${STRATEGY_TYPES.length} filters - all covered`);
    console.log(`   Frameworks: ${STRATEGY_FRAMEWORKS.length} filters - all covered`);
    console.log(`   Units: ${UNITS.length} filters - all covered`);
    console.log(`   Locations: ${LOCATIONS.length} filters - all covered`);
  } else {
    console.log(`\n⚠️  Some filters still need services.`);
  }
}

finalDistribution().catch(console.error);

