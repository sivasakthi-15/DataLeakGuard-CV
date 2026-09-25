import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingDown,
  AlertTriangle,
  Info,
  ArrowRight,
  ShieldCheck,
  FileText,
  BarChart2,
  CheckCircle2
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
import { getImpactAnalysis } from '../services/api';
import { ImpactAnalysis } from '../types';
import { CardSkeleton } from '../components/common/LoadingSkeleton';

export const ImpactAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ImpactAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getImpactAnalysis('ds-adult-income');
        setData(res);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const chartData = data.metrics.map((m) => ({
    metric: m.metric,
    contaminated: m.contaminated,
    corrected: m.corrected,
    inflation: m.difference
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-teal-700 uppercase tracking-wider font-semibold">
            Research Evaluation Delta
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
            Performance Impact & Inflation Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quantify the empirical evaluation inflation caused by cross-boundary leakage and duplicates.
          </p>
        </div>

        <button
          onClick={() => navigate('/reports/REP-2026-0042')}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Assurance Report</span>
        </button>
      </div>

      {/* Highlighted Evaluation Inflation Card */}
      <div className="bg-white border border-amber-200 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider">
                Assurance Metric Highlight
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono border border-slate-200">
                Controlled Contamination Scenario
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold font-mono text-slate-900">
              Estimated Evaluation Inflation: +{data.evaluationInflationSummary.accuracyDifference.toFixed(1)}% Accuracy Drop
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-amber-800">Observed difference between contaminated and corrected evaluation:</strong>{' '}
              The model achieved 97.8% accuracy on the raw contaminated split, but true generalization dropped to 90.4% when exact duplicates and household entity overlap were quarantined.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-center px-2">
              <span className="text-[11px] text-slate-500 block font-mono">Contaminated</span>
              <span className="text-2xl font-bold font-mono text-rose-600 tabular-nums">97.8%</span>
            </div>
            <span className="text-slate-400 text-xl font-mono">→</span>
            <div className="text-center px-2">
              <span className="text-[11px] text-slate-500 block font-mono">Corrected</span>
              <span className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">90.4%</span>
            </div>
          </div>
        </div>

        {/* Causal Disclaimer Note */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {data.evaluationInflationSummary.nuance}
          </p>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {data.metrics.map((m) => (
          <div key={m.metric} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-700">{m.metric}</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                  {m.corrected.toFixed(1)}%
                </span>
                <span className="text-xs font-mono text-rose-600 tabular-nums line-through opacity-70">
                  {m.contaminated.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">Inflation Delta:</span>
              <span className="text-amber-700 font-bold tabular-nums">+{m.difference.toFixed(1)} pp</span>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Metric Comparison: Contaminated vs Sanitized Evaluation
            </h3>
            <p className="text-xs text-slate-500">
              Side-by-side benchmarking reveals artificial performance buffer in unverified pipelines.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Model: {data.modelName}
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="metric" stroke="#64748b" fontSize={12} />
              <YAxis domain={[80, 100]} stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val: any) => [`${val}%`]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar name="Contaminated Benchmark (Artificial Buffer)" dataKey="contaminated" fill="#e11d48" radius={[4, 4, 0, 0]} />
              <Bar name="Sanitized Partition (True Generalization)" dataKey="corrected" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Explanation Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>Research Methodology & Leakage Breakdown</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-900 font-semibold block mb-1">1. Exact Duplicate Collisions</span>
            <p>
              142 identical rows appearing in both training and test folds allowed nearest-neighbor memorization rather than actual pattern generalization.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-900 font-semibold block mb-1">2. Demographic Identity Leak</span>
            <p>
              38 household clusters shared identical weights and census attributes across split boundaries, allowing demographic overfitting.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-900 font-semibold block mb-1">3. Preprocessing Transfusion</span>
            <p>
              Global standardization statistics were calculated over the entire dataset prior to folding, subtly leaking test fold distribution variance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
