import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  requiresApproval?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiresApproval = true
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBF9]">
        <div className="w-12 h-12 rounded-full border-4 border-[#A8CDB5] border-t-[#2E5A44] animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin always has access to admin routes
  if (allowedRoles.includes('admin') && user.role === 'admin') {
    return <>{children}</>;
  }

  // Check if role is allowed
  const hasRole = allowedRoles.includes(user.role);

  // If requires verification approval (doctors and researchers)
  if (requiresApproval && (user.role === 'doctor' || user.role === 'researcher')) {
    if (user.verificationStatus !== 'approved') {
      return <Navigate to="/unauthorized" state={{ reason: 'unverified' }} replace />;
    }
  }

  if (!hasRole) {
    return <Navigate to="/unauthorized" state={{ reason: 'role_mismatch' }} replace />;
  }

  return <>{children}</>;
};
