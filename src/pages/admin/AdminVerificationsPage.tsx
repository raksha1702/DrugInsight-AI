import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Clock,
  Eye,
  X,
  FileCheck2,
  Building,
  RotateCcw
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { verificationService } from '../../services/verificationService';
import { useToast } from '../../context/ToastContext';
import { VerificationRequest, VerificationStatus } from '../../types';

export const AdminVerificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | VerificationStatus>('all');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [requests, setRequests] = useState<VerificationRequest[]>(verificationService.getRequests());
  const [reviewingReq, setReviewingReq] = useState<VerificationRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const { success, warning } = useToast();

  const filteredRequests = requests.filter(r => {
    const matchesTab = activeTab === 'all' || r.status === activeTab;
    const matchesRole = roleFilter === 'all' || r.requestedRole === roleFilter;
    const matchesSearch =
      search === '' ||
      r.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      r.institution.toLowerCase().includes(search.toLowerCase()) ||
      (r.registrationNumber && r.registrationNumber.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesRole && matchesSearch;
  });

  const handleUpdateStatus = (status: VerificationStatus) => {
    if (!reviewingReq) return;

    verificationService.updateRequestStatus(
      reviewingReq.id,
      status,
      adminNotes || reviewingReq.adminNotes,
      'Administrator Sarah Lin'
    );

    setRequests(verificationService.getRequests());
    setReviewingReq(null);
    setAdminNotes('');

    if (status === 'approved') {
      success(`Approved ${reviewingReq.requestedRole} credentials for ${reviewingReq.applicantName}.`);
    } else if (status === 'rejected') {
      warning(`Rejected submission for ${reviewingReq.applicantName}. Account remains at Public tier.`);
    } else {
      success(`Requested additional information from ${reviewingReq.applicantName}.`);
    }
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5ED] text-[#2E5A44] border border-[#A8CDB5]">Approved</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F9D5D5] text-rose-900 border border-rose-200">Rejected</span>;
      case 'needs_info':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF5FB] text-[#2B5A82] border border-[#BDD7EE]">Needs Info</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF1D9] text-amber-900 border border-amber-300">Pending Review</span>;
    }
  };

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#293B42] tracking-tight">Professional Verification Requests</h2>
          <p className="text-xs sm:text-sm text-[#72818A] mt-1">
            Audit submitted state medical licenses, physician registrations, and university faculty credentials.
          </p>
        </div>

        {/* Filter Bar & Tabs */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5EBE8] shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Requests' },
              { id: 'pending', label: 'Pending' },
              { id: 'approved', label: 'Approved' },
              { id: 'needs_info', label: 'Needs Info' },
              { id: 'rejected', label: 'Rejected' },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#F4EEFB] text-[#5D4487]'
                      : 'text-[#72818A] hover:text-[#293B42] hover:bg-[#FAFBF9]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-[#FAFBF9] border border-[#E5EBE8] text-xs rounded-xl px-3 py-1.5 text-[#293B42] font-semibold"
            >
              <option value="all">All Roles</option>
              <option value="doctor">Doctors</option>
              <option value="researcher">Researchers</option>
            </select>

            <div className="relative flex items-center min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-[#72818A] absolute left-3" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search applicant or hospital..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Verifications Table */}
        <div className="bg-white rounded-4xl border border-[#E5EBE8] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] border-b border-[#E5EBE8] text-[#72818A] uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Applicant Name</th>
                  <th className="px-4 py-4">Requested Role</th>
                  <th className="px-4 py-4">Institution / Clinic</th>
                  <th className="px-4 py-4">Submission Date</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EBE8]">
                {filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-[#FAFBF9]/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#293B42] text-xs sm:text-sm">{req.applicantName}</div>
                      <div className="text-[11px] text-[#72818A]">{req.applicantEmail}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.requestedRole === 'doctor'
                          ? 'bg-[#F4EEFB] text-[#5D4487]'
                          : 'bg-[#EEF5FB] text-[#2B5A82]'
                      }`}>
                        {req.requestedRole}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#293B42] font-medium">
                      {req.institution}
                      <div className="text-[10px] text-[#72818A]">{req.department}</div>
                    </td>
                    <td className="px-4 py-4 text-[#72818A] whitespace-nowrap">
                      {req.submissionDate}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setReviewingReq(req);
                          setAdminNotes(req.adminNotes || '');
                        }}
                        className="px-4 py-1.5 rounded-full bg-[#5D4487] hover:bg-[#4A346F] text-white text-[11px] font-bold transition-all shadow-xs"
                      >
                        Review Credentials
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Review Modal (Section 19 Requirements) */}
        {reviewingReq && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl w-full bg-white rounded-4xl p-6 sm:p-8 shadow-soft-xl border border-[#E5EBE8] space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F4EEFB] text-[#5D4487] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#293B42]">Audit Credential Submission</h3>
                    <div className="text-xs text-[#72818A]">Request Ref: <span className="font-mono">{reviewingReq.id}</span></div>
                  </div>
                </div>
                <button onClick={() => setReviewingReq(null)} className="text-[#72818A] hover:text-[#293B42]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Applicant Metadata Box */}
              <div className="p-5 rounded-3xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#72818A] block">Applicant Name:</span>
                    <strong className="text-[#293B42] text-sm">{reviewingReq.applicantName}</strong>
                  </div>
                  <div>
                    <span className="text-[#72818A] block">Requested Access Tier:</span>
                    <span className="font-bold text-[#5D4487] uppercase">{reviewingReq.requestedRole}</span>
                  </div>
                  <div>
                    <span className="text-[#72818A] block">Personal Email:</span>
                    <span className="text-[#293B42]">{reviewingReq.applicantEmail}</span>
                  </div>
                  <div>
                    <span className="text-[#72818A] block">Institutional Email:</span>
                    <span className="text-[#293B42]">{reviewingReq.professionalEmail}</span>
                  </div>
                  <div>
                    <span className="text-[#72818A] block">Hospital / University:</span>
                    <span className="text-[#293B42] font-semibold">{reviewingReq.institution}</span>
                  </div>
                  <div>
                    <span className="text-[#72818A] block">Registration / License:</span>
                    <span className="font-mono text-[#2E5A44] font-bold">{reviewingReq.registrationNumber || 'N/A (Researcher)'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5EBE8]">
                  <span className="text-[#72818A] block mb-1">Attached Document Proof:</span>
                  <div className="p-3 rounded-2xl bg-white border border-[#E5EBE8] flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-[#293B42]">
                      <FileCheck2 className="w-4 h-4 text-[#2E5A44]" />
                      <span>{reviewingReq.proofDocumentName || 'medical_license_scan.pdf'}</span>
                      <span className="text-[11px] text-[#72818A]">({reviewingReq.proofDocumentSize || '2.4 MB'})</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#2E5A44] bg-[#EAF5ED] px-2 py-0.5 rounded-full">
                      Integrity Checked
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Decision Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#293B42] mb-1">Administrator Audit Notes</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Record verification check notes (e.g. State Board Registry confirmed)..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5]"
                />
              </div>

              {/* Action Buttons: Approve, Reject, Request More Info */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5EBE8]">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('needs_info')}
                  className="px-4 py-2 rounded-full border border-[#BDD7EE] bg-[#EEF5FB] text-[#2B5A82] text-xs font-bold hover:bg-sky-100 transition-colors"
                >
                  Request Additional Information
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('rejected')}
                    className="px-4 py-2 rounded-full border border-rose-200 bg-rose-50 text-rose-800 text-xs font-bold hover:bg-rose-100 transition-colors"
                  >
                    Reject Application
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('approved')}
                    className="px-6 py-2 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white text-xs font-bold shadow-xs transition-all"
                  >
                    Approve Credentials
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
