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

async function verifyAndFixBoth() {
  console.log('🔍 Verifying DQ Beliefs and DQ Competencies images...\n');

  // Get both guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .in('title', ['DQ Beliefs', 'DQ Competencies'])
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  // Get a working guide for reference
  const { data: working, error: workError } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .neq('title', 'DQ Beliefs')
    .neq('title', 'DQ Competencies')
    .limit(1)
    .single();

  if (workError) {
    console.error('❌ Error getting working guide:', workError);
    return;
  }

  console.log(`Working guide reference: ${working.title}`);
  console.log(`   Image URL: ${working.hero_image_url}`);
  console.log(`   Format: ${working.hero_image_url?.substring(0, 100)}...\n`);

  // Known working photo IDs (tested and confirmed working)
  const workingPhotoIds = {
    'DQ Beliefs': '1553877522-25bcdc54f2de',      // Strategy/planning
    'DQ Competencies': '1521737854947-0b219b6c2c94' // Business meeting
  };

  for (const guide of guides || []) {
    console.log(`\n📋 ${guide.title}:`);
    console.log(`   Current URL: ${guide.hero_image_url || 'null'}`);
    
    const currentUrl = guide.hero_image_url || '';
    const isValid = currentUrl && 
                    currentUrl.startsWith('http') && 
                    currentUrl.includes('unsplash') &&
                    currentUrl.includes('photo-');

    if (!isValid) {
      console.log(`   Status: ❌ Invalid or missing`);
    } else {
      // Extract photo ID
      const match = currentUrl.match(/photo-([a-z0-9-]+)/);
      const currentPhotoId = match ? match[1] : null;
      const expectedPhotoId = workingPhotoIds[guide.title];
      
      if (currentPhotoId === expectedPhotoId) {
        console.log(`   Status: ✅ Has correct photo ID (${currentPhotoId})`);
      } else {
        console.log(`   Status: ⚠️  Photo ID mismatch`);
        console.log(`   Current: ${currentPhotoId}`);
        console.log(`   Expected: ${expectedPhotoId}`);
      }
    }

    // Update to ensure correct format
    const photoId = workingPhotoIds[guide.title];
    const hash = createHash('md5').update(`${guide.id}-${guide.title}-final-working`).digest('hex');
    const uniqueParam = hash.substring(0, 8);
    
    // Use exact same format as working guide
    const workingUrl = working.hero_image_url || '';
    const workingParams = workingUrl.split('?')[1] || 'w=800&h=400&fit=crop&q=80&u=';
    const paramParts = workingParams.split('&');
    const baseParams = paramParts.filter(p => !p.startsWith('u=') && !p.startsWith('t=')).join('&');
    
    const newImageUrl = `https://images.unsplash.com/photo-${photoId}?${baseParams}&u=${uniqueParam}`;

    console.log(`   Updating to: ${newImageUrl.substring(0, 80)}...`);

    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: newImageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);

    if (updateError) {
      console.error(`   ❌ Update error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated successfully`);
    }
  }

  // Final verification
  console.log(`\n\n📊 Final verification:\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .in('title', ['DQ Beliefs', 'DQ Competencies'])
    .order('title');

  for (const guide of finalGuides || []) {
    const url = guide.hero_image_url || '';
    const isValid = url && url.startsWith('http') && url.includes('unsplash') && url.includes('photo-');
    const status = isValid ? '✅' : '❌';
    console.log(`${status} ${guide.title}`);
    console.log(`   URL: ${url.substring(0, 90)}...`);
    console.log(`   Valid: ${isValid ? 'YES' : 'NO'}`);
  }

  console.log(`\n💡 Both guides should now have working images.`);
  console.log(`   Please refresh your browser to see the images.`);
}

verifyAndFixBoth().catch(console.error);

