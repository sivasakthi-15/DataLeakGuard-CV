import { Dataset } from '../types';

export const initialDatasets: Dataset[] = [
  {
    id: 'ds-adult-income',
    name: 'Adult Census Income Dataset',
    type: 'tabular',
    format: 'CSV',
    sampleCount: 48842,
    featureCount: 14,
    classCount: 2,
    status: 'Issues Found',
    issuesCount: 214,
    uploadedAt: '2026-09-18 14:22 UTC',
    lastAnalysis: '2026-09-24 16:45 UTC',
    description: 'Benchmark demographic dataset used for income classification (>50K vs <=50K). Contains high duplicate redundancy and entity identifier leakage across standard 80/20 random splits.',
    columns: [
      { name: 'age', type: 'integer', missingCount: 0, uniqueCount: 74 },
      { name: 'workclass', type: 'categorical', missingCount: 2799, uniqueCount: 9 },
      { name: 'fnlwgt', type: 'integer', missingCount: 0, uniqueCount: 28523 },
      { name: 'education', type: 'categorical', missingCount: 0, uniqueCount: 16 },
      { name: 'marital_status', type: 'categorical', missingCount: 0, uniqueCount: 7 },
      { name: 'occupation', type: 'categorical', missingCount: 2809, uniqueCount: 15 },
      { name: 'relationship', type: 'categorical', missingCount: 0, uniqueCount: 6 },
      { name: 'race', type: 'categorical', missingCount: 0, uniqueCount: 5 },
      { name: 'sex', type: 'categorical', missingCount: 0, uniqueCount: 2 },
      { name: 'capital_gain', type: 'integer', missingCount: 0, uniqueCount: 123 },
      { name: 'capital_loss', type: 'integer', missingCount: 0, uniqueCount: 99 },
      { name: 'hours_per_week', type: 'integer', missingCount: 0, uniqueCount: 96 },
      { name: 'native_country', type: 'categorical', missingCount: 857, uniqueCount: 42 },
      { name: 'income_target', type: 'categorical', missingCount: 0, uniqueCount: 2 }
    ],
    previewRows: [
      { age: 39, workclass: 'State-gov', fnlwgt: 77516, education: 'Bachelors', marital_status: 'Never-married', occupation: 'Adm-clerical', capital_gain: 2174, capital_loss: 0, hours_per_week: 40, income_target: '<=50K' },
      { age: 50, workclass: 'Self-emp-not-inc', fnlwgt: 83311, education: 'Bachelors', marital_status: 'Married-civ-spouse', occupation: 'Exec-managerial', capital_gain: 0, capital_loss: 0, hours_per_week: 13, income_target: '<=50K' },
      { age: 38, workclass: 'Private', fnlwgt: 215646, education: 'HS-grad', marital_status: 'Divorced', occupation: 'Handlers-cleaners', capital_gain: 0, capital_loss: 0, hours_per_week: 40, income_target: '<=50K' },
      { age: 53, workclass: 'Private', fnlwgt: 234721, education: '11th', marital_status: 'Married-civ-spouse', occupation: 'Handlers-cleaners', capital_gain: 0, capital_loss: 0, hours_per_week: 40, income_target: '<=50K' },
      { age: 28, workclass: 'Private', fnlwgt: 338409, education: 'Bachelors', marital_status: 'Married-civ-spouse', occupation: 'Prof-specialty', capital_gain: 0, capital_loss: 0, hours_per_week: 40, income_target: '>50K' },
      { age: 37, workclass: 'Private', fnlwgt: 284582, education: 'Masters', marital_status: 'Married-civ-spouse', occupation: 'Exec-managerial', capital_gain: 0, capital_loss: 0, hours_per_week: 40, income_target: '>50K' }
    ]
  },
  {
    id: 'ds-chest-xray',
    name: 'Chest X-Ray Pneumonia CV Cohort',
    type: 'computer-vision',
    format: 'ZIP',
    sampleCount: 5856,
    featureCount: 3,
    classCount: 3,
    status: 'Review',
    issuesCount: 68,
    uploadedAt: '2026-09-20 09:15 UTC',
    lastAnalysis: '2026-09-24 11:20 UTC',
    description: 'Anterior-posterior chest radiographs collected across multi-center pediatric cohorts. Susceptible to near-duplicate patient exposure leakage and lateral marker bias.',
    cvStats: {
      imageCount: 5856,
      classes: ['Normal', 'Bacterial Pneumonia', 'Viral Pneumonia'],
      annotationsCount: 5856,
      nearDuplicatePairsCount: 34,
      resolutionDistribution: [
        { label: '1024x1024', count: 3420 },
        { label: '2048x2048', count: 1812 },
        { label: '512x512', count: 624 }
      ]
    },
    previewRows: [
      { id: 'IMG_NORMAL_001.jpeg', patientId: 'PT-9014', label: 'Normal', hospitalTag: 'Site-A', resolution: '1024x1024' },
      { id: 'IMG_BACT_042.jpeg', patientId: 'PT-4122', label: 'Bacterial Pneumonia', hospitalTag: 'Site-B', resolution: '1024x1024' },
      { id: 'IMG_VIRAL_118.jpeg', patientId: 'PT-7831', label: 'Viral Pneumonia', hospitalTag: 'Site-A', resolution: '2048x2048' },
      { id: 'IMG_NORMAL_890.jpeg', patientId: 'PT-9014', label: 'Normal', hospitalTag: 'Site-A', resolution: '1024x1024' },
      { id: 'IMG_BACT_992.jpeg', patientId: 'PT-1104', label: 'Bacterial Pneumonia', hospitalTag: 'Site-C', resolution: '512x512' }
    ]
  },
  {
    id: 'ds-pcb-defects',
    name: 'PCB Surface Inspection COCO',
    type: 'computer-vision',
    format: 'COCO',
    sampleCount: 1386,
    featureCount: 6,
    classCount: 6,
    status: 'Issues Found',
    issuesCount: 42,
    uploadedAt: '2026-09-21 17:30 UTC',
    lastAnalysis: '2026-09-23 18:00 UTC',
    description: 'High-resolution industrial PCB inspection images with bounding box annotations. Automated augmentation created test-set leakage via identical board surfaces with rotated defect labels.',
    cvStats: {
      imageCount: 1386,
      classes: ['missing_hole', 'mouse_bite', 'open_circuit', 'short', 'spur', 'spurious_copper'],
      annotationsCount: 4892,
      nearDuplicatePairsCount: 28,
      resolutionDistribution: [
        { label: '1920x1080', count: 980 },
        { label: '1280x720', count: 406 }
      ]
    }
  },
  {
    id: 'ds-credit-fraud',
    name: 'Credit Transaction Contamination Set',
    type: 'tabular',
    format: 'CSV',
    sampleCount: 284807,
    featureCount: 30,
    classCount: 2,
    status: 'Clean',
    issuesCount: 0,
    uploadedAt: '2026-09-12 08:00 UTC',
    lastAnalysis: '2026-09-22 14:10 UTC',
    description: 'Anonymized credit card transactions with PCA transformed features V1-V28, Time, and Amount. Verified strictly under time-series evaluation split without temporal leakage.'
  },
  {
    id: 'ds-customer-churn',
    name: 'Telecom Churn Temporal Pipeline',
    type: 'tabular',
    format: 'XLSX',
    sampleCount: 7043,
    featureCount: 21,
    classCount: 2,
    status: 'Review',
    issuesCount: 39,
    uploadedAt: '2026-09-22 12:40 UTC',
    lastAnalysis: '2026-09-24 15:30 UTC',
    description: 'Subscriber behavior data with account longevity, billing methods, and support logs. Preprocessing leakage detected due to min-max scaling performed before split.'
  }
];
