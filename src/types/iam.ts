// IAM (Identity and Access Management) types

export interface UserContext {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  employeeSegment?: EmployeeSegment;
  department?: string[];
  contentDomains?: ContentDomain[];
  responsibilityRoles?: ResponsibilityRole[];
  newJoiner: boolean;
}

export type UserRole = 
  | 'employee'
  | 'service_owner'
  | 'content_publisher'
  | 'moderator'
  | 'directory_maintainer'
  | 'system_admin';

export type EmployeeSegment = 
  | 'associate'
  | 'lead'
  | 'manager'
  | 'director'
  | 'executive';

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
  | 'technical_lead';

// Helper functions for role checking
export function hasRole(userContext: UserContext | null, role: UserRole): boolean {
  return userContext?.roles.includes(role) ?? false;
}

export function hasAnyRole(userContext: UserContext | null, roles: UserRole[]): boolean {
  return roles.some(role => hasRole(userContext, role));
}

export function isInDepartment(userContext: UserContext | null, department: string): boolean {
  return userContext?.department?.includes(department) ?? false;
}