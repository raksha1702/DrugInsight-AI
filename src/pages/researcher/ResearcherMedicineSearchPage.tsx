import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Pill, ChevronRight, Bookmark, Database } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { medicineService } from '../../services/medicineService';
import { researchService } from '../../services/researchService';
import { useToast } from '../../context/ToastContext';

export const ResearcherMedicineSearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('all');
  const { success } = useToast();

  const medicines = medicineService.searchMedicines({ query, dataSource: source });
  const sources = medicineService.getDataSources();

  const handleSave = (med: any) => {
    researchService.saveItem({
      userId: 'user-res-03',
      type: 'medicine',
      title: `${med.name} (${med.activeIngredient})`,
      subtitle: `SPL Set ID: ${med.labelId} · ${med.dataSource}`,
      targetId: med.id,
      tags: [med.category, 'Pharmacological Dataset'],
      notes: 'Added from researcher catalog search.'
    });
    success(`Saved ${med.name} to Research Library.`);
  };

  return (
    <DashboardLayout portalType="researcher">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#293B42] tracking-tight">Pharmaceutical Dataset Search</h2>
          <p className="text-xs sm:text-sm text-[#72818A] mt-1">
            Query indexed DailyMed Structured Product Labels (SPL) and openFDA drug product archives.
          </p>
        </div>

        {/* Search controls */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5EBE8] shadow-card flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 relative w-full flex items-center">
            <Search className="w-4 h-4 text-[#72818A] absolute left-3.5" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by active molecule, brand name, or mechanism..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#BDD7EE]"
            />
          </div>

          <select
            value={source}
            onChange={e => setSource(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs font-semibold text-[#293B42] focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Regulatory Sources</option>
            {sources.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {medicines.map(m => (
            <div
              key={m.id}
              className="p-5 rounded-3xl bg-white border border-[#E5EBE8] shadow-card hover:border-[#BDD7EE] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF5FB] text-[#2B5A82] flex items-center justify-center font-bold flex-shrink-0">
                  <Pill className="w-6 h-6 -rotate-45" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#293B42]">{m.name}</h3>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF5FB] text-[#2B5A82]">
                      {m.dataSource}
                    </span>
                    <span className="text-[10px] font-mono text-[#72818A]">
                      {m.labelId}
                    </span>
                  </div>
                  <div className="text-xs text-[#72818A]">
                    Active Moiety: <strong className="text-[#293B42]">{m.activeIngredient}</strong> · NDC: {m.ndcCode}
                  </div>
                  <p className="text-xs text-[#72818A] line-clamp-1 mt-1 max-w-2xl">{m.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
                <button
                  onClick={() => handleSave(m)}
                  className="p-2 rounded-xl border border-[#E5EBE8] text-[#72818A] hover:text-[#2B5A82] hover:bg-[#FAFBF9]"
                  title="Bookmark dataset"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <Link
                  to={`/medicines/${m.id}`}
                  className="px-4 py-2 rounded-full bg-[#2B5A82] hover:bg-[#204566] text-white text-xs font-semibold flex items-center gap-1"
                >
                  <span>Inspect SPL</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
