import React, { useState, useRef, useEffect } from 'react';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onCancel?: () => void;
  language?: 'pt' | 'en' | 'es';
  templateType?: 'email-verification' | 'password-reset' | 'login-verification';
  maxAttempts?: number;
  cooldownSeconds?: number;
  autoVerify?: boolean;
  autoSendCode?: boolean; // Se true, envia código automaticamente ao montar. Se false, assume que código já foi enviado externamente
}

interface VerificationState {
  isVerified: boolean;
  codeSent: boolean;
  code: string[];
  isVerifying: boolean;
  isSending: boolean;
  attempts: number;
  error: string;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerified,
  onCancel,
  language = 'pt',
  templateType = 'email-verification',
  maxAttempts = 3,
  cooldownSeconds = 60,
  autoVerify = true,
  autoSendCode = true
}) => {
  const [state, setState] = useState<VerificationState>({
    isVerified: false,
    codeSent: !autoSendCode, // Se autoSendCode=false, assume que código já foi enviado
    code: ['', '', '', '', '', ''],
    isVerifying: false,
    isSending: false,
    attempts: 0,
    error: ''
  });

  const [resendCooldown, setResendCooldown] = useState(0);
  const codeInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCooldown]);

  // Traduções
  const translations = {
    pt: {
      title: 'Verificação de segurança',
      description: 'Digite o código de 6 dígitos enviado para',
      verifying: 'Verificando...',
      sending: 'Enviando...',
      resendCode: 'Reenviar código',
      resendIn: 'Reenviar código em',
      codeInvalid: 'Código inválido. Por favor, tente novamente.',
      attemptsRemaining: 'Tentativas restantes:',
      maxAttemptsReached: 'Número máximo de tentativas atingido. Solicite um novo código.',
      verified: 'E-mail verificado com sucesso!',
      sendError: 'Erro ao enviar código. Tente novamente.'
    },
    en: {
      title: 'Security verification',
      description: 'Enter the 6-digit code sent to',
      verifying: 'Verifying...',
      sending: 'Sending...',
      resendCode: 'Resend code',
      resendIn: 'Resend code in',
      codeInvalid: 'Invalid code. Please try again.',
      attemptsRemaining: 'Attempts remaining:',
      maxAttemptsReached: 'Maximum attempts reached. Request a new code.',
      verified: 'Email verified successfully!',
      sendError: 'Error sending code. Please try again.'
    },
    es: {
      title: 'Verificación de seguridad',
      description: 'Ingrese el código de 6 dígitos enviado a',
      verifying: 'Verificando...',
      sending: 'Enviando...',
      resendCode: 'Reenviar código',
      resendIn: 'Reenviar código en',
      codeInvalid: 'Código inválido. Por favor, inténtelo de nuevo.',
      attemptsRemaining: 'Intentos restantes:',
      maxAttemptsReached: 'Máximo de intentos alcanzado. Solicite un nuevo código.',
      verified: '¡Correo verificado con éxito!',
      sendError: 'Error al enviar código. Inténtelo de nuevo.'
    }
  };

  const t = translations[language];

  const sendVerificationCode = async () => {
    if (state.isSending) return;

    setState(prev => ({ ...prev, isSending: true, error: '' }));
    setResendCooldown(cooldownSeconds);

    try {
      // Gerar código de 6 dígitos
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Armazenar código temporariamente
      sessionStorage.setItem(`verificationCode_${email}`, verificationCode);
      sessionStorage.setItem(`verificationEmail`, email);
      sessionStorage.setItem(`verificationCodeExpiry`, (Date.now() + 600000).toString()); // 10 minutos

      // Enviar email via API
      const response = await fetch('/api/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
          template: templateType,
          language
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }

      setState(prev => ({
        ...prev,
        codeSent: true,
        isSending: false,
        attempts: 0
      }));

      // Focar no primeiro input
      setTimeout(() => {
        codeInputsRef.current[0]?.focus();
      }, 100);
    } catch (error) {
      console.error('Error sending verification code:', error);

      // Fallback: modo de teste local
      const verificationCode = '123456';
      sessionStorage.setItem(`verificationCode_${email}`, verificationCode);
      sessionStorage.setItem(`verificationEmail`, email);
      sessionStorage.setItem(`verificationCodeExpiry`, (Date.now() + 600000).toString());

      setState(prev => ({
        ...prev,
        codeSent: true,
        isSending: false,
        error: t.sendError
      }));

      setTimeout(() => {
        codeInputsRef.current[0]?.focus();
      }, 100);
    }
  };

  const verifyCode = async () => {
    const fullCode = state.code.join('');

    if (fullCode.length !== 6) {
      setState(prev => ({ ...prev, error: t.codeInvalid }));
      return;
    }

    setState(prev => ({ ...prev, isVerifying: true, error: '' }));

    // Simular delay de verificação
    await new Promise(resolve => setTimeout(resolve, 800));

    // Verificar código
    const storedCode = sessionStorage.getItem(`verificationCode_${email}`);
    const storedEmail = sessionStorage.getItem(`verificationEmail`);
    const expiry = parseInt(sessionStorage.getItem(`verificationCodeExpiry`) || '0');

    const isExpired = Date.now() > expiry;
    const isValid = fullCode === storedCode && email === storedEmail && !isExpired;

    if (isValid) {
      setState(prev => ({
        ...prev,
        isVerified: true,
        isVerifying: false,
        error: ''
      }));

      // Limpar dados
      sessionStorage.removeItem(`verificationCode_${email}`);
      sessionStorage.removeItem(`verificationEmail`);
      sessionStorage.removeItem(`verificationCodeExpiry`);

      // Chamar callback após animação
      setTimeout(() => {
        onVerified();
      }, 1000);
    } else {
      const newAttempts = state.attempts + 1;

      setState(prev => ({
        ...prev,
        attempts: newAttempts,
        isVerifying: false,
        code: ['', '', '', '', '', ''],
        error: isExpired ? 'Código expirado' : t.codeInvalid
      }));

      // Focar no primeiro input
      setTimeout(() => {
        codeInputsRef.current[0]?.focus();
      }, 100);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    // Permitir apenas números
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...state.code];
    newCode[index] = value;

    setState(prev => ({ ...prev, code: newCode, error: '' }));

    // Auto-focus no próximo input
    if (value && index < 5) {
      codeInputsRef.current[index + 1]?.focus();
    }

    // Auto-verificar quando todos os campos estiverem preenchidos
    if (autoVerify && index === 5 && value) {
      const fullCode = [...newCode.slice(0, 5), value].join('');
      if (fullCode.length === 6) {
        setTimeout(() => verifyCode(), 300);
      }
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace: voltar para o campo anterior se vazio
    if (e.key === 'Backspace' && !state.code[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }

    // Seta esquerda: ir para campo anterior
    if (e.key === 'ArrowLeft' && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }

    // Seta direita: ir para próximo campo
    if (e.key === 'ArrowRight' && index < 5) {
      codeInputsRef.current[index + 1]?.focus();
    }

    // Enter: verificar código
    if (e.key === 'Enter') {
      verifyCode();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setState(prev => ({ ...prev, code: newCode, error: '' }));

      // Focar no último input
      codeInputsRef.current[5]?.focus();

      // Auto-verificar
      if (autoVerify) {
        setTimeout(() => verifyCode(), 300);
      }
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || state.isSending) return;

    setState(prev => ({
      ...prev,
      code: ['', '', '', '', '', ''],
      attempts: 0,
      error: ''
    }));

    await sendVerificationCode();
  };

  // Enviar código automaticamente ao montar (apenas se autoSendCode=true)
  useEffect(() => {
    if (autoSendCode && !state.codeSent) {
      sendVerificationCode();
    } else if (!autoSendCode) {
      // Se código já foi enviado externamente, focar no primeiro input
      setTimeout(() => {
        codeInputsRef.current[0]?.focus();
      }, 100);
    }
  }, []);

  // Verificado com sucesso
  if (state.isVerified) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-center gap-3">
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-green-800">
            {t.verified}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header com ícone */}
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-krooa-dark mb-2 text-center">{t.title}</h2>
      <p className="text-gray-600 mb-8 text-center">
        {t.description}
        <br />
        <span className="font-medium text-krooa-dark">{email}</span>
      </p>

      {/* Informação do email de destino */}
      {state.codeSent && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="text-sm text-blue-800">
              Código enviado para: <span className="font-medium">{email}</span>
            </span>
          </div>
        </div>
      )}

      {/* Code Inputs */}
      {state.codeSent && (
        <>
          <div className="flex justify-center gap-2 mb-6">
            {state.code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (codeInputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                onPaste={index === 0 ? handleCodePaste : undefined}
                className={`
                  w-12 h-14 text-center text-xl font-semibold
                  border-2 rounded-lg transition-all
                  ${state.error
                    ? 'border-red-500 bg-red-50'
                    : digit
                      ? 'border-krooa-green bg-green-50'
                      : 'border-gray-300 hover:border-krooa-blue focus:border-krooa-blue'
                  }
                  focus:outline-none focus:ring-2 focus:ring-krooa-blue/20
                `}
                disabled={state.isVerifying || state.attempts >= maxAttempts}
              />
            ))}
          </div>

          {/* Mensagem de erro */}
          {state.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{state.error}</p>
            </div>
          )}

          <div className="space-y-3">
            {/* Botão Verificar */}
            <button
              onClick={verifyCode}
              disabled={state.code.some(digit => !digit) || state.isVerifying}
              className="w-full px-4 py-3 bg-krooa-green text-white rounded-lg font-medium hover:bg-krooa-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isVerifying ? t.verifying : 'Verificar código'}
            </button>

            {/* Botão de reenviar código */}
            {state.attempts < maxAttempts && (
              <button
                onClick={handleResend}
                disabled={state.isVerifying || state.isSending || resendCooldown > 0}
                className="w-full px-4 py-3 bg-transparent text-krooa-blue font-medium hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.isSending
                  ? t.sending
                  : resendCooldown > 0
                  ? `${t.resendIn} ${resendCooldown}s`
                  : t.resendCode
                }
              </button>
            )}
          </div>

          {/* Max Attempts Reached */}
          {state.attempts >= maxAttempts && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 text-center">{t.maxAttemptsReached}</p>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {language === 'pt' ? 'Cancelar' : language === 'en' ? 'Cancel' : 'Cancelar'}
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Sending State */}
      {!state.codeSent && state.isSending && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600">{t.sending}</p>
        </div>
      )}
    </div>
  );
};
