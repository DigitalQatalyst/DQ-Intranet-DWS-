import { LeaveRequestForm } from './types';

export interface StoredLeaveRequest extends LeaveRequestForm {
  id: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface UserRequestsData {
  leaveRequests: StoredLeaveRequest[];
  // Add other request types here in the future
  // shiftRequests: StoredShiftRequest[];
  // reimbursementRequests: StoredReimbursementRequest[];
}

const STORAGE_KEY = 'dq_user_requests';

// Initialize or get existing requests from localStorage
export function getUserRequests(): UserRequestsData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading user requests:', error);
  }
  
  // Return default structure
  return {
    leaveRequests: [],
  };
}

// Save requests to localStorage
function saveUserRequests(requests: UserRequestsData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error('Error saving user requests:', error);
  }
}

// Add a new leave request
export function addLeaveRequest(request: LeaveRequestForm): StoredLeaveRequest {
  const requests = getUserRequests();
  
  const newRequest: StoredLeaveRequest = {
    ...request,
    id: `leave-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };
  
  requests.leaveRequests.push(newRequest);
  saveUserRequests(requests);
  
  return newRequest;
}

// Get all leave requests
export function getLeaveRequests(): StoredLeaveRequest[] {
  const requests = getUserRequests();
  return requests.leaveRequests;
}

// Get a specific leave request by ID
export function getLeaveRequestById(id: string): StoredLeaveRequest | undefined {
  const requests = getUserRequests();
  return requests.leaveRequests.find(req => req.id === id);
}

// Update a leave request status
export function updateLeaveRequestStatus(
  id: string, 
  status: 'pending' | 'approved' | 'rejected'
): boolean {
  const requests = getUserRequests();
  const request = requests.leaveRequests.find(req => req.id === id);
  
  if (request) {
    request.status = status;
    saveUserRequests(requests);
    return true;
  }
  
  return false;
}

// Clear all requests (useful for testing)
export function clearAllRequests(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Export requests as JSON (for debugging or export feature)
export function exportRequestsAsJSON(): string {
  const requests = getUserRequests();
  return JSON.stringify(requests, null, 2);
}

