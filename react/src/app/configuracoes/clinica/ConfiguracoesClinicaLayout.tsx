import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageLayout } from '../../../components/ui/PageLayout';
import type { TabItem } from '../../../components/ui/PageTabs';
import { useRegion } from '../../../contexts/RegionContext';
import { useTranslation } from '../../../hooks/useTranslation';

interface ConfiguracoesClinicaLayoutProps {
  headerControls?: React.ReactNode;
  children: React.ReactNode;
}

export function ConfiguracoesClinicaLayout({ headerControls, children }: ConfiguracoesClinicaLayoutProps) {
  const location = useLocation();
  const { currentRegion, config } = useRegion();
  const { t } = useTranslation();

  const tabItems: TabItem[] = [
    { id: 'conta', label: t.account, path: '/configuracoes/clinica/conta' },
    { id: 'cadeiras', label: t.chairs, path: '/configuracoes/clinica/cadeiras' },
    ...(config.features.centroCusto ? [{ id: 'centro-custo', label: t.costCenter, path: '/configuracoes/clinica/centro-custo' }] : []),
    { id: 'parametros', label: t.parameters, path: '/configuracoes/clinica/parametros' }
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
      title={t.clinicSettings}
      subtitle={t.clinicSettingsSubtitle}
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
