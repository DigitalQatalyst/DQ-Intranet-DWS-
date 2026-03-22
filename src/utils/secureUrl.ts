/**
 * Secure URL Handling Utilities
 * Provides safe URL validation and opening functionality
 */

import { securityMonitor } from './securityMonitor';

// Allowed URL protocols for external links
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

// Dangerous domains to block (example list)
const BLOCKED_DOMAINS = [
  'javascript',
  'data',
  'vbscript',
  'file',
  'ftp'
];

/**
 * Validates if a URL is safe to open
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    
    // Check protocol
    if (!ALLOWED_PROTOCOLS.has(urlObj.protocol)) {
      return false;
    }
    
    // Check for blocked domains/schemes
    if (BLOCKED_DOMAINS.some(blocked => 
      urlObj.hostname.toLowerCase().includes(blocked) || 
      urlObj.protocol.includes(blocked)
    )) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Safely opens a URL in a new tab with security measures
 */
export const safeOpenUrl = (url: string, fallbackMessage?: string): void => {
  if (!isValidUrl(url)) {
    securityMonitor.logEvent('blocked_url', `Blocked unsafe URL: ${url}`);
    console.warn('Blocked attempt to open unsafe URL:', url);
    if (fallbackMessage) {
      // You can replace this with your toast notification system
      alert(fallbackMessage);
    }
    return;
  }
  
  try {
    // Open with security attributes
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    
    // Additional security: clear opener reference
    if (newWindow) {
      newWindow.opener = null;
    }
  } catch (error) {
    console.error('Failed to open URL:', error);
    if (fallbackMessage) {
      alert(fallbackMessage);
    }
  }
};

/**
 * Sanitizes a URL by removing dangerous parts
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    
    // Only allow safe protocols
    if (!ALLOWED_PROTOCOLS.has(urlObj.protocol)) {
      return '';
    }
    
    return urlObj.toString();
  } catch {
    return '';
  }
};