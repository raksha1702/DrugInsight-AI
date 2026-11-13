import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Database,
  Bot,
  Bell,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useToast } from '../../context/ToastContext';

export const AdminSettingsPage: React.FC = () => {
  const { success } = useToast();
  const [dailyMedSyncEnabled, setDailyMedSyncEnabled] = useState(true);
  const [openFdaSyncEnabled, setOpenFdaSyncEnabled] = useState(true);
  const [syncIntervalHours, setSyncIntervalHours] = useState('24');
  const [strictRefusalMode, setStrictRefusalMode] = useState(true);
  const [autoFlagBoxedWarnings, setAutoFlagBoxedWarnings] = useState(true);
  const [requireIdCardUpload, setRequireIdCardUpload] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    success('Platform governance settings updated and broadcast to active services.');
  };

  return (
    <DashboardLayout portalType="admin">
      <div className="max-w-4xl space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#293B42] tracking-tight">Platform Governance Settings</h2>
          <p className="text-xs sm:text-sm text-[#72818A] mt-1">
            Configure upstream DailyMed/openFDA synchronization parameters and clinical AI safety guardrails.
          </p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Regulatory Data Ingestion */}
          <div className="p-8 rounded-4xl bg-white border border-[#E5EBE8] shadow-card space-y-4">
            <h3 className="text-sm font-bold text-[#293B42] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#2E5A44]" />
              <span>Upstream Regulatory Ingestion</span>
            </h3>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between text-xs cursor-pointer p-3 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8]">
                <div>
                  <strong className="text-[#293B42] block">DailyMed SPL Automated Sync</strong>
                  <span className="text-[#72818A]">Poll NLM servers for revised package insert XML records</span>
                </div>
                <input
                  type="checkbox"
                  checked={dailyMedSyncEnabled}
                  onChange={e => setDailyMedSyncEnabled(e.target.checked)}
                  className="rounded border-[#E5EBE8] text-[#2E5A44] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer p-3 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8]">
                <div>
                  <strong className="text-[#293B42] block">openFDA Drug Label API Mirroring</strong>
                  <span className="text-[#72818A]">Fetch active recall notifications and drug event reports</span>
                </div>
                <input
                  type="checkbox"
                  checked={openFdaSyncEnabled}
                  onChange={e => setOpenFdaSyncEnabled(e.target.checked)}
                  className="rounded border-[#E5EBE8] text-[#2E5A44] w-4 h-4"
                />
              </label>

              <div className="p-3 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] flex items-center justify-between text-xs">
                <div>
                  <strong className="text-[#293B42] block">Catalog Sync Interval</strong>
                  <span className="text-[#72818A]">Frequency of background cron dataset update</span>
                </div>
                <select
                  value={syncIntervalHours}
                  onChange={e => setSyncIntervalHours(e.target.value)}
                  className="bg-white border border-[#E5EBE8] rounded-xl px-3 py-1.5 text-xs text-[#293B42] font-semibold"
                >
                  <option value="6">Every 6 Hours</option>
                  <option value="12">Every 12 Hours</option>
                  <option value="24">Daily (24 Hours)</option>
                  <option value="168">Weekly</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Clinical Safety Guardrails */}
          <div className="p-8 rounded-4xl bg-white border border-[#E5EBE8] shadow-card space-y-4">
            <h3 className="text-sm font-bold text-[#293B42] flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#5D4487]" />
              <span>AI Research Assistant Safety Guardrails</span>
            </h3>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between text-xs cursor-pointer p-3 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8]">
                <div>
                  <strong className="text-[#293B42] block">Strict Prescriptive Refusal Engine</strong>
                  <span className="text-[#72818A]">Instantly reject and flag queries requesting personal patient drug regimens</span>
                </div>
                <input
                  type="checkbox"
                  checked={strictRefusalMode}
                  onChange={e => setStrictRefusalMode(e.target.checked)}
                  className="rounded border-[#E5EBE8] text-[#5D4487] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer p-3 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8]">
                <div>
                  <strong className="text-[#293B42] block">Mandatory SPL Section Citations</strong>
                  <span className="text-[#72818A]">Prevent AI responses from publishing answers without verified label identifiers</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoFlagBoxedWarnings}
                  onChange={e => setAutoFlagBoxedWarnings(e.target.checked)}
                  className="rounded border-[#E5EBE8] text-[#5D4487] w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* Credential Governance */}
          <div className="p-8 rounded-4xl bg-white border border-[#E5EBE8] shadow-card space-y-4">
            <h3 className="text-sm font-bold text-[#293B42] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2B5A82]" />
              <span>Licensure Verification Rules</span>
            </h3>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between text-xs cursor-pointer p-3 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8]">
                <div>
                  <strong className="text-[#293B42] block">Mandatory Proof Document Upload</strong>
                  <span className="text-[#72818A]">Require statutory medical license scan before queueing application</span>
                </div>
                <input
                  type="checkbox"
                  checked={requireIdCardUpload}
                  onChange={e => setRequireIdCardUpload(e.target.checked)}
                  className="rounded border-[#E5EBE8] text-[#2B5A82] w-4 h-4"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-7 py-3 rounded-full bg-[#5D4487] hover:bg-[#4A346F] text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Governance Settings</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
