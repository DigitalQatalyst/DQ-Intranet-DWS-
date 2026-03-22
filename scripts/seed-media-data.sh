#!/bin/bash

# Seed Media Center Data
# This script runs all seed SQL files for news and jobs

echo "🌱 Seeding Media Center data..."
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ psql command not found"
    echo "   Please run the SQL files manually in Supabase Dashboard"
    echo ""
    echo "   Files to run:"
    echo "   1. supabase/seed-news-announcements.sql"
    echo "   2. supabase/seed-news-blogs.sql"
    echo "   3. supabase/seed-news-podcasts.sql"
    echo "   4. supabase/seed-jobs-openings.sql"
    exit 1
fi

echo "✅ Found psql"
echo ""
echo "📋 Instructions:"
echo "   Copy and paste each SQL file into Supabase SQL Editor"
echo "   Or use psql with your connection string"
echo ""
echo "Files to seed:"
echo "  1. supabase/seed-news-announcements.sql"
echo "  2. supabase/seed-news-blogs.sql"
echo "  3. supabase/seed-news-podcasts.sql"
echo "  4. supabase/seed-jobs-openings.sql"
