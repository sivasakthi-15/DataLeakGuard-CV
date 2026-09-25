import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Database,
  Play,
  Search,
  Wrench,
  FileSpreadsheet,
  Image,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Tag,
  ArrowRight,
  Info
} from 'lucide-react';
import { Dataset } from '../types';
import { getDatasetById } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { StatCard } from '../components/common/StatCard';
import { CardSkeleton, TableSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';

export const DatasetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { error } = useToast();

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'integrity' | 'distribution' | 'history'>('overview');

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const found = await getDatasetById(id);
        if (found) {
          setDataset(found);
        } else {
          error('Dataset Not Found', `Dataset with ID ${id} does not exist.`);
        }
      } catch {
        error('Error', 'Failed to retrieve dataset details.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, error]);

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
        <p className="text-slate-600">Dataset not found.</p>
        <button
          onClick={() => navigate('/datasets')}
          className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors shadow-xs"
        >
          Return to Datasets
        </button>
      </div>
    );
  }

  const isCV = dataset.type === 'computer-vision';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-teal-700 uppercase tracking-wider font-semibold">
                {dataset.format} · {dataset.type === 'computer-vision' ? 'Computer Vision Cohort' : 'Tabular Dataset'}
              </span>
              <StatusBadge status={dataset.status} size="sm" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {dataset.name}
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              {dataset.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <button
              onClick={() => navigate(`/analysis/${dataset.id}`)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run Integrity Analysis</span>
            </button>

            <button
              onClick={() => navigate(`/leakage-analysis/${dataset.id}`)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>View Leakage Findings</span>
            </button>

            <button
              onClick={() => navigate(`/repair/${dataset.id}`)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Wrench className="w-3.5 h-3.5 text-teal-700" />
              <span>Repair & Evaluate</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1 overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'profile', label: isCV ? 'Vision Annotations' : 'Feature Profiles' },
            { key: 'integrity', label: `Integrity Findings (${dataset.issuesCount})` },
            { key: 'distribution', label: 'Distribution & Splits' },
            { key: 'history', label: 'Audit History' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-teal-50 text-teal-800 border border-teal-200/80 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
              <span className="text-[11px] text-slate-500 block">Total Samples</span>
              <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {dataset.sampleCount.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">80% Train / 20% Test</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
              <span className="text-[11px] text-slate-500 block">{isCV ? 'Image Resolutions' : 'Feature Columns'}</span>
              <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {isCV ? dataset.cvStats?.resolutionDistribution.length : dataset.featureCount}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{isCV ? 'Multi-scale' : 'Categorical & Numeric'}</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
              <span className="text-[11px] text-slate-500 block">Target Classes</span>
              <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {dataset.classCount}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {isCV ? dataset.cvStats?.classes.join(', ') : 'Discrete labels'}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
              <span className="text-[11px] text-slate-500 block">Integrity Flags</span>
              <span className="text-xl font-bold font-mono text-rose-600 tabular-nums">
                {dataset.issuesCount}
              </span>
              <span className="text-[10px] text-rose-600/80 block mt-0.5 font-medium">Under configured checks</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
              <span className="text-[11px] text-slate-500 block">Last Audit</span>
              <span className="text-xs font-mono font-medium text-slate-800 block truncate">
                {dataset.lastAnalysis.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Timestamp verified</span>
            </div>
          </div>

          {/* Tabular vs CV Sample Preview Cards */}
          {isCV ? (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Computer Vision Cohort Metadata</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Multi-center radiographic acquisitions inspected for perceptual near-duplicate patient scans.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {dataset.cvStats?.resolutionDistribution.map((res) => (
                    <div key={res.label} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-xs text-slate-500 block">Resolution Dimension</span>
                      <span className="text-base font-bold font-mono text-teal-800">{res.label}</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5 tabular-nums">{res.count} images</span>
                    </div>
                  ))}
                </div>

                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono mb-3">
                  Sample Batch Index & Patient Fingerprints
                </h4>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-mono uppercase">
                      <tr>
                        <th className="px-4 py-2.5">Sample ID</th>
                        <th className="px-4 py-2.5">Patient Identifier</th>
                        <th className="px-4 py-2.5">Assigned Class</th>
                        <th className="px-4 py-2.5">Source Site</th>
                        <th className="px-4 py-2.5">Native Resolution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dataset.previewRows?.map((row: any, i) => (
                        <tr key={i} className="hover:bg-slate-50/80">
                          <td className="px-4 py-2.5 font-mono text-teal-700 font-medium">{row.id}</td>
                          <td className="px-4 py-2.5 font-mono text-slate-800">{row.patientId}</td>
                          <td className="px-4 py-2.5 text-slate-800">{row.label}</td>
                          <td className="px-4 py-2.5 text-slate-500">{row.hospitalTag}</td>
                          <td className="px-4 py-2.5 font-mono text-slate-500">{row.resolution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">Raw Data Row Previews (First 6 Records)</h3>
                <span className="text-[11px] font-mono text-slate-500">14 Features</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider">
                    <tr>
                      {dataset.columns?.map((col) => (
                        <th key={col.name} className="px-3 py-2.5 whitespace-nowrap">
                          {col.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dataset.previewRows?.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        {dataset.columns?.map((col) => (
                          <td key={col.name} className="px-3 py-2 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                            {String(row[col.name] ?? '-')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Feature Schema & Cardinality</h3>
              <p className="text-xs text-slate-500">Statistical distribution and missingness audit per feature.</p>
            </div>
            <span className="text-xs font-mono text-slate-500">Clean Schema Verification</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase">
                <tr>
                  <th className="px-4 py-2.5">Feature Name</th>
                  <th className="px-4 py-2.5">Data Type</th>
                  <th className="px-4 py-2.5">Missing Count</th>
                  <th className="px-4 py-2.5">Cardinality (Unique)</th>
                  <th className="px-4 py-2.5">Leakage Potential</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataset.columns?.map((col) => (
                  <tr key={col.name} className="hover:bg-slate-50/80">
                    <td className="px-4 py-2.5 font-semibold text-slate-900 font-mono">{col.name}</td>
                    <td className="px-4 py-2.5 text-slate-500 capitalize">{col.type}</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums text-slate-700">{col.missingCount} ({((col.missingCount / dataset.sampleCount) * 100).toFixed(1)}%)</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums text-slate-700">{col.uniqueCount}</td>
                    <td className="px-4 py-2.5">
                      {col.name === 'capital_gain' || col.name === 'fnlwgt' ? (
                        <span className="text-[11px] font-mono text-rose-600 font-semibold">High (Identified in Leak)</span>
                      ) : (
                        <span className="text-[11px] font-mono text-emerald-600">Nominal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Integrity */}
      {activeTab === 'integrity' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Active Integrity Violations</h3>
              <p className="text-xs text-slate-500">Detailed breakdown of cross-partition leakage and duplicates.</p>
            </div>
            <button
              onClick={() => navigate(`/leakage-analysis/${dataset.id}`)}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-teal-700 hover:bg-teal-800 text-white transition-colors shadow-xs"
            >
              Open Full Leakage Workspace
            </button>
          </div>

          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <p className="font-semibold text-amber-950">
                {dataset.issuesCount} Potential Integrity Anomalies Identified
              </p>
              <p className="text-amber-800 leading-relaxed">
                Evaluation boundary overlap (142 exact duplicates, 38 identity leaks, and global preprocessing imputation)
                inflates reported test benchmark performance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Distribution & Splits */}
      {activeTab === 'distribution' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900">Stratification & Validation Boundary Audit</h3>
          <p className="text-xs text-slate-500">
            Split verification conducted to ensure zero test-set overlap.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500 block font-mono">Training Partition (80%)</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                {Math.round(dataset.sampleCount * 0.8).toLocaleString()} records
              </span>
              <p className="text-[11px] text-slate-500 mt-2">
                Features fitted with StandardScaler inside k-fold pipeline.
              </p>
            </div>

            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-lg">
              <span className="text-xs text-rose-700 block font-mono">Test Partition (20%)</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                {Math.round(dataset.sampleCount * 0.2).toLocaleString()} records
              </span>
              <p className="text-[11px] text-rose-700 mt-2">
                Contaminated with 142 duplicate train rows. Requires quarantined sanitization.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: History */}
      {activeTab === 'history' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900">Dataset Audit Trail</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Automated 8-Stage Leakage Scan Completed</p>
                <p className="text-slate-500 text-[11px]">{dataset.lastAnalysis}</p>
              </div>
              <StatusBadge status="Issues Found" size="sm" />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Initial Repository Ingestion</p>
                <p className="text-slate-500 text-[11px]">{dataset.uploadedAt}</p>
              </div>
              <StatusBadge status="Clean" size="sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
