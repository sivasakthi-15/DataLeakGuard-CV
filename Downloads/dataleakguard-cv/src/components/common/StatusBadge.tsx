import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Clock, ShieldCheck, ShieldAlert, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  const s = status.toLowerCase();
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  const iconSize = isSm ? 'w-3 h-3' : 'w-3.5 h-3.5';

  if (s.includes('clean') || s === 'verified' || s === 'completed' || s === 'nominal' || s === 'accept') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses} ${className}`}>
        <CheckCircle2 className={`${iconSize} shrink-0 text-emerald-600`} />
        <span>{status}</span>
      </span>
    );
  }

  if (s.includes('review') || s.includes('moderate') || s.includes('potential')) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses} ${className}`}>
        <AlertTriangle className={`${iconSize} shrink-0 text-amber-600`} />
        <span>{status}</span>
      </span>
    );
  }

  if (s.includes('issue') || s === 'tampered' || s === 'changed' || s.includes('fail') || s === 'quarantine' || s.includes('shift detected')) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-rose-50 text-rose-800 border border-rose-200 ${sizeClasses} ${className}`}>
        <AlertCircle className={`${iconSize} shrink-0 text-rose-600`} />
        <span>{status}</span>
      </span>
    );
  }

  if (s.includes('process') || s.includes('running') || s.includes('pending')) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-teal-50 text-teal-800 border border-teal-200 ${sizeClasses} ${className}`}>
        <Clock className={`${iconSize} shrink-0 text-teal-600 animate-spin`} />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses} ${className}`}>
      <HelpCircle className={`${iconSize} shrink-0 text-slate-500`} />
      <span>{status}</span>
    </span>
  );
};
