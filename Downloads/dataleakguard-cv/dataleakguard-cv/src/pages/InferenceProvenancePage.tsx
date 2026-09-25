import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Play,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileCode,
  Image,
  Layers,
  Copy,
  Info,
  Sliders,
  Check
} from 'lucide-react';
import { InferenceRecord, Model } from '../types';
import {
  getInferenceRecords,
  getModels,
  runInference,
  simulateTampering,
  simulateReplay,
  verifyProvenanceRecord
} from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';

export const InferenceProvenancePage: React.FC = () => {
  const { success, warning, error, info } = useToast();

  const [records, setRecords] = useState<InferenceRecord[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulator controls
  const [selectedModelId, setSelectedModelId] = useState('mdl-resnet50-eval');
  const [selectedInputName, setSelectedInputName] = useState('sample_patient_xray_901.png');
  const [selectedConfig, setSelectedConfig] = useState('clahe_clip=2.0_tile=8x8_norm=imagenet');
  const [isSimulating, setIsSimulating] = useState(false);

  // Active / Selected record for audit
  const [activeRecord, setActiveRecord] = useState<InferenceRecord | null>(null);
  const [tamperedConfidence, setTamperedConfidence] = useState(0.42);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    status: string;
    details: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      const [recs, mdls] = await Promise.all([getInferenceRecords(), getModels()]);
      setRecords(recs);
      setModels(mdls);
      if (recs.length > 0 && !activeRecord) {
        setActiveRecord(recs[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleRunInference = async () => {
    setIsSimulating(true);
    setVerificationResult(null);
    try {
      const newRec = await runInference({
        modelId: selectedModelId,
        imageOrVectorName: selectedInputName,
        config: selectedConfig
      });
      success('Inference Provenance Generated', `Record ${newRec.id} cryptographically signed.`);
      setActiveRecord(newRec);
      await fetchRecords();
    } catch {
      error('Inference Error', 'Failed to execute inference pipeline.');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSimulateTamper = async () => {
    if (!activeRecord) return;
    try {
      const updated = await simulateTampering(activeRecord.id, tamperedConfidence);
      if (updated) {
        setActiveRecord(updated);
        warning('Output Tampered (Simulation)', 'Payload confidence was modified without re-signing.');
        await fetchRecords();
      }
    } catch {
      error('Simulation Failed', 'Could not apply tampering mutation.');
    }
  };

  const handleSimulateReplay = async () => {
    if (!activeRecord) return;
    try {
      const updated = await simulateReplay(activeRecord.id);
      if (updated) {
        setActiveRecord(updated);
        warning('Replay Injected (Simulation)', 'Retired nonce reintroduced into execution log.');
        await fetchRecords();
      }
    } catch {
      error('Simulation Failed', 'Could not inject replay anomaly.');
    }
  };

  const handleVerifyProvenance = async (recordId: string) => {
    try {
      const res = await verifyProvenanceRecord(recordId);
      setVerificationResult(res);
      if (res.verified) {
        success('Provenance Verified', res.details);
      } else {
        error(res.status === 'Tampered' ? 'Tampering Detected' : 'Replay Detected', res.details);
      }
      await fetchRecords();
    } catch {
      error('Verification Error', 'Failed to check cryptographic signature.');
    }
  };

  const copyField = (label: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
    info('Copied', `${label} copied to clipboard.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-teal-700 uppercase tracking-wider font-semibold">
            Cryptographic Audit Node
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
            Inference Provenance & Anti-Tamper Verification
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit verifiable inference chains with cryptographic input-output hashing and HMAC digital signatures.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 self-start sm:self-auto flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>HMAC-SHA256 Signing Active</span>
        </span>
      </div>

      {/* Simulator Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Live Inference Simulator
            </h3>
            <p className="text-xs text-slate-500">
              Execute neural inference and generate an immutable cryptographic provenance record.
            </p>
          </div>
          <span className="text-xs font-mono text-teal-700 font-medium">Execution Sandbox</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Select Input Vector / Radiograph
            </label>
            <select
              value={selectedInputName}
              onChange={(e) => setSelectedInputName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600"
            >
              <option value="sample_patient_xray_901.png">sample_patient_xray_901.png (Chest X-Ray)</option>
              <option value="pcb_batch_9901_panel_b.jpg">pcb_batch_9901_panel_b.jpg (PCB Surface Defect)</option>
              <option value="vector_record_89112.json">vector_record_89112.json (Census Tabular Vector)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Target Verified Model
            </label>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.format})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Preprocessing Pipeline Spec
            </label>
            <select
              value={selectedConfig}
              onChange={(e) => setSelectedConfig(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-600"
            >
              <option value="clahe_clip=2.0_tile=8x8_norm=imagenet">CLAHE (clip=2.0, tile=8x8) + ImageNet Norm</option>
              <option value="yolo_letterbox_stride32_scale=640">YOLO Letterbox (stride=32, scale=640)</option>
              <option value="onehot_encoder_standardscaler_v3">OneHot + Isolated StandardScaler v3</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleRunInference}
            disabled={isSimulating}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white transition-colors flex items-center gap-2 shadow-xs"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Generating Signed Trace...' : 'Run Inference'}</span>
          </button>
        </div>
      </div>

      {/* Selected Provenance Record Details & Attack Simulation Workspace */}
      {activeRecord && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prediction and Visual Representation */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-700 font-semibold">
                  Model Output Payload
                </span>
                <h3 className="text-base font-bold font-mono text-slate-900">
                  {activeRecord.id}
                </h3>
              </div>
              <StatusBadge status={activeRecord.verificationStatus} size="sm" />
            </div>

            {/* Prediction Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Primary Classification:</span>
                <span className="text-sm font-bold font-mono text-teal-800">
                  {activeRecord.prediction.label}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-500">Confidence Score:</span>
                  <span className="tabular-nums font-bold text-slate-900">
                    {(activeRecord.prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all"
                    style={{ width: `${activeRecord.prediction.confidence * 100}%` }}
                  />
                </div>
              </div>

              {activeRecord.prediction.secondaryClass && (
                <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
                  <span>Alt: {activeRecord.prediction.secondaryClass}</span>
                  <span>{((activeRecord.prediction.secondaryConfidence || 0) * 100).toFixed(1)}%</span>
                </div>
              )}

              {/* Bounding box mock indicator for CV models */}
              {activeRecord.prediction.boundingBoxes && activeRecord.prediction.boundingBoxes.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-mono text-slate-500 block mb-1">
                    Detected Bounding Annotations:
                  </span>
                  <div className="space-y-1">
                    {activeRecord.prediction.boundingBoxes.map((b, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] font-mono text-slate-700">
                        <span>{b.label}</span>
                        <span className="text-teal-700 tabular-nums">{(b.confidence * 100).toFixed(0)}% [x:{b.box[0]}, y:{b.box[1]}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input metadata details */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Input Asset:</span>
                <span className="text-slate-800 truncate max-w-[160px]">{activeRecord.inputMetadata.filename}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Dimensions:</span>
                <span className="text-slate-800">{activeRecord.inputMetadata.dimensions}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Timestamp:</span>
                <span className="text-slate-700">{activeRecord.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Manifest & Tamper Simulation Workspace */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">
                  Cryptographic Provenance Manifest
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Sequence #{activeRecord.sequenceNumber}
                </span>
              </div>

              {/* Hash Chain Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                    <span>Input Hash (SHA-256)</span>
                    <button onClick={() => copyField('Input Hash', activeRecord.inputHash)} className="hover:text-teal-700">
                      {copiedField === 'Input Hash' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>
                  </div>
                  <span className="font-mono text-teal-800 break-all text-[11px] block font-medium">
                    {activeRecord.inputHash}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                    <span>Output Hash (SHA-256)</span>
                    <button onClick={() => copyField('Output Hash', activeRecord.outputHash)} className="hover:text-teal-700">
                      {copiedField === 'Output Hash' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>
                  </div>
                  <span className="font-mono text-teal-800 break-all text-[11px] block font-medium">
                    {activeRecord.outputHash}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                    <span>Configuration Hash</span>
                    <button onClick={() => copyField('Config Hash', activeRecord.configHash)} className="hover:text-teal-700">
                      {copiedField === 'Config Hash' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>
                  </div>
                  <span className="font-mono text-slate-700 break-all text-[11px] block">
                    {activeRecord.configHash}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex justify-between text-slate-500 text-[11px] mb-1">
                    <span>Nonce & Sequence:</span>
                    <span className="text-slate-400 font-mono">Anti-Replay</span>
                  </div>
                  <span className="font-mono text-slate-800 block text-xs">
                    {activeRecord.nonce} · Seq: {activeRecord.sequenceNumber}
                  </span>
                </div>
              </div>

              {/* Digital Signature */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 block mb-1 font-mono">ECDSA Digital Signature (Base64)</span>
                <span className="font-mono text-emerald-700 text-[11px] break-all block font-medium">
                  {activeRecord.digitalSignature}
                </span>
              </div>

              {/* Attack Simulations (Tampering & Replay) */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono block">
                  Adversarial Simulation Harness
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Tamper Output Button */}
                  <button
                    onClick={handleSimulateTamper}
                    className="p-3 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100/70 text-rose-900 text-xs font-semibold text-left transition-colors flex flex-col justify-between shadow-2xs"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span>Simulate Tampering</span>
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                    </div>
                    <span className="text-[11px] font-normal text-rose-700">
                      Alter prediction confidence from {(activeRecord.prediction.confidence * 100).toFixed(0)}% to 42%
                    </span>
                  </button>

                  {/* Replay Record Button */}
                  <button
                    onClick={handleSimulateReplay}
                    className="p-3 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100/70 text-amber-900 text-xs font-semibold text-left transition-colors flex flex-col justify-between shadow-2xs"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span>Simulate Replay</span>
                      <RotateCcw className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-[11px] font-normal text-amber-700">
                      Inject retired nonce to test replay rejection
                    </span>
                  </button>

                  {/* Verify Provenance Button */}
                  <button
                    onClick={() => handleVerifyProvenance(activeRecord.id)}
                    className="p-3 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100/70 text-teal-900 text-xs font-semibold text-left transition-colors flex flex-col justify-between shadow-2xs"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span>Verify Record</span>
                      <ShieldCheck className="w-4 h-4 text-teal-700" />
                    </div>
                    <span className="text-[11px] font-normal text-teal-700">
                      Recompute hash tree & validate signature
                    </span>
                  </button>
                </div>

                {/* Verification result feedback banner */}
                {verificationResult && (
                  <div
                    className={`p-3.5 rounded-lg border flex items-start gap-2.5 text-xs animate-in fade-in duration-150 ${
                      verificationResult.verified
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : verificationResult.status === 'Tampered'
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    {verificationResult.verified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold font-mono">
                        {verificationResult.verified
                          ? 'PROVENANCE VERIFIED'
                          : verificationResult.status === 'Tampered'
                          ? 'TAMPERING DETECTED'
                          : 'REPLAY DETECTED'}
                      </p>
                      <p className="mt-0.5 opacity-90 leading-relaxed">
                        {verificationResult.details}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provenance History Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
            Historical Provenance Ledger
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {records.length} Signed Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Record ID</th>
                <th className="px-4 py-3 font-semibold">Timestamp</th>
                <th className="px-4 py-3 font-semibold">Model</th>
                <th className="px-4 py-3 font-semibold">Input Hash</th>
                <th className="px-4 py-3 font-semibold">Output Hash</th>
                <th className="px-4 py-3 font-semibold">Verification</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => {
                const isSelected = activeRecord?.id === r.id;
                return (
                  <tr
                    key={r.id}
                    onClick={() => {
                      setActiveRecord(r);
                      setVerificationResult(null);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-teal-50/60 border-l-2 border-l-teal-600'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-teal-800 whitespace-nowrap">
                      {r.id}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {r.timestamp}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap font-medium">
                      {r.modelName.split(' ')[0]}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 truncate max-w-[120px]">
                      {r.inputHash}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 truncate max-w-[120px]">
                      {r.outputHash}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={r.verificationStatus} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveRecord(r);
                          handleVerifyProvenance(r.id);
                        }}
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
    </div>
  );
};
