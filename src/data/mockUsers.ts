import { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-public-01',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    role: 'public',
    verificationStatus: 'none',
    createdAt: '2024-01-15',
    accountStatus: 'active'
  },
  {
    id: 'user-doc-02',
    name: 'Dr. Marcus Vance, MD',
    email: 'dr.vance@saintmaryshospital.org',
    role: 'doctor',
    verificationStatus: 'approved',
    institution: "St. Mary's Academic Medical Center",
    department: 'Internal Medicine & Therapeutics',
    medicalRegistrationNumber: 'MED-NY-849201',
    licensingAuthority: 'New York State Board for Medicine',
    countryJurisdiction: 'United States',
    professionalEmail: 'marcus.vance@saintmarys.edu',
    createdAt: '2023-11-04',
    accountStatus: 'active'
  },
  {
    id: 'user-res-03',
    name: 'Dr. Elena Rostova, PhD',
    email: 'elena.rostova@cambridgegenomics.ac.uk',
    role: 'researcher',
    verificationStatus: 'approved',
    institution: 'Cambridge Institute for Pharmacological Research',
    department: 'Translational Pharmacology & Computational Genomics',
    countryJurisdiction: 'United Kingdom',
    professionalEmail: 'e.rostova@cipr.cam.ac.uk',
    createdAt: '2023-12-10',
    accountStatus: 'active'
  },
  {
    id: 'user-admin-04',
    name: 'Administrator Sarah Lin',
    email: 'admin@druginsight.ai',
    role: 'admin',
    verificationStatus: 'approved',
    institution: 'DrugInsight AI Governance Board',
    department: 'Security, Regulatory & Credential Auditing',
    createdAt: '2023-01-01',
    accountStatus: 'active'
  },
  {
    id: 'user-pending-05',
    name: 'Dr. Arthur Pendelton',
    email: 'arthur.pendelton@clinic.org',
    role: 'public', // Remains public until approved by admin
    verificationStatus: 'pending',
    institution: 'Highland Regional Hospital',
    department: 'Cardiology',
    medicalRegistrationNumber: 'MED-CA-993812',
    licensingAuthority: 'Medical Board of California',
    countryJurisdiction: 'United States',
    professionalEmail: 'a.pendelton@highlandhealth.org',
    createdAt: '2024-09-12',
    accountStatus: 'active'
  }
];

export const DEMO_CREDENTIALS = [
  {
    role: 'public',
    name: 'General Public Demo',
    email: 'sarah.j@example.com',
    badge: 'Public Access',
    color: 'mint',
    description: 'Explore approved indications, warnings, and general side effect profiles.'
  },
  {
    role: 'doctor',
    name: 'Dr. Marcus Vance, MD',
    email: 'dr.vance@saintmaryshospital.org',
    badge: 'Verified Doctor',
    color: 'lavender',
    description: 'Full clinical comparisons, AI research queries, and report generation.'
  },
  {
    role: 'researcher',
    name: 'Dr. Elena Rostova, PhD',
    email: 'elena.rostova@cambridgegenomics.ac.uk',
    badge: 'Verified Researcher',
    color: 'blue',
    description: 'Access pharmaceutical analytics, labeling trend charts, and raw datasets.'
  },
  {
    role: 'admin',
    name: 'Sarah Lin (Admin)',
    email: 'admin@druginsight.ai',
    badge: 'Platform Administrator',
    color: 'peach',
    description: 'Review credential submissions, manage users, and inspect security audit logs.'
  },
  {
    role: 'pending',
    name: 'Dr. Arthur Pendelton (Pending)',
    email: 'arthur.pendelton@clinic.org',
    badge: 'Pending Review',
    color: 'peach',
    description: 'Simulates a user awaiting administrator review for professional credentials.'
  }
];
