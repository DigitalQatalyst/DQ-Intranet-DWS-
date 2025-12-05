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

async function listAllBlueprints() {
  console.log('📋 Listing all Blueprints...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, domain, guide_type, unit, summary')
    .eq('domain', 'Blueprint')
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

  console.log(`Found ${guides.length} guide(s) in Blueprint domain:\n`);
  guides.forEach((g, i) => {
    console.log(`${i + 1}. "${g.title}"`);
    console.log(`   ID: ${g.id}`);
    console.log(`   Guide Type: ${g.guide_type || 'null'}`);
    console.log(`   Unit: ${g.unit || 'null'}`);
    console.log(`   Summary: ${(g.summary || '').substring(0, 80)}...`);
    console.log('');
  });
}

listAllBlueprints().catch(console.error);

