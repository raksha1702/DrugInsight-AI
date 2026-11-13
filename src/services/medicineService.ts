import { Medicine } from '../types';
import { MOCK_MEDICINES } from '../data/mockMedicines';

export interface MedicineFilterOptions {
  query?: string;
  category?: string;
  formulation?: string;
  dataSource?: string;
  rxStatus?: 'all' | 'OTC' | 'Prescription';
  accessCategory?: 'all' | 'Category A' | 'Category B' | 'Category C';
  hasBoxedWarning?: boolean;
  sortBy?: 'relevance' | 'alphabetical' | 'recent' | 'risk';
}

export const medicineService = {
  getAllMedicines(): Medicine[] {
    return MOCK_MEDICINES;
  },

  getMedicineById(id: string): Medicine | undefined {
    return MOCK_MEDICINES.find(m => m.id.toLowerCase() === id.toLowerCase());
  },

  searchMedicines(filters: MedicineFilterOptions): Medicine[] {
    let results = [...MOCK_MEDICINES];

    if (filters.query && filters.query.trim() !== '') {
      const q = filters.query.toLowerCase().trim();
      results = results.filter(
        m =>
          m.name.toLowerCase().includes(q) ||
          m.activeIngredient.toLowerCase().includes(q) ||
          m.brandNames.some(b => b.toLowerCase().includes(q)) ||
          m.category.toLowerCase().includes(q) ||
          m.approvedUses.some(u => u.toLowerCase().includes(q)) ||
          m.description.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== 'all') {
      results = results.filter(m => m.category.toLowerCase().includes(filters.category!.toLowerCase()));
    }

    if (filters.formulation && filters.formulation !== 'all') {
      results = results.filter(m => m.formulation.toLowerCase().includes(filters.formulation!.toLowerCase()));
    }

    if (filters.dataSource && filters.dataSource !== 'all') {
      results = results.filter(m => m.dataSource.toLowerCase() === filters.dataSource!.toLowerCase());
    }

    if (filters.rxStatus && filters.rxStatus !== 'all') {
      results = results.filter(m => (m.rxStatus || 'Prescription').toLowerCase() === filters.rxStatus!.toLowerCase());
    }

    if (filters.accessCategory && filters.accessCategory !== 'all') {
      results = results.filter(m => (m.accessCategory || 'Category B').toLowerCase() === filters.accessCategory!.toLowerCase());
    }

    if (filters.hasBoxedWarning !== undefined) {
      results = results.filter(m => Boolean(m.hasBoxedWarning || m.warnings?.boxedWarning) === filters.hasBoxedWarning);
    }

    if (filters.sortBy === 'alphabetical') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'recent') {
      results.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    } else if (filters.sortBy === 'risk') {
      results.sort((a, b) => {
        const aRisk = Boolean(a.hasBoxedWarning || a.warnings?.boxedWarning);
        const bRisk = Boolean(b.hasBoxedWarning || b.warnings?.boxedWarning);
        if (aRisk !== bRisk) return aRisk ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    }

    return results;
  },

  getCategories(): string[] {
    const set = new Set<string>();
    MOCK_MEDICINES.forEach(m => set.add(m.category));
    return Array.from(set);
  },

  getFormulations(): string[] {
    const list = ['Oral Tablet', 'Extended Release', 'Capsule', 'Oral Suspension', 'IV Solution'];
    return list;
  },

  getDataSources(): string[] {
    return ['DailyMed', 'openFDA', 'FDA Label Archives'];
  }
};
