/**
 * Test Supabase connection - run this in browser console
 * Copy and paste this entire function, then call: testSupabaseConnection()
 */
export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  
  // Check env vars
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('1. Environment Variables:');
  console.log('   URL:', url || '❌ MISSING');
  console.log('   Anon Key:', anon ? `${anon.substring(0, 20)}...` : '❌ MISSING');
  console.log('');
  
  if (!url || !anon) {
    console.error('❌ Environment variables are missing!');
    console.error('   Create .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    console.error('   Then restart dev server: npm run dev');
    return;
  }
  
  // Test basic fetch
  console.log('2. Testing basic connection...');
  try {
    const testUrl = `${url}/rest/v1/work_positions?select=id&limit=1`;
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'apikey': anon,
        'Authorization': `Bearer ${anon}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('   Status:', response.status, response.statusText);
    console.log('   Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const text = await response.text();
      console.error('   ❌ Response error:', text);
      return;
    }
    
    const data = await response.json();
    console.log('   ✅ Connection successful!');
    console.log('   Data:', data);
  } catch (err) {
    console.error('   ❌ Connection failed:', err);
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      console.error('   This is a CORS or network error.');
      console.error('   Solutions:');
      console.error('   1. Check Supabase Dashboard → Settings → API → Add localhost:3004 to allowed origins');
      console.error('   2. Verify the Supabase URL is correct');
      console.error('   3. Check your network connection');
    }
  }
  
  // Test with Supabase client
  console.log('\n3. Testing with Supabase client...');
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, anon);
    
    const { data, error } = await supabase
      .from('work_positions')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('   ❌ Supabase client error:', error);
      console.error('   Code:', error.code);
      console.error('   Message:', error.message);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);
    } else {
      console.log('   ✅ Supabase client works!');
      console.log('   Data:', data);
    }
  } catch (err) {
    console.error('   ❌ Supabase client failed:', err);
  }
}

// Make it available globally in dev mode
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).testSupabaseConnection = testSupabaseConnection;
  console.log('💡 Run testSupabaseConnection() in console to diagnose connection issues');
}

