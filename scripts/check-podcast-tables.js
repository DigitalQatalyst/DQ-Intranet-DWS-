/**
 * Check if podcast tables exist and show their data
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking podcast tables...\n');

  try {
    // Check podcast_series
    const { data: series, error: seriesError } = await supabase
      .from('podcast_series')
      .select('*');

    if (seriesError) {
      console.log('❌ podcast_series table error:', seriesError.message);
    } else {
      console.log('✅ podcast_series table exists');
      console.log(`   Found ${series.length} series\n`);
      if (series.length > 0) {
        console.log('   Series:', series.map(s => s.title).join(', '));
      }
    }

    // Check podcast_episodes
    const { data: episodes, error: episodesError } = await supabase
      .from('podcast_episodes')
      .select('id, episode_number, title')
      .order('episode_number');

    if (episodesError) {
      console.log('\n❌ podcast_episodes table error:', episodesError.message);
    } else {
      console.log('\n✅ podcast_episodes table exists');
      console.log(`   Found ${episodes.length} episodes\n`);
      if (episodes.length > 0) {
        episodes.forEach(ep => {
          console.log(`   EP${ep.episode_number}: ${ep.title}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTables();
