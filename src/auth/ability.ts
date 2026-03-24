import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';

// Define the possible actions and subjects for the ability system
export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type Subjects = 'Guide' | 'News' | 'Service' | 'Community' | 'User' | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

// User context interface for IAM
export interface UserContext {
  id: string;
  email: string;
  name: string;
  roles: string[];
  employeeSegment?: string;
  department?: string[];
  newJoiner: boolean;
}

// Role normalization function
export function normalizeRole(role: string): string {
  return role.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

// Build ability from user context
export function buildAbilityFromUserContext(userContext: UserContext | null): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (!userContext) {
    // No permissions for unauthenticated users
    return build();
  }

  // Basic permissions for all authenticated users
  can('read', 'Guide');
  can('read', 'News');
  can('read', 'Service');
  can('read', 'Community');

  // Role-based permissions
  const normalizedRoles = userContext.roles.map(normalizeRole);

  if (normalizedRoles.includes('system_admin')) {
    can('manage', 'all');
  }

  if (normalizedRoles.includes('content_publisher')) {
    can(['create', 'update', 'delete'], 'Guide');
    can(['create', 'update', 'delete'], 'News');
  }

  if (normalizedRoles.includes('service_owner')) {
    can(['create', 'update', 'delete'], 'Service');
  }

  if (normalizedRoles.includes('moderator')) {
    can(['update', 'delete'], 'Community');
  }

  return build();
}

// Default ability for unauthenticated users
export const defaultAbility = buildAbilityFromUserContext(null);