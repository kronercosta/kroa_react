import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular login
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Simular login com Google
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Formulário de Login */}
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

          {/* Título */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-krooa-dark">Bem-vindo de volta</h2>
            <p className="text-gray-600 mt-2">Entre com sua conta para continuar</p>
          </div>

          {/* Botão Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {googleLoading ? (
              <span className="text-gray-700">Conectando...</span>
            ) : (
              <>
                {/* Ícone do Google */}
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">Entrar com Google</span>
              </>
            )}
          </button>

          {/* Divisor */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou continue com email</span>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              floating
            />

            <Input
              type="password"
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              floating
            />

            <div className="flex justify-end">
              <a href="/esqueceu-senha" className="text-sm text-krooa-blue hover:text-krooa-dark font-medium">
                Esqueceu a senha?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Link de cadastro */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <a href="#" className="text-krooa-blue hover:text-krooa-dark font-semibold">
                Fale conosco
              </a>
            </p>
          </div>

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
          {/* Ícone ou Ilustração */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-krooa-green/20 rounded-3xl mb-6">
              <svg className="w-12 h-12 text-krooa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          {/* Texto de destaque */}
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Gerencie seu negócio com eficiência
          </h3>
          <p className="text-white/80 text-lg mb-8">
            Simplifique seus processos, aumente sua produtividade e tome decisões baseadas em dados reais.
          </p>

          {/* Features */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Gestão completa de vendas e CRM</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Controle financeiro integrado</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Relatórios e análises em tempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-krooa-green rounded-full"></div>
              <span className="text-white/90">Automação de processos</span>
            </div>
          </div>

          {/* Depoimento ou estatística */}
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
            <p className="text-white/90 italic mb-4">
              "O Krooa transformou completamente a gestão da nossa empresa. Agora temos controle total sobre todos os processos."
            </p>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-krooa-green rounded-full"></div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">João Silva</p>
                <p className="text-white/60 text-xs">CEO, TechCorp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Desktop - Movido para fora do container de conteúdo */}
        <div className="absolute bottom-6 left-12 right-12 text-center">
          <p className="text-white/40 text-xs">
            © 2024 Krooa. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;