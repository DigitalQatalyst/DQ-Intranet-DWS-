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
          label: 'Submit Request',
          urlField: 'requestUrl',
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


