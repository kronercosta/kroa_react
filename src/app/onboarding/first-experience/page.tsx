import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Logo } from '../../../components/Logo';
import { useTranslation } from '../../../hooks/useTranslation';
import translations from './translation.json';

export default function FirstExperiencePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(translations);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [chatStarted, setChatStarted] = useState(false);

  useEffect(() => {
    // Atualiza a mensagem inicial quando as traduções carregam
    if (t.chat?.initialQuestion) {
      setChatMessages([{
        id: 1,
        type: 'ai',
        content: t.chat.initialQuestion,
        timestamp: new Date()
      }]);
    }
  }, [t.chat?.initialQuestion]);

  useEffect(() => {
    // Simula o efeito de digitação por 3 segundos
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    // Marca que pulou o primeiro acesso
    const firstExperienceData = {
      completedFirstExperience: true,
      skippedAI: true,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('firstExperienceData', JSON.stringify(firstExperienceData));
    navigate('/dashboard');
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    // Marca que o chat começou (esconde a apresentação)
    setChatStarted(true);

    // Adiciona mensagem do usuário
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    // Simula resposta da IA (aqui integraria com API real)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: t.chat?.aiResponse || 'Perfeito! Vou te ajudar com isso. Que tal começarmos configurando sua clínica? 🏥\n\nPrimeiro, me fale um pouco sobre seu consultório:\n\n• Você já usa algum sistema de gestão?\n• Quantos profissionais trabalham na clínica?\n• Qual é a especialidade principal?\n\nCom essas informações, posso personalizar completamente sua experiência! 🎯',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-krooa-dark via-gray-900 to-krooa-dark">
        {/* Header com IA */}
        <header className="bg-krooa-dark/50 backdrop-blur-sm border-b border-krooa-blue/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Logo size="md" />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-krooa-green/20 to-krooa-blue/20 rounded-lg border border-krooa-green/40">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-white">Krooa IA Online</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSkip}
                  className="border-krooa-blue/50 text-gray-300 hover:bg-krooa-dark hover:border-krooa-green/50"
                >
                  Pular para sistema
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto p-6 h-[calc(100vh-4rem)]">
          <div className="bg-krooa-dark/50 backdrop-blur-sm rounded-2xl border border-krooa-blue/30 h-full flex flex-col overflow-hidden">

            {/* Chat Header */}
            <div className="p-6 border-b border-krooa-blue/30">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-krooa-blue via-krooa-green to-krooa-blue rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">🤖</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-krooa-green rounded-full border-2 border-krooa-dark"></div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Krooa IA</h2>
                  <p className="text-sm text-gray-400">Assistente de Migração e Configuração</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start gap-3 max-w-[80%]">
                    {message.type === 'ai' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-krooa-green to-krooa-blue rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                    )}

                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-krooa-green to-krooa-blue text-white ml-auto'
                          : 'bg-krooa-dark/50 text-gray-200 border border-krooa-blue/30'
                      }`}
                    >
                      <div className="prose prose-sm prose-invert max-w-none">
                        {message.content.split('\n').map((line, index) => {
                          if (line.startsWith('•') || line.startsWith('✨') || line.startsWith('🎯') || line.startsWith('📈') || line.startsWith('🤖')) {
                            return (
                              <div key={index} className="flex items-start gap-2 my-1">
                                <span className="text-krooa-green font-medium">{line}</span>
                              </div>
                            );
                          }
                          if (line.includes('**')) {
                            const parts = line.split('**');
                            return (
                              <p key={index} className="my-1">
                                {parts.map((part, i) =>
                                  i % 2 === 1 ? <strong key={i} className="text-krooa-green">{part}</strong> : part
                                )}
                              </p>
                            );
                          }
                          return line ? <p key={index} className="my-1">{line}</p> : <br key={index} />;
                        })}
                      </div>
                      <div className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">👤</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-krooa-blue/30">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua mensagem... (Enter para enviar)"
                    className="w-full p-4 bg-krooa-dark/50 border border-krooa-blue/40 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-krooa-green focus:border-transparent"
                    rows={2}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="bg-gradient-to-r from-krooa-green to-krooa-blue hover:from-krooa-green/90 hover:to-krooa-blue/90 border-0 px-6 py-4 h-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                <div className="w-2 h-2 bg-krooa-green rounded-full animate-pulse"></div>
                <span>IA está digitando...</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-krooa-green/5 relative overflow-hidden">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-krooa-green/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-krooa-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-krooa-green/3 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="text-gray-500 hover:text-krooa-blue px-4 py-2 text-sm"
            >
              {t.skipButton || 'Explorar o Sistema Sozinho'}
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="relative max-w-4xl mx-auto px-6 py-16">
          {!chatStarted ? (
            <div className="text-center mb-12">
              {/* Avatar da IA */}
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="w-full h-full bg-gradient-to-br from-krooa-blue via-krooa-green to-krooa-blue rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <span className="text-3xl">🤖</span>
                </div>
                {/* Pulse rings */}
                <div className="absolute inset-0 rounded-2xl border-2 border-krooa-green/30 animate-ping"></div>
                <div className="absolute inset-1 rounded-xl border-2 border-krooa-blue/40 animate-ping" style={{ animationDelay: '0.5s' }}></div>

                {/* Status online */}
                <div className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-white shadow-md px-2 py-1 rounded-full border border-gray-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-600">{t.aiStatus?.online || 'Online'}</span>
                </div>
              </div>

              {/* Título */}
              <h1 className="text-3xl font-bold text-krooa-dark mb-4">
                {t.greeting?.title || 'Olá Dr. João! Sou a'}{' '}
                <span className="bg-gradient-to-r from-krooa-green via-krooa-blue to-krooa-green bg-clip-text text-transparent">
                  Krooa IA
                </span>
              </h1>

              <p className="text-lg text-gray-700 mb-16 leading-relaxed max-w-2xl mx-auto">
                {t.greeting?.subtitle || 'Estou aqui para tornar sua Jornada de Sucesso simples e eficiente.'}
              </p>
            </div>
          ) : (
            /* Chat Messages Area */
            <div className="max-w-2xl mx-auto mb-8 space-y-4 pt-8">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start gap-3 max-w-[80%]">
                    {message.type === 'ai' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-krooa-green to-krooa-blue rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                    )}

                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-krooa-green to-krooa-blue text-white'
                          : 'bg-gray-50 text-gray-800 border border-gray-200'
                      }`}
                    >
                      <div className="text-sm leading-relaxed">
                        {message.content.split('\n').map((line, index) => {
                          if (line.startsWith('•') || line.startsWith('✨') || line.startsWith('🎯') || line.startsWith('📈') || line.startsWith('🤖')) {
                            return (
                              <div key={index} className="flex items-start gap-2 my-1">
                                <span className="text-krooa-green font-medium">{line}</span>
                              </div>
                            );
                          }
                          if (line.includes('**')) {
                            const parts = line.split('**');
                            return (
                              <p key={index} className="my-1">
                                {parts.map((part, i) =>
                                  i % 2 === 1 ? <strong key={i} className="text-krooa-green">{part}</strong> : part
                                )}
                              </p>
                            );
                          }
                          return line ? <p key={index} className="my-1">{line}</p> : <br key={index} />;
                        })}
                      </div>
                      <div className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">👤</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input fixo no bottom - WhatsApp Style */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 safe-area-bottom">
        <div className="max-w-2xl mx-auto">
          {/* AI Message Bubble above input - only show when chat hasn't started */}
          {!chatStarted && (
            <div className="mb-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-krooa-green to-krooa-blue rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                  {isTyping ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-500 text-xs">{t.aiStatus?.typing || 'Krooa IA está digitando...'}</span>
                    </div>
                  ) : (
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {t.chat?.initialQuestion || 'Conte-me um pouco sobre seu consultório... Já usa algum sistema de gestão?'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 h-[50px]">
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.chat?.placeholder || 'Digite sua resposta aqui...'}
              className="w-full py-3 px-4 pr-24 bg-transparent border-0 rounded-xl text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-0"
              rows={1}
              style={{ minHeight: '52px', maxHeight: '200px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = '52px';
                target.style.height = Math.min(target.scrollHeight, 200) + 'px';
              }}
            />

            {/* Controls */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                title="Enviar áudio"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>

              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentMessage.trim()
                    ? 'bg-gradient-to-r from-krooa-green to-krooa-blue text-white hover:from-krooa-green/90 hover:to-krooa-blue/90 shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}