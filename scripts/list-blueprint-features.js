import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listBlueprintFeatures() {
  console.log('Fetching DWS Blueprint features...\n');

  try {
    const { data, error } = await supabase
      .from('guides')
      .select('body')
      .eq('slug', 'dws-blueprint')
      .single();

    if (error) {
      throw error;
    }

    if (!data || !data.body) {
      console.log('No blueprint found or body is empty.');
      return;
    }

    const body = data.body;
    
    // Find the Features section
    const featuresStart = body.indexOf('## Features');
    const featuresEnd = body.indexOf('## AI Tools');
    
    if (featuresStart === -1) {
      console.log('Features section not found.');
      return;
    }
    
    const featuresSection = featuresEnd === -1 
      ? body.substring(featuresStart)
      : body.substring(featuresStart, featuresEnd);
    
    console.log('='.repeat(80));
    console.log('DWS BLUEPRINT FEATURES');
    console.log('='.repeat(80));
    console.log('\n');
    
    // Extract feature boxes
    const featureBoxRegex = /<div class="feature-box">\s*###\s*(.+?)\s*\n\n(.+?)\n\n- (.+?)\s*<\/div>/gs;
    const matches = [...featuresSection.matchAll(featureBoxRegex)];
    
    if (matches.length > 0) {
      matches.forEach((match, index) => {
        const title = match[1].trim();
        const description = match[2].trim();
        const items = match[3].split('\n- ').filter(item => item.trim());
        
        console.log(`${index + 1}. ${title}`);
        console.log(`   ${description}`);
        console.log(`   Components:`);
        items.forEach(item => {
          if (item.trim() && !item.includes('Deployment Considerations')) {
            console.log(`     - ${item.trim()}`);
          }
        });
        console.log('');
      });
    } else {
      // Fallback: just show the raw section
      console.log(featuresSection);
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\nDone!');
}

listBlueprintFeatures();

