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

async function verifyAndFix() {
  console.log('🔍 Verifying DQ Competencies and comparing with working guides...\n');

  // Get DQ Competencies
  const { data: competencies, error: compError } = await supabase
    .from('guides')
    .select('id, title, hero_image_url, domain, guide_type')
    .eq('status', 'Approved')
    .eq('title', 'DQ Competencies')
    .single();

  // Get a working guide for comparison
  const { data: working, error: workError } = await supabase
    .from('guides')
    .select('id, title, hero_image_url, domain, guide_type')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .neq('title', 'DQ Competencies')
    .limit(1)
    .single();

  if (compError || workError) {
    console.error('❌ Error:', compError || workError);
    return;
  }

  console.log(`DQ Competencies:`);
  console.log(`   ID: ${competencies.id}`);
  console.log(`   Title: ${competencies.title}`);
  console.log(`   Domain: ${competencies.domain}`);
  console.log(`   Guide Type: ${competencies.guide_type}`);
  console.log(`   hero_image_url: ${competencies.hero_image_url || 'NULL'}`);
  console.log(`   Length: ${(competencies.hero_image_url || '').length}`);
  console.log(`   Is empty string: ${competencies.hero_image_url === '' ? 'YES ❌' : 'NO ✅'}`);
  console.log(`   Is null: ${competencies.hero_image_url === null ? 'YES ❌' : 'NO ✅'}`);

  console.log(`\nWorking guide (${working.title}):`);
  console.log(`   ID: ${working.id}`);
  console.log(`   hero_image_url: ${working.hero_image_url || 'NULL'}`);
  console.log(`   Length: ${(working.hero_image_url || '').length}`);

  // Check if Competencies has a valid URL
  const compUrl = competencies.hero_image_url || '';
  const isValid = compUrl && 
                  compUrl.startsWith('http') && 
                  compUrl.includes('unsplash') &&
                  compUrl.includes('photo-');

  if (!isValid) {
    console.log(`\n❌ DQ Competencies image URL is invalid!`);
    console.log(`   Fixing now...\n`);
    
    // Use the same photo ID as before but ensure it's properly formatted
    const photoId = '1521737854947-0b219b6c2c94';
    const hash = createHash('md5').update(`${competencies.id}-DQ Competencies-working-final`).digest('hex');
    const uniqueParam = hash.substring(0, 8);
    const timestamp = Date.now();
    
    // Create URL matching working format exactly
    const newImageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;

    console.log(`   New URL: ${newImageUrl}`);
    console.log(`   Format matches working: ${newImageUrl.includes('&u=') ? '✅' : '❌'}`);

    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: newImageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', competencies.id);

    if (updateError) {
      console.error(`   ❌ Update error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated successfully`);
      
      // Verify it was saved
      const { data: verify } = await supabase
        .from('guides')
        .select('hero_image_url')
        .eq('id', competencies.id)
        .single();
      
      console.log(`   Verified saved: ${verify?.hero_image_url === newImageUrl ? '✅' : '❌'}`);
      console.log(`   Saved value: ${verify?.hero_image_url}`);
    }
  } else {
    console.log(`\n✅ DQ Competencies has a valid image URL`);
    console.log(`   URL: ${compUrl}`);
    console.log(`\n💡 If image still doesn't show, the issue might be:`);
    console.log(`   1. Frontend field mapping (hero_image_url → heroImageUrl)`);
    console.log(`   2. Browser cache (try hard refresh)`);
    console.log(`   3. Image loading error (check browser console)`);
  }
}

verifyAndFix().catch(console.error);

