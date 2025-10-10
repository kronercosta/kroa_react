import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmailVerification } from '../components/ui/EmailVerification';
import { useRegion } from '../contexts/RegionContext';
import { ArrowLeft, Mail } from 'lucide-react';

const EsqueceuSenha: React.FC = () => {
  const navigate = useNavigate();
  const { currentRegion } = useRegion();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [resetPasswordStep, setResetPasswordStep] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular envio de email
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
    }, 1500);
  };

  const handleEmailVerified = () => {
    setResetPasswordStep(true);
  };

  // Password strength validation
  useEffect(() => {
    setPasswordStrength({
      hasLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    });
  }, [newPassword]);

  const validatePassword = () => {
    const errors: Record<string, string> = {};

    if (!newPassword) {
      errors.newPassword = 'Senha é obrigatória';
    } else if (!Object.values(passwordStrength).every(Boolean)) {
      errors.newPassword = 'Senha não atende aos requisitos';
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Senhas não coincidem';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResetPassword = () => {
    if (validatePassword()) {
      setLoading(true);
      // Simular chamada à API
      setTimeout(() => {
        setLoading(false);
        navigate('/login');
      }, 2000);
    }
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
              <form onSubmit={handleSendEmail} className="space-y-6">
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
          ) : resetPasswordStep ? (
            <>
              {/* Etapa de Redefinir Senha */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-krooa-dark">Criar nova senha</h2>
                <p className="text-gray-600">Digite sua nova senha</p>
              </div>

              <div className="space-y-4">
                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Senha"
                      mask="password"
                      value={newPassword}
                      onChange={(value) => setNewPassword(value)}
                      error={passwordErrors.newPassword}
                      required
                      fullWidth
                      showPasswordToggle={true}
                    />

                    {/* Password Requirements */}
                    {newPassword && (
                      <div className="mt-2 space-y-1">
                        <div className={`flex items-center gap-2 text-xs ${
                          passwordStrength.hasLength ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Mínimo de 8 caracteres
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${
                          passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Pelo menos 1 letra maiúscula
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${
                          passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Pelo menos 1 número
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${
                          passwordStrength.hasSpecial ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Pelo menos 1 caractere especial
                        </div>
                      </div>
                    )}
                  </div>

                  <Input
                    label="Confirmar senha"
                    mask="password"
                    value={confirmPassword}
                    onChange={(value) => setConfirmPassword(value)}
                    error={passwordErrors.confirmPassword}
                    required
                    fullWidth
                    showPasswordToggle={true}
                  />
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleResetPassword}
                  disabled={loading}
                  loading={loading}
                >
                  {loading ? 'Redefinindo...' : 'Redefinir senha'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <EmailVerification
                  email={email}
                  onVerified={handleEmailVerified}
                  onCancel={() => setVerificationStep(false)}
                  language={currentRegion === 'BR' ? 'pt' : currentRegion === 'US' ? 'en' : 'es'}
                  templateType="email-verification"
                  autoSendCode={false}
                />
              </div>

              {/* Link para voltar */}
              <div className="mt-8 text-center">
                <Button
                  onClick={() => setVerificationStep(false)}
                  variant="ghost"
                  icon={<ArrowLeft className="w-4 h-4" />}
                  className="text-gray-600"
                >
                  Voltar
                </Button>
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