import { AuditLog } from '../types';

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1092',
    timestamp: '2024-09-14 16:42:10',
    user: 'Administrator Sarah Lin',
    userRole: 'admin',
    action: 'VERIFICATION_APPROVED',
    result: 'Success',
    details: 'Approved medical doctor credentials for Dr. Arthur Pendelton (Highland Regional Hospital)',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-1091',
    timestamp: '2024-09-14 15:30:22',
    user: 'Dr. Marcus Vance, MD',
    userRole: 'doctor',
    action: 'COMPARISON_EXPORT',
    result: 'Success',
    details: 'Exported side-by-side comparative monograph: Metformin vs Amlodipine',
    ipAddress: '172.56.21.90'
  },
  {
    id: 'log-1090',
    timestamp: '2024-09-14 14:15:05',
    user: 'Dr. Elena Rostova, PhD',
    userRole: 'researcher',
    action: 'ANALYTICS_QUERY',
    result: 'Success',
    details: 'Aggregated labeling updates across cardiovascular drug categories for Q1-Q3 2024',
    ipAddress: '131.111.8.24'
  },
  {
    id: 'log-1089',
    timestamp: '2024-09-14 12:05:40',
    user: 'Administrator Sarah Lin',
    userRole: 'admin',
    action: 'REQUEST_MORE_INFO',
    result: 'Warning',
    details: 'Requested accredited appointment documentation for applicant Dr. Clara Beauchamp',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-1088',
    timestamp: '2024-09-13 18:22:15',
    user: 'Guest / Public Session #8832',
    userRole: 'public',
    action: 'PUBLIC_SEARCH',
    result: 'Success',
    details: 'Searched query: "amoxicillin penicillin allergy warnings"',
    ipAddress: '24.18.204.11'
  },
  {
    id: 'log-1087',
    timestamp: '2024-09-13 16:50:00',
    user: 'Dr. Marcus Vance, MD',
    userRole: 'doctor',
    action: 'AI_ASSISTANT_QUERY',
    result: 'Success',
    details: 'Synthesized DailyMed evidence for ACE inhibitor dry cough mechanism and contraindications',
    ipAddress: '172.56.21.90'
  },
  {
    id: 'log-1086',
    timestamp: '2024-09-13 11:10:44',
    user: 'Administrator Sarah Lin',
    userRole: 'admin',
    action: 'VERIFICATION_REJECTED',
    result: 'Warning',
    details: 'Rejected submission from Alexander Hayes (ineligible practitioner credential)',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-1085',
    timestamp: '2024-09-12 09:33:18',
    user: 'System Cron',
    userRole: 'admin',
    action: 'SPL_DATASET_SYNC',
    result: 'Success',
    details: 'Synchronized DailyMed package label set updates for 142 pharmaceutical formulations',
    ipAddress: '127.0.0.1'
  }
];
