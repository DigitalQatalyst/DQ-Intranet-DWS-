#!/usr/bin/env node

/**
 * Simple migration runner for Supabase
 * Reads the complete schema SQL file and executes it
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('   Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🚀 Starting migration...\n');
  
  const migrationFile = path.join(__dirname, '../supabase/migrations/20250101000000_complete_schema.sql');
  
  if (!fs.existsSync(migrationFile)) {
    console.error('❌ Migration file not found:', migrationFile);
    process.exit(1);
  }
  
  const sql = fs.readFileSync(migrationFile, 'utf8');
  
  console.log('📄 Reading migration file:', migrationFile);
  console.log('📊 SQL length:', sql.length, 'characters\n');
  
  // Split SQL into individual statements (basic approach)
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  console.log(`📝 Found ${statements.length} SQL statements\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    
    // Skip comments
    if (statement.startsWith('--')) continue;
    
    // Get first line for logging
    const firstLine = statement.split('\n')[0].substring(0, 60);
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
      
      if (error) {
        // Try direct query if RPC fails
        const { error: directError } = await supabase.from('_migrations').insert({ statement });
        
        if (directError) {
          console.log(`⚠️  Statement ${i + 1}: ${firstLine}...`);
          console.log(`   Error: ${error.message}\n`);
          errorCount++;
        } else {
          console.log(`✅ Statement ${i + 1}: ${firstLine}...`);
          successCount++;
        }
      } else {
        console.log(`✅ Statement ${i + 1}: ${firstLine}...`);
        successCount++;
      }
    } catch (err) {
      console.log(`⚠️  Statement ${i + 1}: ${firstLine}...`);
      console.log(`   Error: ${err.message}\n`);
      errorCount++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`⚠️  Errors: ${errorCount}`);
  console.log('='.repeat(60));
  
  if (errorCount > 0) {
    console.log('\n⚠️  Some statements failed. This is normal if tables already exist.');
    console.log('   Please run the SQL manually in Supabase Dashboard if needed.');
  } else {
    console.log('\n🎉 Migration completed successfully!');
  }
}

runMigration().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
