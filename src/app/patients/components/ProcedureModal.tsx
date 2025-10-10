'use client';

import React from 'react';
import { X, Calendar, Clock, User, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
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

  // Dados mockados dos procedimentos do dente
  const toothProcedures = {
    16: {
      completed: [
        {
          id: '1',
          name: 'Exame Clínico',
          date: '05/01/2024',
          professional: 'Dr. João Silva',
          status: 'completed',
          notes: 'Cárie extensa na face oclusal'
        }
      ],
      pending: [
        {
          id: '2',
          name: 'Tratamento de Canal',
          scheduledDate: '25/01/2024',
          professional: 'Dr. João Silva',
          priority: 'high',
          estimatedTime: '90 minutos',
          notes: 'Necessário devido à proximidade com a polpa'
        },
        {
          id: '3',
          name: 'Coroa Protética',
          scheduledDate: 'Após canal',
          professional: 'Dr. João Silva',
          priority: 'medium',
          estimatedTime: '60 minutos',
          dependsOn: 'Tratamento de Canal'
        }
      ]
    },
    24: {
      completed: [],
      pending: [
        {
          id: '4',
          name: 'Obturação',
          scheduledDate: '22/01/2024',
          professional: 'Dra. Ana Costa',
          priority: 'medium',
          estimatedTime: '45 minutos',
          notes: 'Cárie pequena na face distal'
        }
      ]
    },
    38: {
      completed: [],
      pending: [
        {
          id: '5',
          name: 'Extração',
          scheduledDate: 'A agendar',
          professional: 'Dr. Pedro Oliveira',
          priority: 'high',
          estimatedTime: '30 minutos',
          notes: 'Dente do siso impactado causando dor'
        }
      ]
    },
    46: {
      completed: [
        {
          id: '6',
          name: 'Tratamento de Canal',
          date: '08/01/2024',
          professional: 'Dr. João Silva',
          status: 'completed',
          notes: 'Canal realizado com sucesso'
        }
      ],
      pending: [
        {
          id: '7',
          name: 'Coroa Protética',
          scheduledDate: '30/01/2024',
          professional: 'Dr. João Silva',
          priority: 'medium',
          estimatedTime: '60 minutos',
          notes: 'Moldagem já realizada'
        }
      ]
    }
  };

  const currentTooth = toothProcedures[toothId as keyof typeof toothProcedures] || { completed: [], pending: [] };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="error" size="sm">Urgente</Badge>;
      case 'medium':
        return <Badge variant="warning" size="sm">Média</Badge>;
      case 'low':
        return <Badge variant="info" size="sm">Baixa</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Dente {toothId}</h2>
            <p className="text-sm text-gray-500">Histórico e procedimentos</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Procedimentos Pendentes */}
          {currentTooth.pending.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Procedimentos Pendentes</h3>
                <Badge variant="warning" size="sm">{currentTooth.pending.length}</Badge>
              </div>
              <div className="space-y-3">
                {currentTooth.pending.map((procedure, index) => (
                  <div key={procedure.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{procedure.name}</h4>
                        {getPriorityBadge(procedure.priority)}
                      </div>
                      <Button variant="primary" size="sm">
                        Agendar
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{procedure.scheduledDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{procedure.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{procedure.professional}</span>
                      </div>
                      {procedure.dependsOn && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs">Depende: {procedure.dependsOn}</span>
                        </div>
                      )}
                    </div>

                    {procedure.notes && (
                      <div className="mt-3 p-2 bg-white/60 rounded border">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                          <p className="text-sm text-gray-700">{procedure.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Procedimentos Realizados */}
          {currentTooth.completed.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Procedimentos Realizados</h3>
                <Badge variant="success" size="sm">{currentTooth.completed.length}</Badge>
              </div>
              <div className="space-y-3">
                {currentTooth.completed.map((procedure, index) => (
                  <div key={procedure.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{procedure.name}</h4>
                      <Badge variant="success" size="sm">Concluído</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{procedure.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{procedure.professional}</span>
                      </div>
                    </div>

                    {procedure.notes && (
                      <div className="mt-3 p-2 bg-white/60 rounded border">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                          <p className="text-sm text-gray-700">{procedure.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quando não há procedimentos */}
          {currentTooth.pending.length === 0 && currentTooth.completed.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum procedimento registrado</h3>
              <p className="text-sm text-gray-500 mb-4">
                Este dente não possui histórico de procedimentos.
              </p>
              <Button variant="primary">
                Adicionar Procedimento
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {(currentTooth.pending.length > 0 || currentTooth.completed.length > 0) && (
            <Button variant="primary">
              Novo Procedimento
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcedureModal;