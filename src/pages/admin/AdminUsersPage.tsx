import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { authService } from '../../services/authService';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { User, UserRole } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(authService.getUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { success, warning } = useToast();

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.accountStatus === statusFilter;
    const matchesSearch =
      search === '' ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.institution && u.institution.toLowerCase().includes(search.toLowerCase()));
    return matchesRole && matchesStatus && matchesSearch;
  });

  const handleToggleSuspend = (userId: string, currentStatus: string, userName: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    adminService.updateUserStatus(userId, nextStatus);
    setUsers(authService.getUsers());
    if (nextStatus === 'suspended') {
      warning(`Suspended account access for ${userName}.`);
    } else {
      success(`Reactivated account for ${userName}.`);
    }
  };

  const handleRevokeCredentials = (userId: string, userName: string) => {
    adminService.revokeProfessionalAccess(userId);
    setUsers(authService.getUsers());
    warning(`Revoked professional credentials for ${userName}. Role reverted to Public.`);
  };

  return (
    <DashboardLayout portalType="admin">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#293B42] tracking-tight">User Account Governance</h2>
          <p className="text-xs sm:text-sm text-[#72818A] mt-1">
            Manage user roles, inspect verification status, suspend accounts, and enforce credential integrity.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5EBE8] shadow-card flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-[#FAFBF9] border border-[#E5EBE8] text-xs rounded-xl px-3 py-1.5 text-[#293B42] font-semibold"
            >
              <option value="all">All Roles</option>
              <option value="public">General Public</option>
              <option value="doctor">Medical Doctor</option>
              <option value="researcher">Researcher</option>
              <option value="admin">Administrator</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#FAFBF9] border border-[#E5EBE8] text-xs rounded-xl px-3 py-1.5 text-[#293B42] font-semibold"
            >
              <option value="all">All Account Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="relative flex items-center min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-[#72818A] absolute left-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or hospital..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-4xl border border-[#E5EBE8] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] border-b border-[#E5EBE8] text-[#72818A] uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-4 py-4">Current Role</th>
                  <th className="px-4 py-4">Verification Status</th>
                  <th className="px-4 py-4">Account Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EBE8]">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-[#FAFBF9]/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EAF5ED] text-[#2E5A44] font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#293B42] text-xs sm:text-sm">{u.name}</div>
                          <div className="text-[11px] text-[#72818A]">{u.email}</div>
                          {u.institution && <div className="text-[10px] text-[#2E5A44] font-medium">{u.institution}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-[#F6D8C8] text-[#8E4D2B]'
                          : u.role === 'doctor'
                          ? 'bg-[#F4EEFB] text-[#5D4487]'
                          : u.role === 'researcher'
                          ? 'bg-[#EEF5FB] text-[#2B5A82]'
                          : 'bg-[#EAF5ED] text-[#2E5A44]'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.verificationStatus === 'approved'
                          ? 'bg-[#EAF5ED] text-[#2E5A44]'
                          : u.verificationStatus === 'pending'
                          ? 'bg-[#FFF1D9] text-amber-900'
                          : 'bg-slate-100 text-[#72818A]'
                      }`}>
                        {u.verificationStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                        u.accountStatus === 'active' ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${u.accountStatus === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {u.accountStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {(u.role === 'doctor' || u.role === 'researcher') && (
                          <button
                            onClick={() => handleRevokeCredentials(u.id, u.name)}
                            className="px-3 py-1 rounded-full border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 text-[11px] font-semibold"
                            title="Revoke professional access"
                          >
                            Revoke Role
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleSuspend(u.id, u.accountStatus, u.name)}
                            className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                              u.accountStatus === 'active'
                                ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {u.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
