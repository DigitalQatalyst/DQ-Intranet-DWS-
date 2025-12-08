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

async function readAllGuidelinesContent() {
  console.log('📋 Reading all Guidelines content...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, body, summary')
    .eq('domain', 'Guidelines')
    .eq('status', 'Approved')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!guides || guides.length === 0) {
    console.log('No guides found');
    return;
  }

  guides.forEach((g, i) => {
    console.log(`\n${i + 1}. "${g.title}"`);
    console.log(`   ID: ${g.id}`);
    console.log(`   Summary: ${g.summary || 'No summary'}`);
    console.log(`   Body length: ${(g.body || '').length} characters`);
    console.log(`   Body preview: ${(g.body || '').substring(0, 200)}...`);
  });
}

readAllGuidelinesContent().catch(console.error);

