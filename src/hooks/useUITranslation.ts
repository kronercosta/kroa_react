import { useState, useEffect } from 'react';
import uiTranslations from '../translations/ui-components.json';

type LanguageCode = 'PT' | 'EN' | 'ES';

/**
 * Hook para traduções de componentes UI
 * Lê o idioma do localStorage e retorna as traduções
 */
export function useUITranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    const savedLanguage = localStorage.getItem('krooa_language') as LanguageCode;
    return savedLanguage && ['PT', 'EN', 'ES'].includes(savedLanguage) ? savedLanguage : 'PT';
  });

  const [translations, setTranslations] = useState<any>({});

  useEffect(() => {
    if (uiTranslations[currentLanguage]) {
      setTranslations(uiTranslations[currentLanguage]);
    }
  }, [currentLanguage]);

  // Escutar mudanças de idioma
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<LanguageCode>) => {
      setCurrentLanguage(event.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  return translations;
}
