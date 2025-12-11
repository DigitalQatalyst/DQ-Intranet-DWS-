# User Requests Storage System

This module provides a local storage system for managing user requests (leave requests, shift requests, etc.).

## Features

- ✅ Store leave requests locally in browser localStorage
- ✅ Retrieve all requests or specific requests by ID
- ✅ Update request status (pending, approved, rejected)
- ✅ Export requests as JSON
- ✅ Extensible structure for other request types

## Usage

### Adding a Leave Request

```typescript
import { addLeaveRequest } from '@/utils/userRequests';

const leaveRequest = {
  requestName: 'Summer Vacation',
  leaveType: 'Vacation',
  startDate: '2025-07-01',
  endDate: '2025-07-15',
  approvers: [
    { id: '1', name: 'John Doe', initials: 'JD', color: 'bg-blue-500' }
  ],
  reason: 'Family trip to Europe'
};

const savedRequest = addLeaveRequest(leaveRequest);
console.log('Request ID:', savedRequest.id);
```

### Retrieving Requests

```typescript
import { getLeaveRequests, getLeaveRequestById } from '@/utils/userRequests';

// Get all leave requests
const allRequests = getLeaveRequests();

// Get a specific request
const request = getLeaveRequestById('leave-123456-abc');
```

### Updating Request Status

```typescript
import { updateLeaveRequestStatus } from '@/utils/userRequests';

updateLeaveRequestStatus('leave-123456-abc', 'approved');
```

### Viewing Stored Data

Open the browser console and run:

```javascript
JSON.parse(localStorage.getItem('dq_user_requests'))
```

## Data Structure

```typescript
{
  leaveRequests: [
    {
      id: "leave-1234567890-abc123def",
      requestName: "Summer Vacation",
      leaveType: "Vacation",
      startDate: "2025-07-01",
      endDate: "2025-07-15",
      approvers: [...],
      reason: "Family trip to Europe",
      submittedAt: "2025-12-11T13:30:00.000Z",
      status: "pending"
    }
  ]
}
```

## Future Extensions

To add new request types, extend the `UserRequestsData` interface:

```typescript
export interface UserRequestsData {
  leaveRequests: StoredLeaveRequest[];
  shiftRequests: StoredShiftRequest[];  // Add new type
  reimbursementRequests: StoredReimbursementRequest[];  // Add new type
}
```

Then create corresponding functions following the same pattern as leave requests.

## Utility Functions

- `getUserRequests()` - Get all requests
- `addLeaveRequest(request)` - Add a new leave request
- `getLeaveRequests()` - Get all leave requests
- `getLeaveRequestById(id)` - Get specific request
- `updateLeaveRequestStatus(id, status)` - Update request status
- `clearAllRequests()` - Clear all stored requests
- `exportRequestsAsJSON()` - Export as formatted JSON string

