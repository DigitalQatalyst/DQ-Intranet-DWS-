import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env files
config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createGuidesTable() {
  try {
    console.log('🔄 Attempting to create guides table...');

    // Try to insert a test record to see if table exists
    const { data: testData, error: testError } = await supabase
      .from('guides')
      .select('id')
      .limit(1);

    if (testError && testError.code === 'PGRST116') {
      console.log('❌ Guides table does not exist');
      console.log('\n📋 To fix this, you need to:');
      console.log('1. Go to your Supabase dashboard: https://app.supabase.com');
      console.log('2. Select your project');
      console.log('3. Navigate to SQL Editor');
      console.log('4. Copy and paste the SQL from create-guides-table.sql');
      console.log('5. Run the SQL to create the table');
      console.log('\nAlternatively, you can:');
      console.log('- Use the Table Editor in Supabase to create the table manually');
      console.log('- Import the schema from schema.sql if available');
    } else if (testError) {
      console.log('❌ Error accessing guides table:', testError.message);
    } else {
      console.log('✅ Guides table exists and is accessible');
      console.log(`📊 Found ${testData?.length || 0} records`);
      
      // Test inserting a sample record
      const { data: insertData, error: insertError } = await supabase
        .from('guides')
        .insert({
          slug: 'test-guide-' + Date.now(),
          title: 'Test Guide',
          summary: 'A test guide to verify table functionality',
          body: '# Test Guide\n\nThis is a test.',
          status: 'Approved',
          domain: 'Strategy'
        })
        .select();

      if (insertError) {
        console.log('⚠️ Cannot insert test record:', insertError.message);
      } else {
        console.log('✅ Successfully inserted test record');
        
        // Clean up test record
        await supabase
          .from('guides')
          .delete()
          .eq('id', insertData[0].id);
        console.log('🧹 Cleaned up test record');
      }
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the test
createGuidesTable();