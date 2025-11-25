/**
 * Check Test User Memberships Script
 * 
 * Checks if "Test User" is a member of any communities.
 * 
 * Usage:
 *   npx tsx scripts/check-test-user-memberships.ts
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkTestUserMemberships() {
  console.log('Checking Test User memberships...');
  console.log('');

  try {
    // Step 1: Find Test User
    console.log('Step 1: Finding Test User...');
    const { data: testUser, error: userError } = await supabase
      .from('users_local')
      .select('id, username, email')
      .eq('username', 'Test User')
      .maybeSingle();

    if (userError) {
      console.error('Error finding Test User:', userError);
      throw userError;
    }

    if (!testUser) {
      console.log('❌ Test User not found in users_local table');
      console.log('');
      console.log('Run the create-test-user script first:');
      console.log('  npx tsx scripts/create-test-user.ts');
      return;
    }

    console.log(`✓ Found Test User:`);
    console.log(`  ID: ${testUser.id}`);
    console.log(`  Username: ${testUser.username}`);
    console.log(`  Email: ${testUser.email}`);
    console.log('');

    // Step 2: Check memberships
    console.log('Step 2: Checking community memberships...');
    const { data: memberships, error: membershipError } = await supabase
      .from('memberships')
      .select(`
        id,
        joined_at,
        community:communities (
          id,
          name,
          description,
          isprivate
        )
      `)
      .eq('user_id', testUser.id)
      .order('joined_at', { ascending: false });

    if (membershipError) {
      console.error('Error checking memberships:', membershipError);
      throw membershipError;
    }

    console.log('');
    if (!memberships || memberships.length === 0) {
      console.log('❌ Test User is NOT a member of any communities');
      console.log('');
      console.log('To add Test User to a community, you can:');
      console.log('  1. Sign in as Test User and join communities manually');
      console.log('  2. Use the Supabase dashboard to insert membership records');
      console.log('  3. Create a script to add memberships');
    } else {
      console.log(`✓ Test User is a member of ${memberships.length} community/communities:`);
      console.log('');
      memberships.forEach((membership: any, index: number) => {
        const community = membership.community;
        console.log(`${index + 1}. ${community.name}`);
        console.log(`   ID: ${community.id}`);
        console.log(`   Description: ${community.description || 'No description'}`);
        console.log(`   Private: ${community.isprivate ? 'Yes' : 'No'}`);
        console.log(`   Joined: ${new Date(membership.joined_at).toLocaleString()}`);
        console.log('');
      });
    }

    console.log('========================================');
    console.log('✓ Check completed successfully!');
    console.log('========================================');

  } catch (error: any) {
    console.error('');
    console.error('========================================');
    console.error('✗ Error checking memberships');
    console.error('========================================');
    console.error('');
    console.error('Error details:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
    if (error.hint) {
      console.error('Hint:', error.hint);
    }
    console.error('');
    process.exit(1);
  }
}

// Run the script
checkTestUserMemberships()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });


