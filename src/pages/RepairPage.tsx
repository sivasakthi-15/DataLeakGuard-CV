import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Wrench,
  CheckCircle2,
  Download,
  RotateCcw,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Filter,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { RepairItem, RepairResult, ImpactAnalysis } from '../types';
import { getRepairItems, executeRepair, retrainModel } from '../services/api';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { useToast } from '../context/ToastContext';

export const RepairPage: React.FC = () => {
  const { id = 'ds-adult-income' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, info } = useToast();

  const [items, setItems] = useState<RepairItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [repairResult, setRepairResult] = useState<RepairResult | null>(null);
  const [isRepairing, setIsRepairing] = useState(false);

  // Retrain state
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [retrainMsg, setRetrainMsg] = useState('');
  const [retrainComplete, setRetrainComplete] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRepairItems(id);
        setItems(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const toggleItem = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleCreateCorrected = async () => {
    const selectedIds = items.filter((i) => i.selected).map((i) => i.id);
    if (selectedIds.length === 0) {
      info('No Issues Selected', 'Please select at least one issue to quarantine or repair.');
      return;
    }

    setIsRepairing(true);
    try {
      const res = await executeRepair(id, selectedIds);
      setRepairResult(res);
      success('Dataset Cleansed', `Quarantined ${res.quarantinedCount} leaks and removed ${res.removedCount} duplicates.`);
    } finally {
      setIsRepairing(false);
    }
  };

  const handleRetrain = async () => {
    setIsRetraining(true);
    setRetrainProgress(0);
    try {
      await retrainModel(id, 'mdl-xgboost-census', (pct, msg) => {
        setRetrainProgress(pct);
        setRetrainMsg(msg);
      });
      setRetrainComplete(true);
      success('Retraining Finished', 'Evaluation conducted on sanitized test partition.');
    } finally {
      setIsRetraining(false);
    }
  };

  const handleDownload = () => {
    const fakeData = 'id,age,workclass,education,marital_status,occupation,capital_gain,income_target\nREC-001,39,State-gov,Bachelors,Never-married,Adm-clerical,0,<=50K\n';
    const blob = new Blob([fakeData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = repairResult?.downloadFilename || 'cleansed_dataset.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    success('Download Initialized', 'Corrected dataset exported.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-teal-700 uppercase tracking-wider font-semibold">
            Mitigation & Re-Evaluation
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
            Repair & Evaluation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quarantine leaked entity fingerprints, remove duplicate collisions, and retrain model baselines.
          </p>
        </div>

        {retrainComplete && (
          <button
            onClick={() => navigate('/impact-analysis')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors flex items-center gap-2 shadow-xs"
          >
            <span>View Performance Impact</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Workflow Chain Visual */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
          Sanitization Lifecycle
        </span>
        <div className="flex items-center justify-between overflow-x-auto text-xs font-mono">
          <span className="text-slate-600">Original Dataset</span>
          <span className="text-slate-400">→</span>
          <span className="text-rose-600 font-semibold">Detected Issues</span>
          <span className="text-slate-400">→</span>
          <span className="text-teal-700 font-semibold">Quarantine & Repair</span>
          <span className="text-slate-400">→</span>
          <span className="text-emerald-600 font-semibold">Corrected Dataset</span>
          <span className="text-slate-400">→</span>
          <span className="text-slate-700">Retrain</span>
          <span className="text-slate-400">→</span>
          <span className="text-amber-600 font-semibold">Compare Inflation</span>
        </div>
      </div>

      {/* Step 1: Issue Selection List */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Select Detected Issues for Repair / Quarantine
            </h3>
            <p className="text-xs text-slate-500">
              Check findings to isolate from training and repartition test boundaries.
            </p>
          </div>
          <span className="text-xs font-mono text-teal-700 font-semibold">
            {items.filter((i) => i.selected).length} of {items.length} Selected
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                item.selected
                  ? 'bg-teal-50/60 border-teal-300 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => {}}
                className="mt-0.5 w-4 h-4 rounded bg-white border-slate-300 text-teal-600 focus:ring-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-900">{item.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono tabular-nums text-slate-700 font-bold">
                      {item.count} samples
                    </span>
                    <SeverityBadge severity={item.severity} size="sm" />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 mt-1">
                  {item.description}
                </p>

                <div className="mt-2 flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-slate-500">Proposed Strategy:</span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-teal-800 uppercase font-semibold">
                    {item.recommendedAction}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleCreateCorrected}
            disabled={isRepairing}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white transition-colors flex items-center gap-2 shadow-xs"
          >
            <Wrench className="w-4 h-4" />
            <span>{isRepairing ? 'Synthesizing Cleansed Folds...' : 'Create Corrected Dataset'}</span>
          </button>
        </div>
      </div>

      {/* Step 2: Repair Summary & Download */}
      {repairResult && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Partition Repair Summary
                </h3>
                <p className="text-xs text-slate-500">
                  Synthesized sanitized partition free of cross-boundary entity leaks.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-teal-700" />
              <span>Download Corrected Dataset</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Removed Duplicates</span>
              <span className="text-lg font-bold font-mono text-rose-600 tabular-nums">
                {repairResult.removedCount}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Quarantined Entities</span>
              <span className="text-lg font-bold font-mono text-amber-600 tabular-nums">
                {repairResult.quarantinedCount}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Retained Sanitized</span>
              <span className="text-lg font-bold font-mono text-emerald-600 tabular-nums">
                {repairResult.retainedCount.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Needs Review</span>
              <span className="text-lg font-bold font-mono text-slate-700 tabular-nums">
                0 remaining
              </span>
            </div>
          </div>

          {/* Retrain Model Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Execute Model Retraining
              </p>
              <p className="text-[11px] text-slate-500">
                Retrain on sanitized folds to measure true generalization vs inflated metrics.
              </p>
            </div>

            <button
              onClick={handleRetrain}
              disabled={isRetraining}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
              <span>{isRetraining ? 'Retraining Baseline...' : 'Retrain Model'}</span>
            </button>
          </div>

          {/* Retrain Progress Bar */}
          {isRetraining && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-700">{retrainMsg}</span>
                <span className="text-teal-700 font-bold">{retrainProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-300"
                  style={{ width: `${retrainProgress}%` }}
                />
              </div>
            </div>
          )}

          {retrainComplete && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Model retrained successfully. Ready to inspect evaluation performance drop.</span>
              </div>
              <button
                onClick={() => navigate('/impact-analysis')}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-bold underline ml-2"
              >
                Inspect Impact →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
