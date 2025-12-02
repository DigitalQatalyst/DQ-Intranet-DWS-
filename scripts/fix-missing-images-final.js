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

async function fixMissingImages() {
  console.log('🖼️  Fixing missing images for DQ Vision and Mission and DQ Competencies...\n');

  // Get all Strategy guides
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  // Get existing base image URLs to avoid duplicates
  const existingBaseUrls = new Set();
  allGuides.forEach(g => {
    if (g.hero_image_url) {
      const baseUrl = g.hero_image_url.split('?')[0];
      existingBaseUrls.add(baseUrl);
    }
  });

  // Assign proper images to both guides
  const fixes = [
    {
      title: 'DQ Competencies',
      photoId: '1521737854947-0b219b6c2c94', // Team collaboration, business meeting
      description: 'Team collaboration and business meeting (relevant for Competencies)'
    },
    {
      title: 'DQ Vision and Mission',
      photoId: '1454165804606-c3d57bc86b40', // Vision, planning, roadmap
      description: 'Vision, mission, planning, and strategic direction'
    }
  ];

  for (const fix of fixes) {
    const guide = allGuides.find(g => g.title === fix.title);
    
    if (!guide) {
      console.log(`⚠️  "${fix.title}" guide not found`);
      continue;
    }

    // Check if photo ID is already used
    const testBaseUrl = `https://images.unsplash.com/photo-${fix.photoId}`;
    let photoId = fix.photoId;
    
    if (existingBaseUrls.has(testBaseUrl)) {
      // Find alternative
      const alternatives = {
        'DQ Competencies': ['1553877522-25bcdc54f2de', '1516321318469-88ce825ef878', '1556761175-597af40f565e'],
        'DQ Vision and Mission': ['1553877522-25bcdc54f2de', '1516321318469-88ce825ef878', '1551288049-bebda4e38f71']
      };
      
      for (const altPhotoId of alternatives[fix.title] || []) {
        const altBaseUrl = `https://images.unsplash.com/photo-${altPhotoId}`;
        if (!existingBaseUrls.has(altBaseUrl)) {
          photoId = altPhotoId;
          break;
        }
      }
    }

    const hash = createHash('md5').update(`${guide.id}-${fix.title}-final`).digest('hex');
    const uniqueParam = hash.substring(0, 8);
    const newImageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;

    console.log(`Fixing "${fix.title}"...`);
    console.log(`   Current: ${(guide.hero_image_url || 'null').substring(0, 70)}...`);
    console.log(`   New Photo ID: ${photoId}`);
    console.log(`   New URL: ${newImageUrl.substring(0, 70)}...`);
    console.log(`   ${fix.description}`);

    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: newImageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guide.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated successfully`);
      // Update existing base URLs set
      existingBaseUrls.add(newImageUrl.split('?')[0]);
    }
    console.log('');
  }

  // Final verification
  console.log(`\n📊 Final verification:\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  for (const guide of finalGuides || []) {
    const imageUrl = guide.hero_image_url || '';
    const isValid = imageUrl && 
                    imageUrl.startsWith('http') && 
                    imageUrl.includes('unsplash') &&
                    imageUrl.includes('photo-');

    const status = isValid ? '✅' : '❌';
    console.log(`${status} "${guide.title}"`);
    if (isValid) {
      console.log(`   Image: ${imageUrl.substring(0, 80)}...`);
    } else {
      console.log(`   Image: ${imageUrl || 'MISSING'}`);
    }
  }

  console.log(`\n✅ Both guides should now have proper images. Please refresh your browser to see the changes.`);
}

fixMissingImages().catch(console.error);

