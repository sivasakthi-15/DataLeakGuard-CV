import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  Plus,
  Search,
  UploadCloud,
  FileSpreadsheet,
  FileArchive,
  Image,
  Eye,
  Play,
  Trash2,
  X,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { Dataset, DatasetType } from '../types';
import { getDatasets, uploadDataset, deleteDataset } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

export const DatasetsPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | DatasetType>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadType, setUploadType] = useState<DatasetType>('tabular');
  const [uploadFormat, setUploadFormat] = useState<'CSV' | 'XLSX' | 'ZIP' | 'YOLO' | 'COCO'>('CSV');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadSamples, setUploadSamples] = useState(15000);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchDatasets = async () => {
    try {
      const data = await getDatasets();
      setDatasets(data);
    } catch {
      error('Failed to load datasets', 'Could not retrieve registered datasets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) {
      error('Validation Error', 'Please provide a valid dataset name.');
      return;
    }

    setIsUploading(true);
    try {
      const created = await uploadDataset({
        name: uploadName,
        type: uploadType,
        format: uploadFormat,
        description: uploadDesc || 'Custom dataset uploaded for integrity audit.',
        sampleCount: Number(uploadSamples)
      });
      success('Dataset Registered', `${created.name} is uploaded and ready for profiling.`);
      setUploadModalOpen(false);
      setUploadName('');
      setUploadDesc('');
      await fetchDatasets();
    } catch {
      error('Upload Failed', 'Failed to register dataset.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDataset(deleteId);
      success('Dataset Removed', 'The dataset has been detached from active registry.');
      setDeleteId(null);
      await fetchDatasets();
    } catch {
      error('Delete Failed', 'Failed to remove dataset.');
    }
  };

  const filteredDatasets = datasets.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.format.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || d.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
            Datasets
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload and analyze datasets for ML integrity risks, train-test contamination, and CV duplicates.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Dataset</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search datasets by name, format, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Type filter */}
          <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-lg shrink-0">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('tabular')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                typeFilter === 'tabular'
                  ? 'bg-white text-teal-800 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tabular
            </button>
            <button
              onClick={() => setTypeFilter('computer-vision')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                typeFilter === 'computer-vision'
                  ? 'bg-white text-teal-800 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vision (CV)
            </button>
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by integrity status"
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-600"
          >
            <option value="all">All Statuses</option>
            <option value="Clean">Clean</option>
            <option value="Review">Review</option>
            <option value="Issues Found">Issues Found</option>
            <option value="Processing">Processing</option>
          </select>
        </div>
      </div>

      {/* Dataset Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : filteredDatasets.length === 0 ? (
        <EmptyState
          title="No datasets found"
          description="No datasets matched your current search filters. You can upload a new dataset to begin."
          icon={Database}
          actionLabel="Upload Dataset"
          onAction={() => setUploadModalOpen(true)}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">Dataset</th>
                  <th className="px-5 py-3 font-semibold">Type / Format</th>
                  <th className="px-5 py-3 font-semibold">Samples</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Integrity Issues</th>
                  <th className="px-5 py-3 font-semibold">Last Analysis</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDatasets.map((ds) => (
                  <tr key={ds.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3">
                      <div>
                        <button
                          onClick={() => navigate(`/datasets/${ds.id}`)}
                          className="font-semibold text-slate-900 hover:text-teal-700 text-left transition-colors truncate max-w-xs block"
                        >
                          {ds.name}
                        </button>
                        <p className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">
                          {ds.description}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {ds.type === 'tabular' ? (
                          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                        ) : (
                          <Image className="w-3.5 h-3.5 text-teal-600" />
                        )}
                        <span className="capitalize text-slate-700 font-medium">
                          {ds.type === 'computer-vision' ? 'CV' : 'Tabular'}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {ds.format}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                      {ds.sampleCount.toLocaleString()}
                    </td>

                    <td className="px-5 py-3 whitespace-nowrap">
                      <StatusBadge status={ds.status} size="sm" />
                    </td>

                    <td className="px-5 py-3 font-mono tabular-nums whitespace-nowrap">
                      {ds.issuesCount > 0 ? (
                        <span className="font-semibold text-rose-600">
                          {ds.issuesCount} detected
                        </span>
                      ) : (
                        <span className="text-emerald-600">0 flags</span>
                      )}
                    </td>

                    <td className="px-5 py-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {ds.lastAnalysis}
                    </td>

                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/datasets/${ds.id}`)}
                          className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/analysis/${ds.id}`)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded transition-colors"
                          title="Run Analysis"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(ds.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                          title="Delete Dataset"
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

      {/* Upload Dataset Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-mono">Upload Dataset</h3>
                <p className="text-xs text-slate-500">Register tabular or computer vision partitions for analysis.</p>
              </div>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files?.[0]) {
                    const file = e.dataTransfer.files[0];
                    setUploadName(file.name.replace(/\.[^/.]+$/, ''));
                    if (file.name.endsWith('.csv')) { setUploadFormat('CSV'); setUploadType('tabular'); }
                    else if (file.name.endsWith('.xlsx')) { setUploadFormat('XLSX'); setUploadType('tabular'); }
                    else if (file.name.endsWith('.zip')) { setUploadFormat('ZIP'); setUploadType('computer-vision'); }
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  dragActive ? 'border-teal-500 bg-teal-50/50' : 'border-slate-300 bg-slate-50/70 hover:border-slate-400'
                }`}
              >
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-900">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Supported mock formats: CSV, XLSX, ZIP, YOLO (.txt), COCO (.json)
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Dataset Identifier Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clinical-Trial-Phase3-Biomarkers"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Dataset Type
                  </label>
                  <select
                    value={uploadType}
                    onChange={(e) => {
                      const t = e.target.value as DatasetType;
                      setUploadType(t);
                      if (t === 'tabular') setUploadFormat('CSV');
                      else setUploadFormat('ZIP');
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                  >
                    <option value="tabular">Tabular Data</option>
                    <option value="computer-vision">Computer Vision</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Format Specification
                  </label>
                  <select
                    value={uploadFormat}
                    onChange={(e) => setUploadFormat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                  >
                    {uploadType === 'tabular' ? (
                      <>
                        <option value="CSV">CSV (.csv)</option>
                        <option value="XLSX">Excel Spreadsheet (.xlsx)</option>
                      </>
                    ) : (
                      <>
                        <option value="ZIP">Archive ZIP (images/)</option>
                        <option value="YOLO">YOLO Dataset (labels.txt)</option>
                        <option value="COCO">COCO Format (.json)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Sample Count
                  </label>
                  <input
                    type="number"
                    value={uploadSamples}
                    onChange={(e) => setUploadSamples(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Split Strategy
                  </label>
                  <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 font-mono">
                    80% Train / 20% Test
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Audit Notes / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Clinical cohort collected under IRB protocol. Suspected cross-site patient duplicate."
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white transition-colors shadow-xs"
                >
                  {isUploading ? 'Registering...' : 'Register & Ingest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Remove Dataset"
        message="Are you sure you want to remove this dataset from the assurance registry? Historical assurance reports referencing this dataset will retain static audit snapshots."
        confirmLabel="Remove Dataset"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
