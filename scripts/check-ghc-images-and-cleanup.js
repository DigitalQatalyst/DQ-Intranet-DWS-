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

const REQUIRED_CARDS = [
  'DQ Journey',
  'DQ Beliefs',
  'DQ Vision and Mission',
  'DQ Strategy 2021-2030',
  'DQ Competencies',
  'DQ Products'
];

function getUniqueImage(guideId, title) {
  const hash = createHash('md5').update(`${guideId}-${title}`).digest('hex');
  const hashNum = parseInt(hash.substring(0, 8), 16);
  const photoIds = [
    '1552664730-d307ca884978', '1522071820081-009f0129c71c', '1551288049-bebda4e38f71',
    '1454165804606-c3d57bc86b40', '1460925895917-afdab827c52f', '1556742049-0cfed4f6a45d',
    '1557800636-23f87b1063e4', '1521737854947-0b219b6c2c94', '1553877522-25bcdc54f2de',
    '1507003211169-0a1dd7228fbb', '1516321318469-88ce825ef878', '1556761175-597af40f565e',
    '1556073709-9fae23b835b2', '1557804816-2b21ebcb1977', '1559827261-9cbd8d3600a9',
    '1553877522-25bcdc54f2de', '1507003211169-0a1dd7228fbb', '1516321318469-88ce825ef878',
    '1551288049-bebda4e38f71', '1557800636-23f87b1063e4', '1521737854947-0b219b6c2c94',
  ];
  const photoId = photoIds[hashNum % photoIds.length];
  const uniqueParam = hash.substring(0, 6);
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
}

async function checkImagesAndCleanup() {
  console.log('🔍 Checking GHC service cards images and identifying irrelevant guides...\n');

  // Get all guides with 'ghc' in sub_domain
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url, sub_domain, domain')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  const ghcGuides = (allGuides || []).filter(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    return subDomain.includes('ghc') && !subDomain.includes('ghc-leader');
  });

  console.log(`📊 Found ${ghcGuides.length} guides with 'ghc' in sub_domain:\n`);

  const guidesToUpdate = [];
  const guidesToRemove = [];

  // Check required cards
  console.log('📋 Checking required GHC service cards:\n');
  for (const cardTitle of REQUIRED_CARDS) {
    const guide = ghcGuides.find(g => g.title === cardTitle);
    
    if (guide) {
      const hasImage = guide.hero_image_url && 
                      guide.hero_image_url !== '/image.png' && 
                      !guide.hero_image_url.includes('placeholder');
      
      console.log(`✅ ${guide.title}`);
      console.log(`   Image: ${hasImage ? '✅' : '❌ Missing'}`);
      
      if (!hasImage) {
        guidesToUpdate.push({
          id: guide.id,
          title: guide.title,
          reason: 'Missing image'
        });
      }
    } else {
      console.log(`❌ ${cardTitle} - NOT FOUND`);
    }
  }

  // Check for irrelevant guides (guides with 'ghc' but not in required list)
  console.log(`\n\n🔍 Checking for irrelevant guides under GHC:\n`);
  for (const guide of ghcGuides) {
    const isRequired = REQUIRED_CARDS.includes(guide.title);
    
    if (!isRequired) {
      console.log(`⚠️  "${guide.title}" - Not in required list`);
      console.log(`   ID: ${guide.id}`);
      console.log(`   Sub-Domain: ${guide.sub_domain}`);
      console.log(`   Domain: ${guide.domain}`);
      
      // Ask if we should remove 'ghc' from sub_domain or delete
      // For now, we'll remove 'ghc' from sub_domain if it's not a required card
      guidesToRemove.push({
        id: guide.id,
        title: guide.title,
        sub_domain: guide.sub_domain
      });
    }
  }

  // Update images for guides that need them
  if (guidesToUpdate.length > 0) {
    console.log(`\n\n🖼️  Adding images to ${guidesToUpdate.length} guide(s)...\n`);
    
    for (const guide of guidesToUpdate) {
      const imageUrl = getUniqueImage(guide.id, guide.title);
      console.log(`Adding image to "${guide.title}"...`);
      
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          hero_image_url: imageUrl,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Image added: ${imageUrl.substring(0, 60)}...`);
      }
    }
  }

  // Remove 'ghc' from irrelevant guides
  if (guidesToRemove.length > 0) {
    console.log(`\n\n🧹 Cleaning up ${guidesToRemove.length} irrelevant guide(s)...\n`);
    
    for (const guide of guidesToRemove) {
      const currentSubDomain = guide.sub_domain || '';
      const newSubDomain = currentSubDomain
        .split(',')
        .filter(s => s.toLowerCase() !== 'ghc')
        .join(',')
        .trim() || null;
      
      console.log(`Removing 'ghc' from "${guide.title}"...`);
      console.log(`   Old sub_domain: ${currentSubDomain || 'null'}`);
      console.log(`   New sub_domain: ${newSubDomain || 'null'}`);
      
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          sub_domain: newSubDomain,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated successfully`);
      }
    }
  }

  // Final verification
  console.log(`\n\n📊 Final verification:\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, hero_image_url, sub_domain')
    .eq('status', 'Approved');

  const finalGHCGuides = (finalGuides || []).filter(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    return subDomain.includes('ghc') && !subDomain.includes('ghc-leader');
  });

  console.log(`Found ${finalGHCGuides.length} guides with 'ghc' in sub_domain:\n`);
  for (const cardTitle of REQUIRED_CARDS) {
    const guide = finalGHCGuides.find(g => g.title === cardTitle);
    if (guide) {
      const hasImage = guide.hero_image_url && 
                      guide.hero_image_url !== '/image.png' && 
                      !guide.hero_image_url.includes('placeholder');
      console.log(`${hasImage ? '✅' : '❌'} ${guide.title} ${hasImage ? '(has image)' : '(missing image)'}`);
    } else {
      console.log(`❌ ${cardTitle} - NOT FOUND`);
    }
  }
}

checkImagesAndCleanup().catch(console.error);

