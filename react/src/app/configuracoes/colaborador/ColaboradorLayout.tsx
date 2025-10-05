import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '../../../components/ui/PageLayout';
import type { TabItem } from '../../../components/ui/PageTabs';

interface ColaboradorData {
  nome?: string;
  cargo?: string;
  foto?: string;
}

interface ColaboradorLayoutProps {
  colaboradorData?: ColaboradorData; // Dados do colaborador para exibir no header (opcional)
  headerControls?: React.ReactNode; // Ações do header (botões Salvar, Cancelar, etc)
  children: React.ReactNode;
}

export function ColaboradorLayout({ colaboradorData, headerControls, children }: ColaboradorLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const colaboradorId = searchParams.get('id');
  const isNew = !colaboradorId;

  const tabItems: TabItem[] = [
    { id: 'dados-pessoais', label: 'Dados Pessoais', path: '/configuracoes/colaborador/dados-pessoais' },
    { id: 'permissoes', label: 'Permissões', path: '/configuracoes/colaborador/permissoes' },
    { id: 'parametros', label: 'Parâmetros', path: '/configuracoes/colaborador/parametros' }
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/dados-pessoais')) return 'dados-pessoais';
    if (path.includes('/permissoes')) return 'permissoes';
    if (path.includes('/parametros')) return 'parametros';
    return 'lista';
  };

  const handleBack = () => {
    navigate('/configuracoes/colaborador');
  };

  return (
    <PageLayout
      headerType={colaboradorData ? 'avatar' : 'default'}

      // Props para header padrão
      title="Configurações de Colaboradores"
      subtitle="Gerencie colaboradores, permissões e parâmetros"

      // Props para header com avatar
      avatarData={colaboradorData ? {
        title: 'Novo Colaborador',
        subtitle: "Preencha os dados do colaborador",
        avatarUrl: colaboradorData.foto,
        onBack: handleBack
      } : undefined}

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
