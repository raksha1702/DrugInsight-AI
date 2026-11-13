import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Pill,
  Search,
  GitCompare,
  Bot,
  FileText,
  Clock,
  Bookmark,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { researchService } from '../../services/researchService';

export const DoctorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const savedItems = researchService.getSavedItems().slice(0, 3);
  const reports = researchService.getReports().slice(0, 2);

  const stats = [
    { title: 'Medicines Available', value: '24,850', bg: 'bg-[#EAF5ED]', border: 'border-[#A8CDB5]', text: 'text-[#2E5A44]', icon: Pill },
    { title: 'Research Searches', value: '1,420', bg: 'bg-[#EEF5FB]', border: 'border-[#BDD7EE]', text: 'text-[#2B5A82]', icon: Search },
    { title: 'Saved Comparisons', value: '18', bg: 'bg-[#F4EEFB]', border: 'border-[#D9C9F0]', text: 'text-[#5D4487]', icon: GitCompare },
    { title: 'Generated Reports', value: '7', bg: 'bg-[#FDF3EE]', border: 'border-[#F6D8C8]', text: 'text-[#8E4D2B]', icon: FileText }
  ];

  const quickActions = [
    { title: 'Search Medicines', desc: 'Browse 24,000+ FDA/DailyMed product labels', path: '/doctor/medicine-search', icon: Search, bg: 'hover:bg-[#EAF5ED]/60' },
    { title: 'Compare Drugs', desc: 'Side-by-side indications, contraindications & boxed warnings', path: '/doctor/compare', icon: GitCompare, bg: 'hover:bg-[#F4EEFB]/60' },
    { title: 'AI Assistant', desc: 'Query pharmacology evidence with verified citations', path: '/doctor/ai-assistant', icon: Bot, bg: 'hover:bg-[#EEF5FB]/60' },
    { title: 'Create Report', desc: 'Synthesize comparative monographs into exportable briefs', path: '/doctor/reports', icon: FileText, bg: 'hover:bg-[#FDF3EE]/60' },
  ];

  return (
    <DashboardLayout portalType="doctor">
      {/* Welcome Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5ED] text-[#2E5A44] text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Physician Workspace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#293B42] tracking-tight">
            Welcome back, {user?.name || 'Doctor'}
          </h2>
          <p className="text-xs sm:text-sm text-[#72818A] mt-1">
            Your clinical pharmaceutical research suite. DailyMed SPL index is up-to-date.
          </p>
        </div>

        <Link
          to="/doctor/compare"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white text-xs font-bold shadow-xs hover:shadow transition-all self-start sm:self-auto"
        >
          <GitCompare className="w-4 h-4" />
          <span>Launch Comparison Tool</span>
        </Link>
      </div>

      {/* 4 Pastel Statistic Cards (From Section 11 of Prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-6 rounded-3xl border ${stat.bg} ${stat.border} shadow-card`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#72818A]">{stat.title}</span>
                <div className={`w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center ${stat.text}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-3xl font-extrabold tracking-tight ${stat.text}`}>{stat.value}</div>
              <div className="text-[11px] text-[#72818A] mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#2E5A44]" />
                <span>Synchronized with SPL archives</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions (4 Clickable Cards) */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#293B42] mb-4">Quick Workflows</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.path}
                className={`p-5 rounded-3xl bg-white border border-[#E5EBE8] shadow-card transition-all ${action.bg} flex flex-col justify-between group`}
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] flex items-center justify-center text-[#2E5A44] mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#293B42] group-hover:text-[#2E5A44] transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-xs text-[#72818A] mt-1 leading-relaxed">
                    {action.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5EBE8] flex items-center justify-between text-xs font-semibold text-[#2E5A44]">
                  <span>Open Tool</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Recent Activity & Saved Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-[#E5EBE8] shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5EBE8]">
            <h3 className="text-sm font-bold text-[#293B42] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#72818A]" />
              <span>Recent Research Searches & Comparisons</span>
            </h3>
            <Link to="/doctor/research-library" className="text-xs font-semibold text-[#2E5A44] hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#293B42]">Amlodipine vs Lisinopril Comparative Review</div>
                <div className="text-[11px] text-[#72818A]">Evaluated side effects, renal precautions, and boxed warnings · 2 hours ago</div>
              </div>
              <Link to="/doctor/compare" className="text-xs font-bold text-[#2E5A44] hover:underline whitespace-nowrap ml-2">
                Reopen
              </Link>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#293B42]">Metformin Boxed Warning SPL Citation Query</div>
                <div className="text-[11px] text-[#72818A]">AI assistant evidence synthesis for eGFR cutoffs · Yesterday</div>
              </div>
              <Link to="/doctor/ai-assistant" className="text-xs font-bold text-[#2E5A44] hover:underline whitespace-nowrap ml-2">
                Open Chat
              </Link>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#293B42]">Omeprazole Long-Term PPI Safety Monograph</div>
                <div className="text-[11px] text-[#72818A]">Indexed fracture warnings & hypomagnesemia risks · 3 days ago</div>
              </div>
              <Link to="/medicines/omeprazole" className="text-xs font-bold text-[#2E5A44] hover:underline whitespace-nowrap ml-2">
                Inspect
              </Link>
            </div>
          </div>
        </div>

        {/* Saved Research Items Panel */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#E5EBE8] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5EBE8]">
              <h3 className="text-sm font-bold text-[#293B42] flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#2E5A44]" />
                <span>Saved Research Items</span>
              </h3>
              <Link to="/doctor/research-library" className="text-xs font-semibold text-[#2E5A44] hover:underline">
                Library
              </Link>
            </div>

            <div className="space-y-3">
              {savedItems.map(item => (
                <div key={item.id} className="p-3 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs">
                  <div className="font-bold text-[#293B42]">{item.title}</div>
                  <div className="text-[11px] text-[#72818A] mt-0.5">{item.subtitle}</div>
                  <div className="flex gap-1.5 mt-2">
                    {item.tags.map(t => (
                      <span key={t} className="text-[10px] bg-white border border-[#E5EBE8] px-2 py-0.5 rounded-full font-medium text-[#72818A]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5EBE8]">
            <Link
              to="/doctor/reports"
              className="w-full py-2.5 rounded-xl bg-[#EAF5ED] text-[#2E5A44] text-xs font-bold hover:bg-[#A8CDB5]/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Generated Clinical Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
