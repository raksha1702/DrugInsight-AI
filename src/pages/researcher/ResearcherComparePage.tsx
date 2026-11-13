import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { CompareMedicinesView } from '../../components/research/CompareMedicinesView';

export const ResearcherComparePage: React.FC = () => {
  return (
    <DashboardLayout portalType="researcher">
      <CompareMedicinesView />
    </DashboardLayout>
  );
};
