import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
import { useRegion } from '../../contexts/RegionContext';
import translations from './translation.json';

interface Step3Props {
  onNext: (data: {
    clinicName: string;
    customDomain: string;
    password: string;
    isEmailVerified: boolean;
  }) => void;
  onBack: () => void;
  userData: {
    email: string;
    isGoogleAuth?: boolean;
  };
}

export function Step4AdvancedSettings({ onNext, onBack, userData }: Step3Props) {
  const { t } = useTranslation(translations);
  const { currentRegion } = useRegion();
  const [formData, setFormData] = useState({
    clinicName: '',
    customDomain: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);

  // Email verification
  const [needsEmailVerification, setNeedsEmailVerification] = useState(!userData.isGoogleAuth);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(userData.isGoogleAuth || false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  // Check domain availability
  useEffect(() => {
    if (formData.customDomain && formData.customDomain.length >= 3) {
      setIsCheckingDomain(true);
      const timer = setTimeout(() => {
        // Simular verificação de disponibilidade
        const isAvailable = !['kroa', 'admin', 'test', 'demo'].includes(formData.customDomain.toLowerCase());
        setDomainAvailable(isAvailable);
        setIsCheckingDomain(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setDomainAvailable(null);
      setIsCheckingDomain(false);
    }
  }, [formData.customDomain]);

  // Password strength validation
  useEffect(() => {
    const password = formData.password;
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [formData.password]);

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const sendVerificationCode = () => {
    setVerificationSent(true);
    setResendCooldown(60);
    // Simular envio do código
    console.log(`Código de verificação enviado para ${userData.email}`);
  };

  const verifyEmail = () => {
    if (verificationCode === '123456') {
      setIsEmailVerified(true);
      setErrors(prev => ({ ...prev, verificationCode: '' }));
    } else {
      setErrors(prev => ({ ...prev, verificationCode: 'Código inválido' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clinicName.trim()) {
      newErrors.clinicName = t?.step3?.validation?.clinicNameRequired || 'Nome da clínica é obrigatório';
    }

    if (!formData.customDomain.trim()) {
      newErrors.customDomain = t?.step3?.validation?.domainRequired || 'Endereço de acesso é obrigatório';
    } else if (!/^[a-zA-Z0-9-]+$/.test(formData.customDomain)) {
      newErrors.customDomain = t?.step3?.validation?.domainInvalid || 'Endereço inválido';
    } else if (domainAvailable === false) {
      newErrors.customDomain = t?.step3?.domainUnavailable || 'Endereço não disponível';
    }

    if (!formData.password) {
      newErrors.password = t?.step3?.validation?.passwordRequired || 'Senha é obrigatória';
    } else if (!Object.values(passwordStrength).every(Boolean)) {
      newErrors.password = t?.step3?.validation?.passwordWeak || 'Senha não atende aos requisitos';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t?.step3?.validation?.passwordMismatch || 'Senhas não coincidem';
    }

    if (needsEmailVerification && !isEmailVerified) {
      if (!verificationCode) {
        newErrors.verificationCode = t?.step3?.validation?.verificationRequired || 'Código de verificação é obrigatório';
      }
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
          clinicName: formData.clinicName,
          customDomain: formData.customDomain,
          password: formData.password,
          isEmailVerified
        });
        setIsLoading(false);
      }, 1000);
    }
  };

  const formatDomain = (value: string) => {
    return value.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
  };

  const domainSuffix = currentRegion === 'BR' ? '.kroa.com.br' : '.kroa.com';

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t?.step3?.title || 'Configurações avançadas'}
        </h1>
        <p className="text-gray-600">
          {t?.step3?.subtitle || 'Agora vamos personalizar sua clínica no sistema'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Clinic Name */}
        <Input
          label={t?.step3?.clinicName || 'Nome da clínica'}
          value={formData.clinicName}
          onChange={(value) => setFormData(prev => ({ ...prev, clinicName: value }))}
          placeholder={t?.step3?.clinicNamePlaceholder || 'Digite o nome da sua clínica'}
          error={errors.clinicName}
          required
          fullWidth
        />

        {/* Custom Domain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t?.step3?.customDomain || 'Endereço de acesso personalizado'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.customDomain}
              onChange={(e) => {
                const formatted = formatDomain(e.target.value);
                setFormData(prev => ({ ...prev, customDomain: formatted }));
              }}
              placeholder={t?.step3?.customDomainPlaceholder || 'Digite o endereço desejado'}
              className={`w-full px-3 py-2 pr-32 border rounded-lg focus:outline-none focus:ring-2 focus:ring-krooa-green/20 focus:border-krooa-green ${
                errors.customDomain ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
              {domainSuffix}
            </div>
          </div>

          {/* Domain Status */}
          <div className="mt-2 min-h-[20px]">
            {isCheckingDomain && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                Verificando disponibilidade...
              </div>
            )}
            {domainAvailable === true && !isCheckingDomain && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t?.step3?.domainAvailable || 'Endereço disponível!'}
              </div>
            )}
            {domainAvailable === false && !isCheckingDomain && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {t?.step3?.domainUnavailable || 'Endereço não disponível'}
              </div>
            )}
            {formData.customDomain && !isCheckingDomain && (
              <p className="text-xs text-gray-500 mt-1">
                {t?.step3?.domainExample || 'Exemplo: minhaclinica.kroa.com.br'}
              </p>
            )}
          </div>
          {errors.customDomain && (
            <p className="text-sm text-red-600 mt-1">{errors.customDomain}</p>
          )}
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label={t?.step3?.password || 'Senha'}
              type="password"
              value={formData.password}
              onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
              placeholder={t?.step3?.passwordPlaceholder || 'Digite uma senha segura'}
              error={errors.password}
              required
              fullWidth
            />

            {/* Password Requirements */}
            {formData.password && (
              <div className="mt-2 space-y-1">
                {(t?.step3?.passwordRequirements || [
                  'Mínimo de 8 caracteres',
                  'Pelo menos 1 letra maiúscula',
                  'Pelo menos 1 número',
                  'Pelo menos 1 caractere especial'
                ]).map((requirement, index) => {
                  const checks = [
                    passwordStrength.hasLength,
                    passwordStrength.hasUppercase,
                    passwordStrength.hasNumber,
                    passwordStrength.hasSpecial
                  ];
                  const isValid = checks[index];

                  return (
                    <div key={index} className={`flex items-center gap-2 text-xs ${
                      isValid ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {requirement}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Input
            label={t?.step3?.confirmPassword || 'Confirmar senha'}
            type="password"
            value={formData.confirmPassword}
            onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
            placeholder={t?.step3?.confirmPasswordPlaceholder || 'Digite a senha novamente'}
            error={errors.confirmPassword}
            required
            fullWidth
          />
        </div>

        {/* Email Verification */}
        {needsEmailVerification && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              {t?.step3?.emailVerification || 'Verificação de e-mail'}
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              {t?.step3?.emailVerificationDescription || 'Enviamos um código de verificação para seu e-mail'}: <strong>{userData.email}</strong>
            </p>

            {!verificationSent ? (
              <Button
                type="button"
                variant="outline"
                onClick={sendVerificationCode}
                size="sm"
              >
                Enviar código de verificação
              </Button>
            ) : !isEmailVerified ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder={t?.step3?.verificationCodePlaceholder || 'Digite o código de 6 dígitos'}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-krooa-green/20 focus:border-krooa-green"
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    variant="primary"
                    onClick={verifyEmail}
                    size="sm"
                  >
                    Verificar
                  </Button>
                </div>

                {errors.verificationCode && (
                  <p className="text-sm text-red-600">{errors.verificationCode}</p>
                )}

                <button
                  type="button"
                  onClick={sendVerificationCode}
                  disabled={resendCooldown > 0}
                  className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                >
                  {resendCooldown > 0
                    ? `Reenviar em ${resendCooldown}s`
                    : (t?.step3?.resendCode || 'Reenviar código')
                  }
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t?.step3?.emailVerified || 'E-mail verificado com sucesso!'}
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
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
            disabled={isLoading || (needsEmailVerification && !isEmailVerified) || domainAvailable === false}
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
  );
}