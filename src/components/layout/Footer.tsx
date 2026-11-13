import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ShieldCheck, HeartHandshake, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAFBF9] border-t border-[#E5EBE8] text-[#293B42] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Disclaimer Banner */}
        <div className="mb-12 p-5 rounded-3xl bg-[#FFF1D9] border border-[#FDE2B3] flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-800 flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs md:text-sm text-[#8F5C14] leading-relaxed">
            <strong className="font-semibold block md:inline mb-1 md:mb-0">Medical and Research Disclaimer: </strong>
            DrugInsight AI is an informational and pharmaceutical research platform. Content, AI summaries, and comparative monographs are extracted from official regulatory databases (DailyMed / openFDA) for academic and educational exploration. This service does not provide clinical diagnosis, patient prescriptions, or personalized treatment advice.
          </div>
          <Link
            to="/safety"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-amber-900 border border-amber-300 shadow-sm transition-all whitespace-nowrap"
          >
            Read Safety Policy
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#E5EBE8]">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#EAF5ED] border border-[#A8CDB5]/40 flex items-center justify-center text-[#2E5A44]">
                <Pill className="w-4 h-4 -rotate-45" />
              </div>
              <span className="font-bold text-lg text-[#293B42]">DrugInsight <span className="text-[#2E5A44]">AI</span></span>
            </div>
            <p className="text-xs sm:text-sm text-[#72818A] max-w-sm leading-relaxed">
              Explore medicine information with clarity and confidence. Bridging regulatory data from DailyMed and openFDA with modern AI research tooling for healthcare professionals.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#2E5A44] bg-[#EAF5ED] px-3 py-1.5 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Audited Regulatory Data
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#5D4487] bg-[#D9C9F0]/30 px-3 py-1.5 rounded-full font-medium">
                <HeartHandshake className="w-3.5 h-3.5" />
                Verified Professionals
              </span>
            </div>
          </div>

          {/* Col 2: Public Exploration */}
          <div>
            <h4 className="text-xs font-bold text-[#293B42] uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#72818A]">
              <li><Link to="/medicines" className="hover:text-[#2E5A44] transition-colors">Public Medicine Search</Link></li>
              <li><Link to="/medicines/metformin" className="hover:text-[#2E5A44] transition-colors">Metformin Monograph</Link></li>
              <li><Link to="/medicines/amoxicillin" className="hover:text-[#2E5A44] transition-colors">Amoxicillin Profile</Link></li>
              <li><Link to="/medicines/amlodipine" className="hover:text-[#2E5A44] transition-colors">Amlodipine Warnings</Link></li>
              <li><Link to="/about" className="hover:text-[#2E5A44] transition-colors">About Our Platform</Link></li>
            </ul>
          </div>

          {/* Col 3: Professional Portals */}
          <div>
            <h4 className="text-xs font-bold text-[#293B42] uppercase tracking-wider mb-4">Professional Access</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#72818A]">
              <li><Link to="/verify-professional" className="hover:text-[#2E5A44] transition-colors">Professional Verification</Link></li>
              <li><Link to="/verification-status" className="hover:text-[#2E5A44] transition-colors">Check Status</Link></li>
              <li><Link to="/doctor/dashboard" className="hover:text-[#2E5A44] transition-colors">Doctor Portal</Link></li>
              <li><Link to="/researcher/dashboard" className="hover:text-[#2E5A44] transition-colors">Researcher Portal</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-[#2E5A44] transition-colors">Admin Governance</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-[#293B42] uppercase tracking-wider mb-4">Trust & Compliance</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#72818A]">
              <li><Link to="/safety" className="hover:text-[#2E5A44] transition-colors">Safety Guidelines</Link></li>
              <li><Link to="/contact" className="hover:text-[#2E5A44] transition-colors">Support & Contact</Link></li>
              <li>
                <a
                  href="https://dailymed.nlm.nih.gov"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#2E5A44] transition-colors"
                >
                  DailyMed NLM <ExternalLink className="w-3 h-3 text-[#72818A]" />
                </a>
              </li>
              <li>
                <a
                  href="https://open.fda.gov"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#2E5A44] transition-colors"
                >
                  openFDA APIs <ExternalLink className="w-3 h-3 text-[#72818A]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#72818A] gap-4">
          <p>© {new Date().getFullYear()} DrugInsight AI. All rights reserved. Built for healthcare clarity.</p>
          <div className="flex items-center gap-6">
            <Link to="/safety" className="hover:text-[#293B42]">Disclaimer</Link>
            <Link to="/about" className="hover:text-[#293B42]">Methodology</Link>
            <Link to="/contact" className="hover:text-[#293B42]">Ethics & Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
