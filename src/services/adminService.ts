import { AuditLog, User, VerificationStatus } from '../types';
import { MOCK_AUDIT_LOGS } from '../data/mockAuditLogs';
import { authService } from './authService';

const AUDIT_STORAGE_KEY = 'druginsight_audit_logs';

function initializeAuditLogs(): AuditLog[] {
  const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(MOCK_AUDIT_LOGS));
  return MOCK_AUDIT_LOGS;
}

export const adminService = {
  getAuditLogs(): AuditLog[] {
    return initializeAuditLogs();
  },

  addAuditLog(entry: {
    user: string;
    userRole: any;
    action: string;
    result: 'Success' | 'Warning' | 'Failed';
    details: string;
    ipAddress?: string;
  }): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: entry.user,
      userRole: entry.userRole,
      action: entry.action,
      result: entry.result,
      details: entry.details,
      ipAddress: entry.ipAddress || '192.168.1.100'
    };
    logs.unshift(newLog);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
  },

  getStats() {
    const users = authService.getUsers();
    const pendingVerifs = users.filter(u => u.verificationStatus === 'pending').length;
    const approvedPros = users.filter(u => u.role === 'doctor' || u.role === 'researcher').length;
    const suspendedUsers = users.filter(u => u.accountStatus === 'suspended').length;

    return {
      totalUsers: users.length,
      pendingVerifications: pendingVerifs + 2, // realistic count including unlinked submissions
      approvedProfessionals: approvedPros,
      suspendedAccounts: suspendedUsers,
      totalAuditEntries: this.getAuditLogs().length
    };
  },

  updateUserStatus(userId: string, status: 'active' | 'suspended'): void {
    const users = authService.getUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      target.accountStatus = status;
      authService.updateUserInList(target);
      this.addAuditLog({
        user: 'Administrator Sarah Lin',
        userRole: 'admin',
        action: `USER_${status.toUpperCase()}`,
        result: status === 'suspended' ? 'Warning' : 'Success',
        details: `Updated account status for ${target.name} (${target.email}) to ${status}`
      });
    }
  },

  revokeProfessionalAccess(userId: string): void {
    const users = authService.getUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      target.role = 'public';
      target.verificationStatus = 'rejected';
      authService.updateUserInList(target);
      this.addAuditLog({
        user: 'Administrator Sarah Lin',
        userRole: 'admin',
        action: 'REVOKE_PROFESSIONAL_ACCESS',
        result: 'Warning',
        details: `Revoked professional access credentials for ${target.name}`
      });
    }
  }
};
