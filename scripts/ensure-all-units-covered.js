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

async function ensureAllUnitsCovered() {
  console.log('🔄 Ensuring all units are covered...\n');

  // Get all Strategy guides
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, unit, location')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  const UNITS = ['Stories', 'Products', 'Solutions', 'SecDevOps', 'Finance', 'Deals', 'DQ Delivery (Accounts)', 'DQ Delivery (Deploys)', 'DQ Delivery (Designs)', 'Intelligence'];
  
  // Check current coverage
  const unitCoverage = {};
  UNITS.forEach(unit => {
    const matching = allGuides.filter(g => (g.unit || '').toLowerCase() === unit.toLowerCase());
    unitCoverage[unit] = matching.length;
  });

  console.log('Current unit coverage:\n');
  UNITS.forEach(unit => {
    const count = unitCoverage[unit];
    const status = count > 0 ? '✅' : '❌';
    console.log(`   ${status} ${unit}: ${count} guides`);
  });

  // Find missing units
  const missingUnits = UNITS.filter(unit => unitCoverage[unit] === 0);
  
  if (missingUnits.length === 0) {
    console.log(`\n✅ All units are covered!`);
    return;
  }

  console.log(`\n📋 Missing units: ${missingUnits.join(', ')}`);
  console.log(`\n🔄 Assigning guides to missing units...\n`);

  // Create a mapping that ensures all units are covered
  // We have 7 guides and 10 units, so some guides will be reassigned
  const unitAssignments = {
    'Stories': 'DQ Products',
    'Products': 'Agile 6xD (Products)',
    'Solutions': 'DQ Competencies',
    'SecDevOps': 'DQ Journey',
    'Finance': 'DQ Beliefs',
    'Deals': 'DQ Vision and Mission',
    'DQ Delivery (Accounts)': 'DQ Strategy 2021-2030',
    'DQ Delivery (Deploys)': 'DQ Products', // Can reuse
    'DQ Delivery (Designs)': 'DQ Journey', // Can reuse
    'Intelligence': 'DQ Strategy 2021-2030' // Can reuse
  };

  // Only update missing units
  for (const unit of missingUnits) {
    const guideTitle = unitAssignments[unit];
    const guide = allGuides.find(g => g.title === guideTitle);
    
    if (!guide) {
      console.log(`⚠️  Guide "${guideTitle}" not found for unit ${unit}`);
      continue;
    }

    console.log(`Assigning "${guide.title}" to Unit: ${unit}`);
    console.log(`   Current unit: ${guide.unit || 'null'}`);

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

  // Final verification
  console.log(`\n\n📊 Final verification:\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, unit, location')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  let allCovered = true;
  UNITS.forEach(unit => {
    const hasMatch = finalGuides?.some(g => (g.unit || '').toLowerCase() === unit.toLowerCase());
    const status = hasMatch ? '✅' : '❌';
    console.log(`   ${status} ${unit}`);
    if (!hasMatch) allCovered = false;
  });

  if (allCovered) {
    console.log(`\n✅ All units are now covered!`);
  } else {
    console.log(`\n⚠️  Some units still need services.`);
  }
}

ensureAllUnitsCovered().catch(console.error);

