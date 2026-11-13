import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ProfileView } from '../../components/common/ProfileView';

export const ResearcherProfilePage: React.FC = () => {
  return (
    <DashboardLayout portalType="researcher">
      <ProfileView portalType="researcher" />
    </DashboardLayout>
  );
};
