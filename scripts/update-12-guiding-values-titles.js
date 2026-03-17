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

const guidingValues = [
  { slug: 'dq-competencies-emotional-intelligence', currentTitle: 'Emotional Intelligence', newTitle: 'Emotional Intelligence (HoV)' },
  { slug: 'dq-competencies-growth-mindset', currentTitle: 'Growth Mindset', newTitle: 'Growth Mindset (HoV)' },
  { slug: 'dq-competencies-purpose', currentTitle: 'Purpose', newTitle: 'Purpose (HoV)' },
  { slug: 'dq-competencies-perceptive', currentTitle: 'Perceptive', newTitle: 'Perceptive (HoV)' },
  { slug: 'dq-competencies-proactive', currentTitle: 'Proactive', newTitle: 'Proactive (HoV)' },
  { slug: 'dq-competencies-perseverance', currentTitle: 'Perseverance', newTitle: 'Perseverance (HoV)' },
  { slug: 'dq-competencies-precision', currentTitle: 'Precision', newTitle: 'Precision (HoV)' },
  { slug: 'dq-competencies-customer', currentTitle: 'Customer', newTitle: 'Customer (HoV)' },
  { slug: 'dq-competencies-learning', currentTitle: 'Learning', newTitle: 'Learning (HoV)' },
  { slug: 'dq-competencies-collaboration', currentTitle: 'Collaboration', newTitle: 'Collaboration (HoV)' },
  { slug: 'dq-competencies-responsibility', currentTitle: 'Responsibility', newTitle: 'Responsibility (HoV)' },
  { slug: 'dq-competencies-trust', currentTitle: 'Trust', newTitle: 'Trust (HoV)' },
];

async function updateGuidingValuesTitles() {
  console.log('📝 Updating 12 Guiding Values titles to include (HoV)...\n');

  for (const value of guidingValues) {
    const { data, error } = await supabase
      .from('guides')
      .update({ title: value.newTitle })
      .eq('slug', value.slug)
      .select('id, slug, title');

    if (error) {
      console.error(`❌ Error updating ${value.slug}:`, error);
    } else if (data && data.length > 0) {
      console.log(`✅ Updated: ${value.currentTitle} → ${value.newTitle}`);
    } else {
      console.log(`⚠️  Not found: ${value.slug} (${value.currentTitle})`);
    }
  }

  console.log('\n✅ Update complete!');
}

updateGuidingValuesTitles().catch(console.error);


