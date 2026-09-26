import { AssuranceReport } from '../types';

export const initialReports: AssuranceReport[] = [
  {
    id: 'REP-2026-0042',
    title: 'Census-Income ML Pipeline Integrity Assurance Report',
    datasetId: 'ds-adult-income',
    datasetName: 'Adult Census Income Dataset (CSV)',
    modelId: 'mdl-xgboost-census',
    modelName: 'Census-GBDT Income Predictor (v3.0.2)',
    createdAt: '2026-09-24 19:30 UTC',
    assessmentStatus: 'REVIEW REQUIRED',
    disposition: 'REVIEW',
    confidenceScore: 91,
    projectDefinedRisk: 'HIGH',
    findingsCount: {
      critical: 24,
      high: 154,
      medium: 28,
      low: 8
    },
    executiveSummary: 'DataLeakGuard-CV performed automated integrity auditing across the Adult Census Income evaluation workflow. The investigation confirmed 142 duplicate leakage instances, 38 household entity overlaps, and preprocessing standardization leakage across the test boundary. When evaluation sets were cleansed and re-partitioned, reported model accuracy dropped from 97.8% to 90.4% (observed evaluation inflation of +7.4 percentage points).',
    sections: {
      datasetIntegrity: '48,842 records were evaluated against duplicate and semantic identity overlap. 214 total integrity issues were detected under current threshold parameters (similarity >= 95%). Key column distributions exhibit moderate missing value rates in workclass (5.7%) and occupation (5.7%).',
      leakageFindings: '142 duplicate records and 38 household identity bleed instances were detected spanning training and test evaluation partitions. Furthermore, global preprocessing standardization was fitted on the combined corpus prior to partitioning, allowing test split variance statistics to bias model weights.',
      datasetAnomalies: '12 target leakage instances were identified where post-event capital gain settlement figures directly disclosed income bracket status prior to decision time. 8 temporal sequence inversions were noted in census survey tracking dates.',
      modelIntegrity: 'Census-GBDT Income Predictor was verified against stored reference SHA-256 (e89d...90ab). File hash and tree architecture matched the registered cryptographic manifest. Behavioral drift test against 100 golden benchmark vectors showed 0.00% drift.',
      inferenceProvenance: 'Inference signing test verified 1,040 production logs. All verified records satisfied HMAC-SHA256 signature and sequential nonce constraints. Cryptographic tamper checks correctly detected single-bit modification simulations.',
      distributionShift: 'Population Stability Index (PSI = 0.184) reflects a potential distribution shift in capital_gain and hours_per_week attributes compared to the reference population baseline.',
      performanceImpact: 'Model performance on the contaminated benchmark (97.8% Accuracy, 96.9% F1) dropped to 90.4% Accuracy and 89.7% F1 on the quarantined and cleansed partition. This represents an estimated evaluation inflation of +7.4% resulting from train-test leakage.',
      evidence: 'Evidence includes 142 pair-wise feature collision vectors, household fnlwgt match tables, and cryptographic hash logs linked in the audit appendix.',
      riskAssessment: 'Project-defined risk is assessed as HIGH due to significant performance inflation (+7.4%) and extensive duplicate leakage that invalidates production readiness estimates.',
      limitations: [
        'Integrity verification is bounded by configured similarity metrics (exact hash and cosine >= 0.95).',
        'Entity linkage relies on observed demographic fingerprints and cannot resolve pseudonymized records lacking matching keys.',
        'Behavioral drift verification is evaluated only against supplied test vectors and does not guarantee absence of adversarial edge cases.'
      ],
      recommendedDisposition: 'REVIEW: Quarantine 180 contaminated records, rebuild the preprocessing pipeline to compute transformers strictly on training splits, and retrain before production deployment.'
    }
  },
  {
    id: 'REP-2026-0041',
    title: 'Chest Radiograph CV Diagnostic Assurance Report',
    datasetId: 'ds-chest-xray',
    datasetName: 'Chest X-Ray Pneumonia CV Cohort (ZIP)',
    modelId: 'mdl-resnet50-eval',
    modelName: 'ResNet-50 ChestXRay Classifier (v2.4.1)',
    createdAt: '2026-09-24 14:15 UTC',
    assessmentStatus: 'REVIEW REQUIRED',
    disposition: 'REVIEW',
    confidenceScore: 88,
    projectDefinedRisk: 'ELEVATED',
    findingsCount: {
      critical: 34,
      high: 21,
      medium: 13,
      low: 0
    },
    executiveSummary: 'Computer vision integrity checks revealed 34 near-duplicate radiograph pairs across train and test partitions caused by repeated exposures of individual patients. Retrained evaluation on patient-partitioned splits demonstrated 6.5 percentage points of diagnostic accuracy inflation.',
    sections: {
      datasetIntegrity: '5,856 radiographs inspected using perceptual hash (pHash) and vision transformer embedding distance. 34 cross-split pairs showed perceptual similarity >= 0.96.',
      leakageFindings: 'Patient identifiers PT-9014 and PT-4122 were split across train and validation sets, allowing spatial anatomical features to leak directly into the test suite.',
      datasetAnomalies: '7 label disagreement anomalies were detected where visually indistinguishable lung consolidations carried conflicting viral vs. bacterial classifications. 6 out-of-distribution pacemakers were flagged.',
      modelIntegrity: 'Model binary verified under configured SHA-256 check. Zero file tampering detected on ONNX deployment artifact.',
      inferenceProvenance: 'Inference provenance pipeline operating normally. Golden test inferences matched signed outputs with valid ECDSA signatures.',
      distributionShift: 'No significant distribution shift detected between hospital site cohorts (Wasserstein distance < 0.05).',
      performanceImpact: 'Corrected evaluation shows true generalization accuracy of 88.1% vs contaminated reported accuracy of 94.6%.',
      evidence: 'Embedding cluster graphs, perceptual difference heatmaps, and DICOM header audit trails archived.',
      riskAssessment: 'ELEVATED risk: Diagnostic performance reported in preliminary validation is artificially boosted by patient identity duplication.',
      limitations: [
        'Near-duplicate detection threshold set at cosine similarity 0.96; subtle lighting or rotation variations below this limit were not flagged.',
        'Assurance report represents findings under supported integrity checks only and does not certify medical clinical efficacy.'
      ],
      recommendedDisposition: 'REVIEW: Enforce patient-level group cross-validation splits and re-verify baseline diagnostic precision.'
    }
  }
];
