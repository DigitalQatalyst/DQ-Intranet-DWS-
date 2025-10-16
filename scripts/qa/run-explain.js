// Simple QA script to run EXPLAIN ANALYZE on rpc_guides_search
// Requires PG connection string in PG_CONNECTION_STRING or SUPABASE_DB_URL
import { Client } from 'pg'
import fs from 'fs'
import path from 'path'

async function main() {
  const conn = process.env.PG_CONNECTION_STRING || process.env.SUPABASE_DB_URL
  if (!conn) {
    console.warn('No PG_CONNECTION_STRING/SUPABASE_DB_URL set; skipping EXPLAIN QA')
    process.exit(0)
  }
  const client = new Client({ connectionString: conn })
  await client.connect()
  const sqlPath = path.resolve(process.cwd(), 'scripts', 'qa', 'explain-guides-rpc.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')
  const statements = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean)
  let hasSeqScan = false
  for (const stmt of statements) {
    const { rows } = await client.query(stmt)
    const planText = rows.map(r => Object.values(r).join(' ')).join('\n')
    if (/Seq Scan/i.test(planText)) {
      hasSeqScan = true
      console.error('WARNING: Sequential scan detected in plan for statement:\n', stmt)
    }
  }
  await client.end()
  if (hasSeqScan) {
    console.error('EXPLAIN QA failed: sequential scans detected.')
    process.exit(1)
  } else {
    console.log('EXPLAIN QA passed: no sequential scans.')
  }
}

main().catch((e) => { console.error(e); process.exit(1) })

