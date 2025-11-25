/**
 * Microsoft Graph API helper for Teams Calendar Events
 * Handles creating calendar events in user's Teams Calendar
 */

interface CalendarEvent {
  subject: string;
  body: {
    contentType: string;
    content: string;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName: string;
  };
  isOnlineMeeting?: boolean;
  onlineMeetingProvider?: string;
  onlineMeeting?: {
    provider: string;
  };
}

interface CreateCalendarEventParams {
  title: string;
  description: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  location?: string;
  meetingLink?: string;
  isVirtual?: boolean;
}

/**
 * Gets access token for Microsoft Graph API
 * This assumes you have a way to get the token (e.g., from auth context or API)
 */
async function getAccessToken(): Promise<string> {
  // TODO: Implement token retrieval based on your auth setup
  // This could be:
  // 1. From MSAL (Microsoft Authentication Library)
  // 2. From your backend API that exchanges tokens
  // 3. From a stored token in localStorage/sessionStorage
  
  // For now, this is a placeholder that should be replaced with actual token retrieval
  const token = localStorage.getItem('ms_graph_access_token');
  
  if (!token) {
    throw new Error('Microsoft Graph access token not found. Please sign in with Microsoft.');
  }
  
  return token;
}

/**
 * Creates a calendar event in the user's Teams Calendar using Microsoft Graph API
 * @param params Event details from events_v2 table
 * @returns Created event data
 */
export async function createTeamsCalendarEvent(
  params: CreateCalendarEventParams
): Promise<any> {
  try {
    const accessToken = await getAccessToken();
    
    // Convert ISO strings to Date objects for timezone handling
    const startDate = new Date(params.startTime);
    const endDate = new Date(params.endTime);
    
    // Format dates in ISO 8601 format with timezone
    const startDateTime = startDate.toISOString();
    const endDateTime = endDate.toISOString();
    
    // Determine timezone (use user's timezone or default to UTC)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    
    // Build the calendar event object
    const calendarEvent: CalendarEvent = {
      subject: params.title,
      body: {
        contentType: 'HTML',
        content: params.description || ''
      },
      start: {
        dateTime: startDateTime,
        timeZone: timeZone
      },
      end: {
        dateTime: endDateTime,
        timeZone: timeZone
      }
    };
    
    // Add location if provided
    if (params.location) {
      calendarEvent.location = {
        displayName: params.location
      };
    }
    
    // Add online meeting if virtual or meeting link provided
    if (params.isVirtual || params.meetingLink) {
      calendarEvent.isOnlineMeeting = true;
      calendarEvent.onlineMeetingProvider = 'teamsForBusiness';
      calendarEvent.onlineMeeting = {
        provider: 'teamsForBusiness'
      };
      
      // If meeting link is provided, add it to the body
      if (params.meetingLink) {
        calendarEvent.body.content += `<br><br><a href="${params.meetingLink}">Join Teams Meeting</a>`;
      }
    }
    
    // Call Microsoft Graph API
    const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(calendarEvent)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to create calendar event: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`
      );
    }
    
    const createdEvent = await response.json();
    return createdEvent;
  } catch (error) {
    console.error('Error creating Teams calendar event:', error);
    throw error;
  }
}

/**
 * Helper function to get Microsoft Graph access token via backend API
 * This is a more secure approach - token exchange happens on backend
 */
export async function getGraphAccessTokenViaBackend(): Promise<string> {
  try {
    // Call your backend API endpoint that exchanges the user's token for a Graph token
    // This endpoint should handle the OAuth flow securely
    const response = await fetch('/api/auth/graph-token', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to get Graph access token from backend');
    }
    
    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error('Error getting Graph token from backend:', error);
    throw error;
  }
}



