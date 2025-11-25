-- Migration: Create community-posts storage bucket
-- Description: Creates storage bucket for community post media uploads with proper RLS policies
-- Date: 2025-01-09

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-posts',
  'community-posts',
  true,
  10485760, -- 10MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
-- Note: RLS is typically enabled by default, but we ensure it's enabled

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload community post media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view community post media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own community post media" ON storage.objects;

-- Policy: Anyone can view public media
CREATE POLICY "Anyone can view community post media"
ON storage.objects FOR SELECT
USING (bucket_id = 'community-posts');

-- Policy: Authenticated users can upload media
CREATE POLICY "Authenticated users can upload community post media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'community-posts' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own uploads
CREATE POLICY "Users can update their own community post media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'community-posts' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own uploads
CREATE POLICY "Users can delete their own community post media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'community-posts' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);


