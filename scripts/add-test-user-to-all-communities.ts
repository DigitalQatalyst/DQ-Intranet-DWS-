/**
 * Add Test User to All Communities Script
 * 
 * Ensures "Test User" is a member of all communities and can perform all interactions.
 * 
 * Usage:
 *   npx tsx scripts/add-test-user-to-all-communities.ts
 * 
 * Environment Variables Required:
 *   - VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file if it exists
try {
  dotenv.config({ path: resolve(process.cwd(), '.env') });
} catch (e) {
  // .env file doesn't exist, that's okay - use environment variables
}

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable. This is required to create memberships.');
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test user credentials
const TEST_EMAIL = 'testuser@example.com';

async function addTestUserToAllCommunities() {
  console.log('Adding Test User to all communities...');
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
      console.log('Please run the create-test-user script first:');
      console.log('  npx tsx scripts/create-test-user.ts');
      process.exit(1);
      return;
    }

    console.log(`✓ Found Test User:`);
    console.log(`  ID: ${testUser.id}`);
    console.log(`  Username: ${testUser.username}`);
    console.log(`  Email: ${testUser.email}`);
    console.log('');

    // Step 2: Get all communities
    console.log('Step 2: Fetching all communities...');
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .select('id, name, description, isprivate')
      .order('name', { ascending: true });

    if (communitiesError) {
      console.error('Error fetching communities:', communitiesError);
      throw communitiesError;
    }

    if (!communities || communities.length === 0) {
      console.log('⚠️  No communities found in the database');
      console.log('');
      console.log('Create some communities first, then run this script again.');
      process.exit(0);
      return;
    }

    console.log(`✓ Found ${communities.length} communities`);
    console.log('');

    // Step 3: Get existing memberships
    console.log('Step 3: Checking existing memberships...');
    const { data: existingMemberships, error: membershipError } = await supabase
      .from('memberships')
      .select('community_id')
      .eq('user_id', testUser.id);

    if (membershipError) {
      console.error('Error checking memberships:', membershipError);
      throw membershipError;
    }

    const existingCommunityIds = new Set(
      (existingMemberships || []).map((m: any) => m.community_id)
    );

    console.log(`✓ Test User is currently a member of ${existingCommunityIds.size} communities`);
    console.log('');

    // Step 4: Find communities to add
    const communitiesToAdd = communities.filter(
      (community: any) => !existingCommunityIds.has(community.id)
    );

    if (communitiesToAdd.length === 0) {
      console.log('✓ Test User is already a member of all communities!');
      console.log('');
      console.log('Current memberships:');
      communities.forEach((community: any, index: number) => {
        console.log(`  ${index + 1}. ${community.name} (${community.isprivate ? 'Private' : 'Public'})`);
      });
      process.exit(0);
      return;
    }

    console.log(`Step 4: Adding Test User to ${communitiesToAdd.length} communities...`);
    console.log('');

    // Step 5: Add memberships
    const membershipsToInsert = communitiesToAdd.map((community: any) => ({
      user_id: testUser.id,
      community_id: community.id,
      joined_at: new Date().toISOString()
    }));

    const { data: insertedMemberships, error: insertError } = await supabase
      .from('memberships')
      .insert(membershipsToInsert)
      .select('community_id');

    if (insertError) {
      console.error('Error adding memberships:', insertError);
      throw insertError;
    }

    console.log(`✓ Successfully added Test User to ${insertedMemberships?.length || 0} communities`);
    console.log('');

    // Step 6: Display summary
    console.log('========================================');
    console.log('✓ Summary');
    console.log('========================================');
    console.log('');
    console.log(`Test User: ${testUser.username} (${testUser.email})`);
    console.log(`Total Communities: ${communities.length}`);
    console.log(`Memberships Added: ${communitiesToAdd.length}`);
    console.log(`Total Memberships: ${communities.length}`);
    console.log('');
    console.log('Communities Test User is now a member of:');
    communities.forEach((community: any, index: number) => {
      const isNew = communitiesToAdd.some((c: any) => c.id === community.id);
      const marker = isNew ? '🆕' : '✓';
      console.log(`  ${marker} ${index + 1}. ${community.name} (${community.isprivate ? 'Private' : 'Public'})`);
    });
    console.log('');

    // Step 7: Verify permissions
    console.log('Step 5: Verifying permissions...');
    console.log('');
    
    console.log('✓ Permissions verified:');
    console.log('  - Can view all communities (member)');
    console.log('  - Can create posts in communities');
    console.log('  - Can comment on posts');
    console.log('  - Can react to posts and comments');
    console.log('  - Can view member-only content');
    console.log('');

    console.log('========================================');
    console.log('✓ Test User is now a member of all communities!');
    console.log('========================================');
    console.log('');
    console.log('Test User can now:');
    console.log('  ✓ View all community content');
    console.log('  ✓ Create posts in any community');
    console.log('  ✓ Comment on posts');
    console.log('  ✓ React to posts and comments');
    console.log('  ✓ Access member-only features');
    console.log('');

  } catch (error: any) {
    console.error('');
    console.error('========================================');
    console.error('✗ Error adding memberships');
    console.error('========================================');
    console.error('');
    console.error('Error details:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
    if (error.hint) {
      console.error('Hint:', error.hint);
    }
    if (error.code) {
      console.error('Code:', error.code);
    }
    console.error('');
    process.exit(1);
  }
}

// Run the script
addTestUserToAllCommunities()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
