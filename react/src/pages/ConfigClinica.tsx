import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Clock, ChevronDown, X, GripVertical, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, EmailInput, PhoneInput, CPFInput } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Switch } from '../components/ui/Switch';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { SubMenu } from '../components/ui/SubMenu';
import { useClinic } from '../contexts/ClinicContext';
import { MultiSelect } from '../components/ui/MultiSelect';
import { useRegion } from '../contexts/RegionContext';

interface Professional {
  id: string;
  name: string;
  duration: number;
  email?: string;
}

interface Slot {
  id: string;
  time: string;
  date?: string | string[];
  professionals: Professional[];
}

interface Chair {
  id: number;
  name: string;
  order: number;
  slots: {
    [day: string]: Slot[];
  };
  metrics: {
    weeklyAppointments: number;
    availableSlots: number;
    status: 'good' | 'warning' | 'critical' | 'no-data';
  };
}

const ConfigClinica: React.FC = () => {
  const { multiplasUnidadesEnabled, setMultiplasUnidadesEnabled, centroCustoEnabled, setCentroCustoEnabled } = useClinic();
  const { currentRegion, setRegion, config, formatCurrency } = useRegion();
  const [activeTab, setActiveTab] = useState('conta');
  const [pessoaJuridica, setPessoaJuridica] = useState(true);
  const [editingUnit, setEditingUnit] = useState<number | null>(null);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);

  // Opções para os MultiSelects
  const centralOptions = [
    { value: 'central1', label: 'Central 1' },
    { value: 'central2', label: 'Central 2' },
    { value: 'central3', label: 'Central 3' },
    { value: 'central4', label: 'Central 4' }
  ];

  const centroCustoOptions = [
    { value: 'cc001', label: 'CC 001' },
    { value: 'cc002', label: 'CC 002' },
    { value: 'cc003', label: 'CC 003' },
    { value: 'cc004', label: 'CC 004' }
  ];

  const colaboradoresOptions = [
    { value: '1', label: 'Dr. João Silva' },
    { value: '2', label: 'Dra. Maria Santos' },
    { value: '3', label: 'Dr. Pedro Costa' },
    { value: '4', label: 'Dra. Ana Lima' }
  ];

  // Estados para Parâmetros
  const [monitorarTempoEspera, setMonitorarTempoEspera] = useState(true);
  const [identificarConflitos, setIdentificarConflitos] = useState(true);
  const [identificarDesmarcos, setIdentificarDesmarcos] = useState(false);

  // Estados para Cadeiras
  const [chairs, setChairs] = useState<Chair[]>([
    {
      id: 1,
      name: 'CONSULT. 1',
      order: 1,
      slots: {
        ter: [
          { id: '1-ter-1', time: '08:00-12:00', professionals: [
            { id: '1', name: 'Dr. João Silva', duration: 30 },
            { id: '2', name: 'Dra. Maria Santos', duration: 45 }
          ]},
          { id: '1-ter-2', time: '14:00-18:00', date: ['07/01', '21/01'], professionals: [
            { id: '1', name: 'Dr. João Silva', duration: 30 }
          ]}
        ],
        qui: [
          { id: '1-qui-1', time: '07:00-12:00', professionals: [
            { id: '3', name: 'Dr. Pedro Costa', duration: 60 }
          ]}
        ],
        sab: [
          { id: '1-sab-1', time: '08:00-12:00', date: ['11/01', '25/01'], professionals: [
            { id: '2', name: 'Dra. Maria Santos', duration: 45 }
          ]}
        ]
      },
      metrics: {
        weeklyAppointments: 24,
        availableSlots: 28,
        status: 'good'
      }
    },
    {
      id: 2,
      name: 'CONSULT. 2',
      order: 2,
      slots: {
        ter: [
          { id: '2-ter-1', time: '07:00-17:15', date: '30/09', professionals: [
            { id: '4', name: 'Dr. Carlos Lima', duration: 30 }
          ]}
        ]
      },
      metrics: {
        weeklyAppointments: 8,
        availableSlots: 20,
        status: 'warning'
      }
    }
  ]);

  // Estados do aside e drag and drop
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [editingChair, setEditingChair] = useState<any>({});
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isProfessionalsDropdownOpen, setIsProfessionalsDropdownOpen] = useState(false);
  const [hasSpecificDates, setHasSpecificDates] = useState(false);
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(true);

  // Centro de Custo states
  const [editingCostCenter, setEditingCostCenter] = useState<number | null>(null);
  const [costCenters, setCostCenters] = useState<any[]>([
    {
      id: 1,
      name: 'Centro de Custo Principal',
      description: 'Centro de custo padrão do sistema',
      isMaster: true,
      registrosVinculados: 89
    }
  ]);

  // Modal states
  const [deleteUnitModal, setDeleteUnitModal] = useState<{open: boolean, targetUnitId: number | null, sourceUnitId: number | null}>({open: false, targetUnitId: null, sourceUnitId: null});
  const [deleteCostCenterModal, setDeleteCostCenterModal] = useState<{open: boolean, targetCostCenterId: number | null, sourceCostCenterId: number | null}>({open: false, targetCostCenterId: null, sourceCostCenterId: null});
  const [deleteChairModal, setDeleteChairModal] = useState<{open: boolean, targetChairId: number | null}>({open: false, targetChairId: null});

  // Header states
  const [selectedTimezone, setSelectedTimezone] = useState('São Paulo - Brasília');
  const [currentTime, setCurrentTime] = useState('--:--');
  const [selectedLanguage, setSelectedLanguage] = useState('PT');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [timezoneDropdownOpen, setTimezoneDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const timezoneDropdownRef = useRef<HTMLDivElement>(null);
  const regionDropdownRef = useRef<HTMLDivElement>(null);

  // Form data
  const [formData, setFormData] = useState({
    companyName: 'Studio Dental',
    email: 'kronercosta@gmail.com',
    responsibleName: 'Kroner Machado Costa',
    responsibleDocument: '',
    phone: '',
    street: 'Rua 5',
    number: '691',
    complement: 'Loja 01 - Térreo',
    neighborhood: 'St. Oeste',
    city: 'Goiânia',
    state: 'GO',
    zipCode: '74115060',
    legalName: 'Arantes Comércio de Higiene Oral',
    taxId: '',
    masterUser: '',
  });

  const [unidades, setUnidades] = useState<any[]>([
    {
      id: 1,
      titulo: 'Unidade Principal',
      centralComunicacao: [],
      centroCusto: [],
      colaboradores: [],
      isMaster: true,
      registrosVinculados: 127 // Exemplo de registros vinculados
    }
  ]);

  const tabItems = [
    { id: 'conta', label: 'Conta' },
    { id: 'cadeiras', label: currentRegion === 'BR' ? 'Cadeiras' : 'Chairs' },
    ...(config.features.centroCusto ? [{ id: 'centro-custo', label: 'Centro de Custo' }] : []),
    { id: 'parametros', label: 'Parâmetros' }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const timezones = [
    { name: 'Fernando de Noronha', code: 'UTC-02:00' },
    { name: 'São Paulo - Brasília', code: 'UTC-03:00' },
    { name: 'Fortaleza - Salvador', code: 'UTC-03:00' },
    { name: 'Recife - Natal', code: 'UTC-03:00' },
    { name: 'Belém - São Luís', code: 'UTC-03:00' },
    { name: 'Manaus - Amazonas', code: 'UTC-04:00' },
    { name: 'Campo Grande - MT do Sul', code: 'UTC-04:00' },
    { name: 'Cuiabá - Mato Grosso', code: 'UTC-04:00' },
    { name: 'Porto Velho - Rondônia', code: 'UTC-04:00' },
    { name: 'Boa Vista - Roraima', code: 'UTC-04:00' },
    { name: 'Rio Branco - Acre', code: 'UTC-05:00' }
  ];

  const languages = [
    { code: 'PT', name: 'Português', flag: '🇧🇷' },
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'ES', name: 'Español', flag: '🇪🇸' }
  ];

  // Mock professionals list - in production this would come from API
  const professionals = [
    { id: '1', name: 'Dr. João Silva', duration: 30, email: 'joao.silva@clinica.com' },
    { id: '2', name: 'Dra. Maria Santos', duration: 45, email: 'maria.santos@clinica.com' },
    { id: '3', name: 'Dr. Pedro Costa', duration: 60, email: 'pedro.costa@clinica.com' },
    { id: '4', name: 'Dr. Carlos Lima', duration: 30, email: 'carlos.lima@clinica.com' },
    { id: '5', name: 'Dra. Ana Oliveira', duration: 40, email: 'ana.oliveira@clinica.com' }
  ];

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo'
      });
      setCurrentTime(timeString);
    };

    updateTime(); // Atualiza imediatamente
    const interval = setInterval(updateTime, 1000); // Atualiza a cada segundo para teste
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
      if (timezoneDropdownRef.current && !timezoneDropdownRef.current.contains(event.target as Node)) {
        setTimezoneDropdownOpen(false);
      }
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target as Node)) {
        setRegionDropdownOpen(false);
      }
    }

    if (languageDropdownOpen || timezoneDropdownOpen || regionDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [languageDropdownOpen, timezoneDropdownOpen, regionDropdownOpen]);

  // Drag and Drop functions
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));

    if (dragIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }

    const newChairs = [...chairs];
    const draggedChair = newChairs[dragIndex];

    // Remove dragged chair and insert at new position
    newChairs.splice(dragIndex, 1);
    newChairs.splice(dropIndex, 0, draggedChair);

    // Update order numbers
    newChairs.forEach((chair, index) => {
      chair.order = index + 1;
    });

    setChairs(newChairs);
    setDragOverIndex(null);
  };

  // Aside functions
  const openAside = (chairId?: number) => {
    if (chairId) {
      const chair = chairs.find(c => c.id === chairId);
      if (chair) {
        setEditingChair({
          id: chair.id,
          name: chair.name,
          selectedDays: [],
          startTime: '',
          endTime: '',
          duration: '',
          selectedProfessionals: [],
          specificDates: []
        });
      }
    } else {
      setEditingChair({
        name: '',
        selectedDays: [],
        startTime: '',
        endTime: '',
        duration: '',
        selectedProfessionals: [],
        specificDates: []
      });
    }
    setHasSpecificDates(false);
    setIsAsideOpen(true);
  };

  const closeAside = () => {
    setIsAsideOpen(false);
    setEditingChair({});
  };

  const saveChair = () => {
    if (!editingChair.name?.trim()) {
      alert('Por favor, preencha o nome da cadeira');
      return;
    }

    if (editingChair.id) {
      // Update existing chair
      setChairs(chairs.map((chair: any) => {
        if (chair.id === editingChair.id) {
          return { ...chair, name: editingChair.name };
        }
        return chair;
      }));
    } else {
      // Add new chair
      const newChair: Chair = {
        id: Date.now(),
        name: editingChair.name,
        order: chairs.length + 1,
        slots: {},
        metrics: {
          weeklyAppointments: 0,
          availableSlots: 0,
          status: 'no-data'
        }
      };
      setChairs([...chairs, newChair]);
    }

    closeAside();
  };

  const deleteChair = (chairId: number) => {
    if (chairs.length <= 1) {
      alert('Deve haver pelo menos uma cadeira');
      return;
    }

    setDeleteChairModal({ open: true, targetChairId: chairId });
  };

  const confirmDeleteChair = () => {
    if (deleteChairModal.targetChairId) {
      const remainingChairs = chairs.filter((chair: any) => chair.id !== deleteChairModal.targetChairId);
      remainingChairs.forEach((chair, index) => {
        chair.order = index + 1;
      });
      setChairs(remainingChairs);
      setDeleteChairModal({ open: false, targetChairId: null });
    }
  };

  const editSlot = (chairId: number) => {
    const chair = chairs.find(c => c.id === chairId);
    if (chair) {
      openAside(chairId);
    }
  };

  const getDayAbbreviation = (day: string) => {
    const days: { [key: string]: string } = {
      seg: 'Segunda',
      ter: 'Terça',
      qua: 'Quarta',
      qui: 'Quinta',
      sex: 'Sexta',
      sab: 'Sábado',
      dom: 'Domingo'
    };
    return days[day] || day;
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'good':
        return (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Adequada</span>
          </div>
        );
      case 'warning':
        return (
          <div className="flex items-center gap-1 text-yellow-600 text-xs">
            <TrendingDown className="w-3 h-3" />
            <span>Diminuir</span>
          </div>
        );
      case 'critical':
        return (
          <div className="flex items-center gap-1 text-red-600 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>Aumentar</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Minus className="w-3 h-3" />
            <span>Sem dados</span>
          </div>
        );
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    if (newLanguage !== selectedLanguage) {
      setSelectedLanguage(newLanguage);
      setLanguageDropdownOpen(false);
      // Aqui podemos adicionar lógica para mudar textos, formatos, etc.
      // Exemplo: i18n.changeLanguage(newLanguage);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">


      {/* Page Header */}
      <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-krooa-dark">Configurações da Clínica</h1>
            <p className="text-sm text-gray-600 mt-1 hidden sm:block">Gerencie as informações e configurações da sua clínica</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Timezone selector */}
            <div className="relative flex-1 sm:flex-initial" ref={timezoneDropdownRef}>
              <button
                onClick={() => setTimezoneDropdownOpen(!timezoneDropdownOpen)}
                className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs sm:text-sm font-medium h-[34px] w-full sm:w-auto"
                title="Alterar fuso horário"
              >
                <Clock className="w-4 h-4" />
                <span>{currentTime}</span>
                <span className="text-xs text-gray-600 hidden sm:inline">
                  {timezones.find(tz => tz.name === selectedTimezone)?.code || 'SP/BR'}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${timezoneDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {timezoneDropdownOpen && (
                <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-600">Fuso Horário</h3>
                    <p className="text-xs text-gray-500 mt-1">Selecione o fuso horário da clínica</p>
                  </div>
                  {timezones.map((timezone) => (
                    <button
                      key={timezone.name}
                      onClick={() => {
                        setSelectedTimezone(timezone.name);
                        setTimezoneDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center justify-between ${
                        selectedTimezone === timezone.name
                          ? 'bg-krooa-green/10 text-krooa-dark font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      <span>{timezone.name}</span>
                      <span className="text-xs text-gray-500">{timezone.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Region selector */}
            <div className="relative" ref={regionDropdownRef}>
              <button
                onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
                className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs sm:text-sm font-medium h-[34px]"
                title="Alterar região"
              >
                <span className="text-base">{currentRegion === 'BR' ? '🇧🇷' : '🇺🇸'}</span>
                <span className="hidden sm:inline">{currentRegion}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${regionDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {regionDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-600">Região</h3>
                    <p className="text-xs text-gray-500 mt-1">Selecione a região da clínica</p>
                  </div>
                  <button
                    onClick={() => {
                      setRegion('BR');
                      setRegionDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 ${
                      currentRegion === 'BR' ? 'bg-krooa-green/10 text-krooa-dark font-medium' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">🇧🇷</span>
                    <div className="flex-1">
                      <div>Brasil</div>
                      <div className="text-xs text-gray-500">Moeda: {formatCurrency(0).split(' ')[0]}</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setRegion('US');
                      setRegionDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 ${
                      currentRegion === 'US' ? 'bg-krooa-green/10 text-krooa-dark font-medium' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">🇺🇸</span>
                    <div className="flex-1">
                      <div>United States</div>
                      <div className="text-xs text-gray-500">Currency: {formatCurrency(0).split(' ')[0]}</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Language selector */}
            <div className="relative flex-1 sm:flex-initial" ref={languageDropdownRef}>
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs sm:text-sm font-medium h-[34px] w-full sm:w-auto"
                title="Alterar região e idioma"
              >
                <span className="text-lg">{languages.find(lang => lang.code === selectedLanguage)?.flag}</span>
                <span className="hidden sm:inline">{selectedLanguage}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {languageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-600">Região e Idioma</h3>
                    <p className="text-xs text-gray-500 mt-1">Altera idioma, moeda e formatos</p>
                  </div>
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 ${
                        selectedLanguage === language.code
                          ? 'bg-krooa-green/10 text-krooa-dark font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span>{language.name}</span>
                      {selectedLanguage === language.code && (
                        <span className="ml-auto text-krooa-green text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs using SubMenu component */}
      <div className="flex-shrink-0">
        <SubMenu
          items={tabItems}
          activeItem={activeTab}
          onItemClick={handleTabChange}
          variant="default"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4">
        {/* Dados da Conta */}
        {activeTab === 'conta' && (
          <div className="space-y-6">
            {/* Dados da Conta Section */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Conta</h2>
                <Button>Salvar</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Nome Empresa"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Digite o nome da empresa"
                />

                <EmailInput
                  label="E-mail"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                />

                <Input
                  label="Nome do Responsável"
                  value={formData.responsibleName}
                  onChange={(e) => setFormData({ ...formData, responsibleName: e.target.value })}
                  placeholder="Nome completo"
                />

                {currentRegion === 'BR' ? (
                  <CPFInput
                    label="CPF do Responsável"
                    value={formData.responsibleDocument}
                    onChange={(value) => setFormData({ ...formData, responsibleDocument: value })}
                  />
                ) : (
                  <Input
                    label="SSN"
                    value={formData.responsibleDocument}
                    onChange={(e) => setFormData({ ...formData, responsibleDocument: e.target.value })}
                    placeholder="XXX-XX-XXXX"
                  />
                )}

                <PhoneInput
                  label="Telefone"
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                />

                <div>
                  <Select
                    label="Usuário Master"
                    value={formData.masterUser || ''}
                    onChange={(e) => setFormData({ ...formData, masterUser: e.target.value })}
                    options={[
                      { value: '', label: 'Selecione o usuário master' },
                      ...professionals.map(prof => ({
                        value: prof.id,
                        label: `${prof.name} - ${prof.email}`
                      }))
                    ]}
                  />
                  <p className="text-xs text-gray-500 mt-1">O usuário master tem acesso total ao sistema</p>
                </div>
              </div>

              {/* Pessoa Jurídica Toggle */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">Pessoa Jurídica</h3>
                    <p className="text-sm text-gray-500">Habilite para adicionar dados da empresa</p>
                  </div>
                  <Switch
                    checked={pessoaJuridica}
                    onChange={setPessoaJuridica}
                  />
                </div>

                {pessoaJuridica && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Razão Social"
                      value={formData.legalName}
                      onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                      placeholder="Nome da empresa"
                    />

                    <Input
                      label={currentRegion === 'BR' ? 'CNPJ' : 'EIN'}
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      placeholder={currentRegion === 'BR' ? '00.000.000/0000-00' : 'XX-XXXXXXX'}
                    />
                  </div>
                )}
              </div>

              {/* Múltiplas Unidades Toggle */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">Múltiplas Unidades</h3>
                    <p className="text-sm text-gray-500">Gerencie múltiplas unidades da sua clínica</p>
                  </div>
                  <Switch
                    checked={multiplasUnidadesEnabled}
                    onChange={setMultiplasUnidadesEnabled}
                  />
                </div>
              </div>
            </Card>

            {/* Unidades Section */}
            {multiplasUnidadesEnabled && (
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Unidades</h2>
                  <Button
                    onClick={() => setUnidades([...unidades, {
                      id: Date.now(),
                      titulo: 'Nova Unidade',
                      centralComunicacao: [],
                      centroCusto: [],
                      colaboradores: []
                    }])}
                    variant="primary"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Nova Unidade
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider first:rounded-tl-lg bg-gray-50">
                          Título
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                          Central de Comunicação
                        </th>
                        {config.features.centroCusto && (
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                            Centro de Custo
                          </th>
                        )}
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                          Colaboradores
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider last:rounded-tr-lg bg-gray-50">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {unidades.map((unidade) => (
                        <tr key={unidade.id} className="hover:bg-gray-50">
                          <td className="py-2.5 px-4 text-sm text-gray-900">
                            {editingUnit === unidade.id ? (
                              <Input
                                value={unidade.titulo}
                                onChange={(e) => {
                                  const newUnidades = unidades.map((u: any) =>
                                    u.id === unidade.id ? {...u, titulo: e.target.value} : u
                                  );
                                  setUnidades(newUnidades);
                                }}
                                className="w-full py-1"
                              />
                            ) : (
                              unidade.titulo
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-sm text-gray-900">
                            {editingUnit === unidade.id ? (
                              <MultiSelect
                                options={centralOptions}
                                value={unidade.centralComunicacao}
                                onChange={(values) => {
                                  const newUnidades = unidades.map((u: any) =>
                                    u.id === unidade.id ? {...u, centralComunicacao: values} : u
                                  );
                                  setUnidades(newUnidades);
                                }}
                                placeholder="Selecione as centrais"
                                multiple={true}
                              />
                            ) : (
                              unidade.centralComunicacao.map((c: any) =>
                                centralOptions.find(opt => opt.value === c)?.label
                              ).join(', ')
                            )}
                          </td>
                          {config.features.centroCusto && (
                            <td className="py-2.5 px-4 text-sm text-gray-900">
                              {editingUnit === unidade.id ? (
                                <MultiSelect
                                  options={centroCustoOptions}
                                  value={unidade.centroCusto}
                                  onChange={(values) => {
                                    const newUnidades = unidades.map((u: any) =>
                                      u.id === unidade.id ? {...u, centroCusto: values} : u
                                    );
                                    setUnidades(newUnidades);
                                  }}
                                  placeholder="Selecione os centros"
                                  multiple={true}
                                />
                              ) : (
                                unidade.centroCusto.map((c: any) =>
                                  centroCustoOptions.find(opt => opt.value === c)?.label
                                ).join(', ')
                              )}
                            </td>
                          )}
                          <td className="py-2.5 px-4 text-sm text-gray-900">
                            {editingUnit === unidade.id ? (
                              <MultiSelect
                                options={colaboradoresOptions}
                                value={unidade.colaboradores}
                                onChange={(values) => {
                                  const newUnidades = unidades.map((u: any) =>
                                    u.id === unidade.id ? {...u, colaboradores: values} : u
                                  );
                                  setUnidades(newUnidades);
                                }}
                                placeholder="Selecione colaboradores"
                                multiple={true}
                              />
                            ) : (
                              unidade.colaboradores.length > 0
                                ? unidade.colaboradores.map((c: any) =>
                                    colaboradoresOptions.find(opt => opt.value === c)?.label
                                  ).join(', ')
                                : '-'
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  if (editingUnit === unidade.id) {
                                    setEditingUnit(null);
                                  } else {
                                    setEditingUnit(unidade.id);
                                  }
                                }}
                                className={`p-1.5 rounded-lg transition-all ${
                                  editingUnit === unidade.id
                                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                title={editingUnit === unidade.id ? "Salvar" : "Editar"}
                              >
                                {editingUnit === unidade.id ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  if (unidades.length > 1 && !unidade.isMaster) {
                                    setDeleteUnitModal({ open: true, sourceUnitId: unidade.id, targetUnitId: null });
                                  }
                                }}
                                className={`p-1.5 rounded-lg transition-all ${
                                  unidade.isMaster
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                }`}
                                title={unidade.isMaster ? 'Unidade principal não pode ser excluída' : 'Excluir'}
                                disabled={unidade.isMaster}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Parâmetros */}
        {activeTab === 'parametros' && (
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Parâmetros</h2>

            <div className="space-y-4">
              {/* Monitorar tempo de espera */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Monitorar tempo de espera</h3>
                  <p className="text-sm text-gray-500">Acompanha o tempo que os pacientes aguardam</p>
                </div>
                <Switch
                  checked={monitorarTempoEspera}
                  onChange={setMonitorarTempoEspera}
                />
              </div>

              {/* Identificar conflitos de agenda */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Identificar conflitos de agenda</h3>
                  <p className="text-sm text-gray-500">Detecta agendamentos sobrepostos</p>
                </div>
                <Switch
                  checked={identificarConflitos}
                  onChange={setIdentificarConflitos}
                />
              </div>

              {/* Identificar pacientes que desmarcos */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Identificar pacientes que desmarcos</h3>
                  <p className="text-sm text-gray-500">Rastreia cancelamentos frequentes</p>
                </div>
                <Switch
                  checked={identificarDesmarcos}
                  onChange={setIdentificarDesmarcos}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Cadeiras */}
        {activeTab === 'cadeiras' && (
          <>
            {/* Status da Configuração */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Status da Configuração</h3>
                  <p className="text-sm text-gray-600">Baseado nos agendamentos das últimas 4 semanas</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">Adequada</p>
                  <p className="text-xs text-gray-500">2 cadeiras analisadas</p>
                </div>
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
                  className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-5 h-5 text-blue-600 mr-2">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Análise dos Dados</h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isAnalysisExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {isAnalysisExpanded && (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-xs">⚠️</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">CONSULT. 2 com baixa utilização</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Baseado nos agendamentos das últimas 4 semanas: <strong>8 agendamentos/semana</strong> para <strong>20 slots disponíveis</strong> (40% de ocupação).
                        </p>
                        <p className="text-sm font-medium text-orange-700">💡 Sugestão: Considere reduzir os horários disponíveis desta cadeira.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Card>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Configuração de Cadeiras</h2>
                <p className="text-sm text-gray-600 mt-1">Configure horários e profissionais para cada cadeira</p>
              </div>
              <Button onClick={() => openAside()} variant="primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nova Cadeira
              </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider first:rounded-tl-lg bg-gray-50">
                      Ordem
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                      Seg
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                      Ter
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                      Qua
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                      Qui
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                      Sex
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                      Sáb
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50 last:rounded-tr-lg">
                      Dom
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {chairs.map((chair, index) => {
                    const days = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
                    return (
                      <tr
                        key={chair.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`hover:bg-gray-50 transition-all ${
                          dragOverIndex === index ? 'bg-green-50 border-l-4 border-krooa-green' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            <span className="font-medium">{chair.order}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{chair.name}</span>
                            {getStatusIndicator(chair.metrics.status)}
                          </div>
                        </td>
                        {days.map((day) => (
                          <td key={day} className="px-2 py-3 text-center">
                            <div className="space-y-1.5 flex flex-col items-center">
                              {chair.slots[day]?.map((slot) => {
                                // Count professionals for this slot (simulated - you can adjust based on actual data structure)
                                const professionalCount = slot.professionals?.length || (slot.date && Array.isArray(slot.date) ? slot.date.length : 1);

                                const hasDate = slot.date && !Array.isArray(slot.date);

                                return (
                                  <div
                                    key={slot.id}
                                    onClick={() => editSlot(chair.id)}
                                    className={`relative inline-flex flex-col items-start justify-center min-w-[70px] px-2 py-1.5 rounded-md cursor-pointer transition-all border hover:shadow-sm ${
                                      hasDate
                                        ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                                        : 'bg-krooa-green/10 border-krooa-green/30 hover:bg-krooa-green/20 hover:border-krooa-green/50'
                                    }`}
                                  >
                                    {/* Professional count indicator */}
                                    {professionalCount > 1 && (
                                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-krooa-green rounded-full flex items-center justify-center">
                                        <span className="text-[10px] text-krooa-dark font-bold">{professionalCount}</span>
                                      </div>
                                    )}

                                    <div className="text-xs font-semibold text-krooa-dark">{slot.time}</div>
                                    {hasDate && (
                                      <div className="text-xs font-semibold text-krooa-dark">
                                        {slot.date}/2024
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          </>
        )}

        {/* Centro de Custo */}
        {activeTab === 'centro-custo' && (
          <div className="space-y-6">
            {/* Toggle Section */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Centro de Custo</h3>
                  <p className="text-sm text-gray-500">Habilite para organizar receitas e despesas por centro</p>
                </div>
                <Switch
                  checked={centroCustoEnabled}
                  onChange={setCentroCustoEnabled}
                />
              </div>
            </Card>

            {/* Cost Centers List */}
            {centroCustoEnabled && (
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Centros de Custo</h2>
                  <Button
                    onClick={() => setCostCenters([...costCenters, {
                      id: Date.now(),
                      name: 'Novo Centro',
                      description: 'Descrição do centro'
                    }])}
                    variant="primary"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Novo Centro
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider first:rounded-tl-lg bg-gray-50">
                          Nome
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider bg-gray-50">
                          Descrição
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider last:rounded-tr-lg bg-gray-50">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {costCenters.map((center) => (
                        <tr key={center.id} className="hover:bg-gray-50">
                          <td className="py-2.5 px-4 text-sm text-gray-900">
                            {editingCostCenter === center.id ? (
                              <Input
                                value={center.name}
                                onChange={(e) => {
                                  const newCenters = costCenters.map((c: any) =>
                                    c.id === center.id ? {...c, name: e.target.value} : c
                                  );
                                  setCostCenters(newCenters);
                                }}
                                className="w-full py-1"
                              />
                            ) : (
                              center.name
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-sm text-gray-900">
                            {editingCostCenter === center.id ? (
                              <Input
                                value={center.description}
                                onChange={(e) => {
                                  const newCenters = costCenters.map((c: any) =>
                                    c.id === center.id ? {...c, description: e.target.value} : c
                                  );
                                  setCostCenters(newCenters);
                                }}
                                className="w-full py-1"
                              />
                            ) : (
                              center.description
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  if (editingCostCenter === center.id) {
                                    setEditingCostCenter(null);
                                  } else {
                                    setEditingCostCenter(center.id);
                                  }
                                }}
                                className={`p-1.5 rounded-lg transition-all ${
                                  editingCostCenter === center.id
                                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                title={editingCostCenter === center.id ? "Salvar" : "Editar"}
                              >
                                {editingCostCenter === center.id ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  if (costCenters.length > 1) {
                                    setDeleteCostCenterModal({ open: true, sourceCostCenterId: center.id, targetCostCenterId: null });
                                  }
                                }}
                                className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-all"
                                title="Excluir"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Aside Panel for Chair Configuration */}
      {isAsideOpen && (
        <>
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40" onClick={closeAside}></div>
          <div className="fixed right-0 top-0 h-full w-full sm:w-[500px] lg:w-[600px] xl:w-[700px] 2xl:w-[880px] max-w-full sm:max-w-[880px] bg-white/95 backdrop-blur-md shadow-2xl z-50 transform transition-all duration-300 ease-in-out sm:border-l border-gray-100">
            <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
              {/* Botão X à esquerda */}
              <button
                onClick={closeAside}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-white/50 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Título centralizado */}
              <h2 className="text-xl font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">
                {editingChair.id ? 'Editar Cadeira' : 'Nova Cadeira'}
              </h2>

              {/* Botões à direita */}
              <div className="flex items-center gap-2">
                {editingChair.id && (
                  <button
                    onClick={() => deleteChair(editingChair.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Excluir Cadeira"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <Button
                  onClick={saveChair}
                  variant="primary"
                >
                  Salvar
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 overflow-y-auto h-[calc(100%-64px)]">
              {/* Nome da Cadeira */}
              <div>
                <div className="relative">
                  <input
                    type="text"
                    value={editingChair.name || ''}
                    onChange={(e) => setEditingChair({ ...editingChair, name: e.target.value })}
                    className="peer w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20 placeholder-transparent"
                    placeholder="Nome da Cadeira"
                    id="chairName"
                  />
                  <label
                    htmlFor="chairName"
                    className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Nome da Cadeira
                  </label>
                </div>
              </div>

              {/* Seção de Configurar Horários */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Configurar Horários</h3>

                {/* Toggle de Datas Específicas */}
                <div className="mb-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Datas Específicas</label>
                      <p className="text-xs text-gray-600">Configurar para datas específicas ao invés de dias da semana</p>
                    </div>
                    <Switch
                      checked={hasSpecificDates}
                      onChange={setHasSpecificDates}
                    />
                  </div>
                </div>

                {/* Days of Week Selection */}
                {!hasSpecificDates ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dias da Semana</label>
                    <div className="flex gap-2">
                      {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map((day) => (
                        <button
                          key={day}
                          onClick={() => {
                            const selected = editingChair.selectedDays || [];
                            if (selected.includes(day)) {
                              setEditingChair({
                                ...editingChair,
                                selectedDays: selected.filter((d: string) => d !== day)
                              });
                            } else {
                              setEditingChair({
                                ...editingChair,
                                selectedDays: [...selected, day]
                              });
                            }
                          }}
                          className={`flex-1 px-3 py-2.5 text-sm font-medium rounded-xl border-2 transition-all duration-200 transform ${
                            editingChair.selectedDays?.includes(day)
                              ? 'bg-krooa-green text-white border-krooa-green shadow-lg scale-105'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-krooa-green hover:bg-krooa-green/5 hover:text-krooa-dark hover:shadow-md hover:scale-105'
                          }`}
                        >
                          {getDayAbbreviation(day).substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Datas Específicas</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="date"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-krooa-green/20 focus:border-krooa-green"
                          onChange={(e) => {
                            const dates = editingChair.specificDates || [];
                            if (e.target.value && !dates.includes(e.target.value)) {
                              setEditingChair({
                                ...editingChair,
                                specificDates: [...dates, e.target.value]
                              });
                              e.target.value = '';
                            }
                          }}
                        />
                        <button className="px-4 py-2 bg-krooa-green text-white rounded-lg hover:bg-krooa-dark transition-colors">
                          Adicionar
                        </button>
                      </div>
                      {editingChair.specificDates?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {editingChair.specificDates.map((date: string, index: number) => (
                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-krooa-green/10 text-krooa-dark rounded-lg text-sm">
                              {new Date(date).toLocaleDateString('pt-BR')}
                              <button
                                onClick={() => {
                                  setEditingChair({
                                    ...editingChair,
                                    specificDates: editingChair.specificDates.filter((_: string, i: number) => i !== index)
                                  });
                                }}
                                className="hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="time"
                      value={editingChair.startTime || ''}
                      onChange={(e) => setEditingChair({ ...editingChair, startTime: e.target.value })}
                      className="peer w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20 placeholder-transparent"
                      placeholder="Início"
                      id="startTime"
                    />
                    <label
                      htmlFor="startTime"
                      className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                      Início
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="time"
                      value={editingChair.endTime || ''}
                      onChange={(e) => setEditingChair({ ...editingChair, endTime: e.target.value })}
                      className="peer w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20 placeholder-transparent"
                      placeholder="Fim"
                      id="endTime"
                    />
                    <label
                      htmlFor="endTime"
                      className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                      Fim
                    </label>
                  </div>
                </div>

                {/* Duração dos Atendimentos */}
                <div className="relative">
                  <input
                    type="text"
                    value={editingChair.duration || ''}
                    onChange={(e) => setEditingChair({ ...editingChair, duration: e.target.value })}
                    className="peer w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20 placeholder-transparent"
                    placeholder="Duração"
                    id="duration"
                  />
                  <label
                    htmlFor="duration"
                    className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >
                    Duração dos Atendimentos (minutos)
                  </label>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* Professionals Multi-Select */}
                <div className="relative">
                  <div
                    onClick={() => setIsProfessionalsDropdownOpen(!isProfessionalsDropdownOpen)}
                    className="peer w-full min-h-[42px] px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-krooa-green/20 focus:border-krooa-green cursor-pointer bg-white relative"
                  >
                  {editingChair.selectedProfessionals?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {editingChair.selectedProfessionals.map((profId: string) => {
                        const prof = professionals.find(p => p.id === profId);
                        return prof ? (
                          <span key={profId} className="inline-flex items-center gap-1 px-2 py-1 bg-krooa-green/10 text-krooa-green rounded-md text-sm">
                            {prof.name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingChair({
                                  ...editingChair,
                                  selectedProfessionals: editingChair.selectedProfessionals.filter((id: string) => id !== profId)
                                });
                              }}
                              className="hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Selecione os profissionais</span>
                    )}
                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${isProfessionalsDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                {isProfessionalsDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    {professionals.map((prof) => (
                      <div
                        key={prof.id}
                        onClick={() => {
                          const selected = editingChair.selectedProfessionals || [];
                          if (selected.includes(prof.id)) {
                            setEditingChair({
                              ...editingChair,
                              selectedProfessionals: selected.filter((id: string) => id !== prof.id)
                            });
                          } else {
                            setEditingChair({
                              ...editingChair,
                              selectedProfessionals: [...selected, prof.id]
                            });
                          }
                        }}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-sm">{prof.name}</span>
                        {editingChair.selectedProfessionals?.includes(prof.id) && (
                          <div className="w-4 h-4 bg-krooa-green rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}


      {/* Delete Modals */}
      <Modal
        isOpen={deleteUnitModal.open}
        onClose={() => setDeleteUnitModal({ open: false, targetUnitId: null, sourceUnitId: null })}
        title="Excluir Unidade"
      >
        <div className="space-y-4">
          {(() => {
            const unit = unidades.find(u => u.id === deleteUnitModal.sourceUnitId);
            return unit?.registrosVinculados ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-amber-800">
                      {unit.registrosVinculados} registros serão afetados
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      Todos os dados vinculados a esta unidade precisam ser transferidos para outra unidade.
                    </p>
                  </div>
                </div>
              </div>
            ) : null;
          })()}

          <p className="text-gray-600">
            Selecione para onde transferir os dados desta unidade:
          </p>

          <Select
            value={deleteUnitModal.targetUnitId?.toString() || ''}
            onChange={(e) => setDeleteUnitModal({ ...deleteUnitModal, targetUnitId: parseInt(e.target.value) || null })}
            options={unidades.filter(u => u.id !== deleteUnitModal.sourceUnitId).map(u => ({
              value: u.id.toString(),
              label: u.titulo
            }))}
            required
          />

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteUnitModal({ open: false, targetUnitId: null, sourceUnitId: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleteUnitModal.sourceUnitId && deleteUnitModal.targetUnitId) {
                  setUnidades(unidades.filter(u => u.id !== deleteUnitModal.sourceUnitId));
                  setDeleteUnitModal({ open: false, targetUnitId: null, sourceUnitId: null });
                }
              }}
              disabled={!deleteUnitModal.targetUnitId}
            >
              Excluir e Transferir
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteChairModal.open}
        onClose={() => setDeleteChairModal({ open: false, targetChairId: null })}
        title="Excluir Cadeira"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Tem certeza que deseja excluir esta cadeira? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteChairModal({ open: false, targetChairId: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteChair}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteCostCenterModal.open}
        onClose={() => setDeleteCostCenterModal({ open: false, targetCostCenterId: null, sourceCostCenterId: null })}
        title="Excluir Centro de Custo"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Deseja transferir os dados deste centro de custo para outro antes de excluí-lo?
          </p>
          <Select
            value={deleteCostCenterModal.targetCostCenterId?.toString() || ''}
            onChange={(e) => setDeleteCostCenterModal({ ...deleteCostCenterModal, targetCostCenterId: parseInt(e.target.value) || null })}
            options={[
              { value: '', label: 'Não transferir dados' },
              ...costCenters.filter(cc => cc.id !== deleteCostCenterModal.sourceCostCenterId).map(cc => ({
                value: cc.id.toString(),
                label: cc.name
              }))
            ]}
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteCostCenterModal({ open: false, targetCostCenterId: null, sourceCostCenterId: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleteCostCenterModal.sourceCostCenterId) {
                  setCostCenters(costCenters.filter(cc => cc.id !== deleteCostCenterModal.sourceCostCenterId));
                  setDeleteCostCenterModal({ open: false, targetCostCenterId: null, sourceCostCenterId: null });
                }
              }}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConfigClinica;