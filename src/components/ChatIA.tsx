'use client';

import React, { useState } from 'react';
import { Bot, XCircle, Send, Mic, MicOff } from 'lucide-react';
import { Button } from './ui/Button';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface ChatIAProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  generateResponse?: (message: string) => string;
  initialMessages?: ChatMessage[];
}

const ChatIA: React.FC<ChatIAProps> = ({
  isOpen,
  onClose,
  title = "Assistente IA do Histórico",
  subtitle = "Pergunte sobre o histórico clínico do paciente",
  generateResponse,
  initialMessages = []
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Olá! Sou a IA assistente do histórico clínico. Posso responder perguntas sobre o histórico do paciente, procedimentos realizados, medicações prescritas e muito mais. Como posso ajudar?',
      timestamp: new Date().toLocaleTimeString()
    },
    ...initialMessages
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);

    // Gerar resposta da IA
    if (generateResponse) {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateResponse(inputValue),
        timestamp: new Date().toLocaleTimeString()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
      }, 500);
    }

    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Aqui pode implementar a funcionalidade de gravação de voz
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header do Chat */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-xs text-gray-600">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Área de mensagens */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </div>
              </div>
              {message.type === 'user' && (
                <div className="p-2 bg-blue-600 rounded-full flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input do Chat */}
        <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre medicações, procedimentos, histórico..."
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 max-h-20"
              rows={1}
            />
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isRecording ? 'Parar gravação' : 'Gravar áudio'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              variant="primary"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatIA;