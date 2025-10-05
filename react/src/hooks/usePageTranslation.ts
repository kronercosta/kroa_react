import { useState, useEffect, useCallback } from 'react';
import { useRegion } from '../contexts/RegionContext';

// Tipos de tradução
export type LanguageCode = 'PT' | 'EN' | 'ES';
export type RegionCode = 'BR' | 'US';

// Interface genérica para traduções de página
export interface PageTranslations {
  [key: string]: any;
}

// Cache para traduções já carregadas
const translationCache: Record<string, PageTranslations> = {};

// Configurações específicas por região
interface RegionConfig {
  responsibleDocument: {
    mask: string;
    validation: string;
    placeholder: string;
    required: boolean;
    secret: boolean;
  };
  taxId: {
    mask: string;
    validation: string;
    placeholder: string;
  };
  phone: {
    defaultCountry: string;
  };
}

const regionConfigs: Record<RegionCode, RegionConfig> = {
  BR: {
    responsibleDocument: {
      mask: 'cpf',
      validation: 'cpf',
      placeholder: 'XXX.XXX.XXX-XX',
      required: true,
      secret: false
    },
    taxId: {
      mask: 'cnpj',
      validation: 'cnpj',
      placeholder: '00.000.000/0000-00'
    },
    phone: {
      defaultCountry: 'BR'
    }
  },
  US: {
    responsibleDocument: {
      mask: 'ssn',
      validation: 'ssn',
      placeholder: 'XXX-XX-XXXX',
      required: false,
      secret: true
    },
    taxId: {
      mask: 'ein',
      validation: 'ein',
      placeholder: 'XX-XXXXXXX'
    },
    phone: {
      defaultCountry: 'US'
    }
  }
};

export function usePageTranslation(pageName: string) {
  const { currentRegion } = useRegion();

  // Idioma independente da região - carregado do localStorage
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    const savedLanguage = localStorage.getItem('krooa_language') as LanguageCode;
    return savedLanguage && ['PT', 'EN', 'ES'].includes(savedLanguage) ? savedLanguage : 'PT';
  });

  const [translations, setTranslations] = useState<PageTranslations>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar traduções de uma página específica
  const loadTranslations = useCallback(async (page: string, language: LanguageCode) => {
    const cacheKey = `${page}-${language}`;

    // Verificar cache primeiro
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    try {
      // Carregar o arquivo JSON da página
      const response = await import(`../translations/pages/${page}.json`);
      const pageTranslations = response.default[language] || response.default['PT']; // Fallback para PT

      // Salvar no cache
      translationCache[cacheKey] = pageTranslations;

      return pageTranslations;
    } catch (err) {
      console.error(`Erro ao carregar traduções para ${page}:`, err);
      throw new Error(`Traduções não encontradas para a página: ${page}`);
    }
  }, []);

  // Carregar traduções quando página ou idioma mudar
  useEffect(() => {
    const loadPageTranslations = async () => {
      try {
        setLoading(true);
        setError(null);

        const pageTranslations = await loadTranslations(pageName, currentLanguage);
        setTranslations(pageTranslations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        // Fallback para um objeto vazio em caso de erro
        setTranslations({});
      } finally {
        setLoading(false);
      }
    };

    loadPageTranslations();
  }, [pageName, currentLanguage, loadTranslations]);

  // Função para mudar idioma e salvar no localStorage
  const changeLanguage = useCallback((language: LanguageCode) => {
    setCurrentLanguage(language);
    localStorage.setItem('krooa_language', language);
  }, []);

  // Função helper para acessar traduções aninhadas
  const t = useCallback((key: string): string => {
    // Se ainda está carregando, retorna a chave
    if (loading || !translations || Object.keys(translations).length === 0) {
      return key;
    }

    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Chave de tradução não encontrada: ${key}`);
        return key; // Retorna a chave se não encontrar tradução
      }
    }

    return typeof value === 'string' ? value : key;
  }, [translations, loading]);

  // Função para obter labels adaptadas à região atual
  const getFieldLabels = useCallback(() => {
    if (currentRegion === 'BR') {
      // Brasil sempre usa CPF e CNPJ independente do idioma
      return {
        responsibleDocumentLabel: currentLanguage === 'PT' ? 'CPF do Responsável' :
                                 currentLanguage === 'EN' ? 'Responsible Person\'s CPF' :
                                 'CPF del Responsable',
        taxIdLabel: currentLanguage === 'PT' ? 'CNPJ' :
                   currentLanguage === 'EN' ? 'CNPJ (Tax ID)' :
                   'CNPJ (Número Fiscal)',
      };
    } else {
      // Estados Unidos usa SSN e EIN com traduções por idioma
      const fieldLabels = translations?.fieldLabels;
      if (fieldLabels && typeof fieldLabels === 'object') {
        return fieldLabels;
      }
      return {
        responsibleDocumentLabel: 'Social Security Number',
        taxIdLabel: 'EIN (Employer Identification Number)'
      };
    }
  }, [currentRegion, currentLanguage, translations]);

  const regionConfig = regionConfigs[currentRegion as RegionCode] || regionConfigs.BR;

  return {
    t,
    translations,
    loading,
    error,
    currentLanguage,
    changeLanguage,
    regionConfig,
    getFieldLabels,
    // Funções de conveniência para acessar seções específicas
    sections: translations.sections || {},
    buttons: translations.buttons || {},
    placeholders: translations.placeholders || {}
  };
}