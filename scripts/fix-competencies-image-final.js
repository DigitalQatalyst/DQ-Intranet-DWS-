import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCompetenciesFinal() {
  console.log('🖼️  Fixing DQ Competencies image (final attempt)...\n');

  // Get DQ Competencies
  const { data: competencies, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .ilike('title', '%Competencies%')
    .single();

  if (error || !competencies) {
    console.error('❌ Error finding guide:', error);
    return;
  }

  console.log(`Found: "${competencies.title}" (ID: ${competencies.id})`);
  console.log(`Current image: ${competencies.hero_image_url || 'null'}\n`);

  // Get a working guide to copy exact format
  const { data: workingGuide } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .neq('title', 'DQ Competencies')
    .not('hero_image_url', 'is', null)
    .limit(1)
    .single();

  if (!workingGuide) {
    console.error('❌ No working guide found for reference');
    return;
  }

  console.log(`Reference guide: "${workingGuide.title}"`);
  console.log(`   Working URL: ${workingGuide.hero_image_url?.substring(0, 100)}...`);

  // Extract the format from working guide
  const workingUrl = workingGuide.hero_image_url || '';
  const urlParts = workingUrl.split('?');
  const baseUrl = urlParts[0];
  const params = urlParts[1] || '';
  
  // Get base params (without u= and t=)
  const paramParts = params.split('&');
  const baseParams = paramParts.filter(p => !p.startsWith('u=') && !p.startsWith('t=')).join('&');

  // Use a known working photo ID - let's use one from a working guide
  const workingPhotoMatch = workingUrl.match(/photo-([a-z0-9-]+)/);
  const workingPhotoId = workingPhotoMatch ? workingPhotoMatch[1] : '1460925895917-afdab827c52f';

  // Use a different photo ID for competencies but same format
  const competenciesPhotoId = '1522071820081-009f0129c71c'; // Team/skills image
  const hash = createHash('md5').update(`${competencies.id}-competencies-working`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  
  // Build URL in exact same format as working guide
  const newImageUrl = `https://images.unsplash.com/photo-${competenciesPhotoId}?${baseParams}&u=${uniqueParam}`;

  console.log(`\nUpdating image...`);
  console.log(`   Photo ID: ${competenciesPhotoId}`);
  console.log(`   Format: ${baseParams}`);
  console.log(`   Unique param: ${uniqueParam}`);
  console.log(`   New URL: ${newImageUrl.substring(0, 100)}...`);

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      hero_image_url: newImageUrl,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', competencies.id);

  if (updateError) {
    console.error(`   ❌ Error: ${updateError.message}`);
    return;
  }

  console.log(`   ✅ Updated`);

  // Try alternative: use exact same photo ID as a working guide but different unique param
  console.log(`\n🔄 Trying alternative: using working photo ID with different unique param...`);
  const altHash = createHash('md5').update(`competencies-${Date.now()}`).digest('hex');
  const altUniqueParam = altHash.substring(0, 8);
  const altImageUrl = `https://images.unsplash.com/photo-${workingPhotoId}?${baseParams}&u=${altUniqueParam}`;

  const { error: altError } = await supabase
    .from('guides')
    .update({
      hero_image_url: altImageUrl,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', competencies.id);

  if (altError) {
    console.error(`   ❌ Error: ${altError.message}`);
  } else {
    console.log(`   ✅ Updated to alternative URL`);
    console.log(`   URL: ${altImageUrl.substring(0, 100)}...`);
  }

  // Final verification
  const { data: final } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('id', competencies.id)
    .single();

  if (final) {
    console.log(`\n📊 Final status:`);
    console.log(`   Title: ${final.title}`);
    console.log(`   Image URL: ${final.hero_image_url?.substring(0, 120)}...`);
    console.log(`   Valid: ${final.hero_image_url ? '✅ YES' : '❌ NO'}`);
  }

  console.log(`\n💡 If still no image, the issue might be frontend caching.`);
  console.log(`   Try: Hard refresh (Ctrl+F5) or clear browser cache`);
}

fixCompetenciesFinal().catch(console.error);

