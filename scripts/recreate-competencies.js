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

async function recreateCompetencies() {
  console.log('🔄 Recreating DQ Competencies...\n');

  // Get the current guide to copy its data
  const { data: currentGuide, error: fetchError } = await supabase
    .from('guides')
    .select('*')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .ilike('title', '%Competencies%')
    .single();

  if (fetchError || !currentGuide) {
    console.error('❌ Error finding guide:', fetchError);
    return;
  }

  console.log(`Found: "${currentGuide.title}" (ID: ${currentGuide.id})`);
  console.log(`   Unit: ${currentGuide.unit || 'null'}`);
  console.log(`   Location: ${currentGuide.location || 'null'}`);
  console.log(`   Sub Domain: ${currentGuide.sub_domain || 'null'}`);

  // Delete the current guide
  console.log(`\n🗑️  Deleting current guide...`);
  const { error: deleteError } = await supabase
    .from('guides')
    .delete()
    .eq('id', currentGuide.id);

  if (deleteError) {
    console.error(`   ❌ Error: ${deleteError.message}`);
    return;
  }
  console.log(`   ✅ Deleted`);

  // Create new guide with same data but fresh image
  console.log(`\n➕ Creating new guide...`);
  
  const hash = createHash('md5').update(`DQ-Competencies-${Date.now()}`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  const photoId = '1507003211169-0a1dd7228fbb'; // Skills/competencies image
  const newImageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;

  const newGuide = {
    title: currentGuide.title,
    slug: currentGuide.slug || 'dq-competencies',
    summary: currentGuide.summary,
    body: currentGuide.body,
    domain: currentGuide.domain,
    sub_domain: currentGuide.sub_domain,
    guide_type: currentGuide.guide_type,
    unit: currentGuide.unit,
    location: currentGuide.location,
    hero_image_url: newImageUrl,
    status: 'Approved'
  };

  console.log(`   Title: ${newGuide.title}`);
  console.log(`   Unit: ${newGuide.unit || 'null'}`);
  console.log(`   Location: ${newGuide.location || 'null'}`);
  console.log(`   Image: ${newImageUrl.substring(0, 80)}...`);

  const { data: created, error: createError } = await supabase
    .from('guides')
    .insert(newGuide)
    .select();

  if (createError) {
    console.error(`   ❌ Error: ${createError.message}`);
    return;
  }

  console.log(`   ✅ Created (ID: ${created[0].id})`);

  // Verify
  console.log(`\n📊 Verification:`);
  const { data: verified } = await supabase
    .from('guides')
    .select('id, title, hero_image_url, unit, location')
    .eq('id', created[0].id)
    .single();

  if (verified) {
    console.log(`   ✅ Guide exists`);
    console.log(`   Title: ${verified.title}`);
    console.log(`   Image: ${verified.hero_image_url?.substring(0, 90)}...`);
    console.log(`   Unit: ${verified.unit || 'null'}`);
    console.log(`   Location: ${verified.location || 'null'}`);
  }

  console.log(`\n✅ DQ Competencies recreated with fresh image.`);
}

recreateCompetencies().catch(console.error);

