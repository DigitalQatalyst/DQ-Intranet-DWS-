import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.jmhtrffmxjxhoxpesubv:Dws.clouddb123@aws-1-eu-north-1.pooler.supabase.com:6543/postgres";

async function fixEventsRLSV2() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to Supabase database\n');

    // Step 1: Drop duplicate policies
    console.log('=== CLEANING UP DUPLICATE POLICIES ===');
    const policiesToDrop = [
      'Public can view published events',
      'view_published_events'
    ];

    for (const policyName of policiesToDrop) {
      try {
        await client.query(`DROP POLICY IF EXISTS "${policyName}" ON events;`);
        console.log(`Dropped policy: ${policyName}`);
      } catch (err) {
        console.log(`Could not drop ${policyName}:`, err.message);
      }
    }

    // Step 2: Create explicit policies for anon and authenticated roles
    console.log('\n=== CREATING EXPLICIT POLICIES FOR SUPABASE ROLES ===');
    
    // Policy for anonymous users (anon role) - can view published events
    try {
      await client.query(`
        CREATE POLICY "anon_can_view_published_events"
        ON events
        FOR SELECT
        TO anon
        USING (status = 'published');
      `);
      console.log('✓ Created policy: anon_can_view_published_events');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('Policy anon_can_view_published_events already exists');
      } else {
        console.error('Error creating policy:', err.message);
      }
    }

    // Policy for authenticated users - can view all events
    try {
      await client.query(`
        CREATE POLICY "authenticated_can_view_all_events"
        ON events
        FOR SELECT
        TO authenticated
        USING (true);
      `);
      console.log('✓ Created policy: authenticated_can_view_all_events');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('Policy authenticated_can_view_all_events already exists');
      } else {
        console.error('Error creating policy:', err.message);
      }
    }

    // Also create a policy for public role (backup)
    try {
      await client.query(`
        CREATE POLICY "public_can_view_published_events"
        ON events
        FOR SELECT
        TO public
        USING (status = 'published');
      `);
      console.log('✓ Created policy: public_can_view_published_events');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('Policy public_can_view_published_events already exists');
      } else {
        console.error('Error creating policy:', err.message);
      }
    }

    // Step 3: Verify all SELECT policies
    console.log('\n=== VERIFYING SELECT POLICIES ===');
    const selectPolicies = await client.query(`
      SELECT 
        policyname,
        cmd as command,
        roles,
        qual as using_expression
      FROM pg_policies
      WHERE tablename = 'events' 
        AND schemaname = 'public'
        AND cmd = 'SELECT'
      ORDER BY policyname;
    `);
    
    console.table(selectPolicies.rows);

    // Step 4: Check table permissions for anon role
    console.log('\n=== CHECKING TABLE PERMISSIONS ===');
    const tablePerms = await client.query(`
      SELECT 
        grantee,
        privilege_type,
        is_grantable
      FROM information_schema.role_table_grants
      WHERE table_name = 'events' 
        AND table_schema = 'public'
        AND grantee IN ('anon', 'authenticated', 'public')
      ORDER BY grantee, privilege_type;
    `);
    
    if (tablePerms.rows.length > 0) {
      console.table(tablePerms.rows);
    } else {
      console.log('No explicit table grants found (using RLS policies)');
    }

    // Step 5: Grant SELECT permission to anon role if needed
    console.log('\n=== GRANTING TABLE PERMISSIONS ===');
    try {
      await client.query(`GRANT SELECT ON events TO anon;`);
      console.log('✓ Granted SELECT permission to anon role');
    } catch (err) {
      console.log('Grant to anon:', err.message);
    }

    try {
      await client.query(`GRANT SELECT ON events TO authenticated;`);
      console.log('✓ Granted SELECT permission to authenticated role');
    } catch (err) {
      console.log('Grant to authenticated:', err.message);
    }

    try {
      await client.query(`GRANT SELECT ON events TO public;`);
      console.log('✓ Granted SELECT permission to public role');
    } catch (err) {
      console.log('Grant to public:', err.message);
    }

    // Step 6: Test query simulation
    console.log('\n=== TESTING QUERY SIMULATION ===');
    const testQuery = await client.query(`
      SELECT 
        id, 
        title, 
        status, 
        start_time 
      FROM events 
      WHERE status = 'published' 
        AND start_time >= NOW()
      ORDER BY start_time ASC
      LIMIT 5;
    `);
    
    console.log(`Found ${testQuery.rows.length} published future events:`);
    testQuery.rows.forEach((row, idx) => {
      console.log(`  ${idx + 1}. ${row.title} (${row.status}) - ${row.start_time}`);
    });

    console.log('\n=== RLS FIX COMPLETE ===');
    console.log('The events table should now be accessible via Supabase client.');
    console.log('Make sure your Supabase client is using the anon key for anonymous access.');

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
}

fixEventsRLSV2();





