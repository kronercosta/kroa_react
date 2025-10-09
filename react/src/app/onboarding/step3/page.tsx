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
  const [boletoData, setBoletoData] = useState({
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'boleto'>('card');

  const getPlanData = () => {
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    return {
      selectedPlan: onboardingData.selectedPlan || 'complete',
      selectedPeriod: onboardingData.selectedPeriod || 'monthly',
      couponCode: onboardingData.couponCode,
      appliedCoupon: onboardingData.appliedCoupon,
      finalPrice: onboardingData.finalPrice || 0
    };
  };

  const planData = getPlanData();

  // Função para formatar preço baseado na região
  const formatCurrency = (value: number) => {
    if (currentRegion === 'BR') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    }
  };

  // Preços baseados na região e período
  const basePrices = {
    BR: {
      monthly: 192.00,
      quarterly: 576.00,
      yearly: 1920.00
    },
    US: {
      monthly: 730.00,
      quarterly: 2190.00,
      yearly: 7300.00
    }
  };

  const getCurrentPrice = () => {
    const regionKey = currentRegion as keyof typeof basePrices;
    return basePrices[regionKey][planData.selectedPeriod as keyof typeof basePrices[typeof regionKey]];
  };

  const calculateFinalPrice = () => {
    let basePrice = getCurrentPrice();

    // Aplicar desconto se houver cupom
    if (planData.appliedCoupon) {
      if (planData.appliedCoupon.type === 'percentage') {
        basePrice = basePrice * (1 - planData.appliedCoupon.discount / 100);
      } else {
        basePrice = Math.max(0, basePrice - planData.appliedCoupon.discount);
      }
    }

    return basePrice;
  };

  const periodNames = {
    monthly: currentRegion === 'BR' ? 'Mensal' : 'Monthly',
    quarterly: currentRegion === 'BR' ? 'Trimestral' : 'Quarterly',
    yearly: currentRegion === 'BR' ? 'Anual' : 'Yearly'
  };

  const planNames = {
    complete: currentRegion === 'BR' ? 'Plano Completo' : 'Complete Plan'
  };

  // Determinar se deve mostrar 7 dias grátis (não para boleto)
  const showFreeTrial = selectedPaymentMethod === 'card';
  const finalPrice = calculateFinalPrice();

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

  const validateBoleto = () => {
    const newErrors: Record<string, string> = {};

    if (!boletoData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!boletoData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(boletoData.cpf)) {
      newErrors.cpf = 'CPF inválido (formato: 000.000.000-00)';
    }

    if (!boletoData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(boletoData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!boletoData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!boletoData.address.street.trim()) {
      newErrors['address.street'] = 'Endereço é obrigatório';
    }

    if (!boletoData.address.number.trim()) {
      newErrors['address.number'] = 'Número é obrigatório';
    }

    if (!boletoData.address.neighborhood.trim()) {
      newErrors['address.neighborhood'] = 'Bairro é obrigatório';
    }

    if (!boletoData.address.city.trim()) {
      newErrors['address.city'] = 'Cidade é obrigatória';
    }

    if (!boletoData.address.state.trim()) {
      newErrors['address.state'] = 'Estado é obrigatório';
    }

    if (!boletoData.address.zipCode.trim()) {
      newErrors['address.zipCode'] = 'CEP é obrigatório';
    } else if (!/^\d{5}-\d{3}$/.test(boletoData.address.zipCode)) {
      newErrors['address.zipCode'] = 'CEP inválido (formato: 00000-000)';
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
    paymentMethod: 'card' | 'google_pay' | 'apple_pay' | 'stripe_link' | 'boleto';
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

    if (selectedPaymentMethod === 'card') {
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
    } else if (selectedPaymentMethod === 'boleto') {
      if (validateBoleto()) {
        setIsLoading(true);
        setTimeout(() => {
          handleNext({
            cardData: {
              number: '**** **** **** BOLETO',
              name: boletoData.fullName,
              expiry: '**/**',
              cvv: '***'
            },
            paymentMethod: 'boleto'
          });
          setIsLoading(false);
        }, 1500);
      }
    }
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    }
    return numbers;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  const handleAlternativePayment = (method: 'google_pay' | 'apple_pay' | 'stripe_link' | 'boleto') => {
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
    } else if (method === 'apple_pay') {
      // Simular autenticação com Apple Pay
      setTimeout(() => {
        handleNext({
          cardData: {
            number: '**** **** **** 9876',
            name: 'Apple Pay',
            expiry: '**/**',
            cvv: '***'
          },
          paymentMethod: 'apple_pay'
        });
        setIsLoading(false);
      }, 1200);
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
        <div className="bg-gradient-to-r from-krooa-blue to-krooa-green text-white p-8 text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {t?.step2?.title || 'Informações de Pagamento'}
          </h1>
          <p className="text-krooa-green-100" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            {t?.step2?.securityNote?.replace('🔒 ', '') || 'Dados seguros e criptografados'}
          </p>
        </div>

        <div className="p-8">
          {/* Plan Summary */}
          {planData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t?.step3?.orderSummary || 'Resumo do pedido'}</h3>

              {/* Plan Details */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {planNames[planData.selectedPlan as keyof typeof planNames] || 'Plano Completo'} - {periodNames[planData.selectedPeriod as keyof typeof periodNames]}
                  </span>
                  <span className="font-semibold">{formatCurrency(getCurrentPrice())}</span>
                </div>

                {/* Cupom aplicado */}
                {planData.appliedCoupon && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Cupom: {planData.couponCode}</span>
                    <span>
                      -{planData.appliedCoupon.type === 'percentage'
                        ? `${planData.appliedCoupon.discount}%`
                        : formatCurrency(planData.appliedCoupon.discount)
                      }
                    </span>
                  </div>
                )}

                {/* 7 dias grátis (só para cartão) */}
                {showFreeTrial && (
                  <div className="flex justify-between items-center text-blue-600 bg-blue-50 p-2 rounded">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {t?.step3?.freeTrial || '7 dias grátis'}
                    </span>
                    <span className="font-semibold">{formatCurrency(0)}</span>
                  </div>
                )}

                {/* Total */}
                <div className="border-t pt-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      {showFreeTrial ? (t?.step3?.totalAfterTrial || 'Total após trial') : (t?.step3?.total || 'Total')}
                    </span>
                    <span className="text-lg font-bold text-krooa-blue">
                      {showFreeTrial ? formatCurrency(finalPrice) : formatCurrency(finalPrice)}
                    </span>
                  </div>

                  {showFreeTrial && (
                    <p className="text-xs text-gray-500 mt-1">
                      {t?.step3?.trialInfo || 'Você será cobrado apenas após o período de teste de 7 dias'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}


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

              {/* Apple Pay */}
              <button
                type="button"
                className="relative border-2 rounded-lg p-4 border-gray-200 hover:border-gray-300 transition-all text-left"
                onClick={() => handleAlternativePayment('apple_pay')}
                disabled={isLoading}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900">Apple Pay</h4>
                      <p className="text-sm text-gray-600">Pagamento seguro com Touch ID ou Face ID</p>
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
                            <h4 className="font-semibold text-gray-900">{t?.step3?.boleto || 'Boleto Bancário'}</h4>
                            <p className="text-sm text-gray-600">{t?.step3?.boletoDescription || 'Aprovação em até 2 dias úteis • Sem período de teste'}</p>
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

            {/* Free Trial Info */}
            <div className="bg-blue-50 rounded-lg p-4 mt-6">
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

              {/* Boleto Form */}
              <form id="boleto-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Dados para emissão do boleto</h3>

                  {/* Personal Data */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Nome completo"
                      value={boletoData.fullName}
                      onChange={(value) => setBoletoData(prev => ({ ...prev, fullName: value }))}
                      error={errors.fullName}
                      required
                      fullWidth
                    />

                    <Input
                      label="CPF"
                      value={boletoData.cpf}
                      onChange={(value) => {
                        const formatted = formatCPF(value);
                        setBoletoData(prev => ({ ...prev, cpf: formatted }));
                      }}
                      placeholder="000.000.000-00"
                      error={errors.cpf}
                      required
                      fullWidth
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="E-mail"
                      type="email"
                      value={boletoData.email}
                      onChange={(value) => setBoletoData(prev => ({ ...prev, email: value }))}
                      error={errors.email}
                      required
                      fullWidth
                    />

                    <Input
                      label="Telefone"
                      value={boletoData.phone}
                      onChange={(value) => setBoletoData(prev => ({ ...prev, phone: value }))}
                      error={errors.phone}
                      required
                      fullWidth
                    />
                  </div>

                  {/* Address */}
                  <h4 className="font-medium text-gray-900 mb-3">Endereço</h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Endereço"
                        value={boletoData.address.street}
                        onChange={(value) => setBoletoData(prev => ({
                          ...prev,
                          address: { ...prev.address, street: value }
                        }))}
                        error={errors['address.street']}
                        required
                        fullWidth
                      />
                    </div>

                    <Input
                      label="Número"
                      value={boletoData.address.number}
                      onChange={(value) => setBoletoData(prev => ({
                        ...prev,
                        address: { ...prev.address, number: value }
                      }))}
                      error={errors['address.number']}
                      required
                      fullWidth
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Complemento (opcional)"
                      value={boletoData.address.complement}
                      onChange={(value) => setBoletoData(prev => ({
                        ...prev,
                        address: { ...prev.address, complement: value }
                      }))}
                      fullWidth
                    />

                    <Input
                      label="Bairro"
                      value={boletoData.address.neighborhood}
                      onChange={(value) => setBoletoData(prev => ({
                        ...prev,
                        address: { ...prev.address, neighborhood: value }
                      }))}
                      error={errors['address.neighborhood']}
                      required
                      fullWidth
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                      label="Cidade"
                      value={boletoData.address.city}
                      onChange={(value) => setBoletoData(prev => ({
                        ...prev,
                        address: { ...prev.address, city: value }
                      }))}
                      error={errors['address.city']}
                      required
                      fullWidth
                    />

                    <Input
                      label="Estado"
                      value={boletoData.address.state}
                      onChange={(value) => setBoletoData(prev => ({
                        ...prev,
                        address: { ...prev.address, state: value.toUpperCase() }
                      }))}
                      placeholder="SP"
                      maxLength={2}
                      error={errors['address.state']}
                      required
                      fullWidth
                    />

                    <Input
                      label="CEP"
                      value={boletoData.address.zipCode}
                      onChange={(value) => {
                        const formatted = formatCEP(value);
                        setBoletoData(prev => ({
                          ...prev,
                          address: { ...prev.address, zipCode: formatted }
                        }));
                      }}
                      placeholder="00000-000"
                      error={errors['address.zipCode']}
                      required
                      fullWidth
                    />
                  </div>
                </div>
              </form>


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
                  type="submit"
                  variant="primary"
                  form="boleto-form"
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