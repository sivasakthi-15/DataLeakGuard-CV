import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Search,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Users,
  Target,
  Clock,
  Sparkles,
  GitBranch,
  X,
  ExternalLink,
  Wrench,
  Info,
  SlidersHorizontal
} from 'lucide-react';
import { LeakageFinding, LeakageCategoryOverview, SeverityLevel } from '../types';
import { getCategoryOverviews, getFindings, updateFindingStatus } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';

export const LeakageAnalysisPage: React.FC = () => {
  const { id = 'ds-adult-income' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, info } = useToast();

  const [categories, setCategories] = useState<LeakageCategoryOverview[]>([]);
  const [findings, setFindings] = useState<LeakageFinding[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected finding for detailed side panel
  const [selectedFinding, setSelectedFinding] = useState<LeakageFinding | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    async function load() {
      try {
        const [cats, fnds] = await Promise.all([
          getCategoryOverviews(id),
          getFindings(id)
        ]);
        setCategories(cats);
        setFindings(fnds);
        if (fnds.length > 0) {
          setSelectedFinding(fnds[0]);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleMarkReviewed = async (findingId: string) => {
    await updateFindingStatus(findingId, 'Under Review');
    setFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, status: 'Under Review' } : f))
    );
    if (selectedFinding?.id === findingId) {
      setSelectedFinding((prev) => (prev ? { ...prev, status: 'Under Review' } : null));
    }
    success('Finding Status Updated', `Marked ${findingId} as Under Review.`);
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'duplicate':
        return Copy;
      case 'entity':
        return Users;
      case 'target':
        return Target;
      case 'temporal':
        return Clock;
      case 'preprocessing':
        return Sparkles;
      default:
        return GitBranch;
    }
  };

  const filteredFindings = findings.filter((f) => {
    const matchesSearch =
      f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.evidence.toLowerCase().includes(search.toLowerCase()) ||
      f.trainSampleId.toLowerCase().includes(search.toLowerCase()) ||
      f.testSampleId.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || f.severity === severityFilter;
    const matchesType = typeFilter === 'all' || f.type === typeFilter;
    return matchesSearch && matchesSeverity && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-teal-700 uppercase tracking-wider font-semibold">
            DataLeakGuard Core
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
            Leakage & Integrity Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Examine detected cross-validation leakages, pairwise collisions, and evaluation boundaries.
          </p>
        </div>

        <button
          onClick={() => navigate(`/repair/${id}`)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <Wrench className="w-4 h-4" />
          <span>Proceed to Repair & Quarantine</span>
        </button>
      </div>

      {/* 6 Main Detection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.type);
          const isDetected = cat.status === 'Detected';
          return (
            <div
              key={cat.type}
              onClick={() => setTypeFilter(cat.type)}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
                typeFilter === cat.type
                  ? 'bg-teal-50/70 border-teal-600 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-100">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900">{cat.label}</h3>
                </div>
                <StatusBadge status={cat.status} size="sm" />
              </div>

              <div className="flex items-baseline justify-between mt-3 mb-2">
                <div>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {cat.findingsCount}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-1.5">Findings</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Confidence</span>
                  <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                    {cat.confidence}%
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <SeverityBadge severity={cat.severity} size="sm" />
                <span className="text-slate-500 text-[10px]">
                  {typeFilter === cat.type ? 'Active Filter' : 'Click to Filter'}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed line-clamp-2">
                {cat.shortExplanation}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filter and Findings Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Findings Table (2 columns wide on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search findings by ID, record ID, or evidence snippet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filter findings by leakage type"
                className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-600"
              >
                <option value="all">All Types</option>
                <option value="duplicate">Duplicates</option>
                <option value="entity">Entity Leak</option>
                <option value="target">Target Leak</option>
                <option value="preprocessing">Preprocessing</option>
                <option value="contamination">Contamination</option>
                <option value="cv-near-duplicate">CV Near-Dup</option>
                <option value="label-anomaly">Label Anomaly</option>
                <option value="ood-sample">OOD Sample</option>
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                aria-label="Filter findings by severity"
                className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-600"
              >
                <option value="all">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <TableSkeleton rows={4} />
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Finding ID</th>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 font-semibold">Train vs Test</th>
                      <th className="px-4 py-3 font-semibold">Similarity</th>
                      <th className="px-4 py-3 font-semibold">Severity</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredFindings.map((f) => {
                      const isSelected = selectedFinding?.id === f.id;
                      return (
                        <tr
                          key={f.id}
                          onClick={() => setSelectedFinding(f)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-teal-50/70 border-l-2 border-l-teal-600'
                              : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="px-4 py-3 font-mono font-semibold text-teal-700 whitespace-nowrap">
                            #{f.id}
                          </td>
                          <td className="px-4 py-3 capitalize text-slate-800 whitespace-nowrap">
                            {f.type.replace('-', ' ')}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">
                            <span className="text-slate-900 font-semibold">{f.trainSampleId}</span>
                            <span className="text-slate-400 mx-1">↔</span>
                            <span className="text-slate-900 font-semibold">{f.testSampleId}</span>
                          </td>
                          <td className="px-4 py-3 font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                            {f.similarity.toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <SeverityBadge severity={f.severity} size="sm" />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <StatusBadge status={f.status} size="sm" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Side Panel (1 column wide on desktop) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sticky top-20 self-start space-y-4 shadow-xs">
          {selectedFinding ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-700 font-semibold">
                    Detailed Evidence Inspection
                  </span>
                  <h3 className="text-base font-bold font-mono text-slate-900">
                    Finding #{selectedFinding.id}
                  </h3>
                </div>
                <SeverityBadge severity={selectedFinding.severity} size="sm" />
              </div>

              {/* Evidence Overview */}
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Train Record:</span>
                    <span className="font-mono text-slate-900 font-semibold">{selectedFinding.trainSampleId}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Test Record:</span>
                    <span className="font-mono text-slate-900 font-semibold">{selectedFinding.testSampleId}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Cross-Boundary Similarity:</span>
                    <span className="font-mono text-teal-800 font-bold tabular-nums">{selectedFinding.similarity}%</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider font-mono">
                    Evidence Statement
                  </h4>
                  <p className="text-slate-700 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px]">
                    {selectedFinding.evidence}
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider font-mono">
                    Integrity Explanation
                  </h4>
                  <p className="text-slate-500 mt-1 leading-relaxed text-[11px]">
                    {selectedFinding.explanation}
                  </p>
                </div>

                {/* Compare Sample Details */}
                {selectedFinding.trainRecordDetails && (
                  <div className="pt-2">
                    <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider font-mono mb-2">
                      Record Feature Values
                    </h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto border border-slate-200 rounded p-2 bg-slate-50">
                      {Object.entries(selectedFinding.trainRecordDetails).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-500">{k}:</span>
                          <span className="text-slate-800 font-medium truncate max-w-[140px]">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => handleMarkReviewed(selectedFinding.id)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                  <span>Mark Reviewed</span>
                </button>

                <button
                  onClick={() => {
                    info('Queued for Repair', `Finding ${selectedFinding.id} included in repair batch.`);
                    navigate(`/repair/${id}`);
                  }}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Include in Repair Batch</span>
                </button>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-500 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal-700" />
                <span>
                  Language is conservative: Avoids definitive causality claims when evidence is probabilistic.
                </span>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 text-center py-8">
              Select a finding row to view detailed evidence.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
