import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { PageTabs } from '../../../components/ui/PageTabs';
import { HeaderControls } from '../../../components/ui/HeaderControls';
import type { TabItem } from '../../../components/ui/PageTabs';

interface ColaboradorLayoutProps {
  children: React.ReactNode;
}

export function ColaboradorLayout({ children }: ColaboradorLayoutProps) {
  const location = useLocation();

  const tabItems: TabItem[] = [
    { id: 'lista', label: 'Colaboradores', path: '/configuracoes/colaborador' },
    { id: 'dados-pessoais', label: 'Dados Pessoais', path: '/configuracoes/colaborador/dados-pessoais' },
    { id: 'permissoes', label: 'Permissões', path: '/configuracoes/colaborador/permissoes' },
    { id: 'parametros', label: 'Parâmetros', path: '/configuracoes/colaborador/parametros' }
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/configuracoes/colaborador') return 'lista';
    if (path.includes('/dados-pessoais')) return 'dados-pessoais';
    if (path.includes('/permissoes')) return 'permissoes';
    if (path.includes('/parametros')) return 'parametros';
    return 'lista';
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Page Header */}
      <PageHeader
        title="Configurações de Colaboradores"
        subtitle="Gerencie colaboradores, permissões e parâmetros"
      >
        <HeaderControls />
      </PageHeader>

      {/* Tabs */}
      <div className="flex-shrink-0">
        <PageTabs
          items={tabItems}
          activeTab={getActiveTab()}
          variant="default"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
