/**
 * Secure Logging Utility
 * Provides safe logging that filters sensitive information
 */

// Sensitive patterns to filter from logs
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /key/i,
  /secret/i,
  /auth/i,
  /bearer/i,
  /api[_-]?key/i,
  /access[_-]?token/i,
  /refresh[_-]?token/i,
  /session/i,
  /cookie/i,
  /credential/i
];

// Sensitive keys to redact from objects
const SENSITIVE_KEYS = [
  'password',
  'token',
  'key',
  'secret',
  'auth',
  'bearer',
  'apiKey',
  'accessToken',
  'refreshToken',
  'sessionId',
  'cookie',
  'credentials'
];

/**
 * Sanitizes data by removing or redacting sensitive information
 */
const sanitizeData = (data: any): any => {
  if (typeof data === 'string') {
    // Check if string contains sensitive patterns
    if (SENSITIVE_PATTERNS.some(pattern => pattern.test(data))) {
      return '[REDACTED]';
    }
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }
  
  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Check if key is sensitive
      if (SENSITIVE_KEYS.some(sensitiveKey => 
        key.toLowerCase().includes(sensitiveKey.toLowerCase())
      )) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeData(value);
      }
    }
    return sanitized;
  }
  
  return data;
};

/**
 * Secure logger that filters sensitive information
 */
export const secureLogger = {
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      const sanitizedArgs = args.map(sanitizeData);
      console.log(...sanitizedArgs);
    }
  },
  
  warn: (...args: any[]) => {
    const sanitizedArgs = args.map(sanitizeData);
    console.warn(...sanitizedArgs);
  },
  
  error: (...args: any[]) => {
    const sanitizedArgs = args.map(sanitizeData);
    console.error(...sanitizedArgs);
  },
  
  info: (...args: any[]) => {
    if (import.meta.env.DEV) {
      const sanitizedArgs = args.map(sanitizeData);
      console.info(...sanitizedArgs);
    }
  },
  
  debug: (...args: any[]) => {
    if (import.meta.env.DEV) {
      const sanitizedArgs = args.map(sanitizeData);
      console.debug(...sanitizedArgs);
    }
  }
};

// Export individual functions for easier migration
export const { log, warn, error, info, debug } = secureLogger;