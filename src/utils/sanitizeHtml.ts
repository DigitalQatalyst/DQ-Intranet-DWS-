/**
 * HTML Sanitization Utility
 * Provides safe HTML rendering by sanitizing potentially dangerous content
 */

import { securityMonitor } from './securityMonitor';

/**
 * Safely removes script tags using DOMParser (browser) or simple safe regex (SSR/Node)
 * Avoids ReDoS vulnerability (Sonar S5852) from complex regex backtracking
 * 
 * Browser: Uses DOMParser for robust HTML parsing
 * SSR/Node: Falls back to simple, non-backtracking regex patterns
 */
const removeScriptTags = (html: string): string => {
  // Check if we're in a browser environment with DOMParser available
  // eslint-disable-next-line no-restricted-globals
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      // Use DOMParser to safely parse and manipulate HTML (browser only)
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Remove all script elements
      const scripts = doc.querySelectorAll('script');
      scripts.forEach(script => script.remove());
      
      // Return cleaned HTML
      return doc.body.innerHTML;
    } catch {
      // Fall through to regex fallback if DOMParser fails
    }
  }
  
  // Fallback for SSR/Node or if DOMParser fails
  // Use simple, non-backtracking patterns to avoid ReDoS (Sonar S5852)
  // Pattern 1: Remove <script> tags with simple greedy match (no nested quantifiers)
  let result = html.replaceAll(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Pattern 2: Remove any remaining opening or closing script tags
  result = result.replaceAll(/<\/?script[^>]*>/gi, '');
  
  return result;
};

// Simple HTML sanitizer for basic formatting
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  const originalLength = html.length;
  
  // Remove script tags safely (fixes Sonar S5852 - ReDoS vulnerability)
  // Uses DOMParser in browser, safe regex patterns in SSR/Node
  let sanitized = removeScriptTags(html);
  
  // Remove dangerous attributes
  sanitized = sanitized.replaceAll(/\s*on\w+\s*=\s*["'][^"']*["']/gi, ''); // onclick, onload, etc.
  sanitized = sanitized.replaceAll(/\s*javascript\s*:/gi, ''); // javascript: URLs
  sanitized = sanitized.replaceAll(/\s*data\s*:/gi, ''); // data: URLs
  sanitized = sanitized.replaceAll(/\s*vbscript\s*:/gi, ''); // vbscript: URLs
  
  // Remove dangerous tags
  const dangerousTags = ['object', 'embed', 'form', 'input', 'textarea', 'select', 'button', 'iframe', 'frame', 'frameset'];
  dangerousTags.forEach(tag => {
    const regex = new RegExp(String.raw`<\/?${tag}\b[^>]*>`, 'gi');
    sanitized = sanitized.replaceAll(regex, '');
  });
  
  // Log if content was modified
  if (sanitized.length !== originalLength) {
    securityMonitor.logEvent('sanitized_html', `HTML content sanitized, removed ${originalLength - sanitized.length} characters`);
  }
  
  return sanitized;
};

// Allowed HTML tags for content rendering
const ALLOWED_TAGS = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote']);

export const sanitizeAndValidateHtml = (html: string): string => {
  if (!html) return '';
  
  let sanitized = sanitizeHtml(html);
  
  // Additional validation: only allow specific tags
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  sanitized = sanitized.replaceAll(tagRegex, (match, tagName) => {
    if (ALLOWED_TAGS.has(tagName.toLowerCase())) {
      return match;
    }
    return ''; // Remove disallowed tags
  });
  
  return sanitized;
};

// Safe text rendering - strips all HTML
export const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replaceAll(/<[^>]*>/g, '');
};