import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkFeaturesFormat() {
  console.log('Checking Features section format...\n');

  try {
    const { data, error } = await supabase
      .from('guides')
      .select('body')
      .eq('slug', 'dws-blueprint')
      .single();

    if (error) throw error;

    const body = data.body;
    const featuresStart = body.indexOf('## Features');
    const featuresEnd = body.indexOf('## AI Tools');
    
    if (featuresStart === -1) {
      console.log('Features section not found');
      return;
    }
    
    const featuresSection = featuresEnd === -1 
      ? body.substring(featuresStart, featuresStart + 2000)
      : body.substring(featuresStart, featuresEnd);
    
    console.log('Features section (first 1500 chars):');
    console.log('='.repeat(80));
    console.log(featuresSection.substring(0, 1500));
    console.log('='.repeat(80));
    
    // Check for feature-box divs
    const hasFeatureBoxes = featuresSection.includes('feature-box');
    console.log(`\nContains feature-box divs: ${hasFeatureBoxes}`);
    
    // Count feature boxes
    const boxCount = (featuresSection.match(/<div class="feature-box">/g) || []).length;
    console.log(`Number of feature boxes: ${boxCount}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\nDone!');
}

checkFeaturesFormat();

