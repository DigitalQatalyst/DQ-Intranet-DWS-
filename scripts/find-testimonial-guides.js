import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findTestimonialGuides() {
  console.log('🔍 Finding testimonial guides...\n');

  // Search for guides with specific keywords
  const searchTerms = [
    'Digital Transformation Journey',
    'Legacy Systems',
    '100 Successful Deployments',
    'Celebrating 100',
    'Financial Services Digital Innovation',
    'Client Success Story'
  ];

  const allGuides = [];
  
  for (const term of searchTerms) {
    const { data: guides, error } = await supabase
      .from('guides')
      .select('id, title, hero_image_url, domain, guide_type')
      .eq('status', 'Approved')
      .ilike('title', `%${term}%`);

    if (!error && guides) {
      allGuides.push(...guides);
    }
  }

  // Remove duplicates
  const uniqueGuides = Array.from(new Map(allGuides.map(g => [g.id, g])).values());

  console.log(`Found ${uniqueGuides.length} guide(s):\n`);
  uniqueGuides.forEach((g, i) => {
    console.log(`${i + 1}. "${g.title}"`);
    console.log(`   ID: ${g.id}`);
    console.log(`   Domain: ${g.domain || 'null'}`);
    console.log(`   Guide Type: ${g.guide_type || 'null'}`);
    console.log(`   Image: ${g.hero_image_url ? g.hero_image_url.substring(0, 100) + '...' : 'No image'}`);
    console.log('');
  });

  // Check for duplicate images
  const imageMap = {};
  uniqueGuides.forEach(g => {
    const imgUrl = g.hero_image_url || 'no-image';
    if (!imageMap[imgUrl]) {
      imageMap[imgUrl] = [];
    }
    imageMap[imgUrl].push(g.title);
  });

  const duplicates = Object.entries(imageMap).filter(([url, titles]) => titles.length > 1);
  
  if (duplicates.length > 0) {
    console.log('⚠️  Duplicate images found:\n');
    duplicates.forEach(([url, titles]) => {
      console.log(`Image: ${url.substring(0, 80)}...`);
      console.log(`   Used by:`);
      titles.forEach(title => console.log(`   - "${title}"`));
      console.log('');
    });
  }
}

findTestimonialGuides().catch(console.error);

