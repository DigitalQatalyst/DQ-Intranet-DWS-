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

function slugify(text) {
  return (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function assignGHCLeader() {
  console.log('🔄 Assigning Strategy guide to GHC Leader framework...\n');

  // Fetch all Strategy guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, domain, guide_type')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Filter for Strategy guides
  const strategy = (guides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    return domain.includes('strategy') || guideType.includes('strategy');
  });

  console.log(`📊 Found ${strategy.length} Strategy guides\n`);

  // Find a guide that doesn't already have ghc-leader assigned
  // Prefer guides that don't have many framework assignments yet
  let selectedGuide = null;
  
  for (const guide of strategy) {
    const subDomain = (guide.sub_domain || '').toLowerCase();
    
    // Skip if already has ghc-leader
    if (subDomain.includes('ghc-leader')) {
      continue;
    }
    
    // Prefer guides with fewer or no framework assignments
    // Or guides that might be leadership-related
    const title = (guide.title || '').toLowerCase();
    if (title.includes('leader') || title.includes('management') || title.includes('strategy')) {
      selectedGuide = guide;
      break;
    }
  }

  // If no leadership-related guide found, pick the first one without ghc-leader
  if (!selectedGuide) {
    for (const guide of strategy) {
      const subDomain = (guide.sub_domain || '').toLowerCase();
      if (!subDomain.includes('ghc-leader')) {
        selectedGuide = guide;
        break;
      }
    }
  }

  if (!selectedGuide) {
    console.log('❌ No suitable Strategy guide found');
    return;
  }

  console.log(`📝 Selected guide: ${selectedGuide.title}`);
  console.log(`   Current sub_domain: ${selectedGuide.sub_domain || 'N/A'}`);

  // Append ghc-leader to sub_domain
  const currentSubDomain = selectedGuide.sub_domain || '';
  const newSubDomain = currentSubDomain 
    ? `${currentSubDomain}, ghc-leader`
    : 'ghc-leader';

  console.log(`   New sub_domain: ${newSubDomain}`);

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      sub_domain: newSubDomain,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', selectedGuide.id);

  if (updateError) {
    console.error(`   ❌ Error: ${updateError.message}`);
  } else {
    console.log(`   ✅ Successfully assigned to GHC Leader framework`);
    console.log(`\n✅ GHC Leader framework now has 1 guide!`);
  }
}

assignGHCLeader().catch(console.error);

