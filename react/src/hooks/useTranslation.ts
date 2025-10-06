import { useState, useEffect } from 'react';
import { useRegion } from '../contexts/RegionContext';

// Definir os tipos de tradução
type LanguageCode = 'PT' | 'EN' | 'ES';
type RegionCode = 'BR' | 'US';

// Tipo genérico para traduções - permite qualquer estrutura JSON
type Translations = Record<string, any>;

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
      validation: 'none',
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

/**
 * Hook para carregar traduções de arquivos JSON locais por página
 * @param translationsObject - Objeto com traduções importadas do arquivo translation.json
 * @returns Objeto com traduções, configurações regionais e funções de controle
 *
 * Exemplo de uso:
 * import translations from './translation.json';
 * const { t, currentLanguage, changeLanguage } = useTranslation(translations);
 */
export function useTranslation(translationsObject?: Record<LanguageCode, Translations>) {
  const { currentRegion } = useRegion();

  // Idioma baseado na região por padrão, mas pode ser alterado independentemente
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    const savedLanguage = localStorage.getItem('krooa_language') as LanguageCode;
    if (savedLanguage && ['PT', 'EN', 'ES'].includes(savedLanguage)) {
      return savedLanguage;
    }
    // Se não há idioma salvo, usar baseado na região
    return currentRegion === 'US' ? 'EN' : 'PT';
  });

  const [translations, setTranslations] = useState<Translations>({});

  // Carregar traduções do objeto passado como parâmetro
  useEffect(() => {
    if (translationsObject && translationsObject[currentLanguage]) {
      setTranslations(translationsObject[currentLanguage]);
    }
  }, [translationsObject, currentLanguage]);

  // Atualizar idioma automaticamente quando a região mudar (apenas se não há preferência salva)
  useEffect(() => {
    const savedLanguage = localStorage.getItem('krooa_language');
    if (!savedLanguage) {
      const newLanguage = currentRegion === 'US' ? 'EN' : 'PT';
      if (newLanguage !== currentLanguage) {
        setCurrentLanguage(newLanguage);
      }
    }
  }, [currentRegion, currentLanguage]);

  // Função para mudar idioma e salvar no localStorage
  const changeLanguage = (language: LanguageCode) => {
    setCurrentLanguage(language);
    localStorage.setItem('krooa_language', language);
  };

  const regionConfig = regionConfigs[currentRegion as RegionCode] || regionConfigs.BR;

  // Função para obter labels adaptadas à região atual
  const getFieldLabels = () => {
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
      return translations.fieldLabels || {
        responsibleDocumentLabel: 'SSN',
        taxIdLabel: 'EIN'
      };
    }
  };

  return {
    t: translations,
    regionConfig,
    currentLanguage,
    changeLanguage,
    getFieldLabels
  };
}
