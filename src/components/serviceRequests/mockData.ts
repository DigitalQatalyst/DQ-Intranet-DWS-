import { ServiceRequest } from "../../types";

export const mockServiceRequests: ServiceRequest[] = [
  {
    id: "sr-001",
    serviceName: "Cloud Storage Expansion",
    category: "IT Infrastructure",
    status: "approved",
    submittedDate: "2023-11-15T10:30:00Z",
    sla: 3,
    serviceProvider: "Azure Cloud Services",
    description:
      "Request to increase cloud storage allocation from 500GB to 2TB for the marketing department.",
    requestedBy: {
      id: "user-123",
      name: "John Smith",
      email: "john.smith@company.com",
      department: "Marketing",
    },
    approvers: [
      {
        id: "user-456",
        name: "Sarah Johnson",
        role: "IT Manager",
        status: "approved",
        date: "2023-11-16T14:22:00Z",
        comments: "Approved as per current policy guidelines.",
      },
    ],
  },
  {
    id: "sr-002",
    serviceName: "New Employee Onboarding",
    category: "Human Resources",
    status: "under-review",
    submittedDate: "2023-11-18T09:15:00Z",
    sla: 5,
    serviceProvider: "HR Solutions Inc.",
    description:
      "Complete onboarding process for new software developer starting on December 1st.",
    requestedBy: {
      id: "user-789",
      name: "Emily Davis",
      email: "emily.davis@company.com",
      department: "Human Resources",
    },
    approvers: [
      {
        id: "user-012",
        name: "Michael Wilson",
        role: "Department Head",
        status: "approved",
        date: "2023-11-19T11:05:00Z",
      },
      {
        id: "user-345",
        name: "Jennifer Lee",
        role: "IT Security",
        status: "pending",
      },
    ],
  },
  {
    id: "sr-003",
    serviceName: "Software License Request",
    category: "Software",
    status: "rejected",
    submittedDate: "2023-11-10T14:45:00Z",
    serviceProvider: "Adobe Systems",
    description:
      "Request for 5 Adobe Creative Cloud licenses for the design team.",
    requestedBy: {
      id: "user-678",
      name: "Robert Brown",
      email: "robert.brown@company.com",
      department: "Design",
    },
    approvers: [
      {
        id: "user-901",
        name: "Patricia Garcia",
        role: "Finance Director",
        status: "rejected",
        date: "2023-11-12T16:30:00Z",
        comments: "Budget constraints. Please resubmit in Q1 2024.",
      },
    ],
  },
  {
    id: "sr-004",
    serviceName: "Office Equipment",
    category: "Facilities",
    status: "draft",
    submittedDate: "2023-11-20T08:00:00Z",
    serviceProvider: "Office Depot",
    description:
      "Request for 10 ergonomic chairs for the engineering department.",
    requestedBy: {
      id: "user-234",
      name: "David Martinez",
      email: "david.martinez@company.com",
      department: "Engineering",
    },
  },
  {
    id: "sr-005",
    serviceName: "Network Access Request",
    category: "IT Security",
    status: "approved",
    submittedDate: "2023-11-05T11:20:00Z",
    sla: 2,
    serviceProvider: "Secure Networks LLC",
    description:
      "Request access to the financial reporting network for the new finance analyst.",
    requestedBy: {
      id: "user-567",
      name: "Lisa Taylor",
      email: "lisa.taylor@company.com",
      department: "Finance",
    },
    approvers: [
      {
        id: "user-890",
        name: "James Wilson",
        role: "Security Officer",
        status: "approved",
        date: "2023-11-06T09:15:00Z",
      },
    ],
  },
  {
    id: "sr-006",
    serviceName: "Travel Authorization",
    category: "Travel",
    status: "under-review",
    submittedDate: "2023-11-17T13:45:00Z",
    sla: 7,
    serviceProvider: "Global Travel Partners",
    description:
      "Approval for international travel to client site in London for project kickoff.",
    requestedBy: {
      id: "user-123",
      name: "John Smith",
      email: "john.smith@company.com",
      department: "Marketing",
    },
    approvers: [
      {
        id: "user-456",
        name: "Sarah Johnson",
        role: "Department Manager",
        status: "approved",
        date: "2023-11-18T10:30:00Z",
      },
      {
        id: "user-901",
        name: "Patricia Garcia",
        role: "Finance Director",
        status: "pending",
      },
    ],
  },
  {
    id: "sr-007",
    serviceName: "Training Request",
    category: "Professional Development",
    status: "approved",
    submittedDate: "2023-10-25T15:30:00Z",
    serviceProvider: "AWS Training & Certification",
    description:
      "Request to attend AWS certification training for the DevOps team.",
    requestedBy: {
      id: "user-678",
      name: "Robert Brown",
      email: "robert.brown@company.com",
      department: "IT",
    },
    approvers: [
      {
        id: "user-012",
        name: "Michael Wilson",
        role: "CTO",
        status: "approved",
        date: "2023-10-27T09:20:00Z",
        comments: "Approved as part of our technical upskilling initiative.",
      },
    ],
  },
  {
    id: "sr-008",
    serviceName: "Project Budget Increase",
    category: "Finance",
    status: "rejected",
    submittedDate: "2023-11-08T10:15:00Z",
    serviceProvider: "Finance Department",
    description:
      "Request to increase the mobile app development project budget by $50,000.",
    requestedBy: {
      id: "user-234",
      name: "David Martinez",
      email: "david.martinez@company.com",
      department: "Product Development",
    },
    approvers: [
      {
        id: "user-901",
        name: "Patricia Garcia",
        role: "Finance Director",
        status: "rejected",
        date: "2023-11-10T14:25:00Z",
        comments: "Need more detailed justification and ROI analysis.",
      },
    ],
  },
  {
    id: "sr-009",
    serviceName: "Conference Room Booking",
    category: "Facilities",
    status: "approved",
    submittedDate: "2023-11-19T09:30:00Z",
    sla: 1,
    serviceProvider: "Facilities Management",
    description:
      "Book the main conference room for quarterly planning session on Dec 5-6.",
    requestedBy: {
      id: "user-567",
      name: "Lisa Taylor",
      email: "lisa.taylor@company.com",
      department: "Operations",
    },
    approvers: [
      {
        id: "user-345",
        name: "Jennifer Lee",
        role: "Office Manager",
        status: "approved",
        date: "2023-11-19T10:45:00Z",
      },
    ],
  },
  {
    id: "sr-010",
    serviceName: "Marketing Campaign Approval",
    category: "Marketing",
    status: "under-review",
    submittedDate: "2023-11-14T16:00:00Z",
    sla: 10,
    serviceProvider: "Marketing Department",
    description:
      "Approval for Q1 2024 digital marketing campaign budget and strategy.",
    requestedBy: {
      id: "user-123",
      name: "John Smith",
      email: "john.smith@company.com",
      department: "Marketing",
    },
    approvers: [
      {
        id: "user-012",
        name: "Michael Wilson",
        role: "CMO",
        status: "pending",
      },
      {
        id: "user-901",
        name: "Patricia Garcia",
        role: "Finance Director",
        status: "pending",
      },
    ],
  },
  {
    id: "sr-011",
    serviceName: "Data Access Request",
    category: "IT Security",
    status: "approved",
    submittedDate: "2023-11-12T11:20:00Z",
    sla: 3,
    serviceProvider: "Data Security Team",
    description:
      "Request access to customer analytics dashboard for the sales team.",
    requestedBy: {
      id: "user-789",
      name: "Emily Davis",
      email: "emily.davis@company.com",
      department: "Sales",
    },
    approvers: [
      {
        id: "user-890",
        name: "James Wilson",
        role: "Data Protection Officer",
        status: "approved",
        date: "2023-11-13T14:10:00Z",
        comments: "Approved with standard access level.",
      },
    ],
  },
  {
    id: "sr-012",
    serviceName: "New Vendor Onboarding",
    category: "Procurement",
    status: "draft",
    submittedDate: "2023-11-20T13:45:00Z",
    serviceProvider: "Procurement Services",
    description:
      "Request to onboard new software testing vendor for the upcoming mobile project.",
    requestedBy: {
      id: "user-234",
      name: "David Martinez",
      email: "david.martinez@company.com",
      department: "Quality Assurance",
    },
  },
];
export const serviceCategories = [
  "IT Infrastructure",
  "Human Resources",
  "Software",
  "Facilities",
  "IT Security",
  "Travel",
  "Professional Development",
  "Finance",
  "Marketing",
  "Procurement",
];
