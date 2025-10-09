import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, ChevronDown, CreditCard, Phone, MapPin, Check } from 'lucide-react';
import { useUITranslation } from '../../hooks/useUITranslation';

// Tipos de máscara expandidos
export type MaskType =
  | 'cpf' | 'cnpj' | 'phone' | 'internationalPhone' | 'cep' | 'date' | 'time'
  | 'currency' | 'percentage' | 'creditCard' | 'password' | 'addressNumber' | 'none';

export type ValidationType = 'email' | 'url' | 'number' | 'cpf' | 'cnpj' | 'phone' | 'creditCard' | 'none';

// Países com códigos e máscaras de telefone
const countries = [
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', phoneCode: '+55', mask: '(00) 00000-0000' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', phoneCode: '+1', mask: '(000) 000-0000' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', phoneCode: '+351', mask: '000 000 000' },
  { code: 'ES', name: 'Espanha', flag: '🇪🇸', phoneCode: '+34', mask: '000 00 00 00' },
  { code: 'FR', name: 'França', flag: '🇫🇷', phoneCode: '+33', mask: '0 00 00 00 00' },
  { code: 'DE', name: 'Alemanha', flag: '🇩🇪', phoneCode: '+49', mask: '000 00000000' },
  { code: 'IT', name: 'Itália', flag: '🇮🇹', phoneCode: '+39', mask: '000 000 0000' },
  { code: 'UK', name: 'Reino Unido', flag: '🇬🇧', phoneCode: '+44', mask: '0000 000000' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', phoneCode: '+54', mask: '00 0000-0000' },
  { code: 'MX', name: 'México', flag: '🇲🇽', phoneCode: '+52', mask: '00 0000 0000' },
  { code: 'JP', name: 'Japão', flag: '🇯🇵', phoneCode: '+81', mask: '00-0000-0000' },
  { code: 'CN', name: 'China', flag: '🇨🇳', phoneCode: '+86', mask: '000 0000 0000' },
];

// Bandeiras de cartão de crédito
const cardBrands = {
  visa: {
    pattern: /^4/,
    logo: '💳',
    name: 'Visa',
    color: 'text-blue-600'
  },
  mastercard: {
    pattern: /^5[1-5]/,
    logo: '💳',
    name: 'Mastercard',
    color: 'text-red-600'
  },
  amex: {
    pattern: /^3[47]/,
    logo: '💳',
    name: 'American Express',
    color: 'text-blue-500'
  },
  discover: {
    pattern: /^6(?:011|5)/,
    logo: '💳',
    name: 'Discover',
    color: 'text-orange-500'
  },
  diners: {
    pattern: /^3(?:0[0-5]|[68])/,
    logo: '💳',
    name: 'Diners Club',
    color: 'text-gray-700'
  },
  jcb: {
    pattern: /^(?:2131|1800|35)/,
    logo: '💳',
    name: 'JCB',
    color: 'text-green-600'
  },
  elo: {
    pattern: /^(636368|636369|438935|504175|451416|636297|5067|4576|4011)/,
    logo: '💳',
    name: 'Elo',
    color: 'text-yellow-600'
  },
};

interface EnhancedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  required?: boolean;
  mask?: MaskType;
  validation?: ValidationType;
  onChange?: (value: string, isValid?: boolean, extraData?: any) => void;
  onChangeEvent?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Props específicas para funcionalidades avançadas
  defaultCountry?: string; // Para telefone internacional
  showPasswordToggle?: boolean; // Para campo de senha
  allowNoNumber?: boolean; // Para número de endereço
  noNumberText?: string; // Texto para "sem número"
}

// Detectar bandeira do cartão
const detectCardBrand = (number: string) => {
  const cleaned = number.replace(/\D/g, '');
  for (const [brand, info] of Object.entries(cardBrands)) {
    if (info.pattern.test(cleaned)) {
      return { brand, ...info };
    }
  }
  return null;
};

// Aplicar máscara de telefone internacional
const applyInternationalPhoneMask = (value: string, country: typeof countries[0]) => {
  const cleaned = value.replace(/\D/g, '');
  let masked = '';
  let digitIndex = 0;

  for (let i = 0; i < country.mask.length && digitIndex < cleaned.length; i++) {
    if (country.mask[i] === '0') {
      masked += cleaned[digitIndex];
      digitIndex++;
    } else if (country.mask[i] !== ' ' && country.mask[i] !== '-' && country.mask[i] !== '(' && country.mask[i] !== ')') {
      masked += country.mask[i];
    } else {
      masked += country.mask[i];
    }
  }

  return masked;
};

// Funções de máscara existentes
const applyMask = (value: string, mask: MaskType, extraData?: any): string => {
  const cleaned = value.replace(/\D/g, '');

  switch (mask) {
    case 'cpf':
      return cleaned
        .slice(0, 11)
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2');

    case 'cnpj':
      return cleaned
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');

    case 'phone':
      if (cleaned.length <= 10) {
        return cleaned
          .replace(/^(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      }
      return cleaned
        .slice(0, 11)
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');

    case 'internationalPhone':
      if (extraData?.country) {
        return applyInternationalPhoneMask(value, extraData.country);
      }
      return value;

    case 'cep':
      return cleaned
        .slice(0, 8)
        .replace(/^(\d{5})(\d)/, '$1-$2');

    case 'date':
      return cleaned
        .slice(0, 8)
        .replace(/^(\d{2})(\d)/, '$1/$2')
        .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');

    case 'time':
      return cleaned
        .slice(0, 4)
        .replace(/^(\d{2})(\d)/, '$1:$2');

    case 'currency':
      const numericValue = cleaned.replace(/\D/g, '');
      const floatValue = parseFloat(numericValue) / 100;
      if (isNaN(floatValue)) return 'R$ 0,00';
      return floatValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

    case 'percentage':
      const percentValue = value.replace(/[^\d,]/g, '').replace(',', '.');
      const numValue = parseFloat(percentValue);
      if (isNaN(numValue)) return '';
      return Math.min(100, numValue).toString().replace('.', ',') + '%';

    case 'creditCard':
      return cleaned
        .slice(0, 16)
        .replace(/(\d{4})(?=\d)/g, '$1 ');

    case 'addressNumber':
      // Permite números e "S/N"
      if (extraData?.noNumber) return 'S/N';
      return value.replace(/\D/g, '');

    default:
      return value;
  }
};

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(({
  label,
  error,
  fullWidth = false,
  className = '',
  required = false,
  mask = 'none',
  validation = 'none',
  onChange,
  onChangeEvent,
  value,
  disabled = false,
  type = 'text',
  defaultCountry = 'BR',
  showPasswordToggle = true,
  allowNoNumber = false,
  noNumberText,
  ...props
}, ref) => {
  const uiTranslations = useUITranslation();
  const [internalValue, setInternalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // Estados específicos para funcionalidades avançadas
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find(c => c.code === defaultCountry) || countries[0]
  );
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [cardBrand, setCardBrand] = useState<any>(null);
  const [isNoNumber, setIsNoNumber] = useState(false);

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const displayValue = typeof value !== 'undefined' ? value : internalValue;
  const hasValue = displayValue && displayValue !== '' && displayValue !== 'S/N';

  // Detectar bandeira do cartão
  useEffect(() => {
    if (mask === 'creditCard' && displayValue) {
      const brand = detectCardBrand(displayValue as string);
      setCardBrand(brand);
    }
  }, [mask, displayValue]);

  // Fechar dropdown de país ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Aplicar máscara
    if (mask !== 'none' && mask !== 'password') {
      const extraData: any = {};
      if (mask === 'internationalPhone') {
        extraData.country = selectedCountry;
      }
      if (mask === 'addressNumber') {
        extraData.noNumber = isNoNumber;
      }
      newValue = applyMask(newValue, mask, extraData);
    }

    // Validar
    let valid = true;
    if (validation !== 'none' && newValue) {
      // Adicionar validação de cartão de crédito
      if (validation === 'creditCard') {
        const cleaned = newValue.replace(/\D/g, '');
        valid = cleaned.length >= 13 && cleaned.length <= 19;
      }
      // Adicionar validação de telefone
      if (validation === 'phone' || mask === 'internationalPhone') {
        const cleaned = newValue.replace(/\D/g, '');
        if (selectedCountry.code === 'BR') {
          // Validação para telefones brasileiros
          // Celular: 11 dígitos (DDD + 9 + 8 dígitos)
          // Fixo: 10 dígitos (DDD + 8 dígitos)
          valid = cleaned.length === 10 || cleaned.length === 11;

          // Validações mais específicas para Brasil
          if (cleaned.length >= 2) {
            const ddd = parseInt(cleaned.substring(0, 2));
            // DDDs válidos no Brasil (11 a 99, exceto alguns)
            const validDDDs = [11,12,13,14,15,16,17,18,19,21,22,24,27,28,31,32,33,34,35,37,38,41,42,43,44,45,46,47,48,49,51,53,54,55,61,62,63,64,65,66,67,68,69,71,73,74,75,77,79,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99];

            if (!validDDDs.includes(ddd)) {
              valid = false;
            }
          }

          if (cleaned.length === 11) {
            // Para celular, o terceiro dígito deve ser 9
            const thirdDigit = cleaned.charAt(2);
            if (thirdDigit !== '9') {
              valid = false;
            }
          }
        } else {
          // Validação básica para outros países
          valid = cleaned.length >= 7 && cleaned.length <= 15;
        }
      }
    }

    setInternalValue(newValue);
    setIsValid(valid);

    // Callback com dados extras
    const extraData: any = {};
    if (mask === 'internationalPhone') {
      extraData.country = selectedCountry;
      extraData.fullNumber = `${selectedCountry.phoneCode} ${newValue}`;
    }
    if (mask === 'creditCard' && cardBrand) {
      extraData.brand = cardBrand.brand;
    }

    onChange?.(newValue, valid, extraData);

    if (onChangeEvent) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: newValue
        }
      };
      onChangeEvent(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleNoNumberToggle = () => {
    const newNoNumber = !isNoNumber;
    setIsNoNumber(newNoNumber);

    if (newNoNumber) {
      const value = 'S/N';
      setInternalValue(value);
      onChange?.(value, true, { noNumber: true });
    } else {
      setInternalValue('');
      onChange?.('', true, { noNumber: false });
    }
  };

  // Determinar o tipo de input
  const inputType = mask === 'password' && !showPassword ? 'password' : 'text';

  // Renderização especial para telefone internacional
  if (mask === 'internationalPhone') {
    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        <div className="relative flex">
          {/* Seletor de país */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              disabled={disabled}
              className="flex items-center gap-1 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-2.5 h-10 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title={`${selectedCountry.name} ${selectedCountry.phoneCode}`}
            >
              <span className="text-lg">{selectedCountry.flag}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
            </button>

            {showCountryDropdown && (
              <div ref={countryDropdownRef} className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {countries.map(country => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(country);
                      setShowCountryDropdown(false);
                      setInternalValue('');
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1 text-left">{country.name}</span>
                    <span className="text-xs text-gray-500">{country.phoneCode}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input do telefone */}
          <div className="relative flex-1">
            <input
              ref={ref}
              type="tel"
              value={displayValue}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              placeholder=" "
              className={`
                peer w-full rounded-r-lg border border-gray-300 px-3 py-2 h-10
                focus:border-krooa-green focus:outline-none focus:ring-2 focus:ring-krooa-green/20
                disabled:bg-gray-50 disabled:text-gray-500
                ${error || !isValid ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
              `}
              {...props}
            />
            <label
              className={`
                absolute left-3 transition-all duration-200 pointer-events-none
                ${hasValue || isFocused
                  ? 'top-0 -translate-y-1/2 text-xs bg-white px-1'
                  : 'top-1/2 -translate-y-1/2 text-sm'
                }
                ${isFocused
                  ? 'text-blue-900'
                  : error || !isValid
                    ? 'text-red-500'
                    : 'text-gray-500'
                }
                peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-blue-900
              `}
            >
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          </div>
        </div>

        {/* Mensagem de erro */}
        {(error || (!isValid && !isFocused && hasValue)) && (
          <p className="mt-1 text-xs text-red-500">{error || uiTranslations?.enhancedInput?.invalidField || `${label || 'Campo'} inválido`}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <div className="relative">
        {/* Input principal */}
        <input
          ref={ref}
          type={inputType}
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled || (mask === 'addressNumber' && isNoNumber)}
          placeholder=" "
          className={`
            peer w-full h-10 rounded-lg border px-3 py-2 text-gray-900
            placeholder-transparent
            ${error || !isValid ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-krooa-green focus:ring-krooa-green/20'}
            focus:outline-none focus:ring-2
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${mask === 'creditCard' && cardBrand ? 'pr-16' : ''}
            ${mask === 'password' && showPasswordToggle ? 'pr-10' : ''}
            ${mask === 'addressNumber' && allowNoNumber ? 'pr-24' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Logo do cartão de crédito */}
        {mask === 'creditCard' && cardBrand && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className={`text-2xl ${cardBrand.color}`}>{cardBrand.logo}</span>
            <span className="text-xs text-gray-600">{cardBrand.name}</span>
          </div>
        )}

        {/* Toggle de visualizar senha */}
        {mask === 'password' && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {/* Checkbox "Sem número" */}
        {mask === 'addressNumber' && allowNoNumber && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={isNoNumber}
                onChange={handleNoNumberToggle}
                disabled={disabled}
                className="w-4 h-4 text-krooa-green rounded focus:ring-krooa-green"
              />
              <span className="text-gray-600">{noNumberText || uiTranslations?.enhancedInput?.noNumber || 'Sem número'}</span>
            </label>
          </div>
        )}

        {/* Label flutuante */}
        <label
          className={`
            absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1
            ${hasValue || isFocused
              ? 'top-0 -translate-y-1/2 text-xs'
              : 'top-1/2 -translate-y-1/2 text-sm'
            }
            ${isFocused
              ? 'text-blue-900'
              : error || !isValid
                ? 'text-red-500'
                : 'text-gray-500'
            }
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      </div>

      {/* Mensagem de erro */}
      {(error || (!isValid && !isFocused && hasValue)) && (
        <p className="mt-1 text-xs text-red-500">{error || uiTranslations?.enhancedInput?.invalidField || `${label || 'Campo'} inválido`}</p>
      )}
    </div>
  );
});

EnhancedInput.displayName = 'EnhancedInput';