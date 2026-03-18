import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const { data, error } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'dq-associate-owned-asset-guidelines')
    .single();
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  // Extract just the first few headings to see the structure
  const headingMatches = data.body.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi);
  console.log('First 15 headings found:');
  headingMatches.slice(0, 15).forEach((h, i) => {
    console.log(`${i+1}. ${h}`);
  });
  
  console.log('\n\nFirst 3000 chars:');
  console.log(data.body.substring(0, 3000));
})();
