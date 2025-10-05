import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageTabs } from '../ui/PageTabs';
import type { TabItem } from '../ui/PageTabs';
import { useRegion } from '../../contexts/RegionContext';

export function ClinicaTabs() {
  const location = useLocation();
  const { currentRegion, config } = useRegion();

  const tabItems: TabItem[] = [
    { id: 'conta', label: 'Conta', path: '/configuracoes/clinica/conta' },
    { id: 'cadeiras', label: currentRegion === 'BR' ? 'Cadeiras' : 'Chairs', path: '/configuracoes/clinica/cadeiras' },
    ...(config.features.centroCusto ? [{ id: 'centro-custo', label: 'Centro de Custo', path: '/configuracoes/clinica/centro-custo' }] : []),
    { id: 'parametros', label: 'Parâmetros', path: '/configuracoes/clinica/parametros' }
  ];

  // Determina a aba ativa baseado na URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/conta')) return 'conta';
    if (path.includes('/cadeiras')) return 'cadeiras';
    if (path.includes('/centro-custo')) return 'centro-custo';
    if (path.includes('/parametros')) return 'parametros';
    return 'conta';
  };

  return (
    <PageTabs
      items={tabItems}
      activeTab={getActiveTab()}
      variant="default"
    />
  );
}
