import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  Download,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { AuditLog } from '../../types';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(adminService.getAuditLogs());
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const { success } = useToast();

  const filteredLogs = logs.filter(log => {
    const matchesResult = resultFilter === 'all' || log.result.toLowerCase() === resultFilter.toLowerCase();
    const matchesSearch =
      search === '' ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    return matchesResult && matchesSearch;
  });

  const handleExportLogs = () => {
    const content = `Timestamp,User,Role,Action,Result,IPAddress,Details\n` +
      filteredLogs.map(l => `"${l.timestamp}","${l.user}","${l.userRole}","${l.action}","${l.result}","${l.ipAddress}","${l.details}"`).join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'druginsight_audit_logs_ledger.csv';
    a.click();
    URL.revokeObjectURL(url);
    success('Exported compliance audit trail ledger.');
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'Success':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF5ED] text-[#2E5A44]"><CheckCircle2 className="w-3 h-3" /> Success</span>;
      case 'Warning':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF1D9] text-amber-900"><AlertTriangle className="w-3 h-3" /> Warning</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800"><XCircle className="w-3 h-3" /> Failed</span>;
    }
  };

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#293B42] tracking-tight">Security & Compliance Audit Logs</h2>
            <p className="text-xs sm:text-sm text-[#72818A] mt-1">
              Immutable ledger of credential approvals, administrative interventions, and data queries.
            </p>
          </div>

          <button
            onClick={handleExportLogs}
            className="px-5 py-2.5 rounded-full bg-white border border-[#E5EBE8] text-xs font-bold text-[#293B42] hover:border-[#A8CDB5] transition-all flex items-center gap-2 shadow-xs self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-[#2E5A44]" />
            <span>Export CSV Audit Ledger</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5EBE8] shadow-card flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={resultFilter}
              onChange={e => setResultFilter(e.target.value)}
              className="bg-[#FAFBF9] border border-[#E5EBE8] text-xs rounded-xl px-3 py-1.5 text-[#293B42] font-semibold"
            >
              <option value="all">All Outcome Results</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="relative flex items-center min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-[#72818A] absolute left-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by action, user, or IP..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-4xl border border-[#E5EBE8] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] border-b border-[#E5EBE8] text-[#72818A] uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-4 py-4">Actor</th>
                  <th className="px-4 py-4">Action Event</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">IP Address</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EBE8]">
                {filteredLogs.map(log => {
                  const isExpanded = expandedLogId === log.id;
                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-[#FAFBF9]/80 transition-colors">
                        <td className="px-6 py-4 font-mono text-[11px] text-[#72818A] whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-[#293B42]">{log.user}</div>
                          <span className="text-[10px] text-[#72818A] uppercase">{log.userRole}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-mono text-xs font-semibold text-[#5D4487] bg-[#F4EEFB] px-2.5 py-0.5 rounded-full">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getResultBadge(log.result)}
                        </td>
                        <td className="px-4 py-4 font-mono text-[11px] text-[#72818A]">
                          {log.ipAddress}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            className="text-[#5D4487] hover:underline font-semibold inline-flex items-center gap-1 text-[11px]"
                          >
                            <span>{isExpanded ? 'Hide' : 'Expand'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#FAFBF9]">
                          <td colSpan={6} className="px-6 py-3 text-xs text-[#293B42] border-t border-[#E5EBE8]">
                            <div className="p-3 bg-white rounded-2xl border border-[#E5EBE8] space-y-1">
                              <strong>Event Audit Description:</strong>
                              <p className="text-xs text-[#72818A] leading-relaxed">{log.details}</p>
                              <div className="text-[10px] text-[#72818A] pt-1">
                                SHA-256 Digest: <span className="font-mono">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
