import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n=== Supabase Configuration Check ===\n');

// Check if env variables are set
console.log('1. Environment Variables:');
console.log(`   VITE_SUPABASE_URL: ${url ? '✓ Set' : '✗ Missing'}`);
console.log(`   VITE_SUPABASE_ANON_KEY: ${anon ? '✓ Set' : '✗ Missing'}`);

if (!url || !anon) {
  console.error('\n❌ Error: Missing Supabase credentials in .env file');
  console.log('\nPlease ensure your .env file has:');
  console.log('   VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.log('   VITE_SUPABASE_ANON_KEY=your-anon-key-here');
  process.exit(1);
}

// Check if they're placeholder values
if (url.includes('your-project') || anon.includes('your-anon-key')) {
  console.error('\n❌ Error: Placeholder values detected in .env file');
  console.log('\nYou need to replace these with actual Supabase credentials:');
  console.log('   1. Go to https://supabase.com/dashboard');
  console.log('   2. Select your project or create a new one');
  console.log('   3. Go to Settings > API');
  console.log('   4. Copy the Project URL and anon/public key');
  process.exit(1);
}

console.log('\n2. Testing Connection...');

const supabase = createClient(url, anon);

async function testConnection() {
  try {
    // Test 1: Check if news_categories table exists
    console.log('\n3. Checking Database Schema:');
    const { data: categories, error: catError } = await supabase
      .from('news_categories')
      .select('*')
      .limit(1);
    
    if (catError) {
      console.error('   ✗ news_categories table:', catError.message);
      console.log('\n❌ Database schema not found. You need to run migrations:');
      console.log('   1. Go to your Supabase dashboard');
      console.log('   2. Open the SQL Editor');
      console.log('   3. Run the contents of: supabase/migrations/create_news_schema.sql');
      return;
    }
    console.log('   ✓ news_categories table exists');

    // Test 2: Check if news_articles_with_details view exists
    const { data: articles, error: artError } = await supabase
      .from('news_articles_with_details')
      .select('*')
      .limit(1);
    
    if (artError) {
      console.error('   ✗ news_articles_with_details view:', artError.message);
      return;
    }
    console.log('   ✓ news_articles_with_details view exists');

    // Test 3: Check for published articles
    console.log('\n4. Checking for Published Articles:');
    const { data: published, error: pubError, count } = await supabase
      .from('news_articles_with_details')
      .select('*', { count: 'exact' })
      .eq('status', 'published');
    
    if (pubError) {
      console.error('   ✗ Error fetching articles:', pubError.message);
      return;
    }

    console.log(`   Found ${count || 0} published article(s)`);
    
    if (count === 0) {
      console.log('\n❌ No published articles found. You need to seed the database:');
      console.log('   1. Go to your Supabase dashboard');
      console.log('   2. Open the SQL Editor');
      console.log('   3. Run the contents of: supabase/seed.sql');
      return;
    }

    console.log('\n✓ All checks passed! Your Supabase setup looks good.');
    console.log('\nSample articles:');
    published?.slice(0, 3).forEach(article => {
      console.log(`   - ${article.title} (${article.category_name})`);
    });

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.error(error);
  }
}

testConnection();
