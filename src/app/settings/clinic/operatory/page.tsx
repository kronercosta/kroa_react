import React, { useState } from 'react';
import { GripVertical, TrendingUp, TrendingDown, Minus, Trash2, Clock, X, Plus } from 'lucide-react';
import { Button, IconButton } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Card } from '../../../../components/ui/Card';
import { Switch } from '../../../../components/ui/Switch';
import { Table } from '../../../../components/ui/Table';
import { ConfiguracoesClinicaLayout } from '../ConfiguracoesClinicaLayout';
import { HeaderControls } from '../../../../components/ui/HeaderControls';
import { Aside } from '../../../../components/ui/Aside';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useClinic } from '../../../../contexts/ClinicContext';
import translations from './translation.json';

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
  duration?: string;
  professionals: Professional[];
}

interface Chair {
  id: number;
  name: string;
  unitId: number;
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

const CadeirasClinica: React.FC = () => {
  // Hook de traduções
  const { t } = useTranslation(translations);

  // Hook de unidades
  const { units } = useClinic();

  // Estados para Cadeiras
  const [chairs, setChairs] = useState<Chair[]>([
    {
      id: 1,
      name: 'CONSULT. 1',
      unitId: 1,
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
      unitId: 1,
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
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(true);

  // Estados do aside content
  const [hasSpecificDates, setHasSpecificDates] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  // Estados para modal de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chairToDelete, setChairToDelete] = useState<any>(null);
  const [transferToChair, setTransferToChair] = useState('');

  // Mock professionals list
  const professionals = [
    { id: '1', name: 'Dr. João Silva', duration: 30, email: 'joao.silva@clinica.com' },
    { id: '2', name: 'Dra. Maria Santos', duration: 45, email: 'maria.santos@clinica.com' },
    { id: '3', name: 'Dr. Pedro Costa', duration: 60, email: 'pedro.costa@clinica.com' },
    { id: '4', name: 'Dr. Carlos Lima', duration: 30, email: 'carlos.lima@clinica.com' },
    { id: '5', name: 'Dra. Ana Oliveira', duration: 40, email: 'ana.oliveira@clinica.com' }
  ];


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

  // Helper para formatar datas corretamente
  const formatDateDisplay = (date: string) => {
    if (!date) return '';
    try {
      // Se a data já está no formato dd/mm/yyyy, use diretamente
      if (date.includes('/')) {
        return date;
      }
      // Se está no formato yyyy-mm-dd, converta
      if (date.includes('-') && date.length === 10) {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
      }
      return date;
    } catch {
      return date; // Retorna a data original se houver erro
    }
  };

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
          unitId: chair.unitId,
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
        unitId: units[0]?.id || 1,
        slots: {},
        selectedDays: [],
        startTime: '',
        endTime: '',
        duration: '',
        selectedProfessionals: [],
        specificDates: []
      });
    }
    setIsAsideOpen(true);
  };

  const closeAside = () => {
    setIsAsideOpen(false);
    setEditingChair({});
  };

  const saveChair = () => {
    if (!editingChair.name?.trim()) {
      alert(t.aside?.pleaseEnterName || 'Por favor, preencha o nome da cadeira');
      return;
    }

    if (editingChair.id) {
      // Update existing chair
      setChairs(chairs.map((chair: any) => {
        if (chair.id === editingChair.id) {
          return { ...chair, name: editingChair.name, unitId: editingChair.unitId, slots: editingChair.slots };
        }
        return chair;
      }));
    } else {
      // Add new chair
      const newChair: Chair = {
        id: Date.now(),
        name: editingChair.name,
        unitId: editingChair.unitId || units[0]?.id || 1,
        order: chairs.length + 1,
        slots: editingChair.slots || {},
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

  const editSlot = (chairId: number) => {
    const chair = chairs.find(c => c.id === chairId);
    if (chair) {
      openAside(chairId);
    }
  };

  const handleDeleteChair = () => {
    setChairToDelete(editingChair);
    setShowDeleteModal(true);
  };

  const confirmDeleteChair = () => {
    if (chairToDelete) {
      // Aqui você implementaria a lógica de transferência dos registros
      if (transferToChair) {
        console.log(`Transferindo registros da cadeira ${chairToDelete.name} para a cadeira ${transferToChair}`);
        // Implementar lógica de transferência
      }

      // Remove a cadeira
      setChairs(chairs.filter(c => c.id !== chairToDelete.id));

      // Fecha o modal e o aside
      setShowDeleteModal(false);
      setChairToDelete(null);
      setTransferToChair('');
      closeAside();
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'good':
        return (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{t.statusIndicator?.good || 'Adequada'}</span>
          </div>
        );
      case 'warning':
        return (
          <div className="flex items-center gap-1 text-yellow-600 text-xs">
            <TrendingDown className="w-3 h-3" />
            <span>{t.statusIndicator?.warning || 'Diminuir'}</span>
          </div>
        );
      case 'critical':
        return (
          <div className="flex items-center gap-1 text-red-600 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>{t.statusIndicator?.critical || 'Aumentar'}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Minus className="w-3 h-3" />
            <span>{t.statusIndicator?.noData || 'Sem dados'}</span>
          </div>
        );
    }
  };

  return (
    <ConfiguracoesClinicaLayout>
      <div className="w-full max-w-full">
        {/* Status da Configuração */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{t.statusCard?.title || 'Status da Configuração'}</h3>
            <p className="text-sm text-gray-600">{t.statusCard?.subtitle || 'Baseado nos agendamentos das últimas 4 semanas'}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{t.statusCard?.status?.good || 'Adequada'}</p>
            <p className="text-xs text-gray-500">2 {t.statusCard?.chairsAnalyzed || 'cadeiras analisadas'}</p>
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
              <h3 className="font-semibold text-gray-900">{t.analysis?.title || 'Análise dos Dados'}</h3>
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
                  <h4 className="font-medium text-gray-900 mb-1">CONSULT. 2 {t.analysis?.lowUtilization || 'com baixa utilização'}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {t.analysis?.basedOnLast4Weeks || 'Baseado nos agendamentos das últimas 4 semanas'}: <strong>8 {t.analysis?.appointmentsPerWeek || 'agendamentos/semana'}</strong> {t.analysis?.for || 'para'} <strong>20 {t.analysis?.slotsAvailable || 'slots disponíveis'}</strong> (40% {t.analysis?.occupancy || 'de ocupação'}).
                  </p>
                  <p className="text-sm font-medium text-orange-700">{t.analysis?.suggestion || '💡 Sugestão: Considere reduzir os horários disponíveis desta cadeira.'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Card className="w-full max-w-full overflow-hidden mt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900">{t.pageTitle || 'Configuração de Cadeiras'}</h2>
            <p className="text-sm text-gray-600 mt-1">{t.pageSubtitle || 'Configure horários e profissionais para cada cadeira'}</p>
          </div>
          <div className="flex-shrink-0">
            <Button onClick={() => openAside()} variant="primary" size="sm" className="w-full sm:w-auto">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t.buttons?.newChair || 'Nova Cadeira'}
            </Button>
          </div>
        </div>

        <Table
          responsive="cards"
          mobileBreakpoint="md"
          columns={[
            {
              key: 'order',
              title: t.table?.columns?.order || 'Ordem',
              width: '100px',
              render: (_, row, index) => (
                <div
                  className="flex items-center gap-2"
                  draggable
                  onDragStart={(e) => handleDragStart(e as any, index)}
                  onDragOver={(e) => handleDragOver(e as any, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e as any, index)}
                >
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <span className="font-medium">{row.order}</span>
                </div>
              )
            },
            {
              key: 'name',
              title: t.table?.columns?.name || 'Nome',
              render: (_, row) => (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{row.name}</span>
                  {getStatusIndicator(row.metrics.status)}
                </div>
              )
            },
            {
              key: 'unit',
              title: t.table?.columns?.unit || 'Unidade',
              render: (_, row) => {
                const unit = units.find(u => u.id === row.unitId);
                return (
                  <span className="text-sm text-gray-600">
                    {unit?.titulo || 'N/A'}
                  </span>
                );
              }
            },
            {
              key: 'seg',
              title: t.table?.columns?.mon || 'Seg',
              align: 'center',
              render: (_, row) => (
                <div className="space-y-1.5 flex flex-col items-center">
                  {row.slots['seg']?.map((slot: any) => {
                    const professionalCount = slot.professionals?.length || 1;
                    const hasDate = slot.date && !Array.isArray(slot.date);
                    return (
                      <div
                        key={slot.id}
                        onClick={() => editSlot(row.id)}
                        className={`relative inline-flex flex-col items-start justify-center min-w-[70px] px-2 py-1.5 rounded-md cursor-pointer transition-all border hover:shadow-sm ${
                          hasDate
                            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                            : 'bg-krooa-green/10 border-krooa-green/30 hover:bg-krooa-green/20 hover:border-krooa-green/50'
                        }`}
                      >
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
              )
            },
            {
              key: 'ter',
              title: t.table?.columns?.tue || 'Ter',
              align: 'center',
              render: (_, row) => (
                <div className="space-y-1.5 flex flex-col items-center">
                  {row.slots['ter']?.map((slot: any) => {
                    const professionalCount = slot.professionals?.length || 1;
                    const hasDate = slot.date && !Array.isArray(slot.date);
                    return (
                      <div
                        key={slot.id}
                        onClick={() => editSlot(row.id)}
                        className={`relative inline-flex flex-col items-start justify-center min-w-[70px] px-2 py-1.5 rounded-md cursor-pointer transition-all border hover:shadow-sm ${
                          hasDate
                            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                            : 'bg-krooa-green/10 border-krooa-green/30 hover:bg-krooa-green/20 hover:border-krooa-green/50'
                        }`}
                      >
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
              )
            },
            {
              key: 'qua',
              title: t.table?.columns?.wed || 'Qua',
              align: 'center',
              render: (_, row) => (
                <div className="space-y-1.5 flex flex-col items-center">
                  {row.slots['qua']?.map((slot: any) => {
                    const professionalCount = slot.professionals?.length || 1;
                    const hasDate = slot.date && !Array.isArray(slot.date);
                    return (
                      <div
                        key={slot.id}
                        onClick={() => editSlot(row.id)}
                        className={`relative inline-flex flex-col items-start justify-center min-w-[70px] px-2 py-1.5 rounded-md cursor-pointer transition-all border hover:shadow-sm ${
                          hasDate
                            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                            : 'bg-krooa-green/10 border-krooa-green/30 hover:bg-krooa-green/20 hover:border-krooa-green/50'
                        }`}
                      >
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
              )
            },
            {
              key: 'qui',
              title: t.table?.columns?.thu || 'Qui',
              align: 'center',
              render: (_, row) => (
                <div className="space-y-1.5 flex flex-col items-center">
                  {row.slots['qui']?.map((slot: any) => {
                    const professionalCount = slot.professionals?.length || 1;
                    const hasDate = slot.date && !Array.isArray(slot.date);
                    return (
                      <div
                        key={slot.id}
                        onClick={() => editSlot(row.id)}
                        className={`relative inline-flex flex-col items-start justify-center min-w-[70px] px-2 py-1.5 rounded-md cursor-pointer transition-all border hover:shadow-sm ${
                          hasDate
                            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                            : 'bg-krooa-green/10 border-krooa-green/30 hover:bg-krooa-green/20 hover:border-krooa-green/50'
                        }`}
                      >
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
              )
            },
            {
              key: 'sex',
              title: t.table?.columns?.fri || 'Sex',
              align: 'center',
              render: (_, row) => (
                <div className="space-y-1.5 flex flex-col items-center">
                  {row.slots['sex']?.map((slot: any) => {
                    const professionalCount = slot.professionals?.length || 1;
                    const hasDate = slot.date && !Array.isArray(slot.date);
                    return (
                      <div
                        key={slot.id}
                        onClick={() => editSlot(row.id)}
                        className={`relative inline-flex flex-col items-start justify-center min-w-[70px] px-2 py-1.5 rounded-md cursor-pointer transition-all border hover:shadow-sm ${
                          hasDate
                            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                            : 'bg-krooa-green/10 border-krooa-green/30 hover:bg-krooa-green/20 hover:border-krooa-green/50'
                        }`}
                      >
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
              )
            },
            {
              key: 'sab',
              title: t.table?.columns?.sat || 'Sáb',
              align: 'center',
              render: (_, row) => (
                <div className="space-y-1.5 flex flex-col items-center">
                  {row.slots['sab']?.map((slot: any) => {
                    const professionalCount = slot.professionals?.length || 1;
                    const hasDate = slot.date && !Array.isArray(slot.date);
                    return (
                      <div
                        key={slot.id}
                        onClick={() => editSlot(row.id)}
                        className={`relative inline-flex flex-col items-start justify-center min-w-[70px] px-2 py-1.5 rounded-md cursor-pointer transition-all border hover:shadow-sm ${
                          hasDate
                            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                            : 'bg-krooa-green/10 border-krooa-green/30 hover:bg-krooa-green/20 hover:border-krooa-green/50'
                        }`}
                      >
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
              )
            },
            {
              key: 'dom',
              title: t.table?.columns?.sun || 'Dom',
              align: 'center',
              render: (_, row) => (
                <div className="space-y-1.5 flex flex-col items-center">
                  {row.slots['dom']?.map((slot: any) => {
                    const professionalCount = slot.professionals?.length || 1;
                    const hasDate = slot.date && !Array.isArray(slot.date);
                    return (
                      <div
                        key={slot.id}
                        onClick={() => editSlot(row.id)}
                        className={`relative inline-flex flex-col items-start justify-center min-w-[70px] px-2 py-1.5 rounded-md cursor-pointer transition-all border hover:shadow-sm ${
                          hasDate
                            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                            : 'bg-krooa-green/10 border-krooa-green/30 hover:bg-krooa-green/20 hover:border-krooa-green/50'
                        }`}
                      >
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
              )
            }
          ]}
          data={chairs}
          hoverable
          sticky
        />
      </Card>

      {/* Aside Panel for Chair Configuration */}
      <Aside
        isOpen={isAsideOpen}
        onClose={closeAside}
        onSave={saveChair}
        title={editingChair.id ? (t.aside?.titleEdit || 'Editar Cadeira') : (t.aside?.titleNew || 'Nova Cadeira')}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">{t.aside?.configureSchedules || 'Configurar Horários'}</h3>
            {editingChair?.id && (
              <IconButton
                onClick={handleDeleteChair}
                variant="ghost"
                size="md"
                className="text-red-600 hover:bg-red-100"
                title="Excluir cadeira"
              >
                <Trash2 className="w-5 h-5" />
              </IconButton>
            )}
          </div>

          {/* Nome da Cadeira */}
          <div>
            <Input
              label={t.aside?.chairName || 'Nome da Cadeira'}
              value={editingChair.name || ''}
              onChange={(value) => setEditingChair({ ...editingChair, name: value })}
              floating
              fullWidth
            />
          </div>

          {/* Unidade */}
          <div>
            <Select
              label={t.aside?.unit || 'Unidade'}
              value={editingChair.unitId?.toString() || ''}
              onChange={(e) => setEditingChair({
                ...editingChair,
                unitId: parseInt(Array.isArray(e.target.value) ? e.target.value[0] : e.target.value)
              })}
              options={units.map(unit => ({
                value: unit.id.toString(),
                label: unit.titulo
              }))}
              disabled={units.length <= 1}
              required
              fullWidth
            />
            {units.length <= 1 && (
              <p className="text-xs text-gray-500 mt-1">
                {t.aside?.singleUnit || 'Cadeira será vinculada à única unidade disponível'}
              </p>
            )}
          </div>

          {/* Toggle de Datas Específicas */}
          <div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
              <div>
                <label className="text-sm font-medium text-gray-700">{t.aside?.specificDates || 'Datas Específicas'}</label>
                <p className="text-xs text-gray-600">{t.aside?.specificDatesDescription || 'Configurar para datas específicas ao invés de dias da semana'}</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.aside?.daysOfWeek || 'Dias da Semana'}</label>
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
                        ? 'bg-krooa-blue text-white border-krooa-blue shadow-lg scale-105'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-krooa-blue hover:bg-krooa-blue/5 hover:text-krooa-blue hover:shadow-md hover:scale-105'
                    }`}
                  >
                    {getDayAbbreviation(day).substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.aside?.specificDatesList || 'Datas Específicas'}</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                    <Input
                      label="Data Específica"
                      mask="datepicker"
                      validation="none"
                      required={false}
                      disabled={false}
                      fullWidth={true}
                      value={selectedDate}
                      onChange={(value, isValid, data) => setSelectedDate(value)}
                      excludedDates={editingChair.specificDates || []}
                    />
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
                      size="sm"
                    >
                      {t.buttons?.add || 'Adicionar'}
                    </Button>
                  </div>
                {editingChair.specificDates?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingChair.specificDates.map((date: string, index: number) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-krooa-green/10 text-krooa-dark rounded-lg text-sm">
                        {formatDateDisplay(date)}
                        <IconButton
                          onClick={() => {
                            setEditingChair({
                              ...editingChair,
                              specificDates: editingChair.specificDates.filter((_: string, i: number) => i !== index)
                            });
                          }}
                          variant="ghost"
                          size="sm"
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </IconButton>
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
              <Input
                mask="timepicker"
                label={t.aside?.startTime || 'Início'}
                value={editingChair.startTime || ''}
                onChange={(value) => setEditingChair({ ...editingChair, startTime: value })}
                floating
                fullWidth
                timeIntervals={30}
                timeStart="06:00"
                timeEnd="22:00"
              />

            </div>

            <Input
              mask="timepicker"
              label={t.aside?.endTime || 'Fim'}
              value={editingChair.endTime || ''}
              onChange={(value) => setEditingChair({ ...editingChair, endTime: value })}
              floating
              fullWidth
              timeIntervals={30}
              timeStart="06:00"
              timeEnd="22:00"
            />
          </div>

          {/* Duração dos Atendimentos */}
          <Input
            label={t.aside?.duration || 'Duração dos Atendimentos'}
            mask="timepicker"
            validation="none"
            required={false}
            disabled={false}
            fullWidth={true}
            timeIntervals={30}
            timeStart="00:30"
            timeEnd="04:00"
            value={editingChair.duration || ''}
            onChange={(value) => setEditingChair({ ...editingChair, duration: value })}
          />

          {/* Professionals Select */}
          <Select
            label={t.aside?.professionals || 'Profissionais'}
            options={professionals.map(prof => ({
              value: prof.id,
              label: prof.name
            }))}
            value={editingChair.selectedProfessionals || []}
            onChange={(e) => {
              const value = e.target.value;
              setEditingChair({
                ...editingChair,
                selectedProfessionals: Array.isArray(value) ? value : [value]
              });
            }}
            multiple
            fullWidth
          />

          {/* Botão Adicionar Horário */}
          <Button
            variant="primary"
            size="sm"
            fullWidth
              onClick={() => {
                if (editingChair.startTime && editingChair.endTime && editingChair.duration) {
                  const newSlot = {
                    id: `${editingChair.id || 'new'}-${Date.now()}`,
                    time: `${editingChair.startTime}-${editingChair.endTime}`,
                    duration: editingChair.duration,
                    professionals: editingChair.selectedProfessionals?.map((profId: string) =>
                      professionals.find(p => p.id === profId)
                    ).filter(Boolean) || [],
                    days: hasSpecificDates ? [] : editingChair.selectedDays,
                    dates: hasSpecificDates ? editingChair.specificDates : []
                  };

                  const newSlots = { ...editingChair.slots };
                  if (hasSpecificDates) {
                    editingChair.selectedDays?.forEach((day: string) => {
                      if (!newSlots[day]) newSlots[day] = [];
                      newSlots[day].push(newSlot);
                    });
                  } else {
                    editingChair.selectedDays?.forEach((day: string) => {
                      if (!newSlots[day]) newSlots[day] = [];
                      newSlots[day].push(newSlot);
                    });
                  }

                  setEditingChair({
                    ...editingChair,
                    slots: newSlots,
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
              {t.buttons?.addSchedule || 'Adicionar Horário'}
            </Button>

          {/* Tabela de Horários */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{t.aside?.schedulesConfigured || 'Horários Configurados'}</h4>

            {(!editingChair.slots || Object.keys(editingChair.slots || {}).length === 0) ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">{t.aside?.noSchedules || 'Nenhum horário configurado'}</p>
                <p className="text-xs text-gray-500">{t.aside?.noSchedulesDescription || 'Configure os campos acima e clique em "Adicionar Horário"'}</p>
              </div>
            ) : (
              <Table
                responsive="stack"
                mobileBreakpoint="md"
                columns={[
                  {
                    key: 'day',
                    title: t.schedulesTable?.dayDate || 'Dia/Data',
                    render: (_, row) => (
                      <div>
                        <span className="font-medium text-krooa-blue">
                          {getDayAbbreviation(row.day)}
                        </span>
                        {row.date && (
                          <span className="ml-2 text-xs text-krooa-blue/70">
                            ({Array.isArray(row.date) ? row.date.join(', ') : row.date})
                          </span>
                        )}
                      </div>
                    )
                  },
                  {
                    key: 'time',
                    title: t.schedulesTable?.time || 'Horário'
                  },
                  {
                    key: 'duration',
                    title: t.schedulesTable?.duration || 'Duração',
                    render: (value) => `${value || '30'} min`
                  },
                  {
                    key: 'professionals',
                    title: t.schedulesTable?.professionals || 'Profissionais',
                    render: (value) => (
                      <div className="flex flex-wrap gap-1">
                        {value?.map((prof: any) => (
                          <span key={prof.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-krooa-green/10 text-krooa-dark">
                            {prof.name}
                          </span>
                        ))}
                      </div>
                    )
                  },
                  {
                    key: 'actions',
                    title: t.schedulesTable?.actions || 'Ações',
                    align: 'center',
                    render: (_, row) => (
                      <div className="flex items-center justify-center gap-2">
                        <IconButton
                          onClick={() => {
                            // Extrair dados do slot para edição
                            const [startTime, endTime] = row.time.split('-');

                            // Atualizar o estado com os dados do slot para edição
                            setEditingChair({
                              ...editingChair,
                              startTime: startTime.trim(),
                              endTime: endTime.trim(),
                              duration: row.duration || '30',
                              selectedProfessionals: row.professionals?.map((p: any) => p.id) || [],
                              selectedDays: [row.day],
                              specificDates: row.date ? (Array.isArray(row.date) ? row.date : [row.date]) : []
                            });

                            // Se tem data específica, ativar o toggle
                            if (row.date) {
                              setHasSpecificDates(true);
                            } else {
                              setHasSpecificDates(false);
                            }

                            // Remover o slot atual para permitir nova adição
                            const newSlots = { ...editingChair.slots };
                            if (newSlots[row.day]) {
                              newSlots[row.day] = newSlots[row.day].filter((s: any) => s.id !== row.id);
                              if (newSlots[row.day].length === 0) {
                                delete newSlots[row.day];
                              }
                            }
                            setEditingChair((prev: any) => ({ ...prev, slots: newSlots }));
                          }}
                          variant="ghost"
                          size="sm"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            const newSlots = { ...editingChair.slots };
                            newSlots[row.day] = newSlots[row.day].filter((s: any) => s.id !== row.id);
                            if (newSlots[row.day].length === 0) {
                              delete newSlots[row.day];
                            }
                            setEditingChair({ ...editingChair, slots: newSlots });
                          }}
                          variant="danger"
                          size="sm"
                          title="Excluir"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </IconButton>
                      </div>
                    )
                  }
                ]}
                data={
                  editingChair.slots
                    ? Object.entries(editingChair.slots).flatMap(([day, slots]: [string, any]) =>
                        slots.map((slot: any) => ({ ...slot, day }))
                      )
                    : []
                }
                hoverable
              />
            )}
          </div>
        </div>
      </Aside>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Excluir Cadeira
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setChairToDelete(null);
                  setTransferToChair('');
                }}
                className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <div className="space-y-4">
                {/* Alert */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold text-amber-800">
                        Esta ação não pode ser desfeita
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Tem certeza que deseja excluir a cadeira "{chairToDelete?.name}"?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transferência */}
                {chairs.filter(c => c.id !== chairToDelete?.id).length > 0 && (
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">
                      Os agendamentos existentes nesta cadeira podem ser transferidos para:
                    </p>

                    <Select
                      options={chairs
                        .filter(c => c.id !== chairToDelete?.id)
                        .map(chair => ({
                          value: chair.id.toString(),
                          label: chair.name
                        }))}
                      value={transferToChair}
                      onChange={(e) => setTransferToChair(Array.isArray(e.target.value) ? e.target.value[0] : e.target.value)}
                      placeholder="Selecione uma cadeira para transferir os agendamentos"
                      fullWidth
                    />

                    <p className="text-xs text-gray-500">
                      Se não selecionar uma cadeira, os agendamentos serão perdidos.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer com botões */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setChairToDelete(null);
                    setTransferToChair('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmDeleteChair}
                >
                  Excluir Cadeira
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </ConfiguracoesClinicaLayout>
  );
};

export default CadeirasClinica;
