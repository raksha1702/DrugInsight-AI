import { SavedResearchItem, ResearchReport } from '../types';

const SAVED_ITEMS_KEY = 'druginsight_saved_research';
const REPORTS_KEY = 'druginsight_reports';

const INITIAL_SAVED_ITEMS: SavedResearchItem[] = [
  {
    id: 'saved-1',
    userId: 'user-doc-02',
    type: 'medicine',
    title: 'Metformin Hydrochloride (DailyMed SPL)',
    subtitle: 'Monograph for Type 2 Diabetes Glycemic Control',
    targetId: 'metformin',
    createdAt: '2024-09-02',
    tags: ['Antidiabetic', 'Boxed Warning', 'Renal Monitoring'],
    notes: 'Key focus on lactic acidosis precautions and baseline eGFR assessment guidelines.'
  },
  {
    id: 'saved-2',
    userId: 'user-doc-02',
    type: 'comparison',
    title: 'Amlodipine vs Lisinopril Comparative Review',
    subtitle: 'Side-by-side adverse reaction profile & contraindication analysis',
    targetId: 'amlodipine-lisinopril',
    createdAt: '2024-09-08',
    tags: ['Antihypertensive', 'ACEI Cough', 'CCB Edema'],
    notes: 'Comparing ankle edema incidence (Amlodipine) with bradykinin dry cough incidence (Lisinopril).'
  },
  {
    id: 'saved-3',
    userId: 'user-res-03',
    type: 'ai_chat',
    title: 'ACE Inhibitor Dry Cough vs ARB Pharmacodynamics',
    subtitle: 'AI Research Query on DailyMed structured citations',
    createdAt: '2024-09-11',
    tags: ['Pharmacovigilance', 'Evidence Synthesis'],
    notes: 'Saved AI response with 4 DailyMed citations for publication review.'
  }
];

const INITIAL_REPORTS: ResearchReport[] = [
  {
    id: 'rep-101',
    title: 'Antihypertensive Class Safety Profiles & Boxed Warnings Analysis',
    type: 'Comparative Analysis',
    createdDate: '2024-09-10',
    status: 'Ready',
    medicines: ['Amlodipine', 'Lisinopril'],
    author: 'Dr. Marcus Vance, MD',
    fileSize: '1.4 MB PDF',
    summary: 'Side-by-side comparative monograph assessing FDA boxed warnings, teratogenic precautions, and clinical monitoring schedules.'
  },
  {
    id: 'rep-102',
    title: 'Biguanides vs Insulin Secretagogues Renal Clearance Monograph',
    type: 'Safety Profile',
    createdDate: '2024-09-04',
    status: 'Ready',
    medicines: ['Metformin'],
    author: 'Dr. Elena Rostova, PhD',
    fileSize: '2.2 MB PDF',
    summary: 'In-depth assessment of DailyMed labeling updates regarding eGFR thresholds and contrast radiologic suspensions.'
  },
  {
    id: 'rep-103',
    title: 'Proton Pump Inhibitors & Bone Mineral Density Labeling Trend 2024',
    type: 'Label Discrepancy',
    createdDate: '2024-08-28',
    status: 'Ready',
    medicines: ['Omeprazole'],
    author: 'Dr. Elena Rostova, PhD',
    fileSize: '890 KB PDF',
    summary: 'Analysis of postmarketing pharmacovigilance reports on long-term fracture risks and hypomagnesemia warnings.'
  }
];

function initializeSavedItems(): SavedResearchItem[] {
  const stored = localStorage.getItem(SAVED_ITEMS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(INITIAL_SAVED_ITEMS));
  return INITIAL_SAVED_ITEMS;
}

function initializeReports(): ResearchReport[] {
  const stored = localStorage.getItem(REPORTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(REPORTS_KEY, JSON.stringify(INITIAL_REPORTS));
  return INITIAL_REPORTS;
}

export const researchService = {
  getSavedItems(): SavedResearchItem[] {
    return initializeSavedItems();
  },

  saveItem(item: Omit<SavedResearchItem, 'id' | 'createdAt'>): SavedResearchItem {
    const items = this.getSavedItems();
    const newItem: SavedResearchItem = {
      ...item,
      id: `saved-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    items.unshift(newItem);
    localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(items));
    return newItem;
  },

  deleteItem(id: string): void {
    const items = this.getSavedItems().filter(i => i.id !== id);
    localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(items));
  },

  getReports(): ResearchReport[] {
    return initializeReports();
  },

  createReport(data: {
    title: string;
    type: ResearchReport['type'];
    medicines: string[];
    author: string;
    includeCharts?: boolean;
    includeSources?: boolean;
  }): ResearchReport {
    const reports = this.getReports();
    const newReport: ResearchReport = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      title: data.title,
      type: data.type,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Ready',
      medicines: data.medicines,
      author: data.author,
      fileSize: `${(Math.random() * 2 + 0.8).toFixed(1)} MB PDF`,
      summary: `Automated pharmaceutical evidence synthesis for ${data.medicines.join(', ')} including regulatory monograph extracts and source citations.`
    };
    reports.unshift(newReport);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    return newReport;
  },

  deleteReport(id: string): void {
    const reports = this.getReports().filter(r => r.id !== id);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  }
};
