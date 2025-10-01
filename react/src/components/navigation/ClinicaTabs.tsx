import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SubMenu } from './SubMenu';
import { useRegion } from '../../contexts/RegionContext';

export function ClinicaTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRegion, config } = useRegion();

  const tabItems = [
    { id: 'conta', label: 'Conta' },
    { id: 'cadeiras', label: currentRegion === 'BR' ? 'Cadeiras' : 'Chairs' },
    ...(config.features.centroCusto ? [{ id: 'centro-custo', label: 'Centro de Custo' }] : []),
    { id: 'parametros', label: 'Parâmetros' }
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

  const handleTabChange = (tabId: string) => {
    navigate(`/configuracoes/clinica/${tabId}`);
  };

  return (
    <SubMenu
      items={tabItems}
      activeItem={getActiveTab()}
      onItemClick={handleTabChange}
      variant="default"
    />
  );
}
