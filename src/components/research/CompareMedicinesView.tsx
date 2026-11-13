import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitCompare,
  ArrowRight,
  Bookmark,
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Pill,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { medicineService } from '../../services/medicineService';
import { researchService } from '../../services/researchService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Medicine } from '../../types';

export const CompareMedicinesView: React.FC = () => {
  const allMeds = medicineService.getAllMedicines();
  const [medIdA, setMedIdA] = useState<string>('amlodipine');
  const [medIdB, setMedIdB] = useState<string>('lisinopril');
  const [compared, setCompared] = useState<boolean>(true);
  const [expandedSection, setExpandedSection] = useState<Record<string, boolean>>({
    uses: true,
    contraindications: true,
    sideEffects: true,
    warnings: true
  });

  const { success } = useToast();
  const { user } = useAuth();

  const medA: Medicine | undefined = medicineService.getMedicineById(medIdA);
  const medB: Medicine | undefined = medicineService.getMedicineById(medIdB);

  const handleCompare = () => {
    if (medIdA === medIdB) {
      alert('Please select two distinct medications for comparison.');
      return;
    }
    setCompared(true);
  };

  const handleReset = () => {
    setMedIdA(allMeds[0]?.id || '');
    setMedIdB(allMeds[1]?.id || '');
    setCompared(false);
  };

  const handleSaveComparison = () => {
    if (!medA || !medB) return;
    researchService.saveItem({
      userId: user?.id || 'demo-user',
      type: 'comparison',
      title: `${medA.name} vs ${medB.name} Comparative Monograph`,
      subtitle: `Side-by-side analysis of ${medA.category} and ${medB.category}`,
      targetId: `${medA.id}-${medB.id}`,
      tags: [medA.name, medB.name, 'Comparative Monograph'],
      notes: `Comparison recorded on ${new Date().toLocaleDateString()}`
    });
    success(`Saved comparison (${medA.name} vs ${medB.name}) to your Research Library.`);
  };

  const handleExport = () => {
    if (!medA || !medB) return;
    researchService.createReport({
      title: `Comparative Clinical Profile: ${medA.name} vs ${medB.name}`,
      type: 'Comparative Analysis',
      medicines: [medA.name, medB.name],
      author: user?.name || 'Verified Clinician',
      includeCharts: true,
      includeSources: true
    });
    success('Generated exportable comparative brief in your Reports dashboard.');
  };

  const toggleSection = (sec: string) => {
    setExpandedSection(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white p-8 rounded-4xl border border-[#E5EBE8] shadow-card">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F4EEFB] text-[#5D4487] text-xs font-semibold mb-2">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Comparative Regulatory Monograph Analysis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#293B42] tracking-tight">
            Compare Medicines
          </h2>
          <p className="text-xs sm:text-sm text-[#72818A] mt-1.5 leading-relaxed">
            Explore differences in published FDA-approved medicine information side-by-side. Inspect contrasting indications, pharmacokinetics, and warning classifications.
          </p>
        </div>

        {/* Two Searchable Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6 items-end">
          {/* Medicine A */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-[#293B42] mb-1.5 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center text-[10px]">A</span>
              <span>Select Medicine A</span>
            </label>
            <select
              value={medIdA}
              onChange={e => setMedIdA(e.target.value)}
              className="w-full bg-[#FAFBF9] border border-[#E5EBE8] rounded-2xl px-4 py-3 text-xs font-semibold text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] shadow-xs cursor-pointer"
            >
              {allMeds.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.activeIngredient}) — {m.category}
                </option>
              ))}
            </select>
          </div>

          {/* Versus Icon */}
          <div className="md:col-span-2 flex items-center justify-center pb-2">
            <div className="w-10 h-10 rounded-full bg-[#F4EEFB] border border-[#D9C9F0] text-[#5D4487] font-bold text-xs flex items-center justify-center shadow-xs">
              VS
            </div>
          </div>

          {/* Medicine B */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-[#293B42] mb-1.5 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#EEF5FB] text-[#2B5A82] flex items-center justify-center text-[10px]">B</span>
              <span>Select Medicine B</span>
            </label>
            <select
              value={medIdB}
              onChange={e => setMedIdB(e.target.value)}
              className="w-full bg-[#FAFBF9] border border-[#E5EBE8] rounded-2xl px-4 py-3 text-xs font-semibold text-[#293B42] focus:outline-hidden focus:border-[#BDD7EE] shadow-xs cursor-pointer"
            >
              {allMeds.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.activeIngredient}) — {m.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-6 border-t border-[#E5EBE8]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCompare}
              className="px-6 py-2.5 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-2"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Medicines</span>
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-full bg-white border border-[#E5EBE8] text-[#72818A] hover:text-[#293B42] text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {compared && medA && medB && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveComparison}
                className="px-4 py-2 rounded-full bg-[#FAFBF9] border border-[#E5EBE8] text-xs font-semibold text-[#293B42] hover:border-[#A8CDB5] transition-all flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#2E5A44]" />
                <span>Save Comparison</span>
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-full bg-[#FAFBF9] border border-[#E5EBE8] text-xs font-semibold text-[#293B42] hover:border-[#D9C9F0] transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#5D4487]" />
                <span>Export Report</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Results Table */}
      {compared && medA && medB && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Side-by-side Top Header Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sticky top-20 z-10">
            {/* Header Card A */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[#A8CDB5] shadow-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center font-bold">
                  <Pill className="w-6 h-6 -rotate-45" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#2E5A44] uppercase tracking-wider">Candidate A</div>
                  <h3 className="text-xl font-bold text-[#293B42]">{medA.name}</h3>
                  <div className="text-xs text-[#72818A]">{medA.activeIngredient}</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5ED] text-[#2E5A44]">
                {medA.category}
              </span>
            </div>

            {/* Header Card B */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[#BDD7EE] shadow-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF5FB] text-[#2B5A82] flex items-center justify-center font-bold">
                  <Pill className="w-6 h-6 -rotate-45" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#2B5A82] uppercase tracking-wider">Candidate B</div>
                  <h3 className="text-xl font-bold text-[#293B42]">{medB.name}</h3>
                  <div className="text-xs text-[#72818A]">{medB.activeIngredient}</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EEF5FB] text-[#2B5A82]">
                {medB.category}
              </span>
            </div>
          </div>

          {/* Section 1: Core Parameters */}
          <div className="bg-white rounded-3xl border border-[#E5EBE8] shadow-card overflow-hidden">
            <div className="bg-[#FAFBF9] px-6 py-3 border-b border-[#E5EBE8] text-xs font-bold text-[#293B42] uppercase tracking-wider">
              Pharmaceutical Specifications
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5EBE8] p-6 gap-6">
              <div className="space-y-3 text-xs">
                <div><span className="text-[#72818A] block">Formulation:</span> <strong className="text-[#293B42]">{medA.formulation}</strong></div>
                <div><span className="text-[#72818A] block">Mechanism:</span> <p className="text-[#72818A] leading-relaxed mt-0.5">{medA.mechanismOfAction}</p></div>
                <div><span className="text-[#72818A] block">Available Dosages:</span> <div className="text-[#293B42] mt-0.5">{medA.dosageForms.join(', ')}</div></div>
              </div>
              <div className="space-y-3 text-xs">
                <div><span className="text-[#72818A] block">Formulation:</span> <strong className="text-[#293B42]">{medB.formulation}</strong></div>
                <div><span className="text-[#72818A] block">Mechanism:</span> <p className="text-[#72818A] leading-relaxed mt-0.5">{medB.mechanismOfAction}</p></div>
                <div><span className="text-[#72818A] block">Available Dosages:</span> <div className="text-[#293B42] mt-0.5">{medB.dosageForms.join(', ')}</div></div>
              </div>
            </div>
          </div>

          {/* Section 2: Approved Indications */}
          <div className="bg-white rounded-3xl border border-[#E5EBE8] shadow-card overflow-hidden">
            <button
              onClick={() => toggleSection('uses')}
              className="w-full bg-[#FAFBF9] px-6 py-3 border-b border-[#E5EBE8] flex items-center justify-between text-xs font-bold text-[#293B42] uppercase tracking-wider hover:bg-slate-50 transition-colors"
            >
              <span>FDA Approved Indications</span>
              {expandedSection.uses ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSection.uses && (
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5EBE8] p-6 gap-6">
                <ul className="space-y-2 text-xs text-[#293B42]">
                  {medA.approvedUses.map((u, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E5A44] flex-shrink-0 mt-0.5" />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2 text-xs text-[#293B42]">
                  {medB.approvedUses.map((u, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2B5A82] flex-shrink-0 mt-0.5" />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section 3: Boxed Warnings & Contraindications */}
          <div className="bg-white rounded-3xl border border-[#E5EBE8] shadow-card overflow-hidden">
            <button
              onClick={() => toggleSection('warnings')}
              className="w-full bg-[#FAFBF9] px-6 py-3 border-b border-[#E5EBE8] flex items-center justify-between text-xs font-bold text-amber-950 uppercase tracking-wider hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Boxed Warnings & Contraindications</span>
              </div>
              {expandedSection.warnings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSection.warnings && (
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5EBE8] p-6 gap-6">
                {/* Warnings Med A */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-[#72818A] uppercase tracking-wider block mb-1">Boxed Warning</span>
                    {medA.warnings.boxedWarning ? (
                      <div className="p-3.5 rounded-2xl bg-[#FFF1D9] border border-amber-300 text-xs text-amber-950 leading-relaxed font-medium">
                        {medA.warnings.boxedWarning}
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-[#EAF5ED] text-[#2E5A44] text-xs font-medium">
                        No FDA Boxed Warning on file.
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#72818A] uppercase tracking-wider block mb-1">Contraindications</span>
                    <ul className="space-y-1.5 text-xs text-rose-900">
                      {medA.warnings.contraindications.map((c, i) => (
                        <li key={i} className="p-2 rounded-xl bg-rose-50/70 border border-rose-100 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 flex-shrink-0"></span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Warnings Med B */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-[#72818A] uppercase tracking-wider block mb-1">Boxed Warning</span>
                    {medB.warnings.boxedWarning ? (
                      <div className="p-3.5 rounded-2xl bg-[#FFF1D9] border border-amber-300 text-xs text-amber-950 leading-relaxed font-medium">
                        {medB.warnings.boxedWarning}
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-[#EAF5ED] text-[#2E5A44] text-xs font-medium">
                        No FDA Boxed Warning on file.
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#72818A] uppercase tracking-wider block mb-1">Contraindications</span>
                    <ul className="space-y-1.5 text-xs text-rose-900">
                      {medB.warnings.contraindications.map((c, i) => (
                        <li key={i} className="p-2 rounded-xl bg-rose-50/70 border border-rose-100 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 flex-shrink-0"></span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Provenance & Version Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-3xl bg-white border border-[#E5EBE8] text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#72818A]">Provenance — {medA.name}</span>
              <div className="font-bold text-[#293B42]">{medA.sourceInfo.sourceName}</div>
              <div className="text-[#72818A]">Label ID: <span className="font-mono">{medA.sourceInfo.labelIdentifier}</span></div>
              <div className="text-[#72818A]">Revision: {medA.lastUpdated}</div>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-[#E5EBE8] text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#72818A]">Provenance — {medB.name}</span>
              <div className="font-bold text-[#293B42]">{medB.sourceInfo.sourceName}</div>
              <div className="text-[#72818A]">Label ID: <span className="font-mono">{medB.sourceInfo.labelIdentifier}</span></div>
              <div className="text-[#72818A]">Revision: {medB.lastUpdated}</div>
            </div>
          </div>

          {/* Non-Prescriptive Legal Compliance Notice (From Section 13) */}
          <div className="p-5 rounded-3xl bg-[#FFF1D9] border border-[#FDE2B3] flex items-center gap-3 text-xs text-amber-950">
            <AlertCircle className="w-5 h-5 text-amber-800 flex-shrink-0" />
            <div>
              <strong>Comparative Monograph Compliance Notice: </strong>
              This side-by-side comparison displays statutory product labeling parameters for educational and academic research. DrugInsight AI does not evaluate patient clinical history and does not recommend which medication an individual patient should take.
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
