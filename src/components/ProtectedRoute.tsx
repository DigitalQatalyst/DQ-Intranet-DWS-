import {PropsWithChildren, useEffect, useState} from 'react';
import {useAuth} from './Header';
import { useMsal } from '@azure/msal-react';
import { defaultLoginRequest } from '../services/auth/msal';

/**
 * Guards routes behind MSAL auth. 
 * - Renders NOTHING until user is authenticated
 * - Immediately redirects to login if not authenticated
 * - No content, no loading states, no landing page - complete block until auth
 */
export const ProtectedRoute: React.FC<PropsWithChildren> = ({children}) => {
    const {user, isLoading} = useAuth();
    const { instance } = useMsal();
    const [hasTriggeredLogin, setHasTriggeredLogin] = useState(false);

    // Immediately trigger login if not authenticated - no content rendered
    useEffect(() => {
        if (!isLoading && !user && !hasTriggeredLogin) {
            setHasTriggeredLogin(true);
            // Immediately redirect to login - no content shown
            instance.loginRedirect({
                ...defaultLoginRequest
            }).catch((error) => {
                console.error("Login redirect failed:", error);
                setHasTriggeredLogin(false); // Allow retry
            });
        }
    }, [isLoading, user, hasTriggeredLogin, instance]);

    // While checking auth state or redirecting - render NOTHING (blank screen)
    if (isLoading || !user) {
        // Return null - completely blank, no content, no loading indicators
        return null;
    }

    // Only render content if user is authenticated
    return <>{children}</>;
};

export default ProtectedRoute;
