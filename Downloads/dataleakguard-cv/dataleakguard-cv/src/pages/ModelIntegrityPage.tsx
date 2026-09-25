import React, { useState, useEffect } from 'react';
import {
  Cpu,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Upload,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Copy,
  Info,
  Layers,
  FileCode,
  Check
} from 'lucide-react';
import { Model } from '../types';
import { getModels, verifyModel } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';

export const ModelIntegrityPage: React.FC = () => {
  const { success, warning, error, info } = useToast();
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getModels();
        setModels(data);
        if (data.length > 0) {
          setSelectedModel(data[0]);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleVerify = async (modelId: string) => {
    setIsVerifying(true);
    setVerificationFeedback(null);
    try {
      const result = await verifyModel(modelId);
      setVerificationFeedback(result.message);
      if (result.verified) {
        success('Verification Succeeded', result.message);
      } else {
        warning('Verification Alert', result.message);
      }
      const updatedList = await getModels();
      setModels(updatedList);
      const updatedCurrent = updatedList.find((m) => m.id === modelId);
      if (updatedCurrent) setSelectedModel(updatedCurrent);
    } catch {
      error('Verification Error', 'Failed to communicate with verification node.');
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
    info('Copied', 'Hash copied to clipboard.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-teal-700 uppercase tracking-wider font-semibold">
            Model Assurance Node
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
            Model Integrity & Fingerprinting
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Validate neural weights, cryptographic SHA-256 hashes, and golden reference behaviors.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Model Artifact</span>
        </button>
      </div>

      {/* Model Table */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
              Registered Model Artifacts
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {models.length} Models in Vault
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">Model</th>
                  <th className="px-5 py-3 font-semibold">Version</th>
                  <th className="px-5 py-3 font-semibold">Format</th>
                  <th className="px-5 py-3 font-semibold">SHA-256 Checksum</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Last Verified</th>
                  <th className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {models.map((m) => {
                  const isSelected = selectedModel?.id === m.id;
                  return (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedModel(m)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-teal-50/60 border-l-2 border-l-teal-600'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="px-5 py-3 font-semibold text-slate-900">
                        {m.name}
                      </td>
                      <td className="px-5 py-3 font-mono text-slate-600">
                        {m.version}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {m.format}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-slate-600 truncate max-w-[150px]">
                        {m.sha256}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <StatusBadge status={m.status} size="sm" />
                      </td>
                      <td className="px-5 py-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {m.lastVerified}
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedModel(m);
                            handleVerify(m.id);
                          }}
                          disabled={isVerifying}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-teal-700 hover:bg-teal-800 text-white transition-colors shadow-2xs"
                        >
                          Verify
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Model Details & Deep Verification Inspection */}
      {selectedModel && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Metadata & Architecture */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-700 font-semibold">
                  Model Architecture Spec
                </span>
                <h3 className="text-base font-bold font-mono text-slate-900">
                  {selectedModel.name}
                </h3>
              </div>
              <StatusBadge status={selectedModel.status} size="sm" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="text-[11px] text-slate-500 block">Cryptographic Hash (SHA-256)</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-teal-800 break-all text-[11px] font-medium">
                    {selectedModel.sha256}
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedModel.sha256)}
                    className="p-1 text-slate-400 hover:text-slate-700 shrink-0"
                    title="Copy SHA-256"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Architecture:</span>
                  <span className="text-slate-800 text-right font-medium max-w-[180px]">{selectedModel.architecture}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Parameters:</span>
                  <span className="font-mono text-slate-800">{selectedModel.parameters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Framework:</span>
                  <span className="font-mono text-slate-800">{selectedModel.framework}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered At:</span>
                  <span className="text-slate-500 text-[11px] font-mono">{selectedModel.uploadedAt}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleVerify(selectedModel.id)}
              disabled={isVerifying}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Executing Verification...' : 'Run Integrity Verification'}</span>
            </button>
          </div>

          {/* Three Integrity Checks Breakdown */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">
                  Tripartite Integrity Checks
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Configured Test Suite
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Check 1 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">Check 01</span>
                    {selectedModel.sha256 === selectedModel.referenceHash ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900">File Hash Match</h4>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    {selectedModel.sha256 === selectedModel.referenceHash
                      ? 'SHA-256 binary hash matches stored baseline.'
                      : 'Binary modified! Hash mismatch indicates altered weights.'}
                  </p>
                </div>

                {/* Check 2 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">Check 02</span>
                    {selectedModel.fingerprintMatch ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900">Model Fingerprint</h4>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    {selectedModel.fingerprintMatch
                      ? 'Layer graph signature and tensor rank verified.'
                      : 'Operator topology drift detected in intermediate nodes.'}
                  </p>
                </div>

                {/* Check 3 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">Check 03</span>
                    {selectedModel.behaviorDriftScore < 0.05 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900">Behavioral Golden Test</h4>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Drift score: {selectedModel.behaviorDriftScore} (Threshold &lt; 0.05).
                  </p>
                </div>
              </div>

              {/* Reference Behavior Comparison Table */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-wider mb-2">
                  Golden Reference Input Tests (Behavioral Probe)
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-mono uppercase">
                      <tr>
                        <th className="px-3 py-2">Test Vector</th>
                        <th className="px-3 py-2">Expected Output</th>
                        <th className="px-3 py-2">Actual Output</th>
                        <th className="px-3 py-2 text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedModel.referenceBehaviors.map((b, i) => (
                        <tr key={i} className="hover:bg-slate-50/80">
                          <td className="px-3 py-2 font-mono text-teal-700">{b.testInput}</td>
                          <td className="px-3 py-2 text-slate-700 font-mono">{b.expectedOutput}</td>
                          <td className="px-3 py-2 text-slate-700 font-mono">{b.actualOutput}</td>
                          <td className="px-3 py-2 text-right">
                            {b.match ? (
                              <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">Pass</span>
                            ) : (
                              <span className="text-[10px] font-mono text-rose-600 font-bold uppercase">Drift</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mandatory Limitations Box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 flex items-start gap-3 text-xs text-slate-600">
              <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-800">Methodology Limitations:</strong>{' '}
                Model integrity checks depend on the model format and available access. Behavioral verification does not prove absence of all possible attacks. Verification is certified under configured test parameters.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Model Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 font-mono mb-2">Register New Model Artifact</h3>
            <p className="text-xs text-slate-500 mb-4">Supported formats: ONNX (.onnx), PyTorch (.pt, .pth), TorchScript (.torchscript)</p>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center mb-4 bg-slate-50/50">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-900">Drag and drop model binary</p>
              <p className="text-[10px] text-slate-500 mt-1">Automatic SHA-256 digest computation</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  success('Model Artifact Ingested', 'Binary digest registered in vault.');
                }}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors shadow-xs"
              >
                Register Artifact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
