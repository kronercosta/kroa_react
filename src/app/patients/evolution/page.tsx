'use client';

import React, { useState } from 'react';
import {
  FileText,
  Pill,
  Stethoscope,
  FileCheck,
  FilePlus,
  TestTube,
  Calendar,
  Filter,
  ChevronDown,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Users,
  FileSignature,
  PenTool,
  Send,
  Eye,
  Download,
  MoreVertical,
  Activity
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import PatientLayout from '../components/PatientLayout';
import Odontogram from '../components/Odontogram';
import ProcedureModal from '../components/ProcedureModal';

type EventType = 'all' | 'procedure' | 'prescription' | 'exam' | 'anamnesis' | 'certificate' | 'document';
type SignatureStatus = 'pending' | 'signed_patient' | 'signed_professional' | 'signed_both' | 'no_signature' | 'rejected';

interface TimelineEvent {
  id: string;
  type: 'procedure' | 'prescription' | 'exam' | 'anamnesis' | 'certificate' | 'document';
  title: string;
  description: string;
  date: string;
  time: string;
  professional: string;
  status: 'completed' | 'in_progress' | 'pending' | 'cancelled';
  signatureStatus: SignatureStatus;
  signatureRequired: 'both' | 'patient' | 'professional' | 'none';
  attachments?: number;
  priority?: 'high' | 'medium' | 'low';
  details?: any;
}

const PatientEvolutionPage: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const patientId = searchParams.get('id') || '1';

  const [selectedFilter, setSelectedFilter] = useState<EventType>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isOdontogramExpanded, setIsOdontogramExpanded] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [showProcedureModal, setShowProcedureModal] = useState(false);

  // Dados mockados da timeline
  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'procedure',
      title: 'Limpeza e Profilaxia',
      description: 'Procedimento de limpeza completa com remoção de tártaro',
      date: '20/01/2024',
      time: '14:30',
      professional: 'Dr. João Silva',
      status: 'pending',
      signatureStatus: 'pending',
      signatureRequired: 'both',
      priority: 'high',
      details: {
        teeth: [21, 22, 23],
        duration: '45 minutos',
        observations: 'Paciente com sensibilidade'
      }
    },
    {
      id: '2',
      type: 'prescription',
      title: 'Prescrição de Antibiótico',
      description: 'Amoxicilina 500mg - 8/8h por 7 dias',
      date: '18/01/2024',
      time: '10:15',
      professional: 'Dr. Maria Santos',
      status: 'completed',
      signatureStatus: 'signed_both',
      signatureRequired: 'professional',
      attachments: 1
    },
    {
      id: '3',
      type: 'exam',
      title: 'Solicitação de Raio-X Panorâmico',
      description: 'Exame radiográfico para avaliação geral',
      date: '18/01/2024',
      time: '10:00',
      professional: 'Dr. Maria Santos',
      status: 'in_progress',
      signatureStatus: 'signed_professional',
      signatureRequired: 'professional',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'anamnesis',
      title: 'Anamnese Completa',
      description: 'Histórico médico e odontológico detalhado',
      date: '15/01/2024',
      time: '09:00',
      professional: 'Dr. João Silva',
      status: 'completed',
      signatureStatus: 'signed_patient',
      signatureRequired: 'patient',
      details: {
        mainComplaint: 'Dor no dente 36',
        medicalHistory: 'Hipertensão, Diabetes Tipo 2',
        allergies: 'Penicilina',
        medications: 'Losartana, Metformina'
      }
    },
    {
      id: '5',
      type: 'certificate',
      title: 'Atestado Médico',
      description: 'Atestado de 2 dias para repouso pós-procedimento',
      date: '10/01/2024',
      time: '16:45',
      professional: 'Dr. Pedro Oliveira',
      status: 'completed',
      signatureStatus: 'signed_both',
      signatureRequired: 'both'
    },
    {
      id: '6',
      type: 'document',
      title: 'Termo de Consentimento',
      description: 'Termo para realização de implante dentário',
      date: '08/01/2024',
      time: '11:30',
      professional: 'Dr. João Silva',
      status: 'completed',
      signatureStatus: 'signed_both',
      signatureRequired: 'both',
      attachments: 2
    },
    {
      id: '7',
      type: 'procedure',
      title: 'Aplicação de Flúor',
      description: 'Aplicação tópica de flúor gel',
      date: '05/01/2024',
      time: '15:00',
      professional: 'Dra. Ana Costa',
      status: 'completed',
      signatureStatus: 'no_signature',
      signatureRequired: 'none'
    },
    {
      id: '8',
      type: 'prescription',
      title: 'Prescrição de Analgésico',
      description: 'Dipirona 500mg - 6/6h se dor',
      date: '05/01/2024',
      time: '15:15',
      professional: 'Dra. Ana Costa',
      status: 'completed',
      signatureStatus: 'signed_professional',
      signatureRequired: 'professional'
    }
  ];

  // Filtrar eventos
  const filteredEvents = selectedFilter === 'all'
    ? timelineEvents
    : timelineEvents.filter(event => event.type === selectedFilter);

  // Agrupar eventos por data
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  // Ordenar datas (mais recente primeiro)
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split('/').map(Number);
    const [dayB, monthB, yearB] = b.split('/').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateB.getTime() - dateA.getTime();
  });

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'procedure': return Stethoscope;
      case 'prescription': return Pill;
      case 'exam': return TestTube;
      case 'anamnesis': return FileText;
      case 'certificate': return FileCheck;
      case 'document': return FilePlus;
      default: return FileText;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'procedure': return 'text-blue-600 bg-blue-100';
      case 'prescription': return 'text-purple-600 bg-purple-100';
      case 'exam': return 'text-green-600 bg-green-100';
      case 'anamnesis': return 'text-yellow-600 bg-yellow-100';
      case 'certificate': return 'text-orange-600 bg-orange-100';
      case 'document': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusBadge = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" size="sm">Concluído</Badge>;
      case 'in_progress':
        return <Badge variant="warning" size="sm">Em Andamento</Badge>;
      case 'pending':
        return <Badge variant="secondary" size="sm">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="error" size="sm">Cancelado</Badge>;
      default:
        return null;
    }
  };

  const getSignatureIcon = (status: SignatureStatus) => {
    switch (status) {
      case 'signed_both':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'signed_patient':
      case 'signed_professional':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'no_signature':
        return null;
      default:
        return null;
    }
  };

  const getSignatureText = (event: TimelineEvent) => {
    const { signatureStatus, signatureRequired } = event;

    if (signatureRequired === 'none') return null;

    switch (signatureStatus) {
      case 'signed_both':
        return 'Assinado por ambos';
      case 'signed_patient':
        return 'Assinado pelo paciente';
      case 'signed_professional':
        return 'Assinado pelo profissional';
      case 'pending':
        if (signatureRequired === 'both') return 'Aguardando assinaturas';
        if (signatureRequired === 'patient') return 'Aguardando assinatura do paciente';
        if (signatureRequired === 'professional') return 'Aguardando assinatura do profissional';
        break;
      case 'rejected':
        return 'Assinatura rejeitada';
      default:
        return null;
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filters = [
    { id: 'all', label: 'Todos', count: timelineEvents.length },
    { id: 'procedure', label: 'Procedimentos', count: timelineEvents.filter(e => e.type === 'procedure').length },
    { id: 'prescription', label: 'Prescrições', count: timelineEvents.filter(e => e.type === 'prescription').length },
    { id: 'exam', label: 'Exames', count: timelineEvents.filter(e => e.type === 'exam').length },
    { id: 'anamnesis', label: 'Anamneses', count: timelineEvents.filter(e => e.type === 'anamnesis').length },
    { id: 'certificate', label: 'Atestados', count: timelineEvents.filter(e => e.type === 'certificate').length },
    { id: 'document', label: 'Documentos', count: timelineEvents.filter(e => e.type === 'document').length }
  ];

  // Contar procedimentos pendentes
  const pendingProcedures = timelineEvents.filter(e => e.status === 'pending' && e.type === 'procedure').length;

  // Handlers para odontograma
  const handleToothClick = (toothId: number) => {
    setSelectedTooth(toothId);
    setShowProcedureModal(true);
  };

  const handleCloseModal = () => {
    setShowProcedureModal(false);
    setSelectedTooth(null);
  };

  // Verificar se um evento está relacionado a um dente específico
  const isEventRelatedToTooth = (event: TimelineEvent, toothId: number) => {
    if (event.type === 'procedure' && event.details?.teeth) {
      return event.details.teeth.includes(toothId);
    }
    return false;
  };

  return (
    <PatientLayout
      patientId={patientId}
      patientName="Kroner Costa"
      activeTab="evolution"
    >
      <div className="p-6 space-y-6">
        {/* Header com resumo */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Evolução do Paciente</h2>
            <p className="text-sm text-gray-500 mt-1">Timeline completa de procedimentos e documentos</p>
          </div>
          <div className="flex items-center gap-3">
            {pendingProcedures > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                <p className="text-sm font-medium text-yellow-800">
                  {pendingProcedures} procedimento{pendingProcedures > 1 ? 's' : ''} pendente{pendingProcedures > 1 ? 's' : ''}
                </p>
              </div>
            )}
            <Button
              variant={isOdontogramExpanded ? "primary" : "outline"}
              onClick={() => setIsOdontogramExpanded(!isOdontogramExpanded)}
              className="flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Odontograma
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold">Filtrar por tipo</h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id as EventType)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2
                  ${selectedFilter === filter.id
                    ? 'bg-krooa-green text-krooa-dark shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <span>{filter.label}</span>
                <span className={`
                  px-2 py-0.5 rounded-full text-xs
                  ${selectedFilter === filter.id
                    ? 'bg-krooa-dark/20'
                    : 'bg-gray-200'
                  }
                `}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Timeline */}
        <div className="space-y-6">
          {sortedDates.map((date, dateIndex) => (
            <div key={date} className="relative">
              {/* Data */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{date}</span>
                </div>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Eventos do dia */}
              <div className="ml-8 space-y-3">
                {groupedEvents[date].map((event, eventIndex) => {
                  const Icon = getEventIcon(event.type);
                  const isExpanded = expandedItems.has(event.id);
                  const signatureText = getSignatureText(event);

                  return (
                    <div key={event.id} className="relative">
                      {/* Linha conectora vertical */}
                      {eventIndex < groupedEvents[date].length - 1 && (
                        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                      )}

                      {/* Card do evento */}
                      <Card className="hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          {/* Ícone do tipo */}
                          <div className={`p-2 rounded-full ${getEventColor(event.type)}`}>
                            <Icon className="w-5 h-5" />
                          </div>

                          {/* Conteúdo */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                  {getStatusBadge(event.status)}
                                  {event.priority === 'high' && (
                                    <Badge variant="error" size="sm">Urgente</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {event.time}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {event.professional}
                                  </span>
                                  {event.attachments && (
                                    <span className="flex items-center gap-1">
                                      <FileText className="w-3 h-3" />
                                      {event.attachments} anexo{event.attachments > 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>

                                {/* Status de assinatura */}
                                {signatureText && (
                                  <div className="flex items-center gap-2 mt-3 p-2 bg-gray-50 rounded-lg">
                                    {getSignatureIcon(event.signatureStatus)}
                                    <span className="text-xs text-gray-600">{signatureText}</span>
                                    {event.signatureStatus === 'pending' && (
                                      <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1">
                                        <Send className="w-3 h-3" />
                                        Solicitar
                                      </Button>
                                    )}
                                  </div>
                                )}

                                {/* Detalhes expandidos */}
                                {event.details && isExpanded && (
                                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <h5 className="text-xs font-semibold text-gray-700 mb-2">Detalhes</h5>
                                    <div className="space-y-1">
                                      {Object.entries(event.details).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-xs">
                                          <span className="text-gray-500 capitalize">
                                            {key === 'teeth' ? 'Dentes:' : key.replace(/([A-Z])/g, ' $1').trim() + ':'}
                                          </span>
                                          <span className="text-gray-700 font-medium">
                                            {key === 'teeth' && Array.isArray(value) ? (
                                              <div className="flex gap-1">
                                                {value.map((toothId: number) => (
                                                  <button
                                                    key={toothId}
                                                    onClick={() => handleToothClick(toothId)}
                                                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                                  >
                                                    {toothId}
                                                  </button>
                                                ))}
                                              </div>
                                            ) : (
                                              String(value)
                                            )}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Ações */}
                              <div className="flex items-center gap-2">
                                {event.details && (
                                  <button
                                    onClick={() => toggleExpanded(event.id)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                  </button>
                                )}
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                  <Eye className="w-4 h-4 text-gray-500" />
                                </button>
                                {event.attachments && (
                                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Download className="w-4 h-4 text-gray-500" />
                                  </button>
                                )}
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                  <MoreVertical className="w-4 h-4 text-gray-500" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>

              {/* Linha conectora entre datas */}
              {dateIndex < sortedDates.length - 1 && (
                <div className="ml-8 mt-3 mb-3">
                  <div className="w-0.5 h-8 bg-gray-200 ml-5"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mensagem quando não há eventos */}
        {filteredEvents.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum evento encontrado</h3>
              <p className="text-sm text-gray-500">
                {selectedFilter === 'all'
                  ? 'Não há eventos registrados para este paciente.'
                  : `Não há ${filters.find(f => f.id === selectedFilter)?.label.toLowerCase()} registrados.`}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Odontograma */}
      <Odontogram
        isExpanded={isOdontogramExpanded}
        onToggle={() => setIsOdontogramExpanded(!isOdontogramExpanded)}
        onToothClick={handleToothClick}
        selectedTooth={selectedTooth}
      />

      {/* Modal de Procedimentos */}
      <ProcedureModal
        isOpen={showProcedureModal}
        onClose={handleCloseModal}
        toothId={selectedTooth}
        procedures={timelineEvents}
      />
    </PatientLayout>
  );
};

export default PatientEvolutionPage;