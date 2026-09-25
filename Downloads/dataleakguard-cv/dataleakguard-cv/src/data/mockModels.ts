import { Model } from '../types';

export const initialModels: Model[] = [
  {
    id: 'mdl-resnet50-eval',
    name: 'ResNet-50 ChestXRay Classifier',
    version: 'v2.4.1',
    format: 'ONNX',
    sha256: '9b8f2c3d4e5a1b0c9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a',
    status: 'Verified',
    lastVerified: '2026-09-24 18:20 UTC',
    architecture: 'Deep Residual Network (50 Layers) + Linear Head',
    parameters: '25.6M parameters',
    framework: 'PyTorch 2.4 -> ONNX Runtime 1.19',
    uploadedAt: '2026-09-15 10:00 UTC',
    referenceHash: '9b8f2c3d4e5a1b0c9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a',
    fingerprintMatch: true,
    behaviorDriftScore: 0.002,
    referenceBehaviors: [
      { testInput: 'standard_xray_test_01.pt', expectedOutput: 'Normal [0.984]', actualOutput: 'Normal [0.984]', match: true },
      { testInput: 'standard_xray_test_02.pt', expectedOutput: 'Bacterial [0.912]', actualOutput: 'Bacterial [0.912]', match: true },
      { testInput: 'standard_xray_test_03.pt', expectedOutput: 'Viral [0.875]', actualOutput: 'Viral [0.875]', match: true }
    ]
  },
  {
    id: 'mdl-yolo8-pcb',
    name: 'YOLOv8-Nano DefectGuard',
    version: 'v1.1.0',
    format: 'PyTorch',
    sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    status: 'Changed',
    lastVerified: '2026-09-24 12:15 UTC',
    architecture: 'CSPDarknet53 + C2f + PANet Head',
    parameters: '3.2M parameters',
    framework: 'Ultralytics 8.2 (PyTorch)',
    uploadedAt: '2026-09-18 11:30 UTC',
    referenceHash: 'c4d5e6f7a8b90123456789abcdef0123456789abcdef0123456789abcdef0123',
    fingerprintMatch: false,
    behaviorDriftScore: 0.184,
    referenceBehaviors: [
      { testInput: 'board_sample_01.png', expectedOutput: 'missing_hole [0.94]', actualOutput: 'spurious_copper [0.41]', match: false },
      { testInput: 'board_sample_02.png', expectedOutput: 'open_circuit [0.89]', actualOutput: 'open_circuit [0.88]', match: true }
    ]
  },
  {
    id: 'mdl-xgboost-census',
    name: 'Census-GBDT Income Predictor',
    version: 'v3.0.2',
    format: 'ONNX',
    sha256: 'e89d1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    status: 'Verified',
    lastVerified: '2026-09-25 01:10 UTC',
    architecture: 'Gradient Boosted Decision Trees (150 trees, max_depth=6)',
    parameters: '150 Estimators',
    framework: 'XGBoost 2.1 (ONNX Treelite)',
    uploadedAt: '2026-09-19 14:00 UTC',
    referenceHash: 'e89d1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    fingerprintMatch: true,
    behaviorDriftScore: 0.0,
    referenceBehaviors: [
      { testInput: 'census_ref_vector_01.json', expectedOutput: '<=50K [0.932]', actualOutput: '<=50K [0.932]', match: true },
      { testInput: 'census_ref_vector_02.json', expectedOutput: '>50K [0.814]', actualOutput: '>50K [0.814]', match: true }
    ]
  },
  {
    id: 'mdl-efficientnet-v2',
    name: 'EfficientNet-V2S Diagnostic',
    version: 'v1.0.0-rc',
    format: 'TorchScript',
    sha256: '7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    status: 'Review Required',
    lastVerified: '2026-09-23 09:40 UTC',
    architecture: 'Fused-MBConv + Progressive Learning Backbone',
    parameters: '21.5M parameters',
    framework: 'PyTorch JIT TorchScript',
    uploadedAt: '2026-09-22 16:00 UTC',
    referenceHash: '7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    fingerprintMatch: true,
    behaviorDriftScore: 0.058,
    referenceBehaviors: [
      { testInput: 'test_vector_clinical_01.pt', expectedOutput: 'Normal [0.910]', actualOutput: 'Normal [0.835]', match: false },
      { testInput: 'test_vector_clinical_02.pt', expectedOutput: 'Viral [0.890]', actualOutput: 'Viral [0.888]', match: true }
    ]
  }
];
