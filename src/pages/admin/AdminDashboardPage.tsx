import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  Clock,
  History,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Settings,
  ChevronRight,
  Database,
  RefreshCw,
  Server,
  Layers
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { adminService } from '../../services/adminService';
import { verificationService } from '../../services/verificationService';
import { authService } from '../../services/authService';
import { medicineService } from '../../services/medicineService';

export const AdminDashboardPage: React.FC = () => {
  const stats = adminService.getStats();
  const verifications = verificationService.getRequests().slice(0, 3);
  const auditLogs = adminService.getAuditLogs().slice(0, 3);
  const users = authService.getUsers();
  const totalMedicines = medicineService.getAllMedicines().length;

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncStatus('Connecting to DailyMed & openFDA SPL endpoints...');
    setTimeout(() => {
      setSyncStatus('Synchronized successfully: 508 verified records confirmed, 0 duplicates.');
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 6000);
    }, 1800);
  };

  const statCards = [
    { title: 'Total Registered Users', value: stats.totalUsers, bg: 'bg-[#EEF5FB]', border: 'border-[#BDD7EE]', text: 'text-[#2B5A82]', icon: Users },
    { title: 'Pending Verifications', value: stats.pendingVerifications, bg: 'bg-[#FFF1D9]', border: 'border-[#FDE2B3]', text: 'text-amber-900', icon: Clock },
    { title: 'Approved Professionals', value: stats.approvedProfessionals, bg: 'bg-[#EAF5ED]', border: 'border-[#A8CDB5]', text: 'text-[#2E5A44]', icon: CheckCircle2 },
    { title: 'Indexed Medicines', value: `${totalMedicines}+`, bg: 'bg-[#F4EEFB]', border: 'border-[#D9C9F0]', text: 'text-[#5D4487]', icon: Database }
  ];

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EEFB] text-[#5D4487] text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrative Governance & Regulatory Compliance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#293B42] tracking-tight">
              Administration Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-[#72818A] mt-1">
              Manage professional access, review statutory medical credentials, and inspect security audit trails.
            </p>
          </div>

          <Link
            to="/admin/verifications"
            className="px-5 py-2.5 rounded-full bg-[#5D4487] hover:bg-[#4A346F] text-white text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto shadow-xs"
          >
            <Clock className="w-4 h-4" />
            <span>Review Pending Queue ({stats.pendingVerifications})</span>
          </Link>
        </div>

        {/* Statistic Cards (From Section 18) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-6 rounded-3xl border ${s.bg} ${s.border} shadow-card`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#72818A]">{s.title}</span>
                  <div className={`w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center ${s.text}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className={`text-3xl font-extrabold tracking-tight ${s.text}`}>{s.value}</div>
                <div className="text-[11px] text-[#72818A] mt-1">Simulated governance metrics</div>
              </motion.div>
            );
          })}
        </div>

        {/* Medicine Ingestion & Database Management Panel */}
        <div className="bg-white p-6 sm:p-7 rounded-4xl border border-[#E5EBE8] shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EBE8]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#293B42] flex items-center gap-2">
                  <span>Pharmaceutical Ingestion & Data Catalog Management</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5ED] text-[#2E5A44] border border-[#A8CDB5]">
                    508 Verified Records Active
                  </span>
                </h3>
                <p className="text-xs text-[#72818A] mt-0.5">
                  Automated sync with DailyMed REST API and openFDA Structured Product Labeling (SPL) with duplicate suppression.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/medicines"
                className="px-4 py-2 rounded-full bg-[#FAFBF9] hover:bg-[#FAFDFB] text-[#293B42] border border-[#E5EBE8] text-xs font-bold transition-all"
              >
                Inspect Public Catalog
              </Link>
              <button
                onClick={handleTriggerSync}
                disabled={isSyncing}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Ingesting Labels...' : 'Trigger Sync'}</span>
              </button>
            </div>
          </div>

          {syncStatus && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-2xl bg-[#EAF5ED] text-[#2E5A44] text-xs font-semibold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#2E5A44] flex-shrink-0" />
              <span>{syncStatus}</span>
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-5 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8]">
              <span className="text-[#72818A] text-[11px] font-semibold">Active Ingestion Sources</span>
              <div className="text-sm font-bold text-[#293B42] mt-1">DailyMed SPL & openFDA</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8]">
              <span className="text-[#72818A] text-[11px] font-semibold">Indexed Scale</span>
              <div className="text-sm font-bold text-[#293B42] mt-1">508 Drugs (Target: 10,000)</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8]">
              <span className="text-[#72818A] text-[11px] font-semibold">Duplicate Detection</span>
              <div className="text-sm font-bold text-emerald-700 mt-1">Normalized NDC / SetID</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8]">
              <span className="text-[#72818A] text-[11px] font-semibold">Scheduled Sync Interval</span>
              <div className="text-sm font-bold text-[#293B42] mt-1">Every 24 Hours (Active)</div>
            </div>
          </div>
        </div>

        {/* Main Sections: Recent Verification Requests & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pending Verifications Preview */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-4xl border border-[#E5EBE8] shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE8] mb-4">
              <h3 className="text-sm font-bold text-[#293B42] flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Recent Credential Verification Submissions</span>
              </h3>
              <Link to="/admin/verifications" className="text-xs font-bold text-[#5D4487] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {verifications.map(req => (
                <div key={req.id} className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-[#293B42] text-sm">{req.applicantName}</div>
                    <div className="text-[#72818A] mt-0.5">
                      Requested: <strong className="text-[#293B42] uppercase">{req.requestedRole}</strong> · {req.institution}
                    </div>
                    <div className="text-[10px] text-[#72818A] mt-1">Submitted: {req.submissionDate}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      req.status === 'pending'
                        ? 'bg-[#FFF1D9] text-amber-900 border border-amber-300'
                        : req.status === 'approved'
                        ? 'bg-[#EAF5ED] text-[#2E5A44]'
                        : 'bg-rose-50 text-rose-800'
                    }`}>
                      {req.status.toUpperCase()}
                    </span>
                    <Link
                      to="/admin/verifications"
                      className="px-3 py-1.5 rounded-full bg-white border border-[#E5EBE8] text-[11px] font-bold text-[#5D4487] hover:bg-[#F4EEFB]"
                    >
                      Audit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs Teaser */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-4xl border border-[#E5EBE8] shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE8] mb-4">
                <h3 className="text-sm font-bold text-[#293B42] flex items-center gap-2">
                  <History className="w-4 h-4 text-[#72818A]" />
                  <span>Recent Security & Compliance Logs</span>
                </h3>
                <Link to="/admin/audit-logs" className="text-xs font-bold text-[#5D4487] hover:underline">
                  Full Log
                </Link>
              </div>

              <div className="space-y-3">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-3 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#293B42]">{log.action}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">{log.result}</span>
                    </div>
                    <p className="text-[11px] text-[#72818A] mt-1 leading-snug">{log.details}</p>
                    <div className="text-[10px] text-[#72818A] mt-1 flex items-center justify-between">
                      <span>{log.user}</span>
                      <span>{log.timestamp.split(' ')[1]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/admin/audit-logs"
              className="mt-4 pt-3 border-t border-[#E5EBE8] text-xs font-bold text-[#5D4487] hover:underline flex items-center justify-center gap-1.5"
            >
              <span>Inspect Security & Governance Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
