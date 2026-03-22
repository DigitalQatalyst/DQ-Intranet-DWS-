# IAM Authorization Design Specification v1 — DWS

## Overview

This specification defines the complete Role-Based Access Control (RBAC) architecture for DWS (Digital Work Space).
DWS is an internal-only platform used and managed exclusively by DQ employees.

The system uses CASL (Isomorphic Authorization Library) to provide type-safe, declarative authorization rules based on employee segments and functional roles.

DWS authorization ensures:

- Secure internal access
- Clear separation between consumption, contribution, approval, and administration
- No implicit permissions based on employment alone
- Domain-scoped editing instead of platform-wide privileges

---

## Key Design Principles

1. Progressive Role Hierarchy: Each role includes all permissions from lower roles
2. Employee Segmentation: Authorization is based on employee responsibility, not job title
3. Domain-Scoped Editing: Edit rights are limited to owned domains (HR, Services, Ops)
4. Internal-Only Access: No external users, organizations, or tenants
5. Database-Driven Authorization: All authorization context comes from internal identity data
6. Type-Safe Permissions: CASL provides compile-time checking for actions and subjects

---

## Design Philosophy

### Progressive Role Hierarchy

Roles are progressive and additive:

```
Viewer (base)
  ↓
Contributor = Viewer + Create + Update
  ↓
Approver = Contributor + Approve
  ↓
Admin = Approver + Publish + Archive + Delete + Manage
```

**Benefits:**
- Intuitive permission growth
- Clear separation of responsibility
- Prevents accidental over-permissioning
- Easy onboarding and role assignment

### Organization Scoping

DWS operates within a single internal organization (DQ).

- No multi-tenant or external organization scoping
- All users inherently belong to DQ
- Isolation is enforced by domain and responsibility, not organization

---

## Segment-Based Access Control

Segments define who the employee is, while roles define what they can do.

### Employee Segments

| Segment | Description | Scope | Special Rules |
|---------|-------------|-------|---------------|
| employee | Default DQ employees | Global read | Read-only by default |
| new_joiner | Employees in onboarding | Gated | Restricted until onboarding completion |
| lead | Team / practice leads | Review scope | Approval & moderation only |
| hr | People & culture team | HR domain | Can publish HR content only |
| tech_support | Ops & internal IT | Services domain | Edit operational content |
| platform_admin | DWS owners | Full | IAM & system control |

---

## User Segments

### Employee (Default)

**Characteristics:**
- All active DQ employees post-onboarding
- Primary consumers of DWS

**Permission Scope:**
- Read all internal content
- Participate in discussions
- No edit, publish, approve, or admin rights

### New Joiner

**Characteristics:**
- Employees in onboarding lifecycle
- Temporary state

**Permission Scope:**
- Access onboarding resources only
- Restricted navigation
- No creation or approval actions

### Lead

**Characteristics:**
- Team, practice, or delivery leads
- Oversight responsibility

**Permission Scope:**
- Read all content
- Approve workflows and submissions
- Moderate discussions
- Cannot publish or manage IAM

### HR

**Characteristics:**
- People & culture team

**Permission Scope:**
- Create, edit, publish HR-related content
- Maintain people and policy records
- No access to technical or platform admin areas

### Tech Support

**Characteristics:**
- Internal IT, operations, and support teams

**Permission Scope:**
- Create and manage service-related content
- Maintain operational workflows
- No access to HR or IAM configuration

### Platform Admin

**Characteristics:**
- Small trusted group
- Platform owners

**Permission Scope:**
- Full system access
- IAM, RBAC, configuration, audits
- Override and emergency control

---

## Roles

### Admin

**Progressive Permissions:**
- All Approver permissions
- Plus: publish, archive, delete, manage

```typescript
can('manage', 'all');
```

**Use Cases:**
- DWS system owners
- Security and platform administrators

### Approver

**Progressive Permissions:**
- All Contributor permissions
- Plus: approve

```typescript
can('approve', ['Content', 'Workflow']);
```

**Use Cases:**
- Leads
- Review authorities

### Contributor

**Progressive Permissions:**
- All Viewer permissions
- Plus: create, update (domain-scoped)

```typescript
can('create', ['Content']);
can('update', ['Content'], { domain });
```

**Use Cases:**
- HR contributors
- Tech support operators

### Viewer

**Base Permissions:**
- Read only

```typescript
can('read', 'all');
```

**Use Cases:**
- Majority of employees

### Role Normalization

```typescript
function normalizeRole(role: string): UserRole {
  const roleMap: Record<string, UserRole> = {
    admin: 'admin',
    approver: 'approver',
    contributor: 'contributor',
    editor: 'contributor',
    viewer: 'viewer'
  };
  return roleMap[role.toLowerCase()] || 'viewer';
}
```

---

## CASL Ability System

### Action Vocabulary

| Action | Description |
|--------|-------------|
| manage | Full administrative control |
| create | Create new records |
| read | View content |
| update | Modify content |
| delete | Permanent removal |
| approve | Workflow approval |
| publish | Make content live |
| archive | Soft removal |
| flag | Mark for review |

### Subject Types (DWS)

| Subject | Description |
|---------|-------------|
| Content | Knowledge, guidelines, media |
| Service | Internal services & requests |
| Community | Discussions & events |
| Directory | People & roles |
| Workflow | Approval processes |
| User | Employee profiles |
| System | Platform configuration |
| all | Wildcard |

### Ability Builder Function

```typescript
export function buildAbility(user: UserContext): AppAbility {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  const { role, segment, domain } = user;
  if (!segment) {
    cannot('manage', 'all');
    return build();
  }
  switch (role) {
    case 'admin':
      can('manage', 'all');
      break;
    case 'approver':
      can('read', 'all');
      can('approve', ['Content', 'Workflow']);
      break;
    case 'contributor':
      can('read', 'all');
      can('create', 'Content', { domain });
      can('update', 'Content', { domain });
      break;
    case 'viewer':
      can('read', 'all');
      break;
  }
  return build();
}
```

---

## Permission Rules (Key Constraints)

1. Not every employee can edit
2. Leads are not admins
3. HR and Tech Support are domain-scoped
4. Publishing is explicit
5. Only Platform Admins manage IAM
6. New Joiners are lifecycle-restricted

---

## Security Considerations

1. UI checks are UX-only
2. API enforcement is mandatory
3. No trust in client permissions
4. Defense-in-depth (UI + API + data)

---

## References

- src/auth/ability.ts
- src/context/AuthContext.tsx
- src/shared/permissions.ts
- docs/iam/DWS_IAM_GUIDE.md

