import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkFeaturesContent() {
  const { data, error } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'dws-blueprint')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  const body = data.body;
  const featuresStart = body.indexOf('## Features');
  const featuresEnd = body.indexOf('## AI Tools');
  
  if (featuresStart === -1 || featuresEnd === -1) {
    console.log('Could not find Features section');
    return;
  }
  
  const featuresSection = body.substring(featuresStart, featuresEnd);
  
  console.log('Features section length:', featuresSection.length);
  console.log('Contains feature-box:', featuresSection.includes('feature-box'));
  console.log('Contains <div class="feature-box">:', featuresSection.includes('<div class="feature-box">'));
  
  // Show first 500 chars
  console.log('\nFirst 500 characters:');
  console.log(featuresSection.substring(0, 500));
  
  // Count feature boxes
  const boxCount = (featuresSection.match(/<div class="feature-box">/g) || []).length;
  console.log(`\nFound ${boxCount} feature boxes`);
}

checkFeaturesContent();

