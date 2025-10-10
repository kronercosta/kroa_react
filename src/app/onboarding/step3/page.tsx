import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../OnboardingLayout';
import { Button } from '../../../components/ui/Button';
import { DocumentModal } from './DocumentModal';
import { useTranslation } from '../../../hooks/useTranslation';
import { useRegion } from '../../../contexts/RegionContext';
import translations from '../translation.json';
import { prospectsService } from '../prospectsService';

export default function Step3Page() {
  const navigate = useNavigate();
  const { t } = useTranslation(translations);
  const { currentRegion } = useRegion();

  const getInitialData = () => {
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    return {
      email: onboardingData.email || '',
      session_code: onboardingData.session_code || '',
      prospect_id: onboardingData.prospect_id
    };
  };

  const [formData] = useState(getInitialData());
  const [kroaTermsAccepted, setKroaTermsAccepted] = useState(false);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [hipaaAccepted, setHipaaAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [documentModal, setDocumentModal] = useState<{
    isOpen: boolean;
    type: 'kroa' | 'lgpd' | 'hipaa' | null;
  }>({ isOpen: false, type: null });

  // Aguardar carregamento das traduções
  if (!t || !t.step3) {
    return (
      <OnboardingLayout currentStep={3} totalSteps={6} showProgress={true}>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-6 h-6 border-2 border-krooa-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </OnboardingLayout>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Termos Kroa são obrigatórios para todos
    if (!kroaTermsAccepted) {
      newErrors.kroa = t?.step3?.termsRequired || 'Você deve aceitar os termos de uso';
    }

    // LGPD obrigatório para BR
    if (currentRegion === 'BR' && !lgpdAccepted) {
      newErrors.lgpd = t?.step3?.termsRequired || 'Você deve aceitar os termos da LGPD';
    }

    // HIPAA obrigatório para US
    if (currentRegion === 'US' && !hipaaAccepted) {
      newErrors.hipaa = t?.step3?.termsRequired || 'You must accept the HIPAA terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Verificar se session_code existe
    if (!formData.session_code) {
      console.error('Session code não encontrado');
      setErrors({ kroa: 'Erro ao salvar dados. Tente novamente.' });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Enviando dados step3:', {
        session_code: formData.session_code,
        region: currentRegion,
        accept_kroa_terms: kroaTermsAccepted,
        accept_lgpd_terms: currentRegion === 'BR' ? lgpdAccepted : false,
        accept_hipaa_terms: currentRegion === 'US' ? hipaaAccepted : false
      });

      const response = await prospectsService.step3({
        session_code: formData.session_code,
        region: currentRegion,
        accept_kroa_terms: kroaTermsAccepted,
        accept_lgpd_terms: currentRegion === 'BR' ? lgpdAccepted : false,
        accept_hipaa_terms: currentRegion === 'US' ? hipaaAccepted : false
      });

      console.log('Response step3:', response);

      if (response.success) {
        // Salvar todos os dados no sessionStorage
        const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
        const updatedData = {
          ...onboardingData,
          region: response.data.region,
          terms_accepted: response.data.terms_accepted,
          prospect_id: response.data.prospect_id,
          session_code: response.data.session_code,
          current_step: response.data.current_step
        };
        sessionStorage.setItem('onboardingData', JSON.stringify(updatedData));

        // Navegar para step4
        navigate('/onboarding/step4');
      } else {
        setErrors({ kroa: response.message || 'Erro ao salvar dados.' });
      }
    } catch (error: any) {
      console.error('Erro ao enviar step3:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao salvar dados. Tente novamente.';
      setErrors({ kroa: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={6}
      showProgress={true}
    >
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t?.step3?.title || 'Termos e Condições'}
          </h1>
          <p className="text-gray-600">
            {t?.step3?.subtitle || 'Leia e aceite os termos para continuar'}
          </p>
        </div>

        {/* Email verificado e dados confirmados */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">
                {t?.step3?.dataConfirmed || 'Dados confirmados'}
              </p>
              <p className="text-sm text-green-700">{formData.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Termos Kroa - Obrigatório para todos */}
          <div className="bg-krooa-green/5 border border-krooa-green/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="kroa-terms"
                checked={kroaTermsAccepted}
                onChange={(e) => setKroaTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 text-krooa-green bg-gray-100 border-gray-300 rounded focus:ring-krooa-green flex-shrink-0"
              />
              <div className="flex-1">
                <label htmlFor="kroa-terms" className="text-sm font-medium text-gray-900 cursor-pointer block">
                  {t?.step3?.kroaTermsTitle || 'Termos de Uso da Kroa'}
                </label>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {t?.step3?.kroaTermsDescription || 'Declaro que li e concordo com os Termos de Uso e Política de Privacidade da Kroa.'}
                </p>
                <button
                  type="button"
                  onClick={() => setDocumentModal({ isOpen: true, type: 'kroa' })}
                  className="text-xs text-krooa-blue underline mt-2 hover:text-krooa-blue/80 transition-colors"
                >
                  {t?.step3?.viewDocument || 'Ver documento completo →'}
                </button>
                {errors.kroa && (
                  <p className="text-sm text-red-600 mt-1">{errors.kroa}</p>
                )}
              </div>
            </div>
          </div>

          {/* LGPD Terms for BR */}
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
                    {t?.step3?.lgpdConsent || 'Aceite dos Termos LGPD'}
                  </label>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                    {t?.step3?.lgpdDescription || 'Declaro estar ciente e concordo com os termos da Lei Geral de Proteção de Dados (LGPD) e autorizo o tratamento dos dados pessoais conforme descrito na política de privacidade.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setDocumentModal({ isOpen: true, type: 'lgpd' })}
                    className="text-xs text-blue-600 underline mt-2 hover:text-blue-800 transition-colors"
                  >
                    {t?.step3?.viewLgpdDocument || 'Ver documento completo →'}
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
                    {t?.step3?.hipaaConsent || 'HIPAA Terms Acceptance'}
                  </label>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                    {t?.step3?.hipaaDescription || 'I acknowledge and agree to comply with the Health Insurance Portability and Accountability Act (HIPAA) requirements for protecting patient health information.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setDocumentModal({ isOpen: true, type: 'hipaa' })}
                    className="text-xs text-blue-600 underline mt-2 hover:text-blue-800 transition-colors"
                  >
                    {t?.step3?.viewHipaaDocument || 'View complete document →'}
                  </button>
                  {errors.hipaa && (
                    <p className="text-sm text-red-600 mt-1">{errors.hipaa}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
            className="mt-6"
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
        </form>

        {/* Trust indicators */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{t?.step3?.security?.sslSecure || 'SSL Seguro'}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>{t?.step3?.security?.dataProtected || 'Dados Protegidos'}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>
                {currentRegion === 'BR'
                  ? (t?.step3?.security?.lgpdCompliant || 'LGPD Compliant')
                  : (t?.step3?.security?.hipaaCompliant || 'HIPAA Compliant')
                }
              </span>
            </div>
          </div>
        </div>

        {/* Document Modal for Terms */}
        <DocumentModal
          isOpen={documentModal.isOpen}
          onClose={() => setDocumentModal({ isOpen: false, type: null })}
          document={
            documentModal.type === 'kroa'
              ? t?.kroaTerms || null
              : documentModal.type === 'lgpd'
              ? t?.lgpdTerms || null
              : documentModal.type === 'hipaa'
              ? t?.hipaaTerms || null
              : null
          }
          onAccept={() => {
            if (documentModal.type === 'kroa') {
              setKroaTermsAccepted(true);
            } else if (documentModal.type === 'lgpd') {
              setLgpdAccepted(true);
            } else if (documentModal.type === 'hipaa') {
              setHipaaAccepted(true);
            }
            setDocumentModal({ isOpen: false, type: null });
          }}
          showAcceptButton={true}
        />
      </div>
    </OnboardingLayout>
  );
}
