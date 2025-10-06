import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
import translations from './translation.json';

interface Step1Props {
  onNext: (data: {
    name: string;
    email: string;
    phone: string;
    isGoogleAuth?: boolean;
  }) => void;
  initialData?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export function Step1BasicInfo({ onNext, initialData }: Step1Props) {
  const { t } = useTranslation(translations);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t?.step1?.validation?.nameRequired || 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = t?.step1?.validation?.emailRequired || 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t?.step1?.validation?.emailInvalid || 'E-mail inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t?.step1?.validation?.phoneRequired || 'Telefone é obrigatório';
    } else if (!/^[\d\s\(\)\-\+]{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = t?.step1?.validation?.phoneInvalid || 'Telefone inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      // Simular delay de validação
      setTimeout(() => {
        onNext(formData);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    // Simular autenticação com Google
    setTimeout(() => {
      onNext({
        name: 'Dr. João Silva',
        email: 'joao.silva@gmail.com',
        phone: '',
        isGoogleAuth: true
      });
      setIsLoading(false);
    }, 1500);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t?.step1?.title || 'Vamos começar!'}
        </h1>
        <p className="text-gray-600">
          {t?.step1?.subtitle || 'Primeiro, precisamos de algumas informações básicas sobre você'}
        </p>
      </div>

      {/* Google Sign In */}
      <button
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className="w-full mb-6 flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="font-medium text-gray-700">
          {t?.step1?.signInWithGoogle || 'Entrar com Google'}
        </span>
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">{t?.step1?.or || 'ou'}</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t?.step1?.name || 'Nome completo'}
          value={formData.name}
          onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
          placeholder={t?.step1?.namePlaceholder || 'Digite seu nome completo'}
          error={errors.name}
          required
          fullWidth
        />

        <Input
          label={t?.step1?.email || 'E-mail'}
          type="email"
          value={formData.email}
          onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
          placeholder={t?.step1?.emailPlaceholder || 'Digite seu melhor e-mail'}
          error={errors.email}
          required
          fullWidth
        />

        <Input
          label={t?.step1?.phone || 'Telefone'}
          value={formData.phone}
          onChange={(value) => {
            const formatted = formatPhone(value);
            setFormData(prev => ({ ...prev, phone: formatted }));
          }}
          placeholder={t?.step1?.phonePlaceholder || 'Digite seu telefone'}
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

      {/* Trust indicators */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>SSL Seguro</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Dados Protegidos</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>LGPD Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}