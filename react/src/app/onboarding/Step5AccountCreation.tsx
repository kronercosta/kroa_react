import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
import translations from './translation.json';

interface Step4Props {
  onComplete: () => void;
  accountData: {
    clinicName: string;
    customDomain: string;
    email: string;
  };
}

export function Step5AccountCreation({ onComplete, accountData }: Step4Props) {
  const { t } = useTranslation(translations);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = t?.step4?.steps || [
    'Validando informações',
    'Criando banco de dados',
    'Configurando domínio personalizado',
    'Preparando ambiente',
    'Finalizando configurações'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          // Simular possível erro (10% chance)
          if (Math.random() < 0.1) {
            setError('Erro ao criar a conta. Tente novamente.');
            clearInterval(timer);
            return prev;
          }

          setIsComplete(true);
          clearInterval(timer);
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [steps.length]);

  const retryCreation = () => {
    setError(null);
    setCurrentStep(0);
    setIsComplete(false);

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsComplete(true);
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Ops! Algo deu errado
        </h1>
        <p className="text-gray-600 mb-6">
          {error}
        </p>

        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={retryCreation}
            fullWidth
          >
            Tentar novamente
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/support'}
            fullWidth
          >
            Entrar em contato com o suporte
          </Button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-green-600 mb-2">
          {t?.step4?.success || 'Conta criada com sucesso!'}
        </h1>

        <p className="text-gray-600 mb-6">
          {t?.step4?.successMessage || 'Sua clínica está pronta para uso. Você será redirecionado em alguns segundos.'}
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Clínica:</strong> {accountData.clinicName}</p>
            <p><strong>Acesso:</strong> https://{accountData.customDomain}.kroa.com.br</p>
            <p><strong>E-mail:</strong> {accountData.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={onComplete}
            size="lg"
            fullWidth
          >
            {t?.step4?.accessNow || 'Acessar agora'}
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Redirecionando automaticamente em 5 segundos...</span>
          </div>
        </div>

        {/* Confetti Animation */}
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-krooa-green rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      {/* Header */}
      <div className="mb-8">
        <div className="w-16 h-16 bg-krooa-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-krooa-green border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t?.step4?.title || 'Criando sua conta...'}
        </h1>
        <p className="text-gray-600">
          {t?.step4?.subtitle || 'Estamos preparando tudo para você'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-4 mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              index < currentStep
                ? 'bg-green-500 text-white'
                : index === currentStep
                ? 'bg-krooa-green text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {index < currentStep ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : index === currentStep ? (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </div>

            <div className={`flex-1 text-left ${
              index <= currentStep ? 'text-gray-900' : 'text-gray-400'
            }`}>
              <p className="text-sm font-medium">{step}</p>
              {index === currentStep && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-krooa-green rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-krooa-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-krooa-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progresso</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-krooa-green to-krooa-blue h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current step indicator */}
      {currentStep === steps.length - 1 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-700 font-medium">
            {t?.step4?.almostDone || 'Quase pronto!'}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Finalizando os últimos detalhes da sua conta...
          </p>
        </div>
      )}

      {/* Account Info Preview */}
      <div className="bg-gray-50 rounded-lg p-4 text-left">
        <h3 className="font-medium text-gray-900 mb-2">Informações da conta:</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Clínica:</strong> {accountData.clinicName}</p>
          <p><strong>Domínio:</strong> {accountData.customDomain}.kroa.com.br</p>
          <p><strong>E-mail:</strong> {accountData.email}</p>
        </div>
      </div>
    </div>
  );
}