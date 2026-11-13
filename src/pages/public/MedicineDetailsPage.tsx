import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Pill,
  ShieldCheck,
  AlertTriangle,
  Info,
  Calendar,
  ExternalLink,
  CheckCircle2,
  FileText,
  AlertCircle,
  Share2,
  Bookmark,
  Building,
  HeartHandshake
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { medicineService } from '../../services/medicineService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { researchService } from '../../services/researchService';

export const MedicineDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isDoctor, isResearcher } = useAuth();
  const { success, info } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'uses' | 'sideEffects' | 'warnings' | 'sources'>('overview');

  const medicine = medicineService.getMedicineById(id || '');

  if (!medicine) {
    return (
      <div className="min-h-screen bg-[#FAFBF9] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#FFF1D9] text-amber-800 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#293B42]">Medicine Monograph Not Found</h2>
          <p className="text-sm text-[#72818A] max-w-md mt-2 mb-6">
            The requested medication identifier does not exist in our current DailyMed / openFDA indexed repository.
          </p>
          <Link
            to="/medicines"
            className="px-6 py-2.5 rounded-full bg-[#2E5A44] text-white text-xs font-semibold hover:bg-[#244836] transition-all"
          >
            Back to Medicine Database
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSaveToLibrary = () => {
    if (!isAuthenticated) {
      info('Please sign in to save monographs to your research library.');
      navigate('/login');
      return;
    }
    researchService.saveItem({
      userId: user?.id || 'demo-user',
      type: 'medicine',
      title: `${medicine.name} (${medicine.activeIngredient})`,
      subtitle: `${medicine.category} · ${medicine.dataSource} Monograph`,
      targetId: medicine.id,
      tags: [medicine.category, medicine.dataSource],
      notes: `Saved for reference on ${new Date().toLocaleDateString()}`
    });
    success(`Saved ${medicine.name} to your Research Library.`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'uses', label: 'Approved Uses' },
    { id: 'sideEffects', label: 'Side Effects' },
    { id: 'warnings', label: 'Warnings & Precautions' },
    { id: 'sources', label: 'Official Sources' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/medicines"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#72818A] hover:text-[#2E5A44] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Medicine Search</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToLibrary}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E5EBE8] text-xs font-semibold text-[#293B42] hover:border-[#A8CDB5] hover:shadow-xs transition-all"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#2E5A44]" />
              <span>Save Monograph</span>
            </button>
            {(isDoctor || isResearcher) && (
              <Link
                to={`/${isDoctor ? 'doctor' : 'researcher'}/compare`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF5ED] border border-[#A8CDB5]/40 text-xs font-semibold text-[#2E5A44] hover:bg-[#A8CDB5]/20 transition-all"
              >
                <span>Compare in Workspace</span>
              </Link>
            )}
          </div>
        </div>

        {/* Medicine Header Banner Card */}
        <div className="p-8 rounded-3xl bg-white border border-[#E5EBE8] shadow-card mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center flex-shrink-0 shadow-xs">
                <Pill className="w-8 h-8 -rotate-45" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-3xl font-extrabold text-[#293B42] tracking-tight">{medicine.name}</h1>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5ED] text-[#2E5A44] border border-[#A8CDB5]/50">
                    {medicine.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF5FB] text-[#2B5A82]">
                    {medicine.dataSource} Verified
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#72818A]">
                  Active Ingredient: <strong className="text-[#293B42]">{medicine.activeIngredient}</strong>
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#72818A] pt-1">
                  <span>Formulation: <strong className="text-[#293B42]">{medicine.formulation}</strong></span>
                  <span>•</span>
                  <span>NDC: <span className="font-mono text-[#293B42]">{medicine.ndcCode}</span></span>
                  <span>•</span>
                  <span>SPL Label ID: <span className="font-mono text-[#293B42]">{medicine.labelId}</span></span>
                </div>
              </div>
            </div>

            {/* Source Stamp */}
            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-right flex-shrink-0">
              <div className="text-[11px] font-semibold text-[#72818A] uppercase tracking-wider">Regulatory Source</div>
              <div className="text-xs font-bold text-[#293B42] mt-0.5">{medicine.sourceInfo.sourceName}</div>
              <div className="text-[11px] text-[#72818A] mt-0.5">Updated {medicine.lastUpdated}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E5EBE8] mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2E5A44] text-white shadow-xs'
                    : 'bg-white text-[#72818A] hover:text-[#293B42] border border-transparent hover:border-[#E5EBE8]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="bg-white rounded-3xl border border-[#E5EBE8] shadow-card p-6 sm:p-8 min-h-[380px] mb-8">
          {/* 1. Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#293B42] mb-2">General Clinical Description</h3>
                <p className="text-sm text-[#72818A] leading-relaxed">{medicine.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E5EBE8]">
                <div className="p-5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#293B42] mb-2">Mechanism of Action</h4>
                  <p className="text-xs sm:text-sm text-[#72818A] leading-relaxed">{medicine.mechanismOfAction}</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#293B42] mb-2">Available Formulations & Strengths</h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#72818A]">
                    {medicine.dosageForms.map((df, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E5A44] flex-shrink-0" />
                        <span>{df}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {medicine.storageConditions && (
                <div className="p-4 rounded-2xl bg-[#EEF5FB] border border-[#BDD7EE] text-xs text-[#2B5A82]">
                  <strong>Storage & Stability: </strong> {medicine.storageConditions}
                </div>
              )}
            </motion.div>
          )}

          {/* 2. Approved Uses Tab */}
          {activeTab === 'uses' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#293B42] mb-1">Approved Therapeutic Indications</h3>
                <p className="text-xs text-[#72818A] mb-4">
                  Extracted from Section 1 (Indications and Usage) of official FDA-approved labeling.
                </p>
                <div className="space-y-3">
                  {medicine.approvedUses.map((use, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-[#293B42] leading-relaxed">{use}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. Side Effects Tab */}
          {activeTab === 'sideEffects' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Common Side Effects */}
              <div>
                <h3 className="text-base font-bold text-[#293B42] mb-1 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  Common Adverse Reactions
                </h3>
                <p className="text-xs text-[#72818A] mb-3">Reported in ≥ 1% to 10% of patients in clinical trials.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {medicine.sideEffects.common.map((effect, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs text-[#293B42] font-medium flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#72818A]"></span>
                      <span>{effect}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Serious Reactions */}
              <div>
                <h3 className="text-base font-bold text-rose-800 mb-1 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Serious & Life-Threatening Reactions
                </h3>
                <p className="text-xs text-[#72818A] mb-3">Requires prompt emergency evaluation and intervention.</p>
                <div className="space-y-2.5">
                  {medicine.sideEffects.serious.map((ser, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-950 font-medium flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <span>{ser}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Precautions */}
              <div>
                <h3 className="text-base font-bold text-[#293B42] mb-3">Monitoring & Precautions</h3>
                <div className="space-y-2">
                  {medicine.sideEffects.precautions.map((prec, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs text-[#72818A] flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-[#2E5A44] flex-shrink-0 mt-0.5" />
                      <span>{prec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 4. Warnings Tab */}
          {activeTab === 'warnings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Boxed Warning if present */}
              {medicine.warnings.boxedWarning ? (
                <div className="p-6 rounded-3xl bg-[#FFF1D9] border-2 border-amber-300 shadow-xs">
                  <div className="flex items-center gap-2.5 text-amber-900 font-extrabold text-sm mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-800" />
                    <span>FDA BOXED WARNING (BLACK BOX)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                    {medicine.warnings.boxedWarning}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#EAF5ED] border border-[#A8CDB5] text-xs font-semibold text-[#2E5A44] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No FDA Boxed Warning currently assigned to this active ingredient monograph.</span>
                </div>
              )}

              {/* Contraindications */}
              <div>
                <h3 className="text-base font-bold text-[#293B42] mb-3">Contraindications</h3>
                <div className="space-y-2.5">
                  {medicine.warnings.contraindications.map((contra, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 font-medium flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>{contra}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Warnings & Precautions */}
              <div>
                <h3 className="text-base font-bold text-[#293B42] mb-3">General Warnings & Precautions</h3>
                <div className="space-y-2">
                  {medicine.warnings.warningsAndPrecautions.map((warn, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs text-[#293B42] flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#72818A] mt-1.5 flex-shrink-0"></span>
                      <span className="leading-relaxed">{warn}</span>
                    </div>
                  ))}
                </div>
              </div>

              {medicine.warnings.pregnancyCategory && (
                <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs text-[#72818A]">
                  <strong className="text-[#293B42]">Pregnancy & Lactation Consideration: </strong>
                  {medicine.warnings.pregnancyCategory}
                </div>
              )}
            </motion.div>
          )}

          {/* 5. Sources Tab */}
          {activeTab === 'sources' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#293B42] mb-2">Official Labeling Provenance</h3>
                <p className="text-xs text-[#72818A] mb-4">
                  DrugInsight AI transparently surfaces provenance identifiers directly from statutory regulatory repositories.
                </p>

                <div className="p-6 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[#72818A] block">Source Organization:</span>
                      <strong className="text-[#293B42] text-sm">{medicine.sourceInfo.sourceName}</strong>
                    </div>
                    <div>
                      <span className="text-[#72818A] block">Label Identifier / Set ID:</span>
                      <span className="font-mono text-xs text-[#293B42] font-semibold">{medicine.sourceInfo.labelIdentifier}</span>
                    </div>
                    <div>
                      <span className="text-[#72818A] block">Monograph Revision Date:</span>
                      <strong className="text-[#293B42]">{medicine.sourceInfo.lastUpdated}</strong>
                    </div>
                    <div>
                      <span className="text-[#72818A] block">Direct Regulatory Link:</span>
                      <a
                        href={medicine.sourceInfo.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#2E5A44] hover:underline font-semibold"
                      >
                        Inspect Official Monograph <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5EBE8] text-xs text-[#72818A] italic">
                    {medicine.sourceInfo.disclaimer}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Safety Banner (Mandatory requirement from Section 10) */}
        <div className="p-6 rounded-3xl bg-[#FFF1D9] border border-[#FDE2B3] flex items-start gap-4">
          <div className="w-9 h-9 rounded-2xl bg-amber-200/70 text-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
              Important Patient Educational Notice
            </h4>
            <p className="text-xs sm:text-sm text-[#8F5C14] leading-relaxed">
              This information is educational and is not a substitute for advice from a qualified healthcare professional. Do not start, stop, or change prescribed treatment based on this page.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
