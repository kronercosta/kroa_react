import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../OnboardingLayout';
import { Input } from '../../../components/ui/Input';
import { EnhancedInput } from '../../../components/ui/EnhancedInput';
import { Button } from '../../../components/ui/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { useRegion } from '../../../contexts/RegionContext';
import translations from '../translation.json';

export default function Step3Page() {
  const navigate = useNavigate();
  const { t } = useTranslation(translations);
  const { currentRegion } = useRegion();
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'boleto'>('card');

  const getPlanData = () => {
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    return {
      selectedPlan: onboardingData.selectedPlan || '',
      couponCode: onboardingData.couponCode
    };
  };

  const planData = getPlanData();

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

  const handleNext = (data: {
    cardData: {
      number: string;
      name: string;
      expiry: string;
      cvv: string;
    };
    paymentMethod: 'card' | 'google_pay' | 'stripe_link' | 'boleto';
  }) => {
    // Armazenar dados no sessionStorage
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    const updatedData = { ...onboardingData, ...data };
    sessionStorage.setItem('onboardingData', JSON.stringify(updatedData));

    // Navegar para próxima etapa (configurações avançadas)
    navigate('/onboarding/step4');
  };

  const handleBack = () => {
    navigate('/onboarding/step2');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCard()) {
      setIsLoading(true);
      setTimeout(() => {
        handleNext({
          cardData,
          paymentMethod: 'card'
        });
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

  const handleAlternativePayment = (method: 'google_pay' | 'stripe_link' | 'boleto') => {
    setIsLoading(true);

    if (method === 'google_pay') {
      // Redirecionar para Stripe Checkout com Google Pay habilitado
      setTimeout(() => {
        window.open('https://checkout.stripe.com/demo', '_blank');
        handleNext({
          cardData: {
            number: '**** **** **** 1234',
            name: 'Google Pay',
            expiry: '**/**',
            cvv: '***'
          },
          paymentMethod: 'google_pay'
        });
        setIsLoading(false);
      }, 1000);
    } else if (method === 'stripe_link') {
      // Simular envio de link de pagamento
      setTimeout(() => {
        alert('Link de pagamento enviado! Verifique seu email ou SMS para completar o pagamento.');
        handleNext({
          cardData: {
            number: '**** **** **** LINK',
            name: 'Stripe Link',
            expiry: '**/**',
            cvv: '***'
          },
          paymentMethod: 'stripe_link'
        });
        setIsLoading(false);
      }, 1500);
    } else if (method === 'boleto') {
      // Gerar boleto bancário
      setTimeout(() => {
        alert('Boleto gerado! Você receberá o boleto por e-mail e poderá visualizar/imprimir na próxima tela.');
        handleNext({
          cardData: {
            number: '**** **** **** BOLETO',
            name: 'Boleto Bancário',
            expiry: '**/**',
            cvv: '***'
          },
          paymentMethod: 'boleto'
        });
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={5}
      showProgress={true}
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-krooa-green to-krooa-blue text-white p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">
            {t?.step2?.title || 'Informações de Pagamento'}
          </h1>
          <p className="text-krooa-green-100">
            {t?.step2?.securityNote?.replace('🔒 ', '') || 'Dados seguros e criptografados'}
          </p>
        </div>

        <div className="p-8">
          {/* Plan Summary */}
          {planData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{t?.step2?.orderSummary || 'Resumo do pedido'}</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t?.step2?.plan || 'Plano'} {planData.selectedPlan}</span>
                <span className="font-semibold">{t?.step2?.freeTrial || '7 dias grátis'}</span>
              </div>
              {planData.couponCode && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Cupom: {planData.couponCode}</span>
                  <span>-15%</span>
                </div>
              )}
            </div>
          )}

          {/* Free Trial Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">
                  {t?.step2?.freeTrialPeriod || 'Período de teste gratuito'}
                </p>
                <p className="text-blue-700">
                  {t?.step2?.trialInfo || 'Você terá 7 dias para testar gratuitamente. Após esse período, será cobrado o valor do plano escolhido.'}
                </p>
                <p className="text-blue-700 mt-1">
                  {t?.step2?.cancelInfo || 'Você pode cancelar durante os 7 dias de teste sem cobrança alguma.'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t?.step2?.paymentMethod || 'Forma de pagamento'}</h3>
            <div className="grid grid-cols-1 gap-4">
              <div
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPaymentMethod === 'card'
                    ? 'border-krooa-green bg-krooa-green/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPaymentMethod('card')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedPaymentMethod === 'card'
                          ? 'border-slate-700 bg-slate-700'
                          : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === 'card' && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M2 4h20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h20V6H2zm0 10h20v-6H2v6z"/>
                        </svg>
                        <div>
                          <h4 className="font-semibold text-gray-900">{t?.step2?.creditCard || 'Cartão de Crédito'}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-8 h-6" viewBox="0 0 40 24" fill="none">
                      <rect width="40" height="24" rx="4" fill="#1434CB"/>
                      <path d="M16.2 8.4h7.6v7.2h-7.6z" fill="#FF5F00"/>
                      <path d="M16.7 12c0-1.3.6-2.4 1.5-3.2-.7-.5-1.5-.8-2.5-.8-2.2 0-4 1.8-4 4s1.8 4 4 4c1 0 1.8-.3 2.5-.8-.9-.8-1.5-1.9-1.5-3.2z" fill="#EB001B"/>
                      <path d="M28.7 12c0 2.2-1.8 4-4 4-1 0-1.8-.3-2.5-.8.9-.8 1.5-1.9 1.5-3.2s-.6-2.4-1.5-3.2c.7-.5 1.5-.8 2.5-.8 2.2 0 4 1.8 4 4z" fill="#00A2E5"/>
                    </svg>
                    <svg className="w-8 h-6" viewBox="0 0 40 24" fill="none">
                      <rect width="40" height="24" rx="4" fill="#0066B2"/>
                      <path d="M20 8v8m-4-4l4-4 4 4-4 4-4-4z" stroke="white" strokeWidth="1.5" fill="none"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Google Pay */}
              <button
                type="button"
                className="relative border-2 rounded-lg p-4 border-gray-200 hover:border-gray-300 transition-all text-left"
                onClick={() => handleAlternativePayment('google_pay')}
                disabled={isLoading}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">Google Pay</h4>
                      <p className="text-sm text-gray-600">Pagamento rápido e seguro</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Stripe Link */}
              <button
                type="button"
                className="relative border-2 rounded-lg p-4 border-gray-200 hover:border-gray-300 transition-all text-left"
                onClick={() => handleAlternativePayment('stripe_link')}
                disabled={isLoading}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#00D924">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-6.222 6.222a.749.749 0 01-1.06 0L7.432 11.53a.75.75 0 111.061-1.061l2.323 2.323L16.507 7.1a.75.75 0 111.061 1.06z"/>
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">Stripe Link</h4>
                      <p className="text-sm text-gray-600">Link de pagamento por email/SMS</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Boleto - Only for BR */}
              {currentRegion === 'BR' && (
                <div
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'boleto'
                      ? 'border-krooa-green bg-krooa-green/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPaymentMethod('boleto')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedPaymentMethod === 'boleto'
                            ? 'border-slate-700 bg-slate-700'
                            : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === 'boleto' && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          </svg>
                          <div>
                            <h4 className="font-semibold text-gray-900">{t?.step2?.boleto || 'Boleto Bancário'}</h4>
                            <p className="text-sm text-gray-600">{t?.step2?.boletoDescription || 'Aprovação em ate 48 horas • Não possui teste grátis'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-orange-100 rounded p-2">
                        <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Payment Form */}
          {(currentRegion !== 'BR' || selectedPaymentMethod === 'card') && (
          <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder=""
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

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>{t?.step2?.securityNote || '🔒 Seus dados estão seguros e criptografados'}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>{t?.step2?.securityNote || '🔒 Seus dados estão seguros e criptografados'}</span>
            </div>

            {/* Form Buttons for Card Payment */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
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
                  t?.common?.next || 'Continuar'
                )}
              </Button>
            </div>
          </form>
          )}

          {/* Boleto Payment Option */}
          {currentRegion === 'BR' && selectedPaymentMethod === 'boleto' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-900 mb-1">{t?.step2?.boleto || 'Boleto Bancário'}</h4>
                    <div className="text-sm text-amber-700 space-y-2">
                      {(t?.step2?.boletoDetails || [
                        'O boleto será gerado após a confirmação',
                        'Vencimento em 3 dias corridos',
                        'Acesso liberado em 1-2 dias úteis após o pagamento',
                        'Você receberá o boleto por e-mail e poderá imprimir'
                      ]).map((detail: string, index: number) => (
                        <p key={index}>• {detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => handleAlternativePayment('boleto')}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t?.step2?.generatingBoleto || 'Gerando boleto...'}
                    </div>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                      {t?.step2?.generateBoleto || 'Gerar Boleto'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
}