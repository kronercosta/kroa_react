import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Clock, Users, Calendar, ChevronDown, X, GripVertical, Edit2, ChevronRight, AlertTriangle, TrendingUp, TrendingDown, Minus, TriangleAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, EmailInput, PhoneInput } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { TextArea } from '../components/ui/TextArea';
import { Switch } from '../components/ui/Switch';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';

interface Professional {
  id: string;
  name: string;
  duration: number;
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
  const [activeTab, setActiveTab] = useState('dados');
  const [pessoaJuridica, setPessoaJuridica] = useState(true);
  const [multiplesUnidades, setMultiplesUnidades] = useState(true);
  const [editingUnit, setEditingUnit] = useState<number | null>(null);

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
  const [tooltipData, setTooltipData] = useState<{x: number, y: number, slot: Slot} | null>(null);
  const [selectedSlotForAction, setSelectedSlotForAction] = useState<string | null>(null);
  const [isProfessionalsDropdownOpen, setIsProfessionalsDropdownOpen] = useState(false);
  const [hasSpecificDates, setHasSpecificDates] = useState(false);
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(true);

  // Centro de Custo states
  const [centroCustoEnabled, setCentroCustoEnabled] = useState(false);
  const [editingCostCenter, setEditingCostCenter] = useState<number | null>(null);
  const [costCenters, setCostCenters] = useState([
    { id: 1, name: 'Ortodontia', description: 'Centro de custo para tratamentos ortodônticos' },
    { id: 2, name: 'Endodontia', description: 'Centro de custo para tratamentos de canal' },
    { id: 3, name: 'Cirurgia', description: 'Centro de custo para procedimentos cirúrgicos' }
  ]);

  // Modal states
  const [deleteUnitModal, setDeleteUnitModal] = useState<{open: boolean, targetUnitId: number | null, sourceUnitId: number | null}>({open: false, targetUnitId: null, sourceUnitId: null});
  const [deleteCostCenterModal, setDeleteCostCenterModal] = useState<{open: boolean, targetCostCenterId: number | null, sourceCostCenterId: number | null}>({open: false, targetCostCenterId: null, sourceCostCenterId: null});
  const [deleteChairModal, setDeleteChairModal] = useState<{open: boolean, targetChairId: number | null}>({open: false, targetChairId: null});

  // Header states
  const [selectedTimezone, setSelectedTimezone] = useState('São Paulo - Brasília');
  const [currentTime, setCurrentTime] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('PT');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [showLanguageAlert, setShowLanguageAlert] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

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
  });

  const [unidades, setUnidades] = useState([
    {
      id: 1,
      titulo: 'Setor Oeste',
      centralComunicacao: 'Central 1',
      centroCusto: 'CC 001',
      colaboradores: []
    },
    {
      id: 2,
      titulo: 'Setor Central',
      centralComunicacao: 'Central 2',
      centroCusto: 'CC 002',
      colaboradores: []
    }
  ]);

  const tabs = [
    { id: 'dados', label: 'Conta' },
    { id: 'parametros', label: 'Parâmetros' },
    { id: 'cadeiras', label: 'Cadeiras' },
    { id: 'centro-custo', label: 'Centro de Custo' },
    { id: 'assinatura', label: 'Assinatura' }
  ];

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
    { id: '1', name: 'Dr. João Silva', duration: 30 },
    { id: '2', name: 'Dra. Maria Santos', duration: 45 },
    { id: '3', name: 'Dr. Pedro Costa', duration: 60 },
    { id: '4', name: 'Dr. Carlos Lima', duration: 30 },
    { id: '5', name: 'Dra. Ana Oliveira', duration: 40 }
  ];

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
    }

    if (languageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [languageDropdownOpen]);

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
    setSelectedSlotForAction(null);
  };

  const saveChair = () => {
    if (!editingChair.name?.trim()) {
      alert('Por favor, preencha o nome da cadeira');
      return;
    }

    if (editingChair.id) {
      // Update existing chair
      setChairs(chairs.map(chair => {
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
      const remainingChairs = chairs.filter(chair => chair.id !== deleteChairModal.targetChairId);
      remainingChairs.forEach((chair, index) => {
        chair.order = index + 1;
      });
      setChairs(remainingChairs);
      setDeleteChairModal({ open: false, targetChairId: null });
    }
  };

  const editSlot = (chairId: number, slotId: string) => {
    const chair = chairs.find(c => c.id === chairId);
    if (chair) {
      openAside(chairId);
      setSelectedSlotForAction(slotId);
    }
  };

  const addSlotToDay = (chairId: number, day: string) => {
    openAside(chairId);
    setEditingChair((prev: any) => ({
      ...prev,
      selectedDays: [day]
    }));
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
      setPendingLanguage(newLanguage);
      setShowLanguageAlert(true);
      setLanguageDropdownOpen(false);
    }
  };

  const confirmLanguageChange = () => {
    if (pendingLanguage) {
      setSelectedLanguage(pendingLanguage);
      setPendingLanguage(null);
      setShowLanguageAlert(false);
    }
  };

  const cancelLanguageChange = () => {
    setPendingLanguage(null);
    setShowLanguageAlert(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full px-6 py-2 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-krooa-dark">Configurações da Clínica</h1>
            <p className="text-xs text-gray-600">Gerencie as informações e configurações da sua clínica</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Timezone selector */}
            <div className="relative">
              <button
                onClick={() => {}}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium h-[34px]"
                title={selectedTimezone}
              >
                <Clock className="w-4 h-4" />
                <span>{currentTime}</span>
                <span className="text-xs text-gray-600">SP/BR</span>
              </button>
            </div>

            {/* Language selector */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium h-[34px]"
                title="Alterar região e idioma"
              >
                <span className="text-lg">{languages.find(lang => lang.code === selectedLanguage)?.flag}</span>
                <span>{selectedLanguage}</span>
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

      {/* Language Change Alert */}
      {showLanguageAlert && pendingLanguage && (
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TriangleAlert className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">Atenção: Mudança de Região</h2>
                <p className="text-white/90 text-sm mt-1">
                  Confirma a alteração para {languages.find(lang => lang.code === pendingLanguage)?.name}?
                  Isso afetará idioma, moeda e formatos de data.
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={confirmLanguageChange}
                    className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={cancelLanguageChange}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={cancelLanguageChange}
              className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex gap-1 border-b border-gray-200 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative px-4 py-3 text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'text-krooa-dark'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {activeTab === tab.id && (
                  <>
                    <div className="absolute inset-0 bg-krooa-dark rounded-t-lg"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-krooa-green"></div>
                  </>
                )}
                <span className={`relative z-10 flex items-center gap-2 ${
                  activeTab === tab.id ? 'text-krooa-green' : ''
                }`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {/* Dados da Conta */}
        {activeTab === 'dados' && (
          <div className="space-y-4">
            {/* Dados da Conta Section */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Conta</h2>
                <Button>Salvar</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
                  placeholder="contato@empresa.com"
                />

                <Input
                  label="Nome do Responsável"
                  value={formData.responsibleName}
                  onChange={(e) => setFormData({ ...formData, responsibleName: e.target.value })}
                  placeholder="Nome completo"
                />

                <Input
                  label="CPF do Responsável"
                  value={formData.responsibleDocument}
                  onChange={(e) => setFormData({ ...formData, responsibleDocument: e.target.value })}
                  placeholder="000.000.000-00"
                />

                <PhoneInput
                  label="Telefone"
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                />

                <Input
                  label="Rua"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Nome da rua"
                />

                <Input
                  label="Número"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="123"
                />

                <Input
                  label="Complemento"
                  value={formData.complement}
                  onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                  placeholder="Apt, casa, etc."
                />

                <Input
                  label="Bairro"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder="Nome do bairro"
                />

                <Input
                  label="Cidade"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Nome da cidade"
                />

                <Select
                  label="Estado"
                  value={formData.state}
                  onChange={(value) => setFormData({ ...formData, state: value })}
                  options={[
                      { value: 'AC', label: 'Acre' },
                      { value: 'AL', label: 'Alagoas' },
                      { value: 'AP', label: 'Amapá' },
                      { value: 'AM', label: 'Amazonas' },
                      { value: 'BA', label: 'Bahia' },
                      { value: 'CE', label: 'Ceará' },
                      { value: 'DF', label: 'Distrito Federal' },
                      { value: 'ES', label: 'Espírito Santo' },
                      { value: 'GO', label: 'Goiás' },
                      { value: 'MA', label: 'Maranhão' },
                      { value: 'MT', label: 'Mato Grosso' },
                      { value: 'MS', label: 'Mato Grosso do Sul' },
                      { value: 'MG', label: 'Minas Gerais' },
                      { value: 'PA', label: 'Pará' },
                      { value: 'PB', label: 'Paraíba' },
                      { value: 'PR', label: 'Paraná' },
                      { value: 'PE', label: 'Pernambuco' },
                      { value: 'PI', label: 'Piauí' },
                      { value: 'RJ', label: 'Rio de Janeiro' },
                      { value: 'RN', label: 'Rio Grande do Norte' },
                      { value: 'RS', label: 'Rio Grande do Sul' },
                      { value: 'RO', label: 'Rondônia' },
                      { value: 'RR', label: 'Roraima' },
                      { value: 'SC', label: 'Santa Catarina' },
                      { value: 'SP', label: 'São Paulo' },
                      { value: 'SE', label: 'Sergipe' },
                      { value: 'TO', label: 'Tocantins' }
                    ]}
                  placeholder="Selecione o estado"
                />

                <Input
                  label="CEP"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="00000-000"
                />
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <Input
                      label="Razão Social"
                      value={formData.legalName}
                      onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                      placeholder="Nome da empresa"
                    />

                    <Input
                      label="CNPJ"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      placeholder="00.000.000/0000-00"
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
                    checked={multiplesUnidades}
                    onChange={setMultiplesUnidades}
                  />
                </div>
              </div>
            </Card>

            {/* Unidades Section */}
            {multiplesUnidades && (
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Unidades</h2>
                  <Button
                    onClick={() => setUnidades([...unidades, {
                      id: Date.now(),
                      titulo: '',
                      centralComunicacao: '',
                      centroCusto: '',
                      colaboradores: []
                    }])}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Unidade
                  </Button>
                </div>

                <div className="space-y-4">
                  {unidades.map((unidade) => (
                    <div key={unidade.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3">
                          <Input
                            label="Título"
                            value={unidade.titulo}
                            onChange={() => {}}
                            placeholder="Nome da unidade"
                          />

                          <Input
                            label="Central de Comunicação"
                            value={unidade.centralComunicacao}
                            onChange={() => {}}
                            placeholder="Central 1"
                          />

                          <Input
                            label="Centro de Custo"
                            value={unidade.centroCusto}
                            onChange={() => {}}
                            placeholder="CC 001"
                          />
                        </div>
                        <Button
                          onClick={() => {
                            if (unidades.length > 1) {
                              setDeleteUnitModal({ open: true, sourceUnitId: unidade.id, targetUnitId: null });
                            }
                          }}
                          variant="destructive"
                          size="sm"
                          className="ml-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Configuração de Cadeiras</h2>
              <Button onClick={() => openAside()}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Cadeira
              </Button>
            </div>

            {/* Análise de Agendamentos */}
            {isAnalysisExpanded && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">Análise de Agendamentos</h3>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>• Média de agendamentos das últimas 4 semanas</p>
                      <p>• Indicadores sugerem ajustes nos horários baseados na demanda</p>
                      <p>• Verde = adequada, Amarelo = diminuir horários, Vermelho = aumentar horários</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAnalysisExpanded(false)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ordem
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seg
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ter
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qua
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qui
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sex
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sáb
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        className={`transition-all ${
                          dragOverIndex === index ? 'bg-green-50 border-l-4 border-krooa-green' : ''
                        }`}
                      >
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            <span>{chair.order}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div>
                              <span className="text-sm font-medium text-gray-900">{chair.name}</span>
                              {getStatusIndicator(chair.metrics.status)}
                            </div>
                            <button
                              onClick={() => openAside(chair.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Edit2 className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </td>
                        {days.map((day) => (
                          <td key={day} className="px-2 py-4">
                            <div className="space-y-1">
                              {chair.slots[day]?.map((slot) => (
                                <div
                                  key={slot.id}
                                  onClick={() => editSlot(chair.id, slot.id)}
                                  className="text-xs p-2 bg-green-50 rounded cursor-pointer hover:bg-green-100 transition-colors border border-green-200"
                                  onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setTooltipData({
                                      x: rect.left,
                                      y: rect.top - 10,
                                      slot
                                    });
                                  }}
                                  onMouseLeave={() => setTooltipData(null)}
                                >
                                  <div className="font-medium text-green-800">{slot.time}</div>
                                  {slot.date && (
                                    <div className="text-green-600 text-xs mt-1">
                                      {Array.isArray(slot.date) ? slot.date.join(', ') : slot.date}
                                    </div>
                                  )}
                                </div>
                              ))}
                              <button
                                onClick={() => addSlotToDay(chair.id, day)}
                                className="w-full text-xs p-1.5 border-2 border-dashed border-gray-300 rounded hover:border-krooa-green hover:bg-green-50 transition-all text-gray-400 hover:text-krooa-green"
                              >
                                <Plus className="w-3 h-3 mx-auto" />
                              </button>
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Centros de Custo</h2>
                  <Button
                    onClick={() => setCostCenters([...costCenters, {
                      id: Date.now(),
                      name: '',
                      description: ''
                    }])}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Centro
                  </Button>
                </div>

                <div className="space-y-4">
                  {costCenters.map((center) => (
                    <div key={center.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <Input
                            label="Nome"
                            value={center.name}
                            onChange={() => {}}
                            placeholder="Nome do centro de custo"
                          />

                          <Input
                            label="Descrição"
                            value={center.description}
                            onChange={() => {}}
                            placeholder="Descrição do centro"
                          />
                        </div>
                        <Button
                          onClick={() => {
                            if (costCenters.length > 1) {
                              setDeleteCostCenterModal({ open: true, sourceCostCenterId: center.id, targetCostCenterId: null });
                            }
                          }}
                          variant="destructive"
                          size="sm"
                          className="ml-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Aside Panel for Chair Configuration */}
      {isAsideOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeAside}></div>
          <div className="fixed right-0 top-0 h-full w-96 bg-white/95 backdrop-blur-md shadow-2xl z-50 transform transition-transform">
            <div className="flex justify-between items-center p-6 border-b">
              <button onClick={closeAside} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                {editingChair.id ? 'Editar Cadeira' : 'Nova Cadeira'}
              </h2>
              <div className="flex gap-2">
                {editingChair.id && (
                  <button
                    onClick={() => deleteChair(editingChair.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto h-[calc(100%-140px)]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Cadeira</label>
                <input
                  type="text"
                  value={editingChair.name || ''}
                  onChange={(e) => setEditingChair({ ...editingChair, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-krooa-green"
                  placeholder="Ex: Consultório 1"
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 pt-4">Configurar Horários</h3>

              {/* Days of Week Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dias da Semana</label>
                <div className="flex flex-wrap gap-2">
                  {['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'].map((day) => (
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
                      className={`px-3 py-1 rounded-lg border transition-colors ${
                        editingChair.selectedDays?.includes(day)
                          ? 'bg-krooa-green text-white border-krooa-green'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-krooa-green'
                      }`}
                    >
                      {getDayAbbreviation(day).substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Início</label>
                  <input
                    type="time"
                    value={editingChair.startTime || ''}
                    onChange={(e) => setEditingChair({ ...editingChair, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-krooa-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fim</label>
                  <input
                    type="time"
                    value={editingChair.endTime || ''}
                    onChange={(e) => setEditingChair({ ...editingChair, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-krooa-green"
                  />
                </div>
              </div>

              {/* Professionals Multi-Select */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Profissionais</label>
                <div
                  onClick={() => setIsProfessionalsDropdownOpen(!isProfessionalsDropdownOpen)}
                  className="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-krooa-green cursor-pointer"
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
                    <span className="text-gray-400">Selecione os profissionais</span>
                  )}
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

              {/* Specific Dates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    checked={hasSpecificDates}
                    onChange={(e) => setHasSpecificDates(e.target.checked)}
                    className="mr-2"
                  />
                  Data Específica
                </label>
                {hasSpecificDates && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-krooa-green"
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
                      <button className="px-3 py-2 bg-krooa-green text-white rounded-lg hover:bg-opacity-90">
                        Adicionar
                      </button>
                    </div>
                    {editingChair.specificDates?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {editingChair.specificDates.map((date: string, index: number) => (
                          <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm">
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
                )}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
              <div className="flex gap-3">
                <button
                  onClick={closeAside}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveChair}
                  className="flex-1 px-4 py-2 bg-krooa-green text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tooltip */}
      {tooltipData && (
        <div
          className="fixed z-[60] bg-gray-900/95 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl pointer-events-none"
          style={{
            left: `${tooltipData.x}px`,
            top: `${tooltipData.y - 80}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="text-xs space-y-1.5">
            <div className="font-semibold text-krooa-green">{tooltipData.slot.time}</div>
            {tooltipData.slot.date && (
              <div className="text-gray-300">
                Data: {Array.isArray(tooltipData.slot.date) ? tooltipData.slot.date.join(', ') : tooltipData.slot.date}
              </div>
            )}
            <div className="border-t border-gray-700 pt-1.5">
              <div className="text-gray-400 mb-1">Profissionais:</div>
              {tooltipData.slot.professionals.map((prof) => (
                <div key={prof.id} className="flex justify-between items-center">
                  <span>{prof.name}</span>
                  <span className="text-gray-400 ml-3">{prof.duration}min</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400 pt-1 italic">Clique para editar</div>
          </div>
        </div>
      )}

      {/* Delete Modals */}
      <Modal
        isOpen={deleteUnitModal.open}
        onClose={() => setDeleteUnitModal({ open: false, targetUnitId: null, sourceUnitId: null })}
        title="Excluir Unidade"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Deseja transferir os dados desta unidade para outra antes de excluí-la?
          </p>
          <Select
            value={deleteUnitModal.targetUnitId?.toString() || ''}
            onChange={(e) => setDeleteUnitModal({ ...deleteUnitModal, targetUnitId: parseInt(e.target.value) || null })}
            options={[
              { value: '', label: 'Não transferir dados' },
              ...unidades.filter(u => u.id !== deleteUnitModal.sourceUnitId).map(u => ({
                value: u.id.toString(),
                label: u.titulo
              }))
            ]}
            placeholder="Selecione uma unidade"
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteUnitModal({ open: false, targetUnitId: null, sourceUnitId: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteUnitModal.sourceUnitId) {
                  setUnidades(unidades.filter(u => u.id !== deleteUnitModal.sourceUnitId));
                  setDeleteUnitModal({ open: false, targetUnitId: null, sourceUnitId: null });
                }
              }}
            >
              Excluir
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
              variant="destructive"
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
            placeholder="Selecione um centro de custo"
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteCostCenterModal({ open: false, targetCostCenterId: null, sourceCostCenterId: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
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