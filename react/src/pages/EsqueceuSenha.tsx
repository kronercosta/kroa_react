import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input, EmailInput } from '../components/ui/Input';
import { ArrowLeft, Mail, Shield, Check, Eye, EyeOff } from 'lucide-react';

const EsqueceuSenha: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'code' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Simular envio de email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular API call
    setTimeout(() => {
      setLoading(false);
      setStep('code');
      // Iniciar timer para reenvio
      setResendTimer(60);
    }, 1500);
  };

  // Lidar com mudança no código
  const handleCodeChange = (index: number, value: string) => {
    // Se está colando um código completo
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];

      // Preencher todos os campos com o código colado
      pastedCode.forEach((digit, i) => {
        if (i < 6) {
          newCode[i] = digit;
        }
      });

      setCode(newCode);

      // Se o código tem 6 dígitos, verificar
      if (pastedCode.length === 6) {
        handleVerifyCode(newCode.join(''));
      }
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focar próximo campo
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Se todos os campos estão preenchidos, verificar código
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleVerifyCode(newCode.join(''));
    }
  };

  // Lidar com backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Verificar código
  const handleVerifyCode = async (fullCode: string) => {
    setLoading(true);

    // Simular verificação
    setTimeout(() => {
      setLoading(false);
      if (fullCode === '123456') { // Código mockado
        setStep('reset');
      } else {
        alert('Código inválido. Tente novamente.');
        setCode(['', '', '', '', '', '']);
        document.getElementById('code-0')?.focus();
      }
    }, 1000);
  };

  // Reenviar código
  const handleResendCode = () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResendTimer(60);
      alert('Código reenviado para seu email!');
    }, 1000);
  };

  // Timer para reenvio
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Redefinir senha
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (newPassword.length < 8) {
      alert('A senha deve ter no mínimo 8 caracteres!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      // Redirecionar após 3 segundos
      setTimeout(() => navigate('/login'), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header com logo e voltar */}
          <div className="mb-10">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Voltar ao login</span>
            </Link>

            <img
              src="/logo_Full_Gradient_Light.png"
              alt="Krooa"
              className="h-20 w-auto"
            />
          </div>

          {/* Step: Email */}
          {step === 'email' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-krooa-dark">Esqueceu sua senha?</h2>
                <p className="text-gray-600 mt-2">
                  Não se preocupe! Digite seu email e enviaremos um código de verificação.
                </p>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-4">
                <EmailInput
                  label="E-mail"
                  value={email}
                  onChange={setEmail}
                  required
                  fullWidth
                  floating
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading || !email}
                >
                  {loading ? 'Enviando...' : 'Enviar código'}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Verificação em duas etapas</p>
                    <p>Para sua segurança, enviaremos um código de 6 dígitos para seu email.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step: Código */}
          {step === 'code' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-krooa-dark">Verificação de segurança</h2>
                <p className="text-gray-600 mt-2">
                  Digite o código de 6 dígitos enviado para:
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">{email}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Código de verificação
                  </label>
                  <div className="flex gap-2 justify-center">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedData = e.clipboardData.getData('text');
                          handleCodeChange(0, pastedData);
                        }}
                        className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-krooa-green focus:ring-2 focus:ring-krooa-green/20 focus:outline-none"
                        disabled={loading}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Não recebeu o código?{' '}
                    <button
                      onClick={handleResendCode}
                      disabled={resendTimer > 0 || loading}
                      className={`font-medium ${
                        resendTimer > 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-krooa-blue hover:text-krooa-dark'
                      }`}
                    >
                      {resendTimer > 0 ? `Reenviar em ${resendTimer}s` : 'Reenviar código'}
                    </button>
                  </p>
                </div>

                {loading && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-krooa-green"></div>
                      <span>Verificando código...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Dica de segurança</p>
                    <p>Nunca compartilhe este código com ninguém. A equipe Krooa nunca solicitará seu código.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step: Nova Senha */}
          {step === 'reset' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-krooa-dark">Criar nova senha</h2>
                <p className="text-gray-600 mt-2">
                  Sua identidade foi verificada! Agora crie uma nova senha segura.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    label="Nova senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    fullWidth
                    floating
                    helperText="Mínimo de 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirmar senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    fullWidth
                    floating
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Requisitos da senha:</p>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 text-sm ${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className={`w-4 h-4 ${newPassword.length >= 8 ? 'opacity-100' : 'opacity-40'}`} />
                      <span>Mínimo 8 caracteres</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className={`w-4 h-4 ${/[A-Z]/.test(newPassword) ? 'opacity-100' : 'opacity-40'}`} />
                      <span>Uma letra maiúscula</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className={`w-4 h-4 ${/[0-9]/.test(newPassword) ? 'opacity-100' : 'opacity-40'}`} />
                      <span>Um número</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${/[!@#$%^&*]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className={`w-4 h-4 ${/[!@#$%^&*]/.test(newPassword) ? 'opacity-100' : 'opacity-40'}`} />
                      <span>Um caractere especial</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading || !newPassword || !confirmPassword}
                >
                  {loading ? 'Salvando...' : 'Redefinir senha'}
                </Button>
              </form>
            </>
          )}

          {/* Step: Sucesso */}
          {step === 'success' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-krooa-dark mb-3">
                Senha redefinida!
              </h2>
              <p className="text-gray-600 mb-8">
                Sua senha foi alterada com sucesso. Você será redirecionado para o login...
              </p>

              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/login')}
              >
                Ir para login
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Lado Direito - Visual (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-krooa-dark via-krooa-blue to-krooa-dark items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-krooa-green/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-krooa-blue/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-krooa-green/20 rounded-3xl mb-6">
              <Shield className="w-12 h-12 text-krooa-green" />
            </div>
          </div>

          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Sua segurança é nossa prioridade
          </h3>
          <p className="text-white/80 text-lg mb-8">
            Utilizamos verificação em duas etapas para garantir que apenas você tenha acesso à sua conta.
          </p>

          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Verificação por email</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Código de 6 dígitos único</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Expiração automática em 10 minutos</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Criptografia de ponta a ponta</span>
            </div>
          </div>
        </div>

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