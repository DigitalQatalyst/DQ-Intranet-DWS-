# Security Improvements - Design Document

## Architecture Overview

### Security Layer Architecture
```
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│  (Components, Pages, Services)                          │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│              Security Utilities Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ secureLogger │  │  secureUrl   │  │ sanitizeHtml │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │securityMonitor│ │  secureEnv   │                   │
│  └──────────────┘  └──────────────┘                   │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│            Security Monitoring Layer                     │
│  (Event Tracking, Statistics, Reporting)                │
└─────────────────────────────────────────────────────────┘
```

## Component Design

### 1. Secure Logger (secureLogger.ts)

**Purpose:** Provide safe logging that filters sensitive information

**Interface:**
```typescript
interface SecureLogger {
  log(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  info(...args: any[]): void;
  debug(...args: any[]): void;
}
```

**Implementation Details:**
- Sensitive patterns: `/password|token|key|secret|auth|bearer/i`
- Sensitive keys: `['password', 'token', 'key', 'secret', 'auth', 'bearer', 'apiKey', 'accessToken', 'refreshToken', 'sessionId', 'cookie', 'credentials']`
- Recursive sanitization for nested objects and arrays
- Environment-aware logging (DEV only for log/info/debug)

**Usage Example:**
```typescript
import { error } from '../utils/secureLogger';

try {
  // Some operation
} catch (err) {
  error('Operation failed:', err); // Sensitive data automatically redacted
}
```

### 2. Secure URL Handler (secureUrl.ts)

**Purpose:** Validate and safely open URLs

**Interface:**
```typescript
function isValidUrl(url: string): boolean;
function safeOpenUrl(url: string, fallbackMessage?: string): void;
function sanitizeUrl(url: string): string;
```

**Security Rules:**
- Allowed protocols: `http:`, `https:`, `mailto:`, `tel:`
- Blocked domains: `javascript`, `data`, `vbscript`, `file`, `ftp`
- Always use `noopener,noreferrer` attributes
- Clear `window.opener` reference

**Flow Diagram:**
```
URL Request
    ↓
Validate Protocol → Block if dangerous → Log event
    ↓
Validate Domain → Block if dangerous → Log event
    ↓
Open with Security Attributes
    ↓
Clear opener reference
```

**Usage Example:**
```typescript
import { safeOpenUrl } from '../utils/secureUrl';

// Safe URL opening
safeOpenUrl(externalUrl, 'Unable to open link');
```

### 3. HTML Sanitizer (sanitizeHtml.ts)

**Purpose:** Remove dangerous HTML while preserving safe formatting

**Interface:**
```typescript
function sanitizeHtml(html: string): string;
function sanitizeAndValidateHtml(html: string): string;
function stripHtml(html: string): string;
```

**Sanitization Rules:**
- Remove: `<script>`, `<object>`, `<embed>`, `<form>`, `<input>`, `<textarea>`, `<select>`, `<button>`, `<iframe>`, `<frame>`, `<frameset>`
- Strip attributes: `onclick`, `onload`, `onerror`, etc.
- Remove protocols: `javascript:`, `data:`, `vbscript:`
- Preserve: `<p>`, `<br>`, `<strong>`, `<b>`, `<em>`, `<i>`, `<u>`, `<ul>`, `<ol>`, `<li>`, `<h1-h6>`, `<blockquote>`

**Processing Pipeline:**
```
Raw HTML Input
    ↓
Remove Script Tags
    ↓
Strip Event Handlers
    ↓
Remove Dangerous Protocols
    ↓
Remove Dangerous Tags
    ↓
Validate Allowed Tags
    ↓
Log if Modified
    ↓
Sanitized HTML Output
```

**Usage Example:**
```typescript
import { sanitizeAndValidateHtml } from '../utils/sanitizeHtml';

<div dangerouslySetInnerHTML={{ __html: sanitizeAndValidateHtml(content) }} />
```

### 4. Security Monitor (securityMonitor.ts)

**Purpose:** Track and report security events

**Interface:**
```typescript
interface SecurityEvent {
  type: 'blocked_url' | 'sanitized_html' | 'blocked_script' | 'suspicious_activity';
  details: string;
  timestamp: Date;
  userAgent?: string;
  url?: string;
}

class SecurityMonitor {
  logEvent(type: SecurityEvent['type'], details: string, additionalData?: Partial<SecurityEvent>): void;
  getRecentEvents(limit?: number): SecurityEvent[];
  getEventsByType(type: SecurityEvent['type']): SecurityEvent[];
  clearEvents(): void;
  getStats(): SecurityStats;
}
```

**Data Structure:**
```typescript
{
  events: SecurityEvent[],      // Last 100 events
  maxEvents: 100,                // Circular buffer size
  stats: {
    totalEvents: number,
    eventsByType: Record<string, number>,
    recentActivity: SecurityEvent[]
  }
}
```

**Event Flow:**
```
Security Event Occurs
    ↓
Log to Monitor
    ↓
Add to Events Array
    ↓
Trim to maxEvents
    ↓
Log to Console (DEV)
    ↓
Report to Service (PROD, if suspicious)
```

### 5. Security Dashboard (SecurityDashboard.tsx)

**Purpose:** Visualize security events for development/admin

**Component Structure:**
```typescript
interface SecurityDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

Components:
- Statistics Cards (Total Events, Events by Type)
- Recent Events List (Last 20 events)
- Event Details (Type, Timestamp, Details, URL)
- Actions (Clear Events, Export Report)
```

**UI Layout:**
```
┌─────────────────────────────────────────────┐
│  Security Dashboard                    [X]  │
├─────────────────────────────────────────────┤
│  Statistics                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │Total │ │Blocked│ │Sanit.│ │Susp. │      │
│  │  42  │ │  12  │ │  28  │ │  2   │      │
│  └──────┘ └──────┘ └──────┘ └──────┘      │
├─────────────────────────────────────────────┤
│  Recent Security Events                     │
│  ┌─────────────────────────────────────┐   │
│  │ ⚠️ Blocked URL                      │   │
│  │ Blocked unsafe URL: javascript:...  │   │
│  │ 10:23:45 AM                         │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ 🛡️ Sanitized HTML                   │   │
│  │ Removed 45 characters               │   │
│  │ 10:22:30 AM                         │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  [Clear Events]  [Export Report]            │
└─────────────────────────────────────────────┘
```

### 6. Coming Soon Cards (LeadApplySection.tsx)

**Purpose:** Indicate features that are not yet available

**Design Pattern:**
```typescript
interface LeadApplyCard {
  id: string;
  iconComponent: LucideIcon;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  comingSoon?: boolean;  // New property
}
```

**Visual Design:**
```
┌─────────────────────────────────┐
│  [Coming Soon Badge]            │
│                                 │
│      [Gray Icon]                │
│                                 │
│   AI Prompting Page             │
│   (Grayed out text)             │
│                                 │
│   Learn how AI prompting...     │
│   (Grayed out description)      │
│                                 │
│  [🔒 Coming Soon Button]        │
└─────────────────────────────────┘
```

**Styling States:**
- Normal: Full color, hover effects, clickable
- Coming Soon: 70% opacity, no hover, cursor-not-allowed
- Badge: Yellow background, clock icon, top-right position
- Button: Lock icon, gray background, disabled state

## Data Flow

### Security Event Flow
```
User Action
    ↓
Security Check (URL/HTML/Log)
    ↓
Validation Failed? → Log Event → Security Monitor
    ↓                              ↓
Block/Sanitize                Update Statistics
    ↓                              ↓
User Feedback                 Dashboard Update
```

### Logging Flow
```
Application Code
    ↓
secureLogger.error(data)
    ↓
Sanitize Data (recursive)
    ↓
Check Environment (DEV/PROD)
    ↓
console.error(sanitized)
```

### URL Opening Flow
```
User Clicks Link
    ↓
safeOpenUrl(url)
    ↓
isValidUrl(url)?
    ↓
Yes → window.open(url, '_blank', 'noopener,noreferrer')
    ↓
    Clear opener
No → Log Event
    ↓
    Show Error Message
```

## Integration Points

### 1. MarketplaceDetailsPage
- Replace `console.error` with `secureError`
- Replace `window.open` with `safeOpenUrl`
- Add `sanitizeAndValidateHtml` to dangerouslySetInnerHTML

### 2. GuideDetailPage
- Replace `window.open` with `safeOpenUrl`
- Maintain existing functionality

### 3. Mutations Service
- Replace `console.error` with `secureError`
- Protect API error logging

### 4. Home Page
- Add coming soon badges to locked cards
- Maintain Services & Marketplaces pattern

## Error Handling

### URL Validation Errors
```typescript
if (!isValidUrl(url)) {
  securityMonitor.logEvent('blocked_url', `Blocked unsafe URL: ${url}`);
  alert(fallbackMessage || 'Unable to open link');
  return;
}
```

### HTML Sanitization
```typescript
const sanitized = sanitizeHtml(html);
if (sanitized.length !== html.length) {
  securityMonitor.logEvent('sanitized_html', 
    `Removed ${html.length - sanitized.length} characters`);
}
```

### Logging Errors
```typescript
try {
  // Operation
} catch (error) {
  secureError('Operation failed:', error);
  // Sensitive data automatically redacted
}
```

## Testing Strategy

### Unit Tests
- Test sensitive data filtering
- Test URL validation rules
- Test HTML sanitization
- Test event tracking

### Integration Tests
- Test security utilities in components
- Test dashboard functionality
- Test coming soon card states

### Security Tests
- XSS attack prevention
- URL injection attempts
- Sensitive data exposure
- Event logging accuracy

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading**: Security dashboard loaded on demand
2. **Event Limiting**: Circular buffer (100 events max)
3. **Efficient Patterns**: Compiled regex patterns
4. **Minimal Overhead**: <5ms per security check

### Memory Management
- Events array limited to 100 items
- Old events automatically removed
- No memory leaks from event listeners

## Security Considerations

### Defense in Depth
1. **Input Validation**: URL and HTML validation
2. **Output Encoding**: HTML sanitization
3. **Logging Security**: Sensitive data filtering
4. **Monitoring**: Real-time event tracking

### Threat Mitigation
- **XSS**: HTML sanitization removes scripts
- **Phishing**: URL validation blocks malicious links
- **Data Exposure**: Logging filters sensitive information
- **Injection**: Protocol validation prevents code injection

## Deployment Strategy

### Gradual Rollout
1. ✅ Create security utilities
2. ✅ Apply to critical pages (Marketplace, Guides)
3. ✅ Add monitoring and dashboard
4. 🔄 Apply to remaining pages (ongoing)
5. 🔄 Monitor and refine (continuous)

### Rollback Plan
- All changes are non-breaking
- Can disable individual utilities
- Original functionality preserved
- Easy to revert if needed

## Documentation

### Developer Guide
- SECURITY.md: Comprehensive security guidelines
- Inline code comments
- Usage examples in each utility
- Type definitions for TypeScript

### Configuration Guide
- .env.example: Public template
- .env.local.example: Local development template
- Environment variable documentation
- Setup instructions

## Future Enhancements

### Phase 2 (Future)
- Content Security Policy (CSP) headers
- Rate limiting for API calls
- CSRF token implementation
- Input validation framework
- Automated security testing

### Phase 3 (Future)
- Integration with external monitoring services
- Advanced threat detection
- Security audit automation
- Compliance reporting