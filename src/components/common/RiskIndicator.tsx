import React from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, Info } from 'lucide-react';

interface RiskIndicatorProps {
  status?: string;
  confidence?: number;
  riskScore?: number; // 0 to 100
  riskLevel?: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  className?: string;
  showDetails?: boolean;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  status = 'REVIEW REQUIRED',
  confidence = 91,
  riskScore = 84,
  riskLevel = 'HIGH',
  className = '',
  showDetails = true
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return {
          bg: 'bg-rose-50/80',
          border: 'border-rose-200',
          text: 'text-rose-700',
          gauge: 'bg-rose-600',
          badgeBg: 'bg-rose-100 border-rose-300 text-rose-800'
        };
      case 'ELEVATED':
      case 'MODERATE':
        return {
          bg: 'bg-amber-50/80',
          border: 'border-amber-200',
          text: 'text-amber-700',
          gauge: 'bg-amber-600',
          badgeBg: 'bg-amber-100 border-amber-300 text-amber-800'
        };
      default:
        return {
          bg: 'bg-emerald-50/80',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          gauge: 'bg-emerald-600',
          badgeBg: 'bg-emerald-100 border-emerald-300 text-emerald-800'
        };
    }
  };

  const colors = getRiskColor(riskLevel);

  return (
    <div className={`rounded-xl border ${colors.bg} ${colors.border} p-5 ${className} shadow-xs`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pipeline Assurance Status
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-mono shadow-2xs">
              Project-defined risk assessment
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-mono">
              {riskLevel === 'HIGH' || riskLevel === 'CRITICAL' ? (
                <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
              ) : riskLevel === 'MODERATE' || riskLevel === 'ELEVATED' ? (
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              )}
              {status}
            </h3>
            <span className={`text-xs px-2.5 py-1 rounded-md font-mono font-bold border ${colors.badgeBg}`}>
              RISK: {riskLevel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 self-start md:self-auto">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Assurance Confidence</span>
            <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">{confidence}%</span>
          </div>

          <div className="w-32">
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mb-1">
              <span>Risk Metric</span>
              <span className="tabular-nums font-semibold text-slate-900">{riskScore}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${colors.gauge}`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-start gap-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Integrity checks identified cross-boundary duplicates and data leakage patterns. 
            Estimated evaluation inflation requires quarantined re-evaluation prior to operational deployment.
            Scores are evaluated strictly under configured test algorithms and do not represent an official regulatory standard.
          </p>
        </div>
      )}
    </div>
  );
};
