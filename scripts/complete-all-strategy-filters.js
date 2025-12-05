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

async function completeAllFilters() {
  console.log('🔄 Completing all Strategy filters...\n');

  // Get all Strategy guides
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, unit')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${allGuides.length} Strategy guides:\n`);
  allGuides.forEach((g, i) => {
    console.log(`${i + 1}. ${g.title} - Unit: ${g.unit || 'null'}`);
  });

  // Missing units
  const missingUnits = ['SecDevOps', 'Finance', 'DQ Delivery (Deploys)'];
  
  // Available guides to assign (ones not yet assigned to these units)
  const availableGuides = allGuides.filter(g => {
    const unit = (g.unit || '').toLowerCase();
    return !missingUnits.some(mu => unit === mu.toLowerCase());
  });

  console.log(`\n📋 Missing units: ${missingUnits.join(', ')}`);
  console.log(`📋 Available guides: ${availableGuides.length}`);

  // Assign guides to missing units
  for (let i = 0; i < missingUnits.length && i < availableGuides.length; i++) {
    const guide = availableGuides[i];
    const unit = missingUnits[i];

    console.log(`\nAssigning "${guide.title}" to Unit: ${unit}`);
    console.log(`   Old unit: ${guide.unit || 'null'}`);

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

  // Final comprehensive verification
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
  let missingCount = 0;

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
    if (!hasMatch) {
      allCovered = false;
      missingCount++;
    }
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
    if (!hasMatch) {
      allCovered = false;
      missingCount++;
    }
  });

  console.log('\nUnits:');
  UNITS.forEach(unit => {
    const hasMatch = finalGuides?.some(g => {
      const guideUnit = g.unit || '';
      return guideUnit.toLowerCase() === unit.toLowerCase();
    });
    const status = hasMatch ? '✅' : '❌';
    console.log(`   ${status} ${unit}`);
    if (!hasMatch) {
      allCovered = false;
      missingCount++;
    }
  });

  console.log('\nLocations:');
  LOCATIONS.forEach(loc => {
    const hasMatch = finalGuides?.some(g => {
      const guideLoc = g.location || '';
      return guideLoc.toLowerCase() === loc.toLowerCase();
    });
    const status = hasMatch ? '✅' : '❌';
    console.log(`   ${status} ${loc}`);
    if (!hasMatch) {
      allCovered = false;
      missingCount++;
    }
  });

  if (allCovered) {
    console.log(`\n✅ SUCCESS! All ${STRATEGY_TYPES.length + STRATEGY_FRAMEWORKS.length + UNITS.length + LOCATIONS.length} Strategy filters now have at least one service for testing!`);
  } else {
    console.log(`\n⚠️  ${missingCount} filter(s) still need services.`);
  }
}

completeAllFilters().catch(console.error);

