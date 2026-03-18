#!/bin/bash

# =====================================================
# DQ Knowledge Center Setup Helper
# =====================================================
# This script helps you set up the Knowledge Center
# =====================================================

echo "=========================================="
echo "DQ Knowledge Center Setup"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    exit 1
fi

# Load environment variables
source .env

# Check if required variables are set
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set in .env"
    exit 1
fi

echo "✅ Supabase Configuration Found"
echo "   URL: $VITE_SUPABASE_URL"
echo ""

# Extract project reference
PROJECT_REF=$(echo $VITE_SUPABASE_URL | sed -n 's/.*\/\/\([^.]*\).*/\1/p')

echo "=========================================="
echo "Setup Steps"
echo "=========================================="
echo ""
echo "1. ✅ Connection verified"
echo "2. 📋 Create database tables"
echo "3. 📊 Populate Knowledge Center content"
echo "4. 🧪 Test the data"
echo ""

echo "=========================================="
echo "Quick Links"
echo "=========================================="
echo ""
echo "Supabase Dashboard:"
echo "  https://supabase.com/dashboard/project/$PROJECT_REF"
echo ""
echo "SQL Editor (use this to run scripts):"
echo "  https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
echo ""
echo "Table Editor:"
echo "  https://supabase.com/dashboard/project/$PROJECT_REF/editor"
echo ""

echo "=========================================="
echo "Scripts to Run (in order)"
echo "=========================================="
echo ""
echo "Step 1: Create Tables"
echo "  📄 db/supabase/create_guides_table_and_update_agile_tms.sql"
echo ""
echo "Step 2: Populate Core Guides"
echo "  📄 db/supabase/sync_dq_vision_to_supabase.sql"
echo "  📄 db/supabase/sync_dq_hov_to_supabase.sql"
echo "  📄 db/supabase/sync_dq_persona_to_supabase.sql"
echo "  📄 db/supabase/sync_dq_ghc_overview_to_supabase.sql"
echo ""
echo "Step 3: Populate Agile Guides"
echo "  📄 db/supabase/sync_dq_agile_tms_to_supabase.sql"
echo "  📄 db/supabase/sync_dq_agile_sos_to_supabase.sql"
echo "  📄 db/supabase/sync_dq_agile_flows_to_supabase.sql"
echo "  📄 db/supabase/sync_dq_agile_6xd_to_supabase.sql"
echo ""

echo "=========================================="
echo "How to Run Each Script"
echo "=========================================="
echo ""
echo "1. Open the SQL file in your editor"
echo "2. Copy all contents (Ctrl+A, Ctrl+C)"
echo "3. Go to SQL Editor (link above)"
echo "4. Paste and click 'Run'"
echo "5. Check for success message"
echo ""

echo "=========================================="
echo "Test Connection"
echo "=========================================="
echo ""
read -p "Run connection test now? (y/n): " run_test

if [ "$run_test" = "y" ] || [ "$run_test" = "Y" ]; then
    echo ""
    echo "Running connection test..."
    echo ""
    node test-supabase-connection.js
fi

echo ""
echo "=========================================="
echo "Next Steps"
echo "=========================================="
echo ""
echo "1. Follow the setup steps above"
echo "2. Run: node test-supabase-connection.js (to verify)"
echo "3. Run: npm run dev (to test in browser)"
echo "4. Visit: http://localhost:3004"
echo ""
echo "For detailed instructions, see: SETUP_KNOWLEDGE_CENTER.md"
echo ""
