import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { CompareMedicinesView } from '../../components/research/CompareMedicinesView';

export const DoctorComparePage: React.FC = () => {
  return (
    <DashboardLayout portalType="doctor">
      <CompareMedicinesView />
    </DashboardLayout>
  );
};
