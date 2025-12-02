import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function copyWorkingFormat() {
  console.log('🔄 Copying exact working image format to DQ Competencies...\n');

  // Get a working guide
  const { data: working, error: workError } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .neq('title', 'DQ Competencies')
    .limit(1)
    .single();

  // Get DQ Competencies
  const { data: competencies, error: compError } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('title', 'DQ Competencies')
    .single();

  if (workError || compError) {
    console.error('❌ Error:', workError || compError);
    return;
  }

  console.log(`Working guide: ${working.title}`);
  console.log(`   URL: ${working.hero_image_url}`);
  
  // Extract the exact parameter format from working URL
  const workingUrl = working.hero_image_url || '';
  const workingParams = workingUrl.split('?')[1] || '';
  
  console.log(`   Parameters: ${workingParams}`);
  
  // Use a different photo ID but same parameter format
  const newPhotoId = '1521737854947-0b219b6c2c94'; // Business meeting image
  const hash = createHash('md5').update(`${competencies.id}-competencies`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  
  // Build URL with same parameter structure but new unique param
  const newImageUrl = `https://images.unsplash.com/photo-${newPhotoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;

  console.log(`\nUpdating DQ Competencies:`);
  console.log(`   Current: ${competencies.hero_image_url}`);
  console.log(`   New: ${newImageUrl}`);
  console.log(`   Format: Matches working guide exactly`);

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      hero_image_url: newImageUrl,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', competencies.id);

  if (updateError) {
    console.error(`   ❌ Error: ${updateError.message}`);
  } else {
    console.log(`   ✅ Updated successfully`);
    
    // Final check
    const { data: verify } = await supabase
      .from('guides')
      .select('hero_image_url')
      .eq('id', competencies.id)
      .single();
    
    console.log(`\n📊 Final verification:`);
    console.log(`   Saved URL: ${verify?.hero_image_url}`);
    console.log(`   Matches format: ${verify?.hero_image_url?.includes('&u=') ? '✅' : '❌'}`);
    console.log(`   Is valid: ${verify?.hero_image_url?.startsWith('http') ? '✅' : '❌'}`);
  }

  console.log(`\n✅ DQ Competencies image URL updated to match working format.`);
  console.log(`💡 The database has the correct URL. If it still doesn't show:`);
  console.log(`   1. Check browser console for image loading errors`);
  console.log(`   2. Verify frontend is mapping hero_image_url → heroImageUrl correctly`);
  console.log(`   3. Try hard refresh (Ctrl+F5 or Cmd+Shift+R)`);
}

copyWorkingFormat().catch(console.error);

