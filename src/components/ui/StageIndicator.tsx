import { useState, useEffect } from 'react';

interface StageIndicatorProps {
  className?: string;
}

const stages = [
  {
    id: 1,
    name: 'Iniciante',
    shortName: 'LV1',
    color: 'bg-gray-500',
    lightColor: 'bg-gray-50',
    textColor: 'text-gray-600',
    description: 'Primeiros passos no sistema',
    icon: '🌟',
    stars: 1,
    lessons: [
      { id: 1, title: 'Conhecendo o Dashboard', duration: '5 min', completed: false },
      { id: 2, title: 'Cadastrando seu primeiro paciente', duration: '8 min', completed: false },
      { id: 3, title: 'Agendando uma consulta', duration: '6 min', completed: false },
      { id: 4, title: 'Configurações básicas', duration: '4 min', completed: false },
    ]
  },
  {
    id: 2,
    name: 'Explorando',
    shortName: 'LV2',
    color: 'bg-krooa-green',
    lightColor: 'bg-green-50',
    textColor: 'text-green-600',
    description: 'Dominando o básico',
    icon: '🚀',
    stars: 2,
    lessons: [
      { id: 5, title: 'Procedimentos personalizados', duration: '10 min', completed: false },
      { id: 6, title: 'Orçamentos digitais', duration: '12 min', completed: false },
      { id: 7, title: 'Automações básicas', duration: '15 min', completed: false },
      { id: 8, title: 'Integração WhatsApp', duration: '8 min', completed: false },
    ]
  },
  {
    id: 3,
    name: 'Profissional',
    shortName: 'LV3',
    color: 'bg-krooa-blue',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    description: 'Sistema otimizado',
    icon: '👑',
    stars: 3,
    lessons: [
      { id: 9, title: 'Controle financeiro avançado', duration: '18 min', completed: false },
      { id: 10, title: 'Relatórios gerenciais', duration: '14 min', completed: false },
      { id: 11, title: 'Análise de performance', duration: '20 min', completed: false },
      { id: 12, title: 'Dashboard executivo', duration: '12 min', completed: false },
    ]
  },
  {
    id: 4,
    name: 'Mestre',
    shortName: 'LV4',
    color: 'bg-gradient-to-r from-krooa-blue to-krooa-green',
    lightColor: 'bg-gradient-to-r from-blue-50 to-green-50',
    textColor: 'text-blue-600',
    description: 'Clínica de elite',
    icon: '💎',
    stars: 3,
    lessons: [
      { id: 13, title: 'IA integrada no atendimento', duration: '25 min', completed: false },
      { id: 14, title: 'Marketing automático', duration: '22 min', completed: false },
      { id: 15, title: 'Previsões e insights', duration: '18 min', completed: false },
      { id: 16, title: 'API personalizada', duration: '30 min', completed: false },
    ]
  }
];

export function StageIndicator({ className = '' }: StageIndicatorProps) {
  const [currentStage, setCurrentStage] = useState(1);
  const [stageStars, setStageStars] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLessonsModal, setShowLessonsModal] = useState(false);
  const [lessons, setLessons] = useState<typeof stages[0]['lessons']>([]);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);

  useEffect(() => {
    // Recuperar dados da primeira experiência ou usar dados padrão
    const firstExperienceData = JSON.parse(sessionStorage.getItem('firstExperienceData') || '{}');
    const stage = firstExperienceData.currentStage || 1;
    setCurrentStage(stage);

    // Carregar progresso das aulas do localStorage
    const savedLessons = JSON.parse(localStorage.getItem('stageLessons') || '{}');
    const currentStageData = stages[stage - 1];

    if (currentStageData) {
      // Merge com dados salvos
      const updatedLessons = currentStageData.lessons.map(lesson => ({
        ...lesson,
        completed: savedLessons[lesson.id] || false
      }));
      setLessons(updatedLessons);

      // Calcular estrelas baseado no progresso real
      const completedCount = updatedLessons.filter(l => l.completed).length;
      const progressPercent = (completedCount / updatedLessons.length) * 100;

      if (progressPercent === 0) setStageStars(0);
      else if (progressPercent <= 33) setStageStars(1);
      else if (progressPercent <= 66) setStageStars(2);
      else setStageStars(3);
    }
  }, [currentStage]);

  const stage = stages[currentStage - 1];

  // Limpar timeout quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Funções para controlar hover com delay
  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowTooltip(false);
    }, 300); // 300ms de delay
    setHoverTimeout(timeout);
  };

  if (!stage) return null;

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Badge do estágio */}
        <div className={`${stage.color} text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2`}>
          <span className="text-base">{stage.icon}</span>
          <span>{stage.shortName}</span>
          {/* Estrelas */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((star) => (
              <svg
                key={star}
                className={`${
                  star === 2 ? 'w-4 h-4' : 'w-3 h-3'
                } ${star <= (stage.stars || stageStars) ? 'text-amber-300' : 'text-white/30'}`}
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
        <div
          className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-80"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Título */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-1">Progressão de Níveis</h3>
            <p className="text-xs text-gray-500">Sua jornada no sistema KROA</p>
          </div>

          {/* Grid de Níveis */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {stages.map((stageItem, index) => {
              const isCurrentStage = stageItem.id === currentStage;
              const isCompleted = stageItem.id < currentStage;
              const stageProgress = isCurrentStage ? stageStars : (isCompleted ? 3 : 0);

              return (
                <div
                  key={stageItem.id}
                  className={`border rounded-lg p-3 transition-all ${
                    isCurrentStage
                      ? 'border-krooa-blue bg-blue-50'
                      : isCompleted
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  {/* Header do nível */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 ${stageItem.color} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
                      <span className="text-xs">{stageItem.icon}</span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-900">{stageItem.shortName}</div>
                    </div>
                    {isCurrentStage && (
                      <div className="ml-auto">
                        <span className="text-xs bg-krooa-blue text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                          ATUAL
                        </span>
                      </div>
                    )}
                    {isCompleted && (
                      <div className="ml-auto">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Nome e estrelas */}
                  <div className="text-xs text-gray-700 mb-1 font-medium">{stageItem.name}</div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((star) => (
                      <svg
                        key={star}
                        className={`${
                          star === 2 ? 'w-3 h-3' : 'w-2.5 h-2.5'
                        } ${star <= stageProgress ? 'text-amber-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progresso atual */}
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Progresso atual no {stage.name}:</div>
            <div className="text-xs text-gray-600">
              {lessons.filter(l => l.completed).length} de {lessons.length} aulas concluídas
            </div>
          </div>

          <div className="text-xs text-gray-500 mb-3">
            Próxima avaliação: Segunda-feira
          </div>

          <div className="pt-3 border-t border-gray-100">
            <button
              onClick={() => {
                setShowLessonsModal(true);
                setShowTooltip(false);
              }}
              className="text-xs text-krooa-dark hover:text-krooa-dark/80 font-medium transition-colors"
            >
              Ver aulas do {stage.name} →
            </button>
          </div>
        </div>
      )}

      {/* Modal de Aulas */}
      {showLessonsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className={`${stage.lightColor} p-6 rounded-t-2xl border-b`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${stage.color} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    <span className="text-lg">{stage.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Aulas do {stage.name}</h2>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3].map((star) => (
                        <svg
                          key={star}
                          className={`${
                            star === 2 ? 'w-4 h-4' : 'w-3 h-3'
                          } ${
                            star <= (stage.stars || stageStars) ? 'text-amber-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowLessonsModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progresso */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progresso do Estágio</span>
                <span className="text-sm text-gray-500">
                  {lessons.filter(l => l.completed).length} de {lessons.length} concluídas
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${stage.color}`}
                  style={{
                    width: `${lessons.length > 0 ? (lessons.filter(l => l.completed).length / lessons.length) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Lista de Aulas */}
            <div className="p-6">
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`border rounded-lg p-4 transition-all ${
                      lesson.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          lesson.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {lesson.completed ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h3 className={`font-medium ${lesson.completed ? 'text-green-800' : 'text-gray-900'}`}>
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-gray-500">{lesson.duration}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleLessonAction(lesson)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          lesson.completed
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {lesson.completed ? 'Assistido' : 'Assistir'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer do Modal */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setShowLessonsModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    // Marcar todas como assistidas (para teste)
                    const allCompleted = lessons.map(l => ({ ...l, completed: true }));
                    setLessons(allCompleted);

                    // Salvar no localStorage
                    const savedLessons = JSON.parse(localStorage.getItem('stageLessons') || '{}');
                    allCompleted.forEach(lesson => {
                      savedLessons[lesson.id] = true;
                    });
                    localStorage.setItem('stageLessons', JSON.stringify(savedLessons));

                    // Recalcular estrelas
                    setStageStars(3);
                  }}
                  className={`flex-1 text-white py-3 px-6 rounded-lg font-medium transition-colors ${stage.color} hover:opacity-90`}
                >
                  Marcar todas como assistidas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Função para lidar com ações das aulas
  function handleLessonAction(lesson: typeof lessons[0]) {
    if (lesson.completed) {
      // Se já assistido, pode reagir de alguma forma ou não fazer nada
      return;
    }

    // Simular assistir aula (marcar como concluída)
    const updatedLessons = lessons.map(l =>
      l.id === lesson.id ? { ...l, completed: true } : l
    );
    setLessons(updatedLessons);

    // Salvar no localStorage
    const savedLessons = JSON.parse(localStorage.getItem('stageLessons') || '{}');
    savedLessons[lesson.id] = true;
    localStorage.setItem('stageLessons', JSON.stringify(savedLessons));

    // Recalcular estrelas
    const completedCount = updatedLessons.filter(l => l.completed).length;
    const progressPercent = (completedCount / updatedLessons.length) * 100;

    if (progressPercent === 0) setStageStars(0);
    else if (progressPercent <= 33) setStageStars(1);
    else if (progressPercent <= 66) setStageStars(2);
    else setStageStars(3);
  }
}