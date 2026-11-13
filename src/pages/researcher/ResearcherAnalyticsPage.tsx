import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Filter,
  Download,
  RotateCcw,
  Calendar,
  Layers,
  Database,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  MOCK_ANALYTICS_KPIS,
  MOCK_RECORDS_BY_CATEGORY,
  MOCK_LABEL_UPDATES_TREND,
  MOCK_CATEGORY_DISTRIBUTION,
  MOCK_WARNING_SECTION_COUNTS,
  MOCK_DATASET_COMPOSITION
} from '../../data/mockAnalytics';
import { useToast } from '../../context/ToastContext';

export const ResearcherAnalyticsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [dateRange, setDateRange] = useState('12m');
  const { success } = useToast();

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSource('all');
    setDateRange('12m');
    success('Filters reset to default dataset parameters.');
  };

  const handleExportCSV = () => {
    const csvContent = `Category,RecordCount
${MOCK_RECORDS_BY_CATEGORY.map(r => `"${r.category}",${r.count}`).join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'druginsight_pharmaceutical_analytics_demo.csv';
    a.click();
    URL.revokeObjectURL(url);
    success('Exported analytics CSV dataset.');
  };

  const kpis = [
    { title: 'Medicine Records', value: '24,850', change: '+14.2% YoY', bg: 'bg-[#EAF5ED]', border: 'border-[#A8CDB5]', text: 'text-[#2E5A44]' },
    { title: 'Drug Categories', value: '148', change: '+6 newly categorized', bg: 'bg-[#EEF5FB]', border: 'border-[#BDD7EE]', text: 'text-[#2B5A82]' },
    { title: 'Label Updates', value: '1,280', change: '+38% past 90 days', bg: 'bg-[#F4EEFB]', border: 'border-[#D9C9F0]', text: 'text-[#5D4487]' },
    { title: 'Research Documents', value: '8,420', change: '+320 this month', bg: 'bg-[#FDF3EE]', border: 'border-[#F6D8C8]', text: 'text-[#8E4D2B]' }
  ];

  return (
    <DashboardLayout portalType="researcher">
      <div className="space-y-8">
        {/* Header & Export Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF5FB] text-[#2B5A82] text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Pharmaceutical Analytics Suite (Demo Dataset)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#293B42] tracking-tight">
              Pharmaceutical Analytics
            </h2>
            <p className="text-xs sm:text-sm text-[#72818A] mt-1">
              Explore medicine records, labeling patterns, and pharmaceutical research datasets.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-full bg-white border border-[#E5EBE8] text-xs font-semibold text-[#293B42] hover:border-[#BDD7EE] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#2B5A82]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-5 py-2.5 rounded-full bg-[#2B5A82] hover:bg-[#204566] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Summary PDF</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar (From Section 15) */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5EBE8] shadow-card flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category */}
            <div className="flex items-center gap-1.5 text-xs text-[#72818A]">
              <span className="font-semibold text-[#293B42]">Category:</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-[#FAFBF9] border border-[#E5EBE8] text-xs rounded-xl px-3 py-1.5 text-[#293B42] font-medium cursor-pointer"
              >
                <option value="all">All Therapeutic Areas</option>
                <option value="cardio">Cardiovascular</option>
                <option value="antiinfective">Anti-infectives</option>
                <option value="cns">Central Nervous System</option>
                <option value="metabolic">Metabolic & Endocrine</option>
              </select>
            </div>

            {/* Source */}
            <div className="flex items-center gap-1.5 text-xs text-[#72818A]">
              <span className="font-semibold text-[#293B42]">Data Source:</span>
              <select
                value={selectedSource}
                onChange={e => setSelectedSource(e.target.value)}
                className="bg-[#FAFBF9] border border-[#E5EBE8] text-xs rounded-xl px-3 py-1.5 text-[#293B42] font-medium cursor-pointer"
              >
                <option value="all">Combined Sources</option>
                <option value="dailymed">DailyMed SPL XML</option>
                <option value="openfda">openFDA Endpoints</option>
                <option value="archives">FDA Safety Archive</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-1.5 text-xs text-[#72818A]">
              <Calendar className="w-3.5 h-3.5" />
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="bg-[#FAFBF9] border border-[#E5EBE8] text-xs rounded-xl px-3 py-1.5 text-[#293B42] font-medium cursor-pointer"
              >
                <option value="3m">Past 90 Days</option>
                <option value="6m">Past 6 Months</option>
                <option value="12m">Past 12 Months (Full FY)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-xs text-[#72818A] hover:text-[#2B5A82] px-3 py-1.5 rounded-xl hover:bg-[#FAFBF9] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* 4 Pastel KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis.map((kpi, i) => (
            <div key={kpi.title} className={`p-6 rounded-3xl border ${kpi.bg} ${kpi.border} shadow-card`}>
              <div className="text-xs font-semibold text-[#72818A] mb-1">{kpi.title}</div>
              <div className={`text-3xl font-extrabold tracking-tight ${kpi.text}`}>{kpi.value}</div>
              <div className="text-[11px] font-semibold text-[#2E5A44] mt-1">{kpi.change}</div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Medicine Records by Category (Vertical Bar Chart) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-4xl border border-[#E5EBE8] shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#293B42]">Chart 1 — Medicine Records by Category</h3>
                <p className="text-[11px] text-[#72818A]">Indexed monographs categorized by therapeutic classification</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF5ED] text-[#2E5A44]">
                Bar Chart
              </span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_RECORDS_BY_CATEGORY} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F2" />
                  <XAxis dataKey="category" angle={-25} textAnchor="end" tick={{ fontSize: 10, fill: '#72818A' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#72818A' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5EBE8', fontSize: '11px' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {MOCK_RECORDS_BY_CATEGORY.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#A8CDB5' : '#BDD7EE'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Drug Category Distribution (Donut Chart) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-4xl border border-[#E5EBE8] shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#293B42]">Chart 3 — Category Distribution</h3>
                <p className="text-[11px] text-[#72818A]">Proportional share of therapeutic classes</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4EEFB] text-[#5D4487]">
                Donut
              </span>
            </div>
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5EBE8', fontSize: '11px' }} />
                  <Pie
                    data={MOCK_CATEGORY_DISTRIBUTION}
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {MOCK_CATEGORY_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Label Updates Over Time (Line Chart) */}
          <div className="lg:col-span-12 bg-white p-6 sm:p-7 rounded-4xl border border-[#E5EBE8] shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#293B42]">Chart 2 — Label Updates & Safety Alerts Over Time</h3>
                <p className="text-[11px] text-[#72818A]">Monthly frequency of DailyMed SPL revisions and FDA Drug Safety Communications</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4EEFB] text-[#5D4487]">
                Timeline
              </span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_LABEL_UPDATES_TREND} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F2" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#72818A' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#72818A' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5EBE8', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="updates" stroke="#5D4487" strokeWidth={3} dot={{ r: 4, fill: '#D9C9F0' }} name="SPL Monograph Updates" />
                  <Line type="monotone" dataKey="safetyAlerts" stroke="#2E5A44" strokeWidth={2} dot={{ r: 3, fill: '#A8CDB5' }} name="Boxed / Safety Alerts" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Warning Section Counts (Horizontal Bar Chart) */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-4xl border border-[#E5EBE8] shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#293B42]">Chart 4 — Warning Section Counts</h3>
                <p className="text-[11px] text-[#72818A]">Total catalog occurrences by regulatory label section</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF1D9] text-amber-900">
                Warnings
              </span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={MOCK_WARNING_SECTION_COUNTS}
                  margin={{ top: 10, right: 20, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F2" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#72818A' }} />
                  <YAxis dataKey="section" type="category" tick={{ fontSize: 9, fill: '#293B42' }} width={120} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5EBE8', fontSize: '11px' }} />
                  <Bar dataKey="count" fill="#D9C9F0" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 5: Dataset Composition (Stacked Bar Chart) */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-4xl border border-[#E5EBE8] shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#293B42]">Chart 5 — Dataset Composition</h3>
                <p className="text-[11px] text-[#72818A]">Active versus archived monographs by upstream provider</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF5FB] text-[#2B5A82]">
                Stacked
              </span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_DATASET_COMPOSITION} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F2" />
                  <XAxis dataKey="source" tick={{ fontSize: 10, fill: '#72818A' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#72818A' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5EBE8', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="active" stackId="a" fill="#A8CDB5" radius={[0, 0, 0, 0]} name="Active SPL Monographs" />
                  <Bar dataKey="archived" stackId="a" fill="#BDD7EE" radius={[8, 8, 0, 0]} name="Historical Label Versions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Regulatory Research Disclaimer (From Section 15) */}
        <div className="p-5 rounded-3xl bg-[#FFF1D9] border border-[#FDE2B3] flex items-center gap-3 text-xs text-amber-950">
          <AlertCircle className="w-5 h-5 text-amber-800 flex-shrink-0" />
          <div>
            <strong>Dataset Interpretation Guideline: </strong>
            All chart counts represent indexed regulatory document volumes in our demonstration catalog (labeled "Demo Data"). They do not represent real-world clinical adverse event incident rates or epidemiological safety measurements.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
