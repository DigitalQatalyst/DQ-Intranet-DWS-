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

async function checkStrategyGuidesValidity() {
  console.log('🔍 Checking all Strategy guides for validity...\n');

  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title, summary, sub_domain, domain, guide_type, unit, location, hero_image_url')
    .eq('status', 'Approved')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  // Filter Strategy guides
  const strategyGuides = (allGuides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    return domain === 'strategy';
  });

  console.log(`📊 Found ${strategyGuides.length} Strategy guides:\n`);

  // Group by category
  const categories = {
    'Journey (GHC)': [],
    '6xD Framework': [],
    'GHC Framework': [],
    'History': [],
    'Initiatives': [],
    'Clients': [],
    'GHC Leader': [],
    'Cases': [],
    'References': [],
    'Testimonials/Insights': [],
    'Uncategorized': []
  };

  strategyGuides.forEach(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    const title = (g.title || '').toLowerCase();
    let categorized = false;

    // Check for Journey (GHC)
    if (subDomain.includes('journey') && subDomain.includes('ghc')) {
      categories['Journey (GHC)'].push(g);
      categorized = true;
    }
    // Check for 6xD Framework
    else if (subDomain.includes('6xd') || subDomain.includes('digital-framework')) {
      categories['6xD Framework'].push(g);
      categorized = true;
    }
    // Check for GHC Framework (not GHC Leader)
    else if (subDomain.includes('ghc') && !subDomain.includes('ghc-leader') && !subDomain.includes('ghc leader')) {
      categories['GHC Framework'].push(g);
      categorized = true;
    }
    // Check for History
    else if (subDomain.includes('history')) {
      categories['History'].push(g);
      categorized = true;
    }
    // Check for Initiatives
    else if (subDomain.includes('initiatives')) {
      categories['Initiatives'].push(g);
      categorized = true;
    }
    // Check for Clients
    else if (subDomain.includes('clients')) {
      categories['Clients'].push(g);
      categorized = true;
    }
    // Check for GHC Leader
    else if (subDomain.includes('ghc-leader') || subDomain.includes('ghc leader')) {
      categories['GHC Leader'].push(g);
      categorized = true;
    }
    // Check for Cases
    else if (subDomain.includes('cases')) {
      categories['Cases'].push(g);
      categorized = true;
    }
    // Check for References
    else if (subDomain.includes('references')) {
      categories['References'].push(g);
      categorized = true;
    }
    // Check for Testimonials/Insights
    else if (subDomain.includes('testimonials') || subDomain.includes('insights')) {
      categories['Testimonials/Insights'].push(g);
      categorized = true;
    }

    if (!categorized) {
      categories['Uncategorized'].push(g);
    }
  });

  // Display by category
  let totalValid = 0;
  let totalInvalid = 0;

  Object.entries(categories).forEach(([category, guides]) => {
    if (guides.length > 0) {
      console.log(`\n📋 ${category.toUpperCase()}: ${guides.length} guide(s)`);
      guides.forEach(g => {
        const hasImage = g.hero_image_url && 
                        g.hero_image_url !== '/image.png' && 
                        !g.hero_image_url.includes('placeholder') &&
                        g.hero_image_url.startsWith('http');
        const hasSummary = g.summary && g.summary.trim().length > 0;
        const isValid = hasImage && hasSummary;
        
        const status = isValid ? '✅' : '⚠️';
        console.log(`   ${status} ${g.title}`);
        console.log(`      Sub-Domain: ${g.sub_domain || 'null'}`);
        console.log(`      Unit: ${g.unit || 'null'}`);
        console.log(`      Location: ${g.location || 'null'}`);
        console.log(`      Image: ${hasImage ? '✅' : '❌'}`);
        console.log(`      Summary: ${hasSummary ? '✅' : '❌'}`);
        
        // Check if it looks like a valid Strategy guide
        const titleLower = (g.title || '').toLowerCase();
        const summaryLower = (g.summary || '').toLowerCase();
        const looksValid = titleLower.includes('dq') || 
                          titleLower.includes('strategy') || 
                          titleLower.includes('framework') ||
                          titleLower.includes('journey') ||
                          titleLower.includes('vision') ||
                          titleLower.includes('mission') ||
                          titleLower.includes('beliefs') ||
                          titleLower.includes('competencies') ||
                          titleLower.includes('products') ||
                          summaryLower.includes('dq') ||
                          summaryLower.includes('digital');
        
        if (!looksValid && !isValid) {
          console.log(`      ⚠️  POTENTIALLY INVALID - Doesn't look like a Strategy guide`);
          totalInvalid++;
        } else {
          totalValid++;
        }
        console.log('');
      });
    }
  });

  console.log(`\n\n📊 Summary:`);
  console.log(`   Total Strategy guides: ${strategyGuides.length}`);
  console.log(`   Valid guides: ${totalValid}`);
  console.log(`   Potentially invalid: ${totalInvalid}`);
  
  if (totalInvalid > 0) {
    console.log(`\n⚠️  Some guides may need review or removal.`);
  } else {
    console.log(`\n✅ All Strategy guides appear to be valid.`);
  }
}

checkStrategyGuidesValidity().catch(console.error);

