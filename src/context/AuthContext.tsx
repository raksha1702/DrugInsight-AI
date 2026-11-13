import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isDoctor: boolean;
  isResearcher: boolean;
  isAdmin: boolean;
  isPending: boolean;
  login: (email: string) => { success: boolean; error?: string };
  demoLogin: (roleType: string) => User;
  register: (name: string, email: string, role: UserRole) => User;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = useCallback(() => {
    const current = authService.getCurrentUser();
    setUser(current);
  }, []);

  useEffect(() => {
    // Check if there's a stored user; if not, default to guest/null or keep logged in
    const current = authService.getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  const login = (email: string) => {
    const result = authService.login(email);
    if (result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error || 'Failed to authenticate.' };
  };

  const demoLogin = (roleType: string) => {
    const demoUser = authService.demoLogin(roleType);
    setUser(demoUser);
    return demoUser;
  };

  const register = (name: string, email: string, role: UserRole) => {
    const newUser = authService.register({ name, email, role });
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isDoctor = !!user && user.role === 'doctor' && user.verificationStatus === 'approved';
  const isResearcher = !!user && user.role === 'researcher' && user.verificationStatus === 'approved';
  const isAdmin = !!user && user.role === 'admin';
  const isPending = !!user && user.verificationStatus === 'pending';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isDoctor,
        isResearcher,
        isAdmin,
        isPending,
        login,
        demoLogin,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
