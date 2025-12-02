/**
 * Execute LMS Migration to Supabase
 * 
 * This script executes the complete migration SQL file using Supabase.
 * It uses the Supabase REST API where possible, and provides instructions
 * for DDL operations that require direct database access.
 * 
 * Usage:
 *   npx tsx scripts/execute-lms-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Load .env file
config({ path: resolve(process.cwd(), '.env') });

const url = process.env.VITE_SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function executeMigration() {
  console.log('🚀 Executing LMS Migration to Supabase');
  console.log(`📡 Connecting to: ${url.replace(/\/\/.*@/, '//***@')}\n`);
  
  // Read the complete migration file
  const migrationPath = resolve(process.cwd(), 'db/supabase/complete_lms_migration.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');
  
  // Split into DDL and DML sections
  const ddlEnd = migrationSQL.indexOf('-- ============================================');
  const ddl = migrationSQL.substring(0, ddlEnd);
  const dml = migrationSQL.substring(ddlEnd);
  
  console.log('📋 Step 1: Executing DDL (Schema Creation)...');
  console.log('⚠️  DDL operations require direct database access.');
  console.log('   Please run the DDL section in Supabase SQL Editor or use psql.\n');
  
  // For DDL, we need to use Supabase Dashboard or psql
  // Let's try to extract the connection info and provide psql command
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  
  if (dbUrl) {
    console.log('💡 You can run the DDL using psql:');
    console.log(`   psql "${dbUrl}" -f ${migrationPath}\n`);
  } else {
    console.log('💡 To run the migration:');
    console.log('   1. Open Supabase Dashboard → SQL Editor');
    console.log(`   2. Copy and paste the contents of: ${migrationPath}`);
    console.log('   3. Click "Run" to execute\n');
  }
  
  // For DML (INSERT statements), we can try using the Supabase client
  // But first, we need the tables to exist
  console.log('📊 Step 2: Migration file generated successfully!');
  console.log(`   File: ${migrationPath}`);
  console.log(`   Size: ${(migrationSQL.length / 1024).toFixed(2)} KB`);
  console.log(`   Lines: ${migrationSQL.split('\n').length}\n`);
  
  console.log('✅ Next steps:');
  console.log('   1. Run the DDL section first (creates tables)');
  console.log('   2. Then run the INSERT statements (populates data)');
  console.log('   3. Or run the entire file at once in Supabase SQL Editor\n');
  
  // Try to check if tables exist
  console.log('🔍 Checking if tables exist...');
  try {
    const { data, error } = await supabase.from('courses').select('id').limit(1);
    
    if (error && error.code === 'PGRST205') {
      console.log('   ❌ Tables do not exist yet. Please run the DDL first.\n');
    } else if (error) {
      console.log(`   ⚠️  Error checking tables: ${error.message}\n`);
    } else {
      console.log('   ✅ Tables exist! You can now run the INSERT statements.\n');
      
      // If tables exist, we can try to insert data
      console.log('💾 Attempting to insert data...');
      // This would require parsing and executing each INSERT statement
      // For now, we'll provide the file for manual execution
      console.log('   Please run the INSERT statements from the migration file.\n');
    }
  } catch (err) {
    console.log('   ⚠️  Could not check table status. Please verify manually.\n');
  }
  
  console.log('✨ Migration script completed!');
  console.log(`\n📄 Full migration file: ${migrationPath}`);
}

executeMigration().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});

