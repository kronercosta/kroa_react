import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { EnhancedInput } from '../../components/ui/EnhancedInput';
import { Button } from '../../components/ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
import { useRegion } from '../../contexts/RegionContext';
import translations from './translation.json';

interface Step2Props {
  onNext: (data: {
    selectedPlan: string;
    cardData: {
      number: string;
      name: string;
      expiry: string;
      cvv: string;
    };
  }) => void;
  onBack: () => void;
}

export function Step2Subscription({ onNext, onBack }: Step2Props) {
  const { t } = useTranslation(translations);
  const { currentRegion } = useRegion();
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
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

  const validateCard = () => {
    const newErrors: Record<string, string> = {};

    if (!cardData.number.replace(/\s/g, '')) {
      newErrors.number = 'Número do cartão é obrigatório';
    } else if (cardData.number.replace(/\s/g, '').length < 16) {
      newErrors.number = 'Número do cartão inválido';
    }

    if (!cardData.name.trim()) {
      newErrors.name = 'Nome no cartão é obrigatório';
    }

    if (!cardData.expiry) {
      newErrors.expiry = 'Data de validade é obrigatória';
    } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      newErrors.expiry = 'Formato inválido (MM/AA)';
    }

    if (!cardData.cvv) {
      newErrors.cvv = 'CVV é obrigatório';
    } else if (cardData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCard()) {
      setIsLoading(true);
      setTimeout(() => {
        onNext({ selectedPlan, cardData });
        setIsLoading(false);
      }, 1500);
    }
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    }
    return numbers;
  };

  const applyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');

    // Simular validação de cupom
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

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-krooa-green to-krooa-blue text-white p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">
          {t?.step2?.title || 'Teste grátis por 7 dias'}
        </h1>
        <p className="text-krooa-green-100">
          {t?.step2?.subtitle || 'Experimente todas as funcionalidades sem compromisso'}
        </p>
      </div>

      <div className="p-8">
        {/* Benefits */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {(t?.step2?.benefits || [
              '✓ Acesso completo a todas as funcionalidades',
              '✓ Suporte técnico incluído',
              '✓ Sem taxas de configuração',
              '✓ Cancele a qualquer momento'
            ]).map((benefit: string, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500 font-medium">{benefit.split(' ')[0]}</span>
                <span>{benefit.replace(benefit.split(' ')[0], '').trim()}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">
                  {t?.step2?.trialInfo || 'Você terá 7 dias para testar gratuitamente. Após esse período, será cobrado o valor do plano escolhido.'}
                </p>
                <p className="text-blue-700">
                  {t?.step2?.cancelInfo || 'Você pode cancelar durante os 7 dias de teste sem cobrança alguma.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="mb-8">
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
        <div className="mb-8 bg-gray-50 rounded-lg p-4">
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

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              {t?.step2?.cardInfo || 'Cartão de crédito'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {t?.step2?.cardInfoDescription || 'Precisamos do seu cartão para garantir a continuidade do serviço após o período de teste'}
            </p>
          </div>

          <EnhancedInput
            label={t?.step2?.cardNumber || 'Número do cartão'}
            mask="creditCard"
            validation="creditCard"
            value={cardData.number}
            onChange={(value) => {
              setCardData(prev => ({ ...prev, number: value }));
            }}
            placeholder="1234 5678 9012 3456"
            error={errors.number}
            fullWidth
          />

          <Input
            label={t?.step2?.cardName || 'Nome no cartão'}
            value={cardData.name}
            onChange={(value) => setCardData(prev => ({ ...prev, name: value.toUpperCase() }))}
            placeholder="JOÃO SILVA"
            error={errors.name}
            fullWidth
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t?.step2?.cardExpiry || 'Validade'}
              value={cardData.expiry}
              onChange={(value) => {
                const formatted = formatExpiry(value);
                setCardData(prev => ({ ...prev, expiry: formatted }));
              }}
              placeholder="MM/AA"
              error={errors.expiry}
              maxLength={5}
            />

            <Input
              label={t?.step2?.cardCvv || 'CVV'}
              value={cardData.cvv}
              onChange={(value) => {
                const numbers = value.replace(/\D/g, '');
                if (numbers.length <= 4) {
                  setCardData(prev => ({ ...prev, cvv: numbers }));
                }
              }}
              placeholder="123"
              error={errors.cvv}
              maxLength={4}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
            </svg>
            <span>{t?.step2?.securityNote || '🔒 Seus dados estão seguros e criptografados'}</span>
          </div>

          {/* Payment Methods */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center mb-4">
              <span className="text-sm text-gray-500 bg-white px-3">ou pague com</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  // Simular checkout com Google Pay
                  setIsLoading(true);
                  setTimeout(() => {
                    onNext({
                      selectedPlan,
                      cardData: {
                        number: '**** **** **** 1234',
                        name: 'Google Pay',
                        expiry: '**/**',
                        cvv: '***'
                      }
                    });
                    setIsLoading(false);
                  }, 2000);
                }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-gray-700">Google Pay</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  // Simular integração com Stripe
                  window.open('https://checkout.stripe.com/demo', '_blank');
                }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#635BFF">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                </svg>
                <span className="font-medium text-gray-700">Stripe</span>
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              {t?.common?.back || 'Voltar'}
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
                  {t?.common?.loading || 'Carregando...'}
                </div>
              ) : (
                t?.step2?.startTrial || 'Iniciar teste grátis'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}