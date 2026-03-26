import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'dq-associate-owned-asset-guidelines')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Body content type:', typeof data.body);
  console.log('Body content (first 500 chars):');
  console.log(data.body?.substring(0, 500));
}

check();
