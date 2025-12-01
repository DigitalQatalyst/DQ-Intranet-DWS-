/**
 * Simple test to see what we can query
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

const url = process.env.VITE_SUPABASE_URL || '';
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('Testing with anon key...');
const supabase = createClient(url, anonKey);

const { data, error, count } = await supabase
  .from('guides')
  .select('*', { count: 'exact' })
  .limit(1);

console.log('Anon key result:');
console.log('  Error:', error);
console.log('  Count:', count);
console.log('  Data:', data);

console.log('\nTesting with service role key...');
const supabaseAdmin = createClient(url, serviceKey);

const { data: adminData, error: adminError, count: adminCount } = await supabaseAdmin
  .from('guides')
  .select('*', { count: 'exact' })
  .limit(1);

console.log('Service role result:');
console.log('  Error:', adminError);
console.log('  Count:', adminCount);
console.log('  Data:', adminData);


