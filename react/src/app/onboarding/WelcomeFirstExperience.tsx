import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
import { useRegion } from '../../contexts/RegionContext';
import translations from './firstExperienceTranslation.json';

interface WelcomeFirstExperienceProps {
  onNext: (data: {
    wantsGuidedTour: boolean;
    dataMigration: 'yes' | 'no' | 'later';
    currentStage: number;
  }) => void;
  onSkip: () => void;
}

const stages = [
  {
    id: 1,
    name: 'Desorganizado',
    description: 'Configuração básica do sistema',
    color: 'bg-red-500',
    lightColor: 'bg-red-50',
    textColor: 'text-red-600',
    goals: ['60% evolução de status', '85% evolução de procedimentos', '95% alertas de continuidade'],
    blocks: 4
  },
  {
    id: 2,
    name: 'Básico',
    description: 'Integração entre processos',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    goals: ['5% outras evoluções', '40% com orçamento', '5% CRM agendamentos'],
    blocks: 4
  },
  {
    id: 3,
    name: 'Consistente',
    description: 'Controle financeiro integrado',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    goals: ['50% orçamentos vinculados', '50% transações com nota', 'Integração completa'],
    blocks: 4
  },
  {
    id: 4,
    name: 'Alta Performance',
    description: 'Motor de crescimento escalável',
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-600',
    goals: ['Metas financeiras', 'DRE em tempo real', 'Marketing integrado'],
    blocks: 4
  }
];

export function WelcomeFirstExperience({ onNext, onSkip }: WelcomeFirstExperienceProps) {
  const { t } = useTranslation(translations);
  const { currentRegion } = useRegion();
  const [currentStep, setCurrentStep] = useState(1);
  const [wantsGuidedTour, setWantsGuidedTour] = useState(true);
  const [dataMigration, setDataMigration] = useState<'yes' | 'no' | 'later'>('no');
  const [selectedStage, setSelectedStage] = useState(1);

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else {
      onNext({
        wantsGuidedTour,
        dataMigration,
        currentStage: selectedStage
      });
    }
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-8">
      <div>
        <div className="w-24 h-24 bg-gradient-to-r from-krooa-green to-krooa-blue rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Bem-vindo ao KROA! 🎉
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Estamos muito felizes em tê-lo conosco! O KROA foi desenvolvido para transformar
          sua clínica odontológica em uma operação de alta performance.
        </p>
      </div>

      <div className="bg-gradient-to-r from-krooa-green/10 to-krooa-blue/10 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Como você gostaria de começar?
        </h2>

        <div className="grid gap-4 max-w-2xl mx-auto">
          <button
            className={`p-6 border-2 rounded-xl text-left transition-all ${
              wantsGuidedTour
                ? 'border-krooa-green bg-krooa-green/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setWantsGuidedTour(true)}
          >
            <div className="flex items-start gap-4">
              <div className={`w-6 h-6 rounded-full border-2 mt-1 ${
                wantsGuidedTour
                  ? 'border-krooa-green bg-krooa-green'
                  : 'border-gray-300'
              }`}>
                {wantsGuidedTour && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  🎯 Quero o tour guiado completo
                </h3>
                <p className="text-sm text-gray-600">
                  Vamos te explicar os 4 estágios evolutivos do sistema e como maximizar
                  seus resultados desde o primeiro dia. <strong>Recomendado!</strong>
                </p>
              </div>
            </div>
          </button>

          <button
            className={`p-6 border-2 rounded-xl text-left transition-all ${
              !wantsGuidedTour
                ? 'border-krooa-green bg-krooa-green/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setWantsGuidedTour(false)}
          >
            <div className="flex items-start gap-4">
              <div className={`w-6 h-6 rounded-full border-2 mt-1 ${
                !wantsGuidedTour
                  ? 'border-krooa-green bg-krooa-green'
                  : 'border-gray-300'
              }`}>
                {!wantsGuidedTour && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  ⚡ Ir direto para configuração
                </h3>
                <p className="text-sm text-gray-600">
                  Pular a explicação e ir direto para criar minha conta.
                  Posso ver o tour depois nas configurações.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderStagesExplanation = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🎯 Sistema de Estágios Evolutivos
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Nossa implementação segue um cronograma específico. Cada estágio libera recursos
          avançados baseado no seu progresso. Isso garante que a inteligência do sistema
          funcione corretamente.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Por que funciona assim?</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Quando a agenda é usada de forma consistente, os alertas funcionam.
              Quando os alertas funcionam, as evoluções fazem sentido. Uma coisa está
              conectada à outra. <strong>Em apenas 7 dias</strong> você consegue atingir
              os requisitos para subir de nível.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 max-w-6xl mx-auto">
        {stages.map((stage, index) => (
          <div key={stage.id} className={`border-2 rounded-xl p-6 transition-all ${stage.lightColor}`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${stage.color} rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                E{stage.id}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{stage.name}</h3>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{stage.description}</p>
                <div className="flex flex-wrap gap-2">
                  {stage.goals.map((goal, goalIndex) => (
                    <span key={goalIndex} className={`px-3 py-1 ${stage.textColor} ${stage.lightColor} border border-current rounded-full text-xs font-medium`}>
                      {goal}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {stage.blocks} blocos de treinamento • Avaliação automática toda segunda-feira
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-4xl mx-auto">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">⚡ Progressão Rápida</h3>
            <p className="text-sm text-amber-800">
              O processo é rápido! Em apenas 7 dias você já consegue atingir os requisitos
              para subir de nível. Cada estágio é avaliado automaticamente toda segunda-feira
              baseado no seu uso dos últimos 7 dias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataMigration = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          📋 Migração de Dados
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Você possui dados de outro sistema que gostaria de migrar para o KROA?
        </p>
      </div>

      <div className="grid gap-4 max-w-2xl mx-auto">
        <button
          className={`p-6 border-2 rounded-xl text-left transition-all ${
            dataMigration === 'yes'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setDataMigration('yes')}
        >
          <div className="flex items-start gap-4">
            <div className={`w-6 h-6 rounded-full border-2 mt-1 ${
              dataMigration === 'yes'
                ? 'border-green-500 bg-green-500'
                : 'border-gray-300'
            }`}>
              {dataMigration === 'yes' && (
                <div className="w-full h-full rounded-full bg-white scale-50"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                ✅ Sim, quero migrar dados primeiro
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Recomendado!</strong> Vamos migrar seus dados (pacientes, histórico, etc.)
                antes de você começar a testar. Assim você já inicia com seus dados reais.
              </p>
            </div>
          </div>
        </button>

        <button
          className={`p-6 border-2 rounded-xl text-left transition-all ${
            dataMigration === 'no'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setDataMigration('no')}
        >
          <div className="flex items-start gap-4">
            <div className={`w-6 h-6 rounded-full border-2 mt-1 ${
              dataMigration === 'no'
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300'
            }`}>
              {dataMigration === 'no' && (
                <div className="w-full h-full rounded-full bg-white scale-50"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                🚀 Não, quero testar sem migrar
              </h3>
              <p className="text-sm text-gray-600">
                Vou começar a testar agora e criar dados do zero. Posso solicitar
                migração depois, mas os dados de teste serão perdidos.
              </p>
            </div>
          </div>
        </button>

        <button
          className={`p-6 border-2 rounded-xl text-left transition-all ${
            dataMigration === 'later'
              ? 'border-amber-500 bg-amber-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setDataMigration('later')}
        >
          <div className="flex items-start gap-4">
            <div className={`w-6 h-6 rounded-full border-2 mt-1 ${
              dataMigration === 'later'
                ? 'border-amber-500 bg-amber-500'
                : 'border-gray-300'
            }`}>
              {dataMigration === 'later' && (
                <div className="w-full h-full rounded-full bg-white scale-50"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                ⏰ Decidir depois
              </h3>
              <p className="text-sm text-gray-600">
                Quero primeiro conhecer o sistema e depois decidir sobre a migração.
                Posso solicitar a qualquer momento.
              </p>
            </div>
          </div>
        </button>
      </div>

      {dataMigration === 'yes' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-2">Ótima escolha!</h3>
              <p className="text-sm text-green-800">
                Nossa equipe entrará em contato nas próximas 24h para agendar a migração.
                Enquanto isso, você pode começar a configurar sua conta.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStageSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🎯 Qual estágio melhor descreve sua clínica hoje?
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Isso nos ajuda a personalizar sua experiência e focar no que mais importa para você.
          Não se preocupe, isso muda automaticamente baseado no seu progresso.
        </p>
      </div>

      <div className="grid gap-4 max-w-4xl mx-auto">
        {stages.map((stage) => (
          <button
            key={stage.id}
            className={`p-6 border-2 rounded-xl text-left transition-all ${
              selectedStage === stage.id
                ? `border-krooa-green bg-krooa-green/5`
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedStage(stage.id)}
          >
            <div className="flex items-start gap-4">
              <div className={`w-6 h-6 rounded-full border-2 mt-1 ${
                selectedStage === stage.id
                  ? 'border-krooa-green bg-krooa-green'
                  : 'border-gray-300'
              }`}>
                {selectedStage === stage.id && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 ${stage.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                    E{stage.id}
                  </div>
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{stage.description}</p>
                <div className="flex flex-wrap gap-2">
                  {stage.goals.slice(0, 2).map((goal, goalIndex) => (
                    <span key={goalIndex} className={`px-2 py-1 ${stage.textColor} ${stage.lightColor} border border-current rounded text-xs`}>
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Lembre-se</h3>
            <p className="text-sm text-blue-800">
              Seu estágio é reavaliado automaticamente toda segunda-feira baseado no uso
              dos últimos 7 dias. Você pode evoluir rapidamente ou até retroceder se não
              usar o sistema de forma consistente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep
                    ? 'bg-krooa-green text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-krooa-green' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-gray-500">
            Passo {currentStep} de 4
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {currentStep === 1 && renderWelcomeStep()}
          {currentStep === 2 && renderStagesExplanation()}
          {currentStep === 3 && renderDataMigration()}
          {currentStep === 4 && renderStageSelection()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep === 1) {
                onSkip();
              } else {
                setCurrentStep(currentStep - 1);
              }
            }}
          >
            {currentStep === 1 ? 'Pular' : 'Voltar'}
          </Button>

          <Button
            variant="primary"
            onClick={handleNext}
          >
            {currentStep === 4 ? 'Começar configuração' : 'Continuar'}
          </Button>
        </div>
      </div>
    </div>
  );
}