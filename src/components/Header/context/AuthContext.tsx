import React, {
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { EventType, AuthenticationResult, InteractionStatus } from '@azure/msal-browser';
import { defaultLoginRequest, signupRequest } from '../../../services/auth/msal';
import { supabaseClient } from '../../../lib/supabaseClient';
import { azureIdToUuid } from '../../../communities/utils/azureIdToUuid';
import { buildAbilityFromUserContext, normalizeRole } from '@/auth/ability';
import { AbilityContext } from '@/auth/AbilityContext';
import type {
  UserContext as IamUserContext,
  UserRole,
  EmployeeSegment,
  ContentDomain,
  ResponsibilityRole,
} from '@/types/iam';
import type { AppAbility } from '@/auth/ability';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  userContext: IamUserContext | null;
  ability: AppAbility;
  isLoading: boolean;
  // Per spec: roles array and newJoiner boolean
  roles: string[];
  newJoiner: boolean;
  // Boolean helpers per spec
  isEmployee: boolean;
  isServiceOwner: boolean;
  isContentPublisher: boolean;
  isModerator: boolean;
  isDirectoryMaintainer: boolean;
  isSystemAdmin: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { instance, accounts } = useMsal();
  console.log('MSAL instance and accounts', instance, accounts)
  const isAuthenticated = useIsAuthenticated();

  const [isLoading, setIsLoading] = useState(true);
  const [emailOverride, setEmailOverride] = useState<string | undefined>(undefined);
  const [userContext, setUserContext] = useState<IamUserContext | null>(null);

  const viteEnv = (import.meta as any).env as Record<string, string | undefined>;
  const enableGraphFallback =
    (viteEnv?.VITE_MSAL_ENABLE_GRAPH_FALLBACK ||
      viteEnv?.NEXT_PUBLIC_MSAL_ENABLE_GRAPH_FALLBACK) === 'true';

  useEffect(() => {
    const active = instance.getActiveAccount();
    if (!active && accounts.length === 1) {
      instance.setActiveAccount(accounts[0]);
    }
  }, [instance, accounts]);

  const extractUserDataFromAccount = useCallback((account: any) => {
    if (!account) return null;

    const claims = account.idTokenClaims as any;
    const name = account.name || claims?.name || '';
    const email =
      claims?.emails?.[0] ||
      claims?.email ||
      claims?.preferred_username ||
      account.username ||
      '';
    const azureId = account.localAccountId || account.homeAccountId;

    return {
      name,
      email,
      azureId,
      givenName: claims?.given_name,
      familyName: claims?.family_name,
    };
  }, []);

  const fetchUserContext = useCallback(
    async (userId: string, email: string, name: string): Promise<IamUserContext | null> => {
      try {
        const { data: userData, error } = await supabaseClient
          .from('users_local')
          .select('id, email, dws_role, segment, domain, role')
          .eq('id', userId)
          .maybeSingle();

        if (error || !userData) {
          return {
            id: userId,
            email,
            name,
            progressiveRole: 'viewer',
            segment: 'employee',
            responsibilityRoles: [],
          };
        }

        const { data: responsibilityRolesData } = await supabaseClient
          .from('user_responsibility_roles')
          .select('role')
          .eq('user_id', userId);

        const roleString = (userData.dws_role as string) || (userData.role as string) || 'viewer';
        const progressiveRole = normalizeRole(roleString) as UserRole;
        const segment = (userData.segment as EmployeeSegment) || 'employee';
        const domain = userData.domain as ContentDomain | undefined;
        const responsibilityRoles = (responsibilityRolesData || []).map(
          (r: { role: string }) => r.role as ResponsibilityRole,
        );

        return {
          id: userData.id,
          email: userData.email,
          name,
          progressiveRole,
          segment,
          responsibilityRoles,
          domain,
        };
      } catch (error) {
        console.error('Error fetching user context:', error);
        return {
          id: userId,
          email,
          name,
          progressiveRole: 'viewer',
          segment: 'employee',
          responsibilityRoles: [],
        };
      }
    },
    [],
  );

  const syncUserQuietly = useCallback(
    async (account: any) => {
      const userData = extractUserDataFromAccount(account);
      if (!userData?.email || !userData?.azureId) return;

      const userId = azureIdToUuid(userData.azureId);
      const emailToSync = emailOverride || userData.email;
      const username = userData.name || emailToSync.split('@')[0];

      try {
        await supabaseClient.from('users_local').upsert(
          {
            id: userId,
            email: emailToSync,
            name: userData.name,
            username,
            azure_id: userData.azureId,
            password: 'AZURE_AD_AUTHENTICATED',
            role: 'member',
            segment: 'employee',
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'id',
          },
        );

        const context = await fetchUserContext(userId, emailToSync, userData.name);
        if (context) {
          setUserContext(context);
        }
      } catch (error) {
        console.error('Error syncing user to Supabase:', error);
      }
    },
    [extractUserDataFromAccount, emailOverride, fetchUserContext],
  );

  useEffect(() => {
    const callbackId = instance.addEventCallback(async event => {
      if (
        event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
        event.eventType === EventType.SSO_SILENT_SUCCESS
      ) {
        const payload = event.payload as AuthenticationResult | null;
        const account = payload?.account;
        if (account) {
          instance.setActiveAccount(account);
          
          // Per spec: After identity provider login, call /api/auth/me
          // to retrieve roles + newJoiner flag using authenticated API call
          try {
            // Get access token for authenticated API call
            const tokenResponse = await instance.acquireTokenSilent({
              scopes: ['openid', 'profile', 'email'],
              account,
            });

            if (tokenResponse?.accessToken) {
              // Call /api/auth/me with Bearer token
              const response = await fetch('/api/auth/me', {
                headers: {
                  'Authorization': `Bearer ${tokenResponse.accessToken}`,
                },
              });

              if (response.ok) {
                const meData = await response.json();
                console.log('✅ Fetched user context from /api/auth/me:', meData);
                // The userContext will be set by syncUserQuietly below
              } else {
                console.warn('⚠️ /api/auth/me failed, falling back to direct Supabase fetch');
              }
            }
          } catch (error) {
            console.error('Error calling /api/auth/me:', error);
            // Fall through to syncUserQuietly as fallback
          }
          
          // Sync user to Supabase (this also fetches userContext)
          void syncUserQuietly(account);
        }
      }
    });
    return () => {
      if (callbackId) instance.removeEventCallback(callbackId);
    };
  }, [instance, syncUserQuietly, extractUserDataFromAccount]);

  const user: UserProfile | null = useMemo(() => {
    const account = instance.getActiveAccount() || accounts[0];
    if (!account) return null;

    const userData = extractUserDataFromAccount(account);
    if (!userData) return null;

    return {
      id: account.localAccountId,
      name: userData.name,
      email: emailOverride || userData.email,
      givenName: userData.givenName,
      familyName: userData.familyName,
      picture: undefined,
    };
  }, [accounts, instance, emailOverride, extractUserDataFromAccount]);

  useEffect(() => {
    if (!user) {
      setUserContext(null);
      return;
    }

    const account = instance.getActiveAccount() || accounts[0];
    const azureId = account?.localAccountId || account?.homeAccountId || user.id;

    try {
      const userId = azureIdToUuid(azureId);
      fetchUserContext(userId, user.email, user.name)
        .then(setUserContext)
        .catch(error => {
          console.error('Error in fetchUserContext:', error);
          setUserContext({
            id: userId,
            email: user.email,
            name: user.name,
            progressiveRole: 'viewer',
            segment: 'employee',
            responsibilityRoles: [],
          });
        });
    } catch (error) {
      console.error('Error converting Azure ID to UUID:', error);
      setUserContext({
        id: user.id,
        email: user.email,
        name: user.name,
        progressiveRole: 'viewer',
        segment: 'employee',
        responsibilityRoles: [],
      });
    }
  }, [user, instance, accounts, fetchUserContext]);

  const ability = useMemo(() => {
    try {
      return buildAbilityFromUserContext(userContext);
    } catch (error) {
      console.error('Error building ability:', error);
      return buildAbilityFromUserContext(null);
    }
  }, [userContext]);

  // Loading is complete once we've checked auth state at least once
  useEffect(() => {
    // Always resolve loading state after checking accounts
    const account = instance.getActiveAccount() || accounts[0];
    setIsLoading(false);
  }, [isAuthenticated, accounts, instance]);

  // Fallback: ensure loading always resolves after a timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Max 3 seconds to determine auth state

    return () => clearTimeout(timeout);
  }, []);

  const looksSynthetic = useCallback((value?: string) => {
    if (!value) return true;
    const onMs = /@.*\.onmicrosoft\.com$/i.test(value);
    const guidLocal = /^[0-9a-f-]{36}@/i.test(value) || value.includes('#EXT#');
    return onMs || guidLocal;
  }, []);

  useEffect(() => {
    if (!enableGraphFallback) return;
    const account = instance.getActiveAccount() || accounts[0];
    if (!account) return;
    const claims = account.idTokenClaims as any;
    const current = (claims?.emails?.[0] ||
      claims?.email ||
      claims?.preferred_username ||
      account.username) as string | undefined;
    if (current && !looksSynthetic(current)) return;

    let cancelled = false;
    (async () => {
      try {
        const result = await instance.acquireTokenSilent({
          account,
          scopes: ['User.Read'],
        });
        const r = await fetch(
          'https://graph.microsoft.com/v1.0/me?$select=mail,userPrincipalName,otherMails',
          {
            headers: { Authorization: `Bearer ${result.accessToken}` },
          },
        );
        if (!r.ok) return;
        const me = await r.json();
        const resolved: string | undefined =
          me.mail || (me.otherMails && me.otherMails[0]) || me.userPrincipalName || current;
        if (!cancelled && resolved && !looksSynthetic(resolved)) {
          setEmailOverride(resolved);
        }
      } catch {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accounts, instance, enableGraphFallback, looksSynthetic]);

  const login = useCallback(() => {
    // Prevent multiple simultaneous login attempts
    if (inProgress !== InteractionStatus.None) {
      console.warn('⚠️ MSAL interaction already in progress. Skipping new login call.');
      return;
    }

    try {
      console.log('🔐 Initiating MSAL login redirect...', {
        authority: defaultLoginRequest.authority,
        scopes: defaultLoginRequest.scopes,
        clientId: instance.getConfiguration()?.auth?.clientId,
      });
      
      // loginRedirect immediately redirects the browser - no promise to await
      // This will cause a full page redirect to Microsoft login
      instance.loginRedirect(defaultLoginRequest);
      
      console.log('🔐 Login redirect called - page should redirect now');
    } catch (error) {
      console.error('❌ Login redirect failed:', error);
      // If redirect fails, try popup as fallback
      instance.loginPopup(defaultLoginRequest).catch((popupError) => {
        console.error('❌ Login popup also failed:', popupError);
        throw new Error(`Sign in failed: ${popupError instanceof Error ? popupError.message : 'Unknown error'}`);
      });
    }
  }, [instance, inProgress]);

  const signup = useCallback(() => {
    instance.loginRedirect({
      ...signupRequest,
      state: 'ej-signup',
    });
  }, [instance]);

  const logout = useCallback(async () => {
    // Per spec: Call /api/auth/logout before client-side logout
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      console.log('✅ Server-side logout successful');
    } catch (error) {
      console.error('Error calling /api/auth/logout:', error);
      // Continue with client-side logout even if server call fails
    }

    // Clear session and redirect
    // Per spec Section 3.6: Redirects /login (using /signin as app's login route)
    const account = instance.getActiveAccount() || accounts[0];
    instance.logoutRedirect({ 
      account,
      postLogoutRedirectUri: window.location.origin + '/signin', // /signin is the app's login route
    });
  }, [instance, accounts]);

  // Compute roles array and boolean helpers per spec
  const roles = useMemo(() => {
    if (!userContext) return [];
    const roleList: string[] = [userContext.progressiveRole];
    if (userContext.responsibilityRoles?.length) {
      roleList.push(...userContext.responsibilityRoles);
    }
    return roleList;
  }, [userContext]);

  const newJoiner = userContext?.segment === 'new_joiner';
  const roleSet = useMemo(() => new Set(roles.map(r => r.toLowerCase())), [roles]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      userContext,
      ability,
      isLoading,
      roles,
      newJoiner,
      isEmployee: userContext?.segment === 'employee' || userContext?.segment === undefined,
      isServiceOwner: roleSet.has('service_owner'),
      isContentPublisher: roleSet.has('content_publisher'),
      isModerator: roleSet.has('moderator') || roleSet.has('community_moderator'),
      isDirectoryMaintainer: roleSet.has('directory_maintainer'),
      isSystemAdmin: roleSet.has('system_admin') || userContext?.progressiveRole === 'admin' || userContext?.segment === 'platform_admin',
      login,
      signup,
      logout,
    }),
    [user, userContext, ability, isLoading, roles, newJoiner, roleSet, login, signup, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
