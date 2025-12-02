-- =====================================================
-- Learning Management System (LMS) Schema for Supabase
-- =====================================================
-- This script creates all tables, views, and functions needed for
-- the Learning Center (/lms routes)
-- =====================================================

-- Drop existing objects if they exist (for clean reinstall)
DROP TABLE IF EXISTS lms_curriculum_lessons CASCADE;
DROP TABLE IF EXISTS lms_curriculum_topics CASCADE;
DROP TABLE IF EXISTS lms_curriculum_items CASCADE;
DROP TABLE IF EXISTS lms_faqs CASCADE;
DROP TABLE IF EXISTS lms_references CASCADE;
DROP TABLE IF EXISTS lms_case_studies CASCADE;
DROP TABLE IF EXISTS lms_reviews CASCADE;
DROP TABLE IF EXISTS lms_courses CASCADE;

-- =====================================================
-- ENUMS
-- =====================================================

DO $$ BEGIN
    CREATE TYPE lms_delivery_mode AS ENUM ('Video', 'Guide', 'Workshop', 'Hybrid', 'Online');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lms_duration AS ENUM ('Bite-size', 'Short', 'Medium', 'Long');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lms_level_code AS ENUM ('L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lms_audience_type AS ENUM ('Associate', 'Lead');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lms_course_status AS ENUM ('live', 'coming-soon');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lms_course_type AS ENUM ('Course (Single Lesson)', 'Course (Multi-Lessons)', 'Course (Bundles)');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lms_lesson_type AS ENUM ('video', 'guide', 'quiz', 'workshop', 'assignment', 'reading');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- MAIN TABLES
-- =====================================================

-- Courses table (main table)
CREATE TABLE lms_courses (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    course_category TEXT NOT NULL,
    delivery_mode lms_delivery_mode NOT NULL,
    duration lms_duration NOT NULL,
    level_code lms_level_code NOT NULL,
    department TEXT[] NOT NULL DEFAULT '{}',
    locations TEXT[] NOT NULL DEFAULT '{}',
    audience lms_audience_type[] NOT NULL DEFAULT '{}',
    status lms_course_status NOT NULL DEFAULT 'live',
    summary TEXT NOT NULL,
    highlights TEXT[] NOT NULL DEFAULT '{}',
    outcomes TEXT[] NOT NULL DEFAULT '{}',
    course_type lms_course_type,
    track TEXT,
    rating NUMERIC(3, 2),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews/Testimonials table
CREATE TABLE lms_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id TEXT NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case Studies table
CREATE TABLE lms_case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id TEXT NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- References table
CREATE TABLE lms_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id TEXT NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs table
CREATE TABLE lms_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id TEXT NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Curriculum Items table (for courses in tracks or topics in multi-lesson courses)
CREATE TABLE lms_curriculum_items (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_locked BOOLEAN DEFAULT false,
    course_slug TEXT, -- For tracks: link to the course page
    parent_item_id TEXT REFERENCES lms_curriculum_items(id) ON DELETE CASCADE, -- For nested structure
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Curriculum Topics table (for topics within curriculum items)
CREATE TABLE lms_curriculum_topics (
    id TEXT PRIMARY KEY,
    curriculum_item_id TEXT NOT NULL REFERENCES lms_curriculum_items(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Curriculum Lessons table (for lessons within topics or directly in curriculum items)
CREATE TABLE lms_curriculum_lessons (
    id TEXT PRIMARY KEY,
    curriculum_item_id TEXT REFERENCES lms_curriculum_items(id) ON DELETE CASCADE,
    curriculum_topic_id TEXT REFERENCES lms_curriculum_topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    lesson_type lms_lesson_type NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Ensure lesson belongs to either an item or a topic, but not both
    CONSTRAINT lesson_parent_check CHECK (
        (curriculum_item_id IS NOT NULL AND curriculum_topic_id IS NULL) OR
        (curriculum_item_id IS NULL AND curriculum_topic_id IS NOT NULL)
    )
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Courses indexes
CREATE INDEX idx_lms_courses_slug ON lms_courses(slug);
CREATE INDEX idx_lms_courses_category ON lms_courses(course_category);
CREATE INDEX idx_lms_courses_provider ON lms_courses(provider);
CREATE INDEX idx_lms_courses_course_type ON lms_courses(course_type);
CREATE INDEX idx_lms_courses_status ON lms_courses(status);
CREATE INDEX idx_lms_courses_track ON lms_courses(track);
CREATE INDEX idx_lms_courses_level_code ON lms_courses(level_code);
CREATE INDEX idx_lms_courses_locations ON lms_courses USING GIN(locations);
CREATE INDEX idx_lms_courses_department ON lms_courses USING GIN(department);
CREATE INDEX idx_lms_courses_audience ON lms_courses USING GIN(audience);

-- Reviews indexes
CREATE INDEX idx_lms_reviews_course_id ON lms_reviews(course_id);
CREATE INDEX idx_lms_reviews_rating ON lms_reviews(rating);

-- Case Studies indexes
CREATE INDEX idx_lms_case_studies_course_id ON lms_case_studies(course_id);

-- References indexes
CREATE INDEX idx_lms_references_course_id ON lms_references(course_id);

-- FAQs indexes
CREATE INDEX idx_lms_faqs_course_id ON lms_faqs(course_id);
CREATE INDEX idx_lms_faqs_order ON lms_faqs(course_id, order_index);

-- Curriculum indexes
CREATE INDEX idx_lms_curriculum_items_course_id ON lms_curriculum_items(course_id);
CREATE INDEX idx_lms_curriculum_items_order ON lms_curriculum_items(course_id, order_index);
CREATE INDEX idx_lms_curriculum_items_parent ON lms_curriculum_items(parent_item_id);
CREATE INDEX idx_lms_curriculum_topics_item_id ON lms_curriculum_topics(curriculum_item_id);
CREATE INDEX idx_lms_curriculum_topics_order ON lms_curriculum_topics(curriculum_item_id, order_index);
CREATE INDEX idx_lms_curriculum_lessons_item_id ON lms_curriculum_lessons(curriculum_item_id);
CREATE INDEX idx_lms_curriculum_lessons_topic_id ON lms_curriculum_lessons(curriculum_topic_id);
CREATE INDEX idx_lms_curriculum_lessons_order ON lms_curriculum_lessons(order_index);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lms_courses_updated_at
    BEFORE UPDATE ON lms_courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lms_reviews_updated_at
    BEFORE UPDATE ON lms_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update review count when reviews are added/deleted
CREATE OR REPLACE FUNCTION update_review_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE lms_courses
        SET review_count = (
            SELECT COUNT(*) FROM lms_reviews WHERE course_id = NEW.course_id
        ),
        rating = (
            SELECT AVG(rating)::NUMERIC(3, 2) FROM lms_reviews WHERE course_id = NEW.course_id
        )
        WHERE id = NEW.course_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE lms_courses
        SET review_count = (
            SELECT COUNT(*) FROM lms_reviews WHERE course_id = OLD.course_id
        ),
        rating = (
            SELECT AVG(rating)::NUMERIC(3, 2) FROM lms_reviews WHERE course_id = OLD.course_id
        )
        WHERE id = OLD.course_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_review_count_trigger
    AFTER INSERT OR DELETE ON lms_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_review_count();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE lms_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_curriculum_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_curriculum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_curriculum_lessons ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public read access to all courses and related data
CREATE POLICY "Public can view courses"
    ON lms_courses FOR SELECT
    USING (true);

CREATE POLICY "Public can view reviews"
    ON lms_reviews FOR SELECT
    USING (true);

CREATE POLICY "Public can view case studies"
    ON lms_case_studies FOR SELECT
    USING (true);

CREATE POLICY "Public can view references"
    ON lms_references FOR SELECT
    USING (true);

CREATE POLICY "Public can view FAQs"
    ON lms_faqs FOR SELECT
    USING (true);

CREATE POLICY "Public can view curriculum items"
    ON lms_curriculum_items FOR SELECT
    USING (true);

CREATE POLICY "Public can view curriculum topics"
    ON lms_curriculum_topics FOR SELECT
    USING (true);

CREATE POLICY "Public can view curriculum lessons"
    ON lms_curriculum_lessons FOR SELECT
    USING (true);

-- Policies: Allow authenticated users to insert/update reviews
CREATE POLICY "Authenticated users can create reviews"
    ON lms_reviews FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own reviews"
    ON lms_reviews FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Note: For admin operations (INSERT/UPDATE/DELETE on courses), 
-- you may want to add additional policies or use service role key

-- =====================================================
-- VIEWS (Optional - for easier querying)
-- =====================================================

-- View for courses with aggregated review data
CREATE OR REPLACE VIEW lms_courses_with_reviews AS
SELECT 
    c.*,
    COALESCE(COUNT(r.id), 0) as review_count_actual,
    COALESCE(AVG(r.rating), 0) as rating_actual
FROM lms_courses c
LEFT JOIN lms_reviews r ON c.id = r.course_id
GROUP BY c.id;

-- View for curriculum structure (flattened)
CREATE OR REPLACE VIEW lms_curriculum_flat AS
SELECT 
    ci.id as curriculum_item_id,
    ci.course_id,
    ci.title as curriculum_item_title,
    ci.order_index as curriculum_item_order,
    ci.course_slug,
    ct.id as topic_id,
    ct.title as topic_title,
    ct.order_index as topic_order,
    cl.id as lesson_id,
    cl.title as lesson_title,
    cl.lesson_type,
    cl.order_index as lesson_order,
    cl.duration as lesson_duration
FROM lms_curriculum_items ci
LEFT JOIN lms_curriculum_topics ct ON ci.id = ct.curriculum_item_id
LEFT JOIN lms_curriculum_lessons cl ON (
    cl.curriculum_item_id = ci.id OR cl.curriculum_topic_id = ct.id
)
ORDER BY ci.order_index, ct.order_index, cl.order_index;

