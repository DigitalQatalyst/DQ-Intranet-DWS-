export interface PerformanceStyle {
  pillClass: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
}

export function getPerformanceStyle(status?: string | null): PerformanceStyle {
  if (!status) {
    return {
      pillClass: 'bg-slate-100 text-slate-700 border-slate-200',
      borderClass: 'border-slate-200',
      bgClass: 'bg-slate-50',
      textClass: 'text-slate-700',
    };
  }

  const normalized = status.toLowerCase();

  if (normalized === 'leading' || normalized === 'on track' || normalized === 'on_track') {
    return {
      pillClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderClass: 'border-emerald-200',
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-700',
    };
  }

  if (normalized === 'at risk' || normalized === 'at_risk') {
    return {
      pillClass: 'bg-rose-50 text-rose-700 border-rose-200',
      borderClass: 'border-rose-200',
      bgClass: 'bg-rose-50',
      textClass: 'text-rose-700',
    };
  }

  if (normalized === 'off track' || normalized === 'off_track') {
    return {
      pillClass: 'bg-amber-50 text-amber-700 border-amber-200',
      borderClass: 'border-amber-200',
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-700',
    };
  }

  // Default
  return {
    pillClass: 'bg-slate-100 text-slate-700 border-slate-200',
    borderClass: 'border-slate-200',
    bgClass: 'bg-slate-50',
    textClass: 'text-slate-700',
  };
}

