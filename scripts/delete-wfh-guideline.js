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

async function deleteWFHGuideline() {
  console.log('🗑️  Deleting WFH Guidelines completely...\n');

  // Check if it exists first
  const { data: existing } = await supabase
    .from('guides')
    .select('id, slug, title')
    .eq('slug', 'dq-wfh-guidelines')
    .maybeSingle();

  if (!existing) {
    console.log('ℹ️  WFH Guidelines not found - already deleted or never existed');
    return;
  }

  console.log(`Found: ${existing.title} (ID: ${existing.id})`);

  // Delete the guide
  const { error: deleteError } = await supabase
    .from('guides')
    .delete()
    .eq('slug', 'dq-wfh-guidelines');

  if (deleteError) {
    console.error('❌ Error deleting guide:', deleteError);
    return;
  }

  console.log('✅ WFH Guidelines completely removed from database');
  
  // Verify deletion
  const { data: verify } = await supabase
    .from('guides')
    .select('id, slug, title')
    .eq('slug', 'dq-wfh-guidelines')
    .maybeSingle();

  if (!verify) {
    console.log('✅ Verified: WFH Guidelines no longer exists in database');
  } else {
    console.log('⚠️  Warning: Guide still exists after deletion attempt');
  }
}

deleteWFHGuideline().catch(console.error);


