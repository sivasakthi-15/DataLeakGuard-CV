import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Search
} from 'lucide-react';
import { AssuranceReport } from '../types';
import { getReports, deleteReport, generateAssuranceReport } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error, info } = useToast();

  const [reports, setReports] = useState<AssuranceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const created = await generateAssuranceReport('ds-adult-income', 'mdl-xgboost-census');
      success('Report Compiled', `Generated assurance report ${created.id}.`);
      await fetchReports();
      navigate(`/reports/${created.id}`);
    } catch {
      error('Report Generation Error', 'Failed to compile assurance document.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteReport(deleteId);
      success('Report Deleted', 'Report removed from repository.');
      setDeleteId(null);
      await fetchReports();
    } catch {
      error('Delete Error', 'Could not remove report.');
    }
  };

  const handleDownloadPDF = (reportId: string, title: string) => {
    info('Exporting Document', `Compiling ${title} to PDF...`);
    setTimeout(() => {
      success('PDF Ready', `Downloaded ${reportId}-assurance-audit.pdf`);
    }, 800);
  };

  const filteredReports = reports.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.datasetName.toLowerCase().includes(search.toLowerCase()) ||
      r.modelName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-teal-700 uppercase tracking-wider font-semibold">
            Evidence Documentation
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
            Assurance Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Archived formal integrity assurance reports documenting leakage findings, risk assessments, and dispositions.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{isGenerating ? 'Compiling Audit...' : 'Generate New Report'}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search reports by ID, dataset, or model name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600"
          />
        </div>
      </div>

      {/* Reports Table */}
      {loading ? (
        <TableSkeleton rows={3} />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">Report ID</th>
                  <th className="px-5 py-3 font-semibold">Audit Title</th>
                  <th className="px-5 py-3 font-semibold">Dataset & Model</th>
                  <th className="px-5 py-3 font-semibold">Created Date</th>
                  <th className="px-5 py-3 font-semibold">Disposition</th>
                  <th className="px-5 py-3 font-semibold">Confidence</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3 font-mono font-semibold text-teal-800 whitespace-nowrap">
                      {rep.id}
                    </td>

                    <td className="px-5 py-3">
                      <button
                        onClick={() => navigate(`/reports/${rep.id}`)}
                        className="font-semibold text-slate-900 hover:text-teal-700 text-left transition-colors max-w-xs truncate block"
                      >
                        {rep.title}
                      </button>
                    </td>

                    <td className="px-5 py-3 whitespace-nowrap">
                      <p className="text-slate-800 font-medium">{rep.datasetName.split('(')[0]}</p>
                      <p className="text-[10px] font-mono text-slate-500">{rep.modelName.split('(')[0]}</p>
                    </td>

                    <td className="px-5 py-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {rep.createdAt.split(' ')[0]}
                    </td>

                    <td className="px-5 py-3 whitespace-nowrap">
                      <StatusBadge status={rep.disposition} size="sm" />
                    </td>

                    <td className="px-5 py-3 font-mono tabular-nums text-slate-900 font-semibold whitespace-nowrap">
                      {rep.confidenceScore}%
                    </td>

                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/reports/${rep.id}`)}
                          className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded transition-colors"
                          title="View Report Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(rep.id, rep.title)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(rep.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Assurance Report"
        message="Are you sure you want to permanently delete this assurance document? The cryptographic audit trail within will be permanently removed from this workspace."
        confirmLabel="Delete Report"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
