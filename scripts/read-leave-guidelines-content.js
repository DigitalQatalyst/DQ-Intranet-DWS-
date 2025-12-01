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

async function readLeaveGuidelinesContent() {
  console.log('📋 Reading Leave Guidelines content...\n');

  const { data: guide, error } = await supabase
    .from('guides')
    .select('id, title, body, summary')
    .eq('domain', 'Guidelines')
    .ilike('title', '%Leave Guidelines%')
    .eq('status', 'Approved')
    .maybeSingle();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!guide) {
    console.log('Leave Guidelines not found');
    return;
  }

  console.log(`Title: ${guide.title}`);
  console.log(`Summary: ${guide.summary}`);
  console.log(`\nBody Content:\n${guide.body}`);
}

readLeaveGuidelinesContent().catch(console.error);

