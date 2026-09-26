import { InferenceRecord } from '../types';

export const initialInferenceRecords: InferenceRecord[] = [
  {
    id: 'PRV-2026-9041',
    timestamp: '2026-09-25 01:42:19 UTC',
    modelId: 'mdl-resnet50-eval',
    modelName: 'ResNet-50 ChestXRay Classifier (v2.4.1)',
    inputHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    outputHash: '7a9f8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
    configHash: '01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b',
    nonce: '0x94bfa2914c8100ef',
    sequenceNumber: 1042,
    digitalSignature: 'MEQCIA7p2m83y1g8wL+5n4h9k1Z0x3V7j4y6B8c9d0E1f2a3AiA0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c=',
    verificationStatus: 'Verified',
    prediction: {
      label: 'Normal',
      confidence: 0.984,
      secondaryClass: 'Bacterial Pneumonia',
      secondaryConfidence: 0.012,
      boundingBoxes: [
        { label: 'Clear Lung Field', box: [15, 20, 32, 55], confidence: 0.96 },
        { label: 'Clear Lung Field', box: [52, 22, 34, 54], confidence: 0.97 }
      ]
    },
    inputMetadata: {
      filename: 'sample_patient_xray_901.png',
      dimensions: '1024x1024 (16-bit Grayscale)',
      sizeKb: 1420,
      preprocessingConfig: 'clahe_clip=2.0_tile=8x8_norm=imagenet'
    }
  },
  {
    id: 'PRV-2026-9040',
    timestamp: '2026-09-25 01:38:04 UTC',
    modelId: 'mdl-yolo8-pcb',
    modelName: 'YOLOv8-Nano DefectGuard (v1.1.0)',
    inputHash: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
    outputHash: 'c74b9e3a6d1f8c2e5b0a9d4f7e2a8c1b3d6f9a0c2e4b7d1e8a3c5f6b9d0e2a4f',
    configHash: '18ac3e7343f016890c510e93f02fb03e228c201297dac98f3693845c1024dd8b',
    nonce: '0x88ac5112001e4b99',
    sequenceNumber: 1041,
    digitalSignature: 'MEUCIQDF1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0cAiEA1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0=',
    verificationStatus: 'Tampered',
    prediction: {
      label: 'missing_hole',
      confidence: 0.42, // tampered from original 0.94
      secondaryClass: 'spurious_copper',
      secondaryConfidence: 0.38,
      boundingBoxes: [
        { label: 'missing_hole', box: [42, 38, 14, 18], confidence: 0.42 }
      ]
    },
    inputMetadata: {
      filename: 'pcb_batch_9901_panel_b.jpg',
      dimensions: '1920x1080 (RGB)',
      sizeKb: 2840,
      preprocessingConfig: 'yolo_letterbox_stride32_scale=640'
    },
    tamperedFields: ['prediction.confidence', 'outputHash']
  },
  {
    id: 'PRV-2026-9039',
    timestamp: '2026-09-24 23:55:12 UTC',
    modelId: 'mdl-xgboost-census',
    modelName: 'Census-GBDT Income Predictor (v3.0.2)',
    inputHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    outputHash: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    configHash: 'b5a2c693c18b74936f671f7adce46dd3f0bcf71536b16d96144f20f939862f45',
    nonce: '0x33445566778899aa',
    sequenceNumber: 1040,
    digitalSignature: 'MEQCIG8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8cAiB1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d=',
    verificationStatus: 'Verified',
    prediction: {
      label: '<=50K',
      confidence: 0.932,
      secondaryClass: '>50K',
      secondaryConfidence: 0.068
    },
    inputMetadata: {
      filename: 'vector_record_89112.json',
      dimensions: '14 Tabular Fields',
      sizeKb: 1.2,
      preprocessingConfig: 'onehot_encoder_standardscaler_v3'
    }
  }
];
