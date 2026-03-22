# Implementation Plan: Document Wallet

## Overview

This implementation plan converts the Document Wallet design into a series of incremental coding tasks. The system will be built using React with TypeScript for the frontend, Node.js/Express for the backend, React Query for state management, Azure Blob Storage for file storage, and Microsoft Dataverse for metadata storage. Each task builds on previous work to create a complete document management system with version control, expiration tracking, and role-based access control.

## Tasks

- [ ] 1. Set up project structure and core interfaces
  - Create TypeScript interfaces for Document, DocumentVersion, and Organization entities
  - Set up React Query configuration and providers
  - Define API response types and error handling interfaces
  - Create utility functions for date calculations and path generation
  - _Requirements: 12.1, 12.2, 12.4_

- [ ] 2. Implement business logic services
  - [ ] 2.1 Create document status calculation service
    - Implement calculateDocumentStatus function with Active/Pending Renewal/Expired logic
    - Add date utility functions for 30-day expiration window calculations
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 2.2 Write property test for document status calculation
    - **Property 8: Document Status Calculation**
    - **Validates: Requirements 4.1, 4.2, 4.3**

  - [ ] 2.3 Create version number calculation service
    - Implement calculateNextVersionNumber function with max version + 1 logic
    - Add graceful handling for missing kf_documentversions table
    - _Requirements: 3.1, 11.1_

  - [ ]* 2.4 Write property test for version number calculation
    - **Property 6: Version Number Calculation**
    - **Validates: Requirements 3.1**

  - [ ] 2.5 Create organization ID extraction service
    - Implement extractOrgIdFromToken with JWT-first, API-fallback pattern
    - Add in-memory caching for organization ID performance
    - _Requirements: 6.1, 6.2, 7.4_

  - [ ]* 2.6 Write property test for organization ID extraction
    - **Property 11: Organization ID Extraction Priority**
    - **Validates: Requirements 6.1, 6.2**

- [ ] 3. Implement data mapping and DTO services
  - [ ] 3.1 Create Dataverse to frontend DTO mapping functions
    - Implement mapDataverseToDocument with all field transformations
    - Create mapDataverseToDocumentVersion for version entities
    - Add confidentiality level and status mapping utilities
    - _Requirements: 12.1, 12.4, 12.5_

  - [ ] 3.2 Create frontend to Dataverse DTO mapping functions
    - Implement mapDocumentToDataverse with kf_Account@odata.bind format
    - Create mapDocumentVersionToDataverse for version creation
    - Add reverse mapping for all entity relationships
    - _Requirements: 12.2, 6.5, 12.3_

  - [ ]* 3.3 Write property test for data mapping round trip
    - **Property 17: Data Mapping Round Trip**
    - **Validates: Requirements 12.1, 12.2, 12.4, 12.5**

- [ ] 4. Implement blob storage and SAS URL services
  - [ ] 4.1 Create blob storage path generation service
    - Implement generateBlobPath with org/{orgId}/documents/{documentId}/v{versionNumber}/{filename} format
    - Add path validation and sanitization functions
    - _Requirements: 2.3, 3.2, 15.1_

  - [ ]* 4.2 Write property test for blob storage path consistency
    - **Property 7: Version Storage Path Consistency**
    - **Validates: Requirements 3.2, 15.1**

  - [ ] 4.3 Create SAS URL generation service
    - Implement generateSasUrl with confidentiality-based expiry times (15 min for confidential, 60 min standard)
    - Add time-limited URL generation with proper expiration handling
    - _Requirements: 5.2, 5.3, 15.3, 15.4_

  - [ ]* 4.4 Write property test for SAS URL expiry rules
    - **Property 9: SAS URL Expiry Rules**
    - **Validates: Requirements 5.2, 5.3, 15.4**

  - [ ]* 4.5 Write property test for SAS URL time limitation
    - **Property 19: SAS URL Time Limitation**
    - **Validates: Requirements 15.3**

- [ ] 5. Implement authentication and authorization middleware
  - [ ] 5.1 Create JWT token validation middleware
    - Implement validateJwtToken with proper error handling
    - Add token extraction from Authorization header
    - Create user context extraction from validated tokens
    - _Requirements: 7.1, 7.4_

  - [ ] 5.2 Create role-based permission checking service
    - Implement checkPermissions with role and action validation
    - Add permission matrix for document operations (create, read, update, delete)
    - Create authorization middleware for API endpoints
    - _Requirements: 7.2, 7.3, 5.4, 10.3_

  - [ ]* 5.3 Write property test for permission validation
    - **Property 10: Permission Validation**
    - **Validates: Requirements 5.4, 7.2, 7.3, 10.3**

  - [ ] 5.4 Create organization scoping middleware
    - Implement organizationScopingMiddleware with automatic org ID extraction
    - Add request context enhancement with organization information
    - _Requirements: 6.4, 1.1_

- [ ] 6. Checkpoint - Core services validation
  - Ensure all business logic services pass their tests
  - Verify data mapping functions work correctly
  - Confirm authentication and authorization middleware functions properly
  - Ask the user if questions arise

- [ ] 7. Implement API endpoints and routing
  - [ ] 7.1 Create document CRUD API endpoints
    - Implement GET /api/v1/documents with search, category, and status filters
    - Implement GET /api/v1/documents/:id for single document retrieval
    - Implement POST /api/v1/documents for document creation with multipart/form-data
    - Implement DELETE /api/v1/documents/:id for document deletion
    - _Requirements: 14.1, 14.2, 14.4, 14.7_

  - [ ] 7.2 Create document version API endpoints
    - Implement GET /api/v1/documents/:id/versions for version history
    - Implement POST /api/v1/documents/:id/versions for version creation
    - Implement GET /api/v1/documents/:id/versions/:versionId/download for secure downloads
    - _Requirements: 14.3, 14.5, 14.6_

  - [ ]* 7.3 Write property test for API endpoint functionality
    - **Property 18: API Endpoint Functionality**
    - **Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7**

- [ ] 8. Implement file upload and validation
  - [ ] 8.1 Create file upload validation service
    - Implement file format and size validation with configurable limits
    - Add MIME type checking and file extension validation
    - Create multipart/form-data parsing and handling
    - _Requirements: 2.1, 15.2_

  - [ ]* 8.2 Write property test for file upload validation
    - **Property 4: File Upload Validation**
    - **Validates: Requirements 2.1**

  - [ ] 8.3 Create document creation service
    - Implement document creation with metadata validation (title, category, expiration date required)
    - Add initial version creation with version number 1
    - Integrate blob storage upload with proper path generation
    - _Requirements: 2.2, 2.4, 2.3_

  - [ ]* 8.4 Write property test for document creation consistency
    - **Property 5: Document Creation Consistency**
    - **Validates: Requirements 2.3, 2.4**

- [ ] 9. Implement React Query hooks for data management
  - [ ] 9.1 Create document query hooks
    - Implement useDocumentsQuery with filtering, search, and caching
    - Implement useDocumentDetails with auto-refresh and error handling
    - Implement useDocumentVersions with version history management
    - Add proper React Query configuration with stale time and cache invalidation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.5_

  - [ ] 9.2 Create document mutation hooks
    - Implement useCreateDocument with optimistic updates and cache invalidation
    - Implement useCreateDocumentVersion with version management
    - Implement useDeleteDocument with cleanup and cache invalidation
    - Add error handling and retry logic for all mutations
    - _Requirements: 2.6, 3.3, 10.4_

  - [ ] 9.3 Create specialized hooks
    - Implement useExpiringDocuments with 30-day expiration filtering and auto-refresh
    - Add dashboard data hooks for summary statistics
    - _Requirements: 9.1, 8.1, 8.2, 8.3_

- [ ] 10. Implement frontend filtering and search functionality
  - [ ] 10.1 Create document filtering service
    - Implement organization scoping filter with user context
    - Create search functionality for title and category matching
    - Add status-based filtering with real-time status calculation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.5_

  - [ ]* 10.2 Write property test for organization scoping consistency
    - **Property 1: Organization Scoping Consistency**
    - **Validates: Requirements 1.1, 6.4**

  - [ ]* 10.3 Write property test for search and filter correctness
    - **Property 2: Search and Filter Correctness**
    - **Validates: Requirements 1.2, 1.3**

  - [ ]* 10.4 Write property test for status filter accuracy
    - **Property 3: Status Filter Accuracy**
    - **Validates: Requirements 1.4, 4.5**

- [ ] 11. Implement React components for document management
  - [ ] 11.1 Create DocumentWallet main container component
    - Implement main container with React Query integration
    - Add search input, category filter, and status filter controls
    - Create refresh functionality with manual and automatic refresh
    - Integrate with useDocumentsQuery hook for data management
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 11.2 Create DocumentTable component
    - Implement document listing with server data integration
    - Add all required columns (title, category, status, expiration, version, dates)
    - Create sorting and filtering functionality with React Query
    - Add click handlers for document selection and actions
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 11.3 Create DocumentUpload component
    - Implement upload modal with form validation
    - Add file selection with drag-and-drop support
    - Create progress tracking during upload with real-time updates
    - Integrate with useCreateDocument hook and multipart/form-data submission
    - _Requirements: 2.1, 2.2, 2.5, 2.6_

- [ ] 12. Implement document details and version management
  - [ ] 12.1 Create DocumentDetail component
    - Implement document details view with metadata display
    - Add version history table with creation dates and version numbers
    - Create auto-refresh functionality with React Query
    - Add download links for each version with SAS URL generation
    - _Requirements: 3.4, 3.5, 5.1_

  - [ ] 12.2 Create version creation functionality
    - Implement new version upload with file validation
    - Add version number calculation and display
    - Create version metadata management with proper updates
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 13. Implement dashboard and summary components
  - [ ] 13.1 Create DocumentDashboard component
    - Implement summary tiles with real-time API data
    - Add total document count, status counts, and category counts
    - Create click handlers for filtering document list by tile selection
    - Integrate with dashboard data hooks for automatic updates
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 13.2 Write property test for dashboard count accuracy
    - **Property 13: Dashboard Count Accuracy**
    - **Validates: Requirements 8.1, 8.2, 8.3**

  - [ ] 13.3 Create DocumentNotification component
    - Implement expiring document notifications with independent API calls
    - Add notification display with document title, expiration date, and days remaining
    - Create auto-refresh functionality with configurable intervals
    - Add links to document details from notifications
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 13.4 Write property test for expiring document identification
    - **Property 14: Expiring Document Identification**
    - **Validates: Requirements 9.1**

- [ ] 14. Implement document deletion functionality
  - [ ] 14.1 Create document deletion service
    - Implement deletion with blob storage cleanup for all versions
    - Add Dataverse metadata removal with proper error handling
    - Create permission validation before deletion operations
    - Add transaction-like behavior to ensure complete cleanup
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ]* 14.2 Write property test for document deletion completeness
    - **Property 15: Document Deletion Completeness**
    - **Validates: Requirements 10.1, 10.2, 15.5**

  - [ ] 14.3 Add deletion UI integration
    - Create delete confirmation dialogs with proper warnings
    - Add delete buttons with permission-based visibility
    - Integrate with useDeleteDocument hook for optimistic updates
    - _Requirements: 10.4, 10.5_

- [ ] 15. Implement error handling and resilience
  - [ ] 15.1 Create comprehensive error handling system
    - Implement graceful handling for missing kf_documentversions table
    - Add user-friendly error messages throughout the application
    - Create retry mechanisms for network issues and transient failures
    - Add validation error handling with field-level error display
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 15.2 Write property test for error handling resilience
    - **Property 16: Error Handling Resilience**
    - **Validates: Requirements 11.1**

- [ ] 16. Implement account relationship and data format handling
  - [ ] 16.1 Create account relationship service
    - Implement kf_Account@odata.bind format handling for organization associations
    - Add proper relationship mapping in document creation and updates
    - Create validation for account relationship format consistency
    - _Requirements: 6.5, 12.3_

  - [ ]* 16.2 Write property test for account relationship format
    - **Property 12: Account Relationship Format**
    - **Validates: Requirements 6.5, 12.3**

- [ ] 17. Final integration and testing
  - [ ] 17.1 Wire all components together
    - Connect all React components with proper data flow
    - Integrate all API endpoints with frontend components
    - Add proper error boundaries and loading states throughout the application
    - Create complete document management workflow from upload to deletion
    - _Requirements: All requirements integration_

  - [ ]* 17.2 Write integration tests for complete workflows
    - Test complete document lifecycle (create, version, download, delete)
    - Test user authentication and authorization flows
    - Test error scenarios and recovery mechanisms
    - _Requirements: All requirements validation_

- [ ] 18. Final checkpoint - Complete system validation
  - Ensure all property-based tests pass with 100+ iterations
  - Verify all unit tests pass for components and services
  - Confirm all API endpoints work correctly with proper authentication
  - Test complete user workflows from frontend to backend
  - Validate error handling and resilience across all scenarios
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based testing tasks that can be skipped for faster MVP
- Each task references specific requirements for traceability and validation
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples, edge cases, and UI behavior
- Checkpoints ensure incremental validation and provide opportunities for feedback
- The implementation follows a bottom-up approach, building core services first, then API layer, then UI components
- React Query provides caching, synchronization, and optimistic updates throughout the system
- All file operations use Azure Blob Storage with proper SAS URL security
- All metadata operations use Microsoft Dataverse with proper DTO mapping
- Authentication and authorization are enforced at both API and UI levels