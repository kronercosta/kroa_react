import React, { useState } from 'react';
import { Table } from '../../../components/ui/Table';
import { Button, IconButton } from '../../../components/ui/Button';
import { Badge, StatusPill } from '../../../components/ui/Badge';
import { Avatar } from '../../../components/ui/Avatar';
import { Eye, Edit, Trash2, Download, Mail, Phone, Star, MapPin, Calendar, Users, Building, DollarSign } from 'lucide-react';

const TableShowcase: React.FC = () => {
  const [editingRow, setEditingRow] = useState<number | null>(null);

  // Dados de exemplo para diferentes tipos de tabela
  const usuariosData = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@krooa.com',
      role: 'Desenvolvedor',
      status: 'Ativo',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      lastLogin: '2024-01-15',
      department: 'Tecnologia'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@krooa.com',
      role: 'Designer',
      status: 'Ativo',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      lastLogin: '2024-01-14',
      department: 'Design'
    },
    {
      id: 3,
      name: 'Carlos Oliveira',
      email: 'carlos@krooa.com',
      role: 'Gerente',
      status: 'Inativo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      lastLogin: '2024-01-10',
      department: 'Administração'
    },
    {
      id: 4,
      name: 'Ana Costa',
      email: 'ana@krooa.com',
      role: 'Analista',
      status: 'Ativo',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      lastLogin: '2024-01-15',
      department: 'Vendas'
    }
  ];

  const produtosData = [
    {
      id: 1,
      name: 'Produto A',
      price: 'R$ 299,90',
      category: 'Categoria 1',
      stock: 50,
      rating: 4.5,
      status: 'Disponível'
    },
    {
      id: 2,
      name: 'Produto B',
      price: 'R$ 199,90',
      category: 'Categoria 2',
      stock: 0,
      rating: 3.8,
      status: 'Esgotado'
    },
    {
      id: 3,
      name: 'Produto C',
      price: 'R$ 449,90',
      category: 'Categoria 1',
      stock: 25,
      rating: 4.9,
      status: 'Disponível'
    }
  ];

  const empresasData = [
    {
      id: 1,
      name: 'Tech Corp',
      email: 'contato@techcorp.com',
      phone: '(11) 99999-9999',
      city: 'São Paulo',
      employees: 150,
      revenue: 'R$ 5M',
      plan: 'Enterprise'
    },
    {
      id: 2,
      name: 'Design Studio',
      email: 'hello@designstudio.com',
      phone: '(21) 88888-8888',
      city: 'Rio de Janeiro',
      employees: 45,
      revenue: 'R$ 1.2M',
      plan: 'Professional'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-krooa-dark mb-2">Table Component</h1>
          <p className="text-xl text-gray-600">
            Componente de tabela flexível e reutilizável com recursos avançados
          </p>
        </div>

        {/* Tabela Básica */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-4">Tabela Básica</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-6">
              Tabela simples com colunas básicas e ações
            </p>

            <Table
              columns={[
                { key: 'id', title: 'ID', width: '80px' },
                { key: 'name', title: 'Nome' },
                { key: 'email', title: 'E-mail' },
                { key: 'role', title: 'Cargo', align: 'center' },
                {
                  key: 'actions',
                  title: 'Ações',
                  align: 'right',
                  render: (_, row) => (
                    <div className="flex items-center justify-end gap-1">
                      <IconButton variant="ghost" size="sm" title="Visualizar">
                        <Eye className="w-4 h-4" />
                      </IconButton>
                      <IconButton variant="ghost" size="sm" title="Editar">
                        <Edit className="w-4 h-4" />
                      </IconButton>
                      <IconButton variant="ghost" size="sm" title="Excluir" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </div>
                  )
                }
              ]}
              data={usuariosData.slice(0, 3)}
              hoverable
            />
          </div>
        </section>

        {/* Tabela Avançada com Componentes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-4">Tabela Avançada</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-6">
              Tabela com componentes customizados: Avatar, Badge, StatusPill
            </p>

            <Table
              columns={[
                {
                  key: 'user',
                  title: 'Usuário',
                  render: (_, row) => (
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={row.avatar}
                        alt={row.name}
                        size="sm"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{row.name}</div>
                        <div className="text-sm text-gray-500">{row.email}</div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'department',
                  title: 'Departamento',
                  align: 'center',
                  render: (value) => (
                    <Badge variant="secondary">{value}</Badge>
                  )
                },
                { key: 'role', title: 'Cargo', align: 'center' },
                {
                  key: 'status',
                  title: 'Status',
                  align: 'center',
                  render: (value) => (
                    <StatusPill
                      status={value === 'Ativo' ? 'success' : 'error'}
                      text={value}
                    />
                  )
                },
                { key: 'lastLogin', title: 'Último Login', align: 'center' },
                {
                  key: 'actions',
                  title: 'Ações',
                  align: 'right',
                  render: (_, row) => (
                    <div className="flex items-center justify-end gap-1">
                      <IconButton variant="ghost" size="sm" title="E-mail">
                        <Mail className="w-4 h-4" />
                      </IconButton>
                      <IconButton variant="ghost" size="sm" title="Editar">
                        <Edit className="w-4 h-4" />
                      </IconButton>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        title="Excluir"
                        className="text-red-600 hover:text-red-700"
                        disabled={row.status === 'Ativo'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </div>
                  )
                }
              ]}
              data={usuariosData}
              hoverable
              sticky
            />
          </div>
        </section>

        {/* Tabela de Produtos */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-4">Tabela de Produtos</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-6">
              Exemplo de tabela para e-commerce com preços, estoque e avaliações
            </p>

            <Table
              columns={[
                { key: 'name', title: 'Produto' },
                { key: 'category', title: 'Categoria', align: 'center' },
                { key: 'price', title: 'Preço', align: 'right' },
                {
                  key: 'stock',
                  title: 'Estoque',
                  align: 'center',
                  render: (value) => (
                    <Badge variant={value > 0 ? 'success' : 'error'}>
                      {value > 0 ? `${value} unidades` : 'Esgotado'}
                    </Badge>
                  )
                },
                {
                  key: 'rating',
                  title: 'Avaliação',
                  align: 'center',
                  render: (value) => (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  )
                },
                {
                  key: 'actions',
                  title: 'Ações',
                  align: 'right',
                  render: (_, row) => (
                    <div className="flex items-center justify-end gap-1">
                      <IconButton variant="ghost" size="sm" title="Visualizar">
                        <Eye className="w-4 h-4" />
                      </IconButton>
                      <IconButton variant="ghost" size="sm" title="Editar">
                        <Edit className="w-4 h-4" />
                      </IconButton>
                      <IconButton variant="ghost" size="sm" title="Baixar relatório">
                        <Download className="w-4 h-4" />
                      </IconButton>
                    </div>
                  )
                }
              ]}
              data={produtosData}
              hoverable
            />
          </div>
        </section>

        {/* Estados Especiais */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-4">Estados Especiais</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Loading State */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-krooa-dark mb-4">Estado de Loading</h3>
              <Table
                columns={[
                  { key: 'name', title: 'Nome' },
                  { key: 'email', title: 'E-mail' }
                ]}
                data={[]}
                loading={true}
              />
            </div>

            {/* Empty State */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-krooa-dark mb-4">Estado Vazio</h3>
              <Table
                columns={[
                  { key: 'name', title: 'Nome' },
                  { key: 'email', title: 'E-mail' }
                ]}
                data={[]}
                emptyMessage="Nenhum dado encontrado"
              />
            </div>
          </div>
        </section>

        {/* Tabela com Diferentes Opções */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-4">Opções de Estilo</h2>

          <div className="space-y-6">
            {/* Tabela Striped */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-krooa-dark mb-4">Tabela Striped</h3>
              <Table
                columns={[
                  { key: 'name', title: 'Empresa' },
                  { key: 'city', title: 'Cidade', align: 'center' },
                  { key: 'employees', title: 'Funcionários', align: 'center' },
                  { key: 'plan', title: 'Plano', align: 'center' }
                ]}
                data={empresasData}
                striped
                hoverable={false}
              />
            </div>

            {/* Tabela Compacta */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-krooa-dark mb-4">Tabela com Ícones nos Headers</h3>
              <Table
                columns={[
                  {
                    key: 'name',
                    title: (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Empresa
                      </div>
                    )
                  },
                  {
                    key: 'phone',
                    title: (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Telefone
                      </div>
                    ),
                    align: 'center'
                  },
                  {
                    key: 'city',
                    title: (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Cidade
                      </div>
                    ),
                    align: 'center'
                  },
                  {
                    key: 'employees',
                    title: (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Funcionários
                      </div>
                    ),
                    align: 'center'
                  },
                  {
                    key: 'revenue',
                    title: (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Receita
                      </div>
                    ),
                    align: 'right'
                  }
                ]}
                data={empresasData}
                hoverable
              />
            </div>
          </div>
        </section>

        {/* Documentação */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-krooa-dark mb-4">Como Usar</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">Propriedades do Table</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium">Prop</th>
                      <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium">Tipo</th>
                      <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium">Padrão</th>
                      <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 text-sm"><code>columns</code></td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">TableColumn[]</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">-</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">Configuração das colunas</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 text-sm"><code>data</code></td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">any[]</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">-</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">Dados da tabela</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 text-sm"><code>hoverable</code></td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">boolean</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">true</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">Efeito hover nas linhas</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 text-sm"><code>striped</code></td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">boolean</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">false</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">Linhas alternadas</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 text-sm"><code>sticky</code></td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">boolean</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">false</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">Header fixo no scroll</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 text-sm"><code>loading</code></td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">boolean</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">false</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">Estado de carregamento</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 text-sm"><code>emptyMessage</code></td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">string</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">'Nenhum dado encontrado'</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">Mensagem para estado vazio</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TableShowcase;