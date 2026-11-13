import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ReportsManagementView } from '../../components/research/ReportsManagementView';

export const ResearcherReportsPage: React.FC = () => {
  return (
    <DashboardLayout portalType="researcher">
      <ReportsManagementView />
    </DashboardLayout>
  );
};
