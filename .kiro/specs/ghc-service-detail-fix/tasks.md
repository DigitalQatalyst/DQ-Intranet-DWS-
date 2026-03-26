# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - GHC Services Display Generic Content Instead of Specific Content
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - Test that GHC service IDs ('ghc', 'dq-vision', 'dq-hov', 'dq-persona', 'dq-agile-tms', 'dq-agile-sos', 'dq-agile-flows', 'dq-agile-6xd') display specific content from GUIDE_CONTENT instead of generic "DQ Associate Owned Asset Guidelines"
  - The test assertions should match the Expected Behavior Properties from design: specific titles, descriptions, 4-tab structure, and element-specific content
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-GHC Service Behavior Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-GHC services (services that are NOT in the GHC service ID list)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Test that non-GHC services continue to display current static content, tab structure, navigation, and styling
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Fix for GHC service detail page content display

  - [x] 3.1 Implement GHC service detection and content mapping
    - Import GUIDE_CONTENT constant from src/constants/guideContent.ts
    - Add helper function to detect if serviceId is a GHC service
    - Add helper function to map GHC serviceId to GUIDE_CONTENT key
    - Add conditional logic to use GUIDE_CONTENT for GHC services instead of Supabase data
    - _Bug_Condition: isBugCondition(input) where input.serviceId IN ['ghc', 'dq-vision', 'dq-hov', 'dq-persona', 'dq-agile-tms', 'dq-agile-sos', 'dq-agile-flows', 'dq-agile-6xd'] AND input.serviceData.title == "DQ Associate Owned Asset Guidelines"_
    - _Expected_Behavior: expectedBehavior(result) - GHC services display specific content from GUIDE_CONTENT with correct titles, descriptions, and 4-tab structure_
    - _Preservation: Non-GHC services continue to display current static content and structure_
    - _Requirements: 2.1, 2.2, 3.1_

  - [x] 3.2 Update tab structure for GHC services
    - Modify tab navigation to show 4 tabs for GHC services: "Overview", "Understand", "Learn & Practice", "Other Materials"
    - Keep existing 4 tabs for non-GHC services: "Service Details", "How to Request", "FAQ", "Contact & SLA"
    - Update tab content rendering to use GUIDE_CONTENT fields for GHC services
    - Map Overview tab to shortOverview and highlights from GUIDE_CONTENT
    - Map Understand tab to storybookIntro and whatYouWillLearn from GUIDE_CONTENT
    - Map Learn & Practice tab to courseIntro and whatYouWillPractice from GUIDE_CONTENT
    - Map Other Materials tab to placeholder content for future expansion
    - _Requirements: 2.3, 3.2_

  - [x] 3.3 Update hero section and summary for GHC services
    - Update hero section to use title and subtitle from GUIDE_CONTENT for GHC services
    - Update service summary sidebar to show "[GHC Element Name] Summary" instead of "Service Summary"
    - Update related services section to "Related Competencies" for GHC services
    - Preserve existing hero and summary structure for non-GHC services
    - _Requirements: 2.2, 2.4, 3.3_

  - [x] 3.4 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - GHC Services Display Specific Content
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: Expected Behavior Properties from design - 2.1, 2.2, 2.3, 2.4_

  - [x] 3.5 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-GHC Service Behavior Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.