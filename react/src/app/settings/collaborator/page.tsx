import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { PageLayout } from '../../../components/ui/PageLayout';
import type { TabItem } from '../../../components/ui/PageTabs';
import {
  Plus,
  Calendar,
  Check,
  XCircle,
  Download,
  ChevronDown,
  Filter
} from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import translations from './page-translation.json';

export default function ConfigColaborador() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(translations);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const tableRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const tabItems: TabItem[] = [
    { id: 'list', label: 'Colaboradores', path: '/settings/collaborator' },
    { id: 'personal-data', label: 'Dados Pessoais', path: '/settings/collaborator/personal-data' },
    { id: 'permissions', label: 'Permissões', path: '/settings/collaborator/permissions' },
    { id: 'parameters', label: 'Parâmetros', path: '/settings/collaborator/parameters' }
  ];

  const [colaboradores] = useState<any[]>([
    {
      id: 1,
      nome: "Dr. João Silva",
      especialidade: "Ortodontia",
      status: 'ativo',
      acessoSistema: true,
      permissoes: ["agenda", "pacientes", "financeiro"],
      unidadePadrao: "Unidade Principal",
      agendamentoHabilitado: true,
      foto: null
    },
    {
      id: 2,
      nome: "Dra. Maria Santos",
      especialidade: "Endodontia",
      status: 'ativo',
      acessoSistema: true,
      permissoes: ["agenda", "pacientes"],
      unidadePadrao: "Unidade Centro",
      agendamentoHabilitado: true,
      foto: null
    },
    {
      id: 3,
      nome: "Ana Costa",
      especialidade: "Recepção",
      status: 'ativo',
      acessoSistema: true,
      permissoes: ["agenda", "pacientes"],
      unidadePadrao: "Todas",
      agendamentoHabilitado: false,
      foto: null
    },
    {
      id: 4,
      nome: "Carlos Oliveira",
      especialidade: "Administrativo",
      status: 'inativo',
      acessoSistema: false,
      permissoes: ["financeiro"],
      unidadePadrao: "Unidade Principal",
      agendamentoHabilitado: false,
      foto: null
    },
    {
      id: 5,
      nome: "Dra. Paula Lima",
      especialidade: "Periodontia",
      status: 'ativo',
      acessoSistema: true,
      permissoes: ["agenda", "pacientes", "financeiro", "crm"],
      unidadePadrao: "Unidade Sul",
      agendamentoHabilitado: true,
      foto: null
    },
    {
      id: 6,
      nome: "Roberto Almeida",
      especialidade: "Manutenção",
      status: 'ativo',
      acessoSistema: false,
      permissoes: [],
      unidadePadrao: "Todas",
      agendamentoHabilitado: false,
      foto: null
    }
  ]);

  const filterOptions = [
    { id: 'todos', label: t.filters?.all || 'Todos', count: colaboradores.length },
    { id: 'ativos', label: t.filters?.active || 'Ativos', count: colaboradores.filter(c => c.status === 'ativo').length },
    { id: 'inativos', label: t.filters?.inactive || 'Inativos', count: colaboradores.filter(c => c.status === 'inativo').length },
    { id: 'profissionais', label: t.filters?.professionals || 'Profissionais', count: colaboradores.filter(c => c.agendamentoHabilitado).length },
    { id: 'administrativo', label: t.filters?.administrative || 'Administrativo', count: colaboradores.filter(c => !c.agendamentoHabilitado).length }
  ];

  const filteredColaboradores = colaboradores.filter(colaborador => {
    switch(activeFilter) {
      case 'ativos':
        return colaborador.status === 'ativo';
      case 'inativos':
        return colaborador.status === 'inativo';
      case 'profissionais':
        return colaborador.agendamentoHabilitado;
      case 'administrativo':
        return !colaborador.agendamentoHabilitado;
      default:
        return true;
    }
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(false);
      }
    };

    if (filterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterDropdownOpen]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (tableRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          setVisibleCount(prev => Math.min(prev + 20, filteredColaboradores.length));
        }
      }
    };

    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('scroll', handleScroll);
      return () => tableElement.removeEventListener('scroll', handleScroll);
    }
  }, [filteredColaboradores.length]);

  const exportToCSV = () => {
    const headers = [t.export?.headers?.name || 'Nome', t.export?.headers?.specialty || 'Especialidade', t.export?.headers?.status || 'Status', t.export?.headers?.systemAccess || 'Acesso ao Sistema', t.export?.headers?.permissions || 'Permissões', t.export?.headers?.unit || 'Unidade', t.export?.headers?.scheduling || 'Agendamento'];
    const rows = filteredColaboradores.map(c => [
      c.nome,
      c.especialidade,
      c.status,
      c.acessoSistema ? (t.access?.yes || 'Sim') : (t.access?.no || 'Não'),
      c.permissoes.join(', '),
      c.unidadePadrao,
      c.agendamentoHabilitado ? (t.scheduling?.enabled || 'Habilitado') : (t.scheduling?.disabled || 'Desabilitado')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'colaboradores.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-3 sm:p-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">{t.pageTitle || 'Colaboradores'}</h2>
            <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                title={t.buttons?.filters || 'Filtrar'}
              >
                <Filter className="w-4 h-4" />
              </button>

              {filterDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    {filterOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setActiveFilter(option.id);
                          setFilterDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex justify-between items-center ${
                          activeFilter === option.id ? 'bg-krooa-green/10 text-krooa-dark font-medium' : 'text-gray-700'
                        }`}
                      >
                        <span>{option.label}</span>
                        <span className="text-xs text-gray-500">({option.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
              title={t.buttons?.export || 'Exportar'}
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Add New Button */}
            <Button
              variant="primary"
              className="flex items-center gap-2"
              onClick={() => navigate('/settings/collaborator/personal-data')}
            >
              <Plus className="w-4 h-4" />
              {t.buttons?.newCollaborator || 'Novo Colaborador'}
            </Button>
          </div>
        </div>

          {/* Tabela de Colaboradores com scroll infinito */}
          <div
            ref={tableRef}
            className="overflow-auto max-h-[600px] mt-6"
          >
            <Table
              columns={[
                {
                  key: 'colaborador',
                  title: t.table?.name || 'Colaborador',
                  render: (_, row) => (
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/settings/collaborator/personal-data?id=${row.id}`)}>
                      {row.foto ? (
                        <img
                          src={row.foto}
                          alt={row.nome}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-krooa-green/20 flex items-center justify-center">
                          <span className="text-krooa-dark font-semibold text-sm">
                            {row.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{row.nome}</p>
                        <p className="text-xs text-gray-500">{row.especialidade}</p>
                        {row.status === 'inativo' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                            {t.status?.inactive || 'Inativo'}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                },
                {
                  key: 'acesso',
                  title: t.table?.systemAccess || 'Acesso',
                  align: 'center',
                  render: (_, row) => (
                    row.acessoSistema ? (
                      <div className="flex justify-center">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <XCircle className="w-5 h-5 text-gray-400" />
                      </div>
                    )
                  )
                },
                {
                  key: 'permissoes',
                  title: t.table?.permissions || 'Permissões',
                  render: (_, row) => (
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {row.permissoes.length > 0 ? (
                        row.permissoes.map((permissao: string) => (
                          <span
                            key={permissao}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 capitalize"
                          >
                            {permissao}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">Sem permissões</span>
                      )}
                    </div>
                  )
                },
                {
                  key: 'unidadePadrao',
                  title: t.table?.defaultUnit || 'Unidade'
                },
                {
                  key: 'agenda',
                  title: t.table?.scheduling || 'Agenda',
                  align: 'center',
                  render: (_, row) => (
                    row.agendamentoHabilitado ? (
                      <div className="flex justify-center">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Calendar className="w-5 h-5 text-gray-300" />
                      </div>
                    )
                  )
                },
                {
                  key: 'actions',
                  title: 'Ações',
                  align: 'center',
                  render: (_, row) => (
                    <div className="flex items-center justify-center">
                      <button
                        className="group relative p-1.5 rounded-lg transition-all bg-gray-100 text-gray-600 hover:bg-gray-200"
                        title="Mais opções"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ChevronDown className="w-4 h-4" />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <Button
                            variant="menu-item"
                            fullWidth
                            className="px-4 py-2 text-sm rounded-t-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/settings/collaborator/personal-data?id=${row.id}`);
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="menu-item"
                            fullWidth
                            className="px-4 py-2 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Visualizar histórico
                          </Button>
                          <Button
                            variant="menu-item"
                            fullWidth
                            className="px-4 py-2 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Resetar senha
                          </Button>
                          <hr className="my-1" />
                          <Button
                            variant="menu-item"
                            fullWidth
                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Desativar
                          </Button>
                        </div>
                      </button>
                    </div>
                  )
                }
              ]}
              data={filteredColaboradores.slice(0, visibleCount)}
              hoverable
              sticky
            />

            {visibleCount < filteredColaboradores.length && (
              <div className="p-4 text-center text-sm text-gray-500">
                Carregando mais colaboradores...
              </div>
            )}
          </div>
        </Card>
      </div>
  );
}