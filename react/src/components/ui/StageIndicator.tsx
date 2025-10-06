import { useState, useEffect } from 'react';

interface StageIndicatorProps {
  className?: string;
}

const stages = [
  {
    id: 1,
    name: 'Iniciante',
    shortName: 'LV1',
    color: 'bg-red-500',
    lightColor: 'bg-red-50',
    textColor: 'text-red-600',
    description: 'Primeiros passos',
    icon: '🥉'
  },
  {
    id: 2,
    name: 'Explorando',
    shortName: 'LV2',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    description: 'Dominando o básico',
    icon: '🥈'
  },
  {
    id: 3,
    name: 'Profissional',
    shortName: 'LV3',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    description: 'Sistema otimizado',
    icon: '🥇'
  },
  {
    id: 4,
    name: 'Mestre',
    shortName: 'LV4',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    description: 'Clínica de elite',
    icon: '💎'
  }
];

export function StageIndicator({ className = '' }: StageIndicatorProps) {
  const [currentStage, setCurrentStage] = useState(1);
  const [stageStars, setStageStars] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Recuperar dados da primeira experiência ou usar dados padrão
    const firstExperienceData = JSON.parse(sessionStorage.getItem('firstExperienceData') || '{}');
    const stage = firstExperienceData.currentStage || 1;
    setCurrentStage(stage);

    // Simular estrelas baseado em progresso (seria calculado pelo sistema real)
    // Por enquanto, vamos simular baseado no tempo ou dados fictícios
    const mockStars = Math.floor(Math.random() * 3) + 1; // 1-3 estrelas
    setStageStars(mockStars);
  }, []);

  const stage = stages[currentStage - 1];

  if (!stage) return null;

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Badge do estágio */}
        <div className={`${stage.color} text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2`}>
          <span className="text-base">{stage.icon}</span>
          <span>{stage.shortName}</span>
          {/* Estrelas */}
          <div className="flex">
            {[1, 2, 3].map((star) => (
              <svg
                key={star}
                className={`w-3 h-3 ${star <= stageStars ? 'text-yellow-300' : 'text-white/30'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
        </div>

        {/* Nome do estágio (visível em telas maiores) */}
        <div className="hidden md:block">
          <div className={`text-sm font-medium ${stage.textColor}`}>
            {stage.name}
          </div>
          <div className="text-xs text-gray-500">
            {stage.description}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-64">
          <div className="flex items-center gap-2 mb-2">
            <div className={`${stage.color} text-white px-2 py-1 rounded text-sm font-bold flex items-center gap-1`}>
              <span>{stage.icon}</span>
              <span>{stage.shortName}</span>
            </div>
            <span className="font-semibold text-gray-900">{stage.name}</span>
          </div>

          <p className="text-sm text-gray-600 mb-3">{stage.description}</p>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">Progresso atual:</span>
            <div className="flex">
              {[1, 2, 3].map((star) => (
                <svg
                  key={star}
                  className={`w-3 h-3 ${star <= stageStars ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Próxima avaliação: Segunda-feira
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <button className="text-xs text-krooa-green hover:text-krooa-green/80 font-medium">
              Ver aulas do estágio →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}