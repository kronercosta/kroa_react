import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../OnboardingLayout';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { useRegion } from '../../../contexts/RegionContext';
import translations from '../translation.json';

export default function Step1Page() {
  const navigate = useNavigate();
  const { t } = useTranslation(translations);
  const { currentRegion } = useRegion();

  const getInitialData = () => {
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    return {
      name: onboardingData.name || '',
      email: onboardingData.email || '',
      phone: onboardingData.phone || ''
    };
  };

  const [formData, setFormData] = useState(getInitialData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [authStep, setAuthStep] = useState<'auth' | 'complete-data'>('auth');
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | null>(null);
  const [emailVerification, setEmailVerification] = useState({
    isVerified: false,
    codeSent: false,
    code: '',
    isVerifying: false,
    attempts: 0,
    maxAttempts: 3
  });
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer para reenvio de código
  useEffect(() => {
    let timer: number | null = null;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCooldown]);

  // Aguardar carregamento das traduções
  if (!t || !t.step1) {
    return (
      <OnboardingLayout currentStep={1} totalSteps={5} showProgress={true}>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-6 h-6 border-2 border-krooa-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </OnboardingLayout>
    );
  }

  const handleNext = (data: {
    name: string;
    email: string;
    phone: string;
    isGoogleAuth?: boolean;
  }) => {
    // Armazenar dados no sessionStorage para persistir entre rotas
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}');
    const updatedData = { ...onboardingData, ...data };
    sessionStorage.setItem('onboardingData', JSON.stringify(updatedData));

    // Navegar para próxima etapa
    navigate('/onboarding/step2');
  };


  const validateEmailForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = t?.step1?.validation?.emailRequired || 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t?.step1?.validation?.emailInvalid || 'E-mail inválido';
    } else if (!emailVerification.isVerified) {
      newErrors.email = t?.step1?.validation?.emailNotVerified || 'E-mail não verificado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCompleteDataForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t?.step1?.validation?.nameRequired || 'Nome é obrigatório';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t?.step1?.validation?.phoneRequired || 'Telefone é obrigatório';
    } else if (phoneValid === false) {
      newErrors.phone = t?.step1?.validation?.phoneInvalid || 'Telefone inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendVerificationCode = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: t?.step1?.validation?.emailInvalid || 'E-mail inválido' }));
      return;
    }

    setEmailVerification(prev => ({ ...prev, isVerifying: true }));
    setResendCooldown(60); // Iniciar cooldown de 1 minuto

    // Simular envio do código
    setTimeout(() => {
      setEmailVerification(prev => ({
        ...prev,
        codeSent: true,
        isVerifying: false
      }));
      setErrors(prev => ({ ...prev, email: '' }));
    }, 1500);
  };

  const verifyEmailCode = async () => {
    if (!emailVerification.code || emailVerification.code.length !== 6) {
      setErrors(prev => ({ ...prev, verificationCode: t?.step1?.validation?.codeInvalid || 'Código deve ter 6 dígitos' }));
      return;
    }

    setEmailVerification(prev => ({ ...prev, isVerifying: true }));

    // Simular verificação do código
    setTimeout(() => {
      // Para teste, aceitar qualquer código de 6 dígitos
      const isValid = emailVerification.code.length === 6;

      if (isValid) {
        setEmailVerification(prev => ({
          ...prev,
          isVerified: true,
          isVerifying: false
        }));
        setErrors(prev => ({ ...prev, verificationCode: '' }));

        // Para login por email, ir para seção de completar dados
        setTimeout(() => {
          handleEmailVerificationComplete();
        }, 1000);
      } else {
        setEmailVerification(prev => ({
          ...prev,
          attempts: prev.attempts + 1,
          isVerifying: false,
          code: ''
        }));
        setErrors(prev => ({ ...prev, verificationCode: t?.step1?.validation?.codeInvalid || 'Código inválido' }));
      }
    }, 1500);
  };

  const resendVerificationCode = async () => {
    if (resendCooldown > 0) return; // Prevenir cliques durante cooldown

    setEmailVerification(prev => ({
      ...prev,
      code: '',
      attempts: 0,
      isVerifying: true
    }));
    setResendCooldown(60); // Reiniciar cooldown de 1 minuto

    setTimeout(() => {
      setEmailVerification(prev => ({
        ...prev,
        isVerifying: false
      }));
    }, 1500);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmailForm()) {
      handleEmailVerificationComplete();
    }
  };

  const handleCompleteDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCompleteDataForm()) {
      setIsLoading(true);
      setTimeout(() => {
        handleCompleteData();
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    // Simular autenticação com Google
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        name: 'Dr. João Silva',
        email: 'joao.silva@gmail.com'
      }));
      setAuthMethod('google');
      setAuthStep('complete-data');
      setIsLoading(false);
    }, 1500);
  };


  const handleEmailVerificationComplete = () => {
    // Para login por email, mostrar seção para completar dados
    setAuthMethod('email');
    setAuthStep('complete-data');
  };

  const handleCompleteData = () => {
    // Para login social, completar dados e ir para step 2
    handleNext({
      ...formData,
      isGoogleAuth: authMethod !== 'email'
    });
  };

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={5}
      showProgress={true}
    >
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {authStep === 'auth'
              ? (t?.step1?.title || 'Vamos começar!')
              : (t?.step1?.completeDataTitle || 'Complete seus dados')
            }
          </h1>
          <p className="text-gray-600">
            {authStep === 'auth'
              ? (t?.step1?.subtitle || 'Escolha como deseja acessar sua conta')
              : (t?.step1?.completeDataSubtitle || 'Precisamos de algumas informações adicionais para continuar')
            }
          </p>
        </div>

        {/* Authentication Section */}
        {authStep === 'auth' && (
          <>
            {/* Social Auth Buttons */}
            <div className="mb-6">
              <button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-gray-700">
                  {t?.step1?.signInWithGoogle || 'Google'}
                </span>
              </button>

            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t?.step1?.or || 'ou'}</span>
              </div>
            </div>
          </>
        )}

        {/* Email Authentication Form */}
        {authStep === 'auth' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-3">
              <Input
                label={t?.step1?.email || 'E-mail'}
                type="email"
                validation="email"
                value={formData.email}
                onChange={(value, isValid) => {
                  setFormData(prev => ({ ...prev, email: value }));
                  // Reset verification quando email mudar
                  if (emailVerification.codeSent || emailVerification.isVerified) {
                    setEmailVerification({
                      isVerified: false,
                      codeSent: false,
                      code: '',
                      isVerifying: false,
                      attempts: 0,
                      maxAttempts: 3
                    });
                  }
                  // Limpar erro quando email for válido
                  if (isValid && errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                error={errors.email}
                required
                fullWidth
                disabled={emailVerification.isVerified}
              />

              {!emailVerification.isVerified && !emailVerification.codeSent && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={sendVerificationCode}
                  disabled={!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) || emailVerification.isVerifying}
                  className="w-full"
                >
                  {emailVerification.isVerifying ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {t?.step1?.sending || 'Enviando...'}
                    </div>
                  ) : (
                    t?.step1?.sendCode || 'Enviar código'
                  )}
                </Button>
              )}

              {/* Email verification section */}
              {emailVerification.codeSent && !emailVerification.isVerified && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">
                        {t?.step1?.verification?.title || 'Verificação de e-mail'}
                      </h4>
                      <p className="text-sm text-blue-700">
                        {t?.step1?.verification?.description || 'Enviamos um código de verificação para seu e-mail:'}
                      </p>
                      <p className="text-sm font-medium text-blue-800 mt-1">{formData.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder={t?.step1?.verification?.codePlaceholder || 'Digite o código de 6 dígitos'}
                      value={emailVerification.code}
                      onChange={(value) => {
                        const numericValue = value.replace(/\D/g, '').slice(0, 6);
                        setEmailVerification(prev => ({ ...prev, code: numericValue }));
                        if (errors.verificationCode) {
                          setErrors(prev => ({ ...prev, verificationCode: '' }));
                        }
                      }}
                      error={errors.verificationCode}
                      maxLength={6}
                      className="text-center tracking-widest"
                    />
                    <Button
                      type="button"
                      variant="primary"
                      onClick={verifyEmailCode}
                      disabled={emailVerification.code.length !== 6 || emailVerification.isVerifying}
                      className="whitespace-nowrap"
                    >
                      {emailVerification.isVerifying ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t?.step1?.verifying || 'Verificando...'}
                        </div>
                      ) : (
                        t?.step1?.verify || 'Verificar'
                      )}
                    </Button>
                  </div>

                  <div className="mt-3 text-center">
                    <button
                      type="button"
                      onClick={resendVerificationCode}
                      disabled={emailVerification.isVerifying || resendCooldown > 0}
                      className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
                    >
                      {resendCooldown > 0
                        ? `Aguarde ${resendCooldown}s`
                        : (t?.step1?.verification?.resendCode || 'Reenviar código')
                      }
                    </button>
                  </div>
                </div>
              )}

              {/* Email verified confirmation */}
              {emailVerification.isVerified && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-green-800">
                      {t?.step1?.verification?.verified || 'E-mail verificado! Redirecionando...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </form>
        )}

        {/* Complete Data Form - for social auth */}
        {authStep === 'complete-data' && (
          <>
            {/* Show authenticated account info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  {authMethod === 'google' ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {authMethod === 'email'
                      ? (t?.step1?.emailVerified || 'E-mail verificado')
                      : `${t?.step1?.connectedWith || 'Conectado com'} Google`
                    }
                  </p>
                  <p className="text-sm text-green-700">{formData.email}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCompleteDataSubmit} className="space-y-4">
              <Input
                label={t?.step1?.name || 'Nome completo'}
                value={formData.name}
                onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                error={errors.name}
                required
                fullWidth
              />

              <Input
                label={t?.step1?.phone || 'Telefone'}
                mask="internationalPhone"
                defaultCountry={currentRegion}
                value={formData.phone}
                onChange={(value, isValid) => {
                  setFormData(prev => ({ ...prev, phone: value }));
                  setPhoneValid(isValid || null);
                  // Limpar erro quando começar a digitar corretamente
                  if (isValid && errors.phone) {
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }
                }}
                error={errors.phone}
                required
                fullWidth
              />

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
          </>
        )}

        {/* Trust indicators */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{t?.step1?.security?.sslSecure || 'SSL Seguro'}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>{t?.step1?.security?.dataProtected || 'Dados Protegidos'}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>
                {currentRegion === 'BR'
                  ? (t?.step1?.security?.lgpdCompliant || 'LGPD Compliant')
                  : (t?.step1?.security?.hipaaCompliant || 'HIPAA Compliant')
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}