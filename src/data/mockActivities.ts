import { Activity } from '../types';

export const initialActivities: Activity[] = [
  {
    id: 'act-001',
    type: 'leakage_detected',
    title: 'Duplicate Leakage Detected',
    description: '142 exact duplicates identified across evaluation boundary in Adult Census Income Dataset.',
    timestamp: '12 minutes ago',
    targetId: 'ds-adult-income',
    severity: 'High'
  },
  {
    id: 'act-002',
    type: 'provenance_verified',
    title: 'Inference Provenance Verified',
    description: 'Cryptographic HMAC signature and input-output hash validated for record PRV-2026-9041.',
    timestamp: '45 minutes ago',
    targetId: 'PRV-2026-9041',
    severity: 'Low'
  },
  {
    id: 'act-003',
    type: 'model_verified',
    title: 'Model Hash Mismatch Detected',
    description: 'YOLOv8-Nano DefectGuard SHA-256 differed from registered reference fingerprint.',
    timestamp: '2 hours ago',
    targetId: 'mdl-yolo8-pcb',
    severity: 'Critical'
  },
  {
    id: 'act-004',
    type: 'report_generated',
    title: 'Assurance Report Compiled',
    description: 'Report REP-2026-0042 generated with disposition recommendation: REVIEW REQUIRED.',
    timestamp: '4 hours ago',
    targetId: 'REP-2026-0042',
    severity: 'Medium'
  },
  {
    id: 'act-005',
    type: 'repair_completed',
    title: 'Dataset Partition Cleansed',
    description: 'Quarantined 180 records and reconstructed isolated train/test transforms for Adult Census Income.',
    timestamp: 'Yesterday at 17:30 UTC',
    targetId: 'ds-adult-income',
    severity: 'Low'
  },
  {
    id: 'act-006',
    type: 'dataset_analyzed',
    title: 'Chest X-Ray Cohort Analyzed',
    description: 'Computer vision pipeline finished 8-stage integrity profiling across 5,856 radiographs.',
    timestamp: 'Yesterday at 11:20 UTC',
    targetId: 'ds-chest-xray',
    severity: 'Medium'
  }
];
