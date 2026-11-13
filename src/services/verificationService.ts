import { VerificationRequest, VerificationStatus } from '../types';
import { MOCK_VERIFICATIONS } from '../data/mockVerifications';
import { authService } from './authService';
import { adminService } from './adminService';

const VERIFICATION_STORAGE_KEY = 'druginsight_verifications';

function initializeVerifications(): VerificationRequest[] {
  const stored = localStorage.getItem(VERIFICATION_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(MOCK_VERIFICATIONS));
  return MOCK_VERIFICATIONS;
}

export const verificationService = {
  getRequests(): VerificationRequest[] {
    return initializeVerifications();
  },

  getRequestByUserId(userId: string): VerificationRequest | undefined {
    const requests = this.getRequests();
    return requests.find(r => r.userId === userId);
  },

  submitVerification(data: {
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
  }): VerificationRequest {
    const requests = this.getRequests();
    const existingIndex = requests.findIndex(r => r.userId === data.userId);

    const newRequest: VerificationRequest = {
      id: `req-${Date.now()}`,
      userId: data.userId,
      applicantName: data.applicantName,
      applicantEmail: data.applicantEmail,
      requestedRole: data.requestedRole,
      institution: data.institution,
      department: data.department || 'Not specified',
      registrationNumber: data.registrationNumber || 'N/A',
      licensingAuthority: data.licensingAuthority || 'N/A',
      countryJurisdiction: data.countryJurisdiction || 'International',
      professionalEmail: data.professionalEmail,
      proofDocumentName: data.proofDocumentName || 'medical_credential_document.pdf',
      proofDocumentType: data.proofDocumentType || 'application/pdf',
      proofDocumentSize: data.proofDocumentSize || '2.1 MB',
      submissionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
      adminNotes: 'Verification submission queued for regulatory compliance review.'
    };

    if (existingIndex !== -1) {
      requests[existingIndex] = newRequest;
    } else {
      requests.unshift(newRequest);
    }

    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(requests));

    // Update current user's verification status
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.id === data.userId) {
      currentUser.verificationStatus = 'pending';
      currentUser.institution = data.institution;
      currentUser.department = data.department;
      currentUser.medicalRegistrationNumber = data.registrationNumber;
      currentUser.countryJurisdiction = data.countryJurisdiction;
      currentUser.professionalEmail = data.professionalEmail;
      authService.updateUserInList(currentUser);
    }

    adminService.addAuditLog({
      user: data.applicantName,
      userRole: 'public',
      action: 'SUBMIT_VERIFICATION',
      result: 'Success',
      details: `Submitted ${data.requestedRole} verification credentials from ${data.institution}`
    });

    return newRequest;
  },

  updateRequestStatus(
    requestId: string,
    status: VerificationStatus,
    adminNotes?: string,
    reviewerName: string = 'Administrator Sarah Lin'
  ): VerificationRequest | null {
    const requests = this.getRequests();
    const target = requests.find(r => r.id === requestId);
    if (!target) return null;

    target.status = status;
    target.adminNotes = adminNotes || target.adminNotes;
    target.reviewedBy = reviewerName;
    target.reviewedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);

    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(requests));

    // Update the corresponding user
    const users = authService.getUsers();
    const user = users.find(u => u.id === target.userId);
    if (user) {
      user.verificationStatus = status;
      if (status === 'approved') {
        user.role = target.requestedRole;
      } else {
        // If rejected or pending or needs_info, role stays public
        user.role = 'public';
      }
      authService.updateUserInList(user);
    }

    adminService.addAuditLog({
      user: reviewerName,
      userRole: 'admin',
      action: `VERIFICATION_${status.toUpperCase()}`,
      result: status === 'rejected' ? 'Warning' : 'Success',
      details: `${status.toUpperCase()} ${target.requestedRole} application for ${target.applicantName}`
    });

    return target;
  }
};
