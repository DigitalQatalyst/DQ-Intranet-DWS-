# Bugfix Requirements Document

## Introduction

The GHC service detail page currently displays identical static content for all 8 GHC service cards (Vision, HoV, Persona, Agile TMS, Agile SoS, Agile Flows, Agile 6xD, and the main GHC overview) instead of showing their specific content. This creates a confusing user experience where users cannot distinguish between different GHC elements and cannot access the rich, specific content that exists for each element in the `GUIDE_CONTENT` constant.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user clicks on any GHC service card (Vision, HoV, Persona, Agile TMS, Agile SoS, Agile Flows, Agile 6xD, or main GHC) THEN the system displays identical static content about "Associate Owned Asset Guidelines"

1.2 WHEN a user navigates to any GHC service detail page THEN the system shows the same hero description, overview content, and metadata regardless of which specific GHC element was selected

1.3 WHEN a user expects to see specific GHC element content (like Vision's purpose-driven content or Agile TMS's task management content) THEN the system displays generic guidelines content instead

1.4 WHEN a user views the tabs on a GHC service detail page THEN the system shows "Overview" and "Other Materials" tabs instead of the expected "Overview", "Understand", "Learn & Practice", and "Other Materials" tabs

1.5 WHEN a user looks at the summary section THEN the system shows "Guideline summary" instead of the specific GHC element name (e.g., "Vision Summary")

### Expected Behavior (Correct)

2.1 WHEN a user clicks on a specific GHC service card THEN the system SHALL display the unique content for that GHC element from the `GUIDE_CONTENT` constant

2.2 WHEN a user navigates to a GHC service detail page THEN the system SHALL show the specific hero description, highlights, and content that corresponds to the selected GHC element

2.3 WHEN a user views a GHC element detail page THEN the system SHALL display four tabs: "Overview", "Understand", "Learn & Practice", and "Other Materials" with content specific to that element

2.4 WHEN a user looks at the summary section THEN the system SHALL show "[GHC Element Name] Summary" (e.g., "Vision Summary", "Agile TMS Summary")

2.5 WHEN a user views the related services section THEN the system SHALL rename it to "Related Competencies" and show 3 other GHC elements

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user accesses non-GHC service guidelines (like the actual "DQ Associate Owned Asset Guidelines") THEN the system SHALL CONTINUE TO display the current static content and structure

3.2 WHEN a user navigates using breadcrumbs or the "More Detail" button THEN the system SHALL CONTINUE TO work as expected for non-GHC services

3.3 WHEN a user views the page layout, styling, and responsive behavior THEN the system SHALL CONTINUE TO maintain the existing design and user experience

3.4 WHEN a user accesses the page on different devices or screen sizes THEN the system SHALL CONTINUE TO display properly with the current responsive design