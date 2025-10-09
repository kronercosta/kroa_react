import { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Switch } from '../../../../components/ui/Switch';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { ColaboradorLayout } from '../ColaboradorLayout';
import { useTranslation } from '../../../../hooks/useTranslation';
import translations from './translation.json';

export default function PermissoesColaborador() {
  const { t } = useTranslation(translations);
  const [colaboradorData] = useState({
    nome: 'Dr. João Silva',
    cargo: 'Ortodontista',
    foto: ''
  });

  const [formData, setFormData] = useState({
    acessoSistema: true,
    restricaoIP: false,
    ipsPermitidos: [] as string[],
    primeiroAcesso: {
      status: 'realizado', // 'pendente', 'enviado', 'realizado'
      emailEnviado: 'joao.silva@clinica.com', // email para onde foi enviado
      dataEnvio: '2024-01-15T10:30:00.000Z', // data do envio
      dataAcesso: '2024-01-15T14:45:00.000Z', // data que fez o primeiro acesso
      tentativasEnvio: 1
    },
    permissoes: {
      agenda: {
        ativo: true,
        acoes: {
          visualizar: { ativo: true, profissionais: ['1', '3'] }, // só alguns profissionais
          editar: { ativo: true, profissionais: ['1'] }, // só Dr. João Silva
          evoluir: { ativo: false, profissionais: [] as string[] }
        }
      },
      pacientes: {
        ativo: true,
        acoes: {
          visualizar: { ativo: true },
          editar: { ativo: false }
        }
      },
      financeiro: {
        ativo: true,
        acoes: {
          visualizar: { ativo: true },
          editar: { ativo: false },
          configuracoes: {
            descontoMaximo: 10, // percentual
            acrescimoMaximo: 5 // percentual
          }
        }
      },
      configuracoes: {
        ativo: true,
        acoes: {
          clinica: {
            administrativas: { ativo: false }, // só super usuário
            cadeiras: { ativo: true },
            centroCusto: { ativo: false },
            unidades: { ativo: true },
            parametros: { ativo: true }
          }
        }
      },
      colaborador: {
        ativo: true,
        acoes: {
          visualizar: { ativo: true },
          editar: { ativo: false }
        }
      },
      relatorios: {
        ativo: true,
        acoes: {
          visualizar: { ativo: true }
        }
      }
    },
    unidadesPermitidas: [] as string[],
    centrosCustoPermitidos: [] as string[]
  });

  const handleSave = () => {
    console.log('Salvando permissões:', formData);
  };

  const handleSendFirstAccessEmail = () => {
    const colaboradorEmail = 'joao.silva@clinica.com'; // Normalmente viria dos dados do colaborador
    console.log('Enviando email de primeiro acesso para:', colaboradorEmail);

    setFormData(prev => ({
      ...prev,
      primeiroAcesso: {
        ...prev.primeiroAcesso,
        status: 'enviado',
        emailEnviado: colaboradorEmail,
        dataEnvio: new Date().toISOString(),
        tentativasEnvio: prev.primeiroAcesso.tentativasEnvio + 1
      }
    }));
    // Aqui seria feita a chamada para a API enviar o email
  };

  const handleResendFirstAccessEmail = () => {
    const colaboradorEmail = formData.primeiroAcesso.emailEnviado || 'joao.silva@clinica.com';
    console.log('Reenviando email de primeiro acesso para:', colaboradorEmail);

    setFormData(prev => ({
      ...prev,
      primeiroAcesso: {
        ...prev.primeiroAcesso,
        status: 'enviado',
        dataEnvio: new Date().toISOString(),
        tentativasEnvio: prev.primeiroAcesso.tentativasEnvio + 1
      }
    }));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pendente':
        return {
          label: 'Pendente',
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: '⏳'
        };
      case 'enviado':
        return {
          label: 'Email Enviado',
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: '📧'
        };
      case 'realizado':
        return {
          label: 'Acesso Realizado',
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: '✅'
        };
      default:
        return {
          label: 'Desconhecido',
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: '❓'
        };
    }
  };

  const handleModuleToggle = (module: string, ativo: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissoes: {
        ...prev.permissoes,
        [module]: {
          ...prev.permissoes[module as keyof typeof prev.permissoes],
          ativo
        }
      }
    }));
  };

  const handleActionToggle = (module: string, action: string, ativo: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissoes: {
        ...prev.permissoes,
        [module]: {
          ...prev.permissoes[module as keyof typeof prev.permissoes],
          acoes: {
            ...(prev.permissoes[module as keyof typeof prev.permissoes].acoes as any),
            [action]: {
              ...(prev.permissoes[module as keyof typeof prev.permissoes].acoes as any)[action],
              ativo
            }
          }
        }
      }
    }));
  };

  const handleFinanceiroConfig = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      permissoes: {
        ...prev.permissoes,
        financeiro: {
          ...prev.permissoes.financeiro,
          acoes: {
            ...prev.permissoes.financeiro.acoes,
            configuracoes: {
              ...prev.permissoes.financeiro.acoes.configuracoes,
              [field]: value
            }
          }
        }
      }
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Mock de profissionais para seleção
  const profissionaisDisponiveis = [
    { value: '1', label: 'Dr. João Silva' },
    { value: '2', label: 'Dra. Maria Santos' },
    { value: '3', label: 'Dr. Pedro Costa' },
    { value: '4', label: 'Dr. Carlos Lima' },
    { value: '5', label: 'Dra. Ana Oliveira' }
  ];

  const getModuleConfig = (moduleKey: string) => {
    switch (moduleKey) {
      case 'agenda':
        return {
          key: 'agenda',
          label: 'Agenda',
          description: 'Gerenciar agendamentos e horários',
          hasDetailedConfig: true
        };
      case 'pacientes':
        return {
          key: 'pacientes',
          label: 'Pacientes',
          description: 'Cadastro e histórico de pacientes',
          hasDetailedConfig: false
        };
      case 'financeiro':
        return {
          key: 'financeiro',
          label: 'Financeiro',
          description: 'Controle financeiro e pagamentos',
          hasDetailedConfig: true
        };
      case 'configuracoes':
        return {
          key: 'configuracoes',
          label: 'Configurações',
          description: 'Configurações do sistema',
          hasDetailedConfig: true
        };
      case 'colaborador':
        return {
          key: 'colaborador',
          label: 'Colaborador',
          description: 'Gestão de colaboradores',
          hasDetailedConfig: false
        };
      case 'relatorios':
        return {
          key: 'relatorios',
          label: 'Relatórios',
          description: 'Visualização de relatórios',
          hasDetailedConfig: false
        };
      default:
        return null;
    }
  };

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

  // IPs cadastrados da clínica (normalmente viria da API)
  const ipsDisponiveis = [
    { value: '192.168.1.100', label: '192.168.1.100 - Recepção' },
    { value: '192.168.1.101', label: '192.168.1.101 - Consultório 1' },
    { value: '192.168.1.102', label: '192.168.1.102 - Consultório 2' },
    { value: '192.168.1.103', label: '192.168.1.103 - Administração' },
    { value: '192.168.1.104', label: '192.168.1.104 - Laboratório' }
  ];

  const renderAgendaConfig = () => {
    const agenda = formData.permissoes.agenda;

    return (
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-blue-200">
          <h4 className="font-medium text-gray-900">Configurações da Agenda</h4>
          <p className="text-sm text-gray-600 mt-1">Configure as permissões específicas para cada ação na agenda</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-100">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ação</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Ativo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Profissionais Permitidos</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* Visualizar */}
              <tr className="border-b border-blue-100">
                <td className="py-3 px-4">
                  <div>
                    <span className="font-medium text-gray-900">Visualizar</span>
                    <p className="text-sm text-gray-600">Ver agendamentos e horários</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <Switch
                    checked={agenda.acoes.visualizar.ativo}
                    onChange={(checked) => handleActionToggle('agenda', 'visualizar', checked)}
                    size="sm"
                  />
                </td>
                <td className="py-3 px-4">
                  {agenda.acoes.visualizar.ativo ? (
                    <Select
                      options={[{ value: 'todos', label: 'Todos os profissionais' }, ...profissionaisDisponiveis]}
                      value={agenda.acoes.visualizar.profissionais}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            agenda: {
                              ...prev.permissoes.agenda,
                              acoes: {
                                ...prev.permissoes.agenda.acoes,
                                visualizar: {
                                  ...prev.permissoes.agenda.acoes.visualizar,
                                  profissionais: Array.isArray(value) ? value : [value]
                                }
                              }
                            }
                          }
                        }));
                      }}
                      multiple={true}
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Desabilitado</span>
                  )}
                </td>
              </tr>

              {/* Editar */}
              <tr className="border-b border-blue-100">
                <td className="py-3 px-4">
                  <div>
                    <span className="font-medium text-gray-900">Editar</span>
                    <p className="text-sm text-gray-600">Modificar agendamentos</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <Switch
                    checked={agenda.acoes.editar.ativo}
                    onChange={(checked) => handleActionToggle('agenda', 'editar', checked)}
                    size="sm"
                  />
                </td>
                <td className="py-3 px-4">
                  {agenda.acoes.editar.ativo ? (
                    <Select
                      options={[{ value: 'todos', label: 'Todos os profissionais' }, ...profissionaisDisponiveis]}
                      value={agenda.acoes.editar.profissionais}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            agenda: {
                              ...prev.permissoes.agenda,
                              acoes: {
                                ...prev.permissoes.agenda.acoes,
                                editar: {
                                  ...prev.permissoes.agenda.acoes.editar,
                                  profissionais: Array.isArray(value) ? value : [value]
                                }
                              }
                            }
                          }
                        }));
                      }}
                      multiple={true}
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Desabilitado</span>
                  )}
                </td>
              </tr>

              {/* Evoluir */}
              <tr>
                <td className="py-3 px-4">
                  <div>
                    <span className="font-medium text-gray-900">Evoluir</span>
                    <p className="text-sm text-gray-600">Fazer evoluções clínicas</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <Switch
                    checked={agenda.acoes.evoluir.ativo}
                    onChange={(checked) => handleActionToggle('agenda', 'evoluir', checked)}
                    size="sm"
                  />
                </td>
                <td className="py-3 px-4">
                  {agenda.acoes.evoluir.ativo ? (
                    <Select
                      options={[{ value: 'todos', label: 'Todos os profissionais' }, ...profissionaisDisponiveis]}
                      value={agenda.acoes.evoluir.profissionais || []}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            agenda: {
                              ...prev.permissoes.agenda,
                              acoes: {
                                ...prev.permissoes.agenda.acoes,
                                evoluir: {
                                  ...prev.permissoes.agenda.acoes.evoluir,
                                  profissionais: Array.isArray(value) ? value : [value]
                                }
                              }
                            }
                          }
                        }));
                      }}
                      multiple={true}
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Desabilitado</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderFinanceiroConfig = () => {
    const financeiro = formData.permissoes.financeiro;

    return (
      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-green-200">
          <h4 className="font-medium text-gray-900">Configurações Financeiras</h4>
          <p className="text-sm text-gray-600 mt-1">Configure as permissões e limites financeiros</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-100">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ação</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Ativo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Configurações</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* Visualizar */}
              <tr className="border-b border-green-100">
                <td className="py-3 px-4">
                  <div>
                    <span className="font-medium text-gray-900">Visualizar</span>
                    <p className="text-sm text-gray-600">Ver dados financeiros</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <Switch
                    checked={financeiro.acoes.visualizar.ativo}
                    onChange={(checked) => handleActionToggle('financeiro', 'visualizar', checked)}
                    size="sm"
                  />
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-400 text-sm">-</span>
                </td>
              </tr>

              {/* Editar */}
              <tr>
                <td className="py-3 px-4">
                  <div>
                    <span className="font-medium text-gray-900">Editar</span>
                    <p className="text-sm text-gray-600">Modificar valores e pagamentos</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <Switch
                    checked={financeiro.acoes.editar.ativo}
                    onChange={(checked) => handleActionToggle('financeiro', 'editar', checked)}
                    size="sm"
                  />
                </td>
                <td className="py-3 px-4">
                  {financeiro.acoes.editar.ativo ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Desconto máx (%)"
                        type="number"
                        value={financeiro.acoes.configuracoes.descontoMaximo.toString()}
                        onChange={(value) => handleFinanceiroConfig('descontoMaximo', Number(value))}
                        min={0}
                        max={100}
                      />
                      <Input
                        label="Acréscimo máx (%)"
                        type="number"
                        value={financeiro.acoes.configuracoes.acrescimoMaximo.toString()}
                        onChange={(value) => handleFinanceiroConfig('acrescimoMaximo', Number(value))}
                        min={0}
                        max={100}
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Desabilitado</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderConfiguracoesConfig = () => {
    const config = formData.permissoes.configuracoes;

    const configItems = [
      {
        key: 'administrativas',
        label: 'Configurações Administrativas',
        description: 'Acesso total às configurações do sistema',
        ativo: config.acoes.clinica.administrativas.ativo,
        disabled: true,
        badge: 'Apenas Super Usuário',
        badgeColor: 'bg-red-100 text-red-700'
      },
      {
        key: 'cadeiras',
        label: 'Gerenciar Cadeiras',
        description: 'Cadastrar e configurar cadeiras odontológicas',
        ativo: config.acoes.clinica.cadeiras.ativo,
        disabled: false
      },
      {
        key: 'centroCusto',
        label: 'Gerenciar Centro de Custo',
        description: 'Configurar centros de custo da clínica',
        ativo: config.acoes.clinica.centroCusto.ativo,
        disabled: false
      },
      {
        key: 'unidades',
        label: 'Gerenciar Unidades',
        description: 'Configurar unidades da clínica',
        ativo: config.acoes.clinica.unidades.ativo,
        disabled: false
      },
      {
        key: 'parametros',
        label: 'Gerenciar Parâmetros',
        description: 'Configurar parâmetros do sistema',
        ativo: config.acoes.clinica.parametros.ativo,
        disabled: false
      }
    ];

    return (
      <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-purple-200">
          <h4 className="font-medium text-gray-900">Configurações da Clínica</h4>
          <p className="text-sm text-gray-600 mt-1">Configure o acesso às diferentes áreas de configuração</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-100">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Configuração</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Ativo</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Restrição</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {configItems.map((item, index) => (
                <tr key={item.key} className={index < configItems.length - 1 ? 'border-b border-purple-100' : ''}>
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-medium text-gray-900">{item.label}</span>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Switch
                      checked={item.ativo}
                      onChange={(checked) => {
                        if (!item.disabled) {
                          setFormData(prev => ({
                            ...prev,
                            permissoes: {
                              ...prev.permissoes,
                              configuracoes: {
                                ...prev.permissoes.configuracoes,
                                acoes: {
                                  ...prev.permissoes.configuracoes.acoes,
                                  clinica: {
                                    ...prev.permissoes.configuracoes.acoes.clinica,
                                    [item.key]: { ativo: checked }
                                  }
                                }
                              }
                            }
                          }));
                        }
                      }}
                      size="sm"
                      disabled={item.disabled}
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.badge ? (
                      <span className={`text-xs px-2 py-1 rounded ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSimpleModuleConfig = (moduleKey: string) => {
    const module = formData.permissoes[moduleKey as keyof typeof formData.permissoes];
    const moduleConfig = getModuleConfig(moduleKey);

    const getActions = () => {
      switch (moduleKey) {
        case 'pacientes':
          return [
            { key: 'visualizar', label: 'Visualizar', description: 'Ver dados dos pacientes' },
            { key: 'editar', label: 'Editar', description: 'Modificar dados dos pacientes' }
          ];
        case 'colaborador':
          return [
            { key: 'visualizar', label: 'Visualizar', description: 'Ver dados dos colaboradores' },
            { key: 'editar', label: 'Editar', description: 'Modificar dados dos colaboradores' }
          ];
        case 'relatorios':
          return [
            { key: 'visualizar', label: 'Visualizar', description: 'Acessar relatórios do sistema' }
          ];
        default:
          return [];
      }
    };

    const actions = getActions();

    return (
      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Configurações de {moduleConfig?.label}</h4>
          <p className="text-sm text-gray-600 mt-1">Configure as permissões para este módulo</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ação</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Ativo</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {actions.map((action, index) => (
                <tr key={action.key} className={index < actions.length - 1 ? 'border-b border-gray-100' : ''}>
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-medium text-gray-900">{action.label}</span>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Switch
                      checked={(module.acoes as any)[action.key]?.ativo || false}
                      onChange={(checked) => handleActionToggle(moduleKey, action.key, checked)}
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <ColaboradorLayout
      colaboradorData={colaboradorData}
      headerControls={
        <>
          <Button variant="outline">{t?.buttons?.cancel || 'Cancelar'}</Button>
          <Button variant="primary" onClick={handleSave}>{t?.buttons?.save || 'Salvar'}</Button>
        </>
      }
    >
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t?.systemAccess?.title || 'Acesso ao Sistema'}</h2>
              <p className="text-sm text-gray-600 mt-1">{t?.systemAccess?.description || 'Configure o acesso geral do colaborador'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{t?.systemAccess?.label || 'Acesso ao Sistema'}</p>
                <p className="text-sm text-gray-600">{t?.systemAccess?.systemDescription || 'Permite que o colaborador faça login no sistema'}</p>
              </div>
              <Switch
                checked={formData.acessoSistema}
                onChange={(checked) => handleInputChange('acessoSistema', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{t?.systemAccess?.ipRestrictionTitle || 'Restringir por IP'}</p>
                <p className="text-sm text-gray-600">{t?.systemAccess?.ipRestrictionDescription || 'Limita o acesso apenas aos IPs cadastrados da clínica'}</p>
              </div>
              <Switch
                checked={formData.restricaoIP}
                onChange={(checked) => handleInputChange('restricaoIP', checked)}
                disabled={!formData.acessoSistema}
              />
            </div>

            {/* Campo de IPs quando restrição estiver ativada */}
            {formData.restricaoIP && formData.acessoSistema && (
              <div className="ml-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Select
                  label={t?.systemAccess?.allowedIPs || 'IPs Permitidos'}
                  options={ipsDisponiveis}
                  value={formData.ipsPermitidos}
                  onChange={(e) => handleInputChange('ipsPermitidos', Array.isArray(e.target.value) ? e.target.value : [])}
                  multiple={true}
                  editable={true}
                />
                <p className="text-xs text-blue-600 mt-2">
                  {t?.systemAccess?.ipHelp || 'Selecione os IPs de onde este colaborador poderá acessar o sistema'}
                </p>
              </div>
            )}

            {/* Sistema de primeiro acesso */}
            {formData.acessoSistema && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-gray-900">{t?.systemAccess?.firstAccessTitle || 'Primeiro Acesso'}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
                        getStatusInfo(formData.primeiroAcesso.status).color
                      }`}>
                        <span>{getStatusInfo(formData.primeiroAcesso.status).icon}</span>
                        {getStatusInfo(formData.primeiroAcesso.status).label}
                      </span>
                    </div>

                    {formData.primeiroAcesso.status === 'pendente' && (
                      <p className="text-sm text-gray-600">
                        {t?.systemAccess?.firstAccessDescription || 'Envie um email para que o colaborador defina sua senha e aceite os termos'}
                      </p>
                    )}

                    {formData.primeiroAcesso.status === 'enviado' && (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-700">Email enviado para:</p>
                        <p className="text-blue-600">{formData.primeiroAcesso.emailEnviado}</p>
                        <p>Data do envio: {formatDate(formData.primeiroAcesso.dataEnvio)}</p>
                        <p>Tentativas de envio: {formData.primeiroAcesso.tentativasEnvio}</p>
                      </div>
                    )}

                    {formData.primeiroAcesso.status === 'realizado' && (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-green-700">Primeiro acesso realizado com sucesso!</p>
                        <p>Email: {formData.primeiroAcesso.emailEnviado}</p>
                        <p>Data do acesso: {formatDate(formData.primeiroAcesso.dataAcesso)}</p>
                        <p>Colaborador pode acessar o sistema normalmente</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {formData.primeiroAcesso.status === 'pendente' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={handleSendFirstAccessEmail}
                      >
                        {t?.systemAccess?.sendEmail || 'Enviar Email'}
                      </Button>
                    )}

                    {formData.primeiroAcesso.status === 'enviado' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleResendFirstAccessEmail}
                      >
                        {t?.systemAccess?.resendEmail || 'Reenviar Email'}
                      </Button>
                    )}

                    {formData.primeiroAcesso.status === 'realizado' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleResendFirstAccessEmail}
                      >
                        {t?.systemAccess?.sendNewEmail || 'Enviar Novo Email'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t?.unitsAndCostCenters?.title || 'Unidades e Centros de Custo'}</h2>
          <p className="text-sm text-gray-600 mb-6">
            {t?.unitsAndCostCenters?.description || 'Selecione as unidades e centros de custo que este colaborador pode acessar'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                label={t?.unitsAndCostCenters?.units || 'Unidades Permitidas'}
                options={unidadeOptions}
                value={formData.unidadesPermitidas}
                onChange={(e) => handleInputChange('unidadesPermitidas', Array.isArray(e.target.value) ? e.target.value : [])}
                multiple={true}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t?.unitsAndCostCenters?.unitsHelp || 'Deixe vazio para permitir acesso a todas as unidades'}
              </p>
            </div>

            <div>
              <Select
                label={t?.unitsAndCostCenters?.costCenters || 'Centros de Custo Permitidos'}
                options={centroCustoOptions}
                value={formData.centrosCustoPermitidos}
                onChange={(e) => handleInputChange('centrosCustoPermitidos', Array.isArray(e.target.value) ? e.target.value : [])}
                multiple={true}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t?.unitsAndCostCenters?.costCentersHelp || 'Deixe vazio para permitir acesso a todos os centros de custo'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">{t?.modules?.title || 'Permissões por Módulo'}</h2>
            <p className="text-sm text-gray-600 mt-1">{t?.modules?.subtitle || 'Configure o nível de acesso para cada módulo do sistema'}</p>
          </div>

          <div className="space-y-4">
            {Object.keys(formData.permissoes).map(moduleKey => {
              const moduleConfig = getModuleConfig(moduleKey);
              if (!moduleConfig) return null;

              const module = formData.permissoes[moduleKey as keyof typeof formData.permissoes];

              return (
                <div key={moduleKey} className="border border-gray-200 rounded-lg">
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={module.ativo}
                          onChange={(checked) => handleModuleToggle(moduleKey, checked)}
                          disabled={!formData.acessoSistema}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{moduleConfig.label}</p>
                          <p className="text-sm text-gray-600">{moduleConfig.description}</p>
                        </div>
                      </div>

                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        module.ativo
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {module.ativo ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>
                  </div>

                  {/* Configurações detalhadas do módulo */}
                  {module.ativo && (
                    <div className="p-4">
                      {moduleKey === 'agenda' && renderAgendaConfig()}
                      {moduleKey === 'financeiro' && renderFinanceiroConfig()}
                      {moduleKey === 'configuracoes' && renderConfiguracoesConfig()}
                      {!moduleConfig.hasDetailedConfig && renderSimpleModuleConfig(moduleKey)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

      </div>
    </ColaboradorLayout>
  );
}