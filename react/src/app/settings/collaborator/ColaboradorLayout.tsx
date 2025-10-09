import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '../../../components/ui/PageLayout';
import type { TabItem } from '../../../components/ui/PageTabs';
import { useTranslation } from '../../../hooks/useTranslation';
import translations from './translation.json';

interface ColaboradorData {
  nome?: string;
  cargo?: string;
  foto?: string;
  corAvatar?: string;
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
  const { t } = useTranslation(translations);

  const tabItems: TabItem[] = [
    { id: 'personal-data', label: t.tabs?.dadosPessoais || 'Dados Pessoais', path: '/settings/collaborator/personal-data' },
    { id: 'permissions', label: t.tabs?.permissoes || 'Permissões', path: '/settings/collaborator/permissions' },
    { id: 'parameters', label: t.tabs?.parametros || 'Parâmetros', path: '/settings/collaborator/parameters' }
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/personal-data')) return 'personal-data';
    if (path.includes('/permissions')) return 'permissions';
    if (path.includes('/parameters')) return 'parameters';
    return 'lista';
  };

  const handleBack = () => {
    navigate('/settings/collaborator');
  };

  return (
    <PageLayout
      headerType={'avatar'}

      // Props para header padrão
      title={t.title || 'Configurações de Colaboradores'}
      subtitle={t.subtitle || 'Gerencie colaboradores, permissões e parâmetros'}

      // Props para header com avatar
      avatarData={colaboradorData ? {
        title: colaboradorData.nome || (isNew ? 'Novo Colaborador' : 'Colaborador'),
        subtitle: colaboradorData.cargo || (isNew ? "Preencha os dados do colaborador" : "Dados do colaborador"),
        avatarUrl: colaboradorData.foto,
        avatarColor: colaboradorData.corAvatar,
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
