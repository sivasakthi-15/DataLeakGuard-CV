import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  AlertTriangle,
  Info,
  CheckCircle2,
  TrendingUp,
  Sliders,
  Layers,
  BarChart2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getDistributionShift } from '../services/api';
import { DistributionShift } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { CardSkeleton } from '../components/common/LoadingSkeleton';

export const DistributionShiftPage: React.FC = () => {
  const [shiftData, setShiftData] = useState<DistributionShift | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getDistributionShift();
        setShiftData(res);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !shiftData) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  // Class Balance Comparison Chart Data
  const classData = shiftData.classBalanceShift.map((c) => ({
    name: c.className,
    reference: c.referencePct,
    current: c.currentPct
  }));

  // Feature PSI Chart Data
  const featureData = shiftData.featureShifts.map((f) => ({
    name: f.featureName,
    psi: f.driftScore,
    threshold: f.threshold
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-teal-700 uppercase tracking-wider font-semibold">
            Operational Telemetry
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
            Distribution Shift & OOD Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate Population Stability Index (PSI), Wasserstein distance, and latent feature drift across deployment windows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={shiftData.shiftLevel} />
        </div>
      </div>

      {/* Primary Status Banner */}
      <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 font-mono">
            Audit Result: {shiftData.shiftLevel}
          </span>
          <h2 className="text-xl font-bold font-mono text-slate-900 mt-1">
            Population Stability Index: {shiftData.psiScore.toFixed(3)} (Moderate Drift Detected)
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Comparing <strong className="text-slate-900">Baseline Census 2024 Reference</strong> against{' '}
            <strong className="text-slate-900">Production Inflow Stream Q3 2026</strong>.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 bg-white p-3.5 rounded-lg border border-amber-200 font-mono text-xs shadow-2xs">
          <div>
            <span className="text-slate-500 block text-[10px]">Wasserstein Dist</span>
            <span className="font-bold text-slate-800 tabular-nums">{shiftData.wassersteinDistance.toFixed(3)}</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <span className="text-slate-500 block text-[10px]">OOD Outlier Rate</span>
            <span className="font-bold text-amber-700 tabular-nums">{shiftData.oodRate}%</span>
          </div>
        </div>
      </div>

      {/* Mandatory Explanation Box */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 flex items-start gap-2.5 text-xs text-slate-600 shadow-xs">
        <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800">Interpretation Guidance:</strong>{' '}
          Distribution shift may result from legitimate operational changes, demographic trends, or sensor variations, and does not by itself prove malicious manipulation or model degradation.
        </p>
      </div>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Feature Shift Scores (PSI) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Feature Drift Score (PSI)
              </h3>
              <p className="text-xs text-slate-500">
                Population Stability Index by attribute. Scores &gt; 0.20 indicate significant shift.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">Threshold: 0.20</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-20} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 0.35]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="psi" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Class Balance Shift */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Class Balance Proportion Change
              </h3>
              <p className="text-xs text-slate-500">
                Target class prevalence comparison between reference baseline and incoming records.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">Binary Target</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: any) => [`${val}%`]}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar name="Reference Distribution" dataKey="reference" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar name="Current Operational Flow" dataKey="current" fill="#0891b2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
            Feature Drift Metrics & Outlier Attribution
          </h3>
          <span className="text-xs text-slate-500 font-mono">5 Tested Features</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-semibold">Feature</th>
                <th className="px-5 py-3 font-semibold">PSI Drift Score</th>
                <th className="px-5 py-3 font-semibold">Tolerance Limit</th>
                <th className="px-5 py-3 font-semibold">Diagnosis Status</th>
                <th className="px-5 py-3 font-semibold text-right">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shiftData.featureShifts.map((f) => (
                <tr key={f.featureName} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3 font-mono font-semibold text-slate-900">
                    {f.featureName}
                  </td>
                  <td className="px-5 py-3 font-mono tabular-nums font-bold text-slate-800">
                    {f.driftScore.toFixed(3)}
                  </td>
                  <td className="px-5 py-3 font-mono tabular-nums text-slate-500">
                    {f.threshold.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <StatusBadge status={f.status} size="sm" />
                  </td>
                  <td className="px-5 py-3 text-right text-slate-600 text-[11px]">
                    {f.status === 'Shift Detected'
                      ? 'Re-evaluate scaler bounds & bin thresholds'
                      : f.status === 'Requires Review'
                      ? 'Monitor in upcoming 500-sample window'
                      : 'Maintain operational baseline'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
