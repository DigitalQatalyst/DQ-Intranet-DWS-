import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from '@/communities/integrations/supabase/client';
export type UserRole = 'admin' | 'moderator' | 'member';
export interface Permissions {
  canModeratePosts: boolean;
  canModerateUsers: boolean;
  canAssignModerators: boolean;
  canViewReports: boolean;
  canModerate: boolean; // Shorthand for canModeratePosts || canViewReports
  userRole: UserRole | null;
  loading: boolean;
}

// Cache for user roles to avoid excessive API calls
const roleCache = new Map<string, {
  roles: UserRole[];
  timestamp: number;
}>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function usePermissions(communityId?: string): Permissions {
  const {
    user
  } = useAuth();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<Omit<Permissions, 'loading'>>({
    canModeratePosts: false,
    canModerateUsers: false,
    canAssignModerators: false,
    canViewReports: false,
    canModerate: false,
    userRole: null
  });
  useEffect(() => {
    const checkPermissions = async () => {
      setLoading(true);
      if (!user) {
        setPermissions({
          canModeratePosts: false,
          canModerateUsers: false,
          canAssignModerators: false,
          canViewReports: false,
          canModerate: false,
          userRole: null
        });
        setLoading(false);
        return;
      }

      // Get user_id from users_local table (temporary workaround)
      const {
        data: localUser
      } = await supabase.from('users_local').select('id').eq('email', user.email).maybeSingle();
      if (!localUser) {
        setPermissions({
          canModeratePosts: false,
          canModerateUsers: false,
          canAssignModerators: false,
          canViewReports: false,
          canModerate: false,
          userRole: null
        });
        setLoading(false);
        return;
      }

      // Check cache first
      const cached = roleCache.get(localUser.id);
      const now = Date.now();
      let roles: UserRole[] = [];
      if (cached && now - cached.timestamp < CACHE_DURATION) {
        roles = cached.roles;
      } else {
        // Get user roles from user_roles table
        const {
          data: userRoles
        } = await supabase.from('user_roles').select('role').eq('user_id', localUser.id);
        roles = (userRoles || []).map(r => r.role as UserRole);

        // Cache the result
        if (roles.length > 0) {
          roleCache.set(localUser.id, {
            roles,
            timestamp: now
          });
        }
      }

      // Determine primary role (admin > moderator > member)
      const role: UserRole | null = roles.includes('admin') ? 'admin' : roles.includes('moderator') ? 'moderator' : roles.includes('member') ? 'member' : null;

      // Admin has all permissions
      if (role === 'admin') {
        setPermissions({
          canModeratePosts: true,
          canModerateUsers: true,
          canAssignModerators: true,
          canViewReports: true,
          canModerate: true,
          userRole: role
        });
        setLoading(false);
        return;
      }

      // Check if user is a moderator for specific community
      if (role === 'moderator' && communityId && localUser) {
        const {
          data: communityRole
        } = await supabase.from('community_roles').select('role').eq('user_id', localUser.id).eq('community_id', communityId).in('role', ['admin', 'moderator']).maybeSingle();
        if (communityRole) {
          setPermissions({
            canModeratePosts: true,
            canModerateUsers: false,
            canAssignModerators: communityRole.role === 'admin',
            canViewReports: true,
            canModerate: true,
            userRole: role
          });
          setLoading(false);
          return;
        }
      }

      // Default member permissions
      setPermissions({
        canModeratePosts: false,
        canModerateUsers: false,
        canAssignModerators: false,
        canViewReports: false,
        canModerate: false,
        userRole: role
      });
      setLoading(false);
    };
    checkPermissions();
  }, [user?.id, communityId]); // Only depend on user.id, not entire user object

  return {
    ...permissions,
    loading
  };
}