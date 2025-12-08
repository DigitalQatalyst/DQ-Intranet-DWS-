import React, { useEffect, useMemo, useState, createContext, useContext, useCallback, ReactNode } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { EventType, AuthenticationResult } from '@azure/msal-browser';
import { defaultLoginRequest, signupRequest } from '../../../services/auth/msal';
import { supabaseClient } from '../../../lib/supabaseClient';
import { azureIdToUuid } from '../../../communities/utils/azureIdToUuid';

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
  isLoading: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(true);
  const [emailOverride, setEmailOverride] = useState<string | undefined>(undefined);
  const viteEnv = (import.meta as any).env as Record<string, string | undefined>;
  const enableGraphFallback = (viteEnv?.VITE_MSAL_ENABLE_GRAPH_FALLBACK || viteEnv?.NEXT_PUBLIC_MSAL_ENABLE_GRAPH_FALLBACK) === 'true';

  // Ensure active account is set for convenience
  useEffect(() => {
    const active = instance.getActiveAccount();
    if (!active && accounts.length === 1) {
      instance.setActiveAccount(accounts[0]);
    }
  }, [instance, accounts]);

  // Shared helper function to extract user data from Azure AD account
  // This ensures the same data extraction logic is used everywhere
  const extractUserDataFromAccount = useCallback((account: any) => {
    if (!account) return null;
    
    const claims = account.idTokenClaims as any;
    const name = account.name || claims?.name || '';
    // Prefer real email claims over UPN/preferred_username when available
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

  // Simple fire-and-forget sync - directly upsert user data from Azure profile
  const syncUserQuietly = useCallback(async (account: any) => {
    const userData = extractUserDataFromAccount(account);
    if (!userData?.email || !userData?.azureId) return;

    const userId = azureIdToUuid(userData.azureId);
    const emailToSync = emailOverride || userData.email;
    const username = userData.name || emailToSync.split('@')[0];

    // Direct upsert - no RPC function needed
    try {
      await supabaseClient
        .from('users_local')
        .upsert({
          id: userId,
          email: emailToSync,
          name: userData.name,
          username: username,
          azure_id: userData.azureId,
          password: 'AZURE_AD_AUTHENTICATED',
          role: 'member',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });
    } catch (error) {
      // Silent fail - sync will retry on next login
    }
  }, [extractUserDataFromAccount, emailOverride]);

  // Ensure active account is set on successful login/redirect events
  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (
        event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
        event.eventType === EventType.SSO_SILENT_SUCCESS
      ) {
        const payload = event.payload as AuthenticationResult | null;
        const account = payload?.account;
        if (account) {
          instance.setActiveAccount(account);
          syncUserQuietly(account); // Fire and forget
        }
      }
    });
    return () => {
      if (callbackId) instance.removeEventCallback(callbackId);
    };
  }, [instance, syncUserQuietly]);

  const user: UserProfile | null = useMemo(() => {
    const account = instance.getActiveAccount() || accounts[0];
    if (!account) return null;
    
    // Use shared extraction function to ensure consistency with sync
    const userData = extractUserDataFromAccount(account);
    if (!userData) return null;
    
    return {
      id: account.localAccountId,
      name: userData.name,
      email: emailOverride || userData.email, // Use emailOverride if Graph API resolved a better email
      givenName: userData.givenName,
      familyName: userData.familyName,
      picture: undefined
    };
  }, [accounts, instance, emailOverride, extractUserDataFromAccount]);

  useEffect(() => {
    // Loading is complete once we have determined authentication state at least once
    // Check if we have an account to determine if user is authenticated
    const account = instance.getActiveAccount() || accounts[0];
    const hasAccount = !!account;
    
    // Only set loading to false after we've checked for accounts
    if (accounts.length > 0 || !hasAccount) {
      setIsLoading(false);
    }
  }, [isAuthenticated, accounts, instance]);

  // Heuristic to detect synthetic/UPN-like emails we want to improve
  const looksSynthetic = useCallback((value?: string) => {
    if (!value) return true;
    const onMs = /@.*\.onmicrosoft\.com$/i.test(value);
    const guidLocal = /^[0-9a-f-]{36}@/i.test(value) || value.includes('#EXT#');
    return onMs || guidLocal;
  }, []);

  // Optional: resolve better email via Microsoft Graph if configured and necessary
  useEffect(() => {
    if (!enableGraphFallback) return;
    const account = instance.getActiveAccount() || accounts[0];
    if (!account) return;
    const claims = account.idTokenClaims as any;
    const current = (claims?.emails?.[0] || claims?.email || claims?.preferred_username || account.username) as string | undefined;
    if (current && !looksSynthetic(current)) return;

    let cancelled = false;
    (async () => {
      try {
        const result = await instance.acquireTokenSilent({
          account,
          scopes: ['User.Read']
        });
        const r = await fetch('https://graph.microsoft.com/v1.0/me?$select=mail,userPrincipalName,otherMails', {
          headers: { Authorization: `Bearer ${result.accessToken}` }
        });
        if (!r.ok) return;
        const me = await r.json();
        const resolved: string | undefined = me.mail || (me.otherMails && me.otherMails[0]) || me.userPrincipalName || current;
        if (!cancelled && resolved && !looksSynthetic(resolved)) {
          setEmailOverride(resolved);
        }
      } catch (e) {
        // ignore failures silently; fallback remains
      }
    })();
    return () => { cancelled = true; };
  }, [accounts, instance, enableGraphFallback, looksSynthetic]);

  const login = useCallback(() => {
    instance.loginRedirect({
      ...defaultLoginRequest
    });
  }, [instance]);

  // For Entra ID, signup is the same as login (no separate policies like B2C)
  const signup = useCallback(() => {
    instance.loginRedirect({
      ...signupRequest,
      // Tag this flow so we can route to onboarding after redirect
      state: 'ej-signup'
    });
  }, [instance]);

  const logout = useCallback(() => {
    const account = instance.getActiveAccount() || accounts[0];
    instance.logoutRedirect({ account: account });
  }, [instance, accounts]);

  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    isLoading,
    login,
    signup,
    logout
  }), [user, isLoading, login, signup, logout]);

  return <AuthContext.Provider value={contextValue}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
