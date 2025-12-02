import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkFeatures() {
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
  console.log('Current Features section:');
  console.log('='.repeat(80));
  console.log(featuresSection);
  console.log('='.repeat(80));
  
  // Count feature boxes
  const boxCount = (featuresSection.match(/<div class="feature-box">/g) || []).length;
  console.log(`\nFound ${boxCount} feature boxes`);
  
  // Check for DWS Landing
  if (featuresSection.includes('DWS Landing')) {
    console.log('✓ DWS Landing is present');
  } else {
    console.log('✗ DWS Landing is MISSING');
  }
}

checkFeatures();

