import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreLeaveGuidelinesAndDeleteBlueprints() {
  console.log('🔄 Restoring Leave Guidelines and deleting all Blueprints...\n');

  // Step 1: Find Leave Guidelines in Blueprint domain
  const { data: leaveGuide, error: findError } = await supabase
    .from('guides')
    .select('*')
    .eq('domain', 'Blueprint')
    .ilike('title', '%Leave Guidelines%')
    .eq('status', 'Approved')
    .maybeSingle();

  if (findError) {
    console.error('❌ Error finding Leave Guidelines:', findError);
    return;
  }

  if (!leaveGuide) {
    console.log('⚠️  Leave Guidelines not found in Blueprint domain');
    console.log('   Checking if it exists in other domains or was deleted...\n');
    
    // Check if it exists anywhere
    const { data: allLeaveGuides } = await supabase
      .from('guides')
      .select('id, title, domain, status')
      .ilike('title', '%Leave Guidelines%');
    
    if (allLeaveGuides && allLeaveGuides.length > 0) {
      console.log('Found Leave Guidelines in other locations:');
      allLeaveGuides.forEach(g => {
        console.log(`   - "${g.title}" (Domain: ${g.domain || 'null'}, Status: ${g.status})`);
      });
    } else {
      console.log('   Leave Guidelines not found anywhere. Need to recreate it.\n');
      // We'll need to recreate it - but first let's get all Blueprint guides
    }
  } else {
    console.log(`✓ Found Leave Guidelines in Blueprint: "${leaveGuide.title}" (ID: ${leaveGuide.id})\n`);
    
    // Move it to Guidelines domain
    console.log('Moving Leave Guidelines to Guidelines domain...');
    const { error: updateError } = await supabase
      .from('guides')
      .update({ domain: 'Guidelines' })
      .eq('id', leaveGuide.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
      return;
    }
    console.log('   ✅ Moved to Guidelines domain\n');
  }

  // Step 2: Get all Blueprint guides
  const { data: blueprintGuides, error: blueprintError } = await supabase
    .from('guides')
    .select('id, title')
    .eq('domain', 'Blueprint')
    .eq('status', 'Approved');

  if (blueprintError) {
    console.error('❌ Error finding Blueprint guides:', blueprintError);
    return;
  }

  if (!blueprintGuides || blueprintGuides.length === 0) {
    console.log('✅ No Blueprint guides found to delete.');
    return;
  }

  console.log(`🗑️  Deleting ${blueprintGuides.length} Blueprint guide(s)...\n`);
  
  for (const guide of blueprintGuides) {
    console.log(`Deleting "${guide.title}"...`);
    const { error: deleteError } = await supabase
      .from('guides')
      .delete()
      .eq('id', guide.id);

    if (deleteError) {
      console.error(`   ❌ Error: ${deleteError.message}`);
    } else {
      console.log(`   ✅ Deleted`);
    }
  }

  console.log(`\n✅ All Blueprint guides have been deleted.`);
  
  // Verify Leave Guidelines is in Guidelines
  const { data: verifyLeave } = await supabase
    .from('guides')
    .select('id, title, domain')
    .eq('domain', 'Guidelines')
    .ilike('title', '%Leave Guidelines%')
    .maybeSingle();

  if (verifyLeave) {
    console.log(`\n✅ Leave Guidelines is now in Guidelines domain.`);
  } else {
    console.log(`\n⚠️  Leave Guidelines not found in Guidelines domain. May need to recreate.`);
  }
}

restoreLeaveGuidelinesAndDeleteBlueprints().catch(console.error);

