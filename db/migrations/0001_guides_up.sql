-- Create migrations tracker
CREATE TABLE IF NOT EXISTS schema_migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Taxonomy tables
CREATE TABLE IF NOT EXISTS guide_type (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS business_stage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS domain (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS format (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS popularity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- Guides table
CREATE TABLE IF NOT EXISTS guides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  slug TEXT NOT NULL UNIQUE,
  hero_image TEXT,
  estimated_time TEXT,
  skill_level TEXT,
  last_updated_at TEXT,
  contributors TEXT, -- JSON array of strings
  status TEXT NOT NULL CHECK (status IN ('draft','published','archived')) DEFAULT 'draft',
  guide_type_id INTEGER REFERENCES guide_type(id),
  business_stage_id INTEGER REFERENCES business_stage(id),
  domain_id INTEGER REFERENCES domain(id),
  format_id INTEGER REFERENCES format(id),
  popularity_id INTEGER REFERENCES popularity(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TRIGGER IF NOT EXISTS guides_updated_at_trigger
AFTER UPDATE ON guides
FOR EACH ROW
BEGIN
  UPDATE guides SET updated_at = datetime('now') WHERE id = OLD.id;
END;

-- Content tables
CREATE TABLE IF NOT EXISTS guides_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guide_id TEXT NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  title TEXT,
  content TEXT
);

CREATE TABLE IF NOT EXISTS guides_attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guide_id TEXT NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('file','link')),
  title TEXT,
  url TEXT
);

CREATE TABLE IF NOT EXISTS guides_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guide_id TEXT NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  title TEXT,
  url TEXT,
  kind TEXT NOT NULL CHECK (kind IN ('downloadable','interactive'))
);

CREATE TABLE IF NOT EXISTS guides_related_tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guide_id TEXT NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  title TEXT,
  url TEXT
);

