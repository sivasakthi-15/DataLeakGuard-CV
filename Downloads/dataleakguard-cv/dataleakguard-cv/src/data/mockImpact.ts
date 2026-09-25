import { ImpactAnalysis, DistributionShift } from '../types';

export const mockImpactData: Record<string, ImpactAnalysis> = {
  'ds-adult-income': {
    datasetId: 'ds-adult-income',
    modelName: 'Census-GBDT Income Predictor (XGBoost)',
    taskType: 'Binary Classification (>50K vs <=50K)',
    metrics: [
      {
        metric: 'Accuracy',
        contaminated: 97.8,
        corrected: 90.4,
        difference: 7.4,
        percentageInflation: 8.18
      },
      {
        metric: 'Precision',
        contaminated: 96.5,
        corrected: 88.7,
        difference: 7.8,
        percentageInflation: 8.79
      },
      {
        metric: 'Recall',
        contaminated: 95.8,
        corrected: 89.2,
        difference: 6.6,
        percentageInflation: 7.40
      },
      {
        metric: 'F1 Score',
        contaminated: 96.9,
        corrected: 89.7,
        difference: 7.2,
        percentageInflation: 8.03
      },
      {
        metric: 'ROC-AUC',
        contaminated: 98.8,
        corrected: 91.2,
        difference: 7.6,
        percentageInflation: 8.33
      }
    ],
    evaluationInflationSummary: {
      accuracyDifference: 7.4,
      f1Difference: 7.2,
      rocAucDifference: 7.6,
      statement: 'Observed difference between contaminated and corrected evaluation indicates +7.4% accuracy inflation.',
      nuance: 'Performance inflation depends on the evaluation setup and controlled contamination scenario. This observed delta reflects duplicate rows and household identity bleed across partitions rather than a universal causal constant.'
    }
  },
  'ds-chest-xray': {
    datasetId: 'ds-chest-xray',
    modelName: 'ResNet-50 ChestXRay Classifier',
    taskType: 'Multi-Class Radiographic Diagnosis',
    metrics: [
      {
        metric: 'Accuracy',
        contaminated: 94.6,
        corrected: 88.1,
        difference: 6.5,
        percentageInflation: 7.38
      },
      {
        metric: 'Precision',
        contaminated: 93.8,
        corrected: 86.4,
        difference: 7.4,
        percentageInflation: 8.56
      },
      {
        metric: 'Recall',
        contaminated: 92.5,
        corrected: 87.0,
        difference: 5.5,
        percentageInflation: 6.32
      },
      {
        metric: 'F1 Score',
        contaminated: 93.1,
        corrected: 86.7,
        difference: 6.4,
        percentageInflation: 7.38
      },
      {
        metric: 'ROC-AUC',
        contaminated: 97.2,
        corrected: 91.5,
        difference: 5.7,
        percentageInflation: 6.23
      }
    ],
    evaluationInflationSummary: {
      accuracyDifference: 6.5,
      f1Difference: 6.4,
      rocAucDifference: 5.7,
      statement: 'Near-duplicate radiographs and shared patient identifiers inflated diagnostic evaluation accuracy by 6.5 percentage points.',
      nuance: 'Patient-level cross-split partitioning eliminates identical anatomical orientation leakage. Verification was conducted under supported similarity thresholds.'
    }
  }
};

export const mockDistributionShiftData: DistributionShift = {
  id: 'DS-2026-088',
  referenceDatasetId: 'ds-adult-income-ref',
  currentDatasetId: 'ds-adult-income-curr',
  overallShiftDetected: true,
  shiftLevel: 'Potential Shift',
  psiScore: 0.184, // 0.1 to 0.25 indicates moderate shift
  wassersteinDistance: 0.076,
  oodRate: 4.8,
  classBalanceShift: [
    { className: '<=50K Income', referencePct: 75.9, currentPct: 71.4 },
    { className: '>50K Income', referencePct: 24.1, currentPct: 28.6 }
  ],
  featureShifts: [
    { featureName: 'capital_gain', driftScore: 0.282, threshold: 0.20, status: 'Shift Detected' },
    { featureName: 'hours_per_week', driftScore: 0.194, threshold: 0.20, status: 'Requires Review' },
    { featureName: 'age', driftScore: 0.082, threshold: 0.20, status: 'Nominal' },
    { featureName: 'education_num', driftScore: 0.064, threshold: 0.20, status: 'Nominal' },
    { featureName: 'fnlwgt', driftScore: 0.141, threshold: 0.20, status: 'Requires Review' }
  ]
};
