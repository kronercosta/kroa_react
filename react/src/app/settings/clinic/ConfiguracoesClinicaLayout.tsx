import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageLayout } from '../../../components/ui/PageLayout';
import type { TabItem } from '../../../components/ui/PageTabs';
import { useRegion } from '../../../contexts/RegionContext';
import { useTranslation } from '../../../hooks/useTranslation';
import translations from './translation.json';

interface ConfiguracoesClinicaLayoutProps {
  headerControls?: React.ReactNode;
  children: React.ReactNode;
}

export function ConfiguracoesClinicaLayout({ headerControls, children }: ConfiguracoesClinicaLayoutProps) {
  const location = useLocation();
  const { currentRegion, config } = useRegion();
  const { t } = useTranslation(translations);

  const tabItems: TabItem[] = [
    { id: 'account', label: t.tabs?.conta || 'Conta', path: '/settings/clinic/account' },
    { id: 'operatory', label: t.tabs?.cadeiras || 'Cadeiras', path: '/settings/clinic/operatory' },
    ...(config.features.centroCusto ? [{ id: 'cost-center', label: t.tabs?.centroCusto || 'Centro de Custo', path: '/settings/clinic/cost-center' }] : []),
    { id: 'parameters', label: t.tabs?.parametros || 'Parâmetros', path: '/settings/clinic/parameters' }
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/account')) return 'account';
    if (path.includes('/operatory')) return 'operatory';
    if (path.includes('/cost-center')) return 'cost-center';
    if (path.includes('/parameters')) return 'parameters';
    return 'account';
  };

  return (
    <PageLayout
      title={t.title || 'Configurações da Clínica'}
      subtitle={t.subtitle || 'Gerencie as informações e configurações da sua clínica'}
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
