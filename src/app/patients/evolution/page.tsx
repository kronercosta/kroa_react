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
  Funnel,
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
  Activity,
  Bot,
  MessageCircle,
  Plus,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import PatientLayout from '../components/PatientLayout';
import Odontogram from '../components/Odontogram';
import ProcedureModal from '../components/ProcedureModal';
import ChatIA from '../../../components/ChatIA';

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
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fechar dropdown ao clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFilterDropdown) {
        const target = event.target as Element;
        if (!target.closest('.relative')) {
          setShowFilterDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterDropdown]);

  // Chat IA - função para gerar respostas

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

  // IA do Chat - Respostas inteligentes
  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes('histórico') || message.includes('resumo')) {
      return `📋 **Resumo do Histórico - Kroner Costa**\n\n• **Última consulta:** 20/01/2024 (Limpeza pendente)\n• **Medicação atual:** Amoxicilina 500mg prescrita em 18/01\n• **Exames solicitados:** Raio-X panorâmico (15/01)\n• **Procedimentos concluídos:** 3 nos últimos 30 dias\n• **Status geral:** Paciente em tratamento ativo`;
    }

    if (message.includes('dente') || message.includes('dental')) {
      return `🦷 **Informações Dentárias**\n\n• **Dentes em tratamento:** 21, 22, 23 (limpeza agendada)\n• **Histórico recente:** Procedimento de profilaxia programado\n• **Observações:** Paciente relata sensibilidade\n• **Recomendação:** Acompanhamento pós-limpeza em 15 dias`;
    }

    if (message.includes('medicação') || message.includes('remédio')) {
      return `💊 **Medicações Prescritas**\n\n• **Atual:** Amoxicilina 500mg\n• **Posologia:** 8/8h por 7 dias\n• **Prescritor:** Dr. Maria Santos\n• **Data:** 18/01/2024\n• **Status:** Assinado por ambos (paciente e profissional)`;
    }

    if (message.includes('exame') || message.includes('raio')) {
      return `🔬 **Exames Solicitados**\n\n• **Raio-X Panorâmico** (15/01/2024)\n• **Solicitado por:** Dr. Carlos Mendes\n• **Motivo:** Avaliação pré-cirúrgica\n• **Status:** Aguardando agendamento\n• **Prioridade:** Média`;
    }

    if (message.includes('pendente') || message.includes('agendado')) {
      return `⏰ **Procedimentos Pendentes**\n\n• **Limpeza e Profilaxia** - 20/01/2024 às 14:30\n• **Profissional:** Dr. João Silva\n• **Duração estimada:** 45 minutos\n• **Preparação:** Paciente orientado sobre sensibilidade\n• **Status assinatura:** Aguardando ambas as partes`;
    }

    if (message.includes('assinatura') || message.includes('documento')) {
      return `📝 **Status de Assinaturas**\n\n• **Pendentes:** 1 procedimento aguardando assinatura\n• **Concluídas:** Prescrição de antibiótico (ambas as partes)\n• **Tipo:** Termo de consentimento para limpeza\n• **Ação necessária:** Solicitar assinatura do paciente`;
    }

    if (message.includes('quando') || message.includes('próxima')) {
      return `📅 **Próximos Compromissos**\n\n• **20/01/2024 - 14:30:** Limpeza e Profilaxia\n• **Após exame:** Avaliação dos resultados do raio-X\n• **Retorno:** 7 dias após antibiótico (25/01)\n• **Controle:** Acompanhar sensibilidade pós-limpeza`;
    }

    if (message.includes('urgente') || message.includes('prioridade')) {
      return `🚨 **Casos Urgentes**\n\n• **Limpeza agendada:** Prioridade ALTA\n• **Motivo:** Procedimento com prazo específico\n• **Observação:** Paciente com sensibilidade requer atenção\n• **Preparação especial:** Material para casos sensíveis`;
    }

    // Resposta padrão inteligente
    return `🤖 **Análise Inteligente**\n\nAnalisei sua pergunta sobre "${userMessage}". Com base no histórico do paciente Kroner Costa:\n\n• **Status atual:** Em tratamento ativo\n• **Última atualização:** 20/01/2024\n• **Itens pendentes:** 1 procedimento e 1 assinatura\n• **Próxima ação:** Limpeza agendada para hoje\n\nPrecisa de informações específicas sobre algum aspecto do tratamento?`;
  };

  // Função para enviar mensagem no chat

  // Handlers para odontograma
  const handleToothClick = (toothId: number) => {
    setSelectedTooth(toothId);
    setShowProcedureModal(true);
  };

  const handleCloseModal = () => {
    setShowProcedureModal(false);
    setSelectedTooth(null);
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
            <p className="text-sm text-gray-500 mt-1">Timeline completa de procedimentos e assistente IA</p>
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
              size="sm"
              onClick={() => setIsOdontogramExpanded(!isOdontogramExpanded)}
            >
              Exame Clínico Interativo
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4" />
              Nova Evolução
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
            {/* Filtros */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Filtrar por tipo</h3>
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                  title="Filtros"
                >
                  <Funnel className="w-4 h-4" />
                </button>

                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-2">
                      {filters.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => {
                            setSelectedFilter(filter.id as EventType);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                            selectedFilter === filter.id
                              ? 'bg-krooa-green text-krooa-dark'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span>{filter.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            selectedFilter === filter.id
                              ? 'bg-krooa-dark/20'
                              : 'bg-gray-200'
                          }`}>
                            {filter.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

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

      {/* Botão flutuante do Chat IA */}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
        <button
          onClick={() => setIsChatOpen(true)}
          className="relative p-4 bg-gradient-to-r from-krooa-green to-krooa-blue text-krooa-dark rounded-full shadow-lg hover:shadow-xl transition-all duration-200 pointer-events-auto cursor-pointer z-[10000]"
          title="Chat com IA"
        >
          <Bot className="w-6 h-6" />
          <div className="absolute -inset-1 rounded-full border-2 border-krooa-green/60 animate-ping pointer-events-none" style={{animationDelay: '0.5s', animationDuration: '2s'}}></div>
        </button>
      </div>

      {/* Chat IA Component */}
      <ChatIA
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        generateResponse={generateAIResponse}
      />
    </PatientLayout>
  );
};

export default PatientEvolutionPage;