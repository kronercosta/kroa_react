import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SubMenu } from '../ui/SubMenu';

interface ColaboradorTabsProps {
  colaboradorId: string | null;
}

export function ColaboradorTabs({ colaboradorId }: ColaboradorTabsProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('dados-pessoais')) return 'dados-pessoais';
    if (path.includes('parametros')) return 'parametros';
    if (path.includes('permissoes')) return 'permissoes';
    return 'dados-pessoais';
  };

  const tabItems = [
    { id: 'dados-pessoais', label: 'Dados Pessoais' },
    { id: 'parametros', label: 'Parâmetros' },
    { id: 'permissoes', label: 'Permissões' }
  ];

  const handleTabChange = (tabId: string) => {
    const queryParam = colaboradorId ? `?id=${colaboradorId}` : '';
    navigate(`/configuracoes/colaborador/${tabId}${queryParam}`);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6">
        <SubMenu
          items={tabItems}
          activeItem={getActiveTab()}
          onItemClick={handleTabChange}
          variant="default"
        />
      </div>
    </div>
  );
}