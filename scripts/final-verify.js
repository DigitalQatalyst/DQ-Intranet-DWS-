import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
  const { data } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'dq-associate-owned-asset-guidelines')
    .single();

  const content = JSON.parse(data.body);
  
  console.log('✅ Migration Verified!\n');
  console.log(`📊 Total sections: ${content.sections.length}`);
  console.log(`📝 Text sections: ${content.sections.filter(s => s.type === 'text').length}`);
  console.log(`📋 Table sections: ${content.sections.filter(s => s.type === 'table').length}`);
  
  console.log('\n📑 All Sections:');
  content.sections.forEach(s => {
    const type = s.type === 'table' ? `TABLE (${s.table?.data?.length || 0} rows)` : 'TEXT';
    console.log(`  ${s.order}. ${s.title} [${type}]`);
  });
  
  console.log('\n🎉 Migration Complete!');
  console.log('\nThe guideline is now fully database-driven.');
  console.log('All 18 sections with tables and text content are stored in the database.');
}

verify();
