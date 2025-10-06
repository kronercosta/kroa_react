import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { EnhancedInput } from '../../components/ui/EnhancedInput';
import { Button } from '../../components/ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
import translations from './translation.json';

interface Step3Props {
  onNext: (data: {
    cardData: {
      number: string;
      name: string;
      expiry: string;
      cvv: string;
    };
    paymentMethod: 'card' | 'google_pay' | 'stripe_link';
  }) => void;
  onBack: () => void;
  planData?: {
    selectedPlan: string;
    couponCode?: string;
  };
}

export function Step3Payment({ onNext, onBack, planData }: Step3Props) {
  const { t } = useTranslation(translations);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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
        onNext({
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

  const handleAlternativePayment = (method: 'google_pay' | 'stripe_link') => {
    setIsLoading(true);

    if (method === 'google_pay') {
      // Redirecionar para Stripe Checkout com Google Pay habilitado
      setTimeout(() => {
        window.open('https://checkout.stripe.com/demo', '_blank');
        onNext({
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
        onNext({
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
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-krooa-green to-krooa-blue text-white p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">
          Informações de Pagamento
        </h1>
        <p className="text-krooa-green-100">
          Dados seguros e criptografados
        </p>
      </div>

      <div className="p-8">
        {/* Plan Summary */}
        {planData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Resumo do pedido</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Plano {planData.selectedPlan}</span>
              <span className="font-semibold">7 dias grátis</span>
            </div>
            {planData.couponCode && (
              <div className="flex justify-between items-center text-green-600">
                <span>Cupom: {planData.couponCode}</span>
                <span>-15%</span>
              </div>
            )}
          </div>
        )}

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
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
            </svg>
            <span>{t?.step2?.securityNote || '🔒 Seus dados estão seguros e criptografados'}</span>
          </div>

          {/* Alternative Payment Methods */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center mb-4">
              <span className="text-sm text-gray-500 bg-white px-3">ou escolha outra forma de pagamento</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                onClick={() => handleAlternativePayment('google_pay')}
                disabled={isLoading}
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
                className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                onClick={() => handleAlternativePayment('stripe_link')}
                disabled={isLoading}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#00D924">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-6.222 6.222a.749.749 0 01-1.06 0L7.432 11.53a.75.75 0 111.061-1.061l2.323 2.323L16.507 7.1a.75.75 0 111.061 1.06z"/>
                </svg>
                <span className="font-medium text-gray-700">Stripe Link</span>
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Processado com segurança pela Stripe • Todos os métodos são criptografados
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Voltar
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
                  Carregando...
                </div>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                  </svg>
                  Finalizar pagamento
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}