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

async function verifyImages() {
  console.log('🔍 Verifying all guide images...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url, domain, guide_type')
    .eq('status', 'Approved')
    .order('title');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  console.log(`📊 Checking ${guides.length} guides...\n`);

  const issues = [];
  const validImages = [];

  for (const guide of guides) {
    const img = guide.hero_image_url;
    
    if (!img || img.trim() === '') {
      issues.push({
        guide: guide.title,
        problem: 'No image URL',
        image: null
      });
    } else if (img.includes('/image.png')) {
      issues.push({
        guide: guide.title,
        problem: 'Placeholder image (/image.png)',
        image: img
      });
    } else if (!img.startsWith('http')) {
      issues.push({
        guide: guide.title,
        problem: 'Invalid URL format',
        image: img
      });
    } else {
      validImages.push(guide);
    }
  }

  if (issues.length > 0) {
    console.log(`⚠️  Found ${issues.length} guides with image issues:\n`);
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.guide}`);
      console.log(`   Problem: ${issue.problem}`);
      if (issue.image) console.log(`   Image: ${issue.image}`);
      console.log('');
    });
  } else {
    console.log('✅ All guides have valid image URLs!');
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Valid images: ${validImages.length}`);
  console.log(`   ⚠️  Issues: ${issues.length}`);

  return issues;
}

verifyImages().catch(console.error);

