/**
 * Diagnose Communities Display Issue
 * 
 * Checks why communities are not displaying:
 * - RLS policies on communities table
 * - Existence of communities_with_counts view
 * - Data in communities table
 * - RLS policies on memberships table
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load .env if available
try {
  dotenv.config();
} catch (e) {
  // dotenv not installed
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key');
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
  console.log('🔍 Diagnosing Communities Display Issue...\n');

  // 1. Check if communities table exists and has data
  console.log('1. Checking communities table...');
  try {
    const { data: communities, error: communitiesError, count } = await supabase
      .from('communities')
      .select('*', { count: 'exact' })
      .limit(5);

    if (communitiesError) {
      console.error('   ❌ Error:', communitiesError.message);
      console.error('   Code:', communitiesError.code);
      console.error('   Details:', communitiesError.details);
      console.error('   Hint:', communitiesError.hint);
    } else {
      console.log(`   ✓ Found ${count || communities?.length || 0} communities`);
      if (communities && communities.length > 0) {
        console.log('   Sample community:', communities[0].name);
      } else {
        console.log('   ⚠️  No communities found in database');
      }
    }
  } catch (err) {
    console.error('   ❌ Exception:', err.message);
  }

  console.log('');

  // 2. Check communities_with_counts view
  console.log('2. Checking communities_with_counts view...');
  try {
    const { data: viewData, error: viewError } = await supabase
      .from('communities_with_counts')
      .select('*')
      .limit(1);

    if (viewError) {
      console.error('   ❌ View error:', viewError.message);
      console.error('   Code:', viewError.code);
      if (viewError.message?.includes('does not exist')) {
        console.error('   ⚠️  View does not exist - this is OK, code will fallback to base table');
      } else if (viewError.message?.includes('permission denied')) {
        console.error('   ⚠️  Permission denied - RLS might be blocking access');
      }
    } else {
      console.log('   ✓ View is accessible');
      console.log(`   Found ${viewData?.length || 0} rows`);
    }
  } catch (err) {
    console.error('   ❌ Exception:', err.message);
  }

  console.log('');

  // 3. Check memberships table (for member counts)
  console.log('3. Checking memberships table...');
  try {
    const { data: memberships, error: membershipsError, count } = await supabase
      .from('memberships')
      .select('*', { count: 'exact' })
      .limit(5);

    if (membershipsError) {
      console.error('   ❌ Error:', membershipsError.message);
      console.error('   Code:', membershipsError.code);
    } else {
      console.log(`   ✓ Found ${count || memberships?.length || 0} memberships`);
    }
  } catch (err) {
    console.error('   ❌ Exception:', err.message);
  }

  console.log('');

  // 4. Check RLS status (requires service role key)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    console.log('4. Checking RLS status on tables...');
    const adminClient = createClient(supabaseUrl, serviceKey);
    
    try {
      // Check RLS status via SQL (if we can)
      const { data: rlsStatus, error: rlsError } = await adminClient
        .rpc('exec_sql', {
          query: `
            SELECT 
              schemaname,
              tablename,
              rowsecurity as rls_enabled
            FROM pg_tables
            WHERE schemaname = 'public'
            AND tablename IN ('communities', 'memberships', 'community_posts')
            ORDER BY tablename;
          `
        });

      if (!rlsError && rlsStatus) {
        console.log('   RLS Status:');
        rlsStatus.forEach(table => {
          console.log(`     ${table.tablename}: ${table.rls_enabled ? 'ENABLED' : 'DISABLED'}`);
        });
      } else {
        console.log('   ⚠️  Could not check RLS status (this is OK)');
      }
    } catch (err) {
      console.log('   ⚠️  Could not check RLS status:', err.message);
    }
  } else {
    console.log('4. Skipping RLS check (SUPABASE_SERVICE_ROLE_KEY not set)');
  }

  console.log('');

  // 5. Test authenticated query
  console.log('5. Testing with current session...');
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    console.log('   ✓ User is authenticated:', session.user.email);
  } else {
    console.log('   ⚠️  No active session (user not signed in)');
  }

  console.log('');
  console.log('========================================');
  console.log('Diagnosis Complete');
  console.log('========================================');
  console.log('');
  console.log('Common Issues:');
  console.log('  1. No data in communities table → Run seed script');
  console.log('  2. RLS blocking access → Check RLS policies');
  console.log('  3. View missing → Code will fallback to base table');
  console.log('  4. Permission denied → Check RLS policies on communities/memberships');
  console.log('');
}

diagnose()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });


