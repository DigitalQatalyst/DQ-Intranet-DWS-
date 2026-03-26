// Debug script to check Supabase environment and connection
require('dotenv').config();

console.log('=== Supabase Environment Variables Debug ===');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

// Test Supabase connection
if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
    
    console.log('\n=== Testing Supabase Connection ===');
    console.log('Supabase URL:', process.env.VITE_SUPABASE_URL);
    console.log('Anon Key Length:', process.env.VITE_SUPABASE_ANON_KEY.length);
    
    // Test basic connection
    supabase.from('news').select('count').then(result => {
      console.log('\n=== News Table Test ===');
      console.log('Success:', !result.error);
      console.log('Error:', result.error?.message || 'None');
      console.log('Data:', result.data);
    });
    
    supabase.from('jobs').select('count').then(result => {
      console.log('\n=== Jobs Table Test ===');
      console.log('Success:', !result.error);
      console.log('Error:', result.error?.message || 'None');
      console.log('Data:', result.data);
    });
    
  } catch (error) {
    console.error('Error creating Supabase client:', error.message);
  }
} else {
  console.log('\n❌ Missing required environment variables');
}
