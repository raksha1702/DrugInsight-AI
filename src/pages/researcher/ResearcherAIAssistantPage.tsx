import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { AIChatView } from '../../components/research/AIChatView';

export const ResearcherAIAssistantPage: React.FC = () => {
  return (
    <DashboardLayout portalType="researcher">
      <AIChatView />
    </DashboardLayout>
  );
};
