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

async function fixLeaveGuidelines() {
  console.log('🔄 Fixing Leave Guidelines categorization...\n');

  const { data: leaveGuides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, domain')
    .ilike('title', '%Leave Guidelines%')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${leaveGuides?.length || 0} Leave Guidelines guides\n`);

  for (const guide of leaveGuides || []) {
    if (guide.sub_domain === 'journey' || guide.domain === 'Strategy') {
      console.log(`🔄 Fixing "${guide.title}" (ID: ${guide.id})...`);
      console.log(`   Current: domain=${guide.domain}, sub_domain=${guide.sub_domain}`);
      
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          domain: 'Guidelines',
          sub_domain: 'resources',
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated to Guidelines/resources`);
      }
    } else {
      console.log(`   ✓ "${guide.title}" already correctly categorized`);
    }
  }

  // Verify DQ Journey guide
  console.log('\n📋 Verifying DQ Journey guide...\n');
  const { data: journeyGuide } = await supabase
    .from('guides')
    .select('id, title, summary, body, sub_domain, domain')
    .ilike('title', '%DQ Journey%')
    .eq('status', 'Approved')
    .limit(1);

  if (journeyGuide && journeyGuide.length > 0) {
    const guide = journeyGuide[0];
    console.log(`✅ Found: ${guide.title}`);
    console.log(`   Domain: ${guide.domain}`);
    console.log(`   Sub-Domain: ${guide.sub_domain}`);
    console.log(`   Summary: ${(guide.summary || '').substring(0, 100)}...`);
    console.log(`   Body length: ${(guide.body || '').length} characters`);
  } else {
    console.log('❌ DQ Journey guide not found');
  }
}

fixLeaveGuidelines().catch(console.error);

