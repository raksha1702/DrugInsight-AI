export type UserRole = 'public' | 'doctor' | 'researcher' | 'admin';

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'needs_info' | 'none';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  institution?: string;
  department?: string;
  medicalRegistrationNumber?: string;
  licensingAuthority?: string;
  countryJurisdiction?: string;
  professionalEmail?: string;
  avatar?: string;
  createdAt: string;
  accountStatus: 'active' | 'suspended' | 'pending';
}

export interface Medicine {
  id: string;
  name: string;
  activeIngredient: string;
  brandNames: string[];
  category: string;
  formulation: string;
  dataSource: 'DailyMed' | 'openFDA' | 'FDA Label Archives';
  lastUpdated: string;
  ndcCode: string;
  labelId: string;
  description: string;
  dosageForms: string[];
  mechanismOfAction: string;
  approvedUses: string[];
  sideEffects: {
    common: string[];
    serious: string[];
    precautions: string[];
  };
  warnings: {
    boxedWarning?: string | null;
    contraindications: string[];
    warningsAndPrecautions: string[];
    pregnancyCategory?: string | null;
  };
  sourceInfo: {
    sourceName: string;
    labelIdentifier: string;
    lastUpdated: string;
    officialUrl: string;
    disclaimer: string;
  };
  storageConditions?: string | null;
  rxStatus?: 'OTC' | 'Prescription';
  accessCategory?: 'Category A' | 'Category B' | 'Category C';
  hasBoxedWarning?: boolean;
  controlledSubstance?: string;
  jurisdiction?: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  requestedRole: 'doctor' | 'researcher';
  institution: string;
  department?: string;
  registrationNumber?: string;
  licensingAuthority?: string;
  countryJurisdiction?: string;
  professionalEmail: string;
  proofDocumentName?: string;
  proofDocumentType?: string;
  proofDocumentSize?: string;
  submissionDate: string;
  status: VerificationStatus;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: UserRole;
  action: string;
  result: 'Success' | 'Warning' | 'Failed';
  details: string;
  ipAddress: string;
}

export interface SourceCitation {
  id: string;
  source: string;
  labelId: string;
  section: string;
  textSnippet: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: SourceCitation[];
  isDemo?: boolean;
  isRefusal?: boolean;
}

export interface SavedResearchItem {
  id: string;
  userId: string;
  type: 'medicine' | 'comparison' | 'ai_chat' | 'note';
  title: string;
  subtitle?: string;
  targetId?: string;
  createdAt: string;
  tags: string[];
  notes?: string;
}

export interface ResearchReport {
  id: string;
  title: string;
  type: 'Comparative Analysis' | 'Safety Profile' | 'Label Discrepancy' | 'Category Summary';
  createdDate: string;
  status: 'Ready' | 'Processing' | 'Archived';
  medicines: string[];
  author: string;
  fileSize: string;
  summary: string;
}

export interface AnalyticsKPI {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: 'mint' | 'blue' | 'lavender' | 'peach';
}
