import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
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
  const { currentRegion, config } = useRegion();
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
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

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    }
    return numbers;
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
            ]).map((benefit, index) => (
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
                        <span className="text-2xl font-bold text-krooa-green">{plan.price}</span>
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

          <Input
            label={t?.step2?.cardNumber || 'Número do cartão'}
            value={cardData.number}
            onChange={(value) => {
              const formatted = formatCardNumber(value.replace(/\D/g, ''));
              if (formatted.replace(/\s/g, '').length <= 16) {
                setCardData(prev => ({ ...prev, number: formatted }));
              }
            }}
            placeholder="1234 5678 9012 3456"
            error={errors.number}
            maxLength={19}
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
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>{t?.step2?.securityNote || '🔒 Seus dados estão seguros e criptografados'}</span>
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