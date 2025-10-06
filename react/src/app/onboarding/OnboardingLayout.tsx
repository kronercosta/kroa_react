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
      <main className="flex-1 flex">
        {/* Sidebar motivacional - apenas desktop */}
        <div className="hidden xl:flex xl:w-1/2 bg-gradient-to-br from-krooa-green to-krooa-blue p-12 items-center justify-center">
          <div className="max-w-lg text-white">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Você está a alguns passos de transformar sua clínica
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Junte-se a mais de 1.000 profissionais que já revolucionaram sua gestão odontológica.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Configuração em 5 minutos</h3>
                  <p className="text-white/80">Configure sua clínica rapidamente com nosso processo guiado</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Resultados imediatos</h3>
                  <p className="text-white/80">Comece a usar no mesmo dia com todas as funcionalidades</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Suporte especializado</h3>
                  <p className="text-white/80">Equipe de especialistas em gestão odontológica à sua disposição</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">🏆</span>
                </div>
                <div>
                  <div className="font-semibold">Dr. Carlos Mendes</div>
                  <div className="text-sm text-white/70">Clínica OdontoCare</div>
                </div>
              </div>
              <p className="text-white/90 italic">
                "Em 3 meses com a KROA, nossa produtividade aumentou 40% e reduzimos os custos administrativos pela metade."
              </p>
            </div>
          </div>
        </div>

        {/* Formulário - desktop e mobile */}
        <div className="flex-1 xl:w-1/2 flex items-center justify-center p-4 xl:p-12">
          <div className="w-full max-w-md xl:max-w-lg">
            {children}
          </div>
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