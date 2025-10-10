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
    return (
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
        <button
          onClick={onToggle}
          className="bg-white shadow-lg rounded-l-lg p-3 hover:bg-gray-50 transition-colors border border-r-0"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-[36rem] bg-white shadow-xl border-l z-40 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Odontograma Interativo</h3>
        </div>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Legenda */}
      <div className="p-4 border-b bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Legenda de Status</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-gray-400 rounded"></div>
            <span className="text-gray-600">Saudável</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
            <span className="text-gray-600">Tratado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
            <span className="text-gray-600">Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
            <span className="text-gray-600">Necessita Tratamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
            <span className="text-gray-600">Coroa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 border-2 border-gray-400 rounded opacity-50"></div>
            <span className="text-gray-600">Ausente</span>
          </div>
        </div>
      </div>

      {/* Boxes de Procedimentos por Quadrante */}
      <div className="p-4 border-b bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Procedimentos por Quadrante</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
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

      {/* Odontograma com Dentes */}
      <div className="p-4">
        <div className="space-y-6">
          {/* Dentes Permanentes Superiores */}
          <div>
            <div className="flex items-center justify-center mb-4">
              <h4 className="text-sm font-medium text-gray-700 px-3 py-1 bg-blue-50 rounded-full">PERMANENTES - ARCADA SUPERIOR</h4>
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-1 justify-center min-w-max px-4">
                {teethData
                  .filter(t => t.id >= 11 && t.id <= 28 && !t.isDeciduous)
                  .sort((a, b) => {
                    if (a.id >= 11 && a.id <= 18 && b.id >= 11 && b.id <= 18) return b.id - a.id;
                    if (a.id >= 21 && a.id <= 28 && b.id >= 21 && b.id <= 28) return a.id - b.id;
                    if (a.id >= 11 && a.id <= 18 && b.id >= 21 && b.id <= 28) return -1;
                    return 1;
                  })
                  .map(tooth => (
                    <div key={tooth.id} className="relative group flex flex-col items-center cursor-pointer" onClick={() => onToothClick(tooth.id)}>
                      <div className="text-xs font-medium text-gray-600 mb-1">{tooth.id}</div>
                      <img
                        src={`/tooth/${tooth.id}${tooth.status !== 'healthy' ? 'c' : ''}.svg`}
                        alt={`Dente ${tooth.id}`}
                        width="42"
                        height="56"
                        className={`transition-all duration-200 ${selectedTooth === tooth.id ? 'scale-110 drop-shadow-lg ring-2 ring-blue-400 rounded-lg p-1' : ''}`}
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
                  ))}
              </div>
            </div>
          </div>

          {/* Dentes Decíduos Superiores */}
          {teethData.filter(t => (t.id >= 51 && t.id <= 65) && t.isDeciduous).length > 0 && (
            <div>
              <div className="flex items-center justify-center mb-3">
                <h4 className="text-xs font-medium text-blue-600 px-3 py-1 bg-blue-100 rounded-full">DECÍDUOS - ARCADA SUPERIOR</h4>
              </div>
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
                    .map(tooth => (
                      <div key={tooth.id} className="relative group flex flex-col items-center cursor-pointer" onClick={() => onToothClick(tooth.id)}>
                        <div className="text-xs font-medium text-blue-600 mb-1">{tooth.id}</div>
                        <img
                          src={`/tooth/${tooth.id}${tooth.status !== 'healthy' ? 'c' : ''}.svg`}
                          alt={`Dente ${tooth.id} (Decíduo)`}
                          width="32"
                          height="42"
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
                    ))}
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
              <div className="flex items-center justify-center mb-3">
                <h4 className="text-xs font-medium text-green-600 px-3 py-1 bg-green-100 rounded-full">DECÍDUOS - ARCADA INFERIOR</h4>
              </div>
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
                    .map(tooth => (
                      <div key={tooth.id} className="relative group flex flex-col items-center cursor-pointer" onClick={() => onToothClick(tooth.id)}>
                        <div className="text-xs font-medium text-green-600 mb-1">{tooth.id}</div>
                        <img
                          src={`/tooth/${tooth.id}${tooth.status !== 'healthy' ? 'c' : ''}.svg`}
                          alt={`Dente ${tooth.id} (Decíduo)`}
                          width="32"
                          height="42"
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
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Dentes Permanentes Inferiores */}
          <div>
            <div className="flex items-center justify-center mb-4">
              <h4 className="text-sm font-medium text-gray-700 px-3 py-1 bg-green-50 rounded-full">PERMANENTES - ARCADA INFERIOR</h4>
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-1 justify-center min-w-max px-4">
                {teethData
                  .filter(t => t.id >= 31 && t.id <= 48 && !t.isDeciduous)
                  .sort((a, b) => {
                    if (a.id >= 31 && a.id <= 38 && b.id >= 31 && b.id <= 38) return b.id - a.id;
                    if (a.id >= 41 && a.id <= 48 && b.id >= 41 && b.id <= 48) return a.id - b.id;
                    if (a.id >= 31 && a.id <= 38 && b.id >= 41 && b.id <= 48) return -1;
                    return 1;
                  })
                  .map(tooth => (
                    <div key={tooth.id} className="relative group flex flex-col items-center cursor-pointer" onClick={() => onToothClick(tooth.id)}>
                      <div className="text-xs font-medium text-gray-600 mb-1">{tooth.id}</div>
                      <img
                        src={`/tooth/${tooth.id}${tooth.status !== 'healthy' ? 'c' : ''}.svg`}
                        alt={`Dente ${tooth.id}`}
                        width="42"
                        height="56"
                        className={`transition-all duration-200 ${selectedTooth === tooth.id ? 'scale-110 drop-shadow-lg ring-2 ring-blue-400 rounded-lg p-1' : ''}`}
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
                  ))}
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
    </div>
  );
};

export default Odontogram;