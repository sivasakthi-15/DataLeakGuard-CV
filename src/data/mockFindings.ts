import { LeakageFinding, LeakageCategoryOverview } from '../types';

export const mockCategoryOverviews: Record<string, LeakageCategoryOverview[]> = {
  'ds-adult-income': [
    {
      type: 'duplicate',
      label: 'Duplicate Leakage',
      status: 'Detected',
      findingsCount: 142,
      confidence: 98,
      severity: 'High',
      shortExplanation: 'Exact feature matches observed across train and test evaluation boundaries, artificially buffering test accuracy.'
    },
    {
      type: 'entity',
      label: 'Entity / Identity Leakage',
      status: 'Detected',
      findingsCount: 38,
      confidence: 94,
      severity: 'Critical',
      shortExplanation: 'Identical subject or household identifier fingerprints found in both partitions despite differing index numbers.'
    },
    {
      type: 'target',
      label: 'Target Leakage',
      status: 'Detected',
      findingsCount: 12,
      confidence: 91,
      severity: 'High',
      shortExplanation: 'Features like capital gain tax settlement recorded only after income determination occurred, proxying ground truth.'
    },
    {
      type: 'temporal',
      label: 'Temporal Leakage',
      status: 'Review Required',
      findingsCount: 8,
      confidence: 82,
      severity: 'Medium',
      shortExplanation: 'Future census logging timestamps appear within training split due to unordered random cross-validation.'
    },
    {
      type: 'preprocessing',
      label: 'Preprocessing Leakage',
      status: 'Detected',
      findingsCount: 14,
      confidence: 99,
      severity: 'High',
      shortExplanation: 'Global mean imputation and standardization executed over the entire dataset prior to train/test partitioning.'
    },
    {
      type: 'contamination',
      label: 'Train-Test Contamination',
      status: 'Detected',
      findingsCount: 24,
      confidence: 96,
      severity: 'Critical',
      shortExplanation: 'Fuzzy identical rows with minor whitespace or case variations spanning both the training and evaluation sets.'
    }
  ],
  'ds-chest-xray': [
    {
      type: 'cv-near-duplicate',
      label: 'Near-Duplicate Image Leakage',
      status: 'Detected',
      findingsCount: 34,
      confidence: 95,
      severity: 'Critical',
      shortExplanation: 'Perceptual hash & embedding cosine distance >= 0.96 indicates identical patient radiographic exposures across splits.'
    },
    {
      type: 'entity',
      label: 'Patient Identity Cross-Contamination',
      status: 'Detected',
      findingsCount: 21,
      confidence: 93,
      severity: 'High',
      shortExplanation: 'Images from patient PT-9014 and PT-4122 distributed into both train and test partitions.'
    },
    {
      type: 'label-anomaly',
      label: 'Label Inconsistency & Disagreement',
      status: 'Review Required',
      findingsCount: 7,
      confidence: 86,
      severity: 'Medium',
      shortExplanation: 'Near-identical chest films labeled "Bacterial Pneumonia" in train and "Viral Pneumonia" in test split.'
    },
    {
      type: 'ood-sample',
      label: 'Out-of-Distribution Artifacts',
      status: 'Detected',
      findingsCount: 6,
      confidence: 89,
      severity: 'Medium',
      shortExplanation: 'Post-operative medical clips and external radiological calibration markers absent from clinical validation spec.'
    },
    {
      type: 'preprocessing',
      label: 'Global Contrast Normalization',
      status: 'Review Required',
      findingsCount: 0,
      confidence: 95,
      severity: 'Low',
      shortExplanation: 'Histogram equalization parameters computed independently per split without cross-boundary statistics leakage.'
    },
    {
      type: 'temporal',
      label: 'Multi-Session Longitudinal Bleed',
      status: 'Not Detected',
      findingsCount: 0,
      confidence: 97,
      severity: 'Low',
      shortExplanation: 'No subsequent follow-up scans preceded historical baseline scans in training under current check parameters.'
    }
  ]
};

export const mockDetailedFindings: LeakageFinding[] = [
  {
    id: 'DL-102',
    datasetId: 'ds-adult-income',
    type: 'duplicate',
    trainSampleId: 'REC-1823',
    testSampleId: 'REC-0923',
    similarity: 100,
    evidence: 'Exact feature match across 14/14 categorical and numeric attributes',
    severity: 'High',
    status: 'Detected',
    explanation: 'Highly similar records appear across evaluation boundaries, which may make test performance less representative.',
    trainRecordDetails: {
      age: 38,
      workclass: 'Private',
      education: 'HS-grad',
      marital_status: 'Divorced',
      occupation: 'Handlers-cleaners',
      hours_per_week: 40,
      income_target: '<=50K'
    },
    testRecordDetails: {
      age: 38,
      workclass: 'Private',
      education: 'HS-grad',
      marital_status: 'Divorced',
      occupation: 'Handlers-cleaners',
      hours_per_week: 40,
      income_target: '<=50K'
    },
    featureImpact: ['age', 'fnlwgt', 'education', 'occupation', 'marital_status']
  },
  {
    id: 'EL-044',
    datasetId: 'ds-adult-income',
    type: 'entity',
    trainSampleId: 'REC-4192',
    testSampleId: 'REC-8841',
    similarity: 97.4,
    evidence: 'Same household identity fingerprint (fnlwgt=284582, marital_status, race, native_country match)',
    severity: 'Critical',
    status: 'Detected',
    explanation: 'Records likely originating from the exact same person or household partition exist in both train and test splits.',
    trainRecordDetails: {
      age: 37,
      workclass: 'Private',
      fnlwgt: 284582,
      education: 'Masters',
      marital_status: 'Married-civ-spouse',
      income_target: '>50K'
    },
    testRecordDetails: {
      age: 37,
      workclass: 'Private',
      fnlwgt: 284582,
      education: 'Masters',
      marital_status: 'Married-civ-spouse',
      income_target: '>50K'
    },
    featureImpact: ['fnlwgt', 'native_country', 'marital_status']
  },
  {
    id: 'TL-019',
    datasetId: 'ds-adult-income',
    type: 'target',
    trainSampleId: 'REC-3091',
    testSampleId: 'REC-3091',
    similarity: 94.2,
    evidence: 'High mutual information (MI = 0.88) between capital_gain settlement code and target label',
    severity: 'High',
    status: 'Detected',
    explanation: 'Feature values were logged contemporaneously or downstream of the target outcome, revealing post-decision state.',
    trainRecordDetails: {
      capital_gain: 99999,
      hours_per_week: 50,
      occupation: 'Prof-specialty',
      income_target: '>50K'
    },
    featureImpact: ['capital_gain', 'capital_loss']
  },
  {
    id: 'PL-008',
    datasetId: 'ds-adult-income',
    type: 'preprocessing',
    trainSampleId: 'BATCH-ALL',
    testSampleId: 'BATCH-ALL',
    similarity: 99.0,
    evidence: 'Z-score standardization used global standard deviation (sigma=13.64) computed prior to train/test split',
    severity: 'High',
    status: 'Detected',
    explanation: 'Test split summary statistics leaked into model training weights via full-dataset normalization and imputer fitting.',
    trainRecordDetails: {
      global_mean: '38.58 yrs',
      global_std: '13.64',
      leakage_vector: 'StandardScaler.fit(X_all)'
    }
  },
  {
    id: 'TC-051',
    datasetId: 'ds-adult-income',
    type: 'contamination',
    trainSampleId: 'REC-0512',
    testSampleId: 'REC-6218',
    similarity: 98.8,
    evidence: 'Fuzzy string match (Levenshtein distance = 1 on occupation with identical remaining attributes)',
    severity: 'Critical',
    status: 'Detected',
    explanation: 'Minor typographic variation hides an otherwise duplicated observation across validation partitions.',
    trainRecordDetails: {
      occupation: 'Tech-support',
      education: 'Some-college',
      age: 29
    },
    testRecordDetails: {
      occupation: 'Tech-support ',
      education: 'Some-college',
      age: 29
    }
  },
  // Computer vision findings
  {
    id: 'CV-ND-001',
    datasetId: 'ds-chest-xray',
    type: 'cv-near-duplicate',
    trainSampleId: 'IMG_NORMAL_001.jpeg',
    testSampleId: 'IMG_NORMAL_890.jpeg',
    similarity: 98.4,
    evidence: 'CLIP visual cosine similarity = 0.984; perceptual pHash Hamming distance = 2 bits',
    severity: 'Critical',
    status: 'Detected',
    explanation: 'Sequential radiographic acquisitions of identical patient rib cage geometry found across train and test partitions.',
    trainRecordDetails: {
      patientId: 'PT-9014',
      view: 'AP',
      sourceSite: 'Site-A',
      imageHash: '0x3fa99b42c1'
    },
    testRecordDetails: {
      patientId: 'PT-9014',
      view: 'AP (2 min later)',
      sourceSite: 'Site-A',
      imageHash: '0x3fa99b42c3'
    }
  },
  {
    id: 'CV-LA-004',
    datasetId: 'ds-chest-xray',
    type: 'label-anomaly',
    trainSampleId: 'IMG_BACT_042.jpeg',
    testSampleId: 'IMG_VIRAL_118.jpeg',
    similarity: 93.1,
    evidence: 'High morphological lung opacity similarity with conflicting diagnostic classifications',
    severity: 'Medium',
    status: 'Under Review',
    explanation: 'Radiographs with identical focal consolidations labeled differently across split sets, degrading evaluation ground truth reliability.'
  },
  {
    id: 'CV-OD-002',
    datasetId: 'ds-chest-xray',
    type: 'ood-sample',
    trainSampleId: 'IMG_BACT_992.jpeg',
    testSampleId: 'N/A',
    similarity: 42.0,
    evidence: 'Mahalanobis distance in latent space > 4.5 sigma; metal implant edge density exceeds 99th percentile',
    severity: 'Medium',
    status: 'Detected',
    explanation: 'Out-of-distribution sample containing surgical orthopedic pacemakers not representative of pediatric cohort specification.'
  }
];
