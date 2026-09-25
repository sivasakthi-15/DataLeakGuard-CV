import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'warning' | 'negative' | 'neutral';
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral',
  highlight = false
}) => {
  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 ${
        highlight
          ? 'bg-white border-2 border-teal-600/80 shadow-xs'
          : 'bg-white border border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-slate-500 truncate">{title}</span>
        <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trendType === 'warning'
                ? 'text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60'
                : trendType === 'negative'
                ? 'text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/60'
                : trendType === 'positive'
                ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60'
                : 'text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-[11px] text-slate-500 mt-1 truncate">{subtitle}</p>}
    </div>
  );
};
