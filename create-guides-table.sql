-- Create the guides table for your Supabase database
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "public"."guides" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "summary" "text",
    "hero_image_url" "text",
    "skill_level" "text" DEFAULT 'Beginner' NOT NULL,
    "estimated_time_min" integer,
    "last_updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_published_at" timestamp with time zone,
    "status" "text" DEFAULT 'Draft' NOT NULL,
    "author_name" "text",
    "author_org" "text",
    "is_editors_pick" boolean DEFAULT false NOT NULL,
    "download_count" integer DEFAULT 0 NOT NULL,
    "language" "text" DEFAULT 'English' NOT NULL,
    "search_vec" "tsvector",
    "domain" "text",
    "guide_type" "text",
    "function_area" "text",
    "complexity_level" "text",
    "document_url" "text",
    "body" "text",
    "sub_domain" "text",
    "unit" "text",
    "location" "text",
    CONSTRAINT "guides_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "guides_slug_key" UNIQUE ("slug"),
    CONSTRAINT "guides_estimated_time_min_check" CHECK (("estimated_time_min" >= 0))
);

-- Set table owner
ALTER TABLE "public"."guides" OWNER TO "postgres";

-- Enable Row Level Security (RLS)
ALTER TABLE "public"."guides" ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
CREATE POLICY "Allow public read access" ON "public"."guides"
FOR SELECT USING (true);

-- Create a policy to allow authenticated users to insert/update
CREATE POLICY "Allow authenticated users to insert" ON "public"."guides"
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update" ON "public"."guides"
FOR UPDATE USING (true);

-- Insert some sample data to test
INSERT INTO "public"."guides" (
    "slug",
    "title", 
    "summary",
    "body",
    "status",
    "skill_level",
    "domain",
    "guide_type",
    "last_updated_at"
) VALUES (
    'sample-guide',
    'Sample Guide',
    'This is a sample guide to test the table setup.',
    '# Sample Guide

This is a test guide to verify the table is working correctly.

## Test Section

Content goes here.',
    'Approved',
    'Beginner',
    'Strategy',
    'Guide',
    NOW()
);

-- Verify the table was created and data inserted
SELECT 
    slug,
    title,
    status,
    domain,
    guide_type,
    last_updated_at
FROM "public"."guides";