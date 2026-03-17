// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', url);
console.log('Key exists:', !!key);

if (url && key) {
  const client = createClient(url, key);
  
  // Test news table
  client.from('news').select('count', { count: 'exact' })
    .then(result => {
      if (result.error) {
        console.error('News table error:', result.error);
      } else {
        console.log('News table connection: SUCCESS');
        console.log('News count:', result.count);
      }
    })
    .catch(err => console.error('News table exception:', err));
  
  // Test jobs table
  client.from('jobs').select('count', { count: 'exact' })
    .then(result => {
      if (result.error) {
        console.error('Jobs table error:', result.error);
      } else {
        console.log('Jobs table connection: SUCCESS');
        console.log('Jobs count:', result.count);
      }
    })
    .catch(err => console.error('Jobs table exception:', err));
} else {
  console.error('Missing environment variables');
}
