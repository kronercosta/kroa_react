'use client';

import React from 'react';
import { ChevronRight, ChevronLeft, Info, AlertTriangle, CheckCircle, Clock, Circle, Square } from 'lucide-react';

interface ToothFaces {
  mesial?: 'healthy' | 'treated' | 'caries' | 'missing';
  distal?: 'healthy' | 'treated' | 'caries' | 'missing';
  oclusal?: 'healthy' | 'treated' | 'caries' | 'missing';
  vestibular?: 'healthy' | 'treated' | 'caries' | 'missing';
  lingual?: 'healthy' | 'treated' | 'caries' | 'missing';
}

interface ProcedureColor {
  name: string;
  color: string;
  bgColor: string;
}

interface ToothStatus {
  id: number;
  status: 'healthy' | 'treated' | 'needs_treatment' | 'pending' | 'missing' | 'implant' | 'crown';
  procedures: string[];
  pendingProcedures: string[];
  lastTreatment?: string;
  faces?: ToothFaces;
  notes?: string[];
  hasRestoration?: boolean;
  hasCrown?: boolean;
  hasImplant?: boolean;
  isDeciduous?: boolean;
  procedureTypes?: string[];
}

interface OdontogramProps {
  isExpanded: boolean;
  onToggle: () => void;
  onToothClick: (toothId: number) => void;
  selectedTooth?: number | null;
}

const Odontogram: React.FC<OdontogramProps> = ({
  isExpanded,
  onToggle,
  onToothClick,
  selectedTooth
}) => {
  const [selectedView, setSelectedView] = React.useState<'odontograma' | 'faceograma' | 'corpograma'>('odontograma');

  // Estilos CSS personalizados para os dentes
  React.useEffect(() => {
    const styleId = 'odontogram-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .tooth-svg {
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
        }

        .tooth-svg .coroa {
          fill: #f8f9fa !important;
          stroke: #495057 !important;
          stroke-width: 1.5px !important;
        }

        .tooth-svg .raiz {
          fill: #e9ecef !important;
          stroke: #495057 !important;
          stroke-width: 1.5px !important;
        }

        .tooth-svg:hover .coroa {
          fill: #ffffff !important;
        }

        .tooth-svg:hover .raiz {
          fill: #f1f3f4 !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  // Sistema de cores profissional para status dos dentes
  const getToothNumberColor = (tooth: ToothStatus) => {
    // Prioridade: Urgente > Em tratamento > Planejado > Concluído > Externo > Normal
    if (tooth.status === 'needs_treatment') return '#dc2626'; // Vermelho - Urgente
    if (tooth.status === 'pending') return '#f59e0b'; // Laranja - Em tratamento
    if (tooth.pendingProcedures.length > 0) return '#2563eb'; // Azul - Planejado
    if (tooth.status === 'treated') return '#7c3aed'; // Roxo - Concluído aqui
    if (tooth.status === 'crown' || tooth.status === 'implant') return '#059669'; // Verde - Reabilitado
    if (tooth.status === 'missing') return '#6b7280'; // Cinza - Ausente
    return '#374151'; // Cinza escuro - Normal/Saudável
  };

  // Cores padronizadas por tipo de procedimento
  const procedureColors: { [key: string]: ProcedureColor } = {
    'Obturação': { name: 'Obturação', color: '#059669', bgColor: '#d1fae5' },
    'Canal': { name: 'Canal', color: '#dc2626', bgColor: '#fee2e2' },
    'Coroa': { name: 'Coroa', color: '#2563eb', bgColor: '#dbeafe' },
    'Implante': { name: 'Implante', color: '#7c3aed', bgColor: '#e9d5ff' },
    'Extração': { name: 'Extração', color: '#ea580c', bgColor: '#fed7aa' },
    'Limpeza': { name: 'Limpeza', color: '#0891b2', bgColor: '#cffafe' },
    'Clareamento': { name: 'Clareamento', color: '#facc15', bgColor: '#fef3c7' },
    'Ortodontia': { name: 'Ortodontia', color: '#ec4899', bgColor: '#fce7f3' },
    'Prótese': { name: 'Prótese', color: '#6366f1', bgColor: '#e0e7ff' },
    'Cirurgia': { name: 'Cirurgia', color: '#dc2626', bgColor: '#fecaca' }
  };

  // Função para obter tamanhos proporcionais por tipo de dente
  const getToothSize = (toothId: number, isDeciduous = false) => {
    if (isDeciduous) {
      // Tamanhos específicos para dentes decíduos conforme exemplo
      switch (toothId) {
        // Superiores direitos (55-51)
        case 55: return { width: 28, height: 30 }; // Molar decíduo
        case 54: return { width: 28, height: 30 }; // Conforme exemplo
        case 53: return { width: 20, height: 30 }; // Conforme exemplo
        case 52: return { width: 20, height: 30 }; // Conforme exemplo
        case 51: return { width: 20, height: 30 }; // Conforme exemplo

        // Superiores esquerdos (61-65) - mesma lógica espelhada
        case 61: return { width: 20, height: 30 }; // Igual ao 51
        case 62: return { width: 20, height: 30 }; // Igual ao 52
        case 63: return { width: 20, height: 30 }; // Igual ao 53
        case 64: return { width: 28, height: 30 }; // Igual ao 54
        case 65: return { width: 28, height: 30 }; // Igual ao 55

        // Inferiores esquerdos (85-81)
        case 85: return { width: 28, height: 30 }; // Molar decíduo
        case 84: return { width: 28, height: 30 }; // Molar decíduo
        case 83: return { width: 20, height: 30 }; // Canino decíduo
        case 82: return { width: 20, height: 30 }; // Incisivo decíduo
        case 81: return { width: 20, height: 30 }; // Incisivo decíduo

        // Inferiores direitos (71-75) - mesma lógica espelhada
        case 71: return { width: 20, height: 30 }; // Igual ao 81
        case 72: return { width: 20, height: 30 }; // Igual ao 82
        case 73: return { width: 20, height: 30 }; // Igual ao 83
        case 74: return { width: 28, height: 30 }; // Igual ao 84
        case 75: return { width: 28, height: 30 }; // Igual ao 85

        default: return { width: 24, height: 30 };
      }
    }

    // Ajustes específicos por dente conforme especificação (-1 width em todos os permanentes)
    switch (toothId) {
      // Quadrante superior direito (18-11)
      case 18: return { width: 29, height: 40 }; // Molar
      case 17: return { width: 29, height: 40 }; // Molar
      case 16: return { width: 29, height: 40 }; // Molar
      case 15: return { width: 19, height: 30 }; // Conforme exemplo
      case 14: return { width: 21, height: 36 }; // Conforme exemplo
      case 13: return { width: 21, height: 38 }; // Conforme exemplo
      case 12: return { width: 22, height: 38 }; // Conforme exemplo
      case 11: return { width: 27, height: 38 }; // Incisivo central

      // Quadrante superior esquerdo (21-28) - mesma lógica espelhada
      case 21: return { width: 27, height: 38 }; // Incisivo central
      case 22: return { width: 22, height: 38 }; // Igual ao 12
      case 23: return { width: 21, height: 38 }; // Igual ao 13
      case 24: return { width: 21, height: 36 }; // Igual ao 14
      case 25: return { width: 19, height: 30 }; // Igual ao 15
      case 26: return { width: 29, height: 40 }; // Molar
      case 27: return { width: 29, height: 40 }; // Molar
      case 28: return { width: 29, height: 40 }; // Molar

      // Quadrante inferior esquerdo - tamanhos específicos conforme padrão
      case 38: return { width: 29, height: 34 }; // Molar conforme exemplo
      case 37: return { width: 29, height: 34 }; // Molar conforme exemplo
      case 36: return { width: 29, height: 34 }; // Molar conforme exemplo
      case 35: return { width: 21, height: 30 }; // Pré-molar
      case 34: return { width: 21, height: 30 }; // Pré-molar
      case 33: return { width: 21, height: 28 }; // Canino conforme exemplo
      case 32: return { width: 19, height: 32 }; // Incisivo conforme exemplo
      case 31: return { width: 18, height: 32 }; // Incisivo conforme exemplo

      // Quadrante inferior direito - espelhando o padrão esquerdo
      case 41: return { width: 18, height: 32 }; // Igual ao 31
      case 42: return { width: 19, height: 32 }; // Igual ao 32
      case 43: return { width: 21, height: 28 }; // Igual ao 33
      case 44: return { width: 21, height: 30 }; // Igual ao 34
      case 45: return { width: 21, height: 30 }; // Igual ao 35
      case 46: return { width: 29, height: 34 }; // Igual ao 36
      case 47: return { width: 29, height: 34 }; // Igual ao 37
      case 48: return { width: 29, height: 34 }; // Igual ao 38

      // Default para dentes não mapeados (não deveria acontecer)
      default:
        return { width: 28, height: 38 };
    }
  };

  // Dados mockados dos dentes - incluindo decíduos
  const teethData: ToothStatus[] = [
    // Superiores direitos (18-11)
    { id: 18, status: 'healthy', procedures: [], pendingProcedures: [] },
    {
      id: 17,
      status: 'treated',
      procedures: ['Obturação'],
      pendingProcedures: [],
      lastTreatment: '15/01/2024',
      hasRestoration: true,
      procedureTypes: ['Obturação'],
      faces: { oclusal: 'treated', mesial: 'healthy', distal: 'healthy' }
    },
    {
      id: 16,
      status: 'needs_treatment',
      procedures: [],
      pendingProcedures: ['Canal', 'Coroa'],
      faces: { oclusal: 'caries', mesial: 'caries', distal: 'healthy' }
    },
    { id: 15, status: 'healthy', procedures: [], pendingProcedures: [] },
    { id: 14, status: 'healthy', procedures: [], pendingProcedures: [] },
    { id: 13, status: 'treated', procedures: ['Limpeza'], pendingProcedures: [], lastTreatment: '20/01/2024' },
    { id: 12, status: 'healthy', procedures: [], pendingProcedures: [] },
    { id: 11, status: 'pending', procedures: [], pendingProcedures: ['Limpeza'] },

    // Superiores esquerdos (21-28)
    { id: 21, status: 'treated', procedures: ['Clareamento'], pendingProcedures: [], lastTreatment: '18/01/2024' },
    { id: 22, status: 'healthy', procedures: [], pendingProcedures: [] },
    { id: 23, status: 'healthy', procedures: [], pendingProcedures: [] },
    {
      id: 24,
      status: 'needs_treatment',
      procedures: [],
      pendingProcedures: ['Obturação'],
      faces: { distal: 'caries' }
    },
    { id: 25, status: 'healthy', procedures: [], pendingProcedures: [] },
    {
      id: 26,
      status: 'crown',
      procedures: ['Canal', 'Coroa'],
      pendingProcedures: [],
      lastTreatment: '10/01/2024',
      hasCrown: true
    },
    { id: 27, status: 'healthy', procedures: [], pendingProcedures: [] },
    { id: 28, status: 'missing', procedures: ['Extração'], pendingProcedures: ['Implante'] },

    // Inferiores esquerdos (38-31)
    { id: 38, status: 'needs_treatment', procedures: [], pendingProcedures: ['Extração'] },
    { id: 37, status: 'healthy', procedures: [], pendingProcedures: [] },
    {
      id: 36,
      status: 'treated',
      procedures: ['Obturação'],
      pendingProcedures: [],
      lastTreatment: '05/01/2024',
      hasRestoration: true,
      faces: { oclusal: 'treated' }
    },
    { id: 35, status: 'healthy', procedures: [], pendingProcedures: [] },
    { id: 34, status: 'healthy', procedures: [], pendingProcedures: [] },
    { id: 33, status: 'healthy', procedures: [], pendingProcedures: [] },
    { id: 32, status: 'pending', procedures: [], pendingProcedures: ['Limpeza'] },
    { id: 31, status: 'healthy', procedures: [], pendingProcedures: [] },

    // Inferiores direitos (41-48)
    { id: 41, status: 'healthy', procedures: [], pendingProcedures: [] },
    { id: 42, status: 'treated', procedures: ['Limpeza'], pendingProcedures: [], lastTreatment: '20/01/2024' },
    { id: 43, status: 'healthy', procedures: [], pendingProcedures: [] },
    { id: 44, status: 'healthy', procedures: [], pendingProcedures: [] },
    {
      id: 45,
      status: 'needs_treatment',
      procedures: [],
      pendingProcedures: ['Obturação'],
      faces: { oclusal: 'caries' }
    },
    {
      id: 46,
      status: 'treated',
      procedures: ['Canal'],
      pendingProcedures: ['Coroa'],
      lastTreatment: '08/01/2024',
      hasRestoration: true
    },
    { id: 47, status: 'healthy', procedures: [], pendingProcedures: [] },
    { id: 48, status: 'healthy', procedures: [], pendingProcedures: [] },

    // DENTES DECÍDUOS - Superiores (55-51, 61-65)
    { id: 55, status: 'healthy', procedures: [], pendingProcedures: [], isDeciduous: true },
    { id: 54, status: 'treated', procedures: ['Obturação'], pendingProcedures: [], isDeciduous: true, procedureTypes: ['Obturação'] },
    { id: 53, status: 'healthy', procedures: [], pendingProcedures: [], isDeciduous: true },
    { id: 52, status: 'healthy', procedures: [], pendingProcedures: [], isDeciduous: true },
    { id: 51, status: 'needs_treatment', procedures: [], pendingProcedures: ['Obturação'], isDeciduous: true },
    { id: 61, status: 'healthy', procedures: [], pendingProcedures: [], isDeciduous: true },
    { id: 62, status: 'healthy', procedures: [], pendingProcedures: [], isDeciduous: true },
    { id: 63, status: 'treated', procedures: ['Limpeza'], pendingProcedures: [], isDeciduous: true, procedureTypes: ['Limpeza'] },
    { id: 64, status: 'healthy', procedures: [], pendingProcedures: [], isDeciduous: true },
    { id: 65, status: 'missing', procedures: ['Extração'], pendingProcedures: [], isDeciduous: true },

    // DENTES DECÍDUOS - Inferiores (85-81, 71-75)
    { id: 85, status: 'healthy', procedures: [], pendingProcedures: [], isDeciduous: true },
    { id: 84, status: 'healthy', procedures: [], pendingProcedures: [], isDeciduous: true },
    { id: 83, status: 'healthy', procedures: [], pendingProcedures: [], isDeciduous: true },
    { id: 82, status: 'pending', procedures: [], pendingProcedures: ['Limpeza'], isDeciduous: true },
    { id: 81, status: 'healthy', procedures: [], pendingProcedures: [], isDeciduous: true },
    { id: 71, status: 'healthy', procedures: [], pendingProcedures: [], isDeciduous: true },
    { id: 72, status: 'treated', procedures: ['Obturação'], pendingProcedures: [], isDeciduous: true, procedureTypes: ['Obturação'] },
    { id: 73, status: 'healthy', procedures: [], pendingProcedures: [], isDeciduous: true },
    { id: 74, status: 'needs_treatment', procedures: [], pendingProcedures: ['Canal'], isDeciduous: true },
    { id: 75, status: 'healthy', procedures: [], pendingProcedures: [], isDeciduous: true }
  ];

  if (!isExpanded) {
    return null;
  }

  return (
    <div className="fixed right-0 top-0 h-full w-[36rem] md:w-[42rem] lg:w-[48rem] xl:w-[52rem] bg-white shadow-xl border-l z-40 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Exame Clínico Interativo</h3>
        </div>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Seletor de Visualização */}
      <div className="p-4 border-b bg-white">
        <div className="flex gap-2">
          {[
            { id: 'odontograma', label: 'Odontograma', icon: '🦷' },
            { id: 'faceograma', label: 'Faceograma', icon: '👤' },
            { id: 'corpograma', label: 'Corpograma', icon: '🧍' }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedView === view.id
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              <span className="text-base">{view.icon}</span>
              {view.label}
            </button>
          ))}
        </div>
        {selectedView !== 'odontograma' && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              📋 {selectedView === 'faceograma' ? 'Faceograma' : 'Corpograma'} em desenvolvimento
            </p>
          </div>
        )}
      </div>

      {/* Conteúdo do Odontograma */}
      {selectedView === 'odontograma' && (
      <div className="p-4">
        <div className="space-y-6">
          {/* Dentes Permanentes Superiores */}
          <div>
            <div className="overflow-x-auto lg:overflow-x-visible">
              <div className="flex gap-1 lg:gap-2 xl:gap-3 justify-center min-w-max lg:min-w-0 px-4">
                {teethData
                  .filter(t => t.id >= 11 && t.id <= 28 && !t.isDeciduous)
                  .sort((a, b) => {
                    if (a.id >= 11 && a.id <= 18 && b.id >= 11 && b.id <= 18) return b.id - a.id;
                    if (a.id >= 21 && a.id <= 28 && b.id >= 21 && b.id <= 28) return a.id - b.id;
                    if (a.id >= 11 && a.id <= 18 && b.id >= 21 && b.id <= 28) return -1;
                    return 1;
                  })
                  .map(tooth => {
                    const size = getToothSize(tooth.id, tooth.isDeciduous);
                    return (
                    <div key={tooth.id} className="relative group flex flex-col items-center cursor-pointer" onClick={() => onToothClick(tooth.id)}>
                      <div
                        className="text-xs font-bold mb-1 px-2 py-1 rounded-full bg-white/90 shadow-sm border"
                        style={{ color: getToothNumberColor(tooth) }}
                      >
                        {tooth.id}
                      </div>
                      <img
                        src={`/tooth/${tooth.id}${tooth.status !== 'healthy' ? 'c' : ''}.svg`}
                        alt={`Dente ${tooth.id}`}
                        width={size.width}
                        height={size.height}
                        className={`tooth-svg transition-all duration-200 lg:scale-110 xl:scale-125 ${selectedTooth === tooth.id ? 'scale-110 lg:scale-125 xl:scale-150 drop-shadow-lg ring-2 ring-blue-400 rounded-lg p-1' : ''}`}
                        style={{
                          opacity: tooth.status === 'missing' ? 0.3 : 1
                        }}
                      />
                      <div className="flex gap-1 mt-1 justify-center">
                        {[...tooth.procedures, ...tooth.pendingProcedures].slice(0, 3).map((proc, idx) => {
                          const color = procedureColors[proc];
                          return color ? (
                            <div
                              key={idx}
                              className="w-2 h-2 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: color.color }}
                              title={proc}
                            />
                          ) : null;
                        })}
                      </div>
                    </div>
                  )})}
              </div>
            </div>
          </div>

          {/* Dentes Decíduos Superiores */}
          {teethData.filter(t => (t.id >= 51 && t.id <= 65) && t.isDeciduous).length > 0 && (
            <div>
              <div className="overflow-x-auto">
                <div className="flex gap-1 justify-center min-w-max px-4">
                  {teethData
                    .filter(t => (t.id >= 51 && t.id <= 65) && t.isDeciduous)
                    .sort((a, b) => {
                      if (a.id >= 51 && a.id <= 55 && b.id >= 51 && b.id <= 55) return b.id - a.id;
                      if (a.id >= 61 && a.id <= 65 && b.id >= 61 && b.id <= 65) return a.id - b.id;
                      if (a.id >= 51 && a.id <= 55 && b.id >= 61 && b.id <= 65) return -1;
                      return 1;
                    })
                    .map(tooth => {
                      const size = getToothSize(tooth.id, tooth.isDeciduous);
                      return (
                      <div key={tooth.id} className="relative group flex flex-col items-center cursor-pointer" onClick={() => onToothClick(tooth.id)}>
                        <div
                        className="text-xs font-bold mb-1 px-2 py-1 rounded-full bg-white/90 shadow-sm border"
                        style={{ color: getToothNumberColor(tooth) }}
                      >
                        {tooth.id}
                      </div>
                        <img
                          src={`/tooth/${tooth.id}${tooth.status !== 'healthy' ? 'c' : ''}.svg`}
                          alt={`Dente ${tooth.id} (Decíduo)`}
                          width={size.width}
                          height={size.height}
                          className={`transition-all duration-200 opacity-90 ${selectedTooth === tooth.id ? 'scale-110 drop-shadow-lg ring-2 ring-blue-400 rounded-lg p-1' : ''}`}
                          style={{
                            filter: tooth.status === 'treated' ? 'hue-rotate(120deg) saturate(1.2)' :
                                    tooth.status === 'needs_treatment' ? 'hue-rotate(0deg) saturate(1.5)' :
                                    tooth.status === 'pending' ? 'hue-rotate(45deg) saturate(1.3)' :
                                    tooth.status === 'missing' ? 'grayscale(100%) opacity(30%)' : 'none'
                          }}
                        />
                        <div className="flex gap-1 mt-1 justify-center">
                          {[...tooth.procedures, ...tooth.pendingProcedures].slice(0, 3).map((proc, idx) => {
                            const color = procedureColors[proc];
                            return color ? (
                              <div
                                key={idx}
                                className="w-2 h-2 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: color.color }}
                                title={proc}
                              />
                            ) : null;
                          })}
                        </div>
                      </div>
                    )})}
                </div>
              </div>
            </div>
          )}

          {/* Linha divisória */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="text-xs text-gray-500 px-2">LINHA MÉDIA</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Dentes Decíduos Inferiores */}
          {teethData.filter(t => (t.id >= 71 && t.id <= 85) && t.isDeciduous).length > 0 && (
            <div>
              <div className="overflow-x-auto">
                <div className="flex gap-1 justify-center min-w-max px-4">
                  {teethData
                    .filter(t => (t.id >= 71 && t.id <= 85) && t.isDeciduous)
                    .sort((a, b) => {
                      if (a.id >= 81 && a.id <= 85 && b.id >= 81 && b.id <= 85) return b.id - a.id;
                      if (a.id >= 71 && a.id <= 75 && b.id >= 71 && b.id <= 75) return a.id - b.id;
                      if (a.id >= 81 && a.id <= 85 && b.id >= 71 && b.id <= 75) return -1;
                      return 1;
                    })
                    .map(tooth => {
                      const size = getToothSize(tooth.id, tooth.isDeciduous);
                      return (
                      <div key={tooth.id} className="relative group flex flex-col items-center cursor-pointer" onClick={() => onToothClick(tooth.id)}>
                        <div
                        className="text-xs font-bold mb-1 px-2 py-1 rounded-full bg-white/90 shadow-sm border"
                        style={{ color: getToothNumberColor(tooth) }}
                      >
                        {tooth.id}
                      </div>
                        <img
                          src={`/tooth/${tooth.id}${tooth.status !== 'healthy' ? 'c' : ''}.svg`}
                          alt={`Dente ${tooth.id} (Decíduo)`}
                          width={size.width}
                          height={size.height}
                          className={`transition-all duration-200 opacity-90 ${selectedTooth === tooth.id ? 'scale-110 drop-shadow-lg ring-2 ring-blue-400 rounded-lg p-1' : ''}`}
                          style={{
                            filter: tooth.status === 'treated' ? 'hue-rotate(120deg) saturate(1.2)' :
                                    tooth.status === 'needs_treatment' ? 'hue-rotate(0deg) saturate(1.5)' :
                                    tooth.status === 'pending' ? 'hue-rotate(45deg) saturate(1.3)' :
                                    tooth.status === 'missing' ? 'grayscale(100%) opacity(30%)' : 'none'
                          }}
                        />
                        <div className="flex gap-1 mt-1 justify-center">
                          {[...tooth.procedures, ...tooth.pendingProcedures].slice(0, 3).map((proc, idx) => {
                            const color = procedureColors[proc];
                            return color ? (
                              <div
                                key={idx}
                                className="w-2 h-2 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: color.color }}
                                title={proc}
                              />
                            ) : null;
                          })}
                        </div>
                      </div>
                    )})}
                </div>
              </div>
            </div>
          )}

          {/* Dentes Permanentes Inferiores */}
          <div>
            <div className="overflow-x-auto lg:overflow-x-visible">
              <div className="flex gap-1 lg:gap-2 xl:gap-3 justify-center min-w-max lg:min-w-0 px-4">
                {teethData
                  .filter(t => t.id >= 31 && t.id <= 48 && !t.isDeciduous)
                  .sort((a, b) => {
                    if (a.id >= 31 && a.id <= 38 && b.id >= 31 && b.id <= 38) return b.id - a.id;
                    if (a.id >= 41 && a.id <= 48 && b.id >= 41 && b.id <= 48) return a.id - b.id;
                    if (a.id >= 31 && a.id <= 38 && b.id >= 41 && b.id <= 48) return -1;
                    return 1;
                  })
                  .map(tooth => {
                    const size = getToothSize(tooth.id, tooth.isDeciduous);
                    return (
                    <div key={tooth.id} className="relative group flex flex-col items-center cursor-pointer" onClick={() => onToothClick(tooth.id)}>
                      <div
                        className="text-xs font-bold mb-1 px-2 py-1 rounded-full bg-white/90 shadow-sm border"
                        style={{ color: getToothNumberColor(tooth) }}
                      >
                        {tooth.id}
                      </div>
                      <img
                        src={`/tooth/${tooth.id}${tooth.status !== 'healthy' ? 'c' : ''}.svg`}
                        alt={`Dente ${tooth.id}`}
                        width={size.width}
                        height={size.height}
                        className={`tooth-svg transition-all duration-200 lg:scale-110 xl:scale-125 ${selectedTooth === tooth.id ? 'scale-110 lg:scale-125 xl:scale-150 drop-shadow-lg ring-2 ring-blue-400 rounded-lg p-1' : ''}`}
                        style={{
                          opacity: tooth.status === 'missing' ? 0.3 : 1
                        }}
                      />
                      <div className="flex gap-1 mt-1 justify-center">
                        {[...tooth.procedures, ...tooth.pendingProcedures].slice(0, 3).map((proc, idx) => {
                          const color = procedureColors[proc];
                          return color ? (
                            <div
                              key={idx}
                              className="w-2 h-2 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: color.color }}
                              title={proc}
                            />
                          ) : null;
                        })}
                      </div>
                    </div>
                  )})}
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Estatístico */}
        <div className="mt-8 space-y-4">
          {/* Resumo Geral */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Resumo Clínico Geral
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Saudáveis:</span>
                <span className="font-semibold text-gray-800">{teethData.filter(t => t.status === 'healthy').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tratados:</span>
                <span className="font-semibold text-green-600">{teethData.filter(t => t.status === 'treated').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pendentes:</span>
                <span className="font-semibold text-yellow-600">{teethData.filter(t => t.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Necessitam:</span>
                <span className="font-semibold text-red-600">{teethData.filter(t => t.status === 'needs_treatment').length}</span>
              </div>
            </div>
          </div>

          {/* Resumo por Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="text-sm font-semibold text-blue-800 mb-2">Dentes Permanentes</h5>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">{teethData.filter(t => !t.isDeciduous).length}/32</span>
                </div>
                <div className="flex justify-between">
                  <span>Saudáveis:</span>
                  <span className="font-medium">{teethData.filter(t => !t.isDeciduous && t.status === 'healthy').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tratados:</span>
                  <span className="font-medium">{teethData.filter(t => !t.isDeciduous && t.status === 'treated').length}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <h5 className="text-sm font-semibold text-orange-800 mb-2">Dentes Decíduos</h5>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">{teethData.filter(t => t.isDeciduous).length}/20</span>
                </div>
                <div className="flex justify-between">
                  <span>Saudáveis:</span>
                  <span className="font-medium">{teethData.filter(t => t.isDeciduous && t.status === 'healthy').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tratados:</span>
                  <span className="font-medium">{teethData.filter(t => t.isDeciduous && t.status === 'treated').length}</span>
                </div>
              </div>
            </div>
          </div>

        {/* Legenda de Status por Cores dos Números */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Sistema de Cores - Números dos Dentes
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white border shadow-sm flex items-center justify-center">
                <span className="text-xs font-bold" style={{ color: '#dc2626' }}>16</span>
              </div>
              <span className="text-gray-700">Urgente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white border shadow-sm flex items-center justify-center">
                <span className="text-xs font-bold" style={{ color: '#f59e0b' }}>24</span>
              </div>
              <span className="text-gray-700">Em Tratamento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white border shadow-sm flex items-center justify-center">
                <span className="text-xs font-bold" style={{ color: '#2563eb' }}>46</span>
              </div>
              <span className="text-gray-700">Planejado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white border shadow-sm flex items-center justify-center">
                <span className="text-xs font-bold" style={{ color: '#7c3aed' }}>17</span>
              </div>
              <span className="text-gray-700">Concluído Aqui</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white border shadow-sm flex items-center justify-center">
                <span className="text-xs font-bold" style={{ color: '#059669' }}>26</span>
              </div>
              <span className="text-gray-700">Reabilitado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white border shadow-sm flex items-center justify-center">
                <span className="text-xs font-bold" style={{ color: '#6b7280' }}>28</span>
              </div>
              <span className="text-gray-700">Ausente</span>
            </div>
          </div>
          <div className="mt-3 p-2 bg-white/60 rounded border text-xs text-blue-800">
            💡 <strong>Dica:</strong> Clique em qualquer dente para ver a análise inteligente completa com cronologia e prognóstico.
          </div>
        </div>

        {/* Procedimentos Gerais */}
        <div className="mt-6 p-4 bg-white rounded-lg border">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Procedimentos por Quadrante</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { name: 'Superior Direito', procedures: ['Obturação (17)', 'Limpeza (13)'], color: 'bg-blue-50 border-blue-200' },
              { name: 'Superior Esquerdo', procedures: ['Coroa (26)', 'Obturação (24)'], color: 'bg-green-50 border-green-200' },
              { name: 'Inferior Esquerdo', procedures: ['Obturação (36)', 'Extração (38)'], color: 'bg-yellow-50 border-yellow-200' },
              { name: 'Inferior Direito', procedures: ['Canal (46)', 'Obturação (45)'], color: 'bg-purple-50 border-purple-200' }
            ].map((quadrant, index) => (
              <div key={index} className={`p-3 rounded-lg border ${quadrant.color}`}>
                <div className="font-medium text-gray-800 mb-2">{quadrant.name}</div>
                <div className="space-y-1">
                  {quadrant.procedures.map((proc, idx) => {
                    const procType = proc.split(' (')[0];
                    const color = procedureColors[procType];
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        {color && (
                          <div
                            className="w-3 h-3 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: color.color }}
                          />
                        )}
                        <span className="text-gray-700">{proc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* Legenda de Procedimentos */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <h5 className="text-sm font-semibold text-gray-800 mb-2">Cores dos Procedimentos</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(procedureColors).slice(0, 8).map(([name, color]) => (
                <div key={name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: color.color }}
                  />
                  <span className="text-gray-700">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Odontogram;