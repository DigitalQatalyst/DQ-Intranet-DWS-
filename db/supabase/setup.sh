#!/bin/bash

# =====================================================
# Supabase Communities Setup Script
# =====================================================
# This script helps you set up the communities database
# =====================================================

echo "=========================================="
echo "Supabase Communities Setup"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f "../../.env" ]; then
    echo "❌ Error: .env file not found in project root"
    echo "Please create a .env file with your Supabase credentials"
    exit 1
fi

# Load environment variables
source ../../.env

# Check if required variables are set
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set in .env"
    exit 1
fi

echo "✓ Found Supabase configuration"
echo "  URL: $VITE_SUPABASE_URL"
echo ""

# Extract database connection details
PROJECT_REF=$(echo $VITE_SUPABASE_URL | sed -n 's/.*\/\/\([^.]*\).*/\1/p')

echo "=========================================="
echo "Setup Options"
echo "=========================================="
echo "1. Copy SQL to clipboard (manual paste in Supabase Dashboard)"
echo "2. Show connection string (for psql)"
echo "3. Exit"
echo ""
read -p "Choose an option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "=========================================="
        echo "Manual Setup Instructions"
        echo "=========================================="
        echo ""
        echo "1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
        echo ""
        echo "2. Copy and run communities_schema.sql:"
        echo "   - Open: db/supabase/communities_schema.sql"
        echo "   - Copy all contents"
        echo "   - Paste in Supabase SQL Editor"
        echo "   - Click 'Run'"
        echo ""
        echo "3. Copy and run communities_seed_data.sql:"
        echo "   - Open: db/supabase/communities_seed_data.sql"
        echo "   - Copy all contents"
        echo "   - Paste in Supabase SQL Editor"
        echo "   - Click 'Run'"
        echo ""
        echo "✓ Setup complete! Check your Supabase dashboard."
        ;;
    2)
        echo ""
        echo "=========================================="
        echo "Database Connection"
        echo "=========================================="
        echo ""
        echo "You'll need your database password from Supabase."
        echo ""
        echo "Connection string format:"
        echo "postgresql://postgres:[YOUR-PASSWORD]@db.$PROJECT_REF.supabase.co:5432/postgres"
        echo ""
        echo "To run the SQL files with psql:"
        echo ""
        echo "  psql \"postgresql://postgres:[PASSWORD]@db.$PROJECT_REF.supabase.co:5432/postgres\" \\"
        echo "    -f db/supabase/communities_schema.sql"
        echo ""
        echo "  psql \"postgresql://postgres:[PASSWORD]@db.$PROJECT_REF.supabase.co:5432/postgres\" \\"
        echo "    -f db/supabase/communities_seed_data.sql"
        echo ""
        ;;
    3)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "Next Steps"
echo "=========================================="
echo ""
echo "1. Verify tables were created in Supabase Dashboard"
echo "2. Test /communities route in your app"
echo "3. Test /communities/feed route"
echo "4. Create a test user and join a community"
echo ""
echo "For more information, see: db/supabase/README.md"
echo ""
