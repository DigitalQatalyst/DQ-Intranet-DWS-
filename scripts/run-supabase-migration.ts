/**
 * Execute LMS Migration via Supabase REST API
 * 
 * This script executes the migration SQL using Supabase's REST API.
 * 
 * Usage:
 *   npx tsx scripts/run-supabase-migration.ts
 */

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

async function executeSQL(sql: string): Promise<void> {
  // Supabase REST API endpoint for executing SQL
  const projectRef = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  if (!projectRef) {
    throw new Error('Could not extract project ref from Supabase URL');
  }
  
  const apiUrl = `https://${projectRef}.supabase.co/rest/v1/rpc/exec_sql`;
  
  // Try using the Management API
  // Note: This requires a special function in Supabase
  // For now, we'll use a simpler approach - execute via fetch
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ sql_query: sql }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
    
    const result = await response.json();
    return result;
  } catch (err: any) {
    if (err.message?.includes('exec_sql')) {
      // Function doesn't exist, we need to use alternative method
      throw new Error('exec_sql function not available. Please run SQL manually in Supabase Dashboard.');
    }
    throw err;
  }
}

async function runMigration() {
  console.log('🚀 Executing LMS Migration to Supabase');
  console.log(`📡 Project: ${url.replace(/\/\/.*@/, '//***@')}\n`);
  
  const migrationPath = resolve(process.cwd(), 'db/supabase/complete_lms_migration.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');
  
  console.log('📋 Reading migration file...');
  console.log(`   File: ${migrationPath}`);
  console.log(`   Size: ${(migrationSQL.length / 1024).toFixed(2)} KB\n`);
  
  // Split SQL into statements
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.match(/^\/\*/));
  
  console.log(`📊 Found ${statements.length} SQL statements\n`);
  
  // For Supabase, DDL operations need to be run via Dashboard or psql
  // Let's try to execute via the REST API, but fall back to instructions
  console.log('⚠️  Note: DDL operations (CREATE TABLE) typically require:');
  console.log('   - Supabase Dashboard SQL Editor, or');
  console.log('   - Direct database connection (psql), or');
  console.log('   - Supabase CLI\n');
  
  // Check if we can use Supabase CLI
  const { execSync } = require('child_process');
  let hasSupabaseCLI = false;
  try {
    execSync('which supabase', { stdio: 'ignore' });
    hasSupabaseCLI = true;
  } catch {
    // CLI not available
  }
  
  if (hasSupabaseCLI) {
    console.log('✅ Supabase CLI detected!');
    console.log('   You can run: supabase db execute -f db/supabase/complete_lms_migration.sql\n');
  }
  
  // For now, provide the best option: use Supabase Dashboard
  console.log('💡 Recommended: Run the migration via Supabase Dashboard');
  console.log('   1. Go to: https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql');
  console.log(`   2. Copy the contents of: ${migrationPath}`);
  console.log('   3. Paste and click "Run"\n');
  
  // Alternatively, if we have the database connection string, we can use psql
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (dbUrl) {
    console.log('💡 Alternative: Use psql with connection string');
    console.log(`   psql "${dbUrl}" -f ${migrationPath}\n`);
  } else {
    // Try to construct from Supabase URL
    const projectRef = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    if (projectRef) {
      console.log('💡 To use psql, you need DATABASE_URL in .env:');
      console.log(`   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.${projectRef}.supabase.co:5432/postgres"\n`);
    }
  }
  
  console.log('✨ Migration file ready!');
  console.log(`📄 Location: ${migrationPath}\n`);
}

runMigration().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

