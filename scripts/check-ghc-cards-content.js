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

async function checkGHCCardsContent() {
  console.log('🔍 Checking GHC service cards content...\n');

  const requiredCards = [
    'DQ Journey',
    'DQ Beliefs',
    'DQ Vision and Mission',
    'DQ Strategy 2021-2030',
    'DQ Competencies',
    'DQ Products'
  ];

  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, summary, body')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  for (const cardTitle of requiredCards) {
    const guide = (allGuides || []).find(g => g.title === cardTitle);
    
    if (guide) {
      console.log(`\n📋 ${guide.title}`);
      console.log(`   ID: ${guide.id}`);
      console.log(`   Summary: ${(guide.summary || '').substring(0, 100)}...`);
      console.log(`   Body length: ${(guide.body || '').length} characters`);
      console.log(`   Body preview: ${(guide.body || '').substring(0, 200)}...`);
    } else {
      console.log(`\n❌ ${cardTitle} - NOT FOUND`);
    }
  }
}

checkGHCCardsContent().catch(console.error);

