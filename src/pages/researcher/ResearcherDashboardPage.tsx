import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FlaskConical,
  BarChart3,
  Search,
  GitCompare,
  Bot,
  FileText,
  Clock,
  Layers,
  TrendingUp,
  ArrowRight,
  Database,
  ChevronRight
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ANALYTICS_KPIS } from '../../data/mockAnalytics';
import { researchService } from '../../services/researchService';

export const ResearcherDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const reports = researchService.getReports().slice(0, 2);

  const kpis = [
    { title: 'Total Medicine Records', value: '24,850', bg: 'bg-[#EAF5ED]', border: 'border-[#A8CDB5]', text: 'text-[#2E5A44]' },
    { title: 'Drug Categories', value: '148', bg: 'bg-[#EEF5FB]', border: 'border-[#BDD7EE]', text: 'text-[#2B5A82]' },
    { title: 'Label Updates (90d)', value: '1,280', bg: 'bg-[#F4EEFB]', border: 'border-[#D9C9F0]', text: 'text-[#5D4487]' },
    { title: 'Research Documents', value: '8,420', bg: 'bg-[#FDF3EE]', border: 'border-[#F6D8C8]', text: 'text-[#8E4D2B]' },
  ];

  const shortcuts = [
    { title: 'Pharmaceutical Analytics', desc: '5 interactive Recharts distributions & label timeline trends', path: '/researcher/analytics', icon: BarChart3 },
    { title: 'Cross-Drug Matrix', desc: 'Side-by-side pharmacological analysis & boxed warnings', path: '/researcher/compare', icon: GitCompare },
    { title: 'AI Evidence Engine', desc: 'Query pharmacology evidence with verified SPL citations', path: '/researcher/ai-assistant', icon: Bot },
    { title: 'Regulatory Reports', desc: 'Export standardized comparative monographs and clinical data', path: '/researcher/reports', icon: FileText },
  ];

  return (
    <DashboardLayout portalType="researcher">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF5FB] text-[#2B5A82] text-xs font-semibold mb-2">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Academic & Institutional Researcher Workspace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#293B42] tracking-tight">
            Welcome, {user?.name || 'Researcher'}
          </h2>
          <p className="text-xs sm:text-sm text-[#72818A] mt-1">
            Access pharmaceutical datasets, labeling pattern analytics, and automated reports.
          </p>
        </div>

        <Link
          to="/researcher/analytics"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2B5A82] hover:bg-[#204566] text-white text-xs font-bold shadow-xs hover:shadow transition-all self-start sm:self-auto"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Open Full Analytics</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-6 rounded-3xl border ${kpi.bg} ${kpi.border} shadow-card`}
          >
            <div className="text-xs font-semibold text-[#72818A] mb-2">{kpi.title}</div>
            <div className={`text-3xl font-extrabold tracking-tight ${kpi.text}`}>{kpi.value}</div>
            <div className="text-[11px] text-[#72818A] mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#2E5A44]" />
              <span>Verified DailyMed catalog</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Research Shortcuts */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#293B42] mb-4">Research Workflows</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shortcuts.map(s => {
            const Icon = s.icon;
            return (
              <Link
                key={s.title}
                to={s.path}
                className="p-5 rounded-3xl bg-white border border-[#E5EBE8] shadow-card hover:border-[#BDD7EE] hover:bg-[#EEF5FB]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] flex items-center justify-center text-[#2B5A82] mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#293B42] group-hover:text-[#2B5A82] transition-colors">
                    {s.title}
                  </h4>
                  <p className="text-xs text-[#72818A] mt-1 leading-relaxed">{s.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5EBE8] flex items-center justify-between text-xs font-semibold text-[#2B5A82]">
                  <span>Launch Tool</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Analytics Preview Teaser Card & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-[#E5EBE8] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE8] mb-4">
              <h3 className="text-sm font-bold text-[#293B42] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#2B5A82]" />
                <span>Pharmaceutical Analytics Preview</span>
              </h3>
              <span className="text-xs font-semibold text-[#72818A]">Demo Dataset</span>
            </div>
            <p className="text-xs text-[#72818A] leading-relaxed mb-4">
              Access 5 interactive Recharts dashboards covering medicine records by category, label update trends, warning section frequency, and raw dataset composition.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 rounded-2xl bg-[#EAF5ED] text-[#2E5A44]">
                <strong>Top Therapeutic Area:</strong>
                <div>Cardiovascular (4,820 records)</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#EEF5FB] text-[#2B5A82]">
                <strong>Safety Alert Trend:</strong>
                <div>+38% SPL warning revisions in 2024</div>
              </div>
            </div>
          </div>

          <Link
            to="/researcher/analytics"
            className="w-full py-2.5 rounded-xl bg-[#2B5A82] text-white text-xs font-bold hover:bg-[#204566] transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Full Analytics Suite</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Saved Reports / Dataset Activity */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#E5EBE8] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE8] mb-4">
              <h3 className="text-sm font-bold text-[#293B42] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5D4487]" />
                <span>Recent Research Reports</span>
              </h3>
              <Link to="/researcher/reports" className="text-xs font-semibold text-[#2B5A82] hover:underline">
                All Reports
              </Link>
            </div>

            <div className="space-y-3">
              {reports.map(rep => (
                <div key={rep.id} className="p-3 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs">
                  <div className="font-bold text-[#293B42]">{rep.title}</div>
                  <div className="text-[11px] text-[#72818A] mt-0.5">
                    {rep.type} · Substances: {rep.medicines.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/researcher/reports"
            className="mt-4 pt-3 border-t border-[#E5EBE8] text-xs font-bold text-[#2B5A82] hover:underline flex items-center justify-center gap-1.5"
          >
            <span>Generate New Research Monograph Brief</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};
