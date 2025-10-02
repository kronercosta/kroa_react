import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ColaboradorHeader } from '../components/ColaboradorHeader';
import { ColaboradorTabs } from '../components/navigation/ColaboradorTabs';

interface ColaboradorLayoutProps {
  children: React.ReactNode;
}

export function ColaboradorLayout({ children }: ColaboradorLayoutProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const colaboradorId = searchParams.get('id');
  const isNewColaborador = !colaboradorId;

  const [colaboradorData, setColaboradorData] = useState({
    nome: '',
    cargo: '',
    foto: '',
    status: 'ativo'
  });

  useEffect(() => {
    if (!isNewColaborador && colaboradorId) {
      // Simular carregamento de dados
      setColaboradorData({
        nome: 'Dr. João Silva',
        cargo: 'Dentista',
        foto: '',
        status: 'ativo'
      });
    }
  }, [colaboradorId, isNewColaborador]);

  const handleBack = () => {
    navigate('/configuracoes/colaborador');
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Page Header */}
      <ColaboradorHeader
        colaboradorData={colaboradorData}
        isNew={isNewColaborador}
        onBack={handleBack}
      />

      {/* Tabs using SubMenu component */}
      <div className="flex-shrink-0">
        <ColaboradorTabs colaboradorId={colaboradorId} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        {children}
      </div>
    </div>
  );
}