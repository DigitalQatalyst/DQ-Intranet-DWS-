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

async function fillLastMissingUnits() {
  console.log('🔄 Filling last missing units...\n');

  // Get all Strategy guides
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, unit')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  // Check what's missing
  const hasDeals = allGuides.some(g => (g.unit || '').toLowerCase() === 'deals');
  const hasAccounts = allGuides.some(g => (g.unit || '').toLowerCase().includes('accounts'));

  console.log(`Missing:`);
  console.log(`   Deals: ${hasDeals ? '✅' : '❌'}`);
  console.log(`   DQ Delivery (Accounts): ${hasAccounts ? '✅' : '❌'}`);

  if (hasDeals && hasAccounts) {
    console.log(`\n✅ All units are covered!`);
    return;
  }

  // Assign to missing units
  if (!hasDeals) {
    const guide = allGuides.find(g => g.title === 'DQ Beliefs') || allGuides[0];
    console.log(`\nAssigning "${guide.title}" to Unit: Deals`);
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        unit: 'Deals',
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);
    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated`);
    }
  }

  if (!hasAccounts) {
    const guide = allGuides.find(g => g.title === 'DQ Vision and Mission') || allGuides[1];
    console.log(`\nAssigning "${guide.title}" to Unit: DQ Delivery (Accounts)`);
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        unit: 'DQ Delivery (Accounts)',
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

fillLastMissingUnits().catch(console.error);

