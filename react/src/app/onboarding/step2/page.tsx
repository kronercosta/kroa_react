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
  const { currentRegion } = useRegion();
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [hipaaAccepted, setHipaaAccepted] = useState(false);
  const [adminAccepted, setAdminAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [documentModal, setDocumentModal] = useState<{
    isOpen: boolean;
    type: 'lgpd' | 'hipaa' | 'admin' | null;
  }>({ isOpen: false, type: null });

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

    // Get valid coupons from translations
    const validCoupons = t?.step2?.validCoupons || {
      'DESCONTO10': { discount: 10, type: 'percentage' },
      'PRIMEIRA50': { discount: 50, type: 'fixed' },
      'TESTE30': { discount: 30, type: 'percentage' }
    };

    if (!couponCode.trim()) {
      setCouponError(t?.step2?.couponInvalid || 'Digite um código de cupom');
      return;
    }

    const coupon = validCoupons[couponCode.toUpperCase()];
    if (coupon) {
      const discountText = coupon.type === 'percentage'
        ? `${coupon.discount}% de desconto`
        : `R$ ${coupon.discount} de desconto`;
      setCouponSuccess(t?.step2?.couponApplied?.replace('!', `! ${discountText}`) || `Cupom aplicado com sucesso! ${discountText}`);
    } else {
      setCouponError(t?.step2?.couponInvalid || 'Cupom inválido ou expirado');
    }
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
          selectedPlan,
          couponCode: couponSuccess ? couponCode : undefined,
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
                              ? 'border-slate-700 bg-slate-700'
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
              <h3 className="font-semibold text-gray-900 mb-3">{t?.step2?.coupon || 'Tem um cupom de desconto?'}</h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    value={couponCode}
                    onChange={(value) => setCouponCode(value.toUpperCase())}
                    placeholder={t?.step2?.couponPlaceholder || 'Digite seu código'}
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
                  {t?.step2?.applyCoupon || 'Aplicar'}
                </Button>
              </div>
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
              Aceitar Termos
            </Button>
          </div>
        </Modal>
      </div>
    </OnboardingLayout>
  );
}