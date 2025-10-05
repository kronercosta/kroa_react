import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { PageTabs } from '../../../components/ui/PageTabs';
import { HeaderControls } from '../../../components/ui/HeaderControls';
import type { TabItem } from '../../../components/ui/PageTabs';
import { useRegion } from '../../../contexts/RegionContext';

interface ConfiguracoesLayoutProps {
  children: React.ReactNode;
}

export function ConfiguracoesLayout({ children }: ConfiguracoesLayoutProps) {
  const location = useLocation();
  const { currentRegion, config } = useRegion();

  const tabItems: TabItem[] = [
    { id: 'conta', label: 'Conta', path: '/configuracoes/clinica/conta' },
    { id: 'cadeiras', label: currentRegion === 'BR' ? 'Cadeiras' : 'Chairs', path: '/configuracoes/clinica/cadeiras' },
    ...(config.features.centroCusto ? [{ id: 'centro-custo', label: 'Centro de Custo', path: '/configuracoes/clinica/centro-custo' }] : []),
    { id: 'parametros', label: 'Parâmetros', path: '/configuracoes/clinica/parametros' }
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/conta')) return 'conta';
    if (path.includes('/cadeiras')) return 'cadeiras';
    if (path.includes('/centro-custo')) return 'centro-custo';
    if (path.includes('/parametros')) return 'parametros';
    return 'conta';
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Page Header */}
      <PageHeader
        title="Configurações da Clínica"
        subtitle="Gerencie as informações e configurações da sua clínica"
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
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        {children}
      </div>
    </div>
  );
}
