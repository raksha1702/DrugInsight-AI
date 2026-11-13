import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { AboutPage } from '../pages/public/AboutPage';
import { MedicinesPage } from '../pages/public/MedicinesPage';
import { MedicineDetailsPage } from '../pages/public/MedicineDetailsPage';
import { SafetyPage } from '../pages/public/SafetyPage';
import { ContactPage } from '../pages/public/ContactPage';

// Auth & Verification Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { VerifyProfessionalPage } from '../pages/auth/VerifyProfessionalPage';
import { VerificationStatusPage } from '../pages/auth/VerificationStatusPage';

// Doctor Pages
import { DoctorDashboardPage } from '../pages/doctor/DoctorDashboardPage';
import { DoctorMedicineSearchPage } from '../pages/doctor/DoctorMedicineSearchPage';
import { DoctorComparePage } from '../pages/doctor/DoctorComparePage';
import { DoctorAIAssistantPage } from '../pages/doctor/DoctorAIAssistantPage';
import { DoctorResearchLibraryPage } from '../pages/doctor/DoctorResearchLibraryPage';
import { DoctorReportsPage } from '../pages/doctor/DoctorReportsPage';
import { DoctorProfilePage } from '../pages/doctor/DoctorProfilePage';

// Researcher Pages
import { ResearcherDashboardPage } from '../pages/researcher/ResearcherDashboardPage';
import { ResearcherMedicineSearchPage } from '../pages/researcher/ResearcherMedicineSearchPage';
import { ResearcherComparePage } from '../pages/researcher/ResearcherComparePage';
import { ResearcherAIAssistantPage } from '../pages/researcher/ResearcherAIAssistantPage';
import { ResearcherAnalyticsPage } from '../pages/researcher/ResearcherAnalyticsPage';
import { ResearcherResearchLibraryPage } from '../pages/researcher/ResearcherResearchLibraryPage';
import { ResearcherReportsPage } from '../pages/researcher/ResearcherReportsPage';
import { ResearcherProfilePage } from '../pages/researcher/ResearcherProfilePage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminVerificationsPage } from '../pages/admin/AdminVerificationsPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

// Other Pages
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/medicines" element={<MedicinesPage />} />
      <Route path="/medicines/:id" element={<MedicineDetailsPage />} />
      <Route path="/safety" element={<SafetyPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Auth & Verification Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-professional" element={<VerifyProfessionalPage />} />
      <Route path="/verification-status" element={<VerificationStatusPage />} />

      {/* Doctor Routes (Guarded for doctor or admin) */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/medicine-search"
        element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorMedicineSearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/compare"
        element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorComparePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/ai-assistant"
        element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorAIAssistantPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/research-library"
        element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorResearchLibraryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/reports"
        element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Researcher Routes (Guarded for researcher or admin) */}
      <Route
        path="/researcher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['researcher', 'admin']}>
            <ResearcherDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/researcher/medicine-search"
        element={
          <ProtectedRoute allowedRoles={['researcher', 'admin']}>
            <ResearcherMedicineSearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/researcher/compare"
        element={
          <ProtectedRoute allowedRoles={['researcher', 'admin']}>
            <ResearcherComparePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/researcher/ai-assistant"
        element={
          <ProtectedRoute allowedRoles={['researcher', 'admin']}>
            <ResearcherAIAssistantPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/researcher/analytics"
        element={
          <ProtectedRoute allowedRoles={['researcher', 'admin']}>
            <ResearcherAnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/researcher/research-library"
        element={
          <ProtectedRoute allowedRoles={['researcher', 'admin']}>
            <ResearcherResearchLibraryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/researcher/reports"
        element={
          <ProtectedRoute allowedRoles={['researcher', 'admin']}>
            <ResearcherReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/researcher/profile"
        element={
          <ProtectedRoute allowedRoles={['researcher', 'admin']}>
            <ResearcherProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Administrator Routes (Guarded for admin) */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/verifications"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminVerificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAuditLogsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Special and Catch-all routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
