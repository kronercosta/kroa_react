'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Avatar } from '../../../components/ui/Avatar';

interface PatientLayoutProps {
  children: React.ReactNode;
  patientId: string;
  patientName?: string;
  activeTab: 'summary' | 'personal-data' | 'evolution';
}

const PatientLayout: React.FC<PatientLayoutProps> = ({
  children,
  patientId,
  patientName = 'Kroner Costa',
  activeTab
}) => {
  const tabs = [
    { id: 'summary', label: 'Resumo', href: `/patients/summary?id=${patientId}` },
    { id: 'evolution', label: 'Evolução', href: `/patients/evolution?id=${patientId}` },
    { id: 'personal-data', label: 'Dados Pessoais', href: `/patients/personal-data?id=${patientId}` }
  ];

  const handleBack = () => {
    window.location.href = '/patients';
  };

  const handleTabClick = (href: string) => {
    window.location.href = href;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header com botão voltar e avatar na mesma linha */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <Avatar
                  name={patientName}
                  size="lg"
                  className="bg-krooa-green"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Paciente</h1>
                  <p className="text-sm text-gray-500">{patientName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submenu de navegação */}
      <div className="px-4 sm:px-6 py-2 overflow-x-auto overflow-y-hidden bg-white border-b" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.href)}
              className={`
                relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full whitespace-nowrap flex-shrink-0
                ${activeTab === tab.id
                  ? 'bg-krooa-green text-krooa-dark shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <span className="flex items-center gap-2">
                <span>{tab.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo da página */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default PatientLayout;