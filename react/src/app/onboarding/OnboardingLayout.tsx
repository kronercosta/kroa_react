import React from 'react';
import { Logo } from '../../components/Logo';
import { useTranslation } from '../../hooks/useTranslation';
import translations from './translation.json';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  showProgress?: boolean;
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  showProgress = true
}: OnboardingLayoutProps) {
  const { t } = useTranslation(translations);

  return (
    <div className="min-h-screen bg-gradient-to-br from-krooa-green/5 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />

            {showProgress && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {t?.common?.step || 'Passo'} {currentStep} {t?.common?.of || 'de'} {totalSteps}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: totalSteps }, (_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index < currentStep
                          ? 'bg-krooa-green'
                          : index === currentStep - 1
                          ? 'bg-krooa-green'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full bg-gray-200 h-1">
          <div
            className="h-1 bg-gradient-to-r from-krooa-green to-krooa-blue transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center text-sm text-gray-500">
            <p>© 2025 KROA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}