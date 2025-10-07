import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../OnboardingLayout';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useTranslation } from '../../../hooks/useTranslation';
import { useRegion } from '../../../contexts/RegionContext';
import translations from '../translation.json';

export default function Step2Page() {
  const navigate = useNavigate();
  const { t } = useTranslation(translations);
  const { currentRegion, formatCurrency } = useRegion();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{discount: number, type: 'percentage' | 'fixed'} | null>(null);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [hipaaAccepted, setHipaaAccepted] = useState(false);
  const [adminAccepted, setAdminAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [documentModal, setDocumentModal] = useState<{
    isOpen: boolean;
    type: 'lgpd' | 'hipaa' | 'admin' | 'addons' | null;
  }>({ isOpen: false, type: null });

  // Aguardar carregamento das traduções
  if (!t || !t.step2) {
    return (
      <OnboardingLayout currentStep={2} totalSteps={5} showProgress={true}>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-6 h-6 border-2 border-krooa-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </OnboardingLayout>
    );
  }

  // Preços baseados na região e período
  const basePrices = {
    BR: {
      monthly: 192.00,
      quarterly: 576.00, // 3x mensal
      yearly: 1920.00    // 10x mensal
    },
    US: {
      monthly: 730.00,
      quarterly: 2190.00, // 3x mensal
      yearly: 7300.00    // 10x mensal
    }
  };

  const addOnPrices = {
    BR: { whatsapp: 89.00, ai: 100.00 },
    US: { whatsapp: 89.00, ai: 100.00 }
  };

  const getCurrentPrice = () => {
    const regionKey = currentRegion as keyof typeof basePrices;
    return basePrices[regionKey][selectedPeriod];
  };

  const getAddOnPrice = (addon: 'whatsapp' | 'ai') => {
    const regionKey = currentRegion as keyof typeof addOnPrices;
    return addOnPrices[regionKey][addon];
  };

  const calculateTotal = () => {
    let basePrice = getCurrentPrice();

    // Aplicar desconto se houver cupom
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        basePrice = basePrice * (1 - appliedCoupon.discount / 100);
      } else {
        basePrice = Math.max(0, basePrice - appliedCoupon.discount);
      }
    }

    return basePrice;
  };

  const planDetails = {
    name: t?.step2?.plans?.complete?.name || 'Plano Completo',
    features: t?.step2?.plans?.complete?.features || [
      'Usuários ilimitados',
      'Cadeiras ilimitadas',
      'Centro de custo',
      'Unidades ilimitadas',
      'Módulos de agenda',
      'Módulo financeiro',
      '15GB de storage',
      currentRegion === 'BR' ? 'Assinatura digital (adicional)' : 'Digital signature available'
    ]
  };

  const periodOptions = [
    {
      key: 'monthly' as const,
      name: t?.step2?.periods?.monthly || 'Mensal',
      suffix: t?.step2?.periods?.monthlySuffix || '/mês'
    },
    {
      key: 'quarterly' as const,
      name: t?.step2?.periods?.quarterly || 'Trimestral',
      suffix: t?.step2?.periods?.quarterlySuffix || '/trimestre',
      discount: currentRegion === 'BR' ? '' : ''
    },
    {
      key: 'yearly' as const,
      name: t?.step2?.periods?.yearly || 'Anual',
      suffix: t?.step2?.periods?.yearlySuffix || '/ano',
      discount: t?.step2?.periods?.yearlyDiscount || '2 meses grátis'
    }
  ];

  const applyCoupon = () => {
    setCouponError('');
    setAppliedCoupon(null);

    // Cupons válidos por região com valores ajustados
    const validCoupons = currentRegion === 'BR' ? {
      'DESCONTO10': { discount: 10, type: 'percentage' as const },
      'PRIMEIRA50': { discount: 50, type: 'fixed' as const },
      'TESTE30': { discount: 30, type: 'percentage' as const },
      'BEMVINDO': { discount: 15, type: 'percentage' as const },
      'PROMO20': { discount: 20, type: 'percentage' as const },
      // Aceitar cupons em inglês para região BR
      'DISCOUNT10': { discount: 10, type: 'percentage' as const },
      'FIRST50': { discount: 50, type: 'fixed' as const },
      'TEST30': { discount: 30, type: 'percentage' as const },
      'WELCOME': { discount: 15, type: 'percentage' as const },
      'PROMO20': { discount: 20, type: 'percentage' as const }
    } : {
      'DISCOUNT10': { discount: 10, type: 'percentage' as const },
      'FIRST50': { discount: 50, type: 'fixed' as const },
      'TEST30': { discount: 30, type: 'percentage' as const },
      'WELCOME': { discount: 15, type: 'percentage' as const },
      'PROMO20': { discount: 20, type: 'percentage' as const },
      // Aceitar cupons em português para região US
      'DESCONTO10': { discount: 10, type: 'percentage' as const },
      'PRIMEIRA50': { discount: 50, type: 'fixed' as const },
      'TESTE30': { discount: 30, type: 'percentage' as const },
      'BEMVINDO': { discount: 15, type: 'percentage' as const }
    };

    if (!couponCode.trim()) {
      setCouponError(t?.step2?.couponInvalid || 'Digite um código de cupom');
      return;
    }

    const coupon = validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons];
    if (coupon) {
      setAppliedCoupon(coupon);
    } else {
      setCouponError(t?.step2?.couponInvalid || 'Cupom inválido ou expirado');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!adminAccepted) {
      newErrors.admin = t?.step2?.termsRequired || 'Você deve aceitar os termos de responsabilidade';
    }

    if (currentRegion === 'BR' && !lgpdAccepted) {
      newErrors.lgpd = t?.step2?.termsRequired || 'Você deve aceitar os termos da LGPD';
    }

    if (currentRegion === 'US' && !hipaaAccepted) {
      newErrors.hipaa = t?.step2?.termsRequired || 'You must accept the HIPAA terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (data: {
    selectedPlan: string;
    selectedPeriod: 'monthly' | 'quarterly' | 'yearly';
    appliedCoupon: {discount: number, type: 'percentage' | 'fixed'} | null;
    finalPrice: number;
    couponCode?: string;
    termsAccepted: boolean;
    lgpdAccepted?: boolean;
    hipaaAccepted?: boolean;
    adminAccepted: boolean;
  }) => {
    // Armazenar dados no sessionStorage
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    const updatedData = { ...onboardingData, ...data };
    sessionStorage.setItem('onboardingData', JSON.stringify(updatedData));

    // Navegar para próxima etapa (pagamento)
    navigate('/onboarding/step3');
  };

  const handleBack = () => {
    navigate('/onboarding/step1');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setTimeout(() => {
        handleNext({
          selectedPlan: 'complete',
          selectedPeriod,
          appliedCoupon,
          finalPrice: calculateTotal(),
          couponCode: appliedCoupon ? couponCode : undefined,
          termsAccepted: true,
          lgpdAccepted: currentRegion === 'BR' ? lgpdAccepted : undefined,
          hipaaAccepted: currentRegion === 'US' ? hipaaAccepted : undefined,
          adminAccepted
        });
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={5}
      showProgress={true}
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-krooa-blue to-krooa-green text-white p-8 text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {t?.step2?.title || 'Escolha seu plano'}
          </h1>
          <p className="text-krooa-green-100" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            {t?.step2?.subtitle || 'Escolha o melhor período para sua clínica'}
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Plan Details with Period Selection */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              {/* Plan Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{planDetails.name}</h3>
                  <div className="text-right ml-4 flex-shrink-0">
                    <div className="text-2xl font-bold text-krooa-blue whitespace-nowrap">
                      {formatCurrency(calculateTotal())}
                    </div>
                    <div className="text-xs text-gray-500">
                      {periodOptions.find(p => p.key === selectedPeriod)?.suffix}
                    </div>
                    {appliedCoupon && (
                      <div className="text-xs text-emerald-600 font-medium mt-1">
                        {appliedCoupon.type === 'percentage'
                          ? `${appliedCoupon.discount}% off`
                          : `${formatCurrency(appliedCoupon.discount)} off`
                        }
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 w-full">
                  {t?.step2?.planDescription || 'Tudo que você precisa para gerenciar sua clínica'}
                </p>
              </div>

              {/* Period Selection Tabs */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t?.step2?.choosePeriod || 'Escolha o período:'}</h4>
                <div className="flex rounded-lg bg-gray-100 p-1">
                  {periodOptions.map((period) => (
                    <button
                      key={period.key}
                      onClick={() => setSelectedPeriod(period.key)}
                      className={`relative flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                        selectedPeriod === period.key
                          ? 'bg-white text-krooa-blue shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {period.name}
                      {period.key === 'yearly' && (
                        <div className="absolute -top-4 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 whitespace-nowrap">
                          {t?.step2?.economicalBadge || '+ Econômico'}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {/* Period Benefits */}
                <div className="mt-3 text-center">
                  {selectedPeriod === 'yearly' && (
                    <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {t?.step2?.yearlyDiscount || 'Economize 2 meses'}
                    </div>
                  )}
                  {selectedPeriod === 'quarterly' && (
                    <div className="text-sm text-gray-600">
                      {t?.step2?.quarterlyBenefit || 'Pagamento a cada 3 meses'}
                    </div>
                  )}
                  {selectedPeriod === 'monthly' && (
                    <div className="text-sm text-gray-600">
                      {t?.step2?.monthlyBenefit || 'Flexibilidade mensal'}
                    </div>
                  )}
                </div>
              </div>

              {/* Plan Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t?.step2?.includedFeatures || 'Incluído no plano:'}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {planDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2 h-2 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Resources Link */}
              <div className="text-center pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setDocumentModal({ isOpen: true, type: 'addons' })}
                  className="text-krooa-blue hover:text-krooa-blue/80 text-sm font-medium underline"
                >
                  {t?.step2?.learnMoreAddons || 'Saiba mais sobre recursos adicionais'} →
                </button>
              </div>
            </div>


            {/* Coupon Section */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">{t?.step2?.coupon || 'Cupom de desconto'}</h3>
              {!appliedCoupon ? (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      value={couponCode}
                      onChange={(value) => setCouponCode(value.toUpperCase())}
                      placeholder={t?.step2?.couponPlaceholder || 'Digite seu código'}
                      error={couponError}
                    />
                  </div>
                  <div className="flex-1 max-w-[120px]">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={applyCoupon}
                      disabled={!couponCode.trim()}
                      className="w-full h-10"
                    >
                      {t?.step2?.applyCoupon || 'Aplicar'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-medium text-emerald-800">
                        {couponCode} - {appliedCoupon.type === 'percentage'
                          ? `${appliedCoupon.discount}% off`
                          : `${formatCurrency(appliedCoupon.discount)} off`
                        }
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    {t?.step2?.removeCoupon || 'Remover'}
                  </button>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">{t?.step2?.termsSection || 'Termos e Condições'}</h3>

              {/* Data Protection Terms - LGPD (BR) or HIPAA (US) */}
              {currentRegion === 'BR' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="lgpd-terms"
                      checked={lgpdAccepted}
                      onChange={(e) => setLgpdAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <label htmlFor="lgpd-terms" className="text-sm font-medium text-blue-900 cursor-pointer block">
                        {t?.step2?.lgpdConsent || 'Aceito os termos da LGPD'}
                      </label>
                      <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                        {t?.step2?.lgpdDescription || 'Declaro estar ciente e concordo com os termos da Lei Geral de Proteção de Dados (LGPD) e autorizo o tratamento dos dados pessoais conforme descrito na política de privacidade.'}
                      </p>
                      <button
                        type="button"
                        className="text-xs text-blue-600 underline mt-2 hover:text-blue-800 transition-colors"
                        onClick={() => setDocumentModal({ isOpen: true, type: 'lgpd' })}
                      >
                        {t?.step2?.viewLgpdDocument || 'Ver documento completo'} →
                      </button>
                      {errors.lgpd && (
                        <p className="text-sm text-red-600 mt-1">{errors.lgpd}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* HIPAA Terms for US */}
              {currentRegion === 'US' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="hipaa-terms"
                      checked={hipaaAccepted}
                      onChange={(e) => setHipaaAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <label htmlFor="hipaa-terms" className="text-sm font-medium text-blue-900 cursor-pointer block">
                        {t?.step2?.hipaaConsent || 'I accept the HIPAA terms'}
                      </label>
                      <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                        {t?.step2?.hipaaDescription || 'I acknowledge and agree to comply with the Health Insurance Portability and Accountability Act (HIPAA) requirements for protecting patient health information.'}
                      </p>
                      <button
                        type="button"
                        className="text-xs text-blue-600 underline mt-2 hover:text-blue-800 transition-colors"
                        onClick={() => setDocumentModal({ isOpen: true, type: 'hipaa' })}
                      >
                        {t?.step2?.viewHipaaDocument || 'View full document'} →
                      </button>
                      {errors.hipaa && (
                        <p className="text-sm text-red-600 mt-1">{errors.hipaa}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Responsibility Terms */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="admin-terms"
                    checked={adminAccepted}
                    onChange={(e) => setAdminAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <label htmlFor="admin-terms" className="text-sm font-medium text-amber-900 cursor-pointer block">
                      {t?.step2?.adminResponsibility || 'Aceito as responsabilidades de usuário administrador'}
                    </label>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                      {t?.step2?.adminResponsibilityDescription || 'Assumo total responsabilidade pelas configurações e dados inseridos no sistema, comprometendo-me a manter a segurança e confidencialidade das informações dos pacientes.'}
                    </p>
                    <button
                      type="button"
                      className="text-xs text-amber-600 underline mt-2 hover:text-amber-800 transition-colors"
                      onClick={() => setDocumentModal({ isOpen: true, type: 'admin' })}
                    >
                      {t?.step2?.viewResponsibilityDocument || 'Ver termo de responsabilidade'} →
                    </button>
                    {errors.admin && (
                      <p className="text-sm text-red-600 mt-1">{errors.admin}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
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
        </div>

        {/* Document Modal */}
        <Modal
          isOpen={documentModal.isOpen}
          onClose={() => setDocumentModal({ isOpen: false, type: null })}
          size="lg"
        >
          <div className="max-h-[80vh] overflow-y-auto">
            {documentModal.type === 'lgpd' && t?.lgpdTerms && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t.lgpdTerms.title}</h2>
                <p className="text-sm text-gray-500 mb-6">{t.lgpdTerms.lastUpdated}</p>
                <div className="space-y-6">
                  {t.lgpdTerms.sections?.map((section: any, index: number) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900 mb-2">{section.title}</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {documentModal.type === 'hipaa' && t?.hipaaTerms && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t.hipaaTerms.title}</h2>
                <p className="text-sm text-gray-500 mb-6">{t.hipaaTerms.lastUpdated}</p>
                <div className="space-y-6">
                  {t.hipaaTerms.sections?.map((section: any, index: number) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900 mb-2">{section.title}</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {documentModal.type === 'admin' && t?.adminTerms && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t.adminTerms.title}</h2>
                <p className="text-sm text-gray-500 mb-6">{t.adminTerms.lastUpdated}</p>
                <div className="space-y-6">
                  {t.adminTerms.sections?.map((section: any, index: number) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900 mb-2">{section.title}</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {documentModal.type === 'addons' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {t?.step2?.additionalResources || 'Recursos adicionais disponíveis'}
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  {t?.step2?.additionalResourcesDescription || 'Após contratar o plano, você pode adicionar recursos extras conforme sua necessidade:'}
                </p>

                {/* Additional Resources */}
                <div>

                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                            </svg>
                          </div>
                          <h4 className="font-medium text-gray-900">
                            {t?.step2?.whatsappAddon || 'WhatsApp adicional'}
                          </h4>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(getAddOnPrice('whatsapp'))}{periodOptions.find(p => p.key === selectedPeriod)?.suffix}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {t?.step2?.whatsappDescription || 'Conecte mais números do WhatsApp para atendimento'}
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h4 className="font-medium text-gray-900">
                            {t?.step2?.aiAddon || 'IA adicional'}
                          </h4>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(getAddOnPrice('ai'))}{periodOptions.find(p => p.key === selectedPeriod)?.suffix}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {t?.step2?.aiDescription || 'Mais recursos de inteligência artificial'}
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-900">
                          {t?.step2?.storageAddon || 'Storage adicional'}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {t?.step2?.storageDescription || 'Mais espaço além dos 15GB inclusos'}
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-indigo-100 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-900">
                          {currentRegion === 'BR' ? 'Assinatura digital' : 'Digital signature'}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {currentRegion === 'BR'
                          ? 'Documentos com validade jurídica (exclusivo Brasil)'
                          : 'Legally valid documents'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 {t?.step2?.additionalNote || 'Você pode contratar esses recursos a qualquer momento após iniciar seu plano.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => setDocumentModal({ isOpen: false, type: null })}
              className="flex-1"
            >
              {t?.common?.cancel || 'Fechar'}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (documentModal.type === 'lgpd') {
                  setLgpdAccepted(true);
                } else if (documentModal.type === 'hipaa') {
                  setHipaaAccepted(true);
                } else if (documentModal.type === 'admin') {
                  setAdminAccepted(true);
                }
                setDocumentModal({ isOpen: false, type: null });
              }}
              className="flex-1"
            >
              {t?.step2?.acceptTerms || 'Aceitar Termos'}
            </Button>
          </div>
        </Modal>
      </div>
    </OnboardingLayout>
  );
}