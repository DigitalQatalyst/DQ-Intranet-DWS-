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

async function verifyDQStrategyGuides() {
  console.log('🔍 Verifying all remaining Strategy guides are DQ-related...\n');

  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, summary, sub_domain, domain')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`📊 Found ${allGuides.length} Strategy guides:\n`);

  let allDQRelated = true;

  for (const guide of allGuides) {
    const title = guide.title || '';
    const summary = (guide.summary || '').toLowerCase();
    const titleLower = title.toLowerCase();

    // Check if it's clearly DQ-related
    const hasDQInTitle = titleLower.includes('dq');
    const hasDQInSummary = summary.includes('dq') || 
                           summary.includes('digital qatalyst') ||
                           summary.includes('digitalqatalyst');
    
    // Check if it's a valid DQ Strategy category
    const isDQStrategyCategory = titleLower.includes('journey') ||
                                 titleLower.includes('beliefs') ||
                                 titleLower.includes('vision') ||
                                 titleLower.includes('mission') ||
                                 titleLower.includes('strategy 2021') ||
                                 titleLower.includes('competencies') ||
                                 titleLower.includes('6xd') ||
                                 titleLower.includes('ghc');

    const isDQRelated = hasDQInTitle || hasDQInSummary || isDQStrategyCategory;

    const status = isDQRelated ? '✅' : '⚠️';
    console.log(`${status} ${title}`);
    
    if (hasDQInTitle) {
      console.log(`   ✓ Has "DQ" in title`);
    }
    if (hasDQInSummary) {
      console.log(`   ✓ Has "DQ" in summary`);
    }
    if (isDQStrategyCategory) {
      console.log(`   ✓ Is a DQ Strategy category guide`);
    }
    if (!isDQRelated) {
      console.log(`   ⚠️  May not be DQ-related`);
      allDQRelated = false;
    }
    console.log(`   Sub-Domain: ${guide.sub_domain || 'null'}`);
    console.log('');
  }

  if (allDQRelated) {
    console.log(`\n✅ All ${allGuides.length} Strategy guides are DQ-related!`);
  } else {
    console.log(`\n⚠️  Some guides may need review.`);
  }
}

verifyDQStrategyGuides().catch(console.error);

