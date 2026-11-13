import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  FileCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { researchService } from '../../services/researchService';
import { medicineService } from '../../services/medicineService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { ResearchReport } from '../../types';

export const ReportsManagementView: React.FC = () => {
  const [reports, setReports] = useState<ResearchReport[]>(researchService.getReports());
  const [modalOpen, setModalOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<ResearchReport | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResearchReport['type']>('Comparative Analysis');
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>(['Metformin', 'Amlodipine']);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSources, setIncludeSources] = useState(true);

  const allMeds = medicineService.getAllMedicines();
  const { user } = useAuth();
  const { success } = useToast();

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRep = researchService.createReport({
      title,
      type,
      medicines: selectedMedicines,
      author: user?.name || 'Verified Professional',
      includeCharts,
      includeSources
    });

    setReports(researchService.getReports());
    setModalOpen(false);
    setTitle('');
    success(`Generated report "${newRep.title}".`);
  };

  const handleDeleteReport = (id: string, repTitle: string) => {
    researchService.deleteReport(id);
    setReports(researchService.getReports());
    success(`Deleted report "${repTitle}".`);
  };

  const handleDownload = (rep: ResearchReport) => {
    // Generate text/csv blob for download
    const content = `DRUGINSIGHT AI - RESEARCH REPORT
Title: ${rep.title}
Type: ${rep.type}
Date: ${rep.createdDate}
Author: ${rep.author}
Status: ${rep.status}
Analyzed Substances: ${rep.medicines.join(', ')}

EXECUTIVE SUMMARY:
${rep.summary}

EVIDENCE BASE:
- Ingested from FDA Structured Product Labeling (SPL)
- Verified DailyMed Monograph Archives
- Regulatory Safety Discrepancy Audits

COMPLIANCE NOTICE:
This report is generated for academic and clinical research purposes only. Not for clinical prescribing.
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rep.title.replace(/\s+/g, '_').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    success(`Downloaded brief: ${rep.title}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#293B42] tracking-tight">Research Reports</h2>
          <p className="text-xs sm:text-sm text-[#72818A] mt-1">
            Generate, view, and export structured clinical pharmacological briefing reports and comparative analyses.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Report</span>
        </button>
      </div>

      {/* Reports Table Card */}
      <div className="bg-white rounded-3xl border border-[#E5EBE8] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF9] border-b border-[#E5EBE8] text-[#72818A] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Report Title & Medicines</th>
                <th className="px-4 py-4">Report Type</th>
                <th className="px-4 py-4">Created Date</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EBE8]">
              {reports.map(rep => (
                <tr key={rep.id} className="hover:bg-[#FAFBF9]/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#293B42] text-xs sm:text-sm">{rep.title}</div>
                    <div className="text-[11px] text-[#72818A] mt-0.5">
                      Substances: <span className="text-[#2E5A44] font-semibold">{rep.medicines.join(', ')}</span> · Author: {rep.author}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAFBF9] border border-[#E5EBE8] text-[#293B42]">
                      {rep.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[#72818A] font-medium whitespace-nowrap">
                    {rep.createdDate}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E5A44] bg-[#EAF5ED] px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      {rep.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingReport(rep)}
                        className="p-1.5 rounded-lg text-[#72818A] hover:text-[#2E5A44] hover:bg-[#FAFBF9]"
                        title="Preview report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(rep)}
                        className="p-1.5 rounded-lg text-[#72818A] hover:text-[#5D4487] hover:bg-[#FAFBF9]"
                        title="Download report"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(rep.id, rep.title)}
                        className="p-1.5 rounded-lg text-[#72818A] hover:text-rose-600 hover:bg-rose-50"
                        title="Delete report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Report Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-soft-xl border border-[#E5EBE8] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE8]">
              <h3 className="text-base font-bold text-[#293B42]">Generate Research Report</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#72818A] hover:text-[#293B42]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#293B42] mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Comparative Beta-Blocker vs ACEI Safety Monograph"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#293B42] mb-1">Report Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5]"
                >
                  <option value="Comparative Analysis">Comparative Analysis</option>
                  <option value="Safety Profile">Safety Profile & Boxed Warnings</option>
                  <option value="Label Discrepancy">Label Discrepancy Timeline</option>
                  <option value="Category Summary">Therapeutic Category Summary</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#293B42] mb-1">Primary Medicine Subjects</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border border-[#E5EBE8] rounded-xl bg-[#FAFBF9]">
                  {allMeds.map(m => {
                    const isSelected = selectedMedicines.includes(m.name);
                    return (
                      <label key={m.id} className="flex items-center gap-2 cursor-pointer text-[11px] text-[#293B42]">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedMedicines([...selectedMedicines, m.name]);
                            } else {
                              setSelectedMedicines(selectedMedicines.filter(n => n !== m.name));
                            }
                          }}
                          className="rounded border-[#E5EBE8] text-[#2E5A44] focus:ring-[#A8CDB5]"
                        />
                        <span>{m.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#72818A]">
                  <input
                    type="checkbox"
                    checked={includeCharts}
                    onChange={e => setIncludeCharts(e.target.checked)}
                    className="rounded border-[#E5EBE8] text-[#2E5A44]"
                  />
                  <span>Include comparative Recharts analytics visualizations</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[#72818A]">
                  <input
                    type="checkbox"
                    checked={includeSources}
                    onChange={e => setIncludeSources(e.target.checked)}
                    className="rounded border-[#E5EBE8] text-[#2E5A44]"
                  />
                  <span>Include DailyMed SPL label ID citations and revision logs</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E5EBE8]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E5EBE8] font-semibold text-[#72818A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white font-bold"
                >
                  Generate Report
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Report Preview Modal */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-soft-xl border border-[#E5EBE8] space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE8]">
              <div>
                <span className="text-[10px] font-bold text-[#2E5A44] uppercase tracking-wider">{viewingReport.type}</span>
                <h3 className="text-base font-bold text-[#293B42]">{viewingReport.title}</h3>
              </div>
              <button onClick={() => setViewingReport(null)} className="text-[#72818A] hover:text-[#293B42]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs space-y-2">
              <div><strong>Author:</strong> {viewingReport.author}</div>
              <div><strong>Created:</strong> {viewingReport.createdDate}</div>
              <div><strong>Analyzed Medicines:</strong> {viewingReport.medicines.join(', ')}</div>
              <div><strong>Estimated File Size:</strong> {viewingReport.fileSize}</div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#293B42] mb-2">Executive Summary</h4>
              <p className="text-xs leading-relaxed text-[#72818A] bg-slate-50 p-4 rounded-2xl border border-[#E5EBE8]">
                {viewingReport.summary}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#E5EBE8]">
              <span className="text-[11px] text-[#72818A]">Verified Regulatory Extraction</span>
              <button
                onClick={() => {
                  handleDownload(viewingReport);
                  setViewingReport(null);
                }}
                className="px-6 py-2 rounded-full bg-[#2E5A44] text-white text-xs font-bold hover:bg-[#244836] flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report Brief</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
