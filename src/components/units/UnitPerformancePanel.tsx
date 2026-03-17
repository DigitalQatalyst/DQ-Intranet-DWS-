import React from 'react';

interface UnitPerformancePanelProps {
  status: 'leading' | 'on_track' | 'at_risk' | 'off_track';
  score: number;
  lastUpdated?: string | null;
  helperText?: string;
  showTitle?: boolean;
}

export function UnitPerformancePanel({
  status,
  score,
  lastUpdated,
  helperText,
  showTitle = true,
}: UnitPerformancePanelProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'leading':
        return {
          label: 'Leading',
          colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          bgClass: 'bg-emerald-50',
          textClass: 'text-emerald-700',
        };
      case 'on_track':
        return {
          label: 'On Track',
          colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          bgClass: 'bg-emerald-50',
          textClass: 'text-emerald-700',
        };
      case 'at_risk':
        return {
          label: 'At Risk',
          colorClass: 'bg-rose-50 text-rose-700 border-rose-200',
          bgClass: 'bg-rose-50',
          textClass: 'text-rose-700',
        };
      case 'off_track':
        return {
          label: 'Off Track',
          colorClass: 'bg-amber-50 text-amber-700 border-amber-200',
          bgClass: 'bg-amber-50',
          textClass: 'text-amber-700',
        };
      default:
        return {
          label: 'Unknown',
          colorClass: 'bg-slate-100 text-slate-700 border-slate-200',
          bgClass: 'bg-slate-50',
          textClass: 'text-slate-700',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="space-y-3">
      {showTitle && (
        <h3 className="text-lg font-semibold text-slate-900">Unit Performance</h3>
      )}
      <div className={`rounded-lg border p-4 ${statusConfig.bgClass} ${statusConfig.borderClass}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${statusConfig.colorClass}`}>
            <span className="h-2 w-2 rounded-full bg-current" />
            <span className="font-medium">{statusConfig.label}</span>
            {score > 0 && <span className="text-slate-400">{score} / 100</span>}
          </span>
        </div>
        {lastUpdated && (
          <p className="text-xs text-slate-500 mt-2">Last updated: {lastUpdated}</p>
        )}
        {helperText && (
          <p className="text-xs text-slate-600 mt-2">{helperText}</p>
        )}
      </div>
    </div>
  );
}

