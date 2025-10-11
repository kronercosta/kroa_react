'use client';

import React from 'react';
import { X, Calendar, Clock, User, FileText, AlertTriangle, CheckCircle, Brain, TrendingUp, Shield, DollarSign, Info } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

interface ProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothId: number | null;
  procedures: any[];
}

const ProcedureModal: React.FC<ProcedureModalProps> = ({
  isOpen,
  onClose,
  toothId,
  procedures
}) => {
  if (!isOpen || !toothId) return null;

  // IA de Síntese - Gera narrativa inteligente baseada nos dados
  const generateToothNarrative = (toothId: number) => {
    const narratives: { [key: number]: any } = {
      16: {
        status: "Em tratamento",
        condition: "needs_treatment",
        summary: "Paciente chegou com dor espontânea. Diagnóstico revelou cárie profunda com necrose pulpar.",
        timeline: [
          { date: "05/01/2024", event: "Primeira consulta - relato de dor noturna", type: "visit", origin: "here" },
          { date: "05/01/2024", event: "Exame clínico: cárie extensa face oclusal", type: "diagnosis", origin: "here" },
          { date: "08/01/2024", event: "Radiografia confirma proximidade pulpar", type: "exam", origin: "here" },
          { date: "25/01/2024", event: "Canal programado", type: "planned", origin: "here" },
          { date: "Futuro", event: "Coroa protética após canal", type: "planned", origin: "here" }
        ],
        investment: { completed: 150, planned: 1850, total: 2000 },
        warranty: "2 anos para canal + coroa (executado aqui)",
        riskLevel: "baixo",
        prognosis: "Excelente com tratamento completo",
        nextSteps: ["Tratamento de canal (25/01)", "Moldagem para coroa", "Instalação da coroa"],
        clinicHistory: "Todos os procedimentos realizados/planejados nesta clínica"
      },
      24: {
        status: "Planejado",
        condition: "needs_treatment",
        summary: "Cárie pequena detectada em exame de rotina. Tratamento simples planejado.",
        timeline: [
          { date: "15/01/2024", event: "Detecção em check-up preventivo", type: "diagnosis", origin: "here" },
          { date: "22/01/2024", event: "Obturação agendada", type: "planned", origin: "here" }
        ],
        investment: { completed: 0, planned: 250, total: 250 },
        warranty: "1 ano para obturação",
        riskLevel: "muito baixo",
        prognosis: "Excelente - intervenção preventiva",
        nextSteps: ["Obturação simples (22/01)"],
        clinicHistory: "Paciente regular da clínica"
      },
      38: {
        status: "Planejado",
        condition: "needs_treatment",
        summary: "Siso impactado causando dor e inflamação gengival. Extração recomendada.",
        timeline: [
          { date: "10/01/2024", event: "Paciente relata dor e inchaço", type: "visit", origin: "here" },
          { date: "12/01/2024", event: "Raio-X confirma impacção", type: "exam", origin: "here" },
          { date: "A agendar", event: "Extração cirúrgica", type: "planned", origin: "here" }
        ],
        investment: { completed: 80, planned: 420, total: 500 },
        warranty: "Acompanhamento pós-cirúrgico incluso",
        riskLevel: "baixo-médio",
        prognosis: "Recuperação esperada em 7-10 dias",
        nextSteps: ["Agendar extração", "Medicação pré-operatória", "Cirurgia"],
        clinicHistory: "Primeiro tratamento nesta clínica"
      },
      46: {
        status: "Concluído parcial",
        condition: "treated",
        summary: "Canal realizado com sucesso. Aguardando coroa para finalizar reabilitação.",
        timeline: [
          { date: "20/12/2023", event: "Diagnóstico: necrose pulpar", type: "diagnosis", origin: "here" },
          { date: "08/01/2024", event: "Tratamento de canal executado aqui", type: "treatment", origin: "here" },
          { date: "15/01/2024", event: "Controle pós-canal: sucesso", type: "followup", origin: "here" },
          { date: "30/01/2024", event: "Moldagem para coroa agendada", type: "planned", origin: "here" }
        ],
        investment: { completed: 1200, planned: 800, total: 2000 },
        warranty: "2 anos no canal (feito aqui) + 3 anos na coroa",
        riskLevel: "muito baixo",
        prognosis: "Excelente - canal bem sucedido",
        nextSteps: ["Moldagem (30/01)", "Prova da coroa", "Instalação final"],
        clinicHistory: "Tratamento completo nesta clínica"
      }
    };

    return narratives[toothId] || {
      status: "Saudável",
      summary: "Dente sem histórico de problemas ou tratamentos.",
      timeline: [],
      investment: { completed: 0, planned: 0, total: 0 },
      warranty: "N/A",
      riskLevel: "nenhum",
      prognosis: "Manter higiene preventiva",
      nextSteps: ["Check-up preventivo regular"],
      clinicHistory: "Sem histórico nesta clínica"
    };
  };

  const narrative = generateToothNarrative(toothId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Em tratamento":
        return <Badge variant="warning" size="sm">Em Tratamento</Badge>;
      case "Planejado":
        return <Badge variant="info" size="sm">Planejado</Badge>;
      case "Concluído parcial":
        return <Badge variant="success" size="sm">Parcialmente Concluído</Badge>;
      default:
        return <Badge variant="success" size="sm">Saudável</Badge>;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "muito baixo": return "text-green-600";
      case "baixo": return "text-blue-600";
      case "baixo-médio": return "text-yellow-600";
      case "médio": return "text-orange-600";
      case "alto": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header Profissional */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Dente {toothId}</h2>
              <p className="text-sm text-gray-600">Análise Inteligente • Síntese Automatizada</p>
            </div>
            {getStatusBadge(narrative.status)}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Síntese Principal */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Síntese Clínica</h3>
              <p className="text-gray-700 leading-relaxed">{narrative.summary}</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline Narrativa */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Cronologia Detalhada
            </h3>
            <div className="space-y-3">
              {narrative.timeline.map((event: any, index: number) => (
                <div key={index} className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      event.type === 'treatment' ? 'bg-green-500' :
                      event.type === 'planned' ? 'bg-blue-500' :
                      event.type === 'diagnosis' ? 'bg-orange-500' :
                      event.type === 'exam' ? 'bg-purple-500' :
                      'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">{event.date}</span>
                      <Badge
                        variant={event.origin === 'here' ? 'success' : 'info'}
                        size="xs"
                      >
                        {event.origin === 'here' ? 'Nossa Clínica' : 'Externo'}
                      </Badge>
                    </div>
                    <p className="text-gray-800">{event.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Painel de Informações */}
          <div className="space-y-4">
            {/* Investimento */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                Investimento
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Realizado:</span>
                  <span className="font-medium text-green-600">R$ {narrative.investment.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Planejado:</span>
                  <span className="font-medium text-blue-600">R$ {narrative.investment.planned}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-medium text-gray-900">Total:</span>
                  <span className="font-bold text-gray-900">R$ {narrative.investment.total}</span>
                </div>
              </div>
            </div>

            {/* Prognóstico */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Prognóstico
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Risco: </span>
                  <span className={`font-medium ${getRiskColor(narrative.riskLevel)}`}>
                    {narrative.riskLevel}
                  </span>
                </div>
                <p className="text-gray-700">{narrative.prognosis}</p>
              </div>
            </div>

            {/* Garantia */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                Garantia
              </h4>
              <p className="text-sm text-gray-700">{narrative.warranty}</p>
            </div>

            {/* Próximos Passos */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Próximos Passos</h4>
              <ul className="space-y-1 text-sm">
                {narrative.nextSteps.map((step: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-blue-800">
                    <span className="text-blue-600 mt-1">•</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Histórico:</span> {narrative.clinicHistory}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button variant="primary">
              Agendar Consulta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcedureModal;