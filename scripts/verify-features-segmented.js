import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyFeaturesSegmented() {
  console.log('Verifying all features are in separate segments...\n');

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
    
    if (featuresStart === -1 || featuresEnd === -1) {
      console.log('Could not find Features section');
      return;
    }
    
    const featuresSection = body.substring(featuresStart, featuresEnd);
    
    // Count feature boxes
    const boxMatches = featuresSection.match(/<div class="feature-box">/g) || [];
    console.log(`Found ${boxMatches.length} feature boxes`);
    
    // Check each feature
    const features = [
      'DWS Landing',
      'DQ Learning Center',
      'DQ Services Center',
      'DQ Work Center',
      'DQ Work Directory',
      'DQ Media Center',
      'DQ Work Communities',
      'DQ Knowledge Center',
      'DWS Transact Apps',
      'DQ Analytics Center'
    ];
    
    console.log('\nChecking each feature:');
    features.forEach((feature, index) => {
      const hasBox = featuresSection.includes(`<div class="feature-box">`) && 
                     featuresSection.includes(`### ${feature}`);
      const boxIndex = featuresSection.indexOf(`### ${feature}`);
      const boxBefore = featuresSection.lastIndexOf('<div class="feature-box">', boxIndex);
      const boxAfter = featuresSection.indexOf('</div>', boxIndex);
      
      if (hasBox && boxBefore !== -1 && boxAfter !== -1 && boxBefore < boxIndex && boxAfter > boxIndex) {
        console.log(`✓ ${index + 1}. ${feature} - in its own box`);
      } else {
        console.log(`✗ ${index + 1}. ${feature} - NOT properly boxed`);
      }
    });
    
    // Show a sample of the structure
    console.log('\nSample structure:');
    const sampleMatch = featuresSection.match(/<div class="feature-box">[\s\S]{1,500}?<\/div>/);
    if (sampleMatch) {
      console.log(sampleMatch[0].substring(0, 300) + '...');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

verifyFeaturesSegmented();

