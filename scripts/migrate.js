// ESM script to apply SQL migrations to a local SQLite DB
import fs from 'fs';
import path from 'path';
import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dbDir = path.resolve(root, 'data');
const dbPath = path.resolve(dbDir, 'guides.sqlite');
const migrationsDir = path.resolve(root, 'db', 'migrations');

fs.mkdirSync(dbDir, { recursive: true });

const SQL = await initSqlJs();
let db;
if (fs.existsSync(dbPath)) {
  const filebuffer = fs.readFileSync(dbPath);
  db = new SQL.Database(new Uint8Array(filebuffer));
} else {
  db = new SQL.Database();
}

function ensureMigrationsTable() {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);
}

function getApplied() {
  try {
    const res = db.exec('SELECT name FROM schema_migrations ORDER BY id');
    if (!res[0]) return new Set();
    const values = res[0].values.map((row) => row[0]);
    return new Set(values);
  } catch {
    return new Set();
  }
}

function applyMigration(file) {
  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  const name = file;
  db.exec('BEGIN');
  try {
    db.exec(sql);
    const stmt = db.prepare('INSERT INTO schema_migrations (name) VALUES (?)');
    stmt.run([name]);
    db.exec('COMMIT');
    console.log(`Applied migration: ${name}`);
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

ensureMigrationsTable();
const applied = getApplied();
const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('_up.sql')).sort();
for (const file of files) {
  if (!applied.has(file)) applyMigration(file);
}

// Persist DB to file
const data = db.export();
const buffer = Buffer.from(data);
fs.writeFileSync(dbPath, buffer);
console.log('Migrations complete. DB at', dbPath);
