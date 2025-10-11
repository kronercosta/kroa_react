"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay, addDays, setHours, setMinutes, isWeekend, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Clock, User, Users, ChevronLeft, ChevronRight, Calendar as CalendarIconLucide } from 'lucide-react';
import Swal from 'sweetalert2';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { TextArea } from '../../components/ui/TextArea';
import { useUITranslation } from '../../hooks/useUITranslation';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './schedule.css';

// Configuração do localizador para português
const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Calendar com Drag and Drop
const DnDCalendar = withDragAndDrop(Calendar);

// Tipos
interface AppointmentEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  patient?: string;
  professional?: string;
  type?: string;
}

interface Patient {
  id: number;
  name: string;
}

interface Professional {
  id: number;
  name: string;
  specialty: string;
  workingHours: {
    start: string;
    end: string;
  };
}

// Dados mockados - substituir por API real
const mockPatients: Patient[] = [
  { id: 1, name: 'João Silva' },
  { id: 2, name: 'Maria Santos' },
  { id: 3, name: 'Pedro Oliveira' },
  { id: 4, name: 'Ana Costa' },
  { id: 5, name: 'Kroner Costa' },
];

const mockProfessionals: Professional[] = [
  { id: 1, name: 'Dr. Carlos Medeiros', specialty: 'Dentista', workingHours: { start: '08:00', end: '18:00' } },
  { id: 2, name: 'Dra. Fernanda Lima', specialty: 'Ortodontista', workingHours: { start: '09:00', end: '17:00' } },
  { id: 3, name: 'Dr. Roberto Alves', specialty: 'Endodontista', workingHours: { start: '08:00', end: '16:00' } },
];

// Feriados brasileiros de 2025
const holidays = [
  new Date(2025, 0, 1),   // Ano Novo
  new Date(2025, 3, 18),  // Sexta-feira Santa
  new Date(2025, 3, 21),  // Tiradentes
  new Date(2025, 4, 1),   // Dia do Trabalho
  new Date(2025, 8, 7),   // Independência
  new Date(2025, 9, 12),  // Nossa Senhora Aparecida
  new Date(2025, 10, 2),  // Finados
  new Date(2025, 10, 15), // Proclamação da República
  new Date(2025, 11, 25), // Natal
];

export default function SchedulePage() {
  const uiTranslations = useUITranslation();
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(new Date().getMonth());
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<AppointmentEvent[]>([
    {
      id: 1,
      title: 'João Silva - Dr. Carlos',
      start: new Date(2025, 9, 11, 10, 0),
      end: new Date(2025, 9, 11, 11, 0),
      patient: 'João Silva',
      professional: 'Dr. Carlos Medeiros',
      type: 'Consulta',
    },
    {
      id: 2,
      title: 'Maria Santos - Dra. Fernanda',
      start: new Date(2025, 9, 11, 14, 0),
      end: new Date(2025, 9, 11, 15, 0),
      patient: 'Maria Santos',
      professional: 'Dra. Fernanda Lima',
      type: 'Retorno',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [formData, setFormData] = useState({
    patientId: '',
    professionalId: '',
    type: 'Consulta',
    notes: '',
  });

  // Fechar datepicker ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  // Verificar se é feriado
  const isHoliday = (date: Date) => {
    return holidays.some(holiday => isSameDay(holiday, date));
  };

  // Gerar horários disponíveis
  const generateAvailableSlots = useCallback((professionalId: string, selectedDate: Date) => {
    if (!professionalId) return [];

    const professional = mockProfessionals.find(p => p.id === parseInt(professionalId));
    if (!professional) return [];

    // Verificar se é fim de semana ou feriado
    if (isWeekend(selectedDate) || isHoliday(selectedDate)) {
      return [];
    }

    const [startHour, startMinute] = professional.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = professional.workingHours.end.split(':').map(Number);

    const slots = [];
    let currentTime = setMinutes(setHours(selectedDate, startHour), startMinute);
    const endTime = setMinutes(setHours(selectedDate, endHour), endMinute);

    while (currentTime < endTime) {
      // Verificar se o horário já está ocupado
      const isOccupied = events.some(event =>
        event.professional === professional.name &&
        isSameDay(event.start, selectedDate) &&
        event.start.getHours() === currentTime.getHours() &&
        event.start.getMinutes() === currentTime.getMinutes()
      );

      if (!isOccupied) {
        slots.push(format(currentTime, 'HH:mm'));
      }

      currentTime = addDays(currentTime, 0);
      currentTime = setMinutes(currentTime, currentTime.getMinutes() + 60); // Intervalos de 1 hora
    }

    return slots;
  }, [events]);

  const availableSlots = useMemo(() => {
    if (selectedSlot && formData.professionalId) {
      return generateAvailableSlots(formData.professionalId, selectedSlot.start);
    }
    return [];
  }, [formData.professionalId, selectedSlot, generateAvailableSlots]);

  // Customização de cores dos eventos
  const eventStyleGetter = (event: AppointmentEvent) => {
    const style = {
      backgroundColor: '#30578D',
      borderRadius: '6px',
      opacity: 0.9,
      color: 'white',
      border: '0px',
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
    };
    return { style };
  };

  // Customização de datas (feriados e fins de semana)
  const dayPropGetter = (date: Date) => {
    if (isHoliday(date)) {
      return {
        style: {
          backgroundColor: '#fee2e2',
        },
      };
    }
    if (isWeekend(date)) {
      return {
        style: {
          backgroundColor: '#f9fafb',
        },
      };
    }
    return {};
  };

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setShowModal(true);
  }, []);

  const handleSelectEvent = useCallback((event: AppointmentEvent) => {
    alert(`Agendamento: ${event.title}\nPaciente: ${event.patient}\nProfissional: ${event.professional}`);
  }, []);

  // Função para arrastar e soltar eventos
  const handleEventDrop = useCallback(
    async ({ event, start, end }: { event: AppointmentEvent; start: Date; end: Date }) => {
      // Verificar se a nova data é fim de semana ou feriado
      if (isWeekend(start) || isHoliday(start)) {
        await Swal.fire({
          icon: 'error',
          title: 'Data Inválida',
          text: 'Não é possível agendar em fins de semana ou feriados',
          confirmButtonText: 'OK',
          confirmButtonColor: '#30578D',
        });
        return;
      }

      // Mostrar confirmação antes de mover o evento
      const result = await Swal.fire({
        icon: 'question',
        title: 'Confirmar alteração',
        html: `
          <div style="text-align: left; margin: 1rem 0;">
            <p style="margin-bottom: 0.5rem;"><strong>Agendamento:</strong> ${event.title}</p>
            <p style="margin-bottom: 0.5rem;"><strong>De:</strong> ${format(event.start, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            <p><strong>Para:</strong> ${format(start, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Sim, mover',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#30578D',
        cancelButtonColor: '#6b7280',
      });

      if (result.isConfirmed) {
        // Atualizar o evento com as novas datas
        const updatedEvents = events.map((ev) =>
          ev.id === event.id ? { ...ev, start, end } : ev
        );
        setEvents(updatedEvents);

        await Swal.fire({
          icon: 'success',
          title: 'Agendamento movido!',
          text: 'O horário foi alterado com sucesso.',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    },
    [events]
  );

  // Função para redimensionar eventos (alterar duração)
  const handleEventResize = useCallback(
    async ({ event, start, end }: { event: AppointmentEvent; start: Date; end: Date }) => {
      // Calcular duração antiga e nova
      const oldDuration = Math.abs(event.end.getTime() - event.start.getTime()) / (1000 * 60);
      const newDuration = Math.abs(end.getTime() - start.getTime()) / (1000 * 60);

      // Mostrar confirmação antes de redimensionar
      const result = await Swal.fire({
        icon: 'question',
        title: 'Confirmar alteração de duração',
        html: `
          <div style="text-align: left; margin: 1rem 0;">
            <p style="margin-bottom: 0.5rem;"><strong>Agendamento:</strong> ${event.title}</p>
            <p style="margin-bottom: 0.5rem;"><strong>Duração atual:</strong> ${oldDuration} minutos</p>
            <p style="margin-bottom: 0.5rem;"><strong>Nova duração:</strong> ${newDuration} minutos</p>
            <p><strong>Novo horário:</strong> ${format(start, "HH:mm", { locale: ptBR })} - ${format(end, "HH:mm", { locale: ptBR })}</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Sim, alterar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#30578D',
        cancelButtonColor: '#6b7280',
      });

      if (result.isConfirmed) {
        const updatedEvents = events.map((ev) =>
          ev.id === event.id ? { ...ev, start, end } : ev
        );
        setEvents(updatedEvents);

        await Swal.fire({
          icon: 'success',
          title: 'Duração alterada!',
          text: 'O horário foi atualizado com sucesso.',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    },
    [events]
  );

  const handleCreateAppointment = () => {
    if (!formData.patientId || !formData.professionalId || !selectedSlot) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const patient = mockPatients.find(p => p.id === parseInt(formData.patientId));
    const professional = mockProfessionals.find(p => p.id === parseInt(formData.professionalId));

    if (!patient || !professional) return;

    const newEvent: AppointmentEvent = {
      id: events.length + 1,
      title: `${patient.name} - ${professional.name}`,
      start: selectedSlot.start,
      end: selectedSlot.end,
      patient: patient.name,
      professional: professional.name,
      type: formData.type,
    };

    setEvents([...events, newEvent]);
    setShowModal(false);
    setFormData({
      patientId: '',
      professionalId: '',
      type: 'Consulta',
      notes: '',
    });
    setSelectedSlot(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      patientId: '',
      professionalId: '',
      type: 'Consulta',
      notes: '',
    });
    setSelectedSlot(null);
  };

  // Funções de navegação
  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (action === 'TODAY') {
      setDate(new Date());
    } else if (action === 'PREV') {
      const newDate = new Date(date);
      if (view === Views.MONTH) {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (view === Views.WEEK) {
        newDate.setDate(newDate.getDate() - 7);
      } else if (view === Views.DAY) {
        newDate.setDate(newDate.getDate() - 1);
      } else if (view === Views.AGENDA) {
        newDate.setMonth(newDate.getMonth() - 1);
      }
      setDate(newDate);
    } else if (action === 'NEXT') {
      const newDate = new Date(date);
      if (view === Views.MONTH) {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (view === Views.WEEK) {
        newDate.setDate(newDate.getDate() + 7);
      } else if (view === Views.DAY) {
        newDate.setDate(newDate.getDate() + 1);
      } else if (view === Views.AGENDA) {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      setDate(newDate);
    }
  };

  // Formatar label da data
  const getDateLabel = () => {
    if (view === Views.MONTH) {
      return format(date, 'MMMM yyyy', { locale: ptBR });
    } else if (view === Views.WEEK) {
      const start = startOfWeek(date, { locale: ptBR });
      const end = addDays(start, 6);
      return `${format(start, 'dd/MM/yyyy')} – ${format(end, 'dd/MM/yyyy')}`;
    } else if (view === Views.DAY) {
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } else if (view === Views.AGENDA) {
      // Na visualização de lista, mostrar um período de 1 mês
      const start = date;
      const end = addDays(start, 30);
      return `${format(start, 'dd/MM/yyyy')} – ${format(end, 'dd/MM/yyyy')}`;
    }
    return '';
  };

  // Funções do calendário
  const monthNames = uiTranslations?.calendar?.months || [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = uiTranslations?.calendar?.days || ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 50; i <= currentYear + 50; i++) {
      years.push(i);
    }
    return years;
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(pickerYear, pickerMonth, day);
    setDate(newDate);
    setShowDatePicker(false);
  };

  const isPickerToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      pickerMonth === today.getMonth() &&
      pickerYear === today.getFullYear()
    );
  };

  const isPickerSelected = (day: number) => {
    return (
      day === date.getDate() &&
      pickerMonth === date.getMonth() &&
      pickerYear === date.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(pickerMonth, pickerYear);
    const firstDay = getFirstDayOfMonth(pickerMonth, pickerYear);
    const days = [];

    // Empty cells for days before the month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(day)}
          className={`
            p-2 text-sm rounded-lg transition-all duration-200 font-medium min-h-[36px] flex items-center justify-center
            ${isPickerSelected(day)
              ? 'bg-gradient-to-br from-krooa-green to-krooa-dark text-white shadow-lg scale-110 ring-2 ring-krooa-green/30 font-bold'
              : isPickerToday(day)
                ? 'bg-krooa-green/15 text-krooa-dark border-2 border-krooa-green/60 font-semibold'
                : 'hover:bg-krooa-green/10 text-gray-700 hover:text-krooa-dark hover:scale-105'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  // Mensagens personalizadas (sem toolbar)
  const messages = {
    allDay: 'Dia inteiro',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Lista',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há agendamentos neste período.',
    showMore: (total: number) => `+ Ver mais (${total})`,
  };

  // Preparar opções para os selects
  const patientOptions = mockPatients.map(p => ({ value: p.id.toString(), label: p.name }));
  const professionalOptions = mockProfessionals.map(p => ({ value: p.id.toString(), label: `${p.name} - ${p.specialty}` }));
  const typeOptions = [
    { value: 'Consulta', label: 'Consulta' },
    { value: 'Retorno', label: 'Retorno' },
    { value: 'Avaliação', label: 'Avaliação' },
    { value: 'Procedimento', label: 'Procedimento' },
    { value: 'Emergência', label: 'Emergência' },
  ];

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Agenda</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie os agendamentos da clínica</p>
            </div>

            {/* Controles de navegação e visualização */}
            <div className="flex items-center gap-3 flex-wrap md:flex-row flex-col w-full md:w-auto">
              {/* Desktop: Navegação separada */}
              <div className="hidden md:flex items-center gap-2">
                <Button
                  onClick={() => handleNavigate('TODAY')}
                  variant="outline"
                  size="sm"
                >
                  Hoje
                </Button>
                <Button
                  onClick={() => handleNavigate('PREV')}
                  variant="outline"
                  size="sm"
                  icon={<ChevronLeft className="w-4 h-4" />}
                />
                <Button
                  onClick={() => handleNavigate('NEXT')}
                  variant="outline"
                  size="sm"
                  icon={<ChevronRight className="w-4 h-4" />}
                />
              </div>

              {/* Mobile: Navegação + Seletor juntos */}
              <div className="flex md:hidden items-center gap-2 w-full justify-between">
                <Button
                  onClick={() => handleNavigate('PREV')}
                  variant="outline"
                  size="sm"
                  icon={<ChevronLeft className="w-4 h-4" />}
                />

                {/* Seletor de visualização - Mobile */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 flex-1 max-w-xs justify-center">
                  <button
                    onClick={() => setView(Views.MONTH)}
                    className={`px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                      view === Views.MONTH
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Mês
                  </button>
                  <button
                    onClick={() => setView(Views.WEEK)}
                    className={`px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                      view === Views.WEEK
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Sem
                  </button>
                  <button
                    onClick={() => setView(Views.DAY)}
                    className={`px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                      view === Views.DAY
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Dia
                  </button>
                  <button
                    onClick={() => setView(Views.AGENDA)}
                    className={`px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                      view === Views.AGENDA
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Lista
                  </button>
                </div>

                <Button
                  onClick={() => handleNavigate('NEXT')}
                  variant="outline"
                  size="sm"
                  icon={<ChevronRight className="w-4 h-4" />}
                />
              </div>

              {/* DatePicker - Seletor de Data */}
              <div ref={datePickerRef} className="w-full md:w-auto relative order-first md:order-none">
                <div
                  className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 w-full text-center cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    setShowDatePicker(!showDatePicker);
                    if (!showDatePicker) {
                      // Sincronizar o calendário com a data atual quando abrir
                      setPickerMonth(date.getMonth());
                      setPickerYear(date.getFullYear());
                    }
                  }}
                >
                  <CalendarIconLucide className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-900 capitalize">
                    {getDateLabel()}
                  </span>
                </div>

                {/* Calendar Dropdown */}
                {showDatePicker && (
                  <div className="absolute top-full mt-2 z-50 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-xl" style={{ minWidth: '300px' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          if (pickerMonth === 0) {
                            setPickerMonth(11);
                            setPickerYear(pickerYear - 1);
                          } else {
                            setPickerMonth(pickerMonth - 1);
                          }
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>

                      <div className="flex items-center gap-2 flex-1 justify-center">
                        <select
                          value={pickerMonth}
                          onChange={(e) => setPickerMonth(parseInt(e.target.value))}
                          className="pl-2 pr-6 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-krooa-green bg-white cursor-pointer font-medium text-krooa-dark min-w-[90px]"
                        >
                          {monthNames.map((month: string, index: number) => (
                            <option key={index} value={index}>{month.substring(0, 3)}</option>
                          ))}
                        </select>

                        <select
                          value={pickerYear}
                          onChange={(e) => setPickerYear(parseInt(e.target.value))}
                          className="pl-2 pr-6 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-krooa-green bg-white cursor-pointer font-medium text-krooa-dark"
                        >
                          {generateYears().map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (pickerMonth === 11) {
                            setPickerMonth(0);
                            setPickerYear(pickerYear + 1);
                          } else {
                            setPickerMonth(pickerMonth + 1);
                          }
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Days of week */}
                    <div className="grid grid-cols-7 gap-1 p-2 bg-gray-50/50">
                      {dayNames.map((day: string) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1 p-2">
                      {renderCalendarDays()}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center p-3 border-t border-gray-100 bg-gray-50/50">
                      <button
                        type="button"
                        onClick={() => {
                          setShowDatePicker(false);
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date();
                          setDate(today);
                          setPickerMonth(today.getMonth());
                          setPickerYear(today.getFullYear());
                          setShowDatePicker(false);
                        }}
                        className="px-3 py-1 text-sm text-krooa-dark hover:text-blue-900 transition-colors font-medium"
                      >
                        Hoje
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão Hoje - Mobile */}
              <div className="flex md:hidden w-full justify-center">
                <Button
                  onClick={() => handleNavigate('TODAY')}
                  variant="outline"
                  size="sm"
                  fullWidth
                  className="max-w-xs"
                >
                  Hoje
                </Button>
              </div>

              {/* Seletor de visualização - Desktop */}
              <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView(Views.MONTH)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    view === Views.MONTH
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mês
                </button>
                <button
                  onClick={() => setView(Views.WEEK)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    view === Views.WEEK
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Semana
                </button>
                <button
                  onClick={() => setView(Views.DAY)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    view === Views.DAY
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dia
                </button>
                <button
                  onClick={() => setView(Views.AGENDA)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    view === Views.AGENDA
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Lista
                </button>
              </div>

              {/* Botão de novo agendamento */}
              <div className="w-full md:w-auto">
                <Button
                  onClick={() => setShowModal(true)}
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  fullWidth
                  className="md:w-auto"
                >
                  Novo Agendamento
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white h-full">
          <DnDCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%', minHeight: '450px' }}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            step={60}
            showMultiDayTimes
            defaultDate={new Date()}
            culture="pt-BR"
            messages={messages}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={dayPropGetter}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            resizable
            draggableAccessor={() => true}
            selectable
            popup
            toolbar={false}
          />
        </div>
      </div>

      {/* Modal de Novo Agendamento */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        size="lg"
      >
        <div className="space-y-6">
          {/* Título e ícone no corpo do modal */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="p-2 bg-krooa-green/20 rounded-lg">
              <Clock className="w-5 h-5 text-krooa-dark" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Novo Agendamento</h2>
              <p className="text-sm text-gray-500">Preencha os dados para criar um agendamento</p>
            </div>
          </div>

          {/* Informação da data selecionada */}
          {selectedSlot && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {format(selectedSlot.start, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                  {isHoliday(selectedSlot.start) && (
                    <p className="text-xs text-red-600 mt-1">⚠️ Esta data é um feriado</p>
                  )}
                  {isWeekend(selectedSlot.start) && (
                    <p className="text-xs text-amber-600 mt-1">⚠️ Esta data é um fim de semana</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Profissional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Profissional *
              </div>
            </label>
            <Select
              options={professionalOptions}
              value={formData.professionalId}
              onChange={(e) => setFormData({ ...formData, professionalId: e.target.value as string })}
              placeholder="Selecione um profissional"
              fullWidth
              searchable
            />
          </div>

          {/* Horários disponíveis */}
          {formData.professionalId && availableSlots.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-900 mb-3">Horários disponíveis:</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {availableSlots.map((slot, index) => (
                  <span key={index} className="px-3 py-2 bg-white border border-green-300 rounded-lg text-sm font-medium text-green-700 text-center">
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          )}

          {formData.professionalId && availableSlots.length === 0 && selectedSlot && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                Não há horários disponíveis para este profissional nesta data.
              </p>
            </div>
          )}

          {/* Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Paciente *
              </div>
            </label>
            <Select
              options={patientOptions}
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value as string })}
              placeholder="Selecione um paciente"
              fullWidth
              searchable
            />
          </div>

          {/* Tipo de Atendimento */}
          <Select
            label="Tipo de Atendimento"
            options={typeOptions}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as string })}
            fullWidth
            required
          />

          {/* Observações */}
          <TextArea
            label="Observações"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Adicione observações sobre o agendamento..."
            rows={3}
            fullWidth
          />

          {/* Botões de ação */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleCloseModal}
              variant="outline"
              size="md"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateAppointment}
              variant="primary"
              size="md"
            >
              Criar Agendamento
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
