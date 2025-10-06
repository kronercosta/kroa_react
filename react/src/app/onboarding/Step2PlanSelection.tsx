import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
import { useRegion } from '../../contexts/RegionContext';
import translations from './translation.json';

interface Step2Props {
  onNext: (data: {
    selectedPlan: string;
    couponCode?: string;
    termsAccepted: boolean;
    lgpdAccepted: boolean;
  }) => void;
  onBack: () => void;
}

export function Step2PlanSelection({ onNext, onBack }: Step2Props) {
  const { t } = useTranslation(translations);
  const { currentRegion } = useRegion();
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const plans = currentRegion === 'BR' ? {
    basic: {
      name: t?.step2?.plans?.basic?.name || 'Básico',
      price: t?.step2?.plans?.basic?.price || 'R$ 149,90',
      period: t?.step2?.plans?.basic?.period || '/mês',
      features: t?.step2?.plans?.basic?.features || [
        'Até 2 profissionais',
        'Agenda básica',
        'Relatórios simples'
      ]
    },
    professional: {
      name: t?.step2?.plans?.professional?.name || 'Profissional',
      price: t?.step2?.plans?.professional?.price || 'R$ 299,90',
      period: t?.step2?.plans?.professional?.period || '/mês',
      features: t?.step2?.plans?.professional?.features || [
        'Até 5 profissionais',
        'Agenda completa',
        'Relatórios avançados',
        'Centro de custo'
      ]
    },
    enterprise: {
      name: t?.step2?.plans?.enterprise?.name || 'Empresarial',
      price: t?.step2?.plans?.enterprise?.price || 'R$ 599,90',
      period: t?.step2?.plans?.enterprise?.period || '/mês',
      features: t?.step2?.plans?.enterprise?.features || [
        'Profissionais ilimitados',
        'Múltiplas unidades',
        'NFSe integrado',
        'API completa'
      ]
    }
  } : {
    basic: {
      name: 'Starter',
      price: '$49.00',
      period: '/month',
      features: [
        'Up to 2 providers',
        'Basic scheduling',
        'Simple reports'
      ]
    },
    professional: {
      name: 'Professional',
      price: '$99.00',
      period: '/month',
      features: [
        'Up to 5 providers',
        'Advanced scheduling',
        'Detailed reports',
        'Cost centers',
        'Insurance billing'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: '$199.00',
      period: '/month',
      features: [
        'Unlimited providers',
        'Multiple locations',
        'HIPAA compliant',
        'Full API access'
      ]
    }
  };

  const applyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');

    const validCoupons = ['KROA10', 'DESCONTO15', 'PROMOCAO20'];

    if (!couponCode.trim()) {
      setCouponError('Digite um código de cupom');
      return;
    }

    if (validCoupons.includes(couponCode.toUpperCase())) {
      setCouponSuccess('Cupom aplicado com sucesso! 15% de desconto');
    } else {
      setCouponError('Cupom inválido ou expirado');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!termsAccepted) {
      newErrors.terms = 'Você deve aceitar os termos de responsabilidade';
    }

    if (!lgpdAccepted) {
      newErrors.lgpd = 'Você deve aceitar os termos da LGPD';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setTimeout(() => {
        onNext({
          selectedPlan,
          couponCode: couponSuccess ? couponCode : undefined,
          termsAccepted,
          lgpdAccepted
        });
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-krooa-green to-krooa-blue text-white p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">
          {t?.step2?.title || 'Escolha seu plano'}
        </h1>
        <p className="text-krooa-green-100">
          Teste grátis por 7 dias, sem compromisso
        </p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Plan Selection */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Escolha seu plano:</h3>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(plans).map(([planKey, plan]) => (
                <div
                  key={planKey}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPlan === planKey
                      ? 'border-krooa-green bg-krooa-green/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan(planKey)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedPlan === planKey
                            ? 'border-krooa-green bg-krooa-green'
                            : 'border-gray-300'
                        }`}>
                          {selectedPlan === planKey && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                          <span className="text-gray-500">{plan.period}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 ml-7">
                        {plan.features.join(' • ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Tem um cupom de desconto?</h3>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={couponCode}
                  onChange={(value) => setCouponCode(value.toUpperCase())}
                  placeholder="Digite seu código"
                  error={couponError}
                />
                {couponSuccess && (
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {couponSuccess}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={applyCoupon}
                disabled={!couponCode.trim()}
              >
                Aplicar
              </Button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Termos e Condições</h3>

            {/* LGPD Terms */}
            <div className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="lgpd-terms"
                  checked={lgpdAccepted}
                  onChange={(e) => setLgpdAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                />
                <div className="flex-1">
                  <label htmlFor="lgpd-terms" className="text-sm text-gray-700 cursor-pointer">
                    Li e aceito os{' '}
                    <button
                      type="button"
                      className="text-krooa-green hover:underline font-medium"
                      onClick={() => {
                        // Abrir modal ou nova página com termos LGPD
                        window.open('/termos-lgpd', '_blank');
                      }}
                    >
                      Termos de Tratamento de Dados Pessoais (LGPD)
                    </button>
                  </label>
                  {errors.lgpd && (
                    <p className="text-sm text-red-600 mt-1">{errors.lgpd}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Responsibility Terms */}
            <div className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="admin-terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
                />
                <div className="flex-1">
                  <label htmlFor="admin-terms" className="text-sm text-gray-700 cursor-pointer">
                    Li e aceito os{' '}
                    <button
                      type="button"
                      className="text-krooa-green hover:underline font-medium"
                      onClick={() => {
                        // Abrir modal ou nova página com termos de responsabilidade
                        window.open('/termos-responsabilidade', '_blank');
                      }}
                    >
                      Termos de Responsabilidade do Usuário Administrador
                    </button>
                  </label>
                  {errors.terms && (
                    <p className="text-sm text-red-600 mt-1">{errors.terms}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">
                    Período de teste gratuito
                  </p>
                  <p className="text-blue-700">
                    Você terá 7 dias para testar gratuitamente. Após esse período, será cobrado o valor do plano escolhido.
                    Você pode cancelar durante os 7 dias de teste sem cobrança alguma.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Voltar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Carregando...
                </div>
              ) : (
                'Continuar para pagamento'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}