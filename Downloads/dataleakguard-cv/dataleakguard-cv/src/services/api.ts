/**
 * DataLeakGuard-CV Mock API Service Layer
 * 
 * NOTE FOR BACKEND INTEGRATION:
 * This module is designed to be a direct 1:1 drop-in replacement for a FastAPI backend.
 * Each function returns a Promise. When migrating to FastAPI:
 * Replace mock storage updates with standard `fetch('/api/v1/...')` calls.
 * 
 * Example:
 * export async function getDatasets(): Promise<Dataset[]> {
 *   const res = await fetch('/api/v1/datasets');
 *   return res.json();
 * }
 */

import {
  Dataset,
  LeakageFinding,
  LeakageCategoryOverview,
  AnalysisResult,
  AnalysisStage,
  RepairItem,
  RepairResult,
  Model,
  InferenceRecord,
  DistributionShift,
  ImpactAnalysis,
  AssuranceReport,
  Activity
} from '../types';

import { initialDatasets } from '../data/mockDatasets';
import { mockCategoryOverviews, mockDetailedFindings } from '../data/mockFindings';
import { initialModels } from '../data/mockModels';
import { initialInferenceRecords } from '../data/mockInference';
import { mockImpactData, mockDistributionShiftData } from '../data/mockImpact';
import { initialReports } from '../data/mockReports';
import { initialActivities } from '../data/mockActivities';

// In-memory state holding dynamic modifications
let datasetsStore: Dataset[] = [...initialDatasets];
let findingsStore: LeakageFinding[] = [...mockDetailedFindings];
let modelsStore: Model[] = [...initialModels];
let inferenceStore: InferenceRecord[] = [...initialInferenceRecords];
let reportsStore: AssuranceReport[] = [...initialReports];
let activitiesStore: Activity[] = [...initialActivities];

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// DATASET OPERATIONS
// ==========================================

export async function getDatasets(): Promise<Dataset[]> {
  await delay(250);
  return [...datasetsStore];
}

export async function getDatasetById(id: string): Promise<Dataset | null> {
  await delay(200);
  const found = datasetsStore.find((d) => d.id === id);
  return found ? { ...found } : null;
}

export async function uploadDataset(payload: {
  name: string;
  type: 'tabular' | 'computer-vision';
  format: 'CSV' | 'XLSX' | 'ZIP' | 'YOLO' | 'COCO';
  description: string;
  sampleCount?: number;
}): Promise<Dataset> {
  await delay(600);
  const newDataset: Dataset = {
    id: `ds-${Date.now().toString(36)}`,
    name: payload.name,
    type: payload.type,
    format: payload.format,
    sampleCount: payload.sampleCount || (payload.type === 'tabular' ? 12500 : 2400),
    featureCount: payload.type === 'tabular' ? 18 : 4,
    classCount: payload.type === 'tabular' ? 2 : 5,
    status: 'Processing',
    issuesCount: 0,
    uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    lastAnalysis: 'Not analyzed yet',
    description: payload.description,
    columns: payload.type === 'tabular' ? [
      { name: 'id', type: 'integer', missingCount: 0, uniqueCount: 12500 },
      { name: 'feature_a', type: 'numeric', missingCount: 12, uniqueCount: 840 },
      { name: 'feature_b', type: 'categorical', missingCount: 0, uniqueCount: 4 },
      { name: 'label', type: 'categorical', missingCount: 0, uniqueCount: 2 }
    ] : undefined,
    cvStats: payload.type === 'computer-vision' ? {
      imageCount: 2400,
      classes: ['class_0', 'class_1', 'class_2'],
      annotationsCount: 3120,
      nearDuplicatePairsCount: 0,
      resolutionDistribution: [
        { label: '1024x1024', count: 1800 },
        { label: '512x512', count: 600 }
      ]
    } : undefined
  };

  datasetsStore = [newDataset, ...datasetsStore];
  activitiesStore = [
    {
      id: `act-${Date.now()}`,
      type: 'dataset_analyzed',
      title: 'Dataset Uploaded',
      description: `Uploaded ${newDataset.name} (${newDataset.format}, ${newDataset.sampleCount} samples).`,
      timestamp: 'Just now',
      targetId: newDataset.id,
      severity: 'Low'
    },
    ...activitiesStore
  ];

  return newDataset;
}

export async function deleteDataset(id: string): Promise<boolean> {
  await delay(300);
  datasetsStore = datasetsStore.filter((d) => d.id !== id);
  return true;
}

// ==========================================
// ANALYSIS OPERATIONS
// ==========================================

export async function runDatasetAnalysis(
  datasetId: string,
  onProgress?: (stageIndex: number, stageName: string) => void
): Promise<AnalysisResult> {
  const stageNames = [
    'Dataset Profiling',
    'Duplicate Detection',
    'Leakage Detection',
    'Label Analysis',
    'OOD Analysis',
    'Distribution Analysis',
    'Risk Assessment',
    'Report Generation'
  ];

  const stages: AnalysisStage[] = stageNames.map((name, idx) => ({
    id: idx + 1,
    name,
    status: 'pending',
    findingsCount: 0,
    durationMs: 0,
    description: `Executing ${name.toLowerCase()} algorithms across partitions.`
  }));

  for (let i = 0; i < stages.length; i++) {
    stages[i].status = 'running';
    if (onProgress) onProgress(i, stages[i].name);
    await delay(350);
    stages[i].status = 'completed';
    stages[i].durationMs = Math.floor(Math.random() * 400) + 200;
    stages[i].findingsCount = i === 1 ? 142 : i === 2 ? 50 : i === 3 ? 12 : i === 4 ? 6 : 0;
  }

  // Update dataset status to Issues Found or Review
  const ds = datasetsStore.find((d) => d.id === datasetId);
  if (ds) {
    ds.status = 'Issues Found';
    ds.issuesCount = 214;
    ds.lastAnalysis = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  }

  const result: AnalysisResult = {
    id: `ans-${Date.now().toString(36)}`,
    datasetId,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    stages,
    summary: {
      totalFindings: 214,
      duplicateFindings: 142,
      entityFindings: 38,
      targetFindings: 12,
      temporalFindings: 8,
      preprocessingFindings: 14,
      contaminationFindings: 24,
      cvNearDuplicates: 34,
      labelAnomalies: 7,
      oodSamples: 6,
      overallRiskScore: 84,
      overallRiskLevel: 'HIGH'
    }
  };

  activitiesStore = [
    {
      id: `act-${Date.now()}`,
      type: 'leakage_detected',
      title: 'Integrity Analysis Completed',
      description: `Analysis on dataset ${datasetId} concluded with 214 detected integrity findings.`,
      timestamp: 'Just now',
      targetId: datasetId,
      severity: 'High'
    },
    ...activitiesStore
  ];

  return result;
}

export async function getCategoryOverviews(datasetId: string): Promise<LeakageCategoryOverview[]> {
  await delay(200);
  return mockCategoryOverviews[datasetId] || mockCategoryOverviews['ds-adult-income'];
}

export async function getFindings(datasetId?: string): Promise<LeakageFinding[]> {
  await delay(250);
  if (datasetId) {
    return findingsStore.filter((f) => f.datasetId === datasetId);
  }
  return [...findingsStore];
}

export async function getFindingById(findingId: string): Promise<LeakageFinding | null> {
  await delay(150);
  const f = findingsStore.find((item) => item.id === findingId);
  return f ? { ...f } : null;
}

export async function updateFindingStatus(findingId: string, status: 'Detected' | 'Under Review' | 'Repaired' | 'Quarantined'): Promise<boolean> {
  await delay(200);
  const item = findingsStore.find((f) => f.id === findingId);
  if (item) {
    item.status = status;
    return true;
  }
  return false;
}

// ==========================================
// REPAIR & EVALUATION OPERATIONS
// ==========================================

export async function getRepairItems(datasetId: string): Promise<RepairItem[]> {
  await delay(200);
  return [
    {
      id: 'rep-01',
      findingId: 'DL-102',
      type: 'duplicate',
      title: 'Cross-Split Exact Duplicates',
      description: '142 exact feature row matches between train and test evaluation splits.',
      count: 142,
      severity: 'High',
      recommendedAction: 'remove',
      selected: true
    },
    {
      id: 'rep-02',
      findingId: 'EL-044',
      type: 'entity',
      title: 'Household / Subject Identity Overlap',
      description: '38 patient/household clusters appearing in both evaluation groups.',
      count: 38,
      severity: 'Critical',
      recommendedAction: 'quarantine',
      selected: true
    },
    {
      id: 'rep-03',
      findingId: 'TL-019',
      type: 'target',
      title: 'Target Proxies (Post-decision Capital Gains)',
      description: '12 records where capital settlement directly reveals outcome.',
      count: 12,
      severity: 'High',
      recommendedAction: 'sanitize',
      selected: true
    },
    {
      id: 'rep-04',
      findingId: 'PL-008',
      type: 'preprocessing',
      title: 'Global Normalization Transformer Leakage',
      description: 'Rebuild pipeline transformers strictly on training partition folds.',
      count: 1,
      severity: 'High',
      recommendedAction: 'repartition',
      selected: true
    }
  ];
}

export async function executeRepair(
  datasetId: string,
  selectedActionIds: string[]
): Promise<RepairResult> {
  await delay(800);
  const result: RepairResult = {
    id: `rep-res-${Date.now()}`,
    datasetId,
    originalCount: 48842,
    removedCount: 142,
    quarantinedCount: 38,
    retainedCount: 48662,
    reviewedCount: 180,
    completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    downloadFilename: `dataleakguard_cleansed_${datasetId}.csv`
  };

  activitiesStore = [
    {
      id: `act-${Date.now()}`,
      type: 'repair_completed',
      title: 'Corrected Dataset Created',
      description: `Quarantined 38 identity leaks and removed 142 exact duplicates from ${datasetId}.`,
      timestamp: 'Just now',
      targetId: datasetId,
      severity: 'Low'
    },
    ...activitiesStore
  ];

  return result;
}

export async function retrainModel(
  datasetId: string,
  modelId: string,
  onStep?: (pct: number, message: string) => void
): Promise<ImpactAnalysis> {
  const steps = [
    { pct: 20, msg: 'Loading sanitized training partition...' },
    { pct: 45, msg: 'Rebuilding isolated feature scaler and one-hot encoders...' },
    { pct: 70, msg: 'Retraining GBDT estimators under 5-fold stratified cross-validation...' },
    { pct: 90, msg: 'Evaluating on leak-free test partition...' },
    { pct: 100, msg: 'Computing performance delta & evaluation inflation metrics...' }
  ];

  for (const step of steps) {
    if (onStep) onStep(step.pct, step.msg);
    await delay(300);
  }

  return mockImpactData[datasetId] || mockImpactData['ds-adult-income'];
}

// ==========================================
// IMPACT ANALYSIS
// ==========================================

export async function getImpactAnalysis(datasetId: string): Promise<ImpactAnalysis> {
  await delay(200);
  return mockImpactData[datasetId] || mockImpactData['ds-adult-income'];
}

// ==========================================
// MODEL INTEGRITY
// ==========================================

export async function getModels(): Promise<Model[]> {
  await delay(200);
  return [...modelsStore];
}

export async function getModelById(id: string): Promise<Model | null> {
  await delay(150);
  const found = modelsStore.find((m) => m.id === id);
  return found ? { ...found } : null;
}

export async function verifyModel(modelId: string): Promise<{
  verified: boolean;
  status: Model['status'];
  sha256Match: boolean;
  fingerprintMatch: boolean;
  behaviorScore: number;
  message: string;
}> {
  await delay(500);
  const model = modelsStore.find((m) => m.id === modelId);
  if (!model) {
    return {
      verified: false,
      status: 'Not Available',
      sha256Match: false,
      fingerprintMatch: false,
      behaviorScore: 1.0,
      message: 'Model artifact not found in registry.'
    };
  }

  const shaMatch = model.sha256 === model.referenceHash;
  const status = shaMatch && model.behaviorDriftScore < 0.01 ? 'Verified' : !shaMatch ? 'Changed' : 'Review Required';
  model.status = status;
  model.lastVerified = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  activitiesStore = [
    {
      id: `act-${Date.now()}`,
      type: 'model_verified',
      title: `Model Verification (${model.name})`,
      description: shaMatch ? 'Cryptographic SHA-256 and golden behavior matched registered spec.' : 'SHA-256 binary hash mismatch detected.',
      timestamp: 'Just now',
      targetId: model.id,
      severity: shaMatch ? 'Low' : 'Critical'
    },
    ...activitiesStore
  ];

  return {
    verified: shaMatch,
    status,
    sha256Match: shaMatch,
    fingerprintMatch: model.fingerprintMatch,
    behaviorScore: model.behaviorDriftScore,
    message: shaMatch
      ? 'Verified under configured checks: File hash and behavioral golden vectors match specification.'
      : 'Potential issue detected: SHA-256 checksum differed from stored baseline.'
  };
}

// ==========================================
// INFERENCE PROVENANCE
// ==========================================

export async function getInferenceRecords(): Promise<InferenceRecord[]> {
  await delay(200);
  return [...inferenceStore];
}

export async function runInference(payload: {
  modelId: string;
  imageOrVectorName: string;
  config: string;
}): Promise<InferenceRecord> {
  await delay(500);
  const model = modelsStore.find((m) => m.id === payload.modelId) || modelsStore[0];
  
  const isCV = payload.imageOrVectorName.includes('.jpg') || payload.imageOrVectorName.includes('.png');
  const isChest = payload.imageOrVectorName.includes('xray') || model.id.includes('resnet');

  const record: InferenceRecord = {
    id: `PRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    modelId: model.id,
    modelName: `${model.name} (${model.version})`,
    inputHash: '7f9a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcd',
    outputHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    configHash: '01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b',
    nonce: `0x${Math.floor(Math.random() * 0xffffffff).toString(16)}`,
    sequenceNumber: 1043 + inferenceStore.length,
    digitalSignature: 'MEQCIDx489f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8AiBy781c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b==',
    verificationStatus: 'Verified',
    prediction: isCV ? (isChest ? {
      label: 'Normal',
      confidence: 0.978,
      secondaryClass: 'Bacterial Pneumonia',
      secondaryConfidence: 0.018,
      boundingBoxes: [
        { label: 'Clear Lung Field', box: [18, 20, 30, 52], confidence: 0.95 },
        { label: 'Clear Lung Field', box: [54, 22, 32, 50], confidence: 0.96 }
      ]
    } : {
      label: 'missing_hole',
      confidence: 0.942,
      secondaryClass: 'spurious_copper',
      secondaryConfidence: 0.045,
      boundingBoxes: [
        { label: 'missing_hole', box: [38, 42, 16, 20], confidence: 0.94 }
      ]
    }) : {
      label: '<=50K',
      confidence: 0.925,
      secondaryClass: '>50K',
      secondaryConfidence: 0.075
    },
    inputMetadata: {
      filename: payload.imageOrVectorName,
      dimensions: isCV ? '1024x1024' : '14 Features',
      sizeKb: isCV ? 1840 : 1.2,
      preprocessingConfig: payload.config
    }
  };

  inferenceStore = [record, ...inferenceStore];
  return record;
}

export async function simulateTampering(recordId: string, modifiedConfidence: number): Promise<InferenceRecord | null> {
  await delay(300);
  const rec = inferenceStore.find((r) => r.id === recordId);
  if (!rec) return null;

  rec.prediction.confidence = modifiedConfidence;
  rec.verificationStatus = 'Tampered';
  rec.tamperedFields = ['prediction.confidence', 'digitalSignature'];
  return { ...rec };
}

export async function simulateReplay(recordId: string): Promise<InferenceRecord | null> {
  await delay(300);
  const rec = inferenceStore.find((r) => r.id === recordId);
  if (!rec) return null;

  rec.verificationStatus = 'Replay Detected';
  return { ...rec };
}

export async function verifyProvenanceRecord(recordId: string): Promise<{
  verified: boolean;
  status: 'Verified' | 'Tampered' | 'Replay Detected';
  details: string;
}> {
  await delay(350);
  const rec = inferenceStore.find((r) => r.id === recordId);
  if (!rec) {
    return { verified: false, status: 'Tampered', details: 'Record not found in cryptographic log.' };
  }

  if (rec.verificationStatus === 'Tampered') {
    return {
      verified: false,
      status: 'Tampered',
      details: 'TAMPERING DETECTED: The payload hash or output confidence does not match the registered digital signature.'
    };
  }

  if (rec.verificationStatus === 'Replay Detected') {
    return {
      verified: false,
      status: 'Replay Detected',
      details: 'REPLAY DETECTED: Nonce or sequence number has already been retired in previous log epoch.'
    };
  }

  return {
    verified: true,
    status: 'Verified',
    details: 'PROVENANCE VERIFIED: Hash chain, sequence number, and digital signature verified under configured checks.'
  };
}

// ==========================================
// DISTRIBUTION SHIFT
// ==========================================

export async function getDistributionShift(): Promise<DistributionShift> {
  await delay(250);
  return { ...mockDistributionShiftData };
}

// ==========================================
// REPORTS
// ==========================================

export async function getReports(): Promise<AssuranceReport[]> {
  await delay(200);
  return [...reportsStore];
}

export async function getReportById(id: string): Promise<AssuranceReport | null> {
  await delay(200);
  const rep = reportsStore.find((r) => r.id === id);
  return rep ? { ...rep } : null;
}

export async function generateAssuranceReport(datasetId: string, modelId: string): Promise<AssuranceReport> {
  await delay(700);
  const ds = datasetsStore.find((d) => d.id === datasetId) || datasetsStore[0];
  const mdl = modelsStore.find((m) => m.id === modelId) || modelsStore[0];

  const newReport: AssuranceReport = {
    id: `REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `${ds.name} Assurance Report`,
    datasetId: ds.id,
    datasetName: `${ds.name} (${ds.format})`,
    modelId: mdl.id,
    modelName: `${mdl.name} (${mdl.version})`,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    assessmentStatus: 'REVIEW REQUIRED',
    disposition: 'REVIEW',
    confidenceScore: 89,
    projectDefinedRisk: 'HIGH',
    findingsCount: {
      critical: 24,
      high: 142,
      medium: 18,
      low: 4
    },
    executiveSummary: `Automated assurance audit conducted on ${ds.name} using model ${mdl.name}. Detected leakage patterns across validation splits resulting in observed evaluation inflation.`,
    sections: {
      datasetIntegrity: `${ds.sampleCount} records evaluated against duplicate, entity, and temporal integrity vectors.`,
      leakageFindings: 'Multiple cross-split duplicate pairs identified along with global preprocessing leakage.',
      datasetAnomalies: 'Label consistency checks flagged potential label disagreement across identical feature profiles.',
      modelIntegrity: `Model ${mdl.name} verified against SHA-256 fingerprint. Architecture matches stored specification.`,
      inferenceProvenance: 'Inference signing verified HMAC and sequence ordering under configured criteria.',
      distributionShift: 'Distribution analysis shows moderate shift across numerical feature distributions.',
      performanceImpact: 'Observed evaluation inflation of +7.4% between contaminated baseline and corrected evaluation.',
      evidence: 'Appendix contains complete list of flagged hash pairs and statistical divergence scores.',
      riskAssessment: 'Project-defined risk assessed as HIGH due to observed evaluation discrepancy.',
      limitations: [
        'Checks bounded by configured threshold parameters (similarity >= 95%).',
        'Not a guarantee against undetectable covert adversarial perturbations.'
      ],
      recommendedDisposition: 'REVIEW: Quarantine flagged entries and retrain using isolated validation pipeline.'
    }
  };

  reportsStore = [newReport, ...reportsStore];
  activitiesStore = [
    {
      id: `act-${Date.now()}`,
      type: 'report_generated',
      title: 'Assurance Report Generated',
      description: `Compiled assurance report ${newReport.id} for ${ds.name}.`,
      timestamp: 'Just now',
      targetId: newReport.id,
      severity: 'Medium'
    },
    ...activitiesStore
  ];

  return newReport;
}

export async function deleteReport(id: string): Promise<boolean> {
  await delay(200);
  reportsStore = reportsStore.filter((r) => r.id !== id);
  return true;
}

// ==========================================
// ACTIVITIES & METRICS
// ==========================================

export async function getActivities(): Promise<Activity[]> {
  await delay(150);
  return [...activitiesStore];
}

export async function getDashboardStats() {
  await delay(200);
  return {
    datasetsAnalyzed: datasetsStore.length,
    issuesDetected: datasetsStore.reduce((acc, d) => acc + d.issuesCount, 0),
    modelsVerified: modelsStore.length,
    reportsGenerated: reportsStore.length,
    criticalFindings: 24,
    performanceInflation: '+7.4%',
    distributionShifts: 1,
    provenanceRecords: inferenceStore.length,
    overallPipelineStatus: 'REVIEW REQUIRED',
    overallConfidence: 91
  };
}
