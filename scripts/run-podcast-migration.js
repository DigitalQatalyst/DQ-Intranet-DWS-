/**
 * Run podcast migration - creates tables and migrates data
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL migration file
const sqlMigration = readFileSync(
  join(__dirname, '..', 'supabase', 'migrations', '20250224000000_create_podcast_tables.sql'),
  'utf-8'
);

async function runMigration() {
  console.log('🚀 Starting podcast migration...\n');

  try {
    // Execute SQL migration
    console.log('📝 Creating podcast tables...');
    
    const { error: sqlError } = await supabase.rpc('exec_sql', { sql: sqlMigration });
    
    if (sqlError) {
      console.error('❌ Error executing SQL migration:', sqlError.message);
      console.log('\n⚠️  Trying alternative approach...');
      
      // Alternative: Use the REST API to execute SQL
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ query: sqlMigration })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to execute migration: ${response.statusText}`);
      }
    }

    console.log('✅ Tables created successfully!\n');
    console.log('✨ Migration completed!');
    console.log('\n📌 Next step: Run the data migration with:');
    console.log('   node scripts/migrate-podcast-data.js');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n💡 You can also run the migration manually:');
    console.log('   1. Go to your Supabase dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Copy and paste the contents of:');
    console.log('      supabase/migrations/20250224000000_create_podcast_tables.sql');
    console.log('   4. Execute the SQL');
    console.log('   5. Then run: node scripts/migrate-podcast-data.js');
    process.exit(1);
  }
}

runMigration();
