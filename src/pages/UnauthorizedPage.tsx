import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock, Pill, ExternalLink, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as { reason?: string } | undefined;

  const isUnverified = state?.reason === 'unverified' || user?.verificationStatus === 'pending';

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-4xl border border-[#E5EBE8] shadow-soft-xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#FFF1D9] border border-amber-300 text-amber-900 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAFBF9] border border-[#E5EBE8] text-[11px] font-bold text-[#72818A] mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricted Healthcare Resource</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#293B42] tracking-tight">
              {isUnverified ? 'Professional Credential Verification Required' : 'Access Restricted by Role Governance'}
            </h1>
            <p className="text-xs sm:text-sm text-[#72818A] mt-2 leading-relaxed">
              {isUnverified
                ? 'Your requested account tier requires verified medical licensure or academic affiliation. You can check your application queue status or explore public medicine information.'
                : 'This specific workspace is restricted to authorized clinicians, verified pharmaceutical researchers, or platform administrators.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs text-left space-y-1 text-[#72818A]">
            <div>Current User: <strong className="text-[#293B42]">{user?.name || 'Anonymous Guest'}</strong></div>
            <div>Account Tier: <span className="font-semibold text-[#5D4487] uppercase">{user?.role || 'Guest'}</span></div>
            <div>Credential Status: <span className="font-semibold text-amber-800">{user?.verificationStatus || 'None'}</span></div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {isUnverified ? (
              <Link
                to="/verification-status"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#5D4487] text-white text-xs font-bold hover:bg-[#4A346F] transition-all flex items-center justify-center gap-2"
              >
                <span>Check Verification Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2E5A44] text-white text-xs font-bold hover:bg-[#244836] transition-all flex items-center justify-center gap-2"
              >
                <span>Switch to Demo Persona</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <Link
              to="/medicines"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white border border-[#E5EBE8] text-[#293B42] text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Public Medicine Search</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
