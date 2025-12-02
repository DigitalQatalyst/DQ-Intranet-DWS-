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

async function verify6xDFrameworkGuides() {
  console.log('🔍 Verifying 6xD Framework guides...\n');

  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, summary, sub_domain, domain, guide_type, unit, location, hero_image_url')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  // Filter for 6xD framework guides
  const frameworkGuides = (allGuides || []).filter(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    const domain = (g.domain || '').toLowerCase();
    const title = (g.title || '').toLowerCase();
    return subDomain.includes('digital-framework') || 
           subDomain.includes('6xd') ||
           (domain === 'strategy' && (title.includes('6xd') || title.includes('digital framework')));
  });

  console.log(`📊 Found ${frameworkGuides.length} 6xD Framework guides:\n`);

  frameworkGuides.forEach((guide, index) => {
    console.log(`${index + 1}. ${guide.title}`);
    console.log(`   ID: ${guide.id}`);
    console.log(`   Sub-Domain: ${guide.sub_domain || 'N/A'}`);
    console.log(`   Summary: ${(guide.summary || '').substring(0, 80)}...`);
    console.log(`   Unit: ${guide.unit || 'N/A'}`);
    console.log(`   Location: ${guide.location || 'N/A'}`);
    console.log(`   Image: ${guide.hero_image_url ? '✅' : '❌'}`);
    console.log('');
  });
}

verify6xDFrameworkGuides().catch(console.error);

