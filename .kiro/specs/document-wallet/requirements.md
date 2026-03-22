# Requirements Document

## Introduction

The Document Wallet is a comprehensive document management system that enables organizations to securely store, manage, and track documents with version control, expiration monitoring, and role-based access control. The system integrates with Azure Blob Storage for file storage and Microsoft Dataverse for metadata management, providing a complete enterprise-grade document management solution.

## Glossary

- **Document_Wallet**: The main document management system
- **Document**: A file with associated metadata including title, category, expiration date, and confidentiality level
- **Document_Version**: A specific version of a document with unique version number and file content
- **Organisation**: A tenant organization that owns and manages documents
- **User**: An authenticated person who can interact with documents based on their role permissions
- **Blob_Storage**: Azure Blob Storage service for file storage
- **Dataverse**: Microsoft Dataverse service for metadata storage
- **SAS_URL**: Shared Access Signature URL for secure file downloads
- **JWT_Token**: JSON Web Token for user authentication and authorization

## Requirements

### Requirement 1: Document Management

**User Story:** As a user, I want to manage documents in my organization, so that I can store, organize, and access important files securely.

#### Acceptance Criteria

1. WHEN a user views the document wallet, THE Document_Wallet SHALL display all documents belonging to their organization
2. WHEN a user searches for documents, THE Document_Wallet SHALL filter results by title and category
3. WHEN a user filters by category, THE Document_Wallet SHALL show only documents matching the selected category
4. WHEN a user filters by status, THE Document_Wallet SHALL show only documents matching the selected status (Active/Pending Renewal/Expired)
5. WHEN a user refreshes the document list, THE Document_Wallet SHALL fetch the latest data from the server

### Requirement 2: Document Upload and Creation

**User Story:** As a user, I want to upload new documents, so that I can add important files to the organization's document repository.

#### Acceptance Criteria

1. WHEN a user uploads a document, THE Document_Wallet SHALL validate the file format and size
2. WHEN a user provides document metadata, THE Document_Wallet SHALL require title, category, and expiration date
3. WHEN a document is uploaded, THE Document_Wallet SHALL store the file in Blob_Storage with the path org/{orgId}/documents/{documentId}/v1/{filename}
4. WHEN a document is created, THE Document_Wallet SHALL save metadata to Dataverse with initial version number 1
5. WHEN upload is in progress, THE Document_Wallet SHALL display upload progress to the user
6. WHEN upload completes successfully, THE Document_Wallet SHALL refresh the document list automatically

### Requirement 3: Document Versioning

**User Story:** As a user, I want to manage document versions, so that I can track changes and maintain document history.

#### Acceptance Criteria

1. WHEN a user creates a new version, THE Document_Wallet SHALL calculate the next version number as maximum existing version plus one
2. WHEN a new version is uploaded, THE Document_Wallet SHALL store it in Blob_Storage with path org/{orgId}/documents/{documentId}/v{n}/{filename}
3. WHEN a new version is created, THE Document_Wallet SHALL update the document's current version reference
4. WHEN a user views document details, THE Document_Wallet SHALL display all versions with their creation dates and version numbers
5. WHEN version history is requested, THE Document_Wallet SHALL retrieve all versions from Dataverse

### Requirement 4: Document Status Calculation

**User Story:** As a user, I want to see document status based on expiration dates, so that I can identify documents requiring attention.

#### Acceptance Criteria

1. WHEN calculating document status, THE Document_Wallet SHALL mark documents as "Active" if expiration date is more than 30 days away
2. WHEN calculating document status, THE Document_Wallet SHALL mark documents as "Pending Renewal" if expiration date is within 30 days
3. WHEN calculating document status, THE Document_Wallet SHALL mark documents as "Expired" if expiration date has passed
4. WHEN document status is displayed, THE Document_Wallet SHALL use the calculated status based on current date
5. WHEN documents are filtered by status, THE Document_Wallet SHALL apply real-time status calculation

### Requirement 5: Document Download and Access

**User Story:** As a user, I want to download document versions, so that I can access the actual file content.

#### Acceptance Criteria

1. WHEN a user requests a document download, THE Document_Wallet SHALL generate a SAS_URL for the specific version
2. WHEN a document is marked as confidential, THE Document_Wallet SHALL set SAS_URL expiry to 15 minutes
3. WHEN a document is not confidential, THE Document_Wallet SHALL set SAS_URL expiry to standard duration
4. WHEN download is requested, THE Document_Wallet SHALL validate user permissions before generating SAS_URL
5. WHEN SAS_URL is generated, THE Document_Wallet SHALL return it for immediate download

### Requirement 6: Organization Scoping

**User Story:** As a system administrator, I want documents to be scoped to organizations, so that users only see documents from their organization.

#### Acceptance Criteria

1. WHEN extracting organization ID, THE Document_Wallet SHALL first attempt to get it from JWT_Token
2. WHEN JWT_Token doesn't contain organization ID, THE Document_Wallet SHALL call the API to retrieve it
3. WHEN organization ID is retrieved from API, THE Document_Wallet SHALL cache it in memory for performance
4. WHEN accessing documents, THE Document_Wallet SHALL filter all results by the user's organization ID
5. WHEN creating documents, THE Document_Wallet SHALL associate them with the user's organization using kf_Account@odata.bind format

### Requirement 7: Authentication and Authorization

**User Story:** As a system administrator, I want role-based access control, so that users can only perform actions they are authorized for.

#### Acceptance Criteria

1. WHEN a user makes a request, THE Document_Wallet SHALL validate the JWT_Token
2. WHEN performing write operations, THE Document_Wallet SHALL check user permissions against their role
3. WHEN permission check fails, THE Document_Wallet SHALL return an authorization error
4. WHEN user is authenticated, THE Document_Wallet SHALL extract their organization ID for scoping
5. WHEN handling Azure AD roles, THE Document_Wallet SHALL process role GUIDs correctly

### Requirement 8: Document Dashboard and Summary

**User Story:** As a user, I want to see a dashboard summary, so that I can quickly understand the state of documents in my organization.

#### Acceptance Criteria

1. WHEN displaying the dashboard, THE Document_Wallet SHALL show total document count
2. WHEN displaying the dashboard, THE Document_Wallet SHALL show count of documents by status (Active/Pending/Expired)
3. WHEN displaying the dashboard, THE Document_Wallet SHALL show count of documents by category
4. WHEN a user clicks on a summary tile, THE Document_Wallet SHALL filter the document list accordingly
5. WHEN dashboard data is loaded, THE Document_Wallet SHALL fetch real-time data from the API

### Requirement 9: Expiring Document Notifications

**User Story:** As a user, I want to be notified about expiring documents, so that I can take action before documents expire.

#### Acceptance Criteria

1. WHEN loading expiring documents, THE Document_Wallet SHALL identify documents expiring within 30 days
2. WHEN displaying notifications, THE Document_Wallet SHALL show document title, expiration date, and days remaining
3. WHEN notification data is fetched, THE Document_Wallet SHALL use independent API calls for performance
4. WHEN notifications are displayed, THE Document_Wallet SHALL auto-refresh the data periodically
5. WHEN a user views notifications, THE Document_Wallet SHALL provide links to document details

### Requirement 10: Document Deletion

**User Story:** As a user, I want to delete documents, so that I can remove outdated or incorrect documents from the system.

#### Acceptance Criteria

1. WHEN a user deletes a document, THE Document_Wallet SHALL remove all versions from Blob_Storage
2. WHEN a user deletes a document, THE Document_Wallet SHALL remove metadata from Dataverse
3. WHEN deletion is requested, THE Document_Wallet SHALL validate user permissions first
4. WHEN deletion completes, THE Document_Wallet SHALL refresh the document list automatically
5. WHEN deletion fails, THE Document_Wallet SHALL display appropriate error messages to the user

### Requirement 11: Error Handling and Resilience

**User Story:** As a user, I want the system to handle errors gracefully, so that I receive clear feedback when issues occur.

#### Acceptance Criteria

1. WHEN the kf_documentversions table is missing, THE Document_Wallet SHALL handle the error gracefully without crashing
2. WHEN API calls fail, THE Document_Wallet SHALL display user-friendly error messages
3. WHEN network issues occur, THE Document_Wallet SHALL provide appropriate retry mechanisms
4. WHEN validation errors occur, THE Document_Wallet SHALL show specific field-level error messages
5. WHEN system errors occur, THE Document_Wallet SHALL log detailed information for debugging

### Requirement 12: Data Integration and Mapping

**User Story:** As a system integrator, I want seamless data flow between frontend and backend, so that data consistency is maintained across all layers.

#### Acceptance Criteria

1. WHEN mapping data from Dataverse, THE Document_Wallet SHALL convert Dataverse format to frontend DTOs
2. WHEN sending data to Dataverse, THE Document_Wallet SHALL convert frontend DTOs to Dataverse format
3. WHEN handling account relationships, THE Document_Wallet SHALL use the kf_Account@odata.bind format correctly
4. WHEN processing document metadata, THE Document_Wallet SHALL ensure bidirectional mapping consistency
5. WHEN data transformation occurs, THE Document_Wallet SHALL preserve all required fields and relationships

### Requirement 13: Performance and Caching

**User Story:** As a user, I want fast system performance, so that I can work efficiently with documents.

#### Acceptance Criteria

1. WHEN organization ID is requested multiple times, THE Document_Wallet SHALL use in-memory caching to avoid repeated API calls
2. WHEN React Query is used, THE Document_Wallet SHALL implement appropriate caching strategies for document data
3. WHEN mutations occur, THE Document_Wallet SHALL invalidate relevant queries to ensure data freshness
4. WHEN loading document lists, THE Document_Wallet SHALL implement efficient pagination if needed
5. WHEN auto-refresh is enabled, THE Document_Wallet SHALL balance freshness with performance

### Requirement 14: API Middleware and Routing

**User Story:** As a developer, I want well-structured API endpoints, so that the frontend can interact with backend services efficiently.

#### Acceptance Criteria

1. THE Document_Wallet SHALL provide GET /api/v1/documents endpoint with search and category filters
2. THE Document_Wallet SHALL provide GET /api/v1/documents/:id endpoint for single document retrieval
3. THE Document_Wallet SHALL provide GET /api/v1/documents/:id/versions endpoint for version history
4. THE Document_Wallet SHALL provide POST /api/v1/documents endpoint for document creation with multipart/form-data support
5. THE Document_Wallet SHALL provide POST /api/v1/documents/:id/versions endpoint for version creation
6. THE Document_Wallet SHALL provide GET /api/v1/documents/:id/versions/:versionId/download endpoint for secure downloads
7. THE Document_Wallet SHALL provide DELETE /api/v1/documents/:id endpoint for document deletion

### Requirement 15: File Storage and Blob Management

**User Story:** As a system administrator, I want secure and organized file storage, so that documents are stored reliably and can be retrieved efficiently.

#### Acceptance Criteria

1. WHEN storing files, THE Document_Wallet SHALL use the path structure org/{orgId}/documents/{documentId}/v{versionNumber}/{filename}
2. WHEN uploading files, THE Document_Wallet SHALL support multipart/form-data format
3. WHEN generating download URLs, THE Document_Wallet SHALL create time-limited SAS URLs
4. WHEN handling confidential documents, THE Document_Wallet SHALL use shorter SAS URL expiry times
5. WHEN managing blob storage, THE Document_Wallet SHALL ensure proper cleanup when documents are deleted