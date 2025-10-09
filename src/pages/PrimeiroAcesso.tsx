import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { ArrowLeft, Mail, Shield, Lock, CheckCircle, User } from 'lucide-react';
import { DocumentModal } from '../app/settings/collaborator/personal-data/DocumentModal';

const PrimeiroAcesso: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email') || '';

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Verificação, 2: Senha, 3: Termos, 4: Sucesso
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [verificationError, setVerificationError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [termsAccepted, setTermsAccepted] = useState({
    lgpd: false,
    responsibility: false
  });
  const [documentModal, setDocumentModal] = useState<{
    isOpen: boolean;
    document: any;
    type: 'lgpd' | 'responsibility' | null;
  }>({
    isOpen: false,
    document: null,
    type: null
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const cooldownInterval = useRef<number | null>(null);

  // Limpar interval ao desmontar componente
  useEffect(() => {
    return () => {
      if (cooldownInterval.current) {
        clearInterval(cooldownInterval.current);
      }
    };
  }, []);

  // Mock de documentos - normalmente viria da API
  const documents = {
    lgpd: {
      title: 'Termo de Consentimento LGPD',
      lastUpdated: 'Última atualização: 15 de Janeiro de 2024',
      sections: [
        {
          title: 'Coleta de Dados Pessoais',
          content: 'Coletamos apenas os dados necessários para o funcionamento do sistema e prestação dos serviços odontológicos.'
        },
        {
          title: 'Finalidade do Tratamento',
          content: 'Os dados são utilizados exclusivamente para gestão de pacientes, agendamentos e controle financeiro da clínica.'
        },
        {
          title: 'Seus Direitos',
          content: 'Você pode solicitar acesso, correção ou exclusão de seus dados pessoais a qualquer momento.'
        }
      ]
    },
    responsibility: {
      title: 'Termo de Responsabilidade do Colaborador',
      lastUpdated: 'Última atualização: 15 de Janeiro de 2024',
      sections: [
        {
          title: 'Confidencialidade',
          content: 'O colaborador se compromete a manter sigilo absoluto sobre informações de pacientes e dados da clínica.'
        },
        {
          title: 'Uso Adequado do Sistema',
          content: 'O sistema deve ser utilizado apenas para fins profissionais e de acordo com as permissões concedidas.'
        },
        {
          title: 'Responsabilidades',
          content: 'O colaborador é responsável por manter suas credenciais seguras e reportar qualquer uso inadequado.'
        }
      ]
    }
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
        setCurrentStep(2);
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
    setResendCooldown(60); // 60 segundos de cooldown

    // Simular reenvio do código
    console.log('Reenviando código para:', email);

    // Iniciar countdown
    cooldownInterval.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          if (cooldownInterval.current) {
            clearInterval(cooldownInterval.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSetPassword = () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    if (passwordData.password.length < 8) {
      alert('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    setCurrentStep(3);
  };

  const handleOpenDocument = (type: 'lgpd' | 'responsibility') => {
    setDocumentModal({
      isOpen: true,
      document: documents[type],
      type
    });
  };

  const handleAcceptDocument = () => {
    if (documentModal.type) {
      setTermsAccepted(prev => ({
        ...prev,
        [documentModal.type!]: true
      }));
    }
    setDocumentModal({ isOpen: false, document: null, type: null });
  };

  const handleFinishSetup = () => {
    if (!termsAccepted.lgpd || !termsAccepted.responsibility) {
      alert('Você deve aceitar todos os termos para continuar');
      return;
    }

    setLoading(true);
    // Simular finalização do setup
    setTimeout(() => {
      setCurrentStep(4);
      setLoading(false);
    }, 1500);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
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

            {/* Informação do email de destino */}
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Código enviado para: <span className="font-medium">{email}</span>
                </span>
              </div>
            </div>

            {/* Campos de código */}
            <div className="flex justify-center gap-2 mb-6">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
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

              {/* Botão de reenviar código */}
              <Button
                onClick={handleResendCode}
                variant="ghost"
                fullWidth
                disabled={loading || resendCooldown > 0}
                className="text-krooa-blue"
              >
                {resendCooldown > 0
                  ? `Reenviar código em ${resendCooldown}s`
                  : 'Reenviar código'
                }
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
                <Lock className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-krooa-dark mb-2 text-center">Defina sua senha</h2>
            <p className="text-gray-600 mb-8 text-center">
              Crie uma senha segura para acessar o sistema
            </p>

            <div className="space-y-6">
              <Input
                label="Nova senha"
                type="password"
                value={passwordData.password}
                onChange={(value) => setPasswordData(prev => ({ ...prev, password: value }))}
                required
                fullWidth
                icon={<Lock className="w-4 h-4" />}
              />

              <Input
                label="Confirmar senha"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(value) => setPasswordData(prev => ({ ...prev, confirmPassword: value }))}
                required
                fullWidth
                icon={<Lock className="w-4 h-4" />}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">Requisitos da senha:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Mínimo de 8 caracteres</li>
                  <li>• Ao menos uma letra maiúscula</li>
                  <li>• Ao menos um número</li>
                  <li>• Ao menos um caractere especial</li>
                </ul>
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={handleSetPassword}
                disabled={!passwordData.password || !passwordData.confirmPassword}
              >
                Definir senha
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4 mx-auto">
                <User className="w-8 h-8 text-amber-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-krooa-dark mb-2 text-center">Aceite dos Termos</h2>
            <p className="text-gray-600 mb-8 text-center">
              Para finalizar seu acesso, você deve aceitar os termos de uso
            </p>

            <div className="space-y-6">
              {/* LGPD */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-900">Consentimento LGPD</p>
                    <p className="text-sm text-gray-600">Autorização para tratamento de dados pessoais</p>
                  </div>
                  <Switch
                    checked={termsAccepted.lgpd}
                    onChange={(checked) => setTermsAccepted(prev => ({ ...prev, lgpd: checked }))}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDocument('lgpd')}
                  fullWidth
                >
                  Ler documento completo
                </Button>
              </div>

              {/* Termo de Responsabilidade */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-900">Termo de Responsabilidade</p>
                    <p className="text-sm text-gray-600">Compromisso com o uso adequado do sistema</p>
                  </div>
                  <Switch
                    checked={termsAccepted.responsibility}
                    onChange={(checked) => setTermsAccepted(prev => ({ ...prev, responsibility: checked }))}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDocument('responsibility')}
                  fullWidth
                >
                  Ler documento completo
                </Button>
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={handleFinishSetup}
                disabled={!termsAccepted.lgpd || !termsAccepted.responsibility || loading}
                loading={loading}
              >
                {loading ? 'Finalizando...' : 'Finalizar configuração'}
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-krooa-dark mb-4">Configuração concluída!</h2>
            <p className="text-gray-600 mb-8">
              Seu acesso foi configurado com sucesso. Agora você pode acessar o sistema.
            </p>

            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate('/login')}
            >
              Fazer login
            </Button>
          </div>
        );

      default:
        return null;
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

          {/* Progress indicator */}
          {currentStep < 4 && (
            <div className="mb-8">
              <div className="flex justify-center space-x-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-all ${
                      step <= currentStep
                        ? 'bg-krooa-green'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                Passo {currentStep} de 3
              </p>
            </div>
          )}

          {renderStep()}

          {/* Voltar button (exceto no último step) */}
          {currentStep > 1 && currentStep < 4 && (
            <div className="mt-8 text-center">
              <Button
                onClick={() => setCurrentStep(prev => prev - 1)}
                variant="ghost"
                icon={<ArrowLeft className="w-4 h-4" />}
                className="text-gray-600"
              >
                Voltar
              </Button>
            </div>
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
              <User className="w-12 h-12 text-krooa-green" />
            </div>
          </div>

          {/* Texto de destaque */}
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Bem-vindo ao Krooa
          </h3>
          <p className="text-white/80 text-lg mb-8">
            Configure seu primeiro acesso para começar a usar nossa plataforma odontológica.
          </p>

          {/* Features */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Gestão completa de pacientes</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Agendamento inteligente</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Controle financeiro avançado</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Relatórios em tempo real</span>
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

      {/* Modal de documentos */}
      <DocumentModal
        isOpen={documentModal.isOpen}
        onClose={() => setDocumentModal({ isOpen: false, document: null, type: null })}
        document={documentModal.document}
        onAccept={handleAcceptDocument}
        showAcceptButton={true}
      />
    </div>
  );
};

export default PrimeiroAcesso;