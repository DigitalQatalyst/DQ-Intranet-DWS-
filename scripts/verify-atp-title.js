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

async function verifyATPTitle() {
  const { data, error } = await supabase
    .from('guides')
    .select('id, slug, title')
    .eq('slug', 'dq-atp-stop-scans-guidelines')
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (data) {
    console.log('Current title:', data.title);
    
    // Update if still has the old format
    if (data.title.includes('|')) {
      console.log('\n📝 Updating title to remove pipe...');
      
      // Get body
      const { data: bodyData } = await supabase
        .from('guides')
        .select('body')
        .eq('slug', 'dq-atp-stop-scans-guidelines')
        .single();
      
      let newBody = bodyData?.body || '';
      if (newBody.includes('# DQ Guidelines | ATP Stop Scans Guidelines')) {
        newBody = newBody.replace('# DQ Guidelines | ATP Stop Scans Guidelines', '# DQ ATP Stop Scans Guidelines');
      }
      
      const { data: updated, error: updateError } = await supabase
        .from('guides')
        .update({
          title: 'DQ ATP Stop Scans Guidelines',
          body: newBody
        })
        .eq('slug', 'dq-atp-stop-scans-guidelines')
        .select('id, slug, title');
      
      if (updateError) {
        console.error('❌ Update error:', updateError);
      } else {
        console.log('✅ Updated to:', updated[0].title);
      }
    } else {
      console.log('✅ Title is already correct!');
    }
  }
}

verifyATPTitle().catch(console.error);

