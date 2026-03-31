/**
 * Secure Environment Configuration
 * Provides safe access to environment variables with validation
 */

/**
 * Gets an environment variable with validation
 */
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  
  return value || defaultValue || '';
};

/**
 * Gets a required environment variable and throws if not found
 */
export const getRequiredEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  
  return value;
};

/**
 * Validates that all required environment variables are present
 */
export const validateEnvironment = (): boolean => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
};

/**
 * Safe environment configuration object
 */
export const env = {
  supabase: {
    url: getRequiredEnvVar('VITE_SUPABASE_URL'),
    anonKey: getRequiredEnvVar('VITE_SUPABASE_ANON_KEY')
  },
  mapbox: {
    token: getEnvVar('VITE_MAPBOX_TOKEN')
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
} as const;