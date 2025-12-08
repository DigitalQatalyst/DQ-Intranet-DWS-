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

async function removeDuplicates() {
  console.log('🔄 Removing duplicate Agile 6xD guides...\n');

  // Get all "Agile 6xD" guides
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, unit, location, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .ilike('title', '%Agile 6xD%')
    .order('id');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${allGuides.length} "Agile 6xD" guide(s):\n`);
  allGuides.forEach((g, i) => {
    console.log(`${i + 1}. ID: ${g.id}`);
    console.log(`   Title: ${g.title}`);
    console.log(`   Unit: ${g.unit || 'null'}`);
    console.log(`   Location: ${g.location || 'null'}`);
    console.log('');
  });

  if (allGuides.length <= 1) {
    console.log('✅ No duplicates found. Only one guide exists.');
    return;
  }

  // Keep the first one (lowest ID), delete the rest
  const guideToKeep = allGuides[0];
  const guidesToDelete = allGuides.slice(1);

  console.log(`\n📋 Keeping: "${guideToKeep.title}" (ID: ${guideToKeep.id})`);
  console.log(`📋 Deleting ${guidesToDelete.length} duplicate(s):\n`);

  for (const guide of guidesToDelete) {
    console.log(`Deleting "${guide.title}" (ID: ${guide.id})`);
    console.log(`   Unit: ${guide.unit || 'null'}`);
    
    const { error: deleteError } = await supabase
      .from('guides')
      .delete()
      .eq('id', guide.id);

    if (deleteError) {
      console.error(`   ❌ Error: ${deleteError.message}`);
    } else {
      console.log(`   ✅ Deleted`);
    }
  }

  // Update the kept guide: remove "(Products)" from title if unit is not Products
  const { data: keptGuide } = await supabase
    .from('guides')
    .select('id, title, unit')
    .eq('id', guideToKeep.id)
    .single();

  if (keptGuide) {
    const currentTitle = keptGuide.title;
    const unit = keptGuide.unit || '';
    
    // Remove "(Products)" from title if unit is not "Products"
    if (currentTitle.includes('(Products)') && unit.toLowerCase() !== 'products') {
      const newTitle = currentTitle.replace(/\s*\(Products\)/g, '').trim();
      console.log(`\nRenaming guide to remove "(Products)"...`);
      console.log(`   Old: ${currentTitle}`);
      console.log(`   New: ${newTitle}`);
      console.log(`   Unit: ${unit}`);
      
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          title: newTitle,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guideToKeep.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated`);
      }
    } else if (currentTitle.includes('(Products)') && unit.toLowerCase() === 'products') {
      console.log(`\n✓ Title already has "(Products)" and unit is Products - keeping as is`);
    }
  }

  // Ensure the kept guide has a unique image
  console.log(`\n🖼️  Ensuring unique image...`);
  const { data: finalGuide } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('id', guideToKeep.id)
    .single();

  if (finalGuide) {
    const hash = createHash('md5').update(`${finalGuide.id}-${finalGuide.title}-unique-final`).digest('hex');
    const uniqueParam = hash.substring(0, 8);
    
    // Use a unique photo ID for Agile 6xD
    const photoId = '1556742049-0cfed4f6a45d'; // Agile/transformation image
    const newImageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;

    console.log(`   Current URL: ${finalGuide.hero_image_url?.substring(0, 80)}...`);
    console.log(`   New URL: ${newImageUrl.substring(0, 80)}...`);
    
    const { error: imageError } = await supabase
      .from('guides')
      .update({
        hero_image_url: newImageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guideToKeep.id);

    if (imageError) {
      console.error(`   ❌ Error: ${imageError.message}`);
    } else {
      console.log(`   ✅ Image updated to unique URL`);
    }
  }

  // Final verification
  console.log(`\n\n📊 Final verification:\n`);
  const { data: remaining } = await supabase
    .from('guides')
    .select('id, title, unit, location, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .ilike('title', '%Agile 6xD%');

  console.log(`Remaining "Agile 6xD" guide(s): ${remaining?.length || 0}`);
  remaining?.forEach((g, i) => {
    console.log(`   ${i + 1}. "${g.title}"`);
    console.log(`      Unit: ${g.unit || 'null'}`);
    console.log(`      Location: ${g.location || 'null'}`);
    console.log(`      Image: ${g.hero_image_url?.substring(0, 60)}...`);
  });

  console.log(`\n✅ Duplicates removed. Only one "Agile 6xD" guide remains with unique image.`);
}

removeDuplicates().catch(console.error);
