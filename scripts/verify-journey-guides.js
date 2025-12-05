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

async function verifyJourneyGuides() {
  console.log('🔍 Verifying Journey guides...\n');

  const { data: journeyGuides, error } = await supabase
    .from('guides')
    .select('id, title, summary, sub_domain, domain, guide_type, unit, location, hero_image_url')
    .eq('sub_domain', 'journey')
    .eq('domain', 'Strategy')
    .eq('status', 'Approved')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`📊 Found ${journeyGuides?.length || 0} Journey guides:\n`);

  journeyGuides?.forEach((guide, index) => {
    console.log(`${index + 1}. ${guide.title}`);
    console.log(`   ID: ${guide.id}`);
    console.log(`   Summary: ${(guide.summary || '').substring(0, 80)}...`);
    console.log(`   Unit: ${guide.unit || 'N/A'}`);
    console.log(`   Location: ${guide.location || 'N/A'}`);
    console.log(`   Image: ${guide.hero_image_url ? '✅' : '❌'}`);
    console.log('');
  });
}

verifyJourneyGuides().catch(console.error);

