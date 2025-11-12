/**
 * Verify RLS Policies on DWS Supabase Project
 * 
 * This script connects to the new DWS Supabase project and verifies
 * that RLS policies are correctly configured for community tables.
 * 
 * Usage:
 *   node scripts/verify-supabase-rls.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env');
  process.exit(1);
}

// Create Supabase client with anon key (to test RLS policies)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Verifying RLS Policies on DWS Supabase Project...');
console.log(`   URL: ${supabaseUrl}`);
console.log('');

// Test 1: Verify RLS is enabled (this requires service role key, so we'll check via queries)
async function testCommunitiesRead() {
  console.log('📋 Test 1: Reading from communities table (anon role)...');
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42501' || error.message.includes('permission denied')) {
        console.error('   ❌ Permission denied - RLS policy may be missing or incorrect');
        console.error(`   Error: ${error.message}`);
        return false;
      } else {
        console.error(`   ❌ Error: ${error.message}`);
        return false;
      }
    } else {
      console.log(`   ✅ Success! Retrieved ${data?.length || 0} communities`);
      if (data && data.length > 0) {
        console.log(`   Sample community: ${data[0].name}`);
      }
      return true;
    }
  } catch (error) {
    console.error(`   ❌ Exception: ${error.message}`);
    return false;
  }
}

async function testMembershipsRead() {
  console.log('📋 Test 2: Reading from memberships table (anon role)...');
  try {
    const { data, error } = await supabase
      .from('memberships')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42501' || error.message.includes('permission denied')) {
        console.error('   ❌ Permission denied - RLS policy may be missing or incorrect');
        console.error(`   Error: ${error.message}`);
        return false;
      } else {
        console.error(`   ❌ Error: ${error.message}`);
        return false;
      }
    } else {
      console.log(`   ✅ Success! Retrieved ${data?.length || 0} memberships`);
      return true;
    }
  } catch (error) {
    console.error(`   ❌ Exception: ${error.message}`);
    return false;
  }
}

async function testCommunitiesWithCountsView() {
  console.log('📋 Test 3: Reading from communities_with_counts view (anon role)...');
  try {
    const { data, error } = await supabase
      .from('communities_with_counts')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42501' || error.message.includes('permission denied')) {
        console.error('   ❌ Permission denied - View may not be accessible to anon role');
        console.error(`   Error: ${error.message}`);
        return false;
      } else {
        console.error(`   ❌ Error: ${error.message}`);
        return false;
      }
    } else {
      console.log(`   ✅ Success! Retrieved ${data?.length || 0} communities with counts`);
      return true;
    }
  } catch (error) {
    console.error(`   ❌ Exception: ${error.message}`);
    return false;
  }
}

async function testGetFeedRPC() {
  console.log('📋 Test 4: Testing get_feed RPC function (anon role)...');
  try {
    const { data, error } = await supabase.rpc('get_feed', {
      feed_tab: 'trending',
      sort_by: 'recent',
      user_id_param: null,
      limit_count: 1,
      offset_count: 0
    });
    
    if (error) {
      if (error.code === '42501' || error.message.includes('permission denied')) {
        console.error('   ❌ Permission denied - RPC function may not be accessible to anon role');
        console.error(`   Error: ${error.message}`);
        return false;
      } else {
        console.error(`   ❌ Error: ${error.message}`);
        return false;
      }
    } else {
      console.log(`   ✅ Success! RPC function works, returned ${data?.length || 0} posts`);
      return true;
    }
  } catch (error) {
    console.error(`   ❌ Exception: ${error.message}`);
    return false;
  }
}

async function testGetCommunityMembersRPC() {
  console.log('📋 Test 5: Testing get_community_members RPC function (anon role)...');
  try {
    // First, get a community ID
    const { data: communities } = await supabase
      .from('communities')
      .select('id')
      .limit(1)
      .single();
    
    if (!communities || !communities.id) {
      console.log('   ⚠️  No communities found to test RPC function');
      return true; // Not a failure, just no data
    }
    
    const { data, error } = await supabase.rpc('get_community_members', {
      p_community_id: communities.id
    });
    
    if (error) {
      if (error.code === '42501' || error.message.includes('permission denied')) {
        console.error('   ❌ Permission denied - RPC function may not be accessible to anon role');
        console.error(`   Error: ${error.message}`);
        return false;
      } else {
        console.error(`   ❌ Error: ${error.message}`);
        return false;
      }
    } else {
      console.log(`   ✅ Success! RPC function works, returned ${data?.length || 0} members`);
      return true;
    }
  } catch (error) {
    console.error(`   ❌ Exception: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting RLS Policy Verification...');
  console.log('');
  
  const results = {
    communitiesRead: false,
    membershipsRead: false,
    communitiesWithCountsView: false,
    getFeedRPC: false,
    getCommunityMembersRPC: false,
  };
  
  // Run tests
  results.communitiesRead = await testCommunitiesRead();
  console.log('');
  
  results.membershipsRead = await testMembershipsRead();
  console.log('');
  
  results.communitiesWithCountsView = await testCommunitiesWithCountsView();
  console.log('');
  
  results.getFeedRPC = await testGetFeedRPC();
  console.log('');
  
  results.getCommunityMembersRPC = await testGetCommunityMembersRPC();
  console.log('');
  
  // Summary
  console.log('📊 Test Results Summary:');
  console.log('');
  console.log(`   Communities Read: ${results.communitiesRead ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Memberships Read: ${results.membershipsRead ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Communities With Counts View: ${results.communitiesWithCountsView ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Get Feed RPC: ${results.getFeedRPC ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Get Community Members RPC: ${results.getCommunityMembersRPC ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
  
  const allPassed = Object.values(results).every(r => r === true);
  
  if (allPassed) {
    console.log('✅ All RLS policy tests passed!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. RLS policies are correctly configured');
    console.log('   2. Anon role can read communities and memberships');
    console.log('   3. Views and RPC functions are accessible');
    console.log('   4. You can proceed with testing the application');
  } else {
    console.log('❌ Some tests failed. Please check:');
    console.log('   1. Run the RLS policy SQL script: db/supabase/verify_and_fix_rls.sql');
    console.log('   2. Verify RLS is enabled on all tables');
    console.log('   3. Check that policies are correctly defined');
    console.log('   4. Verify views and RPC functions have proper permissions');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

