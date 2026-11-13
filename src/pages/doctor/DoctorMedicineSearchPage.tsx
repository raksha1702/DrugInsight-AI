import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Pill, ChevronRight, Bookmark, GitCompare } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { medicineService } from '../../services/medicineService';
import { researchService } from '../../services/researchService';
import { useToast } from '../../context/ToastContext';

export const DoctorMedicineSearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const { success } = useToast();

  const medicines = medicineService.searchMedicines({ query, category });
  const categories = medicineService.getCategories();

  const handleSave = (med: any) => {
    researchService.saveItem({
      userId: 'user-doc-02',
      type: 'medicine',
      title: `${med.name} (${med.activeIngredient})`,
      subtitle: `${med.category} · ${med.dataSource}`,
      targetId: med.id,
      tags: [med.category, 'Doctor Workspace'],
      notes: 'Added from doctor clinical search.'
    });
    success(`Saved ${med.name} to Research Library.`);
  };

  return (
    <DashboardLayout portalType="doctor">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#293B42] tracking-tight">Clinical Medicine Search</h2>
          <p className="text-xs sm:text-sm text-[#72818A] mt-1">
            Search full regulatory monographs with clinical pharmacology sections, boxed warnings, and drug interactions.
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
              placeholder="Search by brand name, active substance, or indication..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5]"
            />
          </div>

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs font-semibold text-[#293B42] focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Therapeutic Areas</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {medicines.map(m => (
            <div
              key={m.id}
              className="p-5 rounded-3xl bg-white border border-[#E5EBE8] shadow-card hover:border-[#A8CDB5] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center font-bold flex-shrink-0">
                  <Pill className="w-6 h-6 -rotate-45" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#293B42]">{m.name}</h3>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF5ED] text-[#2E5A44]">
                      {m.category}
                    </span>
                  </div>
                  <div className="text-xs text-[#72818A]">
                    Active: <strong className="text-[#293B42]">{m.activeIngredient}</strong> · Formulation: {m.formulation}
                  </div>
                  <p className="text-xs text-[#72818A] line-clamp-1 mt-1 max-w-2xl">{m.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
                <button
                  onClick={() => handleSave(m)}
                  className="p-2 rounded-xl border border-[#E5EBE8] text-[#72818A] hover:text-[#2E5A44] hover:bg-[#FAFBF9]"
                  title="Bookmark monograph"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <Link
                  to={`/medicines/${m.id}`}
                  className="px-4 py-2 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white text-xs font-semibold flex items-center gap-1"
                >
                  <span>Monograph</span>
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
