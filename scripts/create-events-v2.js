import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.jmhtrffmxjxhoxpesubv:Dws.clouddb123@aws-1-eu-north-1.pooler.supabase.com:6543/postgres";

async function createEventsV2() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to Supabase database\n');

    // Step 1: Get the structure of the events table
    console.log('=== GETTING EVENTS TABLE STRUCTURE ===');
    const tableStructure = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND table_name = 'events'
      ORDER BY ordinal_position;
    `);

    console.log(`Found ${tableStructure.rows.length} columns in events table`);
    console.table(tableStructure.rows);

    // Step 2: Check if events_v2 already exists
    console.log('\n=== CHECKING IF events_v2 EXISTS ===');
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events_v2'
      );
    `);

    if (tableExists.rows[0].exists) {
      console.log('⚠️  events_v2 table already exists!');
      const dropConfirm = process.argv.includes('--force');
      if (!dropConfirm) {
        console.log('Use --force flag to drop and recreate it');
        await client.end();
        return;
      }
      console.log('Dropping existing events_v2 table...');
      await client.query('DROP TABLE IF EXISTS events_v2 CASCADE;');
    }

    // Step 3: Create events_v2 table with same structure
    console.log('\n=== CREATING events_v2 TABLE ===');
    
    // Get the full CREATE TABLE statement by querying pg_get_tabledef or creating manually
    // Since we know the structure, let's create it based on the schema
    const createTableSQL = `
      CREATE TABLE events_v2 (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        category TEXT NOT NULL,
        location TEXT NOT NULL,
        image_url TEXT,
        meeting_link TEXT,
        is_virtual BOOLEAN DEFAULT false,
        is_all_day BOOLEAN DEFAULT false,
        max_attendees INTEGER,
        registration_required BOOLEAN DEFAULT false,
        registration_deadline TIMESTAMPTZ,
        organizer_id UUID,
        organizer_name TEXT NOT NULL,
        organizer_email TEXT,
        status TEXT DEFAULT 'published',
        is_featured BOOLEAN DEFAULT false,
        tags TEXT[] DEFAULT ARRAY[]::TEXT[],
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    await client.query(createTableSQL);
    console.log('✅ Created events_v2 table');

    // Step 4: Copy all data from events to events_v2
    console.log('\n=== COPYING DATA FROM events TO events_v2 ===');
    const copyResult = await client.query(`
      INSERT INTO events_v2 
      SELECT * FROM events;
    `);

    console.log(`✅ Copied ${copyResult.rowCount} rows from events to events_v2`);

    // Step 5: Copy indexes if any
    console.log('\n=== CHECKING FOR INDEXES ===');
    const indexes = await client.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename = 'events' 
        AND schemaname = 'public'
        AND indexname NOT LIKE '%_pkey';
    `);

    if (indexes.rows.length > 0) {
      console.log(`Found ${indexes.rows.length} indexes to copy:`);
      for (const idx of indexes.rows) {
        const newIndexDef = idx.indexdef.replace(/ON events/i, 'ON events_v2');
        try {
          await client.query(newIndexDef);
          console.log(`✅ Created index: ${idx.indexname.replace('events', 'events_v2')}`);
        } catch (err) {
          console.log(`⚠️  Could not create index ${idx.indexname}:`, err.message);
        }
      }
    } else {
      console.log('No additional indexes found');
    }

    // Step 6: Create RLS policies for events_v2 (same as events)
    console.log('\n=== CREATING RLS POLICIES FOR events_v2 ===');
    
    // Enable RLS
    await client.query('ALTER TABLE events_v2 ENABLE ROW LEVEL SECURITY;');
    console.log('✅ Enabled RLS on events_v2');

    // Create policies
    const policies = [
      {
        name: 'anon_can_view_published_events_v2',
        sql: `CREATE POLICY "anon_can_view_published_events_v2"
              ON events_v2
              FOR SELECT
              TO anon
              USING (status = 'published');`
      },
      {
        name: 'authenticated_can_view_all_events_v2',
        sql: `CREATE POLICY "authenticated_can_view_all_events_v2"
              ON events_v2
              FOR SELECT
              TO authenticated
              USING (true);`
      },
      {
        name: 'public_can_view_published_events_v2',
        sql: `CREATE POLICY "public_can_view_published_events_v2"
              ON events_v2
              FOR SELECT
              TO public
              USING (status = 'published');`
      }
    ];

    for (const policy of policies) {
      try {
        await client.query(policy.sql);
        console.log(`✅ Created policy: ${policy.name}`);
      } catch (err) {
        console.log(`⚠️  Could not create policy ${policy.name}:`, err.message);
      }
    }

    // Step 7: Grant permissions
    console.log('\n=== GRANTING PERMISSIONS ===');
    await client.query('GRANT SELECT ON events_v2 TO anon;');
    await client.query('GRANT SELECT ON events_v2 TO authenticated;');
    await client.query('GRANT SELECT ON events_v2 TO public;');
    console.log('✅ Granted SELECT permissions to all roles');

    // Step 8: Verify data
    console.log('\n=== VERIFYING DATA ===');
    const countEvents = await client.query('SELECT COUNT(*) as count FROM events;');
    const countEventsV2 = await client.query('SELECT COUNT(*) as count FROM events_v2;');
    
    console.log(`events table: ${countEvents.rows[0].count} rows`);
    console.log(`events_v2 table: ${countEventsV2.rows[0].count} rows`);
    
    if (countEvents.rows[0].count === countEventsV2.rows[0].count) {
      console.log('✅ Row counts match!');
    } else {
      console.log('⚠️  Row counts do not match!');
    }

    // Step 9: Update upcoming_events view to include events_v2
    console.log('\n=== CHECKING upcoming_events VIEW ===');
    const viewCheck = await client.query(`
      SELECT definition 
      FROM pg_views 
      WHERE viewname = 'upcoming_events' AND schemaname = 'public';
    `);

    if (viewCheck.rows.length > 0) {
      console.log('upcoming_events view exists - you may want to update it to include events_v2');
      console.log('Note: View update should be done separately if needed');
    }

    console.log('\n=== MIGRATION COMPLETE ===');
    console.log('✅ events_v2 table created successfully');
    console.log('✅ Data copied from events to events_v2');
    console.log('✅ RLS policies created');
    console.log('✅ Permissions granted');
    console.log('\nNext steps:');
    console.log('1. Update code references from "events" to "events_v2"');
    console.log('2. Test the application');
    console.log('3. Once verified, you can drop the old "events" table if desired');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
}

// Check for --force flag
const force = process.argv.includes('--force');
if (force) {
  console.log('⚠️  Running with --force flag (will drop existing events_v2 if it exists)\n');
}

createEventsV2();





