import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ArrowLeft, Mail, Shield } from 'lucide-react';

const EsqueceuSenha: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [verificationError, setVerificationError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular envio de email
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
    }, 1500);
  };

  const handleVerificationChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      setVerificationError('');

      // Auto avançar para o próximo campo
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Verificar se todos os campos estão preenchidos
      if (newCode.every(digit => digit !== '')) {
        handleVerifyCode(newCode.join(''));
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
      setVerificationCode(newCode);
      if (pastedData.length === 6) {
        handleVerifyCode(pastedData);
      }
    }
  };

  const handleVerifyCode = (code: string) => {
    setLoading(true);
    // Simular verificação do código
    setTimeout(() => {
      if (code === '123456') { // Código de exemplo
        navigate('/redefinir-senha'); // Redirecionar para página de redefinir senha
      } else {
        setVerificationError('Código inválido. Por favor, tente novamente.');
        setVerificationCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
      setLoading(false);
    }, 1000);
  };

  const handleResendCode = () => {
    setVerificationCode(['', '', '', '', '', '']);
    setVerificationError('');
    // Simular reenvio do código
    alert('Código reenviado para seu email!');
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10">
            <img
              src="/logo_Full_Gradient_Light.png"
              alt="Krooa"
              className="h-20 w-auto"
            />
          </div>

          {!emailSent ? (
            <>
              {/* Título */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-krooa-dark">Esqueceu sua senha?</h2>
                <p className="text-gray-600 mt-2">
                  Não se preocupe, enviaremos instruções para redefinir sua senha.
                </p>
              </div>

              {/* Formulário */}
              <form onSubmit={handleResetPassword} className="space-y-6">
                <Input
                  label="E-mail"
                  value={email}
                  onChange={(value) => setEmail(value)}
                  validation="email"
                  required
                  fullWidth
                  icon={<Mail className="w-4 h-4" />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                  loading={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar instruções'}
                </Button>
              </form>

              {/* Link para voltar ao login */}
              <div className="mt-8 text-center">
                <Button
                  onClick={() => navigate('/login')}
                  variant="ghost"
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Voltar para o login
                </Button>
              </div>
            </>
          ) : !verificationStep ? (
            <>
              {/* Mensagem de sucesso do email */}
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Mail className="w-8 h-8 text-green-500" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-krooa-dark mb-4">E-mail enviado!</h2>
                <p className="text-gray-600 mb-8">
                  Enviamos um código de verificação para:
                  <br />
                  <span className="font-medium text-krooa-dark">{email}</span>
                </p>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setVerificationStep(true)}
                >
                  Inserir código de verificação
                </Button>

                <p className="text-sm text-gray-500 mt-6">
                  Não recebeu o e-mail? Verifique sua pasta de spam ou
                  <Button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-krooa-blue ml-1"
                  >
                    tente novamente
                  </Button>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Etapa de verificação 2FA */}
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
                    <Shield className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-krooa-dark mb-2 text-center">Verificação de segurança</h2>
                <p className="text-gray-600 mb-8 text-center">
                  Digite o código de 6 dígitos enviado para
                  <br />
                  <span className="font-medium text-krooa-dark">{email}</span>
                </p>

                {/* Campos de código */}
                <div className="flex justify-center gap-2 mb-6">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleVerificationChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={`
                        w-12 h-14 text-center text-xl font-semibold
                        border-2 rounded-lg transition-all
                        ${verificationError
                          ? 'border-red-500 bg-red-50'
                          : digit
                            ? 'border-krooa-green bg-green-50'
                            : 'border-gray-300 hover:border-krooa-blue focus:border-krooa-blue'
                        }
                        focus:outline-none focus:ring-2 focus:ring-krooa-blue/20
                      `}
                      disabled={loading}
                    />
                  ))}
                </div>

                {/* Mensagem de erro */}
                {verificationError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 text-center">{verificationError}</p>
                  </div>
                )}

                {/* Botões */}
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handleVerifyCode(verificationCode.join(''))}
                    disabled={verificationCode.some(digit => !digit) || loading}
                    loading={loading}
                  >
                    {loading ? 'Verificando...' : 'Verificar código'}
                  </Button>

                  <Button
                    onClick={handleResendCode}
                    variant="ghost"
                    fullWidth
                    disabled={loading}
                    className="text-krooa-blue"
                  >
                    Reenviar código
                  </Button>
                </div>

                {/* Link para voltar */}
                <div className="mt-8 text-center">
                  <Button
                    onClick={() => {
                      setVerificationStep(false);
                      setVerificationCode(['', '', '', '', '', '']);
                      setVerificationError('');
                    }}
                    variant="ghost"
                    icon={<ArrowLeft className="w-4 h-4" />}
                    className="text-gray-600"
                  >
                    Voltar
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Footer Mobile */}
          <div className="mt-8 text-center lg:hidden">
            <p className="text-gray-400 text-xs">
              © 2024 Krooa. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Lado Direito - Comunicação Visual (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-krooa-dark via-krooa-blue to-krooa-dark items-center justify-center p-12 relative overflow-hidden">
        {/* Padrão de fundo decorativo */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-krooa-green/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-krooa-blue/20 rounded-full blur-3xl"></div>
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 text-center max-w-lg">
          {/* Ícone */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-krooa-green/20 rounded-3xl mb-6">
              <svg className="w-12 h-12 text-krooa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>

          {/* Texto de destaque */}
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Segurança em primeiro lugar
          </h3>
          <p className="text-white/80 text-lg mb-8">
            Protegemos seus dados com os mais altos padrões de segurança do mercado.
          </p>

          {/* Features de segurança */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Criptografia de ponta a ponta</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Autenticação em dois fatores</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Backups automáticos diários</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Conformidade com LGPD</span>
            </div>
          </div>

          {/* Estatística */}
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-krooa-green text-3xl font-bold">99.9%</p>
                <p className="text-white/70 text-sm">Uptime garantido</p>
              </div>
              <div>
                <p className="text-krooa-green text-3xl font-bold">256-bit</p>
                <p className="text-white/70 text-sm">Criptografia SSL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Desktop */}
        <div className="absolute bottom-6 left-12 right-12 text-center">
          <p className="text-white/40 text-xs">
            © 2024 Krooa. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EsqueceuSenha;