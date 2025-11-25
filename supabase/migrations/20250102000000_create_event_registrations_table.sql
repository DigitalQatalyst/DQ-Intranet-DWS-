-- Migration: Create event_registrations table
-- Description: Creates table to track user registrations for events
-- Date: 2025-01-02

-- =====================================================
-- Create event_registrations table
-- =====================================================

CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events_v2(id) ON DELETE CASCADE,
    
    -- User information (can be from auth.users or guest registration)
    user_id UUID REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT,
    
    -- Registration metadata
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'attended')),
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure one registration per email per event
    -- For authenticated users, user_id is used; for guests, email is used
    CONSTRAINT unique_email_registration UNIQUE(event_id, email)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_registered_at ON event_registrations(registered_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON event_registrations(status);

-- Add comments
COMMENT ON TABLE event_registrations IS 'Tracks user registrations for events from events_v2 table';
COMMENT ON COLUMN event_registrations.user_id IS 'ID of the user who registered (from auth.users or users table)';
COMMENT ON COLUMN event_registrations.event_id IS 'ID of the event from events_v2 table';
COMMENT ON COLUMN event_registrations.status IS 'Registration status: registered, cancelled, or attended';

-- Enable RLS (Row Level Security)
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own registrations
CREATE POLICY "Users can view their own registrations"
    ON event_registrations
    FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow anyone to insert registrations (for guest registrations)
CREATE POLICY "Anyone can insert registrations"
    ON event_registrations
    FOR INSERT
    WITH CHECK (true);

-- Users can update their own registrations
CREATE POLICY "Users can update their own registrations"
    ON event_registrations
    FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow public read access to registration counts (for event pages)
CREATE POLICY "Public can view registration counts"
    ON event_registrations
    FOR SELECT
    USING (true);


