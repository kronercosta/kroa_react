import { useState, useEffect, useCallback } from 'react';

export type LanguageCode = 'PT' | 'EN' | 'ES';

// Hook global para gerenciar o idioma da aplicação
export function useGlobalLanguage() {
  // Idioma independente da região - carregado do localStorage
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    const savedLanguage = localStorage.getItem('krooa_language') as LanguageCode;
    return savedLanguage && ['PT', 'EN', 'ES'].includes(savedLanguage) ? savedLanguage : 'PT';
  });

  // Função para mudar idioma e salvar no localStorage
  const changeLanguage = useCallback((language: LanguageCode) => {
    setCurrentLanguage(language);
    localStorage.setItem('krooa_language', language);

    // Disparar evento customizado para notificar outros componentes
    window.dispatchEvent(new CustomEvent('languageChange', { detail: language }));
  }, []);

  // Escutar mudanças de idioma de outros componentes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<LanguageCode>) => {
      setCurrentLanguage(event.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  return {
    currentLanguage,
    changeLanguage
  };
}