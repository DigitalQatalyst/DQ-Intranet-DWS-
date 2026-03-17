import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('💡 Please set these environment variables in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkTableExists() {
  try {
    const { data, error } = await supabase
      .from('marketplace_services')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        return false;
      }
      throw error;
    }
    return true;
  } catch (error) {
    return false;
  }
}

async function runMigration() {
  console.log('🚀 Marketplace Services Migration\n');
  console.log('=' .repeat(50));

  // Check if table already exists
  console.log('\n🔍 Checking if table already exists...');
  const exists = await checkTableExists();
  
  if (exists) {
    console.log('✅ Table "marketplace_services" already exists!');
    console.log('   Migration may have already been run.');
    console.log('\n💡 To re-run the migration:');
    console.log('   1. Drop the table manually in Supabase SQL Editor');
    console.log('   2. Run this script again\n');
    return;
  }

  console.log('❌ Table does not exist - migration needed\n');

  // Read the migration SQL file
  const migrationPath = join(__dirname, '..', 'supabase', 'marketplace-services-schema.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf8');

  console.log('📄 Migration Instructions:');
  console.log('=' .repeat(50));
  console.log('\nSince Supabase requires manual SQL execution, please follow these steps:\n');
  console.log('1. Open Supabase Dashboard:');
  console.log('   https://app.supabase.com\n');
  console.log('2. Select your project\n');
  console.log('3. Click "SQL Editor" in the left sidebar\n');
  console.log('4. Click "New query"\n');
  console.log('5. Copy and paste the contents of:');
  console.log(`   ${migrationPath}\n`);
  console.log('6. Click "Run" (or press Ctrl+Enter)\n');
  console.log('7. Wait for the migration to complete\n');
  console.log('8. Verify by running: npm run db:seed-services\n');
  console.log('=' .repeat(50));
  console.log('\n💡 Migration file location:');
  console.log(`   ${migrationPath}\n`);
  console.log('📋 Alternative: Use the migration in migrations folder:');
  console.log('   supabase/migrations/20250115120000_marketplace_services.sql\n');
}

runMigration();
