# ONBOARDING PROMPT — AUTHENTICATION MODULE (DWS INTERNAL USE ONLY)

## SUMMARY CONTEXT

### What it is
The Authentication Module for DWS (Digital Work Space) enables secure, internal-only access for all DQ employees. DWS is not a public platform; every authenticated user must be a verified internal DQ associate.

The module provides:
- Internal login & logout
- Session initialization & restoration
- Token validation & refresh
- Route protection for all DWS features
- User-type & role-based access control
- Enforced onboarding flows for New Joiners
- Prevention of external or anonymous access

### DWS USER TYPES (canonical internal segmentation)

The Authentication Module must support and expose these user types:

**New Joiner**
- Newly joined employee
- Requires onboarding flow and restricted initial access

**Existing Employee**
- Full regular employee access
- Cannot edit or publish content

**Power Users (additional responsibilities)**
- Service Owner
- Content Publisher
- Community Moderator
- Directory Maintainer

**System Administrator**
- Full platform oversight
- RBAC management
- Audit privileges

Users may have multiple roles at once. Roles must be enforced via both middleware and client-side helpers.

### Where it currently stands
- AuthContext exists in prototype form but lacks RBAC and onboarding logic
- Middleware route protection is incomplete
- No unified ProtectedLayout for authenticated sections
- Token-handling patterns are inconsistent
- Power-user/admin permissions are not enforced
- Mock authentication values may still exist and must be removed

### What needs to be achieved
Build a single, standardized authentication + RBAC framework for the full DWS platform. Ensure every DWS module is authenticated:
- Marketplace, Knowledge, Media, Directory, Work Center, Communities, Services
- Enforce onboarding for New Joiners
- Implement secure token-handling via a unified apiClient
- Enforce role-based restrictions for power users and system admins
- Remove all mock auth logic
- Provide clear acceptance criteria for development and QA

---

## SECTION 1 — EXISTING CODEBASE USAGE GUIDELINES

(DWS does not have a preexisting full auth module — these rules define how new auth logic must be integrated.)

1. Non-destructive integration
   - Add authentication without altering or restructuring the existing app architecture.

2. Centralized authentication logic
   - Authentication state must live in a single AuthContext with one source of truth.

3. Use a single ProtectedLayout
   - All authenticated pages must live inside a (protected) layout.
   - Avoid per-page or per-component auth checks.

4. Middleware as the authoritative gate
   - Middleware must validate the token, enforce RBAC, and block external access before rendering.

5. Follow DWS naming and coding conventions
   - Use the same folder, naming, and hook patterns already used in the project.

6. Extend existing apiClient
   - All token injection and refresh behavior must happen inside a single, existing API client pattern.

7. No mock auth
   - Remove all placeholder user values, test roles, or fake tokens.

8. Provider-agnostic
   - Abstract identity provider calls into a service layer so implementation can be swapped.

9. UI integration
   - Existing Navigation/Header components must reflect user roles and session state via hooks, not new UI shells.

10. Consistent RBAC across app
    - Only useAuthorization() may be used to check permissions client-side.
    - No inline role conditions scattered around UI.

---

## SECTION 2 — TARGET SYSTEM ARCHITECTURE

### 2.1 Frontend

**Tech stack:**
- Next.js (App Router)
- React + TypeScript
- Internal identity provider (e.g., Entra ID or Supabase Auth)
- Middleware for server-side route protection
- Context + hooks for session and roles

**Key patterns:**
- AuthContext + useAuth() for session state
- useAuthorization() for role and permission checks
- ProtectedLayout for gating authenticated modules
- apiClient for token-secured API calls

**Constraints:**
- Only internal DQ users may authenticate
- All pages except /login require authentication
- Power User and Admin routes require explicit RBAC
- New Joiners must trigger an onboarding redirect

### 2.2 Middleware (Authoritative Enforcement Layer)

**Responsibilities:**
- Validate identity token on every request
- Block unauthenticated users
- Enforce Power User + Admin-level RBAC
- Detect New Joiner status and redirect to onboarding
- Map token claims into request context

**Middleware outcomes:**
- No token → redirect /login
- Invalid token → clear session + redirect /login
- New Joiner → redirect /onboarding
- Role mismatch → HTTP 403 with "Not Authorized" page

### 2.3 Identity Claims Model

Token must include:
```json
{
  "sub": "<employee_id>",
  "email": "<dq_email>",
  "name": "<employee_name>",
  "roles": [
    "employee",
    "service_owner",
    "content_publisher",
    "moderator",
    "directory_maintainer",
    "system_admin"
  ],
  "new_joiner": true | false
}
```

**Requirements:**
- Multi-role users supported
- No external email domains accepted
- Claims must be validated on every request

---

## SECTION 3 — FRONTEND COMPONENT REQUIREMENTS

### 3.1 AuthContext

**Must provide:**
- user
- roles: string[]
- newJoiner: boolean
- Boolean helpers:
  - isEmployee
  - isServiceOwner
  - isContentPublisher
  - isModerator
  - isDirectoryMaintainer
  - isSystemAdmin
- loading
- login() / logout()

**Responsibilities:**
- Initialize session on app load
- Resolve token → user + roles
- Trigger silent refresh if supported
- Handle identity provider failures gracefully

### 3.2 ProtectedLayout

**Must:**
- Wrap all authenticated content
- Show loading UI while auth resolves
- Redirect newJoiner → /onboarding
- Redirect unauthenticated users → /login
- Prevent partial rendering until session is resolved

### 3.3 useAuthorization()

**Must provide:**
- hasRole(role: string): boolean
- hasAnyRole(roles: string[]): boolean
- isNewJoiner
- isEmployee
- isServiceOwner
- isContentPublisher
- isModerator
- isDirectoryMaintainer
- isSystemAdmin

**Used for:**
- Navigation visibility
- Admin dashboards
- Content publishing tools
- Community moderation controls
- Directory editing

### 3.4 apiClient

**Must:**
- Attach Bearer token to all requests
- Retry once on 401 → silent refresh
- On repeat failure → logout + redirect
- Return 403 for RBAC failures
- Never store tokens in localStorage or query params

### 3.5 Login

- Completes identity provider login
- Calls /api/auth/me to retrieve roles + newJoiner flag
- Redirects to /onboarding or home depending on status

### 3.6 Logout

- Calls /api/auth/logout
- Clears session
- Redirects /login

---

## SECTION 4 — REQUIRED MIDDLEWARE ROUTES

### Core
- GET /api/auth/me → user profile, roles, newJoiner
- POST /api/auth/logout → terminates session

### Authenticated Routes (all user types except unauthenticated)

Middleware must protect:
- /marketplace/**
- /services/**
- /communities/**
- /work/**
- /directory/**
- /knowledge/**
- /media/**

### Power-User & Admin Routes (RBAC Required)

| Path | Required Role |
|------|--------------|
| /services/manage/** | service_owner |
| /media/admin/** | content_publisher |
| /knowledge/manage/** | content_publisher |
| /communities/moderation/** | moderator |
| /directory/manage/** | directory_maintainer |
| /admin/** | system_admin |

**Note:**
- An Existing Employee never has edit rights unless explicitly assigned one of the Power User roles.

---

## SECTION 5 — MIDDLEWARE BUSINESS LOGIC

### Core Logic
1. Validate token & extract user context
2. Enforce internal-only email domain
3. Redirect New Joiners until onboarding completed
4. Apply RBAC on power-user routes
5. Return 401/403 appropriately

### Forbidden
- Anonymous access
- External identities
- Existing employees attempting admin or content-editing actions
- Publishing or editing by users without required role

---

## SECTION 6 — REQUIRED HOOKS

- useAuthQuery() → fetches /api/auth/me
- useLogin()
- useLogout()
- useAccessToken()
- useRequireAuth()
- useAuthorization() → for all role checks

---

## SECTION 7 — FILE STORAGE RULES

Auth module does not manage storage.

If profile avatars are added:
- org/dq/employees/{employeeId}/avatar/

---

## SECTION 8 — PERMISSIONS & RBAC MODEL (UPDATED)

### New Joiner
- Onboarding-only access until complete
- No editing privileges

### Existing Employee
- Read-only access to all published content
- Participate in communities
- Submit service requests
- Cannot edit content

### Service Owner
- Manage service catalogs
- Edit service definitions & documentation

### Content Publisher
- Create, edit, publish, unpublish Media & Knowledge content

### Community Moderator
- Approve/remove posts
- Manage events and polls

### Directory Maintainer
- Edit units, positions, associates
- Validate evidence

### System Administrator
- Highest-level control
- Manage roles, audits, settings

### Enforcement
- Server-side → authoritative
- Client-side → UI gating only
- Audit log for all content edits, moderation, or RBAC changes

---

## SECTION 9 — TESTING REQUIREMENTS

### Unit Tests
- AuthContext role decoding
- useAuthorization role checks
- New Joiner onboarding enforcement

### Integration Tests
- Power-user RBAC tests
- 401/403 enforcement
- apiClient token renewal behavior

### E2E Tests
- New Joiner onboarding flow
- Existing Employee read-only behavior
- Content Publisher edit-publish flows
- Moderator moderation flows
- System Admin role assignment flow

---

## SECTION 10 — EXECUTION RULES FOR CURSOR

1. Use existing architecture; do not refactor core structure
2. Extend existing AuthContext; do not recreate
3. Implement middleware before UI integration
4. Centralize RBAC in useAuthorization()
5. Replace all mock auth data
6. Enforce internal-only access
7. Follow this spec exactly
