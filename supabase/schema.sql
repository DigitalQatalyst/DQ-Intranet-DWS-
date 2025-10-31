-- Supabase schema for Discover DQ (6x Digital View) and DQ DNA
-- Safe to run multiple times (drops and recreates tables with image_url columns)

-- ===== Enums =====
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dq_tone') THEN
    CREATE TYPE dq_tone AS ENUM ('light','dark','green');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dq_role') THEN
    CREATE TYPE dq_role AS ENUM ('leftTop','rightTop','leftMid','center','rightMid','leftBot','rightBot');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dq_side') THEN
    CREATE TYPE dq_side AS ENUM ('left','right','bottom');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dq_fill') THEN
    CREATE TYPE dq_fill AS ENUM ('navy','white');
  END IF;
END $$;

-- ===== Drop tables in correct order (due to foreign key constraints) =====
DROP TABLE IF EXISTS public.dq_lane_tile_map CASCADE;
DROP TABLE IF EXISTS public.dq_dna_callouts CASCADE;
DROP TABLE IF EXISTS public.dq_dna_nodes CASCADE;
DROP TABLE IF EXISTS public.dq_tiles CASCADE;
DROP TABLE IF EXISTS public.dq_lanes CASCADE;
DROP TABLE IF EXISTS public.dq_6x_page_copy CASCADE;

-- ===== DQ 6x: Lanes and Tiles =====
CREATE TABLE IF NOT EXISTS public.dq_lanes (
  id text PRIMARY KEY,                -- e.g. 'd1'..'d5'
  title text NOT NULL,
  subtitle text NOT NULL,
  icon_url text,
  color_hex text NOT NULL,            -- e.g. '#fb923c'
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dq_tiles (
  id text PRIMARY KEY,                -- e.g. 'dtmp','dtmaas','dtq4t','dtmb','dtmi','dtma','dcocc'
  title text NOT NULL,
  subtitle text NOT NULL,
  description text NOT NULL,
  tone dq_tone NOT NULL,
  href text,
  sort_order integer NOT NULL DEFAULT 0,
  image_url text,                     -- NEW: Unsplash image URL for tile
  created_at timestamptz NOT NULL DEFAULT now()
);

-- current design maps each lane -> one tile; keep as separate map to allow future many-to-many
CREATE TABLE IF NOT EXISTS public.dq_lane_tile_map (
  lane_id text NOT NULL REFERENCES public.dq_lanes(id) ON DELETE CASCADE,
  tile_id text NOT NULL REFERENCES public.dq_tiles(id) ON DELETE CASCADE,
  PRIMARY KEY (lane_id, tile_id)
);

-- Optional page copy (header text)
CREATE TABLE IF NOT EXISTS public.dq_6x_page_copy (
  key text PRIMARY KEY,               -- e.g. 'title','subtitle','panel_title','panel_subtitle'
  value text NOT NULL
);

-- ===== DQ DNA: Nodes and Callouts =====
CREATE TABLE IF NOT EXISTS public.dq_dna_nodes (
  id integer PRIMARY KEY,             -- matches UI numbering (1..7)
  role dq_role NOT NULL,
  title text NOT NULL,
  subtitle text NOT NULL,
  fill dq_fill NOT NULL,
  details text[],                     -- optional bullet points
  kb_url text NOT NULL,
  lms_url text NOT NULL,
  image_url text,                     -- NEW: Unsplash image URL for DNA node
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dq_dna_callouts (
  id bigserial PRIMARY KEY,
  role dq_role NOT NULL,
  text text NOT NULL,
  side dq_side NOT NULL
);

-- ===== RLS =====
ALTER TABLE public.dq_lanes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dq_tiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dq_lane_tile_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dq_6x_page_copy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dq_dna_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dq_dna_callouts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (clean slate)
DROP POLICY IF EXISTS dq_lanes_select ON public.dq_lanes;
DROP POLICY IF EXISTS dq_tiles_select ON public.dq_tiles;
DROP POLICY IF EXISTS dq_lane_tile_map_select ON public.dq_lane_tile_map;
DROP POLICY IF EXISTS dq_6x_page_copy_select ON public.dq_6x_page_copy;
DROP POLICY IF EXISTS dq_dna_nodes_select ON public.dq_dna_nodes;
DROP POLICY IF EXISTS dq_dna_callouts_select ON public.dq_dna_callouts;

-- Read for all (anon) - write restricted to service role
CREATE POLICY dq_lanes_select ON public.dq_lanes FOR SELECT USING (true);
CREATE POLICY dq_tiles_select ON public.dq_tiles FOR SELECT USING (true);
CREATE POLICY dq_lane_tile_map_select ON public.dq_lane_tile_map FOR SELECT USING (true);
CREATE POLICY dq_6x_page_copy_select ON public.dq_6x_page_copy FOR SELECT USING (true);
CREATE POLICY dq_dna_nodes_select ON public.dq_dna_nodes FOR SELECT USING (true);
CREATE POLICY dq_dna_callouts_select ON public.dq_dna_callouts FOR SELECT USING (true);
