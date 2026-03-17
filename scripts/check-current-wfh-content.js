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

async function checkContent() {
  const { data: wfh } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'dq-wfh-guidelines')
    .maybeSingle();

  console.log('CURRENT WFH CONTENT:');
  console.log('='.repeat(80));
  console.log(wfh?.body);
  console.log('='.repeat(80));
}

checkContent().catch(console.error);


