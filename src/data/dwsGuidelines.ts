export type DWSGuideline = {
  id: string;
  title: string;
  summary: string;
};

/** Curated guideline highlights from the DQ Knowledge Center → Guidelines tab. */
export const DWS_GUIDELINES: DWSGuideline[] = [
  {
    id: 'dq-leave-process-guideline',
    title: 'DQ Leave Process Guidelines',
    summary: 'Steps, approvals, HR notifications, and coverage requirements for leave requests.',
  },
  {
    id: 'shifts-allocation-guidelines',
    title: 'Shifts Allocation Guidelines',
    summary: 'Fair, transparent rules for allocating and scheduling shifts across teams.',
  },
  {
    id: 'po-dev-sync-guidelines',
    title: 'Product Owner & Dev Sync Guidelines',
    summary: 'Cadence, agenda, and decision protocol for PO–Dev syncs to keep delivery aligned.',
  },
  {
    id: 'azure-devops-task-guidelines',
    title: 'Azure DevOps Task Guidelines',
    summary: 'ADO task naming, states, and flow so teams ship with less friction.',
  },
  {
    id: 'dq-wfh-guidelines',
    title: 'DQ WFH Guidelines',
    summary: 'Request/approval workflow, daily visibility, and compliance for working from home.',
  },
  {
    id: 'dq-dress-code-guideline',
    title: 'DQ Dress Code Guidelines',
    summary: 'Professional appearance expectations, exceptions, and consequences.',
  },
];
