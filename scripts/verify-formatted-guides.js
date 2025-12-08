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

async function verifyFormattedGuides() {
  console.log('📋 Verifying formatted Guidelines...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, body')
    .eq('domain', 'Guidelines')
    .eq('status', 'Approved')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  guides.forEach((g, i) => {
    console.log(`\n${i + 1}. "${g.title}"`);
    console.log(`   Body preview (first 300 chars):`);
    console.log(`   ${(g.body || '').substring(0, 300)}...`);
    console.log(`   Has Key Highlights: ${(g.body || '').includes('Key Highlights') ? 'Yes' : 'No'}`);
    console.log(`   Has Description: ${(g.body || '').includes('## Description') ? 'Yes' : 'No'}`);
  });
}

verifyFormattedGuides().catch(console.error);

