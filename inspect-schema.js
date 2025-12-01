/**
 * Try to inspect the database schema
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

const url = process.env.VITE_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(url, serviceKey);

console.log('🔍 Trying different query methods...\n');

// Method 1: Try to get table info via RPC
console.log('Method 1: Try RPC function...');
try {
  const { data, error } = await supabaseAdmin.rpc('exec_sql', {
    query: "SELECT COUNT(*) FROM guides"
  });
  console.log('  Result:', data);
  console.log('  Error:', error);
} catch (e) {
  console.log('  Error:', e.message);
}

// Method 2: Try direct SQL via REST
console.log('\nMethod 2: Try REST API directly...');
try {
  const response = await fetch(`${url}/rest/v1/guides?select=count&limit=1`, {
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    }
  });
  console.log('  Status:', response.status);
  console.log('  Status Text:', response.statusText);
  const text = await response.text();
  console.log('  Response:', text.substring(0, 200));
} catch (e) {
  console.log('  Error:', e.message);
}

// Method 3: Check if we can query a system table
console.log('\nMethod 3: Try querying information_schema...');
const { data: schemaData, error: schemaError } = await supabaseAdmin
  .from('information_schema.tables')
  .select('table_name')
  .eq('table_schema', 'public')
  .limit(5);

console.log('  Data:', schemaData);
console.log('  Error:', schemaError);

// Method 4: Try a simple health check
console.log('\nMethod 4: Health check...');
try {
  const healthResponse = await fetch(`${url}/rest/v1/`, {
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    }
  });
  console.log('  Status:', healthResponse.status);
} catch (e) {
  console.log('  Error:', e.message);
}


