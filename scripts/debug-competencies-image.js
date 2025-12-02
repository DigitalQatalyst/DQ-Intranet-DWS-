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

async function debugCompetenciesImage() {
  console.log('🔍 Debugging DQ Competencies image issue...\n');

  // Get DQ Competencies
  const { data: competencies, error: compError } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('title', 'DQ Competencies')
    .single();

  if (compError) {
    console.error('❌ Error:', compError);
    return;
  }

  // Get a working guide for comparison
  const { data: workingGuide, error: workError } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .neq('title', 'DQ Competencies')
    .limit(1)
    .single();

  console.log(`DQ Competencies:`);
  console.log(`   Title: ${competencies.title}`);
  console.log(`   Image URL: ${competencies.hero_image_url || 'null'}`);
  console.log(`   URL Length: ${(competencies.hero_image_url || '').length}`);
  console.log(`   Starts with http: ${competencies.hero_image_url?.startsWith('http') ? '✅' : '❌'}`);
  console.log(`   Contains unsplash: ${competencies.hero_image_url?.includes('unsplash') ? '✅' : '❌'}`);
  console.log(`   Contains photo-: ${competencies.hero_image_url?.includes('photo-') ? '✅' : '❌'}`);

  if (workingGuide) {
    console.log(`\nWorking guide (${workingGuide.title}) for comparison:`);
    console.log(`   Image URL: ${workingGuide.hero_image_url || 'null'}`);
    console.log(`   URL Length: ${(workingGuide.hero_image_url || '').length}`);
    console.log(`   Format: ${workingGuide.hero_image_url?.substring(0, 100)}...`);
  }

  // Try to match the format of working images
  if (workingGuide && workingGuide.hero_image_url) {
    const workingUrl = workingGuide.hero_image_url;
    const compUrl = competencies.hero_image_url || '';
    
    // Extract pattern from working URL
    const photoIdMatch = workingUrl.match(/photo-([a-z0-9-]+)/);
    if (photoIdMatch) {
      console.log(`\n📋 Working URL pattern:`);
      console.log(`   Photo ID format: photo-${photoIdMatch[1]}`);
      console.log(`   Full pattern: ${workingUrl.substring(0, 120)}...`);
    }

    // Check if Competencies URL matches the pattern
    if (compUrl && compUrl.includes('unsplash')) {
      const compPhotoIdMatch = compUrl.match(/photo-([a-z0-9-]+)/);
      if (compPhotoIdMatch) {
        console.log(`\n📋 Competencies URL pattern:`);
        console.log(`   Photo ID format: photo-${compPhotoIdMatch[1]}`);
        console.log(`   Full pattern: ${compUrl.substring(0, 120)}...`);
        
        // Compare URL structures
        const workingParams = workingUrl.split('?')[1] || '';
        const compParams = compUrl.split('?')[1] || '';
        
        console.log(`\n🔍 Parameter comparison:`);
        console.log(`   Working params: ${workingParams}`);
        console.log(`   Competencies params: ${compParams}`);
        
        if (workingParams !== compParams) {
          console.log(`   ⚠️  Parameters differ - this might be the issue!`);
        }
      }
    }
  }

  // Try updating with exact same format as working guide
  if (workingGuide && workingGuide.hero_image_url) {
    const workingUrl = workingGuide.hero_image_url;
    const workingBase = workingUrl.split('?')[0];
    const workingParams = workingUrl.split('?')[1];
    
    // Use same photo ID format but different image
    const newPhotoId = '1521737854947-0b219b6c2c94';
    const newBaseUrl = `https://images.unsplash.com/photo-${newPhotoId}`;
    const newUrl = `${newBaseUrl}?${workingParams}`;
    
    console.log(`\n🔄 Trying to match working URL format exactly...`);
    console.log(`   New URL: ${newUrl}`);
    
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: newUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', competencies.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated to match working format`);
    }
  }
}

debugCompetenciesImage().catch(console.error);

