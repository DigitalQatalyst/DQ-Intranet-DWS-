import { ProcedureStages, annualLeaveStages, procedureStagesConfigs } from './index';
import type { ProcedureStagesConfig } from './ProcedureStages.types';

/**
 * Example 1: Using a predefined config
 */
export function AnnualLeaveExample() {
  return (
    <div className="p-8">
      <ProcedureStages config={annualLeaveStages} />
    </div>
  );
}

/**
 * Example 2: Using the config map
 */
export function OnboardingExample() {
  return (
    <div className="p-8">
      <ProcedureStages config={procedureStagesConfigs.onboarding} />
    </div>
  );
}

/**
 * Example 3: Creating a custom config inline
 */
export function CustomProcedureExample() {
  const customConfig: ProcedureStagesConfig = {
    title: 'Custom Procedure',
    stages: [
      {
        stageNumber: 'STAGE 01',
        stageTitle: 'PLANNING',
        items: [
          { text: 'Define objectives' },
          { text: 'Gather requirements' },
          { text: 'Create timeline' },
        ],
      },
      {
        stageNumber: 'STAGE 02',
        stageTitle: 'IMPLEMENTATION',
        items: [
          { text: 'Execute plan' },
          { text: 'Monitor progress' },
        ],
      },
    ],
  };

  return (
    <div className="p-8">
      <ProcedureStages config={customConfig} />
    </div>
  );
}

/**
 * Example 4: Without a title
 */
export function NoTitleExample() {
  const configWithoutTitle: ProcedureStagesConfig = {
    title: '',
    stages: [
      {
        stageNumber: 'STEP 1',
        stageTitle: 'First Step',
        items: [{ text: 'Do something' }],
      },
      {
        stageNumber: 'STEP 2',
        stageTitle: 'Second Step',
        items: [{ text: 'Do something else' }],
      },
    ],
  };

  return (
    <div className="p-8">
      <ProcedureStages config={configWithoutTitle} />
    </div>
  );
}

