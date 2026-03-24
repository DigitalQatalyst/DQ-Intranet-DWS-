#!/usr/bin/env node

/**
 * Cleanup Temporary SQL Files Script
 * 
 * This script identifies and removes temporary SQL migration files
 * that are no longer needed and may be causing SonarQube blockers.
 * 
 * These are one-time migration scripts that should be removed after execution.
 */

const fs = require('fs');
const path = require('path');

// List of temporary SQL files that can be safely removed
const TEMP_SQL_FILES = [
  // Root directory temporary migration files
  'update_ghc_vision_content.sql',
  'update_ghc_persona_content.sql', 
  'update_ghc_overview_content.sql',
  'update_ghc_house_of_values_content.sql',
  'update_ghc_agile_tms_content.sql',
  'update_ghc_agile_sos_content.sql',
  'update_ghc_agile_flows_content.sql',
  'update_ghc_agile_6xd_content.sql',
  
  // Database directory temporary files
  'db/supabase/20250117_fix_ghc_duplicate_content.sql',
  'db/supabase/fix_all_ghc_duplicates.sql',
  'db/supabase/fix_persona_duplicate_content.sql',
  'db/supabase/create_missing_dq_hov.sql',
  'db/supabase/sync_dq_vision_to_supabase.sql',
  'db/supabase/sync_dq_persona_to_supabase.sql',
  'db/supabase/sync_dq_hov_to_supabase.sql',
  'db/supabase/sync_dq_hov_culture_to_supabase.sql',
  'db/supabase/sync_dq_ghc_to_supabase.sql',
  'db/supabase/sync_dq_ghc_overview_to_supabase.sql',
  'db/supabase/sync_dq_agile_tms_to_supabase.sql',
  'db/supabase/sync_dq_agile_sos_to_supabase.sql',
  'db/supabase/sync_dq_agile_flows_to_supabase.sql',
  'db/supabase/sync_dq_agile_6xd_to_supabase.sql',
  'db/supabase/03_insert_sample_content.sql',
  'db/supabase/update_ghc_from_ui_content.sql',
  
  // Debug and test files
  'db/supabase/check_vision_content.sql',
  'db/supabase/check_ghc_persona_duplicate.sql',
  'db/supabase/debug_content_mismatch.sql',
  'db/supabase/test_ghc_protection.sql',
  'db/supabase/step2_check_duplicates.sql',
  'db/supabase/verify_all_ghc_guides.sql',
  'db/supabase/verify_ghc_migration.sql',
  'db/supabase/verify_vision_content.sql'
];

console.log('🧹 Cleaning up temporary SQL files...');

let removedCount = 0;
let errors = [];

TEMP_SQL_FILES.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      console.log(`📁 Removing: ${filePath} (${Math.round(stats.size / 1024)}KB)`);
      fs.unlinkSync(fullPath);
      removedCount++;
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error removing ${filePath}:`, error.message);
    errors.push({ file: filePath, error: error.message });
  }
});

console.log(`\n✅ Cleanup complete!`);
console.log(`📊 Removed ${removedCount} temporary SQL files`);

if (errors.length > 0) {
  console.log(`\n⚠️  ${errors.length} errors occurred:`);
  errors.forEach(({ file, error }) => {
    console.log(`   - ${file}: ${error}`);
  });
}

console.log(`\n🎯 SonarQube blockers from SQL files should now be resolved!`);
