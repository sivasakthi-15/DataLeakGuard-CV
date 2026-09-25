import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  ArrowLeft,
  Printer,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Lock,
  Layers,
  Calendar
} from 'lucide-react';
import { AssuranceReport } from '../types';
import { getReportById } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, info } = useToast();

  const [report, setReport] = useState<AssuranceReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const found = await getReportById(id);
        setReport(found);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleDownloadPDF = () => {
    info('Exporting PDF', 'Formatting formal assurance audit document...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
        <p className="text-slate-600">Report not found.</p>
        <button
          onClick={() => navigate('/reports')}
          className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors shadow-xs"
        >
          Return to Reports
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assurance Reports</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Formal Assurance Report Document Canvas */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 print:border-none print:bg-white print:text-black">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 font-mono text-xs uppercase tracking-widest font-bold mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>DATALEAKGUARD-CV</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              ML Integrity Assurance Report
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Document Reference: {report.id} · Created {report.createdAt}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-right shrink-0">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Assurance Disposition</span>
            <div className="flex items-center justify-end gap-2 mt-1">
              <span className={`text-sm font-bold font-mono px-2.5 py-0.5 rounded ${
                report.disposition === 'ACCEPT'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : report.disposition === 'QUARANTINE'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {report.disposition}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block mt-1">
              Confidence: {report.confidenceScore}%
            </span>
          </div>
        </div>

        {/* Target Manifest Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-500 block text-[10px] font-mono uppercase">Target Dataset</span>
            <span className="font-semibold text-slate-900 mt-0.5 block truncate">{report.datasetName}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] font-mono uppercase">Evaluated Model</span>
            <span className="font-semibold text-slate-900 mt-0.5 block truncate">{report.modelName}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] font-mono uppercase">Project-Defined Risk</span>
            <span className="font-mono font-bold text-amber-700 mt-0.5 block">{report.projectDefinedRisk}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] font-mono uppercase">Reported Inflation</span>
            <span className="font-mono font-bold text-rose-700 mt-0.5 block">+7.4% Accuracy</span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-teal-700">01.</span>
            <span>Executive Summary</span>
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
            {report.executiveSummary}
          </p>
        </section>

        {/* Section 2: Dataset Integrity */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-teal-700">02.</span>
            <span>Dataset Integrity</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {report.sections.datasetIntegrity}
          </p>
        </section>

        {/* Section 3: Leakage Findings */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-teal-700">03.</span>
            <span>Leakage Findings</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {report.sections.leakageFindings}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] font-mono">
              <span className="text-slate-500 block">Critical:</span>
              <span className="font-bold text-rose-700">{report.findingsCount.critical}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] font-mono">
              <span className="text-slate-500 block">High:</span>
              <span className="font-bold text-orange-700">{report.findingsCount.high}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] font-mono">
              <span className="text-slate-500 block">Medium:</span>
              <span className="font-bold text-amber-700">{report.findingsCount.medium}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] font-mono">
              <span className="text-slate-500 block">Low:</span>
              <span className="font-bold text-slate-700">{report.findingsCount.low}</span>
            </div>
          </div>
        </section>

        {/* Section 4: Dataset Anomalies */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-teal-700">04.</span>
            <span>Dataset Anomalies</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {report.sections.datasetAnomalies}
          </p>
        </section>

        {/* Section 5: Model Integrity */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-teal-700">05.</span>
            <span>Model Integrity</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {report.sections.modelIntegrity}
          </p>
        </section>

        {/* Section 6: Inference Provenance */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-teal-700">06.</span>
            <span>Inference Provenance</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {report.sections.inferenceProvenance}
          </p>
        </section>

        {/* Section 7: Distribution Shift */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-teal-700">07.</span>
            <span>Distribution Shift</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {report.sections.distributionShift}
          </p>
        </section>

        {/* Section 8: Performance Impact */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-teal-700">08.</span>
            <span>Performance Impact</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {report.sections.performanceImpact}
          </p>
        </section>

        {/* Section 9: Evidence */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-teal-700">09.</span>
            <span>Evidence</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {report.sections.evidence}
          </p>
        </section>

        {/* Section 10: Risk Assessment */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-teal-700">10.</span>
            <span>Risk Assessment</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {report.sections.riskAssessment}
          </p>
        </section>

        {/* Section 11: Limitations */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-teal-700">11.</span>
            <span>Limitations</span>
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
            {report.sections.limitations.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </section>

        {/* Section 12: Recommended Disposition */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-teal-700">12.</span>
            <span>Recommended Disposition</span>
          </h2>
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-900 space-y-2">
            <p className="font-semibold text-amber-900">
              {report.sections.recommendedDisposition}
            </p>
            <div className="pt-2 border-t border-amber-200 text-[11px] text-amber-800 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                IMPORTANT: These dispositions are project-defined assurance recommendations formulated for ML pipelines, not official government or regulatory classifications.
              </span>
            </div>
          </div>
        </section>

        {/* Document Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Generated by DataLeakGuard-CV · Evidence-Based ML & CV Integrity Engine</span>
          <span>Security Assurance Snapshot #DLG-{report.id.replace('REP-', '')}</span>
        </div>
      </div>
    </div>
  );
};
