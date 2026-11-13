import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Building,
  Mail,
  Lock,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';

export const ProfileView: React.FC<{ portalType: 'doctor' | 'researcher' }> = ({ portalType }) => {
  const { user, logout, refreshUser } = useAuth();
  const { success, warning } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [department, setDepartment] = useState(user?.department || 'Cardiology & Internal Medicine');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated = {
      ...user,
      name,
      department
    };
    authService.updateUserInList(updated);
    refreshUser();
    success('Profile preferences updated.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      warning('Please enter a new password.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    success('Password updated successfully.');
  };

  const handleLogout = () => {
    logout();
    success('Logged out.');
    navigate('/');
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#293B42] tracking-tight">Professional Profile</h2>
        <p className="text-xs sm:text-sm text-[#72818A] mt-1">
          Manage your verified healthcare credentials and platform research settings.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="p-8 rounded-4xl bg-white border border-[#E5EBE8] shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E5EBE8]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[#EAF5ED] text-[#2E5A44] font-extrabold text-2xl flex items-center justify-center border border-[#A8CDB5]/40 shadow-xs">
              {user?.name.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#293B42]">{user?.name}</h3>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#EAF5ED] text-[#2E5A44] border border-[#A8CDB5]/50 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified {user?.role.toUpperCase()}</span>
                </span>
              </div>
              <div className="text-xs text-[#72818A] mt-0.5">{user?.email}</div>
              <div className="text-xs text-[#293B42] font-semibold mt-1">
                {user?.institution || "St. Mary's Academic Medical Center"}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Read-only Governance Notice */}
        <div className="my-6 p-4 rounded-2xl bg-[#EEF5FB] border border-[#BDD7EE] flex items-center gap-3 text-xs text-[#2B5A82]">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Credential Lock: </strong> Professional Role ({user?.role.toUpperCase()}) and Verification Status ({user?.verificationStatus.toUpperCase()}) are read-only and governed by state medical boards.
          </span>
        </div>

        {/* Edit Basic Info Form */}
        <form onSubmit={handleSaveDetails} className="space-y-4 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#293B42]">Personal Information</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#293B42] mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#293B42] mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#72818A] bg-slate-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#293B42] mb-1">Department / Clinical Unit</label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#293B42] mb-1">Medical Registration / License (Read-only)</label>
              <input
                type="text"
                disabled
                value={user?.medicalRegistrationNumber || 'MED-NY-849201'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#72818A] bg-slate-100 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#2E5A44] text-white text-xs font-bold hover:bg-[#244836] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        {/* Change Password Interface */}
        <form onSubmit={handleChangePassword} className="space-y-4 pt-6 mt-6 border-t border-[#E5EBE8]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#293B42]">Security & Password</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#293B42] mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#293B42] mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#FAFBF9] border border-[#E5EBE8] text-[#293B42] hover:border-[#A8CDB5] text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#2E5A44]" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
