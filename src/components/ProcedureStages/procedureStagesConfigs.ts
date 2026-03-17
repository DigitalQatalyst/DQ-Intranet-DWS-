import type { ProcedureStagesConfig } from './ProcedureStages.types';

export const annualLeaveStages: ProcedureStagesConfig = {
  title: 'Annual Leave Procedure',
  stages: [
    {
      stageTitle: '4 WEEKS PRIOR',
      items: [
        { text: 'Confirm leave eligibility' },
        { text: 'Confirm departmental capacity' },
        { text: 'Fill the leave request form by clicking the "Apply For Leave" button' },
        { text: 'Update on HR Channel' },
      ],
    },
    {
      stageTitle: '2 WEEKS PRIOR',
      items: [
        { text: 'Notify senior management' },
        { text: 'Update handover catalog' },
        { text: 'Capture sign-off' },
      ],
    },
    {
      stageTitle: '1 WEEK PRIOR',
      items: [
        { text: 'Publish handover catalog' },
        { text: 'Update Leave and HR channel' },
        { text: 'Setup "Out-of-Office" reply' },
      ],
    },
  ],
};

export const onboardingStages: ProcedureStagesConfig = {
  title: 'Employee Onboarding',
  stages: [
    {
      stageNumber: 'STAGE 01',
      stageTitle: 'PRE-ARRIVAL',
      items: [
        { text: 'Send welcome email' },
        { text: 'Prepare workstation' },
        { text: 'Setup IT accounts' },
        { text: 'Prepare onboarding materials' },
      ],
    },
    {
      stageNumber: 'STAGE 02',
      stageTitle: 'FIRST DAY',
      items: [
        { text: 'Welcome and orientation' },
        { text: 'Issue equipment' },
        { text: 'Complete HR documentation' },
        { text: 'Introduction to team' },
      ],
    },
    {
      stageNumber: 'STAGE 03',
      stageTitle: 'FIRST WEEK',
      items: [
        { text: 'Training sessions' },
        { text: 'Schedule 1-on-1 meetings' },
        { text: 'Assign first tasks' },
        { text: 'Check-in and feedback' },
      ],
    },
  ],
};

export const projectApprovalStages: ProcedureStagesConfig = {
  title: 'Project Approval Process',
  stages: [
    {
      stageNumber: 'STAGE 01',
      stageTitle: 'INITIATION',
      items: [
        { text: 'Submit project proposal' },
        { text: 'Define scope and objectives' },
        { text: 'Estimate resources and budget' },
      ],
    },
    {
      stageNumber: 'STAGE 02',
      stageTitle: 'REVIEW',
      items: [
        { text: 'Department head review' },
        { text: 'Budget approval' },
        { text: 'Stakeholder sign-off' },
      ],
    },
    {
      stageNumber: 'STAGE 03',
      stageTitle: 'EXECUTION',
      items: [
        { text: 'Kickoff meeting' },
        { text: 'Assign team members' },
        { text: 'Setup project tracking' },
      ],
    },
  ],
};

// Export all configs in a map for easy access
export const procedureStagesConfigs = {
  annualLeave: annualLeaveStages,
  onboarding: onboardingStages,
  projectApproval: projectApprovalStages,
};

