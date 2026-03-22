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

async function checkGuidelinesFormat() {
  console.log('📋 Checking format of existing guidelines...\n');

  const { data: guidelines, error } = await supabase
    .from('guides')
    .select('slug, title, body')
    .eq('domain', 'guidelines')
    .eq('status', 'Approved')
    .order('title', { ascending: true });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  guidelines.forEach((guide, index) => {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`${index + 1}. ${guide.title}`);
    console.log(`   Slug: ${guide.slug}`);
    console.log(`\n   Body Preview (first 1000 chars):`);
    console.log(`   ${'-'.repeat(78)}`);
    
    if (guide.body) {
      const preview = guide.body.substring(0, 1000);
      console.log(`   ${preview}${guide.body.length > 1000 ? '...' : ''}`);
      
      // Check for markdown structure
      const hasH1 = guide.body.includes('# ');
      const hasH2 = guide.body.includes('## ');
      const hasH3 = guide.body.includes('### ');
      
      console.log(`\n   Markdown Structure:`);
      console.log(`   - H1 (# ): ${hasH1 ? '✅' : '❌'}`);
      console.log(`   - H2 (## ): ${hasH2 ? '✅' : '❌'}`);
      console.log(`   - H3 (### ): ${hasH3 ? '✅' : '❌'}`);
      
      // Count sections
      const h1Count = (guide.body.match(/^# /gm) || []).length;
      const h2Count = (guide.body.match(/^## /gm) || []).length;
      const h3Count = (guide.body.match(/^### /gm) || []).length;
      
      console.log(`   - H1 count: ${h1Count}`);
      console.log(`   - H2 count: ${h2Count}`);
      console.log(`   - H3 count: ${h3Count}`);
      
      // Show first few lines
      const lines = guide.body.split('\n').slice(0, 20);
      console.log(`\n   First 20 lines:`);
      lines.forEach((line, i) => {
        if (line.trim()) {
          console.log(`   ${String(i + 1).padStart(3)}: ${line.substring(0, 75)}${line.length > 75 ? '...' : ''}`);
        }
      });
    } else {
      console.log('   ❌ No body content');
    }
  });

  console.log(`\n\n${'='.repeat(80)}`);
  console.log('📊 SUMMARY OF FORMAT PATTERNS:');
  console.log(`${'='.repeat(80)}\n`);
  
  // Analyze common patterns
  const allBodies = guidelines.map(g => g.body || '').filter(Boolean);
  
  if (allBodies.length > 0) {
    // Check if they all start with H1
    const allStartWithH1 = allBodies.every(body => body.trim().startsWith('# '));
    console.log(`All start with H1 (# ): ${allStartWithH1 ? '✅' : '❌'}`);
    
    // Check common section patterns
    const commonSections = ['Overview', 'Purpose', 'Scope', 'Process', 'Responsibilities', 'Tools'];
    commonSections.forEach(section => {
      const count = allBodies.filter(body => 
        body.includes(`## ${section}`) || body.includes(`# ${section}`)
      ).length;
      console.log(`Section "${section}": ${count}/${allBodies.length} guidelines`);
    });
  }
}

checkGuidelinesFormat().catch(console.error);


