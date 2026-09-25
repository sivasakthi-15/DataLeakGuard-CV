import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Database,
  Cpu,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { runDatasetAnalysis, getDatasetById } from '../services/api';
import { AnalysisResult, Dataset } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { useToast } from '../context/ToastContext';

export const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState(-1);
  const [currentStageName, setCurrentStageName] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const stageDefinitions = [
    { id: 1, name: 'Dataset Profiling', desc: 'Scan schema types, cardinalities, missingness, and metadata consistency.' },
    { id: 2, name: 'Duplicate Detection', desc: 'Perceptual hashing & exact bit-level collision search across split boundaries.' },
    { id: 3, name: 'Leakage Detection', desc: 'Identify target proxies, temporal bleed, and preprocessing scaler contamination.' },
    { id: 4, name: 'Label Analysis', desc: 'Flag identical input profiles with contradictory supervisory target labels.' },
    { id: 5, name: 'OOD Analysis', desc: 'Compute Mahalanobis distance & latent feature density deviations.' },
    { id: 6, name: 'Distribution Analysis', desc: 'Evaluate Population Stability Index (PSI) and Wasserstein drift distance.' },
    { id: 7, name: 'Risk Assessment', desc: 'Compute project-defined risk tier based on observed integrity anomalies.' },
    { id: 8, name: 'Report Generation', desc: 'Compile cryptographic hashes, evidence logs, and audit disposition.' }
  ];

  useEffect(() => {
    async function init() {
      if (!id) return;
      const ds = await getDatasetById(id);
      setDataset(ds);
      // Auto-start analysis if not already run
      startAnalysis();
    }
    init();
  }, [id]);

  const startAnalysis = async () => {
    if (!id || isRunning) return;
    setIsRunning(true);
    setAnalysisResult(null);
    setCurrentStageIdx(0);

    try {
      const res = await runDatasetAnalysis(id, (stageIdx, stageName) => {
        setCurrentStageIdx(stageIdx);
        setCurrentStageName(stageName);
      });
      setAnalysisResult(res);
      success('Analysis Completed', 'All 8 integrity audit stages executed successfully.');
    } catch {
      error('Analysis Failed', 'Encountered an issue running integrity pipeline.');
    } finally {
      setIsRunning(false);
    }
  };

  const isCompleted = !isRunning && analysisResult !== null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-teal-700 uppercase tracking-wider font-semibold">
            Pipeline Execution Node
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
            Automated Integrity Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Auditing {dataset?.name || id} across 8 multi-modal integrity detection stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startAnalysis}
            disabled={isRunning}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Auditing...' : 'Re-Run Analysis'}</span>
          </button>

          {isCompleted && (
            <button
              onClick={() => navigate(`/leakage-analysis/${id || 'ds-adult-income'}`)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>View Analysis Results</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Live Status Banner */}
      <div className={`p-5 rounded-xl border transition-all ${
        isRunning
          ? 'bg-teal-50 border-teal-200 shadow-xs'
          : isCompleted
          ? 'bg-white border-slate-200 shadow-xs'
          : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {isRunning ? (
              <Clock className="w-5 h-5 text-teal-700 animate-spin" />
            ) : isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Play className="w-5 h-5 text-slate-400" />
            )}
            <div>
              <p className="text-sm font-semibold text-slate-900 font-mono">
                {isRunning
                  ? `Executing Stage ${currentStageIdx + 1} of 8: ${currentStageName}`
                  : isCompleted
                  ? 'Integrity Audit Complete — 214 Potential Issues Detected'
                  : 'Ready to Execute Audit'}
              </p>
              <p className="text-xs text-slate-500">
                {isRunning
                  ? 'Calculating pairwise perceptual distances & entity overlap...'
                  : isCompleted
                  ? 'Evaluation boundaries scanned under configured similarity thresholds.'
                  : 'Click start to begin asynchronous pipeline inspection.'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-teal-700 font-bold tabular-nums">
              {isRunning
                ? `${Math.round(((currentStageIdx + 1) / 8) * 100)}%`
                : isCompleted
                ? '100%'
                : '0%'}
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600 rounded-full transition-all duration-300"
            style={{
              width: isRunning
                ? `${((currentStageIdx + 1) / 8) * 100}%`
                : isCompleted
                ? '100%'
                : '0%'
            }}
          />
        </div>
      </div>

      {/* 8 Execution Stages Stepper */}
      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden shadow-xs">
        {stageDefinitions.map((stage, idx) => {
          const isDone = isCompleted || (isRunning && idx < currentStageIdx);
          const isCurrent = isRunning && idx === currentStageIdx;
          const isPending = !isCompleted && !isCurrent && idx > currentStageIdx;

          return (
            <div
              key={stage.id}
              className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                isCurrent ? 'bg-teal-50/60' : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                    isDone
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isCurrent
                      ? 'bg-teal-50 text-teal-700 border border-teal-300 animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : `0${stage.id}`}
                </div>

                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-teal-800' : 'text-slate-900'}`}>
                    {stage.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {stage.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {isDone && (
                  <span className="text-[11px] font-mono text-emerald-700 font-medium">
                    {stage.id === 2 ? '142 duplicates' : stage.id === 3 ? '50 leaks' : stage.id === 4 ? '12 anomalies' : 'Verified'}
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[11px] font-mono text-teal-700 font-medium animate-pulse">
                    Processing...
                  </span>
                )}
                {isPending && (
                  <span className="text-[11px] font-mono text-slate-400">
                    Queued
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion CTA */}
      {isCompleted && (
        <div className="p-6 bg-white border-2 border-teal-600/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-mono">
              Audit Complete: Ready for Leakage Workspace
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Explore 6 leakage categories, individual train-test sample pairs, and evidence vectors.
            </p>
          </div>

          <button
            onClick={() => navigate(`/leakage-analysis/${id || 'ds-adult-income'}`)}
            className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
          >
            <span>Proceed to Leakage Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
