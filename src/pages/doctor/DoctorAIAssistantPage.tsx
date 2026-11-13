import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { AIChatView } from '../../components/research/AIChatView';

export const DoctorAIAssistantPage: React.FC = () => {
  return (
    <DashboardLayout portalType="doctor">
      <AIChatView />
    </DashboardLayout>
  );
};
