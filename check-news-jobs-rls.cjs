// Script to check RLS policies specifically for news and jobs tables
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// Helper function to test table access
async function testTableAccess(supabase, tableName) {
  console.log(`\n� Testing ${tableName.toUpperCase()} table access:`);
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(1);

    if (error) {
      console.log(`   ❌ ${tableName} access failed:`, error.message);
      console.log('   Code:', error.code);
      console.log('   Details:', error.details);
      return { success: false, error };
    } else {
      console.log(`   ✅ ${tableName} access success! Found ${count || 0} items`);
      if (data && data.length > 0) {
        console.log(`   Sample ${tableName} ID:`, data[0].id);
      }
      return { success: true, data, count };
    }
  } catch (error) {
    console.error(`   ❌ ${tableName} test error:`, error.message);
    return { success: false, error };
  }
}

// Helper function to check table existence
async function checkTableExistence(supabase, tableNames) {
  console.log('\n🔍 Checking if tables exist:');
  try {
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', tableNames);

    if (error) {
      console.log('   ❌ Cannot check table existence:', error.message);
      return { success: false, error };
    }

    const foundTables = tables?.map(t => t.table_name) || [];
    console.log('   Found tables:', foundTables.join(', ') || 'None');
    
    tableNames.forEach(tableName => {
      if (!foundTables.includes(tableName)) {
        console.log(`   ⚠️  ${tableName.toUpperCase()} table does not exist!`);
      }
    });

    return { success: true, foundTables };
  } catch (error) {
    console.error('   ❌ Table existence check error:', error.message);
    return { success: false, error };
  }
}

// Helper function to print recommendations
function printRecommendations() {
  console.log('\n🔧 RECOMMENDATIONS:');
  console.log('1. If tables exist but access is denied, check RLS policies in Supabase dashboard');
  console.log('2. Ensure anon role has SELECT permission on news and jobs tables');
  console.log('3. Tables might need RLS policies like:');
  console.log('   CREATE POLICY "Enable read access for all users" ON news FOR SELECT USING (true);');
  console.log('   CREATE POLICY "Enable read access for all users" ON jobs FOR SELECT USING (true);');
}

async function checkNewsJobsRLS() {
  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
    console.log('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  );

  console.log('=== Checking News & Jobs Table Access ===');

  // Test news and jobs table access
  await testTableAccess(supabase, 'news');
  await testTableAccess(supabase, 'jobs');

  // Check if tables exist
  await checkTableExistence(supabase, ['news', 'jobs']);

  // Print recommendations
  printRecommendations();
}

checkNewsJobsRLS();
