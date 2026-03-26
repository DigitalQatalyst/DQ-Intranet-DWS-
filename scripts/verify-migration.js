import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('🔍 Verifying migration...\n');

  try {
    const { data, error } = await supabase
      .from('guides')
      .select('id, slug, title, body')
      .eq('slug', 'dq-associate-owned-asset-guidelines')
      .single();

    if (error) throw error;

    console.log('✅ Guide found in database:');
    console.log(`   ID: ${data.id}`);
    console.log(`   Slug: ${data.slug}`);
    console.log(`   Title: ${data.title}`);
    
    if (data.body) {
      const content = JSON.parse(data.body);
      console.log(`\n📊 Content structure:`);
      console.log(`   Total sections: ${content.sections.length}`);
      console.log(`   Text sections: ${content.sections.filter(s => s.type === 'text').length}`);
      console.log(`   Table sections: ${content.sections.filter(s => s.type === 'table').length}`);
      
      console.log(`\n📋 Sections:`);
      content.sections.forEach(section => {
        const type = section.type === 'table' ? `[TABLE: ${section.table?.data?.length || 0} rows]` : '[TEXT]';
        console.log(`   ${section.order}. ${section.title} ${type}`);
      });
      
      console.log('\n✅ Migration verified successfully!');
      console.log('\n🎉 The guideline is now database-driven!');
      console.log('\nYou can now:');
      console.log('1. Start your dev server: npm run dev');
      console.log('2. Navigate to: http://localhost:3004/marketplace/guides/dq-associate-owned-asset-guidelines');
      console.log('3. Verify all content displays correctly');
    } else {
      console.log('⚠️  Warning: body field is empty');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verify();
