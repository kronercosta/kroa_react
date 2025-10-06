import React, { createContext, useContext, useState } from 'react';

export type RegionType = 'BR' | 'US';

interface Currency {
  code: string;
  symbol: string;
  decimal: string;
  thousand: string;
  precision: number;
}

interface PricingPlan {
  name: string;
  basePrice: number;
  features: string[];
}

interface RegionConfig {
  region: RegionType;
  currency: Currency;
  dateFormat: string;
  phoneFormat: string;
  taxSystem: string;
  pricingPlans: PricingPlan[];
  features: {
    multiplasUnidades: boolean;
    centroCusto: boolean;
    nfse: boolean;
    insurance: boolean;
    hipaa: boolean;
  };
}

interface RegionContextData {
  currentRegion: RegionType;
  setRegion: (region: RegionType) => void;
  config: RegionConfig;
  formatCurrency: (value: number) => string;
  formatPhone: (phone: string) => string;
  formatDate: (date: Date) => string;
}

const RegionContext = createContext<RegionContextData | undefined>(undefined);

const regionConfigs: Record<RegionType, RegionConfig> = {
  BR: {
    region: 'BR',
    currency: {
      code: 'BRL',
      symbol: 'R$',
      decimal: ',',
      thousand: '.',
      precision: 2
    },
    dateFormat: 'DD/MM/YYYY',
    phoneFormat: '(##) #####-####',
    taxSystem: 'NFSe',
    pricingPlans: [
      {
        name: 'Básico',
        basePrice: 149.90,
        features: ['Até 2 profissionais', 'Agenda básica', 'Relatórios simples']
      },
      {
        name: 'Profissional',
        basePrice: 299.90,
        features: ['Até 5 profissionais', 'Agenda completa', 'Relatórios avançados', 'Centro de custo']
      },
      {
        name: 'Empresarial',
        basePrice: 599.90,
        features: ['Profissionais ilimitados', 'Múltiplas unidades', 'NFSe integrado', 'API completa']
      }
    ],
    features: {
      multiplasUnidades: true,
      centroCusto: true,
      nfse: true,
      insurance: false,
      hipaa: false
    }
  },
  US: {
    region: 'US',
    currency: {
      code: 'USD',
      symbol: '$',
      decimal: '.',
      thousand: ',',
      precision: 2
    },
    dateFormat: 'MM/DD/YYYY',
    phoneFormat: '(###) ###-####',
    taxSystem: 'Invoice',
    pricingPlans: [
      {
        name: 'Starter',
        basePrice: 49.00,
        features: ['Up to 2 providers', 'Basic scheduling', 'Simple reports']
      },
      {
        name: 'Professional',
        basePrice: 99.00,
        features: ['Up to 5 providers', 'Advanced scheduling', 'Detailed reports', 'Cost centers', 'Insurance billing']
      },
      {
        name: 'Enterprise',
        basePrice: 199.00,
        features: ['Unlimited providers', 'Multiple locations', 'HIPAA compliant', 'Full API access']
      }
    ],
    features: {
      multiplasUnidades: true,
      centroCusto: true,
      nfse: false,
      insurance: true,
      hipaa: true
    }
  }
};

export function RegionProvider({ children }: { children: React.ReactNode }) {
  // Busca região da variável de ambiente ou localStorage
  const envRegion = (import.meta.env.VITE_CLINIC_REGION || 'BR') as RegionType;
  const storedRegion = localStorage.getItem('krooa_region') as RegionType;

  // Se há variável de ambiente definida, dar prioridade sobre localStorage
  const initialRegion = envRegion && regionConfigs[envRegion] ? envRegion : (storedRegion || 'BR');

  // Limpar chave antiga e forçar uso da variável de ambiente se definida
  localStorage.removeItem('clinic_region'); // Remover chave antiga
  if (envRegion && envRegion !== storedRegion) {
    localStorage.setItem('krooa_region', envRegion);
  }

  const [currentRegion, setCurrentRegion] = useState<RegionType>(initialRegion);
  const [config, setConfig] = useState<RegionConfig>(regionConfigs[initialRegion]);

  // Garantir que config está sincronizado com currentRegion
  if (config.region !== currentRegion) {
    setConfig(regionConfigs[currentRegion]);
  }

  const setRegion = (region: RegionType) => {
    if (regionConfigs[region]) {
      setCurrentRegion(region);
      setConfig(regionConfigs[region]);
      localStorage.setItem('krooa_region', region);

      // Force page refresh to ensure all components update with new region
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const formatCurrency = (value: number): string => {
    const { symbol, decimal, thousand, precision } = config.currency;
    const formattedValue = value.toFixed(precision)
      .replace('.', decimal)
      .replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
    return `${symbol} ${formattedValue}`;
  };

  const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const format = config.phoneFormat;
    let formatted = '';
    let digitIndex = 0;

    for (let i = 0; i < format.length && digitIndex < cleaned.length; i++) {
      if (format[i] === '#') {
        formatted += cleaned[digitIndex];
        digitIndex++;
      } else {
        formatted += format[i];
      }
    }

    return formatted;
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return config.dateFormat
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year.toString());
  };

  return (
    <RegionContext.Provider value={{
      currentRegion,
      setRegion,
      config,
      formatCurrency,
      formatPhone,
      formatDate
    }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}