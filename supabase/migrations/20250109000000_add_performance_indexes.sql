-- Migration: Add performance indexes for events_v2, pulse_items, and communities
-- Description: Adds indexes to improve query performance for marketplace pages
-- Date: 2025-01-09

-- ============================================
-- STEP 1: Add indexes for events_v2 table
-- ============================================

-- Index for status filtering (most common filter)
CREATE INDEX IF NOT EXISTS idx_events_v2_status ON events_v2(status) WHERE status = 'published';

-- Index for start_time filtering (for range queries on future events)
-- Note: Cannot use NOW() in predicate, but this index will be used for range queries
CREATE INDEX IF NOT EXISTS idx_events_v2_start_time ON events_v2(start_time);

-- Composite index for common query pattern: status + start_time
-- This index will be used for queries filtering by status and ordering/sorting by start_time
CREATE INDEX IF NOT EXISTS idx_events_v2_status_start_time 
  ON events_v2(status, start_time) 
  WHERE status = 'published';

-- Index for department filtering
CREATE INDEX IF NOT EXISTS idx_events_v2_department ON events_v2(department) WHERE department IS NOT NULL;

-- Index for location_filter filtering
CREATE INDEX IF NOT EXISTS idx_events_v2_location_filter ON events_v2(location_filter) WHERE location_filter IS NOT NULL;

-- Composite index for department + location filter combination
CREATE INDEX IF NOT EXISTS idx_events_v2_dept_location 
  ON events_v2(department, location_filter) 
  WHERE status = 'published' AND department IS NOT NULL AND location_filter IS NOT NULL;

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_events_v2_category ON events_v2(category) WHERE category IS NOT NULL;

-- Index for is_virtual (delivery mode filter)
CREATE INDEX IF NOT EXISTS idx_events_v2_is_virtual ON events_v2(is_virtual) WHERE status = 'published';

-- ============================================
-- STEP 2: Add indexes for pulse_items table
-- ============================================

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_pulse_items_status ON pulse_items(status) WHERE status = 'published';

-- Index for published_at ordering
CREATE INDEX IF NOT EXISTS idx_pulse_items_published_at ON pulse_items(published_at DESC) WHERE status = 'published';

-- Index for department filtering
CREATE INDEX IF NOT EXISTS idx_pulse_items_department ON pulse_items(department) WHERE department IS NOT NULL;

-- Index for location_filter filtering
CREATE INDEX IF NOT EXISTS idx_pulse_items_location_filter ON pulse_items(location_filter) WHERE location_filter IS NOT NULL;

-- Index for type filtering
CREATE INDEX IF NOT EXISTS idx_pulse_items_type ON pulse_items(type) WHERE status = 'published';

-- Composite index for common query: status + published_at
CREATE INDEX IF NOT EXISTS idx_pulse_items_status_published 
  ON pulse_items(status, published_at DESC) 
  WHERE status = 'published';

-- ============================================
-- STEP 3: Add indexes for communities table
-- ============================================

-- Index for department filtering
CREATE INDEX IF NOT EXISTS idx_communities_department ON communities(department) WHERE department IS NOT NULL;

-- Index for location_filter filtering
CREATE INDEX IF NOT EXISTS idx_communities_location_filter ON communities(location_filter) WHERE location_filter IS NOT NULL;

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_communities_category ON communities(category) WHERE category IS NOT NULL;

-- Index for activitylevel filtering
CREATE INDEX IF NOT EXISTS idx_communities_activitylevel ON communities(activitylevel) WHERE activitylevel IS NOT NULL;

-- Composite index for search queries (name, description)
CREATE INDEX IF NOT EXISTS idx_communities_search 
  ON communities USING gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));

-- ============================================
-- STEP 4: Optimize pulse_items_with_stats view
-- ============================================

-- Note: The view itself doesn't need indexes, but we can add materialized view if needed
-- For now, ensure the underlying tables have proper indexes (done above)

-- Add comment
COMMENT ON INDEX idx_events_v2_status_start_time IS 'Composite index for filtering published future events';
COMMENT ON INDEX idx_pulse_items_status_published IS 'Composite index for filtering published pulse items by date';
COMMENT ON INDEX idx_communities_search IS 'Full-text search index for community name and description';

