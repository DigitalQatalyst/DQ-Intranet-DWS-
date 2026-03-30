export interface StageItem {
  text: string;
}

export interface Stage {
  stageNumber?: string;
  stageTitle: string;
  items: StageItem[];
}

export interface ProcedureStagesConfig {
  title: string;
  stages: Stage[];
}

export interface ProcedureStagesProps {
  config: ProcedureStagesConfig;
  className?: string;
}

