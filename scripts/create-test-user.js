/**
 * Create Test User Script (JavaScript version)
 * 
 * Creates a test user in Supabase Auth and users_local table for testing authentication.
 * 
 * Usage:
 *   node scripts/create-test-user.js
 * 
 * Requires environment variables:
 *   - VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 * 
 * Or create a .env file with these variables.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Try to load .env file if it exists
try {
  dotenv.config();
} catch (e) {
  // dotenv not installed, that's okay
}

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Better error messages
if (!supabaseUrl) {
  console.error('');
  console.error('❌ ERROR: Missing Supabase URL');
  console.error('');
  console.error('Please set one of these environment variables:');
  console.error('  - VITE_SUPABASE_URL');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('');
  console.error('Example (PowerShell):');
  console.error('  $env:VITE_SUPABASE_URL="https://your-project-id.supabase.co"');
  console.error('');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('');
  console.error('❌ ERROR: Missing Supabase Service Role Key');
  console.error('');
  console.error('Please set the SUPABASE_SERVICE_ROLE_KEY environment variable.');
  console.error('');
  console.error('To get your service role key:');
  console.error('  1. Go to https://app.supabase.com');
  console.error('  2. Select your project');
  console.error('  3. Go to Settings → API');
  console.error('  4. Copy the "service_role" key (NOT the anon key)');
  console.error('');
  console.error('Example (PowerShell):');
  console.error('  $env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."');
  console.error('');
  console.error('⚠️  IMPORTANT: Use the SERVICE_ROLE key, not the anon key!');
  console.error('');
  process.exit(1);
}

// Validate the service role key format (should start with eyJ)
if (!supabaseServiceKey.startsWith('eyJ')) {
  console.error('');
  console.error('❌ ERROR: Invalid Service Role Key format');
  console.error('');
  console.error('The service role key should start with "eyJ" (it\'s a JWT token).');
  console.error('You might be using the wrong key. Make sure you copied the "service_role" key,');
  console.error('not the "anon" key from the Supabase dashboard.');
  console.error('');
  process.exit(1);
}

console.log('✓ Environment variables loaded');
console.log(`  URL: ${supabaseUrl}`);
console.log(`  Service Key: ${supabaseServiceKey.substring(0, 20)}...`);
console.log('');

// Create Supabase client with service role key (bypasses RLS)
// The service role key should bypass all RLS policies
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`
    }
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
      console.error('');
      console.error('❌ ERROR: Failed to list users');
      console.error('');
      console.error('Error details:', listError.message);
      console.error('');
      console.error('Common causes:');
      console.error('  1. Wrong API key - Make sure you\'re using the SERVICE_ROLE key, not the anon key');
      console.error('  2. Key not set - Make sure you set SUPABASE_SERVICE_ROLE_KEY before running');
      console.error('  3. Invalid key format - The key should be a JWT token starting with "eyJ"');
      console.error('');
      console.error('To fix:');
      console.error('  1. Go to Supabase Dashboard → Settings → API');
      console.error('  2. Copy the "service_role" key (the long one, not anon)');
      console.error('  3. Set it: $env:SUPABASE_SERVICE_ROLE_KEY="your-key-here"');
      console.error('  4. Run the script again');
      console.error('');
      throw listError;
    }

    const existingUser = existingUsers?.users?.find(u => u.email === TEST_EMAIL);
    
    let userId;

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
    
    // Use REST API directly with service role key to bypass RLS
    const checkProfileUrl = `${supabaseUrl}/rest/v1/users_local?id=eq.${userId}&select=*`;
    const checkResponse = await fetch(checkProfileUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });

    if (!checkResponse.ok && checkResponse.status !== 404) {
      const errorText = await checkResponse.text();
      console.error('Error checking users_local:', errorText);
      throw new Error(`Failed to check users_local: ${checkResponse.status} ${errorText}`);
    }

    const existingProfiles = await checkResponse.json();
    const existingProfile = existingProfiles && existingProfiles.length > 0 ? existingProfiles[0] : null;

    if (existingProfile) {
      console.log('User profile already exists in users_local');
      console.log('Updating profile...');
      
      // Update using REST API
      const updateUrl = `${supabaseUrl}/rest/v1/users_local?id=eq.${userId}`;
      const updateResponse = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          email: TEST_EMAIL,
          username: 'Test User',
          role: 'member',
        })
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('Error updating profile:', errorText);
        throw new Error(`Failed to update users_local: ${updateResponse.status} ${errorText}`);
      }
      console.log('✓ Profile updated successfully');
    } else {
      // Step 4: Create entry in users_local using REST API
      console.log('Creating profile in users_local...');
      const insertUrl = `${supabaseUrl}/rest/v1/users_local`;
      const insertResponse = await fetch(insertUrl, {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          id: userId,
          email: TEST_EMAIL,
          username: 'Test User',
          role: 'member',
          created_at: new Date().toISOString(),
        })
      });

      if (!insertResponse.ok) {
        const errorText = await insertResponse.text();
        console.error('Error creating profile:', errorText);
        console.error('');
        console.error('Troubleshooting:');
        console.error('  1. Check if users_local table exists');
        console.error('  2. Verify RLS is disabled or service role key has proper permissions');
        console.error('  3. Check Supabase dashboard → Table Editor → users_local');
        throw new Error(`Failed to create users_local: ${insertResponse.status} ${errorText}`);
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

  } catch (error) {
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

