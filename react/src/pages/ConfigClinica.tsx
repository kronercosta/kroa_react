import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Clock, ChevronDown, X, GripVertical, TrendingUp, TrendingDown, Minus, Plus } from 'lucide-react';
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

  // Define a aba inicial baseada na rota
  const getInitialTab = () => {
    return 'conta';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
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

  // Estados para Parâmetros de Agenda
  const [monitorarTempoCadeira, setMonitorarTempoCadeira] = useState(false);
  const [identificarConflitos, setIdentificarConflitos] = useState(true);
  const [identificarDesmarcoseFaltas, setIdentificarDesmarcoseFaltas] = useState(false);

  // Estados para Parâmetros Financeiros
  const [controleContabil, setControleContabil] = useState(false);
  const [simulacaoImpostos, setSimulacaoImpostos] = useState(false);
  const [aliquotaImposto, setAliquotaImposto] = useState('');

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
  const [hasSpecificDates, setHasSpecificDates] = useState(false);
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showStartTimeDropdown, setShowStartTimeDropdown] = useState(false);
  const [showEndTimeDropdown, setShowEndTimeDropdown] = useState(false);
  const [startTimeSearch, setStartTimeSearch] = useState('');
  const [endTimeSearch, setEndTimeSearch] = useState('');
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);

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
  const [deleteChairModal, setDeleteChairModal] = useState<{open: boolean, targetChairId: number | null, sourceChairId: number | null}>({open: false, targetChairId: null, sourceChairId: null});

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

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showDatePicker && !(e.target as Element).closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker]);

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
          slots: chair.slots || {},
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
        slots: {},
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

    setDeleteChairModal({ open: true, targetChairId: null, sourceChairId: chairId });
  };

  const confirmDeleteChair = () => {
    if (deleteChairModal.sourceChairId) {
      // Se há transferência, transfere os horários
      if (deleteChairModal.targetChairId) {
        const sourceChair = chairs.find((c: any) => c.id === deleteChairModal.sourceChairId);
        const targetChair = chairs.find((c: any) => c.id === deleteChairModal.targetChairId);

        if (sourceChair && targetChair) {
          // Transfere os slots da cadeira de origem para a de destino
          Object.keys(sourceChair.slots).forEach(day => {
            if (!targetChair.slots[day]) {
              targetChair.slots[day] = [];
            }
            targetChair.slots[day] = [...targetChair.slots[day], ...sourceChair.slots[day]];
          });
        }
      }

      const remainingChairs = chairs.filter((chair: any) => chair.id !== deleteChairModal.sourceChairId);
      remainingChairs.forEach((chair: any, index: number) => {
        chair.order = index + 1;
      });
      setChairs(remainingChairs);
      setDeleteChairModal({ open: false, targetChairId: null, sourceChairId: null });

      // Se estava editando a cadeira que foi excluída, fecha o aside
      if (editingChair?.id === deleteChairModal.sourceChairId) {
        setEditingChair(null);
      }
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
          <div className="space-y-6">
            {/* Parâmetros de Agenda */}
            <Card>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Parâmetros de Agenda</h2>
                <p className="text-sm text-gray-600">Configure o comportamento do sistema de agendamentos</p>
              </div>

              <div className="space-y-6">
                {/* Monitorar tempo de cadeira */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1 pr-4">
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      Monitorar tempo de cadeira
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Acompanha detalhadamente o tempo de sala de espera e duração real dos atendimentos
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        + Controle
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        - Usabilidade
                      </span>
                    </div>
                  </div>
                  <Switch
                    checked={monitorarTempoCadeira}
                    onChange={setMonitorarTempoCadeira}
                  />
                </div>

                {/* Identificar conflitos de horários */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1 pr-4">
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      Identificar conflitos de horários
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      O sistema exibe alertas automáticos ao detectar sobreposição de agendamentos
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Recomendado
                      </span>
                    </div>
                  </div>
                  <Switch
                    checked={identificarConflitos}
                    onChange={setIdentificarConflitos}
                  />
                </div>

                {/* Identificar quem desmarcou ou faltou */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1 pr-4">
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      Identificar quem desmarcou ou faltou
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Mantém histórico detalhado de cancelamentos e faltas para melhor gestão de pacientes
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        + Controle
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        - Usabilidade
                      </span>
                    </div>
                  </div>
                  <Switch
                    checked={identificarDesmarcoseFaltas}
                    onChange={setIdentificarDesmarcoseFaltas}
                  />
                </div>
              </div>
            </Card>

            {/* Parâmetros Financeiros */}
            <Card>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Parâmetros Financeiros</h2>
                <p className="text-sm text-gray-600">Configure recursos avançados de controle financeiro e contábil</p>
              </div>

              <div className="space-y-6">
                {/* Controle Contábil com Subcategorias */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1 pr-4">
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      Habilitar controle contábil detalhado
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Permite adicionar subcategorias ao lançar contas a pagar e receber, especificando a categoria contábil de cada pagamento para melhor controle financeiro
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Contabilidade
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        + Controle
                      </span>
                    </div>
                  </div>
                  <Switch
                    checked={controleContabil}
                    onChange={setControleContabil}
                  />
                </div>

                {/* Simulação de Impostos */}
                <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-4">
                      <h3 className="text-base font-medium text-gray-900 mb-1">
                        Simulação de impostos no DRE
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Habilita simulações de impostos para planejamento tributário. Permite calcular quanto seria pago em impostos sem gerar lançamentos reais, apenas projeções no DRE
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          Planejamento
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Simulação
                        </span>
                      </div>
                    </div>
                    <Switch
                      checked={simulacaoImpostos}
                      onChange={setSimulacaoImpostos}
                    />
                  </div>

                  {/* Campo de Alíquota - aparece quando habilitado */}
                  {simulacaoImpostos && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="max-w-xs">
                        <label htmlFor="aliquota" className="block text-sm font-medium text-gray-700 mb-2">
                          Alíquota de imposto para simulação
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="aliquota"
                            value={aliquotaImposto}
                            onChange={(e) => {
                              // Remove caracteres não numéricos exceto vírgula e ponto
                              let value = e.target.value.replace(/[^\d.,]/g, '');

                              // Substitui vírgula por ponto
                              value = value.replace(',', '.');

                              // Garante apenas um ponto decimal
                              const parts = value.split('.');
                              if (parts.length > 2) {
                                value = parts[0] + '.' + parts.slice(1).join('');
                              }

                              // Limita a 2 casas decimais
                              if (parts[1] && parts[1].length > 2) {
                                value = parts[0] + '.' + parts[1].slice(0, 2);
                              }

                              // Limita valor máximo a 100
                              if (parseFloat(value) > 100) {
                                value = '100';
                              }

                              setAliquotaImposto(value);
                            }}
                            placeholder="Ex: 15.50"
                            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-krooa-green/20 focus:border-krooa-green"
                            maxLength={6}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                            %
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Digite a porcentagem para calcular simulações de imposto
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
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
                                className={`p-1.5 rounded-lg transition-all ${
                                  costCenters.length === 1
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                }`}
                                title={costCenters.length === 1 ? 'Não é possível excluir o único centro de custo' : 'Excluir'}
                                disabled={costCenters.length === 1}
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
                <Button
                  onClick={saveChair}
                  variant="primary"
                >
                  Salvar
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
              {/* Seção de Configurar Horários */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Configurar Horários</h3>
                  <button
                    onClick={() => {
                      if (editingChair?.id) {
                        setDeleteChairModal({
                          open: true,
                          targetChairId: null,
                          sourceChairId: editingChair.id
                        });
                      }
                    }}
                    className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    title="Excluir cadeira"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Nome da Cadeira */}
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      value={editingChair.name || ''}
                      onChange={(e) => setEditingChair({ ...editingChair, name: e.target.value })}
                      className="peer w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20 placeholder-transparent"
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

                {/* Toggle de Datas Específicas */}
                <div>
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
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-xl border-2 transition-all duration-200 transform ${
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
                      <div className="relative date-picker-container">
                        <div className="flex gap-2">
                          <div
                            className="flex-1 relative"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                          >
                            <input
                              type="text"
                              value={selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              }) : ''}
                              placeholder="Selecione uma data"
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-krooa-green/20 focus:border-krooa-green"
                            />
                            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <Button
                            onClick={() => {
                              if (selectedDate) {
                                const dates = editingChair.specificDates || [];
                                if (!dates.includes(selectedDate)) {
                                  setEditingChair({
                                    ...editingChair,
                                    specificDates: [...dates, selectedDate]
                                  });
                                  setSelectedDate('');
                                }
                              }
                            }}
                            variant="primary"
                          >
                            Adicionar
                          </Button>
                        </div>

                        {/* Custom Calendar */}
                        {showDatePicker && (
                          <div
                            className="absolute z-50 mt-1 bg-gray-50 border border-gray-200 rounded-lg shadow-xl p-3"
                            style={{ minWidth: '300px' }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-3 gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const newDate = new Date(calendarDate);
                                  newDate.setMonth(newDate.getMonth() - 1);
                                  setCalendarDate(newDate);
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <div className="flex items-center gap-2 flex-1 justify-center">
                                <span className="font-medium">
                                  {calendarDate.toLocaleDateString('pt-BR', { month: 'long' }).charAt(0).toUpperCase() +
                                   calendarDate.toLocaleDateString('pt-BR', { month: 'long' }).slice(1)}
                                </span>
                                <select
                                  value={calendarDate.getFullYear()}
                                  onChange={(e) => {
                                    const newDate = new Date(calendarDate);
                                    newDate.setFullYear(parseInt(e.target.value));
                                    setCalendarDate(newDate);
                                  }}
                                  className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-krooa-green bg-white"
                                >
                                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                  ))}
                                </select>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newDate = new Date(calendarDate);
                                  newDate.setMonth(newDate.getMonth() + 1);
                                  setCalendarDate(newDate);
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
                                <div key={day} className="text-center text-xs font-medium text-gray-600 py-1">
                                  {day}
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                              {(() => {
                                const firstDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
                                const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
                                const days = [];

                                for (let i = 0; i < firstDay; i++) {
                                  days.push(<div key={`empty-${i}`} className="p-2"></div>);
                                }

                                for (let day = 1; day <= daysInMonth; day++) {
                                  const dateStr = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                  const isToday = new Date().toDateString() === new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day).toDateString();
                                  const isSelected = selectedDate === dateStr;
                                  const isAlreadyAdded = editingChair.specificDates?.includes(dateStr);

                                  days.push(
                                    <button
                                      key={day}
                                      type="button"
                                      onClick={() => {
                                        setSelectedDate(dateStr);
                                        setShowDatePicker(false);
                                      }}
                                      disabled={isAlreadyAdded}
                                      className={`
                                        p-2 text-sm rounded transition-colors
                                        ${isAlreadyAdded ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                                          isSelected ? 'bg-krooa-green text-white font-medium' :
                                          isToday ? 'bg-gray-200 text-gray-900 font-medium' :
                                          'hover:bg-gray-100 text-gray-700'}
                                      `}
                                    >
                                      {day}
                                    </button>
                                  );
                                }

                                return days;
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                      {editingChair.specificDates?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {editingChair.specificDates.map((date: string, index: number) => (
                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-krooa-green/10 text-krooa-dark rounded-lg text-sm">
                              {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
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
                      type="text"
                      value={editingChair.startTime || ''}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^\d]/g, '');

                        // Formata automaticamente HH:MM
                        if (value.length >= 3) {
                          value = value.slice(0, 2) + ':' + value.slice(2, 4);
                        }

                        // Valida horas e minutos
                        const parts = value.split(':');
                        if (parts[0] && parseInt(parts[0]) > 23) {
                          value = '23' + (parts[1] ? ':' + parts[1] : '');
                        }
                        if (parts[1] && parseInt(parts[1]) > 59) {
                          value = parts[0] + ':59';
                        }

                        setEditingChair({ ...editingChair, startTime: value });
                        setStartTimeSearch(value);
                        setShowStartTimeDropdown(true);
                      }}
                      onFocus={() => setShowStartTimeDropdown(true)}
                      onBlur={() => setTimeout(() => setShowStartTimeDropdown(false), 200)}
                      className="peer w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20 placeholder-transparent"
                      placeholder="__:__"
                      maxLength={5}
                      id="startTime"
                    />
                    <label
                      htmlFor="startTime"
                      className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                      Início
                    </label>

                    {/* Dropdown de sugestões */}
                    {showStartTimeDropdown && (
                      <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                        {Array.from({ length: 48 }, (_, i) => {
                          const hour = Math.floor(i / 2);
                          const minute = i % 2 === 0 ? '00' : '30';
                          const time = `${hour.toString().padStart(2, '0')}:${minute}`;

                          // Filtra baseado no que foi digitado
                          if (editingChair.startTime && !time.startsWith(editingChair.startTime.replace(/[^\d]/g, '').substring(0, 4))) {
                            if (editingChair.startTime.length > 0 && !time.includes(editingChair.startTime)) {
                              return null;
                            }
                          }

                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => {
                                setEditingChair({ ...editingChair, startTime: time });
                                setShowStartTimeDropdown(false);
                              }}
                              className={`w-full px-3 py-2 text-left hover:bg-krooa-green/10 transition-colors text-sm ${
                                editingChair.startTime === time ? 'bg-krooa-green/20 font-medium' : ''
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={editingChair.endTime || ''}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^\d]/g, '');

                        // Formata automaticamente HH:MM
                        if (value.length >= 3) {
                          value = value.slice(0, 2) + ':' + value.slice(2, 4);
                        }

                        // Valida horas e minutos
                        const parts = value.split(':');
                        if (parts[0] && parseInt(parts[0]) > 23) {
                          value = '23' + (parts[1] ? ':' + parts[1] : '');
                        }
                        if (parts[1] && parseInt(parts[1]) > 59) {
                          value = parts[0] + ':59';
                        }

                        setEditingChair({ ...editingChair, endTime: value });
                        setEndTimeSearch(value);
                        setShowEndTimeDropdown(true);
                      }}
                      onFocus={() => setShowEndTimeDropdown(true)}
                      onBlur={() => setTimeout(() => setShowEndTimeDropdown(false), 200)}
                      className="peer w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20 placeholder-transparent"
                      placeholder="__:__"
                      maxLength={5}
                      id="endTime"
                    />
                    <label
                      htmlFor="endTime"
                      className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                      Fim
                    </label>

                    {/* Dropdown de sugestões */}
                    {showEndTimeDropdown && (
                      <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                        {Array.from({ length: 48 }, (_, i) => {
                          const hour = Math.floor(i / 2);
                          const minute = i % 2 === 0 ? '00' : '30';
                          const time = `${hour.toString().padStart(2, '0')}:${minute}`;

                          // Filtra baseado no que foi digitado
                          if (editingChair.endTime && !time.startsWith(editingChair.endTime.replace(/[^\d]/g, '').substring(0, 4))) {
                            if (editingChair.endTime.length > 0 && !time.includes(editingChair.endTime)) {
                              return null;
                            }
                          }

                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => {
                                setEditingChair({ ...editingChair, endTime: time });
                                setShowEndTimeDropdown(false);
                              }}
                              className={`w-full px-3 py-2 text-left hover:bg-krooa-green/10 transition-colors text-sm ${
                                editingChair.endTime === time ? 'bg-krooa-green/20 font-medium' : ''
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Duração dos Atendimentos */}
                <div className="relative">
                  <input
                    type="text"
                    value={editingChair.duration || ''}
                    onChange={(e) => {
                      let value = e.target.value;

                      // Se o usuário está apagando, permite
                      if (value.length < (editingChair.duration || '').length) {
                        setEditingChair({ ...editingChair, duration: value });
                        setShowDurationDropdown(true);
                        return;
                      }

                      // Remove caracteres não numéricos exceto ':'
                      value = value.replace(/[^\d:]/g, '');

                      // Se já tem ':', não adiciona outro
                      if (value.includes(':')) {
                        const parts = value.split(':');
                        if (parts.length > 2) {
                          value = parts[0] + ':' + parts[1];
                        }
                        // Valida minutos
                        if (parts[1] && parseInt(parts[1]) > 59) {
                          value = parts[0] + ':59';
                        }
                      } else {
                        // Adiciona ':' automaticamente após 1 dígito quando continuar digitando
                        if (value.length === 2 && !editingChair.duration?.includes(':')) {
                          value = value[0] + ':' + value[1];
                        } else if (value.length === 3) {
                          value = value[0] + ':' + value.slice(1);
                        }
                      }

                      setEditingChair({ ...editingChair, duration: value });
                      setShowDurationDropdown(true);
                    }}
                    onFocus={() => setShowDurationDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDurationDropdown(false), 200)}
                    className="peer w-full rounded-lg border border-gray-300 px-3 py-2 pr-16 focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20 placeholder-transparent"
                    placeholder="_:__"
                    maxLength={5}
                    id="duration"
                  />
                  <label
                    htmlFor="duration"
                    className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600 pointer-events-none"
                  >
                    Duração dos Atendimentos
                  </label>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">h:min</span>

                  {/* Dropdown de sugestões de duração */}
                  {showDurationDropdown && (
                    <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                      {[15, 20, 30, 45, 60, 75, 90, 120, 150, 180].map((minutes) => {
                        const hours = Math.floor(minutes / 60);
                        const mins = minutes % 60;
                        const timeStr = `${hours}:${mins.toString().padStart(2, '0')}`;
                        const label = hours > 0
                          ? `${hours}h${mins > 0 ? ` ${mins}min` : ''}`
                          : `${mins}min`;

                        // Filtra baseado no que foi digitado
                        if (editingChair.duration) {
                          const searchValue = editingChair.duration.replace(/[^\d]/g, '');
                          if (searchValue && !timeStr.includes(searchValue) && !minutes.toString().includes(searchValue)) {
                            return null;
                          }
                        }

                        return (
                          <button
                            key={minutes}
                            type="button"
                            onClick={() => {
                              setEditingChair({ ...editingChair, duration: timeStr });
                              setShowDurationDropdown(false);
                            }}
                            className={`w-full px-3 py-2 text-left hover:bg-krooa-green/10 transition-colors text-sm flex items-center justify-between ${
                              editingChair.duration === timeStr ? 'bg-krooa-green/20 font-medium' : ''
                            }`}
                          >
                            <span>{timeStr}</span>
                            <span className="text-xs text-gray-500">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Professionals Multi-Select */}
                <div className="relative">
                  <MultiSelect
                    options={professionals.map(prof => ({
                      value: prof.id,
                      label: prof.name
                    }))}
                    value={editingChair.selectedProfessionals || []}
                    onChange={(values) => {
                      setEditingChair({
                        ...editingChair,
                        selectedProfessionals: values
                      });
                    }}
                    placeholder="Profissionais"
                    multiple={true}
                  />
                  <label
                    className={`absolute left-3 bg-white px-1 text-sm text-gray-600 transition-all pointer-events-none ${
                      editingChair.selectedProfessionals?.length > 0
                        ? '-top-2.5'
                        : 'top-2.5 text-base text-gray-400'
                    }`}
                  >
                    Profissionais
                  </label>
                </div>

                {/* Botão Adicionar Horário */}
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      // Adiciona o horário configurado
                      if (editingChair.startTime && editingChair.endTime && editingChair.duration) {
                        // Lógica para adicionar horário
                        const newSlot = {
                          id: `${editingChair.id || 'new'}-${Date.now()}`,
                          time: `${editingChair.startTime}-${editingChair.endTime}`,
                          duration: editingChair.duration,
                          professionals: editingChair.selectedProfessionals || [],
                          days: hasSpecificDates ? [] : editingChair.selectedDays,
                          dates: hasSpecificDates ? editingChair.specificDates : []
                        };

                        // Limpa os campos após adicionar
                        setEditingChair({
                          ...editingChair,
                          startTime: '',
                          endTime: '',
                          duration: '',
                          selectedProfessionals: [],
                          selectedDays: [],
                          specificDates: []
                        });
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Horário
                  </Button>
                </div>

                {/* Tabela de Horários */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Horários Configurados</h4>

                  {/* Se não houver horários */}
                  {(!editingChair.slots || Object.keys(editingChair.slots || {}).length === 0) ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Nenhum horário configurado</p>
                      <p className="text-xs text-gray-500">Configure os campos acima e clique em "Adicionar Horário"</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Dia/Data
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Horário
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Duração
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Profissionais
                            </th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {editingChair.slots && Object.entries(editingChair.slots).map(([day, slots]: [string, any]) =>
                            slots.map((slot: any) => (
                              <tr key={slot.id} className="hover:bg-gray-50">
                                <td className="py-2.5 px-4 text-sm text-gray-900">
                                  <span className="font-medium">
                                    {getDayAbbreviation(day)}
                                  </span>
                                  {slot.date && (
                                    <span className="ml-2 text-xs text-gray-500">
                                      ({Array.isArray(slot.date) ? slot.date.join(', ') : slot.date})
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-4 text-sm text-gray-900">
                                  {slot.time}
                                </td>
                                <td className="py-2.5 px-4 text-sm text-gray-900">
                                  {slot.duration || '30'} min
                                </td>
                                <td className="py-2.5 px-4 text-sm text-gray-900">
                                  <div className="flex flex-wrap gap-1">
                                    {slot.professionals?.map((prof: any) => (
                                      <span key={prof.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-krooa-green/10 text-krooa-dark">
                                        {prof.name}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-2.5 px-4 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => {
                                        // Carrega os dados do horário para edição
                                        const [startTime, endTime] = slot.time.split('-');
                                        setEditingChair({
                                          ...editingChair,
                                          startTime: startTime,
                                          endTime: endTime,
                                          duration: slot.duration || '30',
                                          selectedProfessionals: slot.professionals?.map((p: any) => p.id) || [],
                                          selectedDays: [day],
                                          specificDates: slot.date ? (Array.isArray(slot.date) ? slot.date : [slot.date]) : []
                                        });

                                        // Se tiver datas específicas, ativa o modo de datas
                                        if (slot.date) {
                                          setHasSpecificDates(true);
                                        }

                                        // Remove o slot atual para ser substituído pelo editado
                                        const newSlots = { ...editingChair.slots };
                                        newSlots[day] = newSlots[day].filter((s: any) => s.id !== slot.id);
                                        if (newSlots[day].length === 0) {
                                          delete newSlots[day];
                                        }
                                        setEditingChair({ ...editingChair, slots: newSlots });
                                      }}
                                      className="p-1.5 rounded-lg transition-all bg-gray-100 text-gray-600 hover:bg-gray-200"
                                      title="Editar"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => {
                                        // Remove o horário
                                        const newSlots = { ...editingChair.slots };
                                        newSlots[day] = newSlots[day].filter((s: any) => s.id !== slot.id);
                                        if (newSlots[day].length === 0) {
                                          delete newSlots[day];
                                        }
                                        setEditingChair({ ...editingChair, slots: newSlots });
                                      }}
                                      className="p-1.5 rounded-lg transition-all bg-red-100 text-red-600 hover:bg-red-200"
                                      title="Excluir"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
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
            const registros = unit?.registrosVinculados || 0;

            return (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-amber-800">
                        {registros} registros serão afetados
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Tem certeza que deseja excluir a unidade <strong>{unit?.titulo}</strong>?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">
                    {registros > 0
                      ? `Você pode transferir os ${registros} registros afetados para outra unidade ou excluir permanentemente.`
                      : 'Você pode transferir os dados para outra unidade ou excluir permanentemente.'
                    }
                  </p>

                  <Select
                    value={deleteUnitModal.targetUnitId?.toString() || ''}
                    onChange={(e) => setDeleteUnitModal({ ...deleteUnitModal, targetUnitId: parseInt(e.target.value) || null })}
                    options={[
                      { value: '', label: 'Não transferir (excluir permanentemente)' },
                      ...unidades.filter(u => u.id !== deleteUnitModal.sourceUnitId).map(u => ({
                        value: u.id.toString(),
                        label: u.titulo
                      }))
                    ]}
                  />
                </div>
              </>
            );
          })()}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setDeleteUnitModal({ open: false, targetUnitId: null, sourceUnitId: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleteUnitModal.sourceUnitId) {
                  setUnidades(unidades.filter(u => u.id !== deleteUnitModal.sourceUnitId));
                  setDeleteUnitModal({ open: false, targetUnitId: null, sourceUnitId: null });
                }
              }}
            >
              {deleteUnitModal.targetUnitId ? 'Excluir e Transferir' : 'Excluir Permanentemente'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteChairModal.open}
        onClose={() => setDeleteChairModal({ open: false, targetChairId: null, sourceChairId: null })}
        title="Excluir Cadeira"
      >
        <div className="space-y-4">
          {(() => {
            const chair = chairs.find((c: any) => c.id === deleteChairModal.sourceChairId);
            const slots = chair ? Object.values(chair.slots).flat().length : 0;

            return (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-amber-800">
                        {slots} horários serão afetados
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Tem certeza que deseja excluir a cadeira <strong>{chair?.name}</strong>?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">
                    {slots > 0
                      ? `Você pode transferir os ${slots} horários afetados para outra cadeira ou excluir permanentemente.`
                      : 'Você pode transferir os dados para outra cadeira ou excluir permanentemente.'
                    }
                  </p>

                  <Select
                    value={deleteChairModal.targetChairId?.toString() || ''}
                    onChange={(e) => setDeleteChairModal({ ...deleteChairModal, targetChairId: parseInt(e.target.value) || null })}
                    options={[
                      { value: '', label: 'Não transferir (excluir permanentemente)' },
                      ...chairs.filter((c: any) => c.id !== deleteChairModal.sourceChairId).map((c: any) => ({
                        value: c.id.toString(),
                        label: c.name
                      }))
                    ]}
                  />
                </div>
              </>
            );
          })()}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setDeleteChairModal({ open: false, targetChairId: null, sourceChairId: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteChair}
            >
              {deleteChairModal.targetChairId ? 'Excluir e Transferir' : 'Excluir Permanentemente'}
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
          {(() => {
            const center = costCenters.find(cc => cc.id === deleteCostCenterModal.sourceCostCenterId);
            const registros = center?.registrosVinculados || 0;

            return (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-amber-800">
                        {registros} registros serão afetados
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Tem certeza que deseja excluir o centro de custo <strong>{center?.name}</strong>?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">
                    {registros > 0
                      ? `Você pode transferir os ${registros} registros afetados para outro centro de custo ou excluir permanentemente.`
                      : 'Você pode transferir os dados para outro centro de custo ou excluir permanentemente.'
                    }
                  </p>

                  <Select
                    value={deleteCostCenterModal.targetCostCenterId?.toString() || ''}
                    onChange={(e) => setDeleteCostCenterModal({ ...deleteCostCenterModal, targetCostCenterId: parseInt(e.target.value) || null })}
                    options={[
                      { value: '', label: 'Não transferir (excluir permanentemente)' },
                      ...costCenters.filter(cc => cc.id !== deleteCostCenterModal.sourceCostCenterId).map(cc => ({
                        value: cc.id.toString(),
                        label: cc.name
                      }))
                    ]}
                  />
                </div>
              </>
            );
          })()}

          <div className="flex justify-between">
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
              {deleteCostCenterModal.targetCostCenterId ? 'Excluir e Transferir' : 'Excluir Permanentemente'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConfigClinica;