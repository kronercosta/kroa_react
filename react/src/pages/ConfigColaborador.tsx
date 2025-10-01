'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  Plus,
  Calendar,
  Check,
  XCircle,
  Download,
  ChevronDown,
  Filter
} from 'lucide-react';

export default function ConfigColaborador() {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const tableRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

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
    { id: 'todos', label: 'Todos', count: colaboradores.length },
    { id: 'ativos', label: 'Ativos', count: colaboradores.filter(c => c.status === 'ativo').length },
    { id: 'inativos', label: 'Inativos', count: colaboradores.filter(c => c.status === 'inativo').length },
    { id: 'profissionais', label: 'Profissionais', count: colaboradores.filter(c => c.agendamentoHabilitado).length },
    { id: 'administrativo', label: 'Administrativo', count: colaboradores.filter(c => !c.agendamentoHabilitado).length }
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
    const headers = ['Nome', 'Especialidade', 'Status', 'Acesso ao Sistema', 'Permissões', 'Unidade', 'Agendamento'];
    const rows = filteredColaboradores.map(c => [
      c.nome,
      c.especialidade,
      c.status,
      c.acessoSistema ? 'Sim' : 'Não',
      c.permissoes.join(', '),
      c.unidadePadrao,
      c.agendamentoHabilitado ? 'Habilitado' : 'Desabilitado'
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
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Colaboradores</h2>
            <p className="text-sm text-gray-600 mt-1">Gerencie os colaboradores e suas permissões</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                title="Filtrar"
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
              title="Exportar"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Add New Button */}
            <Button
              variant="primary"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Colaborador
            </Button>
          </div>
        </div>

        {/* Tabela de Colaboradores com scroll infinito */}
        <div
          ref={tableRef}
          className="overflow-auto max-h-[600px] rounded-lg border border-gray-200"
        >
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Colaborador
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Acesso
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Permissões
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Unidade
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Agenda
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredColaboradores.slice(0, visibleCount).map((colaborador) => (
                <tr key={colaborador.id} className="hover:bg-gray-50">
                  {/* Coluna Colaborador - Nome e Foto/Inicial */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {colaborador.foto ? (
                        <img
                          src={colaborador.foto}
                          alt={colaborador.nome}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-krooa-green/20 flex items-center justify-center">
                          <span className="text-krooa-dark font-semibold text-sm">
                            {colaborador.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{colaborador.nome}</p>
                        <p className="text-xs text-gray-500">{colaborador.especialidade}</p>
                        {colaborador.status === 'inativo' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                            Inativo
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Coluna Acesso ao Sistema */}
                  <td className="py-3 px-4 text-center">
                    {colaborador.acessoSistema ? (
                      <div className="flex justify-center">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <XCircle className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </td>

                  {/* Coluna Permissões */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {colaborador.permissoes.length > 0 ? (
                        colaborador.permissoes.map((permissao: string) => (
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
                  </td>

                  {/* Coluna Unidade */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900">{colaborador.unidadePadrao}</span>
                  </td>

                  {/* Coluna Agendamento */}
                  <td className="py-3 px-4 text-center">
                    {colaborador.agendamentoHabilitado ? (
                      <div className="flex justify-center">
                        <div className="p-1.5 bg-krooa-green/20 rounded-lg">
                          <Calendar className="w-5 h-5 text-krooa-green" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Calendar className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </td>

                  {/* Coluna Ações */}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center">
                      <button
                        className="group relative p-1.5 rounded-lg transition-all bg-gray-100 text-gray-600 hover:bg-gray-200"
                        title="Mais opções"
                      >
                        <ChevronDown className="w-4 h-4" />

                        {/* Dropdown menu */}
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t-lg">
                            Editar
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                            Visualizar histórico
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                            Resetar senha
                          </button>
                          <hr className="my-1" />
                          <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg">
                            Desativar
                          </button>
                        </div>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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