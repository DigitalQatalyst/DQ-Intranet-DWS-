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

const GUIDES_TO_REMOVE = [
  'DQ Content Strategy',
  'Risk Management Policy'
];

async function removeSpecifiedGuides() {
  console.log('🗑️  Removing specified Strategy guides...\n');

  const { data: guides, error: fetchError } = await supabase
    .from('guides')
    .select('id, title, domain')
    .eq('status', 'Approved')
    .in('title', GUIDES_TO_REMOVE);

  if (fetchError) {
    console.error('❌ Error fetching guides:', fetchError);
    return;
  }

  if (!guides || guides.length === 0) {
    console.log('⚠️  No guides found with the specified titles.');
    return;
  }

  console.log(`Found ${guides.length} guide(s) to remove:\n`);

  for (const guide of guides) {
    console.log(`Deleting "${guide.title}" (ID: ${guide.id})...`);
    
    const { error: deleteError } = await supabase
      .from('guides')
      .delete()
      .eq('id', guide.id);

    if (deleteError) {
      console.error(`   ❌ Error: ${deleteError.message}`);
    } else {
      console.log(`   ✅ Deleted successfully`);
    }
  }

  // Verify removal
  console.log(`\n📊 Verifying removal...\n`);
  const { data: remainingGuides } = await supabase
    .from('guides')
    .select('id, title')
    .eq('status', 'Approved')
    .in('title', GUIDES_TO_REMOVE);

  if (remainingGuides && remainingGuides.length > 0) {
    console.log(`⚠️  ${remainingGuides.length} guide(s) still exist:`);
    remainingGuides.forEach(g => console.log(`   - ${g.title}`));
  } else {
    console.log(`✅ All specified guides have been removed.`);
  }

  // Show remaining Strategy guides count
  const { data: allStrategyGuides } = await supabase
    .from('guides')
    .select('id, title')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  console.log(`\n📊 Remaining Strategy guides: ${allStrategyGuides?.length || 0}`);
}

removeSpecifiedGuides().catch(console.error);

