export const MOCK_ANALYTICS_KPIS = [
  {
    title: 'Medicine Records',
    value: '24,850',
    change: '+14.2% YoY',
    trend: 'up' as const,
    color: 'mint' as const,
    description: 'Verified FDA/DailyMed pharmaceutical labeling monographs in catalog'
  },
  {
    title: 'Drug Categories',
    value: '148',
    change: '+6 newly categorized',
    trend: 'neutral' as const,
    color: 'blue' as const,
    description: 'Anatomical Therapeutic Chemical (ATC) classification clusters'
  },
  {
    title: 'Label Updates',
    value: '1,280',
    change: '+38% past 90 days',
    trend: 'up' as const,
    color: 'lavender' as const,
    description: 'SPL revisions reflecting updated warnings, precautions, or indications'
  },
  {
    title: 'Research Documents',
    value: '8,420',
    change: '+320 this month',
    trend: 'up' as const,
    color: 'peach' as const,
    description: 'Indexed clinical trials, regulatory monographs, and pharmacovigilance reports'
  }
];

// Chart 1: Medicine Records by Category (Vertical bar chart)
export const MOCK_RECORDS_BY_CATEGORY = [
  { category: 'Cardiovascular', count: 4820, fill: '#A8CDB5' },
  { category: 'Anti-infectives', count: 3940, fill: '#BDD7EE' },
  { category: 'CNS / Neuro', count: 3650, fill: '#D9C9F0' },
  { category: 'Endocrine & Metabolic', count: 2980, fill: '#F6D8C8' },
  { category: 'Gastrointestinal', count: 2450, fill: '#A8CDB5' },
  { category: 'Respiratory', count: 2110, fill: '#BDD7EE' },
  { category: 'Oncology', count: 1840, fill: '#D9C9F0' },
  { category: 'Immunology', count: 1510, fill: '#F6D8C8' },
  { category: 'Dermatological', count: 1220, fill: '#A8CDB5' }
];

// Chart 2: Label Updates Over Time (Line chart)
export const MOCK_LABEL_UPDATES_TREND = [
  { month: 'Oct 23', updates: 94, safetyAlerts: 18 },
  { month: 'Nov 23', updates: 110, safetyAlerts: 22 },
  { month: 'Dec 23', updates: 85, safetyAlerts: 14 },
  { month: 'Jan 24', updates: 135, safetyAlerts: 29 },
  { month: 'Feb 24', updates: 142, safetyAlerts: 26 },
  { month: 'Mar 24', updates: 168, safetyAlerts: 34 },
  { month: 'Apr 24', updates: 154, safetyAlerts: 28 },
  { month: 'May 24', updates: 189, safetyAlerts: 41 },
  { month: 'Jun 24', updates: 176, safetyAlerts: 36 },
  { month: 'Jul 24', updates: 204, safetyAlerts: 45 },
  { month: 'Aug 24', updates: 228, safetyAlerts: 51 },
  { month: 'Sep 24', updates: 245, safetyAlerts: 54 }
];

// Chart 3: Drug Category Distribution (Donut chart)
export const MOCK_CATEGORY_DISTRIBUTION = [
  { name: 'Cardiovascular', value: 24, color: '#A8CDB5' },
  { name: 'Anti-infectives', value: 19, color: '#BDD7EE' },
  { name: 'Central Nervous System', value: 17, color: '#D9C9F0' },
  { name: 'Metabolic & Endocrine', value: 14, color: '#F6D8C8' },
  { name: 'Gastrointestinal', value: 12, color: '#9EC4B5' },
  { name: 'Other Therapeutic Areas', value: 14, color: '#C6DDF2' }
];

// Chart 4: Warning Section Counts (Horizontal bar chart)
export const MOCK_WARNING_SECTION_COUNTS = [
  { section: 'Boxed Warnings (Black Box)', count: 1420 },
  { section: 'Contraindications', count: 7850 },
  { section: 'Warnings & Precautions', count: 12400 },
  { section: 'Adverse Reactions (Common)', count: 18900 },
  { section: 'Drug Interactions (CYP/P-gp)', count: 9600 },
  { section: 'Pregnancy & Nursing Precautions', count: 11200 }
];

// Chart 5: Dataset Composition (Stacked bar chart)
export const MOCK_DATASET_COMPOSITION = [
  { source: 'DailyMed Structured SPL', active: 16400, archived: 3200 },
  { source: 'openFDA Drug Product Labels', active: 6200, archived: 1800 },
  { source: 'FDA Drug Safety Communications', active: 2250, archived: 850 }
];
