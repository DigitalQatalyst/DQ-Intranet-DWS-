# IAM Authorization Feature Specification – DWS (Digital Work Space)

## 1. Overview

This specification defines feature-level authorization requirements for DWS (Digital Work Space), the internal employee platform used exclusively within DQ.

It translates the platform-wide IAM Authentication Specification and IAM Authorization Design Specification (DWS) into concrete authorization rules for employee-facing capabilities such as onboarding, internal services, knowledge, collaboration, work tracking, directory access, and platform settings.

Authorization is enforced consistently across:

- Front-end (DWS UI) using CASL for UI gating and action checks
- Middleware / API layer enforcing authoritative permission checks
- Internal DWS data services enforcing write, state, and lifecycle rules

All rules in this document assume the platform-wide IAM model defined in:

- IAM_Authentication_Module_Spec_v1
- IAM_Authorization_Design_Spec_v1 (DWS)

---

## 2. Scope

### Applies only to

Authenticated internal DQ employees accessing DWS.

### Covers authorization for

- Workspace access & onboarding lifecycle
- Internal service interaction
- Internal knowledge & content
- Collaboration & engagement
- Work & activity tracking
- Organizational directory
- Employee settings & platform administration

### Does not cover

- External platforms or client systems
- Partner or advisor tools
- Infrastructure-level IAM
- Non-DQ identities

---

## 3. Role & Claim Model – DWS

### 3.1 Segments & Eligibility

All users of DWS are internal identities authenticated via the DQ identity provider.

Required claims:

- segment = new_joiner | employee | power_user | system_admin
- roles = responsibility roles (see below)
- user_id = internal employee identifier

Users missing required claims must not receive access beyond an access-denied page.

### 3.2 DWS Responsibility Roles

Roles represent responsibilities, not employment status.

| Role Key | Description |
|----------|-------------|
| viewer | Default read-only access |
| content_publisher | Creates and manages internal content |
| service_owner | Manages internal service definitions |
| community_moderator | Moderates discussions and engagement |
| directory_maintainer | Maintains organizational directory data |
| system_admin | Full platform and IAM control |

**Important rule:**
Being an existing employee does not grant edit permissions.
Write access is granted only via responsibility roles.

### 3.3 Canonical Actions & Subjects

**Actions**
- read, create, update, delete, publish, approve, moderate, archive, manage

**Subjects**
- Workspace
- Service
- Content
- Community
- Directory
- Activity
- Notification
- User

### 3.4 Scoping Model

- Single organization (DQ only)
- No tenant or organization filters
- Authorization depends on employee lifecycle + roles

---

## 4. Feature-Level Authorization Rules

### 4.1 Workspace Access & Onboarding

#### 4.1.1 Feature Description

Controls access to DWS capabilities based on employee onboarding status.

#### 4.1.2 Access Rules

| # | Item | Detail |
|---|------|--------|
| 1 | App access pre-onboarding | Authenticated users can access onboarding only |
| 2 | Onboarding visibility | All users can read onboarding steps |
| 3 | Completing onboarding | Users can complete assigned steps |
| 4 | Override | Only system_admin can bypass onboarding |
| 5 | Post-onboarding | Other modules unlocked only after completion |

#### 4.1.3 Behavioral Rules

| Item | Detail |
|------|--------|
| Enforcement | Middleware redirects new_joiner users |
| No bypass | No feature bypasses onboarding gates |

---

### 4.2 Internal Service Interaction

#### 4.2.1 Feature Description

Covers viewing and managing internal service definitions and workflows.

#### 4.2.2 Required Permissions per Action

| Action | Service Owner | Employee | Viewer |
|--------|---------------|----------|--------|
| View services | ✅ read:Service | ✅ | ✅ |
| Create service | ✅ create:Service | ❌ | ❌ |
| Edit service | ✅ update:Service | ❌ | ❌ |
| Approve service | ✅ approve:Service | ❌ | ❌ |
| Archive service | ❌ (admin only) | ❌ | ❌ |

#### 4.2.3 Behavioral Rules

| Item | Detail |
|------|--------|
| Default | Employees are read-only |
| Ownership | Only owners/admins modify services |
| Audit | All changes logged |

---

### 4.3 Internal Knowledge & Content

#### 4.3.1 Feature Description

Controls internal documentation, guidance, announcements, and learning content.

#### 4.3.2 Required Permissions per Action

| Action | Publisher | Employee | Viewer |
|--------|-----------|----------|--------|
| View published content | ✅ | ✅ | ✅ |
| Create content | ✅ create:Content | ❌ | ❌ |
| Edit content | ✅ update:Content | ❌ | ❌ |
| Publish / unpublish | ✅ publish:Content | ❌ | ❌ |
| Archive content | ❌ (admin only) | ❌ | ❌ |

#### 4.3.3 Behavioral Rules

| Item | Detail |
|------|--------|
| Read-only default | Employees cannot edit |
| Draft isolation | Drafts visible only to publishers/admins |
| Audit | Publish & archive actions logged |

---

### 4.4 Collaboration & Engagement

#### 4.4.1 Feature Description

Supports discussions, events, and feedback mechanisms.

#### 4.4.2 Required Permissions per Action

| Action | Moderator | Employee | Viewer |
|--------|-----------|----------|--------|
| View items | ✅ | ✅ | ✅ |
| Create posts / respond | ❌ | ✅ | ❌ |
| Moderate / remove | ✅ moderate:Community | ❌ | ❌ |

#### 4.4.3 Behavioral Rules

| Item | Detail |
|------|--------|
| Moderation | Moderators approve/remove content |
| Logging | Moderation actions audited |

---

### 4.5 Work & Activity Tracking

#### 4.5.1 Feature Description

Tracks employee tasks, sessions, and work records.

#### 4.5.2 Required Permissions per Action

| Action | Employee | Viewer |
|--------|----------|--------|
| View activities | ✅ read:Activity | ✅ |
| Update own items | ✅ update:Activity | ❌ |

#### 4.5.3 Behavioral Rules

| Item | Detail |
|------|--------|
| Ownership | Users update only assigned items |

---

### 4.6 Organizational Directory

#### 4.6.1 Feature Description

Provides visibility into people, roles, and organizational structure.

#### 4.6.2 Required Permissions per Action

| Action | Maintainer | Employee | Viewer |
|--------|------------|----------|--------|
| View directory | ✅ | ✅ | ✅ |
| Edit directory | ✅ update:Directory | ❌ | ❌ |

#### 4.6.3 Behavioral Rules

| Item | Detail |
|------|--------|
| Restricted edits | Only maintainers/admins |
| Audit | All edits logged |

---

### 4.7 Settings & Administration

#### 4.7.1 Feature Description

Covers personal settings and platform administration.

#### 4.7.2 Required Permissions per Action

| Action | System Admin | Employee |
|--------|--------------|----------|
| View personal settings | ❌ | ✅ |
| Update personal settings | ❌ | ✅ |
| Manage platform config | ✅ manage:Workspace | ❌ |
| Assign roles | ✅ manage:User | ❌ |

#### 4.7.3 Behavioral Rules

| Item | Detail |
|------|--------|
| Separation | Employees cannot alter IAM or platform config |

---

## 5. Front-End Authorization Patterns

### 5.1 Ability Construction

**Input:**
- segment
- assigned roles
- onboarding status

**Output:**
- CASL AppAbility instance

### 5.2 UI Gating Patterns

| Item | Detail |
|------|--------|
| Navigation | Render only if can('read') |
| Actions | Wrapped in <Can> |
| Read-only | Forms disabled where update not allowed |

---

## 6. API & Middleware Enforcement

### 6.1 General Rules

| Item | Detail |
|------|--------|
| Claim validation | Invalid → 401/403 |
| Server enforcement | Ability rebuilt server-side |
| Audit | Critical actions logged |

---

## 7. Testing & Acceptance Criteria

### 7.1 Role Matrix Tests

Verify each role × action combination
Confirm existing employees cannot edit content

### 7.2 Lifecycle Tests

New joiner gating
Role updates reflected on refresh

### 7.3 Acceptance

This specification is met when:

- Unauthorized writes are impossible
- UI and API rules are aligned
- Onboarding and role gates function correctly

