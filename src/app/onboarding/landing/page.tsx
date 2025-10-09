import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Logo } from '../../../components/Logo';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartOnboarding = () => {
    // Limpar dados anteriores do sessionStorage
    sessionStorage.removeItem('onboardingData');

    // Navegar para primeira etapa
    navigate('/onboarding/step1');
  };

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
            <div className="inline-flex items-center bg-gradient-to-r from-krooa-green/10 to-krooa-blue/10 rounded-full px-6 py-2 mb-6">
              <span className="text-sm font-medium text-krooa-blue">✨ Transforme sua clínica em 30 dias</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Pare de perder dinheiro com{' '}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                gestão inadequada
              </span>
              <br />
              <span className="bg-gradient-to-r from-krooa-blue to-krooa-green bg-clip-text text-transparent">
                Multiplique seus resultados
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              <strong>Você sabia que 70% das clínicas perdem até R$ 50.000/mês por falta de organização?</strong>
              <br />
              A KROA já ajudou mais de 1.000 dentistas a aumentarem seu faturamento em até 300%
              através de gestão inteligente e automação completa.
            </p>
          </div>

          {/* ROI Impact Section */}
          <div className="bg-gradient-to-r from-krooa-blue to-krooa-green rounded-2xl p-8 mb-12 text-white">
            <h2 className="text-2xl font-bold mb-6">Resultados que nossos clientes alcançaram:</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">+300%</div>
                <div className="text-white/90">Aumento no faturamento</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">-80%</div>
                <div className="text-white/90">Redução em faltas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">+5h</div>
                <div className="text-white/90">Tempo livre por dia</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-krooa-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-krooa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Agenda que Vende</h3>
              <p className="text-sm text-gray-600 mb-3">
                Agendamento 24h, confirmações automáticas e remarketing para faltas
              </p>
              <div className="text-xs text-krooa-green font-medium">
                ↗️ +40% mais consultas
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-krooa-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-krooa-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Prontuário Inteligente</h3>
              <p className="text-sm text-gray-600 mb-3">
                IA sugere tratamentos, histórico unificado e compliance total
              </p>
              <div className="text-xs text-krooa-blue font-medium">
                ⚡ 70% mais eficiência
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Financeiro que Funciona</h3>
              <p className="text-sm text-gray-600 mb-3">
                Cobrança automática, relatórios gerenciais e integração bancária
              </p>
              <div className="text-xs text-green-600 font-medium">
                💰 +200% cobrança efetiva
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Marketing Automático</h3>
              <p className="text-sm text-gray-600 mb-3">
                WhatsApp, email e SMS automáticos para fidelização total
              </p>
              <div className="text-xs text-purple-600 font-medium">
                🎯 +150% retenção
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              O que nossos clientes estão dizendo:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-krooa-blue rounded-full flex items-center justify-center text-white font-bold">
                    DR
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Dr. Roberto Silva</h4>
                    <p className="text-sm text-gray-600">Clínica OdontoCare - SP</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Em 6 meses aumentei meu faturamento em 280%. A KROA automatizou tudo: agenda, cobrança, remarketing.
                  Agora tenho tempo para focar no que amo: cuidar dos pacientes."
                </p>
                <div className="flex text-yellow-400 mt-2">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-krooa-green rounded-full flex items-center justify-center text-white font-bold">
                    DA
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Dra. Ana Costa</h4>
                    <p className="text-sm text-gray-600">Sorriso Dental - RJ</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Reduzi 90% das faltas com os lembretes automáticos. O sistema de cobrança recuperou R$ 45.000
                  em inadimplência em apenas 3 meses. Incrível!"
                </p>
                <div className="flex text-yellow-400 mt-2">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>
          </div>

          {/* Urgency CTA Section */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center bg-red-100 text-red-800 rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-medium">⚠️ ATENÇÃO: Oferta por tempo limitado</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pare de perder dinheiro HOJE!
              </h2>
              <p className="text-lg text-gray-700 mb-2">
                <strong>Cada dia sem a KROA = R$ 1.500 perdidos em média</strong>
              </p>
              <p className="text-gray-600 mb-6">
                Teste GRÁTIS por 7 dias todas as funcionalidades. Setup completo em 24h.
                Mais de 1.000 dentistas já transformaram suas clínicas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartOnboarding}
                className="w-full sm:w-auto px-8 bg-gradient-to-r from-krooa-blue to-krooa-green hover:from-krooa-blue/90 hover:to-krooa-green/90 text-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                COMEÇAR GRÁTIS AGORA
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-krooa-blue text-krooa-blue hover:bg-krooa-blue hover:text-white"
              >
                📞 Falar com especialista
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-center">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">7 dias grátis</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Setup em 24h</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Garantia 30 dias</span>
              </div>
            </div>
          </div>

          {/* Competition Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 mt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Por que escolher a KROA?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Somos a única plataforma que realmente entende a realidade do dentista brasileiro.
                Veja a diferença:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">😤</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Concorrentes</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complexos e caros</li>
                  <li>• Suporte terceirizado</li>
                  <li>• Adaptações genéricas</li>
                  <li>• Setup de 3-6 meses</li>
                </ul>
              </div>

              <div className="text-center border-2 border-krooa-green rounded-xl p-4 bg-krooa-green/5">
                <div className="w-16 h-16 bg-krooa-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-semibold text-krooa-green mb-2">KROA</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Simples e acessível</li>
                  <li>• Suporte especializado</li>
                  <li>• Feito para dentistas</li>
                  <li>• Setup em 24 horas</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Papel e Excel</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Perda de informações</li>
                  <li>• Retrabalho constante</li>
                  <li>• Falhas na cobrança</li>
                  <li>• Stress e perda de tempo</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <div className="inline-flex items-center bg-krooa-green/10 text-krooa-green rounded-full px-6 py-3">
                <span className="font-medium">🏆 Mais de 1.000 clínicas já mudaram para a KROA</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}