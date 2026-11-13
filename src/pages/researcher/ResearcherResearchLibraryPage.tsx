import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ResearchLibraryView } from '../../components/research/ResearchLibraryView';

export const ResearcherResearchLibraryPage: React.FC = () => {
  return (
    <DashboardLayout portalType="researcher">
      <ResearchLibraryView />
    </DashboardLayout>
  );
};
