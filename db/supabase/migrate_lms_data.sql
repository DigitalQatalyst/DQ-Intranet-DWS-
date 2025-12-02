-- Supabase Migration: LMS Data Schema and Population
-- This migration creates the LMS schema and populates it from TypeScript data
-- Generated for DQ Intranet Learning Management System

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS curriculum_items CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- Create courses table
CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    category TEXT NOT NULL,
    delivery_mode TEXT NOT NULL,
    duration TEXT NOT NULL,
    level_code TEXT NOT NULL,
    department TEXT[] NOT NULL DEFAULT '{}',
    locations TEXT[] NOT NULL DEFAULT '{}',
    audience TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL,
    summary TEXT NOT NULL,
    highlights TEXT[] NOT NULL DEFAULT '{}',
    outcomes TEXT[] NOT NULL DEFAULT '{}',
    course_type TEXT,
    track TEXT,
    rating DECIMAL(3, 2),
    review_count INTEGER,
    testimonials JSONB,
    case_studies JSONB,
    references JSONB,
    faq JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create curriculum_items table
CREATE TABLE curriculum_items (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    item_order INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    course_slug TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create topics table
CREATE TABLE topics (
    id TEXT PRIMARY KEY,
    curriculum_item_id TEXT NOT NULL REFERENCES curriculum_items(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    topic_order INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE lessons (
    id TEXT PRIMARY KEY,
    topic_id TEXT REFERENCES topics(id) ON DELETE CASCADE,
    curriculum_item_id TEXT REFERENCES curriculum_items(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    type TEXT NOT NULL,
    lesson_order INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Ensure one of the foreign keys is set
    CONSTRAINT lessons_parent_check CHECK (
        (topic_id IS NOT NULL AND curriculum_item_id IS NULL) OR
        (topic_id IS NULL AND curriculum_item_id IS NOT NULL)
    )
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_provider ON courses(provider);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_track ON courses(track);
CREATE INDEX idx_courses_course_type ON courses(course_type);
CREATE INDEX idx_curriculum_items_course_id ON curriculum_items(course_id);
CREATE INDEX idx_curriculum_items_course_slug ON curriculum_items(course_slug);
CREATE INDEX idx_topics_curriculum_item_id ON topics(curriculum_item_id);
CREATE INDEX idx_lessons_topic_id ON lessons(topic_id);
CREATE INDEX idx_lessons_curriculum_item_id ON lessons(curriculum_item_id);

-- ============================================
-- 3. CREATE TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_curriculum_items_updated_at
    BEFORE UPDATE ON curriculum_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topics_updated_at
    BEFORE UPDATE ON topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- NOTE: Data population will be done via the
-- JavaScript/TypeScript migration script
-- (migrate_lms_data.js)
-- ============================================

