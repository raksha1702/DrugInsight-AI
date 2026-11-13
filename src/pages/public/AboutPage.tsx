import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ShieldCheck, HeartHandshake, Database, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#2E5A44] uppercase tracking-wider bg-[#EAF5ED] px-4 py-1.5 rounded-full">
            Our Purpose & Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#293B42] mt-4 tracking-tight">
            About DrugInsight AI
          </h1>
          <p className="text-base text-[#72818A] mt-4 leading-relaxed">
            Bridging the gap between official regulatory product labeling and clinical research through structured intelligence, role-based governance, and safe AI assistance.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-white border border-[#E5EBE8] shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center font-bold">
              <Pill className="w-6 h-6 -rotate-45" />
            </div>
            <h3 className="text-xl font-bold text-[#293B42]">The Clarity Imperative</h3>
            <p className="text-sm text-[#72818A] leading-relaxed">
              Pharmaceutical labeling contains thousands of pages of critical safety monographs, pharmacokinetic findings, and postmarketing warnings. Yet finding clear, authoritative comparisons has historically required wading through dense, disparate XML filings.
            </p>
            <p className="text-sm text-[#72818A] leading-relaxed">
              DrugInsight AI transforms raw DailyMed SPL and openFDA endpoints into intuitive, verifiable information cards and side-by-side matrices.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E5EBE8] shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F4EEFB] text-[#5D4487] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#293B42]">Credentialed Governance</h3>
            <p className="text-sm text-[#72818A] leading-relaxed">
              Unlike generic chatbot interfaces that hallucinate clinical advice, DrugInsight AI enforces role-gated access tiers. Only verified physicians and accredited researchers can access deep pharmacological analytics, cross-drug matrices, and research exports.
            </p>
            <p className="text-sm text-[#72818A] leading-relaxed">
              Every professional credential undergoes administrative review and complete audit trail logging.
            </p>
          </div>
        </div>

        {/* Pillars of Integrity */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#EAF5ED]/60 border border-[#A8CDB5]/40 mb-16 space-y-6">
          <h2 className="text-2xl font-bold text-[#293B42]">Core Architectural Principles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm font-bold text-[#2E5A44] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Hallucination Policy</span>
              </div>
              <p className="text-xs text-[#72818A] leading-relaxed">
                All AI synthesis requires direct citations referencing official SPL section numbers and label IDs.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-bold text-[#2E5A44] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Non-Prescriptive Safety</span>
              </div>
              <p className="text-xs text-[#72818A] leading-relaxed">
                Platform strictly refuses individual patient prescription recommendations or treatment alteration directives.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-bold text-[#2E5A44] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Regulatory Provenance</span>
              </div>
              <p className="text-xs text-[#72818A] leading-relaxed">
                Every record preserves timestamped links back to official National Library of Medicine (NLM) sources.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-[#293B42]">Ready to explore the medicine archive?</h3>
          <div className="flex justify-center gap-4">
            <Link
              to="/medicines"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2E5A44] text-white text-xs font-bold hover:bg-[#244836] shadow-sm transition-all"
            >
              <span>Explore Public Medicines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#293B42] border border-[#E5EBE8] text-xs font-bold hover:bg-slate-50 transition-all"
            >
              <span>Register for Professional Tier</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
