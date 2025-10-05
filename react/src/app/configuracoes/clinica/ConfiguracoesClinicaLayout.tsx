import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageLayout } from '../../../components/ui/PageLayout';
import type { TabItem } from '../../../components/ui/PageTabs';
import { useRegion } from '../../../contexts/RegionContext';

interface ConfiguracoesClinicaLayoutProps {
  headerControls?: React.ReactNode;
  children: React.ReactNode;
}

export function ConfiguracoesClinicaLayout({ headerControls, children }: ConfiguracoesClinicaLayoutProps) {
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
    <PageLayout
      title="Configurações da Clínica"
      subtitle="Gerencie as informações e configurações da sua clínica"
      headerControls={headerControls}
      tabs={tabItems}
      activeTab={getActiveTab()}
    >
      <div className="p-3 sm:p-6">
        {children}
      </div>
    </PageLayout>
  );
}
