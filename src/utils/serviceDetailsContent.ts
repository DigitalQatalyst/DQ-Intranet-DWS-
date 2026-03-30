import * as React from 'react';

export type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'ol'; items: string[] }
  | { type: 'ul'; items: string[] }
  | { type: 'accordion'; items: Array<{ question: string; answer: string }> }
  | { type: 'iframe'; src: string; width?: string; height?: string; title?: string }
  | { type: 'code'; code: string; language?: string; title?: string }
  | { type: 'procedure_stages'; configKey: string };

export interface TabContent {
  heading?: string;
  blocks: ContentBlock[];
  action?: {
    label: string;
    // Which field from the item to open if present (e.g., requestUrl, formUrl, videoUrl, templateUrl, homepageUrl)
    urlField?: 'requestUrl' | 'formUrl' | 'videoUrl' | 'templateUrl' | 'homepageUrl';
    fallbackUrl?: string;
  };
}

export interface CustomTab {
  id: string;
  label: string;
  icon?: any;
  iconBgColor?: string;
  iconColor?: string;
  renderContent?: (item: any, marketplaceType: string) => React.ReactNode;
}

// Custom tabs for specific services
export const SERVICE_CUSTOM_TABS: Record<string, Record<string, CustomTab[]>> = {
  'non-financial': {
    '3': [ // IT Support Walkthrough
      { id: 'submit_request', label: 'Video Tutorial' },
    ],
    '10': [ // Cursor AI
      { id: 'about', label: 'About' },
      { id: 'system_requirements', label: 'System Requirements' },
      { id: 'licenses', label: 'Licenses' },
      { id: 'visit_site', label: 'Visit Site' },
    ],
    '11': [ // Lovable AI
      { id: 'about', label: 'About' },
      { id: 'system_requirements', label: 'System Requirements' },
      { id: 'licenses', label: 'Licenses' },
      { id: 'visit_site', label: 'Visit Site' },
    ],
    '12': [ // ChatGPT
      { id: 'about', label: 'About' },
      { id: 'system_requirements', label: 'System Requirements' },
      { id: 'licenses', label: 'Licenses' },
      { id: 'visit_site', label: 'Visit Site' },
    ],
    '20': [ // Mokkup.ai
      { id: 'about', label: 'About' },
      { id: 'system_requirements', label: 'System Requirements' },
      { id: 'licenses', label: 'Licenses' },
      { id: 'visit_site', label: 'Visit Site' },
    ],
    '17': [ // Supabase Full-Stack Development Prompt
      { id: 'submit_request', label: 'Prompt' },
    ],
    '18': [ // Next.js 14 + Supabase Full-Stack Prompt
      { id: 'submit_request', label: 'Prompt' },
    ],
    '21': [ // Voiceflow
      { id: 'about', label: 'About' },
      { id: 'system_requirements', label: 'System Requirements' },
      { id: 'licenses', label: 'Licenses' },
      { id: 'visit_site', label: 'Visit Site' },
    ],
    '22': [ // AI QA Engineer & Journey Reviewer Prompt
      { id: 'submit_request', label: 'Prompt' },
    ],
    '19': [ // SvelteKit + Supabase Full-Stack Prompt
      { id: 'submit_request', label: 'Prompt' },
    ],
    '13': [ // Leave Application
      { id: 'annual_leave', label: 'Annual Leave' },
      { id: 'sick_leave', label: 'Sick Leave' },
      { id: 'emergency_leave', label: 'Emergency Leave' },
      { id: 'maternity_leave', label: 'Maternity Leave' },
      { id: 'compassionate_leave', label: 'Compassionate Leave' },
    ],
    '14': [ // Shifts Allocation
      { id: 'shift_allocation', label: 'Shift Allocation' },
      { id: 'request_change', label: 'Request Shift Change' },
      { id: 'clock_in_out', label: 'Clock In/Out' },
      { id: 'guidelines_compliance', label: 'Guidelines & Compliance' },
    ],
    '15': [ // Flight Tickets Reimbursement
      { id: 'eligibility_process', label: 'Eligibility & Process' },
      { id: 'booking_procedure', label: 'Booking Procedure' },
      { id: 'reimbursement_calculation', label: 'Reimbursement Calculation' },
      { id: 'compliance_guidelines', label: 'Compliance & Guidelines' },
    ],
    '16': [ // Staff Requisition
      { id: 'process_overview', label: 'Process Overview' },
      { id: 'roles_responsibilities', label: 'Roles & Responsibilities' },
      { id: 'role_justification', label: 'Role Justification' },
      { id: 'role_scope_competencies', label: 'Scope & Competencies' },
    ],
    'dw-001': [ // Portfolio Analysis
      { id: 'about', label: 'About' },
      { id: 'requirements', label: 'Requirements' },
      { id: 'tools', label: 'Tools' },
      { id: 'sample_use_case', label: 'Sample Use Case' },
    ],
    'dw-002': [ // Portfolio Intelligence
      { id: 'about', label: 'About' },
      { id: 'requirements', label: 'Requirements' },
      { id: 'tools', label: 'Tools' },
      { id: 'sample_use_case', label: 'Sample Use Case' },
    ],
    'dw-003': [ // Portfolio Optimization
      { id: 'about', label: 'About' },
      { id: 'requirements', label: 'Requirements' },
      { id: 'tools', label: 'Tools' },
      { id: 'sample_use_case', label: 'Sample Use Case' },
    ],
    'dw-004': [ // Strategy Advisor
      { id: 'about', label: 'About' },
      { id: 'requirements', label: 'Requirements' },
      { id: 'tools', label: 'Tools' },
      { id: 'sample_use_case', label: 'Sample Use Case' },
    ],
    'dw-005': [ // Autonomous Strategy
      { id: 'about', label: 'About' },
      { id: 'requirements', label: 'Requirements' },
      { id: 'tools', label: 'Tools' },
      { id: 'sample_use_case', label: 'Sample Use Case' },
    ],
    'dw-006': [ // Requirements Elicitation
      { id: 'about', label: 'About' },
      { id: 'requirements', label: 'Requirements' },
      { id: 'tools', label: 'Tools' },
      { id: 'sample_use_case', label: 'Sample Use Case' },
    ],
    'dw-007': [ // Design Automation
      { id: 'about', label: 'About' },
      { id: 'requirements', label: 'Requirements' },
      { id: 'tools', label: 'Tools' },
      { id: 'sample_use_case', label: 'Sample Use Case' },
    ],
  },
};

// Content store keyed by marketplace type -> service id -> tab id
const SERVICE_DETAILS_CONTENT: Record<
  string,
  Record<string, Record<string, TabContent>>
> = {
  'non-financial': {
    // IT Support Form
    '1': {
      submit_request: {
        //heading: 'Submit Request',
        blocks: [
       
          {
            type: 'p',
            text:
              'Log your IT support requests here. Click Submit Request to open the form in a new window. Whenever you encounter a technical issue or need assistance, this is where you can reach out to the IT team. Sharing clear details about your situation helps them understand the problem and respond quickly.',
          },
          { type: 'p', text: 'Steps to submit a ticket:' },
          {
            type: 'ol',
            items: [
              'Open the request form: Click the Submit Request button to launch the support form.',
              'Select a category: Choose the most relevant category for your issue (e.g. Microsoft Solutions, Devices , Other Solutions) so that your request reaches the right IT team.',
              'Describe the issue: Enter a clear summary and detailed description. Include error messages, impacted accounts or log files if possible.',
              'Optionally upload a screenshot of the issue that you are facing. This will help us to understand the issue better and resolve it faster.',
              'Submit the form: Review your entries and click Submit.',
            ],
          },
          {
            type: 'p',
            text:
              'After submission, the IT team will acknowledge receipt of your request and follow up with any questions or updates. Providing clear, detailed information (including screenshots and category selection) will speed up resolution.',
          },
        ],
      },
      self_service_faq: {
        //heading: 'FAQ',
        blocks: [
          {
            type: 'p',
            text:
              'Before submitting a ticket, you can often resolve common issues on your own. The FAQs below highlight quick checks and troubleshooting steps that help address the most frequent problems employees encounter. Reviewing these can save time and get you back to work faster.',
          },
          {
            type: 'accordion',
            items: [
              {
                question: 'Why can\'t I log in or access my account?',
                answer: 'Make sure you are using the correct DQ credentials and that your password is up to date.',
              },
              {
                question: 'What should I do if I have network or connectivity problems?',
                answer: 'Check your Wi-Fi or cable connection, restart your device, and confirm whether the issue is affecting others.',
              },
              {
                question: 'How do I fix software errors or application crashes?',
                answer: 'Restart the application, reboot your computer, ensure all updates are installed, or reinstall the software if needed. You may also try accessing the tool on another device.',
              },
              {
                question: 'How can I troubleshoot hardware or peripheral issues?',
                answer: 'Verify power sources and cable connections, and ensure the correct drivers are installed or updated.',
              },
              {
                question: 'Why are Microsoft Teams or email not working correctly?',
                answer: 'Sign out and back in, restart the app, or try using the web version to confirm if the issue persists.',
              },
              {
                question: 'What general troubleshooting steps should I try first?',
                answer: 'A simple restart resolves many minor issues. Consider whether a recent update or installation could be affecting performance.',
              },
            ],
          },
        ],
      },
      contact_sla: {
        //heading: 'Contacts',
        blocks: [
          {
            type: 'p',
            text:
              '',
          },
          {
            type: 'p',
            text:
              'Support Hours: <strong>Monday–Friday, 8:00 AM to 5:00 PM (Nairobi time)</strong>. Outside these hours, responses may be delayed unless the issue is critical.',
          },
         
          {
            type: 'ul',
            items: [
              'Acknowledgment: Ticket acknowledgment typically within minutes.',
              'First Response: For routine issues, initial response within about one business day (often within an hour).',
              'Resolution Time: Varies based on complexity; we’ll keep you updated and prioritize high‑priority issues.',
              'Escalation: Tickets requiring specialist/higher‑level support are escalated appropriately.',
            ],
          }
          
        ],
      },
      required_documents: {
        heading: 'Required Documents',
        blocks: [{ type: 'p', text: 'No required documents.' }],
      },
    },
    // Support Charter Template
    '2': {
      submit_request: {
        //heading: 'Use the Support Charter Template',
        blocks: [
          {
            type: 'p',
            text:
              'A Support Charter defines how support is structured, who is responsible for what, and how teams should engage when issues arise. Use this template to set clear expectations, ensure consistency, and create a shared understanding of your support processes.',
          },
          {
            type: 'ol',
            items: [
              'Download the template from the Resources section or request it from IT Admin if needed.',
              'Fill out scope, roles/responsibilities, service hours, and escalation paths.',
              'Review with your team and relevant stakeholders to confirm accuracy.',
              'Submit the finalized charter for approval and circulation.',
            ],
          },
          {
            type: 'p',
            text:
              'Tip: Keep the charter concise and focused. Revisit quarterly to ensure it reflects current operations and contacts.',
          },
        ],
      },
      self_service_faq: {
       // heading: 'Guidance & FAQs',
        blocks: [
          {
            type: 'ul',
            items: [
              'What is a support charter? A short document describing the support scope and expectations.',
              'Who signs off? Typically team lead, service owner, and IT operations lead.',
              'How often to update? At least every quarter or when responsibilities change.',
            ],
          },
        ],
      },
      contact_sla: {
       // heading: 'Contacts',
        blocks: [
          { type: 'p', text: 'For help shaping the charter, contact IT Admin or your department lead.' },
          {
            type: 'ul',
            items: [
              'Review cycle: Quarterly (recommended).',
              'Escalation: Department head → IT Operations Lead.',
            ],
          },
        ],
      },
      required_documents: {
        heading: 'Required Documents',
        blocks: [{ type: 'p', text: 'No required documents.' }],
      },
    },
    // IT Support Walkthrough (video/guide)
    '3': {
      submit_request: {
        //heading: 'Follow the Walkthrough',
        blocks: [
          {
            type: 'p',
            text:
              'The IT support walkthrough provides a quick, step-by-step demonstration of how to submit a support ticket correctly. It is designed to help you understand what information to gather, how to document your issue, and how to follow the submission process with confidence.',
          },
          {
            type: 'ol',
            items: [
              'Open the walkthrough and watch the steps end‑to‑end.',
              'Gather details: issue summary, steps to reproduce, error messages, attachments.',
              'Open the Submit Request tab and follow the same steps to log your ticket.',
            ],
          },
          {
            type: 'iframe',
            src: 'https://arqitek.sharepoint.com/sites/General/_layouts/15/embed.aspx?UniqueId=3c26dca2-2c1a-4707-b639-46d1dce6d6df&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create',
            width: '640',
            height: '360',
            title: 'DQ IT and admin Support Request Tutorial',
          },
        ],
      },
    },
    // Note: Cursor AI (id: '10') and Lovable AI (id: '11') content is now managed in aiToolsData.ts
    // Leave Application
    '13': {
      annual_leave: {
        heading: 'Annual Leave (30 Calendar Days)',
        blocks: [
          {
            type: 'p',
            text:
              'Annual leave refers to the allocated number of days an associate can be absent from work without loss of pay during a one-year period. Each associate is entitled to 30 calendar days per year. These days cannot be carried over to the next year. All associates are eligible for leave after the probation period.',
          },
          { type: 'p', text: 'Procedure:' },
          {
            type: 'procedure_stages',
            configKey: 'annualLeave',
          },
        ],
        action: {
          label: 'Apply For Leave',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/7c316234-ded0-4f95-8a83-8453d0876592?source=app-bar-share-entrypoint',
        },
      },
      sick_leave: {
        heading: 'Sick Leave (5 Annual Days)',
        blocks: [
          {
            type: 'p',
            text:
              'Sick leave refers to an approved absence granted for illness. Each associate is eligible for 5 annual sick leave days. These days cannot be carried over to the following year. All employees are eligible for paid sick leave after the probation period.',
          },
          {
            type: 'p',
            text: 'SICK LEAVE: 1 WORKING DAY',
          },
          {
            type: 'ul',
            items: [
              'Call respective line manager to inform them about your sick leave one day prior',
              'Use the "Approvals" app to submit sick leave via your department\'s template',
              'Share an update on both the HR and Leave channels after receiving leave approval',
            ],
          },
          {
            type: 'p',
            text: 'SICK LEAVE: MULTIPLE WORKING DAYS',
          },
          {
            type: 'ul',
            items: [
              'Call respective line manager to inform them about your sick leave one day prior',
              'Provide a medical certificate to the line manager',
              'Fill the Leave Form by clicking the "Apply For Leave" button below',
              'Share an update on both the HR and Leave channels upon approval',
              'Capture the associate assigned as the task reliever with the line manager',
              'Capture and update the task handover catalog',
              'Obtain sign-off from the line manager on the HR channel for the task handover catalog',
            ],
          },
        ],
        action: {
          label: 'Apply For Leave',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/7c316234-ded0-4f95-8a83-8453d0876592?source=app-bar-share-entrypoint',
        },
      },
      emergency_leave: {
        heading: 'Emergency Leave',
        blocks: [
          {
            type: 'p',
            text:
              'Emergency leave is a vital provision offered by DQ to support associates facing unforeseen and critical situations. It allows associates to take authorized absence during emergencies, ranging from personal crises to natural disasters. Associates should ensure that emergency leave is only taken for unexpected circumstances and must confide to their line manager the reason for emergency.',
          },
          {
            type: 'p',
            text: 'Procedure to request emergency leave:',
          },
          {
            type: 'ol',
            items: [
              'Call respective line manager to verbally request an emergency leave',
              'Use the "Approvals" app to submit the leave via your department\'s template',
              'Notify on both the HR and Leave channels after receiving the final leave approval',
            ],
          },
        ],
        action: {
          label: 'Apply For Leave',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/7c316234-ded0-4f95-8a83-8453d0876592?source=app-bar-share-entrypoint',
        },
      },
      maternity_leave: {
        heading: 'Maternity Leave (45 Days)',
        blocks: [
          {
            type: 'p',
            text:
              'Female associates are entitled to 45 days of maternity leave for childbirth and postpartum recovery. This leave can be taken both before and after childbirth, as needed. Leave eligibility begins after the associate\'s probation period.',
          },
          { type: 'p', text: 'Procedure:' },
          {
            type: 'p',
            text: 'STAGE 01: 4 WEEKS PRIOR',
          },
          {
            type: 'ul',
            items: [
              'Confirm leave eligibility',
              'Apply on "Approvals" app',
              'Update on HR Channel',
            ],
          },
          {
            type: 'p',
            text: 'STAGE 02: 2 WEEKS PRIOR',
          },
          {
            type: 'ul',
            items: [
              'Notify senior management',
              'Update handover catalog',
              'Capture sign-off',
            ],
          },
          {
            type: 'p',
            text: 'STAGE 03: 1 WEEK PRIOR',
          },
          {
            type: 'ul',
            items: [
              'Publish handover catalog',
              'Update Leave and HR channel',
              'Setup "Out-of-Office" reply',
            ],
          },
        ],
        action: {
          label: 'Apply For Leave',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/7c316234-ded0-4f95-8a83-8453d0876592?source=app-bar-share-entrypoint',
        },
      },
      compassionate_leave: {
        heading: 'Compassionate Leave (3-5 Days)',
        blocks: [
          {
            type: 'p',
            text:
              'Compassionate leave is granted to associates in the event of a family member\'s serious illness or loss. This leave ensures that associates have dedicated time to support loved ones during difficult times. Each associate is entitled to 3 to 5 days of compassionate leave per year, with eligibility beginning after the associate\'s probation period.',
          },
          {
            type: 'p',
            text: 'Procedure to request compassionate leave:',
          },
          {
            type: 'ol',
            items: [
              'Call respective line manager to verbally request a compassionate leave',
              'Use the "Approvals" app to submit the leave via your department\'s template',
              'Notify both the HR and Leave channels after receiving the final leave approval',
            ],
          },
        ],
        action: {
          label: 'Apply For Leave',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/7c316234-ded0-4f95-8a83-8453d0876592?source=app-bar-share-entrypoint',
        },
      },
    },
    // Shifts Allocation
    '14': {
      shift_allocation: {
        heading: 'Shift Allocation Process',
        blocks: [
          {
            type: 'p',
            text:
              'The Shift Allocation Process ensures efficiency, fairness, and legal compliance in assigning work schedules. All shifts are published by Wednesday each week, and associates must confirm their shifts immediately upon publication, no later than Friday.',
          },
          { type: 'p', text: 'Roles and Responsibilities:' },
          {
            type: 'ul',
            items: [
              'Associates: Confirm assigned shifts upon publication (by Friday each week), clock in and out at designated times.',
              'Line Managers: Review and approve shift assignments, ensure fair allocation, approve/deny shift change requests.',
              'Admin: Confirm associate availability through line managers, publish finalized shifts by Wednesday, process approved shift changes.',
            ],
          },
          { type: 'p', text: 'Step-by-Step Process:' },
          {
            type: 'ol',
            items: [
              'Confirm Availability: Admin collaborates with line managers to confirm associate availability.',
              'Assign Shifts: Shifts are assigned based on associate availability and operational needs (morning, evening, split shifts, remote).',
              'Publish Shifts: Admin publishes shifts by Wednesday each week via Shifts app.',
              'Confirm Shift Assignments: Associates must confirm shifts immediately upon publication (deadline: Friday).',
              'View Shifts: Access your assigned shifts in the Shifts app and add them to your calendar.',
            ],
          },
          {
            type: 'p',
            text:
              'Important: Failure to confirm shifts on time will result in the inability to request a shift change for that cycle. All shift assignments comply with local labor laws regarding working hours and rest periods.',
          },
        ],
        action: {
          label: 'Open Shifts App',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/shifts',
        },
      },
      request_change: {
        heading: 'Request Shift Change Process',
        blocks: [
          {
            type: 'p',
            text:
              'Associates can request shift changes through the proper channels by providing valid reasons to their line manager. All shift change requests must be approved before being processed.',
          },
          { type: 'p', text: 'Procedure to request a shift change:' },
          {
            type: 'ol',
            items: [
              'Requesting Change: Associate submits shift change request to line manager via Teams chat with valid reason (e.g., personal emergency, medical appointment, unavoidable conflict).',
              'Approval: Line manager reviews request and approves or denies based on operational needs and business availability.',
              'Processing: Once approved by line manager, they inform Admin to update and process the shift change.',
              'Confirmation: Admin processes the approved shift change and updates records in the Shifts app.',
              'Notification: Admin promptly informs associates of the shift change with adequate notice.',
            ],
          },
          { type: 'p', text: 'Key Requirements:' },
          {
            type: 'ul',
            items: [
              'Request must be submitted through line manager (not directly to Admin)',
              'Provide valid and clear reason for the change',
              'Request should be made as early as possible to allow proper planning',
              'Line manager must inform Admin after approval',
              'Associates must have confirmed their original shifts to be eligible for change requests',
            ],
          },
          {
            type: 'p',
            text:
              'Consequences: Unauthorized shift changes will not be counted for payroll. Excessive shift change requests (repeated, unnecessary) will be denied, and the associate will be prohibited from future requests.',
          },
        ],
        action: {
          label: 'Contact Line Manager',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/shifts',
        },
      },
      clock_in_out: {
        heading: 'Clock In/Out Reporting Process',
        blocks: [
          {
            type: 'p',
            text:
              'Associates are required to clock in and out at designated times for each assigned shift. Accurate clock-in/clock-out reporting is essential for payroll processing and operational tracking. 100% compliance is required.',
          },
          { type: 'p', text: 'Clock In/Out Procedure:' },
          {
            type: 'ol',
            items: [
              'Clock In: At the start of your shift, open the Shifts app and clock in at your designated time.',
              'During Shift: Remain clocked in for the duration of your assigned shift. For split shifts, clock out and in accordingly.',
              'Clock Out: At the end of your shift, open the Shifts app and clock out at the designated time.',
              'Verify Record: Check that your clock-in/clock-out times are accurately recorded in the system.',
            ],
          },
          { type: 'p', text: 'Report Deviations:' },
          {
            type: 'ul',
            items: [
              'If you experience technical issues with clocking in/out, immediately report to your line manager and Admin via Teams chat.',
              'If you forget to clock in or out, notify your line manager and Admin as soon as possible with the actual times worked.',
              'Any discrepancies in clock-in/clock-out records must be reported promptly for correction.',
              'Documentation may be required for corrections (e.g., screenshot, email confirmation).',
            ],
          },
          {
            type: 'p',
            text:
              'Tracking: Admin tracks and reports all clock-in and clock-out data for operational accuracy and payroll processing. All attendance records are documented for compliance purposes.',
          },
        ],
        action: {
          label: 'Open Shifts App',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/shifts',
        },
      },
      guidelines_compliance: {
        heading: 'Guidelines, KPIs & Compliance',
        blocks: [
          {
            type: 'p',
            text:
              'The Shifts Allocation Guidelines ensure operational efficiency, fairness, and legal compliance. All associates must adhere to these guidelines to support Live24\'s operational goals.',
          },
          { type: 'p', text: 'Key Performance Indicators (KPIs):' },
          {
            type: 'ul',
            items: [
              'Shift Confirmation Rate: 100% confirmation of assigned shifts by associates by the published deadline (Friday).',
              'Shift Change Request Compliance: 100% of shift changes processed through proper channels (via line manager).',
              'Clock-in/Clock-out Compliance: 100% accurate clock-in/clock-out reporting by associates.',
              'Shift Adherence: 100% adherence to assigned shifts by associates.',
            ],
          },
          { type: 'p', text: 'Guiding Principles:' },
          {
            type: 'ul',
            items: [
              'Shift Confirmation: Associates must confirm assigned shifts immediately upon publication (deadline: Friday).',
              'Shift Change Requests: Must be requested via line manager with valid reasons.',
              'Communication: Admin will promptly inform associates of any shift changes with adequate notice.',
              'Publication Timeline: All shifts must be published by Wednesday each week.',
              'Shift Reporting: Clock in and out on time; deviations must be reported immediately.',
            ],
          },
          { type: 'p', text: 'Consequences for Non-Compliance:' },
          {
            type: 'ul',
            items: [
              'Unapproved Absences: Failure to show up for assigned shifts without approval will result in the day not being counted for payroll. 3 unapproved absences in a month will warrant reconsideration of engagement by HR.',
              'Unauthorized Shift Changes: Will not be counted for payroll purposes.',
              'Failure to Confirm Shifts: Results in inability to request shift changes for that cycle.',
              'Excessive Shift Change Requests: Repeated, unnecessary requests will be denied, and associate prohibited from future requests.',
            ],
          },
          { type: 'p', text: 'Compliance and Governance:' },
          {
            type: 'ul',
            items: [
              'Legal Compliance: All shift assignments comply with local labor laws regarding working hours and rest periods.',
              'Operational Compliance: Shifts align with business needs and ensure fairness.',
              'Documentation: All shift assignments, changes, and attendance records documented for compliance.',
              'Quarterly Review: Guidelines reviewed quarterly to meet evolving operational needs.',
            ],
          },
          { type: 'p', text: 'Tools and Resources:' },
          {
            type: 'ul',
            items: [
              'Shifts App: Used for scheduling, tracking, and modifying shifts.',
              'Teams Chat: Communication channel for shift changes, confirmations, and inquiries.',
            ],
          },
        ],
        action: {
          label: 'Open Shifts App',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/shifts',
        },
      },
    },
    // Flight Tickets Reimbursement
    '15': {
      eligibility_process: {
        heading: 'Eligibility & Process Overview',
        blocks: [
          {
            type: 'p',
            text:
              'These guidelines provide a standardized, clear, and efficient process for flight ticket reimbursement to eligible associates within DQ. The reimbursement applies to economy class return tickets from Dubai to the nearest major airport to the associate\'s home city.',
          },
          { type: 'p', text: 'Purpose:' },
          {
            type: 'p',
            text:
              'To provide a standardized, clear, and efficient process for flight ticket reimbursement to eligible associates within DQ, ensuring fairness, transparency, and consistency in accordance with the company\'s policy.',
          },
          { type: 'p', text: 'Scope:' },
          {
            type: 'p',
            text:
              'These guidelines apply to all permanently employed associates within the organization who meet the eligibility criteria and require flight ticket reimbursement for travel to their home country and back. The reimbursement applies to economy class tickets only.',
          },
          { type: 'p', text: 'Roles and Responsibilities:' },
          {
            type: 'ul',
            items: [
              'Associates: Submit requests with three quotes from reputable online platforms via Approvals App, book flights according to guidelines at least two weeks before travel.',
              'Admin: Reviews requests, confirms eligibility, ensures guidelines are followed, conducts independent research to verify current average flight costs, passes confirmed requests to Finance.',
              'Ops Lead: Approves flight bookings and ensures compliance with guidelines.',
              'Finance: Processes approved reimbursement requests and issues payments.',
            ],
          },
          { type: 'p', text: 'Reimbursement Process Overview:' },
          {
            type: 'ol',
            items: [
              'Request Initiation: Submit reimbursement request once eligibility criteria are met, at least one month before travel.',
              'Quote Submission: Provide three quotes from reputable online platforms on HR Channel for comparison.',
              'Admin Review: Admin confirms eligibility and verifies average flight costs through independent research.',
              'Ops Lead Approval: Ops Lead reviews and approves the flight booking.',
              'Book Flight: Book economy class flight at least two weeks before travel date.',
              'Finance Processing: Finance processes the approved reimbursement based on the average cost calculation.',
            ],
          },
        ],
        action: {
          label: 'Submit Request',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/7c316234-ded0-4f95-8a83-8453d0876592?source=app-bar-share-entrypoint',
        },
      },
      booking_procedure: {
        heading: 'Booking Procedure & Quote Requirements',
        blocks: [
          {
            type: 'p',
            text:
              'To ensure transparency and fairness, associates must follow specific procedures when booking flights and submitting quotes for reimbursement.',
          },
          { type: 'p', text: 'Quote Submission Requirements:' },
          {
            type: 'ol',
            items: [
              'Provide Three Quotes: Submit three flight quotes from renowned online platforms (e.g., Skyscanner, Kayak, Google Flights, Expedia).',
              'Post on HR Channel: Share all three quotes on the HR Channel for review and comparison.',
              'Ensure Comparability: All quotes must be for the same travel dates, route (Dubai to home country nearest major airport), and class (economy).',
              'Include Details: Each quote should include airline, flight times, layovers, total cost, and platform used.',
            ],
          },
          { type: 'p', text: 'Booking Timeline and Requirements:' },
          {
            type: 'ul',
            items: [
              'Submit Request: At least one month before travel date via Approvals App.',
              'Admin Review: Admin verifies eligibility and conducts independent research on current average flight costs.',
              'Quote Submission: Provide three quotes on HR Channel immediately after request submission.',
              'Approval: Wait for Ops Lead approval before proceeding with booking.',
              'Book Flight: Must book at least two weeks before travel date.',
              'Economy Class Only: Reimbursement applies only to economy class return tickets.',
              'Route: Dubai to nearest major airport to associate\'s home city.',
            ],
          },
          { type: 'p', text: 'Guiding Principles:' },
          {
            type: 'ul',
            items: [
              'Fairness and Transparency: Ensure transparent process by requiring three quotes and providing clarity on reimbursement amount.',
              'Timeliness: Submit requests at least one month in advance and book at least two weeks before travel.',
              'Accountability: Ensure all steps of the reimbursement process are followed properly.',
              'Budget Adherence: Flight bookings must adhere to budgetary constraints based on average costs.',
            ],
          },
          {
            type: 'p',
            text:
              'Important: Late requests submitted after the specified timeframe may not be eligible for reimbursement. Admin will conduct independent verification of flight costs to ensure accuracy.',
          },
        ],
        action: {
          label: 'Submit Request',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/7c316234-ded0-4f95-8a83-8453d0876592?source=app-bar-share-entrypoint',
        },
      },
      reimbursement_calculation: {
        heading: 'Reimbursement Calculation Method',
        blocks: [
          {
            type: 'p',
            text:
              'The reimbursement amount is calculated based on the average of flight prices from three quotes provided by the associate and verified by Admin through independent research.',
          },
          { type: 'p', text: 'Calculation Method:' },
          {
            type: 'ol',
            items: [
              'Average Calculation: Admin calculates the average of the three quotes provided by the associate.',
              'Independent Verification: Admin conducts independent research on renowned online platforms to verify the current average cost of flights for the specified route and dates.',
              'Final Average: The reimbursement baseline is determined based on the verified average cost.',
            ],
          },
          { type: 'p', text: 'Reimbursement Scenarios:' },
          {
            type: 'ul',
            items: [
              'Ticket Cost Above Average: If the actual ticket cost is above the average, the associate pays the difference. Reimbursement = Average Cost (Associate pays: Actual Cost - Average).',
              'Ticket Cost Below Average: If the actual ticket cost is below the average, the reimbursement will be the actual ticket cost (no top-up provided). Reimbursement = Actual Ticket Cost.',
              'Ticket Cost Equal to Average: If the actual ticket cost equals the average, full reimbursement is provided. Reimbursement = Actual Ticket Cost.',
            ],
          },
          { type: 'p', text: 'Example Calculation:' },
          {
            type: 'p',
            text:
              'Quote 1: AED 2,400 | Quote 2: AED 2,600 | Quote 3: AED 2,500 | Average: AED 2,500',
          },
          {
            type: 'ul',
            items: [
              'If Associate Books at AED 2,700: Reimbursement = AED 2,500, Associate pays AED 200 difference.',
              'If Associate Books at AED 2,300: Reimbursement = AED 2,300 (actual cost, no top-up to average).',
              'If Associate Books at AED 2,500: Reimbursement = AED 2,500 (full reimbursement).',
            ],
          },
          {
            type: 'p',
            text:
              'Budget Adherence Principle: No top-up will be provided if the ticket cost is below the average. This ensures budget adherence and encourages associates to find cost-effective options.',
          },
        ],
        action: {
          label: 'Submit Request',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/7c316234-ded0-4f95-8a83-8453d0876592?source=app-bar-share-entrypoint',
        },
      },
      compliance_guidelines: {
        heading: 'Compliance, Guidelines & KPIs',
        blocks: [
          {
            type: 'p',
            text:
              'Flight ticket reimbursement must comply with organizational policies, timelines, and budgetary constraints to ensure fairness and transparency.',
          },
          { type: 'p', text: 'Key Performance Indicators (KPIs):' },
          {
            type: 'ul',
            items: [
              'Timeliness: Ensure requests are submitted on time (at least one month prior to travel).',
              'Quote Transparency: Provide three quotes from renowned online platforms for flight comparison.',
              'Compliance: Adhere to budgetary guidelines when booking flights (based on average cost).',
              'Booking Timeliness: Book flights at least two weeks before travel date.',
            ],
          },
          { type: 'p', text: 'Compliance and Governance:' },
          {
            type: 'ul',
            items: [
              'Approval Process Compliance: All requests must be submitted and approved through the Approvals App. Any discrepancies will be reviewed by the Admin Lead.',
              'Ticket Cost Compliance: No reimbursement exceeds the average of the three quotes unless the associate covers the excess.',
              'Late Submission Protocol: Requests submitted later than the specified timeframes (one month before travel) may not be reimbursed.',
              'Economy Class Only: Reimbursement applies only to economy class tickets. Business or first-class tickets are not eligible.',
              'Documentation: All reimbursement requests, quotes, and approvals will be documented for compliance and audit purposes.',
            ],
          },
          { type: 'p', text: 'Review and Update Schedule:' },
          {
            type: 'ul',
            items: [
              'Quarterly Review: Guidelines will be reviewed quarterly to ensure relevance and efficiency. Next review scheduled for November 2025.',
              'Ad-Hoc Updates: Updates will be made when operational or regulatory changes occur.',
            ],
          },
          { type: 'p', text: 'Tools and Resources:' },
          {
            type: 'ul',
            items: [
              'Approvals App: Used for submitting and tracking all flight reimbursement requests.',
              'Renowned Online Platforms: Skyscanner, Kayak, Google Flights, Expedia for sourcing quotes and booking flights.',
              'HR Channel: Teams channel for posting quotes and communicating with Admin.',
              'Reimbursement Request Form: Template available in Approvals App for submitting requests.',
            ],
          },
          {
            type: 'p',
            text:
              'Consequences for Non-Compliance: Late submissions may result in denial of reimbursement. Failure to provide three quotes or booking flights not in economy class will result in request rejection. Associates are responsible for understanding and following these guidelines.',
          },
        ],
        action: {
          label: 'Submit Request',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/7c316234-ded0-4f95-8a83-8453d0876592?source=app-bar-share-entrypoint',
        },
      },
    },
    // Staff Requisition
    '16': {
      process_overview: {
        heading: 'Staff Requisition Process Overview',
        blocks: [
          {
            type: 'p',
            text:
              'The Staff Requisition Process ensures that staffing needs are aligned with organizational priorities, budget availability, and operational requirements. All demand cards must be completed accurately, reviewed by the line manager, and routed to HR for evaluation.',
          },
          { type: 'p', text: 'Process Flow:' },
          {
            type: 'ol',
            items: [
              'Demand Card Submission: Associate/Hiring Manager submits a detailed staff requisition request through the Approvals App, outlining the role purpose, key responsibilities, and required competencies.',
              'Line Manager Review: Line Manager validates the business need, confirms budget availability, ensures alignment with team workload, and approves or rejects the requisition.',
              'HR Evaluation: HR reviews and validates the demand card, ensures compliance with staffing policies, evaluates job level and salary band.',
              'Approval & Recruitment: Approved requests proceed to recruitment through Talent Acquisition. Incomplete or unclear submissions may be returned for clarification.',
              'Sourcing & Hiring: Talent Acquisition team sources candidates, conducts interviews, and completes the hiring process.',
            ],
          },
          { type: 'p', text: 'Staffing Types Supported:' },
          {
            type: 'ul',
            items: [
              'Permanent Roles: Full-time positions with long-term employment contracts.',
              'Contract Roles: Fixed-term positions for specific projects or time-bound needs.',
              'Temporary Staffing: Short-term hires to cover operational peaks or leaves.',
            ],
          },
          { type: 'p', text: 'Key Requirements:' },
          {
            type: 'ul',
            items: [
              'Complete demand card with all required details (purpose, responsibilities, competencies, justification).',
              'Line manager approval confirming business need and budget availability.',
              'HR validation of role alignment with organizational structure and policies.',
              'Clear specification of whether the role is a replacement or new headcount.',
              'Full visibility and traceability throughout the recruitment process.',
            ],
          },
          {
            type: 'p',
            text:
              'Important: Incomplete or unclear submissions will be returned to the hiring manager for clarification. Ensure all sections of the demand card are filled accurately to avoid delays in the recruitment process.',
          },
        ],
        action: {
          label: 'Submit Requisition',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/7c316234-ded0-4f95-8a83-8453d0876592?source=app-bar-share-entrypoint',
        },
      },
      roles_responsibilities: {
        heading: 'Roles and Responsibilities',
        blocks: [
          {
            type: 'p',
            text:
              'The Staff Requisition Process involves collaboration between Associates/Hiring Managers, Line Managers, and HR & Talent Acquisition to ensure staffing decisions are aligned with business needs and organizational priorities.',
          },
          { type: 'p', text: 'Associates / Hiring Managers:' },
          {
            type: 'ul',
            items: [
              'Submit the staff requisition request with complete details on purpose, responsibilities, competencies, and justification for the role.',
              'Provide clear business rationale explaining why the role is needed (operational gap, strategic initiative, etc.).',
              'Specify whether the role is a replacement for a departing employee or new headcount.',
              'Respond to HR clarifications promptly to avoid delays in processing.',
              'Ensure alignment with departmental goals and organizational priorities.',
              'Collaborate with Line Manager to validate business need before submission.',
            ],
          },
          { type: 'p', text: 'Line Managers:' },
          {
            type: 'ul',
            items: [
              'Validate the business need and confirm that the role is critical to operations or strategic objectives.',
              'Confirm budget availability for the position (salary, benefits, onboarding costs).',
              'Ensure alignment to team workload and assess whether existing resources can absorb the responsibilities.',
              'Approve or reject requisition submissions based on business priorities and resource constraints.',
              'Provide feedback and guidance to Hiring Managers if the requisition requires adjustments.',
              'Monitor recruitment progress and support Talent Acquisition during candidate evaluation.',
            ],
          },
          { type: 'p', text: 'HR & Talent Acquisition:' },
          {
            type: 'ul',
            items: [
              'Review and validate the demand card to ensure completeness and clarity.',
              'Ensure compliance with staffing policies, organizational structure, and headcount planning.',
              'Evaluate job level, salary band, and benefits alignment with market standards and internal equity.',
              'Proceed with sourcing once the requisition is approved, leveraging internal and external talent pools.',
              'Coordinate with Line Managers and Hiring Managers throughout the recruitment process.',
              'Provide regular updates on sourcing progress and candidate pipelines.',
              'Return incomplete or unclear submissions to Hiring Managers for clarification.',
            ],
          },
          {
            type: 'p',
            text:
              'Key Success Factor: Clear communication and collaboration between all parties ensure that staffing decisions are made efficiently, transparently, and in alignment with organizational goals.',
          },
        ],
        action: {
          label: 'Submit Requisition',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/7c316234-ded0-4f95-8a83-8453d0876592?source=app-bar-share-entrypoint',
        },
      },
      role_justification: {
        heading: 'Purpose (Role Justification)',
        blocks: [
          {
            type: 'p',
            text:
              'The Role Justification section is critical to the Staff Requisition Process. It helps Line Managers and HR understand why the position is needed, what gap it fills, and how it supports business objectives.',
          },
          { type: 'p', text: 'What to Include in Role Justification:' },
          {
            type: 'ul',
            items: [
              'Business Challenge or Gap: Describe the specific operational, strategic, or capacity challenge that this role will address. Examples: "Increased customer demand requires additional support," "New product line launch needs dedicated ownership," "Departing employee leaving critical gap in team capacity."',
              'Operational or Strategic Need: Explain how the role supports departmental or organizational goals. Examples: "Role will lead digital transformation initiative," "Position will improve customer response times by 30%," "Hire will enable team to scale operations for Q2 growth."',
              'Expected Impact of Filling the Role: Quantify or describe the value this position will bring. Examples: "Will reduce project delivery time by 15%," "Expected to generate AED 500K in revenue annually," "Will improve compliance scores and reduce audit risks."',
              'Replacement or New Headcount: Clearly state whether this is a replacement for a departing employee or a new position. If replacement, mention the departing employee and their last working day. If new headcount, explain why existing resources cannot absorb the responsibilities.',
            ],
          },
          { type: 'p', text: 'Example Role Justification:' },
          {
            type: 'p',
            text:
              'Business Challenge: The Customer Success team is currently handling 40% more tickets than capacity allows, resulting in delayed responses and decreased customer satisfaction scores. Operational Need: A dedicated Customer Success Specialist will allow us to meet our SLA targets (24-hour response time) and improve NPS scores by 15 points. Expected Impact: Hiring this role will improve response times, increase customer retention by 10%, and support our Q3 revenue targets. Replacement or New Headcount: This is a new headcount position. Existing team members are at full capacity and cannot absorb additional workload without compromising service quality.',
          },
          {
            type: 'p',
            text:
              'Tip: Be specific and data-driven. Vague justifications like "We need more help" or "Team is busy" are not sufficient. Provide concrete evidence (metrics, workload data, business goals) to support your request.',
          },
        ],
        action: {
          label: 'Submit Requisition',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/7c316234-ded0-4f95-8a83-8453d0876592?source=app-bar-share-entrypoint',
        },
      },
      role_scope_competencies: {
        heading: 'Role Scope & Key Competencies',
        blocks: [
          {
            type: 'p',
            text:
              'Defining the role scope and key competencies ensures that the position is clearly understood by all stakeholders and that Talent Acquisition can source the right candidates.',
          },
          { type: 'p', text: 'Key Responsibilities (Role Scope):' },
          {
            type: 'p',
            text:
              'Outline the major tasks and deliverables the position will perform. This helps HR and Talent Acquisition understand the role\'s purpose and scope, and ensures alignment with organizational needs.',
          },
          {
            type: 'ul',
            items: [
              'Day-to-Day Operational Duties: Core tasks performed regularly (e.g., "Manage customer inquiries via email and phone," "Process invoices and reconcile accounts," "Monitor system performance and troubleshoot issues").',
              'Project or Cross-Functional Activities: Collaborative or project-based work (e.g., "Lead quarterly product launch initiatives," "Collaborate with Marketing on campaign execution," "Support HR on onboarding process improvements").',
              'Governance, Reporting, or Compliance Tasks: Responsibilities related to oversight, documentation, or regulatory requirements (e.g., "Prepare monthly financial reports for leadership," "Ensure compliance with data privacy regulations," "Conduct quarterly audits of operational processes").',
              'Expected Deliverables and Performance Outcomes: Clear output expectations (e.g., "Achieve 95% customer satisfaction rating," "Reduce processing time by 20%," "Deliver weekly status reports to Line Manager").',
            ],
          },
          { type: 'p', text: 'Key Competencies (Required Skills & Behaviors):' },
          {
            type: 'p',
            text:
              'Specify the capabilities and attributes required for success in the role. This section helps Talent Acquisition identify the right talent and ensures candidates meet the role\'s expectations.',
          },
          {
            type: 'ul',
            items: [
              'Technical Skills: Tools, systems, or domain expertise required (e.g., "Proficiency in Microsoft Excel and Power BI," "Experience with Salesforce CRM," "Knowledge of IFRS accounting standards," "Fluency in Python and SQL").',
              'Soft Skills: Interpersonal and behavioral capabilities (e.g., "Strong communication and presentation skills," "Leadership and team collaboration," "Problem-solving and critical thinking," "Adaptability and resilience in fast-paced environments").',
              'Experience Requirements: Relevant background and tenure (e.g., "3-5 years in customer-facing roles," "Bachelor\'s degree in Finance or Accounting," "Prior experience managing cross-functional teams," "Proven track record in SaaS sales").',
              'Behavioral Competencies: Alignment with organizational values and culture (e.g., "Customer-centric mindset," "Data-driven decision-making," "Ownership and accountability," "Continuous improvement and innovation").',
            ],
          },
          {
            type: 'p',
            text:
              'Best Practice: Use the STAR method (Situation, Task, Action, Result) when describing responsibilities and competencies. This provides clarity and helps Talent Acquisition evaluate candidates effectively during the recruitment process.',
          },
        ],
        action: {
          label: 'Submit Requisition',
          urlField: 'requestUrl',
          fallbackUrl: 'https://teams.microsoft.com/l/app/7c316234-ded0-4f95-8a83-8453d0876592?source=app-bar-share-entrypoint',
        },
      },
    },
    // Supabase Full-Stack Development Prompt
    '17': {
      submit_request: {
        heading: 'Supabase Full-Stack Development Prompt',
        blocks: [
          {
            type: 'p',
            text: 'This prompt delivers structured, expert-level guidance for developing modern full-stack applications using TypeScript, React, Next.js, Expo, and Supabase. Use it with your AI coding assistant to ensure consistent, high-quality output aligned with established engineering best practices.',
          },
          {
            type: 'code',
            language: 'markdown',
            title: 'Full-Stack Development Guidelines',
            code: `You are an expert developer proficient in TypeScript, React and Next.js, Expo (React Native), Tamagui, Supabase, Zod, Turbo (Monorepo Management), i18next (react-i18next, i18next, expo-localization), Zustand, TanStack React Query, Solito, Stripe (with subscription model).

Code Style and Structure

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., \`isLoading\`, \`hasError\`).
- Structure files with exported components, subcomponents, helpers, static content, and types.
- Favor named exports for components and functions.
- Use lowercase with dashes for directory names (e.g., \`components/auth-wizard\`).

TypeScript and Zod Usage

- Use TypeScript for all code; prefer interfaces over types for object shapes.
- Utilize Zod for schema validation and type inference.
- Avoid enums; use literal types or maps instead.
- Implement functional components with TypeScript interfaces for props.

Syntax and Formatting

- Use the \`function\` keyword for pure functions.
- Write declarative JSX with clear and readable structure.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.

UI and Styling

- Use Tamagui for cross-platform UI components and styling.
- Implement responsive design with a mobile-first approach.
- Ensure styling consistency between web and native applications.
- Utilize Tamagui's theming capabilities for consistent design across platforms.

State Management and Data Fetching

- Use Zustand for state management.
- Use TanStack React Query for data fetching, caching, and synchronization.
- Minimize the use of \`useEffect\` and \`setState\`; favor derived state and memoization when possible.

Internationalization

- Use i18next and react-i18next for web applications.
- Use expo-localization for React Native apps.
- Ensure all user-facing text is internationalized and supports localization.

Error Handling and Validation

- Prioritize error handling and edge cases.
- Handle errors and edge cases at the beginning of functions.
- Use early returns for error conditions to avoid deep nesting.
- Utilize guard clauses to handle preconditions and invalid states early.
- Implement proper error logging and user-friendly error messages.
- Use custom error types or factories for consistent error handling.

Performance Optimization

- Optimize for both web and mobile performance.
- Use dynamic imports for code splitting in Next.js.
- Implement lazy loading for non-critical components.
- Optimize images use appropriate formats, include size data, and implement lazy loading.

Monorepo Management

- Follow best practices using Turbo for monorepo setups.
- Ensure packages are properly isolated and dependencies are correctly managed.
- Use shared configurations and scripts where appropriate.
- Utilize the workspace structure as defined in the root \`package.json\`.

Backend and Database

- Use Supabase for backend services, including authentication and database interactions.
- Follow Supabase guidelines for security and performance.
- Use Zod schemas to validate data exchanged with the backend.

Cross-Platform Development

- Use Solito for navigation in both web and mobile applications.
- Implement platform-specific code when necessary, using \`.native.tsx\` files for React Native-specific components.
- Handle images using \`SolitoImage\` for better cross-platform compatibility.

Stripe Integration and Subscription Model

- Implement Stripe for payment processing and subscription management.
- Use Stripe's Customer Portal for subscription management.
- Implement webhook handlers for Stripe events (e.g., subscription created, updated, or cancelled).
- Ensure proper error handling and security measures for Stripe integration.
- Sync subscription status with user data in Supabase.

Testing and Quality Assurance

- Write unit and integration tests for critical components.
- Use testing libraries compatible with React and React Native.
- Ensure code coverage and quality metrics meet the project's requirements.

Project Structure and Environment

- Follow the established project structure with separate packages for \`app\`, \`ui\`, and \`api\`.
- Use the \`apps\` directory for Next.js and Expo applications.
- Utilize the \`packages\` directory for shared code and components.
- Use \`dotenv\` for environment variable management.
- Follow patterns for environment-specific configurations in \`eas.json\` and \`next.config.js\`.
- Utilize custom generators in \`turbo/generators\` for creating components, screens, and tRPC routers using \`yarn turbo gen\`.

Key Conventions

- Use descriptive and meaningful commit messages.
- Ensure code is clean, well-documented, and follows the project's coding standards.
- Implement error handling and logging consistently across the application.

Follow Official Documentation

- Adhere to the official documentation for each technology used.
- For Next.js, focus on data fetching methods and routing conventions.
- Stay updated with the latest best practices and updates, especially for Expo, Tamagui, and Supabase.

Output Expectations

- Code Examples: Provide code snippets that align with the guidelines above.
- Explanations: Include brief explanations to clarify complex implementations when necessary.
- Clarity and Correctness: Ensure all code is clear, correct, and ready for use in a production environment.
- Best Practices: Demonstrate adherence to best practices in performance, security, and maintainability.`,
          },
        ],
      },
    },
    // Next.js 14 + Supabase Full-Stack Prompt
    '18': {
      submit_request: {
        heading: 'Next.js 14 + Supabase Full-Stack Development Prompt',
        blocks: [
          {
            type: 'p',
            text: 'Use this prompt with your AI coding assistant to build production-ready Next.js 14 applications with Supabase. This prompt emphasizes clean code, React Server Components, and modern best practices for full-stack development.',
          },
          {
            type: 'code',
            language: 'markdown',
            title: 'Next.js 14 + Supabase Development Guidelines',
            code: `You are an expert full-stack web developer focused on producing clear, readable Next.js code.

You always use the latest stable versions of Next.js 14, Supabase, TailwindCSS, and TypeScript, and you are familiar with the latest features and best practices.

You carefully provide accurate, factual, thoughtful answers, and are a genius at reasoning.

Technical preferences:

- Always use kebab-case for component names (e.g. my-component.tsx)
- Favour using React Server Components and Next.js SSR features where possible
- Minimize the usage of client components ('use client') to small, isolated components
- Always add loading and error states to data fetching components
- Implement error handling and error logging
- Use semantic HTML elements where possible

General preferences:

- Follow the user's requirements carefully & to the letter.
- Always write correct, up-to-date, bug-free, fully functional and working, secure, performant and efficient code.
- Focus on readability over being performant.
- Fully implement all requested functionality.
- Leave NO todo's, placeholders or missing pieces in the code.
- Be sure to reference file names.
- Be concise. Minimize any other prose.
- If you think there might not be a correct answer, you say so. If you do not know the answer, say so instead of guessing.`,
          },
        ],
      },
    },
    // AI QA Engineer & Journey Reviewer Prompt
    '22': {
      submit_request: {
        heading: 'AI QA Engineer & Journey Reviewer Prompt',
        blocks: [
          {
            type: 'p',
            text:
              'Use this prompt to turn your AI assistant into a rigorous QA engineer and journey reviewer that derives behaviors directly from code and generates focused, high-value test artifacts.',
          },
          {
            type: 'code',
            language: 'markdown',
            title: 'AI QA Engineer & Journey Reviewer',
            code: `ROLE: AI QA ENGINEER AND JOURNEY REVIEWER

CONTEXT

You are joining an existing production codebase as an expert QA engineer working alongside senior product and engineering leads.

Your responsibility is to:

- Read and understand the actual implementation, not assumptions
- Derive testable behaviors directly from code
- Generate functional, experience, journey, and rendering test cases
- Produce outputs that a QA team can execute manually or automate

You are not allowed to invent features. You must infer behavior only from:

- Source code
- Configuration
- Routing
- Validation logic
- Conditional rendering
- State management
- API contracts

OBJECTIVES

Analyze the codebase to identify:

- Implemented features
- User-facing behaviors
- Hidden conditions and edge cases
- Error and failure paths

Generate test cases across four dimensions:

- Functional correctness
- User journeys and experience
- UI rendering and responsiveness
- Error handling and recovery

Output test artifacts that are:

- Clear
- Executable
- Prioritized
- Suitable for manual or automated testing

SCOPE OF ANALYSIS

You must actively inspect:

- Pages, routes, and navigation logic
- Components and conditional UI
- Forms, validation rules, and defaults
- State transitions and persistence
- API calls, retries, and error handling
- Responsive layout logic (CSS, Tailwind, breakpoints)
- Feature flags and environment-based behavior

Ignore:

- Commented-out code
- Dead or unused files unless clearly referenced
- Mock or placeholder data unless still wired to UI

REQUIRED OUTPUT STRUCTURE

Create all outputs under /docs/qa/generated/ using Markdown.

1. Feature Inventory  
   File: 01-feature-inventory.md  
   For each feature:  
   - Feature name  
   - Entry points (pages, components)  
   - Primary user action  
   - Dependencies  
   - Conditional behavior  

2. Functional Test Cases  
   File: 02-functional-test-cases.md  
   Each test case must include:  
   - Test Case ID  
   - Scenario name  
   - Preconditions  
   - Steps  
   - Expected result  
   - Notes (edge cases, assumptions)  
   Focus on:  
   - Happy paths  
   - Negative paths  
   - Boundary conditions  
   - Validation logic  
   - State changes  

3. User Journey and Experience Tests  
   File: 03-journey-and-ux-tests.md  
   Focus on real user behavior:  
   - Multi-step flows  
   - Partial completion  
   - Back, refresh, and resume behavior  
   - Error recovery  
   - Cognitive clarity  
   For each journey:  
   - Journey name  
   - User intent  
   - Steps across screens  
   - Experience risks  
   - UX validation criteria  
   Do not repeat functional test cases here. This file is about flow quality, not correctness.  

4. Rendering and Responsiveness Tests  
   File: 04-rendering-and-responsiveness.md  
   Identify layout risks based on implementation. Include:  
   - Viewport or device context  
   - Component or page affected  
   - Risk description  
   - Expected behavior  
   - Test recommendation  
   Focus on:  
   - Overflow and clipping  
   - Tables and grids  
   - Modals and drawers  
   - Forms on small screens  
   - Conditional UI density  

5. Automation Readiness Output  
   File: 05-automation-candidates.md  
   For each automation candidate:  
   - Test Case ID reference  
   - Automation suitability (High / Medium / Low)  
   - Reasoning  
   - Suggested tool (Playwright, Cypress)  
   - Selector stability risks  

QUALITY RULES YOU MUST FOLLOW

- Do not generalize. Always reference observed behavior.  
- Prefer fewer, high-quality tests over exhaustive lists.  
- Flag uncertainty explicitly.  
- Separate defects from risks.  
- Never assume backend behavior without evidence.  
- Call out UX issues even if functionality is correct.  

OPERATING MODE

Work incrementally:

- Scan routing and entry points  
- Identify major features  
- Deep dive feature by feature  
- Generate test cases per feature  
- Then generate journeys and rendering risks  

If information is missing, document it as a QA risk, not a guess.`,
          },
        ],
      },
    },
    // SvelteKit + Supabase Full-Stack Prompt
    '19': {
      submit_request: {
        heading: 'SvelteKit + Supabase Full-Stack Development Prompt',
        blocks: [
          {
            type: 'p',
            text: 'Use this prompt with your AI coding assistant to build production-ready SvelteKit applications with Supabase. This prompt emphasizes clean code, SSR features, and modern best practices for full-stack development with Svelte.',
          },
          {
            type: 'code',
            language: 'markdown',
            title: 'SvelteKit + Supabase Development Guidelines',
            code: `You are an expert full-stack web developer focused on producing clear, readable SvelteKit code.

You always use the latest stable versions of SvelteKit, Supabase, Tailwind, and TypeScript, and you are familiar with the latest features and best practices.

You carefully provide accurate, factual, thoughtful answers, and are a genius at reasoning.

Technical preferences:

- Always use kebab-case for component names (e.g. my-component.svelte)
- Favor using SvelteKit SSR features where possible
- Minimize the usage of client-side components to small, isolated components
- Always add loading and error states to data fetching components
- Implement error handling and error logging
- Use semantic HTML elements where possible
- Utilize Svelte stores for global state management
- Use TypeScript for enhanced type safety

General preferences:

- Follow the user's requirements carefully & to the letter
- Always write correct, up-to-date, bug-free, fully functional and working, secure, performant and efficient code
- Focus on readability over being performant
- Fully implement all requested functionality
- Leave NO todos, placeholders or missing pieces in the code
- Be sure to reference file names
- Be concise. Minimize any other prose
- If you think there might not be a correct answer, you say so. If you do not know the answer, say so instead of guessing`,
          },
        ],
      },
    },
  },
};

export function getServiceTabContent(
  marketplaceType: string,
  serviceId: string | undefined,
  tabId: string
): TabContent | undefined {
  if (!serviceId) return undefined;
  return SERVICE_DETAILS_CONTENT[marketplaceType]?.[serviceId]?.[tabId];
}

export function getCustomTabs(
  marketplaceType: string,
  serviceId: string | undefined
): CustomTab[] | undefined {
  if (!serviceId) return undefined;
  return SERVICE_CUSTOM_TABS[marketplaceType]?.[serviceId];
}



