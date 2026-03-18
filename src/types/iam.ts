// IAM (Identity and Access Management) types

export interface UserContext {
  id: string;
  email: string;
  name: string;
  progressiveRole: UserRole;
  segment: EmployeeSegment;
  domain?: ContentDomain;
  responsibilityRoles?: ResponsibilityRole[];
}

export type UserRole = 
  | 'viewer'
  | 'employee'
  | 'service_owner'
  | 'content_publisher'
  | 'moderator'
  | 'directory_maintainer'
  | 'system_admin'
  | 'admin';

export type EmployeeSegment = 
  | 'employee'
  | 'associate'
  | 'lead'
  | 'manager'
  | 'director'
  | 'executive'
  | 'new_joiner'
  | 'platform_admin';

export type ContentDomain = 
  | 'guides'
  | 'news'
  | 'services'
  | 'communities'
  | 'learning';

export type ResponsibilityRole = 
  | 'team_lead'
  | 'project_manager'
  | 'department_head'
  | 'content_reviewer'
  | 'technical_lead'
  | 'service_owner'
  | 'content_publisher'
  | 'moderator'
  | 'community_moderator'
  | 'directory_maintainer'
  | 'system_admin';

// Helper functions for role checking
export function hasRole(userContext: UserContext | null, role: UserRole): boolean {
  return userContext?.progressiveRole === role;
}

export function hasResponsibilityRole(userContext: UserContext | null, role: ResponsibilityRole): boolean {
  return userContext?.responsibilityRoles?.includes(role) ?? false;
}

export function hasAnyRole(userContext: UserContext | null, roles: UserRole[]): boolean {
  return roles.some(role => hasRole(userContext, role));
}

export function hasAnyResponsibilityRole(userContext: UserContext | null, roles: ResponsibilityRole[]): boolean {
  return roles.some(role => hasResponsibilityRole(userContext, role));
}