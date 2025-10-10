'use client';

import React, { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  DollarSign,
  Heart,
  FileText,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Phone,
  Mail,
  MessageCircle,
  Star,
  UserCheck,
  UserX,
  Info,
  PhoneOff,
  CalendarX,
  ClipboardList,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import PatientLayout from '../components/PatientLayout';

const PatientSummaryPage: React.FC = () => {
  // Pegar query parameters da URL
  const searchParams = new URLSearchParams(window.location.search);
  const patientId = searchParams.get('id') || '1';

  // Dados mockados do paciente
  const patient = {
    id: patientId,
    name: 'Kroner Costa',
    cpf: '123.456.789-00',
    birthDate: '15/05/1985',
    age: 38,
    phone: '(11) 98765-4321',
    email: 'kroner@email.com',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    plan: 'Premium',
    photo: null,
    indicatedBy: 'Dr. João Silva',
    registrationDate: '10/01/2023',
    lastVisit: '15/01/2024'
  };

  // Dados médicos
  const medicalInfo = {
    height: '1,75m',
    weight: '78kg',
    imc: '25,5',
    bloodType: 'O+',
    allergies: ['Penicilina', 'Dipirona'],
    chronicConditions: ['Hipertensão', 'Diabetes Tipo 2'],
    medications: [
      { name: 'Metformina', dose: '850mg', frequency: '2x ao dia' },
      { name: 'Losartana', dose: '50mg', frequency: '1x ao dia' }
    ]
  };

  // Histórico de consultas
  const appointments = [
    { date: '15/01/2024', type: 'Consulta de Rotina', professional: 'Dr. João Silva', status: 'Concluída' },
    { date: '10/12/2023', type: 'Retorno', professional: 'Dr. Maria Santos', status: 'Concluída' },
    { date: '20/11/2023', type: 'Emergência', professional: 'Dr. Pedro Oliveira', status: 'Concluída' },
    { date: '25/02/2024', type: 'Consulta de Rotina', professional: 'Dr. João Silva', status: 'Agendada' }
  ];

  // Resumo financeiro
  const financial = {
    totalPaid: 5420.00,
    pending: 380.00,
    nextPayment: '10/02/2024',
    monthlyValue: 450.00
  };

  // Dados de engajamento e classificação
  const engagement = {
    status: 'active', // 'active', 'lead', 'inactive'
    score: 78, // 0-100
    trend: 'up', // 'up', 'down', 'stable'
    lastVisitDays: 5,
    missedAppointments: 1,
    completedAppointments: 12,
    treatmentAdherence: 85, // percentual
    paymentStatus: 'regular', // 'regular', 'delayed', 'defaulter'
    riskLevel: 'low', // 'low', 'medium', 'high'
    tags: ['Pagador Pontual', 'Tratamento Regular', 'Fidelizado'],
    // Dados para sugestões inteligentes
    lastAppointmentCancelled: true,
    openTreatments: 2,
    daysWithoutContact: 15,
    contactAttempts: 3,
    lastContactSuccess: false,
    shouldSendSurvey: true,
    daysSinceLastSurvey: 90,
    hasAlerts: true,
    alertType: 'treatment_pending' // 'treatment_pending', 'payment_delayed', 'missed_appointment'
  };

  // Estado para mostrar tooltip
  const [showScoreInfo, setShowScoreInfo] = useState(false);

  // Gerar sugestões inteligentes baseadas nos dados
  const generateSmartActions = () => {
    const actions = [];

    // Prioridade 1: Consulta cancelada
    if (engagement.lastAppointmentCancelled) {
      actions.push({
        icon: CalendarX,
        text: 'Reagendar consulta cancelada',
        priority: 'high',
        reason: 'Última consulta foi cancelada'
      });
    }

    // Prioridade 2: Tratamentos em aberto
    if (engagement.openTreatments > 0) {
      actions.push({
        icon: ClipboardList,
        text: `Retomar tratamento (${engagement.openTreatments} pendente${engagement.openTreatments > 1 ? 's' : ''})`,
        priority: 'high',
        reason: 'Tratamento incompleto'
      });
    }

    // Prioridade 3: Múltiplas tentativas sem sucesso
    if (engagement.contactAttempts >= 3 && !engagement.lastContactSuccess) {
      actions.push({
        icon: PhoneOff,
        text: `Contato urgente (${engagement.contactAttempts} tentativas sem sucesso)`,
        priority: 'high',
        reason: 'Sem resposta às tentativas de contato'
      });
    }

    // Prioridade 4: Alertas ativos
    if (engagement.hasAlerts) {
      const alertTexts = {
        'treatment_pending': 'Verificar tratamento pendente',
        'payment_delayed': 'Resolver pendência financeira',
        'missed_appointment': 'Follow-up de falta em consulta'
      };
      actions.push({
        icon: AlertTriangle,
        text: alertTexts[engagement.alertType as keyof typeof alertTexts] || 'Verificar alerta',
        priority: 'medium',
        reason: 'Alerta ativo no sistema'
      });
    }

    // Prioridade 5: Retorno preventivo (apenas se não há urgências)
    if (actions.filter(a => a.priority === 'high').length === 0 && engagement.lastVisitDays > 30) {
      actions.push({
        icon: Calendar,
        text: 'Agendar retorno preventivo',
        priority: 'medium',
        reason: `Última visita há ${engagement.lastVisitDays} dias`
      });
    }

    // Pesquisa de satisfação (sempre por último)
    if (engagement.shouldSendSurvey && engagement.daysSinceLastSurvey > 60) {
      actions.push({
        icon: MessageCircle,
        text: 'Enviar pesquisa de satisfação',
        priority: 'low',
        reason: 'Elegível para pesquisa'
      });
    }

    return actions.slice(0, 3); // Limitar a 3 sugestões principais
  };

  const suggestedActions = generateSmartActions();

  // Função para determinar cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'lead': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Função para determinar cor do score
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Função para determinar texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Paciente Ativo';
      case 'lead': return 'Lead / Prospecto';
      case 'inactive': return 'Inativo';
      default: return 'Indefinido';
    }
  };

  return (
    <PatientLayout
      patientId={patientId}
      patientName={patient.name}
      activeTab="summary"
    >
      <div className="p-6 space-y-6">
        {/* Card de Status e Engajamento */}
        <Card>
          <div className="space-y-4">
            {/* Header do Card */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${getStatusColor(engagement.status)}`}>
                  {engagement.status === 'active' ? (
                    <UserCheck className="w-6 h-6" />
                  ) : engagement.status === 'inactive' ? (
                    <UserX className="w-6 h-6" />
                  ) : (
                    <Activity className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{getStatusText(engagement.status)}</h2>
                  <p className="text-sm text-gray-500">Última visita há {engagement.lastVisitDays} dias</p>
                </div>
              </div>
            </div>

            {/* Score de Engajamento */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Score de Engajamento</span>
                  <div className="relative">
                    <button
                      onMouseEnter={() => setShowScoreInfo(true)}
                      onMouseLeave={() => setShowScoreInfo(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Info className="w-4 h-4 text-gray-400" />
                    </button>
                    {showScoreInfo && (
                      <div className="absolute left-0 top-8 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                        <p className="font-semibold mb-1">Como o score é calculado:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Frequência de consultas (40%)</li>
                          <li>• Assiduidade nas consultas (20%)</li>
                          <li>• Adesão ao tratamento (20%)</li>
                          <li>• Situação financeira (10%)</li>
                          <li>• Tempo como paciente (10%)</li>
                        </ul>
                        <div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{engagement.score}</span>
                  <span className="text-sm text-gray-500">/100</span>
                  {engagement.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : engagement.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : null}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getScoreColor(engagement.score)}`}
                  style={{ width: `${engagement.score}%` }}
                />
              </div>
            </div>

            {/* Métricas Rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-t border-b">
              <div>
                <p className="text-xs text-gray-500">Consultas Realizadas</p>
                <p className="text-lg font-semibold text-green-600">{engagement.completedAppointments}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Faltas</p>
                <p className="text-lg font-semibold text-red-600">{engagement.missedAppointments}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Adesão ao Tratamento</p>
                <p className="text-lg font-semibold text-blue-600">{engagement.treatmentAdherence}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status Financeiro</p>
                <p className="text-sm font-semibold text-green-600">
                  {engagement.paymentStatus === 'regular' ? 'Regular' :
                   engagement.paymentStatus === 'delayed' ? 'Atrasado' : 'Inadimplente'}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {engagement.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" size="sm">
                  <Star className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Ações Sugeridas */}
            {suggestedActions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Ações Recomendadas</h3>
                <div className="space-y-2">
                  {suggestedActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-full ${
                          action.priority === 'high' ? 'bg-red-100 text-red-600' :
                          action.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{action.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{action.reason}</p>
                        </div>
                        <Button
                          variant={action.priority === 'high' ? 'primary' : 'outline'}
                          size="sm"
                        >
                          {action.icon === MessageCircle ? 'Enviar' :
                           action.icon === Phone || action.icon === PhoneOff ? 'Ligar' :
                           'Agendar'}
                        </Button>
                      </div>
                    );
                  })}
                </div>

                {/* Indicador de pesquisa de satisfação */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {engagement.shouldSendSurvey ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-blue-900">Paciente elegível para pesquisa de satisfação</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Pesquisa enviada recentemente</span>
                      </>
                    )}
                  </div>
                  {engagement.daysSinceLastSurvey && (
                    <span className="text-xs text-gray-500">
                      Última pesquisa há {engagement.daysSinceLastSurvey} dias
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Informações básicas do paciente */}
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">CPF</p>
              <p className="text-sm font-medium">{patient.cpf}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Idade</p>
              <p className="text-sm font-medium">{patient.age} anos</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Telefone</p>
              <p className="text-sm font-medium">{patient.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium">{patient.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Plano</p>
              <Badge variant="primary">{patient.plan}</Badge>
            </div>
            <div>
              <p className="text-xs text-gray-500">Endereço</p>
              <p className="text-sm font-medium">{patient.address}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Última Consulta</p>
              <p className="text-sm font-medium">{patient.lastVisit}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Cadastrado em</p>
              <p className="text-sm font-medium">{patient.registrationDate}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Informações Médicas */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold">Informações Médicas</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Altura</span>
                <span className="text-sm font-medium">{medicalInfo.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Peso</span>
                <span className="text-sm font-medium">{medicalInfo.weight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">IMC</span>
                <span className="text-sm font-medium">{medicalInfo.imc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tipo Sanguíneo</span>
                <span className="text-sm font-medium">{medicalInfo.bloodType}</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600 mb-2">Indicado por</p>
                <p className="text-sm font-medium">{patient.indicatedBy}</p>
              </div>
            </div>
          </Card>

          {/* Alergias e Condições */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold">Alergias e Condições</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Alergias</p>
                <div className="flex flex-wrap gap-2">
                  {medicalInfo.allergies.map((allergy, idx) => (
                    <Badge key={idx} variant="danger" size="sm">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Condições Crônicas</p>
                <div className="flex flex-wrap gap-2">
                  {medicalInfo.chronicConditions.map((condition, idx) => (
                    <Badge key={idx} variant="warning" size="sm">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Resumo Financeiro</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Pago</span>
                <span className="text-sm font-medium text-green-600">
                  R$ {financial.totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pendente</span>
                <span className="text-sm font-medium text-red-600">
                  R$ {financial.pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Mensalidade</span>
                <span className="text-sm font-medium">
                  R$ {financial.monthlyValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">Próximo Vencimento</p>
                <p className="text-sm font-medium">{financial.nextPayment}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Medicações e Agendamentos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medicações em Uso */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Medicações em Uso</h3>
            </div>
            <div className="space-y-3">
              {medicalInfo.medications.map((med, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{med.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{med.dose} - {med.frequency}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Histórico de Agendamentos */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold">Histórico de Agendamentos</h3>
            </div>
            <div className="space-y-2">
              {appointments.map((apt, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{apt.type}</p>
                      <p className="text-xs text-gray-600">{apt.professional}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">{apt.date}</p>
                      <Badge
                        variant={apt.status === 'Agendada' ? 'primary' : 'success'}
                        size="sm"
                      >
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientSummaryPage;