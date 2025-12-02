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

async function fillRemainingFilters() {
  console.log('🔄 Filling remaining Strategy filters...\n');

  // Get all Strategy guides
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, unit, location')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  // Check what's still missing
  const missingUnits = [];
  const missingTypes = [];

  // Check if Stories has any guides
  const hasStories = allGuides.some(g => (g.unit || '').toLowerCase() === 'stories');
  if (!hasStories) {
    missingUnits.push('Stories');
  }

  // Check if Products has any guides
  const hasProducts = allGuides.some(g => (g.unit || '').toLowerCase() === 'products');
  if (!hasProducts) {
    missingUnits.push('Products');
  }

  // Check if Intelligence has any guides
  const hasIntelligence = allGuides.some(g => (g.unit || '').toLowerCase() === 'intelligence');
  if (!hasIntelligence) {
    missingUnits.push('Intelligence');
  }

  // Check if references type has any guides
  const hasReferences = allGuides.some(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    return subDomain.includes('references');
  });
  if (!hasReferences) {
    missingTypes.push('references');
  }

  console.log(`Missing:`);
  console.log(`   Units: ${missingUnits.join(', ')}`);
  console.log(`   Strategy Types: ${missingTypes.join(', ')}`);

  if (missingUnits.length === 0 && missingTypes.length === 0) {
    console.log(`\n✅ All filters are covered!`);
    return;
  }

  // Assign guides to missing filters
  console.log(`\n🔄 Assigning guides to missing filters...\n`);

  // Keep at least one guide in Stories
  if (missingUnits.includes('Stories')) {
    const guide = allGuides.find(g => g.title === 'DQ Products') || allGuides[0];
    console.log(`Assigning "${guide.title}" to Unit: Stories`);
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        unit: 'Stories',
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);
    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated`);
    }
  }

  // Assign to Products unit
  if (missingUnits.includes('Products')) {
    const guide = allGuides.find(g => g.title === 'Agile 6xD (Products)') || allGuides[1];
    console.log(`\nAssigning "${guide.title}" to Unit: Products`);
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        unit: 'Products',
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);
    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated`);
    }
  }

  // Assign to Intelligence unit
  if (missingUnits.includes('Intelligence')) {
    const guide = allGuides.find(g => g.title === 'DQ Strategy 2021-2030') || allGuides[2];
    console.log(`\nAssigning "${guide.title}" to Unit: Intelligence`);
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        unit: 'Intelligence',
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);
    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated`);
    }
  }

  // Assign to references type
  if (missingTypes.includes('references')) {
    const guide = allGuides.find(g => g.title === 'DQ Products') || allGuides[3];
    const currentSubDomain = guide.sub_domain || '';
    const newSubDomain = currentSubDomain ? `${currentSubDomain},references` : 'references';
    console.log(`\nAssigning "${guide.title}" to Strategy Type: references`);
    console.log(`   Old sub_domain: ${currentSubDomain || 'null'}`);
    console.log(`   New sub_domain: ${newSubDomain}`);
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
    console.log(`\n✅ All Strategy filters now have at least one service for testing!`);
  } else {
    console.log(`\n⚠️  Some filters still need services.`);
  }
}

fillRemainingFilters().catch(console.error);

