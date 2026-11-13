import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Pill,
  Bot,
  ShieldCheck,
  ArrowRight,
  Stethoscope,
  FlaskConical,
  Sparkles,
  CheckCircle2,
  Lock,
  Search,
  BookOpen,
  FileCheck2,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col selection:bg-[#D9C9F0]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Soft pastel ambient background blobs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-[#EAF5ED]/70 blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-[#D9C9F0]/40 blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-[#BDD7EE]/40 blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Column */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Lavender Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4EEFB] border border-[#D9C9F0] text-[#5D4487] text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#5D4487]" />
                <span>AI-Powered Pharmaceutical Information Platform</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#293B42] tracking-tight leading-[1.15]">
                Explore Medicine Information with{' '}
                <span className="text-[#2E5A44] underline decoration-[#A8CDB5] decoration-wavy decoration-2">
                  Clarity
                </span>{' '}
                and{' '}
                <span className="text-[#5D4487]">
                  Confidence.
                </span>
              </h1>

              {/* Supporting Paragraph */}
              <p className="text-base sm:text-lg text-[#72818A] leading-relaxed max-w-2xl font-normal">
                Discover reliable medicine information and access advanced AI-powered pharmaceutical research tools, designed for healthcare professionals. Built with official DailyMed and openFDA labeling standards.
              </p>

              {/* Two Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/medicines"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white font-semibold text-sm shadow-soft-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore Medicines</span>
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-[#F4EEFB] text-[#293B42] border border-[#D9C9F0] font-semibold text-sm shadow-card hover:shadow-soft transition-all hover:scale-[1.02]"
                >
                  <ShieldCheck className="w-4 h-4 text-[#5D4487]" />
                  <span>Professional Access</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#E5EBE8] flex flex-wrap items-center gap-6 text-xs text-[#72818A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E5A44]" />
                  <span>Structured DailyMed Monograph Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E5A44]" />
                  <span>Licensure Verification for Clinicians</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E5A44]" />
                  <span>Strict Non-Prescriptive AI Safety</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Column: Premium Healthcare 3D-Style Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-5 relative flex justify-center items-center"
            >
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-[#EAF5ED] via-[#FFFFFF] to-[#EEF5FB] p-8 border border-[#E5EBE8] shadow-soft-xl flex items-center justify-center overflow-hidden">
                {/* Background pastel circles */}
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#D9C9F0]/30 blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#A8CDB5]/30 blur-xl"></div>

                {/* Floating Molecule Nodes */}
                <motion.div
                  animate={{ y: [-6, 6, -6], rotate: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  className="absolute top-8 left-8 p-3 rounded-2xl bg-white/90 backdrop-blur-xs border border-[#BDD7EE] shadow-soft"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#2B5A82]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#BDD7EE] animate-pulse"></span>
                    C₁₀H₁₅ClN₂ · SPL Monograph
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [8, -8, 8] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-10 right-8 p-3 rounded-2xl bg-white/95 backdrop-blur-xs border border-[#A8CDB5] shadow-soft"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#2E5A44]">
                    <ShieldCheck className="w-4 h-4 text-[#2E5A44]" />
                    FDA Label Verified
                  </div>
                </motion.div>

                {/* Central Visual: Stylized Medicine Bottle and Capsules */}
                <div className="relative z-10 flex flex-col items-center">
                  {/* Medicine Bottle */}
                  <div className="w-40 h-56 rounded-3xl bg-gradient-to-b from-[#A8CDB5] via-[#B8DBC4] to-[#8EB79C] p-2 shadow-2xl relative flex flex-col items-center border border-white/60">
                    {/* Bottle Cap */}
                    <div className="w-24 h-7 -mt-7 rounded-t-xl bg-[#FFFFFF] border-2 border-[#A8CDB5] shadow-xs flex items-center justify-center">
                      <div className="w-16 h-1 rounded-full bg-[#E5EBE8]"></div>
                    </div>
                    {/* Bottle Label */}
                    <div className="w-full flex-1 rounded-2xl bg-white/95 p-3 flex flex-col justify-between shadow-inner mt-2">
                      <div className="flex items-center justify-between border-b border-[#E5EBE8] pb-1.5">
                        <span className="text-[10px] font-bold text-[#2E5A44]">Rx EVIDENCE</span>
                        <div className="w-2 h-2 rounded-full bg-[#2E5A44]"></div>
                      </div>
                      <div className="text-center my-auto">
                        <div className="text-xs font-black text-[#293B42] tracking-wider uppercase">Metformin HCl</div>
                        <div className="text-[10px] text-[#72818A]">500 mg Extended Release</div>
                        <div className="text-[9px] text-[#2E5A44] font-medium mt-1">DailyMed SPL Set ID</div>
                      </div>
                      <div className="w-full bg-[#EAF5ED] py-1 rounded text-center text-[9px] font-bold text-[#2E5A44]">
                        Official Monograph
                      </div>
                    </div>
                  </div>

                  {/* Floating Capsules */}
                  <motion.div
                    animate={{ y: [-4, 6, -4], rotate: [12, 18, 12] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                    className="absolute -right-6 top-20 w-16 h-8 rounded-full bg-gradient-to-r from-white via-white to-[#D9C9F0] border border-[#D9C9F0] shadow-soft-lg flex items-center justify-center"
                  >
                    <div className="w-px h-full bg-[#D9C9F0]/60"></div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [6, -6, 6], rotate: [-20, -14, -20] }}
                    transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut' }}
                    className="absolute -left-6 bottom-16 w-14 h-7 rounded-full bg-gradient-to-r from-[#A8CDB5] to-white border border-[#A8CDB5] shadow-soft-lg flex items-center justify-center"
                  >
                    <div className="w-px h-full bg-[#A8CDB5]/60"></div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section (Below Hero) */}
      <section className="py-12 bg-white border-y border-[#E5EBE8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Reliable Medicine Information */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-8 rounded-3xl bg-[#EAF5ED] border border-[#A8CDB5]/40 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white text-[#2E5A44] flex items-center justify-center shadow-xs mb-6">
                  <Pill className="w-6 h-6 -rotate-45" />
                </div>
                <h3 className="text-xl font-bold text-[#293B42] mb-3">Reliable Medicine Information</h3>
                <p className="text-sm text-[#72818A] leading-relaxed">
                  Explore medicine uses, side effects, and important safety warnings from official sources. Full access to structured DailyMed and openFDA labeling.
                </p>
              </div>
              <div className="pt-6 mt-4 border-t border-[#A8CDB5]/30">
                <Link to="/medicines" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E5A44] hover:underline">
                  Search 24,000+ Monographs <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Card 2: AI-Assisted Research */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-8 rounded-3xl bg-[#F4EEFB] border border-[#D9C9F0]/60 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white text-[#5D4487] flex items-center justify-center shadow-xs mb-6">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#293B42] mb-3">AI-Assisted Research</h3>
                <p className="text-sm text-[#72818A] leading-relaxed">
                  Ask pharmaceutical research questions and explore evidence-based answers with verified citations directly mapped to regulatory SPL sections.
                </p>
              </div>
              <div className="pt-6 mt-4 border-t border-[#D9C9F0]/40">
                <Link to="/register" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5D4487] hover:underline">
                  Explore Research Assistant <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Card 3: Verified Professional Access */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-8 rounded-3xl bg-[#EEF5FB] border border-[#BDD7EE]/60 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white text-[#2B5A82] flex items-center justify-center shadow-xs mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#293B42] mb-3">Verified Professional Access</h3>
                <p className="text-sm text-[#72818A] leading-relaxed">
                  Advanced research tools are reserved for approved doctors and pharmaceutical researchers through administrator credential review.
                </p>
              </div>
              <div className="pt-6 mt-4 border-t border-[#BDD7EE]/40">
                <Link to="/verify-professional" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2B5A82] hover:underline">
                  Submit Credentials <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#FAFBF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#2E5A44] uppercase tracking-wider bg-[#EAF5ED] px-3.5 py-1 rounded-full">
              Platform Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#293B42] mt-4 tracking-tight">
              How DrugInsight AI Works
            </h2>
            <p className="text-sm sm:text-base text-[#72818A] mt-3">
              A transparent four-step pathway from open exploration to credentialed research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5EBE8] shadow-card relative flex flex-col">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF5ED] text-[#2E5A44] font-bold text-sm flex items-center justify-center mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-[#293B42] mb-2">Explore Medicines</h4>
              <p className="text-xs text-[#72818A] leading-relaxed flex-1">
                Freely search medications, study approved uses, common adverse reactions, and official boxed warnings.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5EBE8] shadow-card relative flex flex-col">
              <div className="w-10 h-10 rounded-2xl bg-[#F4EEFB] text-[#5D4487] font-bold text-sm flex items-center justify-center mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-[#293B42] mb-2">Create an Account</h4>
              <p className="text-xs text-[#72818A] leading-relaxed flex-1">
                Select your intended profile tier: General Public, Medical Doctor, or Pharmaceutical Researcher.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5EBE8] shadow-card relative flex flex-col">
              <div className="w-10 h-10 rounded-2xl bg-[#EEF5FB] text-[#2B5A82] font-bold text-sm flex items-center justify-center mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-[#293B42] mb-2">Verify Credentials</h4>
              <p className="text-xs text-[#72818A] leading-relaxed flex-1">
                Upload state registration or institutional affiliation for thorough administrator review and audit.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5EBE8] shadow-card relative flex flex-col">
              <div className="w-10 h-10 rounded-2xl bg-[#FDF3EE] text-[#8E4D2B] font-bold text-sm flex items-center justify-center mb-4">
                4
              </div>
              <h4 className="text-base font-bold text-[#293B42] mb-2">Role Research Suite</h4>
              <p className="text-xs text-[#72818A] leading-relaxed flex-1">
                Gain access to comparative tables, deep pharmaceutical analytics, AI citations, and research reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Professional Portals Overview Cards */}
      <section className="py-16 bg-white border-t border-[#E5EBE8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Doctor Portal Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#F4EEFB] to-white border border-[#D9C9F0] shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D9C9F0] text-[#5D4487] flex items-center justify-center">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#293B42]">Doctor Workspace</h3>
                  <span className="text-xs font-semibold text-[#5D4487]">Clinical Pharmacological Suite</span>
                </div>
              </div>
              <p className="text-sm text-[#72818A] mb-6 leading-relaxed">
                Designed for licensed physicians to review multi-drug comparative monographs, evaluate adverse interaction profiles, query evidence-based AI citations, and compile clinical briefing reports.
              </p>
              <ul className="space-y-2.5 text-xs text-[#293B42] mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5D4487]" />
                  <span>Side-by-side drug comparison tables</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5D4487]" />
                  <span>AI assistant with DailyMed SPL citations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5D4487]" />
                  <span>Personalized research library & saved collections</span>
                </li>
              </ul>
              <Link
                to="/doctor/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5D4487] text-white font-semibold text-xs hover:bg-[#4B366E] shadow-sm transition-all"
              >
                <span>Enter Doctor Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Researcher Portal Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#EEF5FB] to-white border border-[#BDD7EE] shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#BDD7EE] text-[#2B5A82] flex items-center justify-center">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#293B42]">Researcher Portal</h3>
                  <span className="text-xs font-semibold text-[#2B5A82]">Pharmaceutical Analytics & Intelligence</span>
                </div>
              </div>
              <p className="text-sm text-[#72818A] mb-6 leading-relaxed">
                Empowering academic pharmacologists and biostatisticians with interactive dataset distributions, labeling trend analytics, regulatory revision history, and structured export capabilities.
              </p>
              <ul className="space-y-2.5 text-xs text-[#293B42] mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2B5A82]" />
                  <span>Interactive Recharts analytics dashboards</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2B5A82]" />
                  <span>Label update timelines & warning section analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2B5A82]" />
                  <span>Automated report generation and data exports</span>
                </li>
              </ul>
              <Link
                to="/researcher/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2B5A82] text-white font-semibold text-xs hover:bg-[#204566] shadow-sm transition-all"
              >
                <span>Enter Researcher Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
