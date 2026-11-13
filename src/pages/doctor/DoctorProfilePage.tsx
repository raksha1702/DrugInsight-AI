import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ProfileView } from '../../components/common/ProfileView';

export const DoctorProfilePage: React.FC = () => {
  return (
    <DashboardLayout portalType="doctor">
      <ProfileView portalType="doctor" />
    </DashboardLayout>
  );
};
