/**
 * Create Test User Script
 * 
 * Creates a test user in Supabase Auth and users_local table for testing authentication.
 * 
 * Usage:
 *   npx tsx scripts/create-test-user.ts
 *   or
 *   node scripts/create-test-user.js (after compiling)
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable. This is required to create users.');
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
const TEST_PASSWORD = 'TestUser123!';

async function createTestUser() {
  console.log('Creating test user...');
  console.log(`Email: ${TEST_EMAIL}`);
  console.log(`Password: ${TEST_PASSWORD}`);
  console.log('');

  try {
    // Step 1: Check if user already exists in auth.users
    console.log('Step 1: Checking if user exists in auth.users...');
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      throw listError;
    }

    const existingUser = existingUsers?.users?.find(u => u.email === TEST_EMAIL);
    
    let userId: string;

    if (existingUser) {
      console.log('User already exists in auth.users');
      userId = existingUser.id;

      // Reset password for existing user
      console.log('Resetting password for existing user...');
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { password: TEST_PASSWORD }
      );

      if (updateError) {
        console.error('Error resetting password:', updateError);
        throw updateError;
      }
      console.log('✓ Password reset successfully');
    } else {
      // Step 2: Create new user in auth.users
      console.log('Step 2: Creating new user in auth.users...');
      const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        email_confirm: true, // Auto-confirm email
      });

      if (signUpError) {
        console.error('Error creating user:', signUpError);
        throw signUpError;
      }

      if (!signUpData?.user) {
        throw new Error('User creation failed - no user returned');
      }

      userId = signUpData.user.id;
      console.log(`✓ User created successfully with ID: ${userId}`);
    }

    // Step 3: Check if user exists in users_local
    console.log('');
    console.log('Step 3: Checking users_local table...');
    const { data: existingProfile, error: profileError } = await supabase
      .from('users_local')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking users_local:', profileError);
      throw profileError;
    }

    if (existingProfile) {
      console.log('User profile already exists in users_local');
      console.log('Updating profile...');
      
      const { error: updateError } = await supabase
        .from('users_local')
        .update({
          email: TEST_EMAIL,
          username: 'Test User',
          role: 'member',
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }
      console.log('✓ Profile updated successfully');
    } else {
      // Step 4: Create entry in users_local
      console.log('Creating profile in users_local...');
      const { error: insertError } = await supabase
        .from('users_local')
        .insert({
          id: userId,
          email: TEST_EMAIL,
          username: 'Test User',
          role: 'member',
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error creating profile:', insertError);
        throw insertError;
      }
      console.log('✓ Profile created successfully');
    }

    console.log('');
    console.log('========================================');
    console.log('✓ Test user created successfully!');
    console.log('========================================');
    console.log('');
    console.log('Credentials:');
    console.log(`  Email: ${TEST_EMAIL}`);
    console.log(`  Password: ${TEST_PASSWORD}`);
    console.log('');
    console.log('You can now use these credentials to sign in.');
    console.log('');

  } catch (error: any) {
    console.error('');
    console.error('========================================');
    console.error('✗ Error creating test user');
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
createTestUser()
  .then(() => {
    console.log('Script completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });


