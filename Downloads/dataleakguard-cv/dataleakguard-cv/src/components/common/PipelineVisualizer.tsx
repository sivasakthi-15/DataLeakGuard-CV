import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, ShieldCheck, Cpu, KeyRound, GitCompare, FileText, ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface StageInfo {
  id: string;
  name: string;
  route: string;
  icon: React.ElementType;
  status: string;
  findingsCount: number;
  description: string;
}

export const PipelineVisualizer: React.FC = () => {
  const navigate = useNavigate();

  const stages: StageInfo[] = [
    {
      id: 'dataset',
      name: 'Dataset Ingestion',
      route: '/datasets',
      icon: Database,
      status: 'Clean',
      findingsCount: 0,
      description: 'Format, schemas & profiles'
    },
    {
      id: 'data-integrity',
      name: 'Data Integrity & Leakage',
      route: '/leakage-analysis/ds-adult-income',
      icon: ShieldCheck,
      status: 'Issues Found',
      findingsCount: 214,
      description: 'Duplicates, target & entity leakage'
    },
    {
      id: 'model-integrity',
      name: 'Model Integrity',
      route: '/model-integrity',
      icon: Cpu,
      status: 'Review Required',
      findingsCount: 1,
      description: 'SHA-256 fingerprint & drift'
    },
    {
      id: 'inference-provenance',
      name: 'Inference Provenance',
      route: '/inference-provenance',
      icon: KeyRound,
      status: 'Verified',
      findingsCount: 0,
      description: 'HMAC signature & anti-tamper'
    },
    {
      id: 'distribution',
      name: 'Distribution Shift',
      route: '/distribution-shift',
      icon: GitCompare,
      status: 'Potential Shift',
      findingsCount: 2,
      description: 'PSI & Wasserstein drift'
    },
    {
      id: 'assurance',
      name: 'Assurance Report',
      route: '/reports/REP-2026-0042',
      icon: FileText,
      status: 'Review',
      findingsCount: 24,
      description: 'Evidence-based risk audit'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">End-to-End Pipeline Integrity Chain</h3>
          <p className="text-xs text-slate-500">
            Click any pipeline stage to inspect detailed evidence, artifacts, and verification logs.
          </p>
        </div>
        <span className="text-[11px] font-mono text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded self-start font-medium">
          Connected Architecture
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <button
              key={stage.id}
              onClick={() => navigate(stage.route)}
              className="text-left group p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col justify-between relative overflow-hidden shadow-xs"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="p-1.5 rounded-md bg-teal-50 text-teal-700 border border-teal-100 group-hover:border-teal-300 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  0{idx + 1}
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                  {stage.name}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {stage.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between w-full">
                <StatusBadge status={stage.status} size="sm" />
                {stage.findingsCount > 0 ? (
                  <span className="text-[11px] font-mono font-semibold text-rose-600">
                    {stage.findingsCount} issues
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-emerald-600">
                    0 flags
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
