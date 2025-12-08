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

async function checkUncategorizedStrategyGuides() {
  console.log('🔍 Checking uncategorized Strategy guides...\n');

  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, summary, body, sub_domain, domain')
    .eq('status', 'Approved')
    .eq('domain', 'Strategy');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  const uncategorized = (allGuides || []).filter(g => {
    const subDomain = g.sub_domain || '';
    return !subDomain || subDomain.trim() === '';
  });

  console.log(`📊 Found ${uncategorized.length} uncategorized Strategy guides:\n`);

  uncategorized.forEach((guide, index) => {
    console.log(`${index + 1}. ${guide.title}`);
    console.log(`   Summary: ${(guide.summary || '').substring(0, 100)}...`);
    console.log(`   Body preview: ${(guide.body || '').substring(0, 150)}...`);
    
    // Check if it's actually DQ-specific content
    const titleLower = (guide.title || '').toLowerCase();
    const summaryLower = (guide.summary || '').toLowerCase();
    const bodyLower = (guide.body || '').toLowerCase();
    
    const hasDQContent = titleLower.includes('dq') || 
                         summaryLower.includes('dq') || 
                         summaryLower.includes('digital qatalyst') ||
                         bodyLower.includes('dq') ||
                         bodyLower.includes('digital qatalyst');
    
    const isGenericStrategy = titleLower.includes('strategy') || 
                             titleLower.includes('planning') ||
                             titleLower.includes('management') ||
                             titleLower.includes('overview') ||
                             titleLower.includes('excellence') ||
                             titleLower.includes('optimization');
    
    if (hasDQContent) {
      console.log(`   ✅ Contains DQ-specific content`);
    } else if (isGenericStrategy) {
      console.log(`   ⚠️  Generic strategy guide - may not be relevant to DQ Strategy feature`);
    } else {
      console.log(`   ❓ Unclear if relevant`);
    }
    console.log('');
  });

  console.log(`\n💡 Recommendation:`);
  console.log(`   These ${uncategorized.length} guides are generic strategy guides that don't have`);
  console.log(`   specific categorization. They may not be relevant to DQ's actual Strategy content`);
  console.log(`   (Journey, Beliefs, Vision, 6xD, GHC, etc.). Consider removing or recategorizing them.`);
}

checkUncategorizedStrategyGuides().catch(console.error);

