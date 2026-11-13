import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ShieldAlert, CheckCircle2, Lock, ArrowRight, HeartPulse, UserX } from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const SafetyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1D9] border border-amber-300 text-amber-900 text-xs font-bold mb-3">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Compliance, Ethics & Clinical Boundaries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#293B42] tracking-tight">
            Safety & Regulatory Disclaimers
          </h1>
          <p className="text-sm text-[#72818A] mt-2">
            DrugInsight AI is an academic and pharmaceutical research platform. Please review our safety guardrails.
          </p>
        </div>

        {/* Warning Callout Box */}
        <div className="p-8 rounded-3xl bg-[#FFF1D9] border-2 border-amber-300 mb-10 shadow-xs space-y-4">
          <div className="flex items-center gap-3 text-amber-950 font-bold text-base">
            <ShieldAlert className="w-6 h-6 text-amber-800 flex-shrink-0" />
            <span>Not a Substitute for Professional Medical Advice</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-normal">
            The information presented on DrugInsight AI—including all drug monographs, side effect listings, contraindication matrices, and AI research query outputs—is strictly compiled for informational, educational, and pharmacological research purposes.
          </p>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-semibold">
            Under no circumstances should any individual initiate, discontinue, adjust, or substitute prescribed medical treatment based on content viewed on this platform. If you have immediate health concerns or questions regarding medication, consult a qualified physician or registered pharmacist.
          </p>
        </div>

        {/* Guardrails Breakdown */}
        <div className="space-y-6 mb-12">
          <h2 className="text-xl font-bold text-[#293B42]">Core Clinical Safety Guardrails</h2>

          <div className="p-6 rounded-3xl bg-white border border-[#E5EBE8] shadow-card space-y-2">
            <h3 className="text-sm font-bold text-[#293B42] flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-600" />
              <span>Strict AI Refusal of Diagnostic Queries</span>
            </h3>
            <p className="text-xs text-[#72818A] leading-relaxed">
              Our AI Research Assistant has been programmatically restricted to prevent providing personalized differential diagnoses or recommending that specific individuals ingest or halt a pharmaceutical therapy. Unsafe prompts trigger automated refusal notices.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E5EBE8] shadow-card space-y-2">
            <h3 className="text-sm font-bold text-[#293B42] flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-[#2E5A44]" />
              <span>Labeling Harmonization via DailyMed / openFDA</span>
            </h3>
            <p className="text-xs text-[#72818A] leading-relaxed">
              All monographs are ingested from regulatory Structured Product Labeling (SPL) standards. Whenever an official revision is released by drug manufacturers or regulatory bodies, our catalog updates its version timestamps.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E5EBE8] shadow-card space-y-2">
            <h3 className="text-sm font-bold text-[#293B42] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#5D4487]" />
              <span>Credential Verification Protocols</span>
            </h3>
            <p className="text-xs text-[#72818A] leading-relaxed">
              Access to cross-monograph comparative tables and raw research datasets requires manual administrative approval of recognized state medical licenses or verified university faculty affiliations.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-6 rounded-2xl bg-[#EAF5ED] border border-[#A8CDB5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#2E5A44]">
            <strong>Have questions or wish to report a labeling inconsistency?</strong>
            <p className="text-[11px] text-[#2E5A44]/80 mt-0.5">Contact our regulatory oversight team for prompt resolution.</p>
          </div>
          <Link
            to="/contact"
            className="px-5 py-2 rounded-full bg-[#2E5A44] text-white text-xs font-semibold hover:bg-[#244836] transition-all whitespace-nowrap"
          >
            Contact Support
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
