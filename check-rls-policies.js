/**
 * Check RLS policies and test access
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

const url = process.env.VITE_SUPABASE_URL || '';
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('🔍 Testing Access with Different Keys...\n');

// Test 1: Anon key (what the frontend uses)
console.log('1️⃣ Testing with ANON key (frontend):');
const supabaseAnon = createClient(url, anonKey);
const { data: anonData, error: anonError, count: anonCount } = await supabaseAnon
  .from('guides')
  .select('*', { count: 'exact' })
  .limit(1);

if (anonError) {
  console.log('   ❌ Error:', anonError.message);
  console.log('   Code:', anonError.code);
} else {
  console.log(`   ✅ Success! Found ${anonCount || 0} guides`);
  if (anonData && anonData.length > 0) {
    console.log('   Sample:', anonData[0].title || anonData[0].id);
  }
}

// Test 2: Service role key (should bypass RLS)
console.log('\n2️⃣ Testing with SERVICE ROLE key (admin):');
const supabaseAdmin = createClient(url, serviceKey);
const { data: adminData, error: adminError, count: adminCount } = await supabaseAdmin
  .from('guides')
  .select('*', { count: 'exact' })
  .limit(1);

if (adminError) {
  console.log('   ❌ Error:', adminError.message);
  console.log('   Code:', adminError.code);
  console.log('   Details:', adminError.details);
} else {
  console.log(`   ✅ Success! Found ${adminCount || 0} guides`);
  if (adminData && adminData.length > 0) {
    console.log('   Sample:', adminData[0].title || adminData[0].id);
  }
}

// Test 3: Try to get only approved guides (what the policy should allow)
console.log('\n3️⃣ Testing with status filter (Approved only):');
const { data: approvedData, error: approvedError, count: approvedCount } = await supabaseAnon
  .from('guides')
  .select('*', { count: 'exact' })
  .eq('status', 'Approved')
  .limit(1);

if (approvedError) {
  console.log('   ❌ Error:', approvedError.message);
} else {
  console.log(`   ✅ Success! Found ${approvedCount || 0} approved guides`);
}

// Test 4: Check what statuses exist
console.log('\n4️⃣ Checking guide statuses:');
const { data: statusData, error: statusError } = await supabaseAdmin
  .from('guides')
  .select('status')
  .limit(10);

if (!statusError && statusData) {
  const statuses = [...new Set(statusData.map(g => g.status))];
  console.log('   Found statuses:', statuses.join(', '));
  console.log('   ⚠️  If guides have status "Draft" or "Published", they won\'t show with anon key!');
  console.log('   💡 The policy only allows status = "Approved"');
}

console.log('\n✅ Tests complete!\n');


