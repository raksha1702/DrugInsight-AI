import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ResearchLibraryView } from '../../components/research/ResearchLibraryView';

export const DoctorResearchLibraryPage: React.FC = () => {
  return (
    <DashboardLayout portalType="doctor">
      <ResearchLibraryView />
    </DashboardLayout>
  );
};
