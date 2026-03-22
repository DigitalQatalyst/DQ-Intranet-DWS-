/**
 * Security Monitoring Utility
 * Monitors and reports security-related events
 */

interface SecurityEvent {
  type: 'blocked_url' | 'sanitized_html' | 'blocked_script' | 'suspicious_activity';
  details: string;
  timestamp: Date;
  userAgent?: string;
  url?: string;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 100; // Keep last 100 events

  /**
   * Log a security event
   */
  logEvent(type: SecurityEvent['type'], details: string, additionalData?: Partial<SecurityEvent>) {
    const event: SecurityEvent = {
      type,
      details,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: globalThis.location.href,
      ...additionalData
    };

    this.events.push(event);
    
    // Keep only the last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn('[Security Monitor]', event);
    }

    // In production, you might want to send this to a monitoring service
    if (import.meta.env.PROD && type === 'suspicious_activity') {
      this.reportToMonitoringService(event);
    }
  }

  /**
   * Get recent security events
   */
  getRecentEvents(limit = 10): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  /**
   * Get events by type
   */
  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  /**
   * Clear all events
   */
  clearEvents() {
    this.events = [];
  }

  /**
   * Report to monitoring service (placeholder)
   */
  private reportToMonitoringService(event: SecurityEvent) {
    // In a real implementation, you would send this to your monitoring service
    // For example: Sentry, LogRocket, DataDog, etc.
    console.error('[Security Alert]', event);
  }

  /**
   * Get security statistics
   */
  getStats() {
    const stats = {
      totalEvents: this.events.length,
      eventsByType: {} as Record<string, number>,
      recentActivity: this.events.slice(-5)
    };

    this.events.forEach(event => {
      stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
    });

    return stats;
  }
}

// Export singleton instance
export const securityMonitor = new SecurityMonitor();

// Export types for external use
export type { SecurityEvent };