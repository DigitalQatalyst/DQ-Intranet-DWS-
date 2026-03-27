/**
 * MSAL Initialization Helper
 * Shared authentication initialization logic to avoid code duplication
 */

import { ReactNode } from "react";
import { msalInstance, defaultLoginRequest } from "./msal";

// Constants
export const REDIRECT_GUARD_KEY = 'msal_redirect_guard';
export const MAX_REDIRECT_ATTEMPTS = 2;

/**
 * Error UI Component
 */
export const renderErrorUI = (
  root: any,
  title: string,
  message: string,
  buttonText: string,
  onButtonClick: () => void,
  additionalContent?: ReactNode
) => {
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-4">{message}</p>
        {additionalContent}
        <button
          onClick={onButtonClick}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

/**
 * Initialize MSAL with error handling
 */
export const initializeMsal = async (): Promise<void> => {
  let initPromise: Promise<void>;
  try {
    initPromise = msalInstance.initialize();
  } catch (initError: any) {
    if (
      initError?.message?.includes("already been initialized") ||
      initError?.message?.includes("already initialized") ||
      initError?.code === "already_initialized"
    ) {
      console.log("MSAL already initialized, continuing...");
      initPromise = Promise.resolve();
    } else {
      // Check if MSAL is functional despite error
      try {
        msalInstance.getAllAccounts();
        console.log("MSAL appears functional despite init error, continuing...");
        initPromise = Promise.resolve();
      } catch {
        throw initError;
      }
    }
  }
  await initPromise;
};

/**
 * Get authenticated account from MSAL
 */
export const getAuthenticatedAccount = async () => {
  const result = await msalInstance.handleRedirectPromise();
  
  // Clear redirect guard on successful authentication
  if (result?.account) {
    sessionStorage.removeItem(REDIRECT_GUARD_KEY);
  }
  
  let authenticatedAccount: any = null;
  
  if (result?.account) {
    authenticatedAccount = result.account;
    msalInstance.setActiveAccount(result.account);
  } else {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      authenticatedAccount = accounts[0];
      msalInstance.setActiveAccount(accounts[0]);
    }
  }
  
  return { authenticatedAccount, result };
};

/**
 * Handle authentication redirect with retry logic
 */
export const handleAuthRedirect = (
  redirectAttempts: number,
  hasRedirectParams: boolean,
  onError: (error: any) => void
): { hasAccount: boolean; account: any } | void => {
  setTimeout(() => {
    const delayedAccounts = msalInstance.getAllAccounts();
    if (delayedAccounts.length > 0) {
      const account = delayedAccounts[0];
      msalInstance.setActiveAccount(account);
      return { hasAccount: true, account };
    }
    
    // Increment redirect attempt counter
    sessionStorage.setItem(REDIRECT_GUARD_KEY, String(redirectAttempts + 1));
    
    // Trigger login redirect
    msalInstance.loginRedirect({
      ...defaultLoginRequest
    }).catch((error) => {
      console.error("Login redirect failed:", error);
      sessionStorage.removeItem(REDIRECT_GUARD_KEY);
      onError(error);
    });
    
    return { hasAccount: false, account: null };
  }, hasRedirectParams ? 500 : 100);
};

/**
 * Check if user is new and should be redirected to onboarding
 */
export const shouldRedirectToOnboarding = (result: any): boolean => {
  try {
    const isSignupState =
      typeof result?.state === "string" &&
      result.state.includes("ej-signup");
    const claims = (result as any)?.idTokenClaims || {};
    const isNewUser =
      claims?.newUser === true || claims?.newUser === "true";
    return isSignupState || isNewUser;
  } catch (error) {
    console.warn("Error processing authentication state:", error);
    return false;
  }
};
