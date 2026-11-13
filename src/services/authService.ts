import { User, UserRole, VerificationStatus } from '../types';
import { MOCK_USERS } from '../data/mockUsers';

const STORAGE_KEY = 'druginsight_current_user';
const USERS_STORAGE_KEY = 'druginsight_users_list';

function initializeUsers(): User[] {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
  return MOCK_USERS;
}

export const authService = {
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(STORAGE_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  getUsers(): User[] {
    return initializeUsers();
  },

  updateUserInList(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
    } else {
      users.push(updatedUser);
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const current = this.getCurrentUser();
    if (current && current.id === updatedUser.id) {
      this.setCurrentUser(updatedUser);
    }
  },

  login(email: string): { user: User | null; error?: string } {
    const users = this.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (found.accountStatus === 'suspended') {
        return { user: null, error: 'Your account is suspended. Please contact administrator.' };
      }
      this.setCurrentUser(found);
      return { user: found };
    }
    return { user: null, error: 'Invalid credentials. Use demo login or create a new account.' };
  },

  demoLogin(roleType: string): User {
    const users = this.getUsers();
    let targetUser: User | undefined;

    if (roleType === 'public') {
      targetUser = users.find(u => u.role === 'public' && u.verificationStatus === 'none');
    } else if (roleType === 'doctor') {
      targetUser = users.find(u => u.role === 'doctor' && u.verificationStatus === 'approved');
    } else if (roleType === 'researcher') {
      targetUser = users.find(u => u.role === 'researcher' && u.verificationStatus === 'approved');
    } else if (roleType === 'admin') {
      targetUser = users.find(u => u.role === 'admin');
    } else if (roleType === 'pending') {
      targetUser = users.find(u => u.verificationStatus === 'pending');
    }

    if (!targetUser) {
      targetUser = MOCK_USERS[0];
    }

    this.setCurrentUser(targetUser);
    return targetUser;
  },

  register(data: { name: string; email: string; role: UserRole }): User {
    const users = this.getUsers();
    const isProfessional = data.role === 'doctor' || data.role === 'researcher';
    
    // In demo, professional accounts are registered with public role & pending status until admin approves
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: isProfessional ? 'public' : 'public',
      verificationStatus: isProfessional ? 'pending' : 'none',
      createdAt: new Date().toISOString().split('T')[0],
      accountStatus: 'active'
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    this.setCurrentUser(newUser);
    return newUser;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};
