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

// Additional unique images to replace duplicates
const REPLACEMENT_IMAGES = [
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&q=80&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
];

async function fixDuplicates() {
  console.log('🔄 Fixing remaining duplicate images...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Find duplicates
  const imageMap = new Map();
  (guides || []).forEach(g => {
    const img = g.hero_image_url;
    if (img) {
      if (!imageMap.has(img)) imageMap.set(img, []);
      imageMap.get(img).push(g);
    }
  });

  const duplicates = Array.from(imageMap.entries()).filter(([_, guides]) => guides.length > 1);
  
  console.log(`📊 Found ${duplicates.length} duplicate image groups\n`);

  let replacementIndex = 0;
  let updated = 0;

  for (const [imageUrl, duplicateGuides] of duplicates) {
    console.log(`🔄 Fixing ${duplicateGuides.length} guides sharing: ${imageUrl.substring(0, 60)}...`);
    
    // Keep first guide with original image, update the rest
    for (let i = 1; i < duplicateGuides.length; i++) {
      const guide = duplicateGuides[i];
      const newImage = REPLACEMENT_IMAGES[replacementIndex % REPLACEMENT_IMAGES.length];
      replacementIndex++;

      console.log(`   Updating "${guide.title}" to new image...`);

      const { error: updateError } = await supabase
        .from('guides')
        .update({
          hero_image_url: newImage,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated`);
        updated++;
      }
    }
    console.log('');
  }

  console.log(`✅ Fixed ${updated} duplicate images!`);

  // Final verification
  console.log('\n🔄 Final verification...');
  const { data: verifyGuides } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved');

  const finalImageMap = new Map();
  (verifyGuides || []).forEach(g => {
    const img = g.hero_image_url;
    if (img) {
      if (!finalImageMap.has(img)) finalImageMap.set(img, []);
      finalImageMap.get(img).push(g.title);
    }
  });

  const finalDuplicates = Array.from(finalImageMap.entries()).filter(([_, titles]) => titles.length > 1);
  
  if (finalDuplicates.length > 0) {
    console.log(`\n⚠️  Still found ${finalDuplicates.length} duplicate images:`);
    finalDuplicates.forEach(([img, titles]) => {
      console.log(`   ${titles.length} guides: ${titles.join(', ')}`);
    });
  } else {
    console.log(`\n✅ All guides now have unique images!`);
  }
}

fixDuplicates().catch(console.error);

