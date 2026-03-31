# ProcedureStages Component

A reusable component for displaying multi-stage procedures with a vertical timeline design.

## Features

- **Configurable stages**: Define any number of stages with custom titles and items
- **Pre-built configs**: Includes common use cases (annual leave, onboarding, project approval)
- **Responsive design**: Works on all screen sizes
- **DQ brand styling**: Uses project color scheme and typography
- **TypeScript support**: Fully typed for better developer experience

## Usage

### Using a predefined config

```tsx
import { ProcedureStages, annualLeaveStages } from '@/components/ProcedureStages';

function MyComponent() {
  return <ProcedureStages config={annualLeaveStages} />;
}
```

### Using the config map

```tsx
import { ProcedureStages, procedureStagesConfigs } from '@/components/ProcedureStages';

function MyComponent() {
  return <ProcedureStages config={procedureStagesConfigs.onboarding} />;
}
```

### Creating a custom config

```tsx
import { ProcedureStages } from '@/components/ProcedureStages';
import type { ProcedureStagesConfig } from '@/components/ProcedureStages';

function MyComponent() {
  const customConfig: ProcedureStagesConfig = {
    title: 'My Custom Procedure',
    stages: [
      {
        stageNumber: 'STAGE 01',
        stageTitle: 'FIRST STAGE',
        items: [
          { text: 'First task' },
          { text: 'Second task' },
        ],
      },
      {
        stageNumber: 'STAGE 02',
        stageTitle: 'SECOND STAGE',
        items: [
          { text: 'Another task' },
        ],
      },
    ],
  };

  return <ProcedureStages config={customConfig} />;
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `config` | `ProcedureStagesConfig` | Yes | - | The configuration object defining stages and content |
| `className` | `string` | No | `''` | Additional CSS classes to apply to the container |

## Config Structure

```typescript
interface ProcedureStagesConfig {
  title: string;           // Main title (can be empty string to hide)
  stages: Stage[];         // Array of stages
}

interface Stage {
  stageNumber: string;     // e.g., "STAGE 01", "STEP 1"
  stageTitle: string;      // e.g., "4 WEEKS PRIOR"
  items: StageItem[];      // Array of items for this stage
}

interface StageItem {
  text: string;            // The item text
}
```

## Predefined Configs

### Annual Leave
```tsx
import { annualLeaveStages } from '@/components/ProcedureStages';
```
3 stages covering the annual leave approval process (4 weeks, 2 weeks, 1 week prior).

### Onboarding
```tsx
import { onboardingStages } from '@/components/ProcedureStages';
```
3 stages covering employee onboarding (pre-arrival, first day, first week).

### Project Approval
```tsx
import { projectApprovalStages } from '@/components/ProcedureStages';
```
3 stages covering project approval process (initiation, review, execution).

## Styling

The component uses TailwindCSS and the DQ brand colors:
- **Primary color**: For stage number circles
- **DQ Orange**: For item bullets
- **DQ Navy**: For text headings
- **White background**: For stage cards with subtle shadows

## Adding New Predefined Configs

To add a new predefined config, edit `procedureStagesConfigs.ts`:

```typescript
export const myNewStages: ProcedureStagesConfig = {
  title: 'My New Procedure',
  stages: [
    // ... define your stages
  ],
};

// Add to the export map
export const procedureStagesConfigs = {
  annualLeave: annualLeaveStages,
  onboarding: onboardingStages,
  projectApproval: projectApprovalStages,
  myNew: myNewStages, // Add here
};
```

## Examples

See `ProcedureStages.example.tsx` for complete usage examples.

