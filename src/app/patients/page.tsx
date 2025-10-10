'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Plus, Download, Filter as FilterIcon, ChevronRight, User } from 'lucide-react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Card } from '../../components/ui/Card';

const PatientsPage: React.FC = () => {
  const [activeChart, setActiveChart] = useState('geolocation');

  // Estados do PatientsList
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [displayedPatients, setDisplayedPatients] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Configuração de região (US ou BR)
  const region = import.meta.env.VITE_CLINIC_REGION || 'BR';

  // Dados para gerar pacientes
  const firstNames = region === 'BR'
    ? ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Lucia', 'Fernando', 'Patricia', 'Roberto', 'Julia', 'Marcos', 'Laura', 'Paulo', 'Beatriz', 'Ricardo']
    : ['John', 'Mary', 'Peter', 'Anna', 'Charles', 'Lucy', 'Frank', 'Patricia', 'Robert', 'Julia', 'Mark', 'Laura', 'Paul', 'Betty', 'Richard'];
  const lastNames = region === 'BR'
    ? ['Silva', 'Santos', 'Costa', 'Oliveira', 'Rodrigues', 'Souza', 'Ferreira', 'Almeida', 'Lima', 'Pereira', 'Gomes', 'Martins', 'Carvalho', 'Araújo', 'Rocha']
    : ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore'];
  const relationships = region === 'BR'
    ? ['Cônjuge', 'Filho', 'Filha', 'Pai', 'Mãe', 'Irmão', 'Irmã']
    : ['Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Brother', 'Sister'];
  const plans = ['Basic', 'Premium', 'Plus'];

  const generateIdentifier = () => {
    const n = () => Math.floor(Math.random() * 10);
    if (region === 'BR') {
      // CPF format for Brazil
      return `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`;
    } else {
      // SSN format for US
      return `${n()}${n()}${n()}-${n()}${n()}-${n()}${n()}${n()}${n()}`;
    }
  };

  const generatePhone = () => {
    const n = () => Math.floor(Math.random() * 10);
    if (region === 'BR') {
      return `(11) 9${n()}${n()}${n()}${n()}-${n()}${n()}${n()}${n()}`;
    } else {
      return `(${n()}${n()}${n()}) ${n()}${n()}${n()}-${n()}${n()}${n()}${n()}`;
    }
  };

  const generateBirthDate = () => {
    const year = 1950 + Math.floor(Math.random() * 60);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const generateLastVisit = () => {
    const year = 2023 + Math.floor(Math.random() * 2);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const generateFamilyMembers = (id: number) => {
    const numMembers = Math.random() > 0.5 ? Math.floor(Math.random() * 4) : 0;
    const members = [];
    for (let i = 0; i < numMembers; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      members.push({
        id: `${id}-family-${i}`,
        name: `${firstName} ${lastName}`,
        relationship: relationships[Math.floor(Math.random() * relationships.length)],
        photo: null
      });
    }
    return members;
  };

  const generateAllPatients = () => {
    const allPatients = [];

    allPatients.push({
      id: '001',
      name: region === 'BR' ? 'Kroner Costa' : 'Kroner Smith',
      identifier: region === 'BR' ? '123.456.789-00' : '123-45-6789',
      phone: region === 'BR' ? '(11) 98765-4321' : '(555) 123-4567',
      email: 'kroner@email.com',
      birthDate: '1985-05-15',
      lastVisit: '2024-01-15',
      plan: 'Premium',
      familyMembers: [
        { id: '001-family-1', name: region === 'BR' ? 'Ana Costa' : 'Anna Smith', relationship: region === 'BR' ? 'Esposa' : 'Spouse', photo: null },
        { id: '001-family-2', name: region === 'BR' ? 'Pedro Costa' : 'Peter Smith', relationship: region === 'BR' ? 'Filho' : 'Son', photo: null }
      ]
    });

    for (let i = 2; i <= 150; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;

      allPatients.push({
        id: i.toString().padStart(3, '0'),
        name: fullName,
        identifier: generateIdentifier(),
        phone: generatePhone(),
        email: email,
        birthDate: generateBirthDate(),
        lastVisit: generateLastVisit(),
        plan: plans[Math.floor(Math.random() * plans.length)],
        familyMembers: generateFamilyMembers(i)
      });
    }

    return allPatients;
  };

  const allPatients = generateAllPatients();
  const ITEMS_PER_PAGE = 20;

  const loadMorePatients = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    setTimeout(() => {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const newPatients = allPatients.slice(start, end);

      if (newPatients.length > 0) {
        setDisplayedPatients(prev => [...prev, ...newPatients]);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }

      setLoading(false);
    }, 500);
  }, [page, loading, hasMore]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMorePatients();
      }
    }, { threshold: 0.1 });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMorePatients, hasMore, loading]);

  useEffect(() => {
    loadMorePatients();
  }, []);

  // Componente para o link do paciente
  const PatientLink = ({ row }: { row: any }) => {
    const handleClick = () => {
      // Navega diretamente para a página de resumo do paciente com query parameter
      window.location.href = `/patients/summary?id=${row.id}`;
    };

    return (
      <button
        type="button"
        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-all w-full text-left"
        onClick={handleClick}
      >
        <Avatar
          name={row.name}
          size="sm"
          className="bg-krooa-green/20"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
            {row.name}
          </p>
          <p className="text-xs text-gray-500">
            {region === 'BR' ? 'CPF' : 'SSN'}: {row.identifier || row.cpf}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </button>
    );
  };

  // Componente para mostrar membros da família
  const FamilyMembers = ({ members, patientData }: { members: any[]; patientData: any }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setButtonPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + rect.width / 2 + window.scrollX
        });
      }
      setShowTooltip(!showTooltip);
    };

    // Fechar ao clicar fora
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (showTooltip && buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
          setShowTooltip(false);
        }
      };

      if (showTooltip) {
        document.addEventListener('click', handleClickOutside);
      }

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [showTooltip]);

    // Determinar se o paciente é titular ou dependente
    const isMainHolder = members && members.length > 0;
    const patientType = isMainHolder
      ? (region === 'BR' ? 'Titular' : 'Primary')
      : (region === 'BR' ? 'Dependente' : 'Dependent');

    // Se não tem família, não mostrar nada
    if (!members || members.length === 0) {
      return (
        <div className="flex items-center justify-center">
          <span className="text-xs text-gray-400">-</span>
        </div>
      );
    }

    return (
      <>
        <div
          ref={buttonRef}
          className="inline-flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
          onClick={handleClick}
        >
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-sm font-semibold text-blue-600">{members.length}</span>
          </div>
          <span className="text-[10px] text-blue-600 font-medium">{patientType}</span>
        </div>

        {showTooltip && ReactDOM.createPortal(
          <div
            className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-80"
            style={{
              top: `${buttonPosition.top + 10}px`,
              left: `${buttonPosition.left}px`,
              transform: 'translateX(-50%)',
              zIndex: 999999
            }}
          >
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900">
                {region === 'BR' ? 'Grupo Familiar' : 'Family Group'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">Paciente: {patientData.name}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                {region === 'BR' ? 'Membros da Família' : 'Family Members'}
              </p>
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => {
                    setShowTooltip(false);
                    window.location.href = `/patients/summary?id=${member.id}`;
                  }}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.relationship}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-gray-500 text-center">
                Total: {members.length + 1} {region === 'BR' ? 'membros' : 'members'}
              </p>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  };

  const columns = [
    {
      key: 'patient',
      title: 'Paciente',
      render: (_value: any, row: any) => <PatientLink row={row} />
    },
    {
      key: 'family',
      title: 'Família',
      align: 'center' as const,
      width: '100px',
      render: (_value: any, row: any) => <FamilyMembers members={row.familyMembers} patientData={row} />
    },
    {
      key: 'contact',
      title: 'Contato',
      render: (_value: any, row: any) => (
        <div className="text-sm">
          <p>{row.phone}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      )
    },
    {
      key: 'age',
      title: 'Idade',
      align: 'center' as const,
      render: (value: any, row: any) => {
        const age = new Date().getFullYear() - new Date(row.birthDate).getFullYear();
        return <span className="text-sm">{age} anos</span>;
      }
    },
    {
      key: 'lastVisit',
      title: 'Última Consulta',
      render: (_value: any, row: any) => (
        <span className="text-sm">
          {new Date(row.lastVisit).toLocaleDateString('pt-BR')}
        </span>
      )
    },
    {
      key: 'plan',
      title: 'Plano',
      align: 'center' as const,
      render: (_value: any, row: any) => (
        <Badge variant={row.plan === 'Premium' ? 'primary' : 'secondary'}>
          {row.plan}
        </Badge>
      )
    },
    {
      key: 'actions',
      title: 'Ações',
      align: 'center' as const,
      render: (_value: any, row: any) => (
        <div className="flex items-center justify-center">
          <div className="group relative">
            <button className="p-1.5 rounded-lg transition-all bg-gray-100 text-gray-600 hover:bg-gray-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <div
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 rounded-t-lg cursor-pointer"
                onClick={() => console.log('Ver Prontuário:', row.name)}
              >
                Ver Prontuário
              </div>
              <div
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 cursor-pointer"
                onClick={() => console.log('Agendar Consulta:', row.name)}
              >
                Agendar Consulta
              </div>
              <div
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 cursor-pointer"
                onClick={() => console.log('Ver Histórico:', row.name)}
              >
                Ver Histórico
              </div>
              <hr className="my-1" />
              <div
                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded-b-lg cursor-pointer"
                onClick={() => console.log('Inativar:', row.name)}
              >
                Inativar
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const chartTabs = [
    { id: 'geolocation', label: 'Localização' },
    { id: 'gender', label: 'Gênero' },
    { id: 'age', label: 'Idade' },
    { id: 'newPatients', label: 'Novos' },
    { id: 'source', label: 'Origem' }
  ];

  // Componente de Gráfico de Localização
  const GeolocationMap = () => {
    const locations = [
      { id: 1, lat: 30, lng: 20, count: 45, neighborhood: 'Centro' },
      { id: 2, lat: 45, lng: 60, count: 32, neighborhood: 'Jardins' },
      { id: 3, lat: 70, lng: 40, count: 28, neighborhood: 'Vila Mariana' },
      { id: 4, lat: 55, lng: 85, count: 52, neighborhood: 'Moema' },
      { id: 5, lat: 25, lng: 70, count: 18, neighborhood: 'Brooklin' },
      { id: 6, lat: 80, lng: 75, count: 38, neighborhood: 'Itaim Bibi' },
      { id: 7, lat: 40, lng: 35, count: 22, neighborhood: 'Pinheiros' },
      { id: 8, lat: 65, lng: 55, count: 15, neighborhood: 'Vila Olímpia' }
    ];

    const topNeighborhoods = [
      { name: 'Moema', count: 52, percentage: 18 },
      { name: 'Centro', count: 45, percentage: 15 },
      { name: 'Itaim Bibi', count: 38, percentage: 13 },
      { name: 'Jardins', count: 32, percentage: 11 },
      { name: 'Vila Mariana', count: 28, percentage: 9 }
    ];

    return (
      <div className="flex flex-col">
        <h3 className="font-medium mb-4">Localização dos Pacientes</h3>
        <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(10)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full h-px bg-gray-400" style={{ top: `${i * 10}%` }} />
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full w-px bg-gray-400" style={{ left: `${i * 10}%` }} />
            ))}
          </div>
          {locations.map((location) => {
            const size = Math.max(20, Math.min(40, location.count * 0.8));
            return (
              <div
                key={location.id}
                className="absolute group"
                style={{
                  left: `${location.lng}%`,
                  top: `${location.lat}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div
                  className="relative bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white font-semibold text-xs group-hover:bg-blue-600 transition-colors cursor-pointer"
                  style={{ width: `${size}px`, height: `${size}px` }}
                >
                  {location.count}
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {location.neighborhood}: {location.count} pacientes
                  </div>
                </div>
              </div>
            )
          })}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded p-2 text-xs">
            <p className="font-medium mb-1">Legenda</p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Localização de pacientes</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Principais Bairros</p>
          <div className="space-y-1">
            {topNeighborhoods.map((item, index) => (
              <div key={item.name} className="flex items-center text-xs">
                <span className="w-4 text-gray-500">{index + 1}.</span>
                <span className="flex-1 ml-2">{item.name}</span>
                <span className="font-medium">{item.count}</span>
                <span className="text-gray-500 ml-1">({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Distância Média:</span>
            <span className="font-medium">3.2 km</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-gray-600">Cobertura:</span>
            <span className="font-medium">15 bairros</span>
          </div>
        </div>
      </div>
    );
  };

  // Componente de Gráfico de Gênero
  const GenderChart = () => {
    const data = { male: 45, female: 52, other: 3 };
    const total = data.male + data.female + data.other;

    return (
      <div className="flex flex-col">
        <h3 className="font-medium mb-4">Distribuição por Gênero</h3>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EC4899" strokeWidth="20"
                strokeDasharray={`${(data.female / total) * 251.2} 251.2`} strokeDashoffset="0" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="20"
                strokeDasharray={`${(data.male / total) * 251.2} 251.2`} strokeDashoffset={`-${(data.female / total) * 251.2}`} />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="20"
                strokeDasharray={`${(data.other / total) * 251.2} 251.2`} strokeDashoffset={`-${((data.female + data.male) / total) * 251.2}`} />
              <circle cx="50" cy="50" r="30" fill="white" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-semibold">{total}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
              <span className="text-sm">Feminino</span>
            </div>
            <div className="text-sm font-medium">{data.female}% ({Math.round((data.female / total) * 1234)})</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm">Masculino</span>
            </div>
            <div className="text-sm font-medium">{data.male}% ({Math.round((data.male / total) * 1234)})</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">Outro</span>
            </div>
            <div className="text-sm font-medium">{data.other}% ({Math.round((data.other / total) * 1234)})</div>
          </div>
        </div>
      </div>
    );
  };

  // Componente de Gráfico de Idade
  const AgeChart = () => {
    const data = [
      { range: '0-10', count: 85, percentage: 7 },
      { range: '11-20', count: 156, percentage: 13 },
      { range: '21-30', count: 289, percentage: 23 },
      { range: '31-40', count: 245, percentage: 20 },
      { range: '41-50', count: 198, percentage: 16 },
      { range: '51-60', count: 145, percentage: 12 },
      { range: '61-70', count: 78, percentage: 6 },
      { range: '70+', count: 38, percentage: 3 }
    ];
    const maxPercentage = Math.max(...data.map(d => d.percentage));

    return (
      <div className="flex flex-col">
        <h3 className="font-medium mb-4">Distribuição por Idade</h3>
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.range} className="flex items-center">
              <div className="w-16 text-sm text-gray-600">{item.range}</div>
              <div className="flex-1 mx-3">
                <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(item.percentage / maxPercentage) * 100}%` }} />
                </div>
              </div>
              <div className="w-20 text-right">
                <span className="text-sm font-medium">{item.count}</span>
                <span className="text-xs text-gray-500 ml-1">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600">Idade Média</p>
            <p className="text-lg font-semibold">32.5 anos</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Mediana</p>
            <p className="text-lg font-semibold">29 anos</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Mais Novo</p>
            <p className="text-lg font-semibold">6 meses</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Mais Velho</p>
            <p className="text-lg font-semibold">92 anos</p>
          </div>
        </div>
      </div>
    );
  };

  // Componente de Gráfico de Novos Pacientes
  const NewPatientsChart = () => {
    const data = [
      { month: 'Jan', count: 45 }, { month: 'Fev', count: 52 }, { month: 'Mar', count: 68 },
      { month: 'Abr', count: 72 }, { month: 'Mai', count: 85 }, { month: 'Jun', count: 78 },
      { month: 'Jul', count: 92 }, { month: 'Ago', count: 88 }, { month: 'Set', count: 95 },
      { month: 'Out', count: 102 }, { month: 'Nov', count: 98 }, { month: 'Dez', count: 87 }
    ];
    const maxCount = Math.max(...data.map(d => d.count));

    return (
      <div className="flex flex-col">
        <h3 className="font-medium mb-4">Novos Pacientes</h3>
        <div>
          <div className="h-64 flex items-end space-x-2">
            {data.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center">
                <div className="w-full relative flex flex-col items-center">
                  <span className="text-xs font-medium mb-1">{item.count}</span>
                  <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '200px' }}>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500"
                      style={{ height: `${(item.count / maxCount) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className="w-8 h-0.5 bg-green-500 mr-2"></div>
            <span className="text-gray-600">Tendência: </span>
            <span className="font-medium text-green-600 ml-1">+18% de crescimento</span>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600">Este Mês</p>
            <p className="text-lg font-semibold">87</p>
            <p className="text-xs text-green-600">+5% vs mês anterior</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Este Ano</p>
            <p className="text-lg font-semibold">962</p>
            <p className="text-xs text-green-600">+22% vs ano anterior</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Média</p>
            <p className="text-lg font-semibold">80.2/mês</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Melhor Mês</p>
            <p className="text-lg font-semibold">Out (102)</p>
          </div>
        </div>
      </div>
    );
  };

  // Componente de Gráfico de Origem dos Pacientes
  const PatientSourceChart = () => {
    const data = [
      { source: 'Indicação', count: 412, percentage: 33, color: 'bg-blue-500' },
      { source: 'Online', count: 287, percentage: 23, color: 'bg-green-500' },
      { source: 'Redes Sociais', count: 198, percentage: 16, color: 'bg-purple-500' },
      { source: 'Convênio', count: 149, percentage: 12, color: 'bg-yellow-500' },
      { source: 'Demanda Espontânea', count: 99, percentage: 8, color: 'bg-orange-500' },
      { source: 'Publicidade', count: 62, percentage: 5, color: 'bg-pink-500' },
      { source: 'Outros', count: 37, percentage: 3, color: 'bg-gray-500' }
    ];

    return (
      <div className="flex flex-col">
        <h3 className="font-medium mb-4">Origem dos Pacientes</h3>
        <div className="mb-6">
          <div className="h-12 flex rounded-lg overflow-hidden shadow-inner bg-gray-100">
            {data.map((item) => (
              <div key={item.source} className={`${item.color} relative group transition-all duration-300 hover:opacity-90`}
                style={{ width: `${item.percentage}%` }}>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {item.source}: {item.count} ({item.percentage}%)
                  </div>
                </div>
                {item.percentage > 5 && (
                  <div className="h-full flex items-center justify-center text-white text-xs font-medium">
                    {item.percentage}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.source} className="flex items-center">
              <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
              <span className="flex-1 text-sm">{item.source}</span>
              <span className="text-sm font-medium">{item.count}</span>
              <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs font-medium mb-2">Insights</p>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-green-500 text-xs mr-2">↑</span>
              <p className="text-xs text-gray-600">Indicações cresceram 15% este mês</p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 text-xs mr-2">•</span>
              <p className="text-xs text-gray-600">Taxa de conversão online: 35%</p>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-500 text-xs mr-2">!</span>
              <p className="text-xs text-gray-600">Potencial de crescimento em redes sociais</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch(activeChart) {
      case 'gender': return <GenderChart />;
      case 'age': return <AgeChart />;
      case 'newPatients': return <NewPatientsChart />;
      case 'geolocation': return <GeolocationMap />;
      case 'source': return <PatientSourceChart />;
      default: return <GeolocationMap />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Painel de Gráficos Demográficos - Responsivo */}
      <div className="hidden lg:block lg:w-1/3 xl:w-2/5 border-r bg-gray-50 overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Análise Demográfica</h2>
            <p className="text-sm text-gray-600">Visualize dados e tendências dos pacientes</p>
          </div>

          {/* Tabs para alternar entre gráficos */}
          <div className="mb-6">
            <div className="flex gap-2 flex-wrap">
              {chartTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveChart(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeChart === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Área do gráfico */}
          <Card className="p-6">
            <div className="min-h-[400px]">
              {renderChart()}
            </div>
          </Card>

          {/* Cards de resumo rápido */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Card className="p-3 relative group cursor-help">
              <div className="flex items-start justify-between">
                <p className="text-xs text-gray-600">Atendimentos do Mês</p>
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xl font-semibold">1,234</p>
              <p className="text-xs text-green-600">+12% vs mês anterior</p>
              <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 w-48">
                Total de pacientes atendidos no mês atual comparado com o mês anterior
              </div>
            </Card>

            <Card className="p-3 relative group cursor-help">
              <div className="flex items-start justify-between">
                <p className="text-xs text-gray-600">Novos Cadastros</p>
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xl font-semibold">87</p>
              <p className="text-xs text-green-600">+5% esta semana</p>
              <div className="absolute bottom-full right-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 w-48">
                Novos pacientes cadastrados nos últimos 7 dias
              </div>
            </Card>

            <Card className="p-3 relative group cursor-help">
              <div className="flex items-start justify-between">
                <p className="text-xs text-gray-600">Pacientes Ativos</p>
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xl font-semibold">892</p>
              <p className="text-xs text-gray-600">Últimos 90 dias</p>
              <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 w-48">
                Pacientes que tiveram pelo menos uma consulta nos últimos 90 dias
              </div>
            </Card>

            <Card className="p-3 relative group cursor-help">
              <div className="flex items-start justify-between">
                <p className="text-xs text-gray-600">Taxa de Retorno</p>
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xl font-semibold">78%</p>
              <p className="text-xs text-blue-600">Pacientes recorrentes</p>
              <div className="absolute bottom-full right-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 w-48">
                Percentual de pacientes que retornaram para uma segunda consulta ou mais
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal - Lista de Pacientes */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="h-full flex flex-col">
          {/* Header fixo no topo */}
          <div className="px-6 py-4 border-b bg-white">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Lista de Pacientes</h2>
              <div className="flex items-center gap-2">
                {/* Filtros */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                    title="Filtros"
                  >
                    <FilterIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Exportar */}
                <button
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                  title="Exportar"
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* Novo Paciente */}
                <Button variant="primary" size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Paciente
                </Button>
              </div>
            </div>
          </div>

          {/* Tabela com scroll infinito */}
          <div className="flex-1 overflow-auto px-6 py-6">
            <Table
              columns={columns}
              data={displayedPatients}
            />

            {/* Trigger para carregar mais */}
            <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
              {loading && (
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Carregando mais pacientes...</span>
                </div>
              )}
              {!hasMore && displayedPatients.length > 0 && (
                <p className="text-gray-500 text-sm">Todos os pacientes foram carregados</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsPage;
