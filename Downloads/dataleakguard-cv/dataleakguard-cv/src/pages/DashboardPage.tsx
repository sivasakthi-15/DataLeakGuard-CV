import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  AlertCircle,
  Cpu,
  FileText,
  ShieldAlert,
  TrendingDown,
  GitCompare,
  KeyRound,
  ArrowUpRight,
  PlusCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

import { StatCard } from '../components/common/StatCard';
import { RiskIndicator } from '../components/common/RiskIndicator';
import { PipelineVisualizer } from '../components/common/PipelineVisualizer';
import { StatusBadge } from '../components/common/StatusBadge';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { CardSkeleton, TableSkeleton } from '../components/common/LoadingSkeleton';
import { getDashboardStats, getActivities } from '../services/api';
import { Activity } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, actData] = await Promise.all([
          getDashboardStats(),
          getActivities()
        ]);
        setStats(statsData);
        setActivities(actData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Chart 1: Findings by Category
  const findingsByCategory = [
    { name: 'Duplicate Leak', count: 142 },
    { name: 'CV Near-Dup', count: 34 },
    { name: 'Entity Bleed', count: 38 },
    { name: 'Contamination', count: 24 },
    { name: 'Preprocessing', count: 14 },
    { name: 'Target Leak', count: 12 },
    { name: 'Label Anomaly', count: 7 },
    { name: 'OOD Samples', count: 6 }
  ];

  // Chart 2: Performance Before vs After Repair
  const performanceBeforeAfter = [
    { metric: 'Accuracy', contaminated: 97.8, corrected: 90.4 },
    { metric: 'Precision', contaminated: 96.5, corrected: 88.7 },
    { metric: 'Recall', contaminated: 95.8, corrected: 89.2 },
    { metric: 'F1 Score', contaminated: 96.9, corrected: 89.7 },
    { metric: 'ROC-AUC', contaminated: 98.8, corrected: 91.2 }
  ];

  // Chart 3: Severity Breakdown
  const severityData = [
    { name: 'Critical', value: 24, color: '#dc2626' },
    { name: 'High', value: 154, color: '#ea580c' },
    { name: 'Medium', value: 28, color: '#d97706' },
    { name: 'Low', value: 8, color: '#64748b' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
            ML Integrity Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor dataset, model and inference integrity across your ML pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/datasets')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors flex items-center gap-2 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Analyze New Dataset</span>
          </button>
        </div>
      </div>

      {/* Row 1 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Datasets Analyzed"
          value={stats?.datasetsAnalyzed || 5}
          subtitle="Tabular & CV repositories"
          icon={Database}
          trend="+2 this week"
          trendType="neutral"
        />
        <StatCard
          title="Issues Detected"
          value={stats?.issuesDetected || 363}
          subtitle="Cross-split integrity anomalies"
          icon={AlertCircle}
          trend="Requires Review"
          trendType="warning"
        />
        <StatCard
          title="Models Verified"
          value={stats?.modelsVerified || 4}
          subtitle="ONNX, PyTorch & TorchScript"
          icon={Cpu}
          trend="1 changed"
          trendType="negative"
        />
        <StatCard
          title="Reports Generated"
          value={stats?.reportsGenerated || 2}
          subtitle="Evidence-based audit documents"
          icon={FileText}
          trend="Up to date"
          trendType="positive"
        />
      </div>

      {/* Row 2 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Critical Findings"
          value={stats?.criticalFindings || 24}
          subtitle="High-probability data overlap"
          icon={ShieldAlert}
          highlight
          trendType="negative"
        />
        <StatCard
          title="Performance Inflation"
          value={stats?.performanceInflation || '+7.4%'}
          subtitle="Observed contaminated vs corrected delta"
          icon={TrendingDown}
          trend="Unsound baseline"
          trendType="warning"
        />
        <StatCard
          title="Distribution Shifts"
          value={stats?.distributionShifts || 1}
          subtitle="PSI divergence > 0.18"
          icon={GitCompare}
          trend="Potential shift"
          trendType="warning"
        />
        <StatCard
          title="Provenance Records"
          value={stats?.provenanceRecords || 3}
          subtitle="HMAC signed execution traces"
          icon={KeyRound}
          trend="Tamper detection active"
          trendType="positive"
        />
      </div>

      {/* Overall Pipeline Integrity Banner Card */}
      <RiskIndicator
        status={stats?.overallPipelineStatus || 'REVIEW REQUIRED'}
        confidence={stats?.overallConfidence || 91}
        riskScore={84}
        riskLevel="HIGH"
      />

      {/* Pipeline Visualization Stage */}
      <PipelineVisualizer />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Findings by Category */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Integrity Findings by Category
              </h3>
              <p className="text-xs text-slate-500">
                Identified cross-validation leakage & CV anomalies across scanned cohorts.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 font-medium">
              Total: 277 findings
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={findingsByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f766e' }}
                />
                <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Issue Severity Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Issue Severity Distribution
                </h3>
                <p className="text-xs text-slate-500">
                  Risk tier classification of identified anomalies.
                </p>
              </div>
            </div>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-xs">
            {severityData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono tabular-nums text-slate-900 font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 2: Performance Before vs After Repair */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Evaluation Performance: Contaminated vs Corrected Partition
            </h3>
            <p className="text-xs text-slate-500">
              Observed difference between raw validation split and leak-repaired benchmark.
            </p>
          </div>
          <button
            onClick={() => navigate('/impact-analysis')}
            className="text-xs text-teal-700 hover:text-teal-800 flex items-center gap-1 font-semibold"
          >
            <span>Detailed Impact Breakdown</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceBeforeAfter} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="metric" stroke="#64748b" fontSize={12} />
              <YAxis domain={[80, 100]} stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`${value}%`]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar name="Contaminated Benchmark (Reported)" dataKey="contaminated" fill="#dc2626" radius={[3, 3, 0, 0]} />
              <Bar name="Corrected Evaluation (True Baseline)" dataKey="corrected" fill="#16a34a" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent Integrity Audit Activity</h3>
            <p className="text-xs text-slate-500">Chronological event log across registered models and datasets.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Live Session</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-semibold">Event</th>
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold">Severity</th>
                <th className="px-5 py-3 font-semibold">Timestamp</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activities.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-900 whitespace-nowrap">
                    {act.title}
                  </td>
                  <td className="px-5 py-3 text-slate-600 max-w-md truncate">
                    {act.description}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    {act.severity ? <SeverityBadge severity={act.severity} size="sm" /> : <span className="text-slate-400 font-mono">Info</span>}
                  </td>
                  <td className="px-5 py-3 text-slate-500 font-mono tabular-nums whitespace-nowrap">
                    {act.timestamp}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (act.targetId?.startsWith('ds-')) navigate(`/datasets/${act.targetId}`);
                        else if (act.targetId?.startsWith('PRV-')) navigate('/inference-provenance');
                        else if (act.targetId?.startsWith('mdl-')) navigate('/model-integrity');
                        else if (act.targetId?.startsWith('REP-')) navigate(`/reports/${act.targetId}`);
                        else navigate('/leakage-analysis/ds-adult-income');
                      }}
                      className="text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
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
