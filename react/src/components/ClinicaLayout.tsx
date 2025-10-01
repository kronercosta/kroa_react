import React from 'react';
import { ClinicaHeader } from './ClinicaHeader';
import { ClinicaTabs } from './ClinicaTabs';

interface ClinicaLayoutProps {
  children: React.ReactNode;
}

export function ClinicaLayout({ children }: ClinicaLayoutProps) {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Page Header */}
      <ClinicaHeader />

      {/* Tabs using SubMenu component */}
      <div className="flex-shrink-0">
        <ClinicaTabs />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4">
        {children}
      </div>
    </div>
  );
}
