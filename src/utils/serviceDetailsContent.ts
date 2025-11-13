export type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'ol'; items: string[] }
  | { type: 'ul'; items: string[] };

export interface TabContent {
  heading?: string;
  blocks: ContentBlock[];
  action?: {
    label: string;
    // Which field from the item to open if present (e.g., requestUrl or formUrl)
    urlField?: 'requestUrl' | 'formUrl';
    fallbackUrl?: string;
  };
}

// Content store keyed by marketplace type -> service id -> tab id
const SERVICE_DETAILS_CONTENT: Record<
  string,
  Record<string, Record<string, TabContent>>
> = {
  'non-financial': {
    // IT Support Form
    '1': {
      submit_request: {
        heading: 'Submit Request',
        blocks: [
       
          {
            type: 'p',
            text:
              'This tab is where you log new support requests. Click the “Submit Request” button to open the support form. Note: currently this form opens in a new window (hosted externally); we plan to embed it directly on this page in the future for convenience.',
          },
          { type: 'p', text: 'Steps to submit a ticket:' },
          {
            type: 'ol',
            items: [
              'Open the request form: Click the Submit Request button to launch the support form.',
              'Select a category: Choose the most relevant category for your issue (e.g. Hardware, Software, Network) so that your request reaches the right IT team.',
              'Describe the issue: Enter a clear summary and detailed description. Include error messages, impacted accounts, and attach screenshots or log files if possible.',
              'Set urgency: Indicate the priority or urgency level (e.g. High/Urgent for critical outages, or Normal for routine problems).',
              'Submit the form: Review your entries and click Submit. You will receive an email confirmation with a ticket number.',
            ],
          },
          {
            type: 'p',
            text:
              'After submission, the IT team will acknowledge receipt of your request and follow up with any questions or updates. Providing clear, detailed information (including screenshots and category selection) will speed up resolution.',
          },
        ],
        action: {
          label: 'Request Service',
          urlField: 'requestUrl',
          fallbackUrl: 'https://forms.office.com/pages/responsepage.aspx?id=Db2eGYYpPU-GWUOIxbKnJCT2lmSqJbRJkPMD7v6Rk31UNjlVQjlRSjFBUk5MSTNGUDJNTjk0S1NMVi4u&route=shorturl'
        },
      },
      self_service_faq: {
        heading: 'Self-Service & FAQs',
        blocks: [
          {
            type: 'p',
            text:
              'Purpose: Offer troubleshooting tips, common fixes, and resources so you can often resolve issues without submitting a ticket.',
          },
          {
            type: 'p',
            text:
              'Before submitting a ticket, you may find answers to common problems through our self-help resources. Here are quick tips for frequent issues:',
          },
          {
            type: 'ul',
            items: [
              'Account and Password Issues: Confirm correct DQ credentials. If locked out or forgot your password, use the reset tool or contact IT. Verify your DQ account is active.',
              'Network & Connectivity: Check cables/Wi‑Fi, restart your device, ensure VPN is connected for off‑site access, and check for broader outages.',
              'Software Errors or Crashes: Restart the application and your computer, ensure updates are installed, and if needed reinstall or try another device.',
              'Hardware & Peripherals: Verify power and connections; check drivers. For printers/scanners, check paper/ink and network settings.',
              'Microsoft Teams and Email: Sign out/in, try the web version, check Office 365 service status, and ensure your license is active.',
              'General Tips: A quick restart often resolves minor glitches. Consider whether a recent update/installation changed behavior.',
            ],
          },
          {
            type: 'p',
            text:
              'If these steps don’t resolve your issue, use the Submit Request tab to contact IT and include what you’ve already tried.',
          },
        ],
      },
      contact_sla: {
        heading: 'Contact & SLAs',
        blocks: [
          {
            type: 'p',
            text:
              'Purpose: Provide support contact methods, hours of operation, and expected response times (SLAs).',
          },
          {
            type: 'p',
            text:
              'Support Hours: Monday–Friday, 9:00 AM to 5:00 PM (DQ business days). Outside these hours, responses may be delayed unless the issue is critical.',
          },
          {
            type: 'ul',
            items: [
              'Ticket/Email (Preferred): Submit a request via the form or email it-support@dq.com for non‑urgent issues.',
              'Phone/Chat (Urgent): For emergencies, call (123) 456‑7890 or message the IT Support group in Microsoft Teams.',
            ],
          },
          {
            type: 'ul',
            items: [
              'Acknowledgment: Ticket acknowledgment typically within minutes.',
              'First Response: For routine issues, initial response within about one business day (often within an hour).',
              'Resolution Time: Varies based on complexity; we’ll keep you updated and prioritize high‑priority issues.',
              'Escalation: Tickets requiring specialist/higher‑level support are escalated appropriately.',
            ],
          },
          {
            type: 'p',
            text:
              'Scope & Eligibility: Support covers DQ‑managed systems for DQ associates. Personal devices or external services are not supported. Please use your DQ login or email when contacting support.',
          },
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
        heading: 'Use the Support Charter Template',
        blocks: [
          {
            type: 'p',
            text:
              'Purpose: Provide a clear, standardized support charter outlining scope, responsibilities, and expectations.',
          },
          {
            type: 'ol',
            items: [
              'Download the template from the Resources section or request it from IT Admin if needed.',
              'Fill out scope, roles/responsibilities, service hours, escalation paths, and SLAs.',
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
        action: {
          label: 'Request Service',
          urlField: 'templateUrl',
          fallbackUrl: '#',
        },
      },
      self_service_faq: {
        heading: 'Guidance & FAQs',
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
        heading: 'Contacts & Review',
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
        heading: 'Follow the Walkthrough',
        blocks: [
          {
            type: 'p',
            text:
              'Purpose: Quickly learn how to submit an IT support ticket correctly using a short walkthrough.',
          },
          {
            type: 'ol',
            items: [
              'Open the walkthrough and watch the steps end‑to‑end.',
              'Gather details: issue summary, steps to reproduce, error messages, attachments.',
              'Open the Submit Request tab and follow the same steps to log your ticket.',
            ],
          },
        ],
        action: {
          label: 'Request Service',
          urlField: 'videoUrl',
          fallbackUrl: '#',
        },
      },
      self_service_faq: {
        heading: 'Common Issues to Try First',
        blocks: [
          {
            type: 'ul',
            items: [
              'Restart the app/device and try again.',
              'Check VPN/Network and sign back into Microsoft 365.',
              'Update to the latest version of the affected software.',
            ],
          },
        ],
      },
      contact_sla: {
        heading: 'Support & Response',
        blocks: [
          { type: 'p', text: 'Standard hours: Mon–Fri, 9:00–17:00. For urgent outages, call the IT line.' },
        ],
      },
      required_documents: {
        heading: 'Required Documents',
        blocks: [{ type: 'p', text: 'No required documents.' }],
      },
    },
    // Bookings
    '4': {
      submit_request: {
        heading: 'Submit a Booking',
        blocks: [
          {
            type: 'p',
            text:
              'Purpose: Request rooms, equipment, or services through Admin/Operations.',
          },
          {
            type: 'ol',
            items: [
              'Open the booking form and choose the required category (room, equipment, logistics).',
              'Provide dates, times, attendees, and any special requirements.',
              'Submit and await confirmation/clarifications from Admin.',
            ],
          },
        ],
        action: { label: 'Request Service', urlField: 'requestUrl', fallbackUrl: '#' },
      },
      self_service_faq: {
        heading: 'Booking Tips',
        blocks: [
          {
            type: 'ul',
            items: [
              'Book early for larger events to secure preferred rooms.',
              'Include setup/teardown time in your request.',
            ],
          },
        ],
      },
      contact_sla: { heading: 'Contacts & SLAs', blocks: [{ type: 'p', text: 'Admin responds within 1 business day.' }] },
      required_documents: { heading: 'Required Documents', blocks: [{ type: 'p', text: 'No required documents.' }] },
    },
    // Staff Requisition
    '5': {
      submit_request: {
        heading: 'Request Staff',
        blocks: [
          { type: 'p', text: 'Purpose: Request staff allocation or temporary support for an activity/project.' },
          {
            type: 'ol',
            items: [
              'Open the staff requisition form.',
              'Specify role, duration, skills needed, and cost center (if applicable).',
              'Submit and await HR/Admin acknowledgment.',
            ],
          },
        ],
        action: { label: 'Request Service', urlField: 'requestUrl', fallbackUrl: '#' },
      },
      self_service_faq: {
        heading: 'Guidance',
        blocks: [{ type: 'p', text: 'Ensure you have approvals/budget alignment before submitting the requisition.' }],
      },
      contact_sla: { heading: 'Contacts & SLAs', blocks: [{ type: 'p', text: 'Initial response typically within one business day.' }] },
      required_documents: { heading: 'Required Documents', blocks: [{ type: 'p', text: 'No required documents.' }] },
    },
    // Registration
    '6': {
      submit_request: {
        heading: 'Submit a Registration',
        blocks: [
          { type: 'p', text: 'Purpose: Register for programs, platforms, or events managed by Admin/Operations.' },
          {
            type: 'ol',
            items: [
              'Open the registration form and select the registration type.',
              'Fill participant details and any required identifiers.',
              'Submit and watch for confirmation details or next steps.',
            ],
          },
        ],
        action: { label: 'Request Service', urlField: 'requestUrl', fallbackUrl: '#' },
      },
      self_service_faq: { heading: 'FAQs', blocks: [{ type: 'p', text: 'Registrations may close when capacity is reached—apply early.' }] },
      contact_sla: { heading: 'Contacts & SLAs', blocks: [{ type: 'p', text: 'Response typically within one business day.' }] },
      required_documents: { heading: 'Required Documents', blocks: [{ type: 'p', text: 'No required documents.' }] },
    },
    // DTMP (Digital Template / Process)
    '7': {
      submit_request: {
        heading: 'Start DTMP',
        blocks: [
          { type: 'p', text: 'Purpose: Initiate a Digital Template/Process request for your team.' },
          {
            type: 'ol',
            items: [
              'Open the DTMP request form.',
              'Describe the process/template required and its intended use.',
              'Attach any examples or existing materials for reference.',
            ],
          },
        ],
        action: { label: 'Request Service', urlField: 'requestUrl', fallbackUrl: '#' },
      },
      self_service_faq: { heading: 'Resources', blocks: [{ type: 'p', text: 'Check if there is an existing DTMP you can reuse.' }] },
      contact_sla: { heading: 'Contacts & SLAs', blocks: [{ type: 'p', text: 'We aim to respond within one business day.' }] },
      required_documents: { heading: 'Required Documents', blocks: [{ type: 'p', text: 'No required documents.' }] },
    },
    // Governance
    '8': {
      submit_request: {
        heading: 'Request Governance Review',
        blocks: [
          { type: 'p', text: 'Purpose: Request a governance or policy review for a process or document.' },
          { type: 'ol', items: ['Open the governance request form.', 'Attach current policy/process.', 'Submit for review.'] },
        ],
        action: { label: 'Request Service', urlField: 'requestUrl', fallbackUrl: '#' },
      },
      self_service_faq: {
        heading: 'Guidelines',
        blocks: [{ type: 'p', text: 'Ensure you are using the latest templates and reference policies before requesting changes.' }],
      },
      contact_sla: { heading: 'Contacts & SLAs', blocks: [{ type: 'p', text: 'Review timeline depends on scope; acknowledgments within one business day.' }] },
      required_documents: { heading: 'Required Documents', blocks: [{ type: 'p', text: 'No required documents.' }] },
    },
    // Proposal
    '9': {
      submit_request: {
        heading: 'Submit Proposal',
        blocks: [
          { type: 'p', text: 'Purpose: Submit a proposal for review and approval.' },
          {
            type: 'ol',
            items: [
              'Open the proposal submission form.',
              'Provide summary, objectives, scope, timeline, and budget (if applicable).',
              'Attach draft proposal or slide deck.',
            ],
          },
        ],
        action: { label: 'Request Service', urlField: 'requestUrl', fallbackUrl: '#' },
      },
      self_service_faq: {
        heading: 'Templates & Tips',
        blocks: [
          { type: 'p', text: 'Use the latest proposal template to speed up approvals.' },
          { type: 'ul', items: ['Be concise', 'Highlight business impact', 'Outline measurable outcomes'] },
        ],
      },
      contact_sla: { heading: 'Contacts & SLAs', blocks: [{ type: 'p', text: 'Initial review typically within two business days.' }] },
      required_documents: { heading: 'Required Documents', blocks: [{ type: 'p', text: 'No required documents.' }] },
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


