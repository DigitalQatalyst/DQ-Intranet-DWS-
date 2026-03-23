import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'node:fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('📝 Migrating Associate Owned Asset Guidelines...\n');

  // Read the JSON data file — path is fixed relative to this script
  const dataPath = new URL('./guideline-data/associate-owned-asset-data.json', import.meta.url).pathname;
  const guidelineData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  try {
    // Check if guide exists
    const { data: existing } = await supabase
      .from('guides')
      .select('id')
      .eq('slug', guidelineData.slug)
      .maybeSingle();

    const contentJson = JSON.stringify({ sections: guidelineData.sections });

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('guides')
        .update({
          body: contentJson,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) throw error;
      console.log('✅ Updated existing guide');
    } else {
      // Create new
      const { error } = await supabase
        .from('guides')
        .insert({
          slug: guidelineData.slug,
          title: guidelineData.title,
          summary: guidelineData.summary,
          domain: 'Guidelines',
          guide_type: 'Guideline',
          status: 'Approved',
          body: contentJson,
          last_updated_at: new Date().toISOString()
        });

      if (error) throw error;
      console.log('✅ Created new guide');
    }

    console.log(`\n📊 Migrated ${guidelineData.sections.length} sections`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

migrate();
