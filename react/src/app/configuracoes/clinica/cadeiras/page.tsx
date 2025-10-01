import React, { useState, useEffect } from 'react';
import { GripVertical, TrendingUp, TrendingDown, Minus, Trash2, Clock, X, Plus } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Switch } from '../../../../components/ui/Switch';
import { MultiSelect } from '../../../../components/ui/MultiSelect';
import { ConfiguracoesLayout } from '../../../../layouts/ConfiguracoesLayout';
import { Aside } from '../../../../components/ui/Aside';

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
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(true);

  // Estados do aside content
  const [hasSpecificDates, setHasSpecificDates] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showStartTimeDropdown, setShowStartTimeDropdown] = useState(false);
  const [showEndTimeDropdown, setShowEndTimeDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);

  // Mock professionals list
  const professionals = [
    { id: '1', name: 'Dr. João Silva', duration: 30, email: 'joao.silva@clinica.com' },
    { id: '2', name: 'Dra. Maria Santos', duration: 45, email: 'maria.santos@clinica.com' },
    { id: '3', name: 'Dr. Pedro Costa', duration: 60, email: 'pedro.costa@clinica.com' },
    { id: '4', name: 'Dr. Carlos Lima', duration: 30, email: 'carlos.lima@clinica.com' },
    { id: '5', name: 'Dra. Ana Oliveira', duration: 40, email: 'ana.oliveira@clinica.com' }
  ];

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
          return { ...chair, name: editingChair.name, slots: editingChair.slots };
        }
        return chair;
      }));
    } else {
      // Add new chair
      const newChair: Chair = {
        id: Date.now(),
        name: editingChair.name,
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

  return (
    <ConfiguracoesLayout>
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
                            const professionalCount = slot.professionals?.length || 1;
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

      {/* Aside Panel for Chair Configuration */}
      <Aside
        isOpen={isAsideOpen}
        onClose={closeAside}
        onSave={saveChair}
        title={editingChair.id ? 'Editar Cadeira' : 'Nova Cadeira'}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Configurar Horários</h3>
            {editingChair?.id && (
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir esta cadeira?')) {
                    setChairs(chairs.filter(c => c.id !== editingChair.id));
                    closeAside();
                  }
                }}
                className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                title="Excluir cadeira"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
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

                  if (value.length >= 3) {
                    value = value.slice(0, 2) + ':' + value.slice(2, 4);
                  }

                  const parts = value.split(':');
                  if (parts[0] && parseInt(parts[0]) > 23) {
                    value = '23' + (parts[1] ? ':' + parts[1] : '');
                  }
                  if (parts[1] && parseInt(parts[1]) > 59) {
                    value = parts[0] + ':59';
                  }

                  setEditingChair({ ...editingChair, startTime: value });
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

              {showStartTimeDropdown && (
                <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                  {Array.from({ length: 48 }, (_, i) => {
                    const hour = Math.floor(i / 2);
                    const minute = i % 2 === 0 ? '00' : '30';
                    const time = `${hour.toString().padStart(2, '0')}:${minute}`;

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

                  if (value.length >= 3) {
                    value = value.slice(0, 2) + ':' + value.slice(2, 4);
                  }

                  const parts = value.split(':');
                  if (parts[0] && parseInt(parts[0]) > 23) {
                    value = '23' + (parts[1] ? ':' + parts[1] : '');
                  }
                  if (parts[1] && parseInt(parts[1]) > 59) {
                    value = parts[0] + ':59';
                  }

                  setEditingChair({ ...editingChair, endTime: value });
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

              {showEndTimeDropdown && (
                <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                  {Array.from({ length: 48 }, (_, i) => {
                    const hour = Math.floor(i / 2);
                    const minute = i % 2 === 0 ? '00' : '30';
                    const time = `${hour.toString().padStart(2, '0')}:${minute}`;

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

                if (value.length < (editingChair.duration || '').length) {
                  setEditingChair({ ...editingChair, duration: value });
                  setShowDurationDropdown(true);
                  return;
                }

                value = value.replace(/[^\d:]/g, '');

                if (value.includes(':')) {
                  const parts = value.split(':');
                  if (parts.length > 2) {
                    value = parts[0] + ':' + parts[1];
                  }
                  if (parts[1] && parseInt(parts[1]) > 59) {
                    value = parts[0] + ':59';
                  }
                } else {
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

            {showDurationDropdown && (
              <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                {[15, 20, 30, 45, 60, 75, 90, 120, 150, 180].map((minutes) => {
                  const hours = Math.floor(minutes / 60);
                  const mins = minutes % 60;
                  const timeStr = `${hours}:${mins.toString().padStart(2, '0')}`;
                  const label = hours > 0
                    ? `${hours}h${mins > 0 ? ` ${mins}min` : ''}`
                    : `${mins}min`;

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
              Adicionar Horário
            </Button>
          </div>

          {/* Tabela de Horários */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Horários Configurados</h4>

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

                                  if (slot.date) {
                                    setHasSpecificDates(true);
                                  }

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
      </Aside>
    </ConfiguracoesLayout>
  );
};

export default CadeirasClinica;
