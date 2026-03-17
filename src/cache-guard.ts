/**
 * MSAL Cache Guard
 * 
 * This module MUST be imported first (before any MSAL imports) to ensure
 * corrupted cache is cleared before MSAL tries to process it.
 * 
 * The guard checks for:
 * 1. MSAL version changes (cache format incompatibility)
 * 2. JSON parse errors in cached data (corruption)
 * 3. Redirect params with cleared/missing cache (stale auth codes)
 */

const MSAL_CACHE_VERSION_KEY = 'msal_cache_version';
const CURRENT_MSAL_VERSION = '4.23.0'; // Should match @azure/msal-browser version in package.json
const CACHE_CLEARED_FLAG = 'msal_cache_just_cleared';

function clearMsalStorage(): void {
    console.log('[CacheGuard] Clearing all MSAL-related storage...');

    // Clear localStorage MSAL entries
    const localKeysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
            key.includes('msal') ||
            key.includes('login') ||
            key.includes('authority') ||
            key.includes('interaction.status') ||
            key.startsWith('{"authority"') // Some MSAL keys are JSON objects
        )) {
            localKeysToRemove.push(key);
        }
    }
    localKeysToRemove.forEach(key => {
        console.log('[CacheGuard] Removing localStorage key:', key);
        localStorage.removeItem(key);
    });

    // Clear sessionStorage MSAL entries
    const sessionKeysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (
            key.includes('msal') ||
            key.includes('login') ||
            key.includes('interaction') ||
            key.includes('request.origin')
        )) {
            sessionKeysToRemove.push(key);
        }
    }
    sessionKeysToRemove.forEach(key => {
        console.log('[CacheGuard] Removing sessionStorage key:', key);
        sessionStorage.removeItem(key);
    });
}

function checkForCorruption(): boolean {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('msal') || key.includes('login'))) {
            try {
                const value = localStorage.getItem(key);
                if (value && (value.startsWith('{') || value.startsWith('['))) {
                    JSON.parse(value);
                }
            } catch {
                console.warn('[CacheGuard] Detected corrupted cache entry:', key);
                return true;
            }
        }
    }
    return false;
}

export function runCacheGuard(): boolean {
    try {
        const storedVersion = localStorage.getItem(MSAL_CACHE_VERSION_KEY);
        const hasRedirectParams = window.location.search.includes('code=') ||
            window.location.search.includes('state=') ||
            window.location.hash.includes('code=');
        const wasCacheJustCleared = sessionStorage.getItem(CACHE_CLEARED_FLAG) === 'true';

        // If we just cleared cache and still have redirect params, clear the URL
        if (wasCacheJustCleared && hasRedirectParams) {
            console.log('[CacheGuard] Cache was just cleared, removing stale redirect params...');
            sessionStorage.removeItem(CACHE_CLEARED_FLAG);
            window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
            window.location.reload();
            return false; // Signal to stop execution
        }

        const hasCorruption = checkForCorruption();
        const versionMismatch = storedVersion !== CURRENT_MSAL_VERSION;

        if (versionMismatch || hasCorruption) {
            console.log('[CacheGuard] Cache issue detected:', { versionMismatch, hasCorruption, storedVersion, CURRENT_MSAL_VERSION });

            clearMsalStorage();
            localStorage.setItem(MSAL_CACHE_VERSION_KEY, CURRENT_MSAL_VERSION);

            // If we have redirect params, we need to clear them and reload
            // because MSAL can't process an auth code without matching cache state
            if (hasRedirectParams) {
                console.log('[CacheGuard] Clearing redirect params and reloading...');
                sessionStorage.setItem(CACHE_CLEARED_FLAG, 'true');
                window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
                window.location.reload();
                return false; // Signal to stop execution
            }
        }

        // Ensure version is set
        localStorage.setItem(MSAL_CACHE_VERSION_KEY, CURRENT_MSAL_VERSION);
        return true; // Continue with app initialization

    } catch (e) {
        console.error('[CacheGuard] Error during cache check:', e);
        return true; // Continue anyway, let MSAL handle errors
    }
}

// Auto-run on import
const shouldContinue = runCacheGuard();
if (!shouldContinue) {
    // Throw to prevent further module execution
    throw new Error('MSAL_CACHE_GUARD_RELOADING');
}
