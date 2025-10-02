import React from 'react';
import { ClinicaHeader } from '../components/ClinicaHeader';
import { ClinicaTabs } from '../components/navigation/ClinicaTabs';

interface ConfiguracoesLayoutProps {
  children: React.ReactNode;
}

export function ConfiguracoesLayout({ children }: ConfiguracoesLayoutProps) {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Page Header */}
      <ClinicaHeader />

      {/* Tabs using SubMenu component */}
      <div className="flex-shrink-0">
        <ClinicaTabs />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        {children}
      </div>
    </div>
  );
}
