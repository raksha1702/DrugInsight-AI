import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  FileText,
  Building,
  ArrowRight,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { verificationService } from '../../services/verificationService';
import { VerificationStatus } from '../../types';

export const VerificationStatusPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTabStatus, setActiveTabStatus] = useState<VerificationStatus>(
    (user?.verificationStatus as VerificationStatus) || 'pending'
  );

  const userReq = user ? verificationService.getRequestByUserId(user.id) : undefined;

  const statusConfigs = {
    pending: {
      title: 'Verification Pending Review',
      badge: 'Pending Review',
      bgColor: 'bg-[#FFF1D9]',
      borderColor: 'border-[#FDE2B3]',
      textColor: 'text-amber-950',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: Clock,
      description: 'Your medical credentials or institutional affiliation documents are queued for administrator audit. During this review period, your account maintains General Public access level.',
      nextStep: 'Admin review takes 24–48 hours. In this demo, you can instantly inspect and approve this request via the Administrator Verifications page.'
    },
    approved: {
      title: 'Credentials Verified & Approved',
      badge: 'Approved',
      bgColor: 'bg-[#EAF5ED]',
      borderColor: 'border-[#A8CDB5]',
      textColor: 'text-[#2E5A44]',
      badgeColor: 'bg-[#EAF5ED] text-[#2E5A44] border-[#A8CDB5]',
      icon: CheckCircle2,
      description: 'Your professional credentials have been validated against official statutory registries. Full access to professional tools is active.',
      nextStep: 'You can now access side-by-side drug comparison, AI research assistant, and advanced pharmaceutical analytics.'
    },
    rejected: {
      title: 'Credential Verification Rejected',
      badge: 'Rejected',
      bgColor: 'bg-[#F9D5D5]',
      borderColor: 'border-rose-300',
      textColor: 'text-rose-950',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: XCircle,
      description: 'The submitted credentials could not be validated or did not meet statutory medical licensing criteria. Your account has been reverted to General Public access.',
      nextStep: 'You may resubmit with an accredited medical license or updated university letterhead.'
    },
    needs_info: {
      title: 'Additional Information Required',
      badge: 'Additional Information Required',
      bgColor: 'bg-[#EEF5FB]',
      borderColor: 'border-[#BDD7EE]',
      textColor: 'text-[#2B5A82]',
      badgeColor: 'bg-sky-100 text-[#2B5A82] border-[#BDD7EE]',
      icon: AlertCircle,
      description: 'The administrator has requested supplemental verification documents. Specific notes: "Official departmental stamp or current license renewal receipt required."',
      nextStep: 'Please upload an updated scan to complete the verification workflow.'
    },
    none: {
      title: 'No Verification on File',
      badge: 'Unverified',
      bgColor: 'bg-[#FAFBF9]',
      borderColor: 'border-[#E5EBE8]',
      textColor: 'text-[#293B42]',
      badgeColor: 'bg-slate-100 text-[#72818A] border-[#E5EBE8]',
      icon: ShieldCheck,
      description: 'You have not submitted professional verification documents yet.',
      nextStep: 'Submit credentials if you are a licensed doctor or pharmaceutical researcher.'
    }
  };

  const currentConfig = statusConfigs[activeTabStatus] || statusConfigs.pending;
  const StatusIcon = currentConfig.icon;

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-[#2E5A44] uppercase tracking-wider bg-[#EAF5ED] px-4 py-1.5 rounded-full">
            Credential Governance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#293B42] mt-3 tracking-tight">
            Verification Status
          </h1>
          <p className="text-xs sm:text-sm text-[#72818A] mt-2">
            Track the compliance and approval status of your professional credentials.
          </p>
        </div>

        {/* Demo Status Preview Switcher (Allows testing all 4 states required in Section 7) */}
        <div className="bg-white p-3 rounded-2xl border border-[#E5EBE8] shadow-xs mb-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-[#72818A] mr-2">Preview State:</span>
          <button
            onClick={() => setActiveTabStatus('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTabStatus === 'pending' ? 'bg-[#FFF1D9] text-amber-900 border border-amber-300' : 'text-[#72818A] hover:bg-slate-50'
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setActiveTabStatus('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTabStatus === 'approved' ? 'bg-[#EAF5ED] text-[#2E5A44] border border-[#A8CDB5]' : 'text-[#72818A] hover:bg-slate-50'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveTabStatus('rejected')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTabStatus === 'rejected' ? 'bg-[#F9D5D5] text-rose-900 border border-rose-300' : 'text-[#72818A] hover:bg-slate-50'
            }`}
          >
            Rejected
          </button>
          <button
            onClick={() => setActiveTabStatus('needs_info')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTabStatus === 'needs_info' ? 'bg-[#EEF5FB] text-[#2B5A82] border border-[#BDD7EE]' : 'text-[#72818A] hover:bg-slate-50'
            }`}
          >
            Needs Info
          </button>
        </div>

        {/* Main Status Display Card */}
        <motion.div
          key={activeTabStatus}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-4xl border-2 shadow-soft mb-8 ${currentConfig.bgColor} ${currentConfig.borderColor}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-black/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/90 flex items-center justify-center shadow-xs">
                <StatusIcon className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-[#293B42]">{currentConfig.title}</h2>
                <div className="text-xs text-[#72818A] mt-0.5">Reference ID: <span className="font-mono">{userReq?.id || 'REQ-2024-8842'}</span></div>
              </div>
            </div>

            <div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${currentConfig.badgeColor}`}>
                {currentConfig.badge}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs sm:text-sm leading-relaxed">{currentConfig.description}</p>

            <div className="p-4 rounded-2xl bg-white/80 border border-black/5 text-xs space-y-2">
              <strong className="block text-sm font-bold text-[#293B42]">Next Action:</strong>
              <p className="text-[#72818A] leading-relaxed">{currentConfig.nextStep}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 pt-6 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
            {activeTabStatus === 'approved' ? (
              <Link
                to="/doctor/dashboard"
                className="px-6 py-2.5 rounded-full bg-[#2E5A44] text-white text-xs font-bold hover:bg-[#244836] transition-all flex items-center gap-2"
              >
                <span>Enter Professional Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                to="/medicines"
                className="px-6 py-2.5 rounded-full bg-white text-[#293B42] border border-[#E5EBE8] text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <span>Explore Public Medicines</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Admin Demo Helper */}
            <Link
              to="/admin/verifications"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5D4487] hover:underline"
            >
              <span>Manage in Admin Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
