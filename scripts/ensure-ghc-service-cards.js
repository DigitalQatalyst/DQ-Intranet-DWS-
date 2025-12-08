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

const REQUIRED_CARDS = [
  'DQ Journey',
  'DQ Beliefs',
  'DQ Vision and Mission',
  'DQ Strategy 2021-2030',
  'DQ Competencies',
  'DQ Products'
];

async function ensureGHCCards() {
  console.log('🔍 Ensuring all GHC service cards are properly categorized...\n');

  // Find all guides that match the required cards
  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, sub_domain, domain')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  const updates = [];

  // Check each required card
  for (const cardTitle of REQUIRED_CARDS) {
    console.log(`\n📋 Checking: ${cardTitle}`);
    
    // Find matching guides (flexible matching)
    const matches = (allGuides || []).filter(g => {
      const title = (g.title || '').toLowerCase();
      const searchTitle = cardTitle.toLowerCase();
      
      if (cardTitle === 'DQ Journey') {
        return title.includes('dq journey') && !title.includes('beliefs');
      }
      if (cardTitle === 'DQ Beliefs') {
        return title.includes('dq beliefs') || title.includes('beliefs');
      }
      if (cardTitle === 'DQ Vision and Mission') {
        return title.includes('vision') && (title.includes('mission') || title.includes('strategy'));
      }
      if (cardTitle === 'DQ Strategy 2021-2030') {
        return title.includes('dq2') || title.includes('strategic transition') || title.includes('2021') || title.includes('2030');
      }
      if (cardTitle === 'DQ Competencies') {
        return title.includes('competencies');
      }
      if (cardTitle === 'DQ Products') {
        return title.includes('products') && title.includes('overview');
      }
      return false;
    });

    if (matches.length === 0) {
      console.log(`   ❌ Not found`);
    } else {
      matches.forEach(match => {
        const currentSubDomain = (match.sub_domain || '').toLowerCase();
        const needsUpdate = !currentSubDomain.includes('ghc');
        
        console.log(`   ✅ Found: "${match.title}"`);
        console.log(`      Current sub_domain: ${match.sub_domain || 'null'}`);
        
        if (needsUpdate) {
          // Add 'ghc' to sub_domain (append if it exists, or set if null)
          let newSubDomain = currentSubDomain;
          if (!newSubDomain) {
            newSubDomain = 'ghc';
          } else if (!newSubDomain.includes('ghc')) {
            newSubDomain = `${newSubDomain},ghc`;
          }
          
          updates.push({
            id: match.id,
            title: match.title,
            oldSubDomain: match.sub_domain,
            newSubDomain: newSubDomain
          });
          
          console.log(`      ⚠️  Will update sub_domain to: ${newSubDomain}`);
        } else {
          console.log(`      ✓ Already has 'ghc' in sub_domain`);
        }
      });
    }
  }

  // Perform updates
  if (updates.length > 0) {
    console.log(`\n\n🔄 Updating ${updates.length} guide(s)...\n`);
    
    for (const update of updates) {
      console.log(`Updating "${update.title}"...`);
      
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          sub_domain: update.newSubDomain,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', update.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated sub_domain: ${update.oldSubDomain || 'null'} → ${update.newSubDomain}`);
      }
    }
  } else {
    console.log(`\n✅ All guides already have 'ghc' in their sub_domain!`);
  }

  // Verify final state
  console.log(`\n\n📊 Final verification:\n`);
  const { data: finalGuides } = await supabase
    .from('guides')
    .select('id, title, sub_domain')
    .eq('status', 'Approved');

  const ghcGuides = (finalGuides || []).filter(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    return subDomain.includes('ghc') && !subDomain.includes('ghc-leader');
  });

  console.log(`Found ${ghcGuides.length} guides with 'ghc' in sub_domain:\n`);
  ghcGuides.forEach(g => {
    const isRequired = REQUIRED_CARDS.some(card => {
      const title = (g.title || '').toLowerCase();
      const cardLower = card.toLowerCase();
      if (card === 'DQ Journey') return title.includes('dq journey') && !title.includes('beliefs');
      if (card === 'DQ Beliefs') return title.includes('dq beliefs') || title.includes('beliefs');
      if (card === 'DQ Vision and Mission') return title.includes('vision') && (title.includes('mission') || title.includes('strategy'));
      if (card === 'DQ Strategy 2021-2030') return title.includes('dq2') || title.includes('strategic transition');
      if (card === 'DQ Competencies') return title.includes('competencies');
      if (card === 'DQ Products') return title.includes('products');
      return false;
    });
    const status = isRequired ? '✅' : '   ';
    console.log(`${status} ${g.title} (sub_domain: ${g.sub_domain})`);
  });
}

ensureGHCCards().catch(console.error);

