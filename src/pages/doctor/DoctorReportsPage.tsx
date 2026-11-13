import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ReportsManagementView } from '../../components/research/ReportsManagementView';

export const DoctorReportsPage: React.FC = () => {
  return (
    <DashboardLayout portalType="doctor">
      <ReportsManagementView />
    </DashboardLayout>
  );
};
