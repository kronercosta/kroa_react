import React, { useState, useEffect } from 'react';
import { Logo } from '../../components/Logo';
import { useTranslation } from '../../hooks/useTranslation';
import { useRegion } from '../../contexts/RegionContext';
import translations from './translation.json';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  showProgress?: boolean;
  customSlides?: Array<{
    title: string;
    subtitle: string;
    description: string;
    icon: string;
  }>;
  customTrustContent?: React.ReactNode;
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  showProgress = true,
  customSlides,
  customTrustContent
}: OnboardingLayoutProps) {
  const { t } = useTranslation(translations);
  const { currentRegion } = useRegion();
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultSlides = [
    {
      title: "Transforme sua clínica",
      subtitle: "Em dias, não meses",
      description: "A Krooa nasceu dentro das clínicas reais e entende o que custa caro: resposta demorada, retrabalho e uma agenda que parece cheia, mas não fatura.",
      icon: "⚡"
    },
    {
      title: "Acesso rápido",
      subtitle: "Zero curva de aprendizado",
      description: "Entre no sistema em 5 minutos e veja como tudo se conecta sem precisar de treinamento. Interface intuitiva e processo automatizado.",
      icon: "🚀"
    },
    {
      title: "Resultados nas primeiras semanas",
      subtitle: "Impacto imediato na operação",
      description: "Reduza tarefas manuais, evite falhas humanas e veja seus pacientes voltando com consistência. Eficiência que você sente desde o primeiro dia.",
      icon: "📈"
    },
    {
      title: "IA que trabalha por você",
      subtitle: "Automação 24/7",
      description: "Responde no WhatsApp, confirma, remarca e resolve 24h por dia, mantendo o relacionamento ativo mesmo com a clínica fechada.",
      icon: "🤖"
    },
    {
      title: "Resultados comprovados",
      subtitle: "Dr. Carlos Mendes - Clínica OdontoCare",
      description: "Em 3 meses com a Krooa, nossa produtividade cresceu 40% e os custos administrativos caíram pela metade.",
      icon: "🏆"
    }
  ];

  const slides = customSlides || defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

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


      {/* Main Content */}
      <main className="flex-1 flex relative">
        {/* Carousel motivacional - apenas desktop */}
        <div className="hidden xl:block xl:w-2/5 bg-gradient-to-br from-krooa-blue to-krooa-green relative overflow-hidden">
          <div className="sticky top-0 h-[100vh] flex items-center justify-center p-8">
            <div className="w-full max-w-sm">
            {/* Glassmorphism container */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl h-[480px] flex flex-col">
              {/* Carousel content */}
              <div className="transition-all duration-700 ease-in-out flex-1 flex flex-col">
                <div>
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                    <span className="text-4xl">{slides[currentSlide].icon}</span>
                  </div>

                  {/* Título com altura fixa */}
                  <div className="h-[60px] flex items-center mb-2">
                    <h2 className="text-2xl font-semibold text-white leading-tight tracking-tight text-left">
                      {slides[currentSlide].title}
                    </h2>
                  </div>

                  {/* Subtitle e description com fluxo natural */}
                  <div className="flex-1 flex flex-col justify-start">
                    <p className="text-xs font-medium text-white/60 uppercase tracking-widest mb-4 text-left">
                      {slides[currentSlide].subtitle}
                    </p>
                    <p className="text-base text-white/90 leading-relaxed font-light text-left">
                      {slides[currentSlide].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fixed bottom section */}
              <div className="mt-auto">
                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-6">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-white shadow-sm scale-125'
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>

                {/* Trust indicators */}
                {customTrustContent || (
                  <div className="text-center">
                    <p className="text-xs text-white/60 mb-3 font-medium">
                      {currentRegion === 'US'
                        ? 'More than 1,000 clinics trust KROA'
                        : 'Mais de 1.000 clínicas já confiam na KROA'
                      }
                    </p>
                    <div className="flex justify-center gap-4 text-xs text-white/50">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">
                          {currentRegion === 'US' ? 'SSL Secure' : 'SSL Seguro'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">
                          {currentRegion === 'US' ? 'HIPAA Compliant' : 'LGPD Compliant'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Formulário - desktop e mobile */}
        <div className="flex-1 xl:w-3/5 p-4 xl:p-12 xl:min-h-[100vh] flex items-center">
          <div className="w-full max-w-md xl:max-w-lg mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center text-sm text-gray-500">
            <p>{t?.layout?.footerText || '© 2025 KROA. Todos os direitos reservados.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}