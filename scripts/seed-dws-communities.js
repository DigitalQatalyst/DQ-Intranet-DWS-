/**
 * Seed script for DQ-Intranet-DWS- Communities
 * 
 * This script creates minimal seed data for the new Supabase project:
 * - Admin users
 * - Sample communities
 * 
 * Usage:
 *   node scripts/seed-dws-communities.js
 * 
 * Requirements:
 *   - VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
 *   - Or pass as environment variables
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

// Use DWS Communities project credentials
// Prefer VITE_SUPABASE_SERVICE_ROLE_KEY for Communities operations, fallback to anon key
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and (VITE_SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY) must be set in .env');
  console.error('   Make sure you are using the DWS Communities Supabase project credentials');
  process.exit(1);
}

// Verify we're using the correct Supabase project
if (supabaseUrl && !supabaseUrl.includes('jmhtrffmxjxhoxpesubv')) {
  console.warn('⚠️  Warning: VITE_SUPABASE_URL does not point to DWS Communities project');
  console.warn(`   Current URL: ${supabaseUrl}`);
  console.warn('   Expected: https://jmhtrffmxjxhoxpesubv.supabase.co');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Admin users to create (with stable IDs)
const ADMIN_USERS = [
  {
    id: '00000000-0000-0000-0000-000000000001', // Stable ID for admin
    email: 'admin@dq.com',
    password: 'admin123', // In production, use proper password hashing
    username: 'admin',
    role: 'admin',
    avatar_url: null,
    notification_settings: {},
  },
];

// Sample communities to create
const SAMPLE_COMMUNITIES = [
  {
    id: '10000000-0000-0000-0000-000000000001', // Stable ID
    name: 'DQ Innovation Hub',
    description: 'Share innovative ideas and collaborate on new projects',
    category: 'Innovation',
    imageurl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    isprivate: false,
    tags: ['Innovation', 'Technology', 'Collaboration'],
    created_by: '00000000-0000-0000-0000-000000000001', // Admin user ID
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    name: 'DQ Learning Community',
    description: 'Learn, share knowledge, and grow together',
    category: 'Learning',
    imageurl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    isprivate: false,
    tags: ['Learning', 'Education', 'Growth'],
    created_by: '00000000-0000-0000-0000-000000000001',
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    name: 'DQ Social Circle',
    description: 'Connect with colleagues and build relationships',
    category: 'Social',
    imageurl: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800',
    isprivate: false,
    tags: ['Social', 'Networking', 'Community'],
    created_by: '00000000-0000-0000-0000-000000000001',
  },
];

async function seedUsers() {
  console.log('📝 Seeding admin users...');
  
  for (const user of ADMIN_USERS) {
    try {
      // Check if user already exists
      const { data: existing } = await supabase
        .from('users_local')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (existing) {
        console.log(`   ✓ User ${user.email} already exists, skipping...`);
        continue;
      }
      
      // Insert user
      const { error } = await supabase
        .from('users_local')
        .insert([user]);
      
      if (error) {
        console.error(`   ✗ Error creating user ${user.email}:`, error.message);
      } else {
        console.log(`   ✓ Created admin user: ${user.email}`);
      }
    } catch (error) {
      console.error(`   ✗ Error seeding user ${user.email}:`, error.message);
    }
  }
}

async function seedCommunities() {
  console.log('📝 Seeding communities...');
  
  for (const community of SAMPLE_COMMUNITIES) {
    try {
      // Check if community already exists
      const { data: existing } = await supabase
        .from('communities')
        .select('id')
        .eq('id', community.id)
        .single();
      
      if (existing) {
        console.log(`   ✓ Community "${community.name}" already exists, skipping...`);
        continue;
      }
      
      // Insert community
      const { error: communityError } = await supabase
        .from('communities')
        .insert([community]);
      
      if (communityError) {
        console.error(`   ✗ Error creating community "${community.name}":`, communityError.message);
        continue;
      }
      
      console.log(`   ✓ Created community: ${community.name}`);
      
      // Create membership for creator (admin)
      const { error: membershipError } = await supabase
        .from('memberships')
        .insert([{
          user_id: community.created_by,
          community_id: community.id,
          role: 'admin',
        }]);
      
      if (membershipError) {
        console.error(`   ✗ Error creating membership for "${community.name}":`, membershipError.message);
      } else {
        console.log(`   ✓ Created admin membership for ${community.name}`);
      }
      
      // Create community role for creator
      const { error: roleError } = await supabase
        .from('community_roles')
        .insert([{
          community_id: community.id,
          user_id: community.created_by,
          role: 'admin',
        }]);
      
      if (roleError) {
        console.error(`   ✗ Error creating community role for "${community.name}":`, roleError.message);
      }
    } catch (error) {
      console.error(`   ✗ Error seeding community "${community.name}":`, error.message);
    }
  }
}

async function verifySeed() {
  console.log('🔍 Verifying seed data...');
  
  try {
    // Check users
    const { data: users, error: usersError } = await supabase
      .from('users_local')
      .select('id, email, username, role');
    
    if (usersError) {
      console.error('   ✗ Error fetching users:', usersError.message);
    } else {
      console.log(`   ✓ Found ${users.length} users`);
      users.forEach(user => {
        console.log(`      - ${user.email} (${user.username}) - ${user.role}`);
      });
    }
    
    // Check communities
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .select('id, name, category');
    
    if (communitiesError) {
      console.error('   ✗ Error fetching communities:', communitiesError.message);
    } else {
      console.log(`   ✓ Found ${communities.length} communities`);
      communities.forEach(community => {
        console.log(`      - ${community.name} (${community.category})`);
      });
    }
    
    // Check memberships
    const { data: memberships, error: membershipsError } = await supabase
      .from('memberships')
      .select('id, user_id, community_id, role');
    
    if (membershipsError) {
      console.error('   ✗ Error fetching memberships:', membershipsError.message);
    } else {
      console.log(`   ✓ Found ${memberships.length} memberships`);
    }
  } catch (error) {
    console.error('   ✗ Error verifying seed:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting DQ-Intranet-DWS- Communities seed...');
  console.log(`   Supabase URL: ${supabaseUrl}`);
  console.log('');
  
  try {
    await seedUsers();
    console.log('');
    await seedCommunities();
    console.log('');
    await verifySeed();
    console.log('');
    console.log('✅ Seed completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Verify the data in your Supabase dashboard');
    console.log('   2. Test the Communities feature in the application');
    console.log('   3. Update environment variables if needed');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

main();

