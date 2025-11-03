-- Migration: Add image_url field to dq_tiles and dq_dna_nodes tables
-- Date: 2025-10-31
-- Description: Adds Unsplash image URL fields to support visual content for DNA nodes and tiles

-- Add image_url to dq_tiles table
ALTER TABLE public.dq_tiles 
ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN public.dq_tiles.image_url IS 'Unsplash image URL for tile visual representation';

-- Add image_url to dq_dna_nodes table
ALTER TABLE public.dq_dna_nodes 
ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN public.dq_dna_nodes.image_url IS 'Unsplash image URL for DNA node visual representation';

-- Update existing dq_dna_nodes with image URLs
UPDATE public.dq_dna_nodes SET image_url = 
  CASE id
    WHEN 1 THEN 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop'  -- Vision: Space/Future
    WHEN 2 THEN 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop'  -- HoV: Team Collaboration
    WHEN 3 THEN 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop'  -- Personas: People/Identity
    WHEN 4 THEN 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop'  -- TMS: Task Management
    WHEN 5 THEN 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop'  -- SOS: Governance/Strategy
    WHEN 6 THEN 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'  -- Flows: Analytics/Data
    WHEN 7 THEN 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'  -- DTMF: Products/Services
    ELSE NULL
  END
WHERE id BETWEEN 1 AND 7;

-- Example: Update dq_tiles with image URLs (customize as needed)
-- UPDATE public.dq_tiles SET image_url = 
--   CASE id
--     WHEN 'dtmp' THEN 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop'
--     WHEN 'dtmaas' THEN 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop'
--     WHEN 'dtq4t' THEN 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
--     WHEN 'dtmb' THEN 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
--     WHEN 'dtmi' THEN 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop'
--     WHEN 'dtma' THEN 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
--     WHEN 'dcocc' THEN 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop'
--     ELSE NULL
--   END;

-- Verify the changes
SELECT id, title, image_url FROM public.dq_dna_nodes ORDER BY id;
-- SELECT id, title, image_url FROM public.dq_tiles ORDER BY sort_order;
