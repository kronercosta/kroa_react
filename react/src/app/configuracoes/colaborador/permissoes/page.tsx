import React, { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Switch } from '../../../../components/ui/Switch';
import { MultiSelect } from '../../../../components/ui/MultiSelect';
import { ColaboradorLayout } from '../../../../layouts/ColaboradorLayout';

export default function PermissoesColaborador() {
  const [formData, setFormData] = useState({
    acessoSistema: true,
    acessoMobile: false,
    permissoes: {
      agenda: 'total',
      pacientes: 'visualizar',
      financeiro: 'sem-acesso',
      crm: 'sem-acesso',
      configuracoes: 'sem-acesso',
      relatorios: 'visualizar'
    },
    unidadesPermitidas: [],
    centrosCustoPermitidos: []
  });

  const handlePermissionChange = (module: string, level: string) => {
    setFormData(prev => ({
      ...prev,
      permissoes: {
        ...prev.permissoes,
        [module]: level
      }
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const permissionLevels = [
    { value: 'sem-acesso', label: 'Sem Acesso', color: 'gray' },
    { value: 'visualizar', label: 'Visualizar', color: 'blue' },
    { value: 'editar', label: 'Editar', color: 'yellow' },
    { value: 'total', label: 'Total', color: 'green' }
  ];

  const modules = [
    { key: 'agenda', label: 'Agenda', description: 'Gerenciar agendamentos e horários' },
    { key: 'pacientes', label: 'Pacientes', description: 'Cadastro e histórico de pacientes' },
    { key: 'financeiro', label: 'Financeiro', description: 'Controle financeiro e pagamentos' },
    { key: 'crm', label: 'CRM', description: 'Relacionamento com clientes' },
    { key: 'configuracoes', label: 'Configurações', description: 'Configurações do sistema' },
    { key: 'relatorios', label: 'Relatórios', description: 'Visualização de relatórios' }
  ];

  const unidadeOptions = [
    { value: '1', label: 'Unidade Principal' },
    { value: '2', label: 'Unidade Centro' },
    { value: '3', label: 'Unidade Sul' }
  ];

  const centroCustoOptions = [
    { value: '1', label: 'Centro de Custo Principal' },
    { value: '2', label: 'Centro de Custo Ortodontia' },
    { value: '3', label: 'Centro de Custo Endodontia' }
  ];

  const getButtonColor = (level: string) => {
    switch (level) {
      case 'total': return 'bg-green-500 text-white';
      case 'editar': return 'bg-yellow-500 text-white';
      case 'visualizar': return 'bg-blue-500 text-white';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <ColaboradorLayout>
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Acesso ao Sistema</h2>
              <p className="text-sm text-gray-600 mt-1">Configure o acesso geral do colaborador</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Acesso ao Sistema Web</p>
                <p className="text-sm text-gray-600">Permite login no sistema através do navegador</p>
              </div>
              <Switch
                checked={formData.acessoSistema}
                onChange={(checked) => handleInputChange('acessoSistema', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Acesso ao Aplicativo Mobile</p>
                <p className="text-sm text-gray-600">Permite login através do aplicativo móvel</p>
              </div>
              <Switch
                checked={formData.acessoMobile}
                onChange={(checked) => handleInputChange('acessoMobile', checked)}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Permissões por Módulo</h2>
            <p className="text-sm text-gray-600 mt-1">Configure o nível de acesso para cada módulo do sistema</p>
          </div>

          <div className="space-y-4">
            {modules.map(module => (
              <div key={module.key} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{module.label}</p>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>

                  <div className="flex gap-1">
                    {permissionLevels.map(level => {
                      const isActive = formData.permissoes[module.key as keyof typeof formData.permissoes] === level.value;
                      return (
                        <button
                          key={level.value}
                          onClick={() => handlePermissionChange(module.key, level.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? getButtonColor(level.value)
                              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                          }`}
                          disabled={!formData.acessoSistema}
                        >
                          {level.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Unidades e Centros de Custo</h2>
          <p className="text-sm text-gray-600 mb-6">
            Selecione as unidades e centros de custo que este colaborador pode acessar
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <MultiSelect
                label="Unidades Permitidas"
                placeholder="Selecione as unidades"
                options={unidadeOptions}
                value={formData.unidadesPermitidas}
                onChange={(value) => handleInputChange('unidadesPermitidas', value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Deixe vazio para permitir acesso a todas as unidades
              </p>
            </div>

            <div>
              <MultiSelect
                label="Centros de Custo Permitidos"
                placeholder="Selecione os centros de custo"
                options={centroCustoOptions}
                value={formData.centrosCustoPermitidos}
                onChange={(value) => handleInputChange('centrosCustoPermitidos', value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Deixe vazio para permitir acesso a todos os centros de custo
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Permissões Especiais</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div>
                <p className="font-medium text-gray-900">Visualizar Dados Financeiros Sensíveis</p>
                <p className="text-sm text-gray-600">Acesso a valores, custos e margens de lucro</p>
              </div>
              <Switch
                checked={false}
                onChange={() => {}}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div>
                <p className="font-medium text-gray-900">Alterar Dados de Outros Profissionais</p>
                <p className="text-sm text-gray-600">Permite editar agendamentos e dados de outros colaboradores</p>
              </div>
              <Switch
                checked={false}
                onChange={() => {}}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div>
                <p className="font-medium text-gray-900">Excluir Registros Permanentemente</p>
                <p className="text-sm text-gray-600">Permite exclusão definitiva de dados do sistema</p>
              </div>
              <Switch
                checked={false}
                onChange={() => {}}
              />
            </div>
          </div>
        </Card>
      </div>
    </ColaboradorLayout>
  );
}