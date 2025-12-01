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

async function fixWithTimestamp() {
  console.log('🖼️  Fixing DQ Competencies with timestamp...\n');

  // Get DQ Competencies
  const { data: competencies, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .ilike('title', '%Competencies%')
    .single();

  if (error || !competencies) {
    console.error('❌ Error:', error);
    return;
  }

  // Get a working guide to copy exact format
  const { data: working } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .neq('title', 'DQ Competencies')
    .not('hero_image_url', 'is', null)
    .limit(1)
    .single();

  if (!working) {
    console.error('❌ No working guide found');
    return;
  }

  console.log(`Working guide: "${working.title}"`);
  console.log(`   URL: ${working.hero_image_url?.substring(0, 120)}...`);

  // Extract format - check if it has timestamp
  const workingUrl = working.hero_image_url || '';
  const hasTimestamp = workingUrl.includes('&t=');

  // Use same photo ID as working guide but different unique param
  const match = workingUrl.match(/photo-([a-z0-9-]+)/);
  const photoId = match ? match[1] : '1460925895917-afdab827c52f';

  // Build URL with timestamp like working guides
  const hash = createHash('md5').update(`${competencies.id}-competencies-${Date.now()}`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  const timestamp = Date.now();
  
  const newImageUrl = hasTimestamp 
    ? `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}&t=${timestamp}`
    : `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;

  console.log(`\nUpdating DQ Competencies...`);
  console.log(`   Photo ID: ${photoId}`);
  console.log(`   Unique param: ${uniqueParam}`);
  console.log(`   Timestamp: ${hasTimestamp ? timestamp : 'none'}`);
  console.log(`   New URL: ${newImageUrl.substring(0, 120)}...`);

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

  // Verify
  const { data: final } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('id', competencies.id)
    .single();

  if (final) {
    console.log(`\n📊 Final verification:`);
    console.log(`   Title: ${final.title}`);
    console.log(`   Image URL: ${final.hero_image_url}`);
    console.log(`   Length: ${final.hero_image_url?.length || 0} chars`);
    console.log(`   Valid: ${final.hero_image_url && final.hero_image_url.startsWith('http') ? '✅ YES' : '❌ NO'}`);
    
    // Check if it matches working format
    const finalHasTimestamp = final.hero_image_url?.includes('&t=');
    const workingHasTimestamp = workingUrl.includes('&t=');
    console.log(`   Has timestamp: ${finalHasTimestamp ? '✅ YES' : '❌ NO'} (working: ${workingHasTimestamp ? 'YES' : 'NO'})`);
  }

  console.log(`\n✅ DQ Competencies image updated with timestamp.`);
  console.log(`💡 Please hard refresh (Ctrl+F5) to see the image.`);
}

fixWithTimestamp().catch(console.error);

