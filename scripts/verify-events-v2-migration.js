import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.jmhtrffmxjxhoxpesubv:Dws.clouddb123@aws-1-eu-north-1.pooler.supabase.com:6543/postgres";

async function verifyMigration() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to Supabase database\n');

    // Step 1: Verify events_v2 table exists
    console.log('=== VERIFYING events_v2 TABLE ===');
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events_v2'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.error('❌ events_v2 table does not exist!');
      await client.end();
      return;
    }
    console.log('✅ events_v2 table exists');

    // Step 2: Verify row count
    console.log('\n=== VERIFYING DATA ===');
    const countV2 = await client.query('SELECT COUNT(*) as count FROM events_v2;');
    const countOriginal = await client.query('SELECT COUNT(*) as count FROM events;');
    
    console.log(`events table: ${countOriginal.rows[0].count} rows`);
    console.log(`events_v2 table: ${countV2.rows[0].count} rows`);
    
    if (countOriginal.rows[0].count === countV2.rows[0].count) {
      console.log('✅ Row counts match!');
    } else {
      console.log('⚠️  Row counts do not match!');
    }

    // Step 3: Verify RLS policies
    console.log('\n=== VERIFYING RLS POLICIES ===');
    const policies = await client.query(`
      SELECT 
        policyname,
        cmd as command,
        roles
      FROM pg_policies
      WHERE tablename = 'events_v2' 
        AND schemaname = 'public'
        AND cmd = 'SELECT'
      ORDER BY policyname;
    `);

    if (policies.rows.length > 0) {
      console.log(`✅ Found ${policies.rows.length} SELECT policies:`);
      console.table(policies.rows);
    } else {
      console.log('⚠️  No SELECT policies found!');
    }

    // Step 4: Verify permissions
    console.log('\n=== VERIFYING PERMISSIONS ===');
    const perms = await client.query(`
      SELECT 
        grantee,
        privilege_type
      FROM information_schema.role_table_grants
      WHERE table_name = 'events_v2' 
        AND table_schema = 'public'
        AND grantee IN ('anon', 'authenticated', 'public')
        AND privilege_type = 'SELECT'
      ORDER BY grantee;
    `);

    if (perms.rows.length > 0) {
      console.log('✅ SELECT permissions granted:');
      console.table(perms.rows);
    } else {
      console.log('⚠️  No explicit SELECT permissions found (using RLS)');
    }

    // Step 5: Test query simulation
    console.log('\n=== TESTING QUERY ===');
    const testQuery = await client.query(`
      SELECT 
        id, 
        title, 
        status, 
        start_time 
      FROM events_v2 
      WHERE status = 'published' 
        AND start_time >= NOW()
      ORDER BY start_time ASC
      LIMIT 5;
    `);
    
    console.log(`✅ Query successful - Found ${testQuery.rows.length} published future events`);
    if (testQuery.rows.length > 0) {
      console.log('Sample events:');
      testQuery.rows.forEach((row, idx) => {
        console.log(`  ${idx + 1}. ${row.title} (${row.status})`);
      });
    }

    console.log('\n=== MIGRATION VERIFICATION COMPLETE ===');
    console.log('✅ events_v2 table is ready for use');
    console.log('✅ All code references should now point to events_v2');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
}

verifyMigration();





