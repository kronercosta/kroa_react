import React from 'react';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/Logo';
import { useTranslation } from '../../hooks/useTranslation';
import translations from './translation.json';

interface LandingEntryProps {
  onStartOnboarding: () => void;
}

export function LandingEntry({ onStartOnboarding }: LandingEntryProps) {
  const { t } = useTranslation(translations);

  return (
    <div className="min-h-screen bg-gradient-to-br from-krooa-green/10 via-blue-50 to-krooa-blue/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900 font-medium">
                Entrar
              </button>
              <Button variant="outline" size="sm">
                Falar com vendas
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Gestão odontológica{' '}
              <span className="bg-gradient-to-r from-krooa-green to-krooa-blue bg-clip-text text-transparent">
                completa
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Simplifique a gestão da sua clínica com nossa plataforma completa.
              Agenda, prontuários, financeiro e muito mais em um só lugar.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <div className="w-12 h-12 bg-krooa-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-krooa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Agenda Inteligente</h3>
              <p className="text-sm text-gray-600">
                Agendamento online, confirmações automáticas e controle de faltas
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <div className="w-12 h-12 bg-krooa-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-krooa-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Prontuário Digital</h3>
              <p className="text-sm text-gray-600">
                Histórico completo dos pacientes com anexos e evolução
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Controle Financeiro</h3>
              <p className="text-sm text-gray-600">
                Faturamento, relatórios e integração com meios de pagamento
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Comece hoje mesmo - é grátis!
            </h2>
            <p className="text-gray-600 mb-6">
              Teste por 7 dias todas as funcionalidades. Sem compromisso, sem taxa de setup.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={onStartOnboarding}
                className="w-full sm:w-auto px-8"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Testar agora
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Agendar demonstração
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Sem cartão necessário</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cancele quando quiser</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Suporte incluso</span>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-12">
            <p className="text-sm text-gray-500 mb-4">Mais de 1.000 clínicas já confiam na KROA</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              {/* Placeholder for customer logos */}
              <div className="w-24 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-400">Logo 1</span>
              </div>
              <div className="w-24 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-400">Logo 2</span>
              </div>
              <div className="w-24 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-400">Logo 3</span>
              </div>
              <div className="w-24 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-400">Logo 4</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}